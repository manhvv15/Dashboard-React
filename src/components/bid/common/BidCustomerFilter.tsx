import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useGetBidCustomers } from '@/hooks-query/bid';
import { BidCustomerValueType, UserLV2 } from '@/types/bid/interface';
import { cn, onlySpaces } from '@/utils/common';
import { Button, Checkbox, Input, LoadingOverlay, Menu, MenuHandler, MenuList } from '@ichiba/ichiba-core-ui';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

interface Props {
  onChange: (params?: BidCustomerValueType) => void;
  value?: BidCustomerValueType;
  icon?: React.ReactNode;
}

const initPageNumber = 0;

export const BidCustomerFilter = ({ onChange, value, icon = 'customer' }: Props) => {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);

  const ref = useRef<HTMLDivElement | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [list, setList] = useState<UserLV2[]>([]);
  const [pageNumber, setPageNumber] = useState(initPageNumber);

  const searchDebounce = useDebounce(searchKeyword);

  const { data: user, isLoading } = useGetBidCustomers({
    queryKey: [pageNumber, searchDebounce],
    queryParams: {
      textSearch: searchKeyword,
      pageSize: 10,
      pageNumber,
    },
    onSuccess: (data) => {
      if (pageNumber === initPageNumber) {
        setList(data?.data?.items);
      } else {
        setList([...list, ...(data?.data?.items ?? [])]);
      }
    },
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    if (onlySpaces(keyword)) {
      setSearchKeyword('');
    } else {
      setSearchKeyword(keyword);
    }
    setPageNumber(initPageNumber);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setPageNumber(initPageNumber);
  };

  const handleChange = (selected: BidCustomerValueType) => {
    if (selected.value === value?.value) {
      onChange(undefined);
      return;
    }
    onChange(selected);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    const { scrollHeight } = event.currentTarget;
    const { clientHeight } = event.currentTarget;

    if (scrollTop + clientHeight === scrollHeight) {
      if (pageNumber < (user?.data.totalPages as number) - 1) {
        setPageNumber(pageNumber + 1);
      }
    }
  };

  useEffect(() => {
    ref.current?.scrollIntoView({
      block: 'end',
    });
  }, [list?.length]);

  return (
    <Menu>
      <MenuHandler className="flex justify-center items-center gap-2 hover:!bg-ic-ink-1s border border-ic-ink-2s !bg-white !text-ic-ink-6s !rounded-lg">
        <Button>
          {typeof icon === 'string' ? <SvgIcon icon={icon} width={16} height={16} /> : icon}
          <span className="self-center text-sm whitespace-nowrap">{bid('customer')}</span>
          <SvgIcon icon="arrow" width={24} height={24} />
        </Button>
      </MenuHandler>
      <MenuList className="w-[512px] z-50 py-3 px-4">
        <Input
          placeholder={bid('search')}
          icon={<SvgIcon icon="search" />}
          onChange={handleSearch}
          onReset={handleClearSearch}
          value={searchKeyword}
        />
        <LoadingOverlay isLoading={isLoading}>
          <div ref={ref} className="scroll mt-2 h-[200px] overflow-y-scroll -mr-2" onScroll={handleScroll}>
            {list?.length > 0
              ? list.map((item, index) => {
                  const displayLabel = [
                    item.code,
                    item.fullName,
                    item.phoneNumber &&
                      `${item.prefixPhoneNumber}${item.phoneNumber?.replace(item.prefixPhoneNumber, '')}`.replace(
                        '+',
                        '',
                      ),
                    item.email,
                  ]
                    .filter((x) => !!x)
                    .join(' - ');
                  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault();
                    handleChange({ label: displayLabel, value: item.id });
                  };
                  return (
                    <div
                      key={index}
                      className="flex items-center w-full h-10 px-3 text-sm font-normal leading-5 rounded-lg cursor-pointer hover:bg-ic-ink-1s text-ic-ink-5s"
                      onClick={handleClick}
                    >
                      <Checkbox
                        id={item.id}
                        type="radio"
                        value={item.id}
                        /** Prevent uncontrolled input error */
                        onChange={() => {}}
                        checked={value?.value === item.id}
                        label={
                          <p className="max-w-[440px] text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer">
                            {displayLabel}
                          </p>
                        }
                      />
                    </div>
                  );
                })
              : !isLoading && <p className="text-sm text-ic-ink-5s">{bid('noResultFound')}</p>}
          </div>
        </LoadingOverlay>

        <p
          className={cn(
            'mt-2 text-sm font-medium',
            value ? 'text-ic-primary-6s cursor-pointer' : 'text-ic-ink-5s cursor-default',
          )}
          onClick={handleClear}
        >
          {bid('clear')}
        </p>
      </MenuList>
    </Menu>
  );
};
