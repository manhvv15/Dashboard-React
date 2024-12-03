import SvgIcon from '@/components/commons/SvgIcon';
import { initPageIndex } from '@/constants/bid';
import { LocaleNamespace } from '@/constants/enums/common';
import { useGetDropdownBidNick } from '@/hooks-query/bid';
import { GetDropdownBidNickResponse } from '@/types/bid';
import { cn, onlySpaces } from '@/utils/common';
import { Button, Checkbox, Input, LoadingOverlay, Menu, MenuHandler, MenuList } from '@ichiba/ichiba-core-ui';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

interface Props {
  onChange: (value?: string[]) => void;
  value?: string[];
  icon?: string;
}

export const BidNickFilter = ({ onChange, value, icon = 'nick' }: Props) => {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const ref = useRef<HTMLDivElement | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [list, setList] = useState<GetDropdownBidNickResponse[]>([]);
  const [pageIndex, setPageIndex] = useState(initPageIndex);

  const searchDebounce = useDebounce(searchKeyword);

  const { data: nicks, isLoading } = useGetDropdownBidNick({
    queryKey: [searchDebounce, pageIndex],
    queryParams: {
      pageIndex,
      pageSize: 5,
      keyword: searchDebounce,
    },
    onSuccess: (data) => {
      if (pageIndex === initPageIndex) {
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
    setPageIndex(initPageIndex);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setPageIndex(initPageIndex);
  };

  const handleChange = (selected: string) => {
    const isExisted = value?.includes(selected);
    if (isExisted) {
      const newValues = value?.filter((i) => i !== selected);
      onChange(newValues);
    } else {
      onChange([...(value ?? []), selected]);
    }
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    const { scrollHeight } = event.currentTarget;
    const { clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight === scrollHeight) {
      if (pageIndex < (nicks?.data.totalPages as number) - 1) {
        setPageIndex(pageIndex + 1);
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
          <SvgIcon icon={icon} width={16} height={16} />
          <span className="text-sm whitespace-nowrap">{bid('nick')}</span>
          <SvgIcon icon="arrow" width={24} height={24} />
        </Button>
      </MenuHandler>
      <MenuList className="w-[300px] z-50 py-3 px-4">
        <Input
          type="text"
          placeholder={common('search')}
          icon={<SvgIcon icon="search" />}
          onChange={handleSearch}
          onReset={handleClearSearch}
          value={searchKeyword}
        />
        <LoadingOverlay isLoading={isLoading}>
          <div ref={ref} className="scrollbar mt-2 max-h-[200px] overflow-y-scroll -mr-2" onScroll={handleScroll}>
            {list?.length > 0
              ? list.map((item, index) => {
                  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault();
                    handleChange(item);
                  };
                  return (
                    <div
                      key={index}
                      className="hover:bg-ic-ink-1s py-2 px-3 text-ic-ink-5s rounded-lg text-sm leading-5 font-normal w-full block whitespace-normal cursor-pointer"
                      onClick={handleClick}
                    >
                      <Checkbox
                        id={item}
                        type="checkbox"
                        value={item}
                        /** Prevent uncontrolled input error */
                        onChange={() => {}}
                        label={<p className="cursor-pointer">{item}</p>}
                        className="h-6 flex items-center w-full"
                        checked={value?.includes(item)}
                      />
                    </div>
                  );
                })
              : !isLoading && <p className="text-sm text-ic-ink-5s">{common('noResultsFound')}</p>}
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
