import { useGetBidCustomers } from '@/hooks-query/bid';
import workspace from '@/routes/workspace';
import { BidCustomerValueType, UserLV2 } from '@/types/bid/interface';
import { onlySpaces } from '@/utils/common';
import { InfiniteSelect } from '@ichiba/ichiba-core-ui';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

interface Props {
  onChange: (params?: BidCustomerValueType) => void;
  value?: BidCustomerValueType;
  className?: string;
  menuClassname?: string;
  placement?: any;
}

const initPageNumber = 0;

export const MappingNickDropdown = ({ onChange, value }: Props) => {
  const { t: bid } = useTranslation('bid');

  const [searchKeyword, setSearchKeyword] = useState('');
  const [list, setList] = useState<UserLV2[]>([
    {
      id: '5568def5-97e7-4d59-aa95-4a630c72af79',
      countryCode: 'VN',
      gender: 0,
      createdAt: '2024-09-12T01:30:13.368259Z',
      subscribeType: 0,
      userCodeGenerationDate: '',
      identification: false,
      code: '',
      fullName: 'trà bi gaming',
      email: 'huynhthanhtra1199@gmail.com',
      phoneNumber: '',
      prefixPhoneNumber: '',
      status: 0,
      userRanking: '',
      walletStatus: '',
      walletName: '',
      activedWalletDate: null,
      facebookLink: null,
      zaloLink: null,
      wechatLink: null,
      address: null,
      userGroupName: '',
      tagName: '',
      phoneNumberConfirmed: false,
      emailConfirmed: true,
      note: null,
      verification: false,
      workSpaceId: '',
      activeAt: null,
      receiveEmail: null,
      avatarUrl: null,
      activedAt: '',
    },
    {
      id: 'a8173cb4-fdb7-4b1c-935c-167523e9565d',
      countryCode: 'VN',
      gender: 0,
      createdAt: '2024-09-11T10:42:01.250879Z',
      subscribeType: 0,
      userCodeGenerationDate: '',
      identification: false,
      code: '',
      fullName: 'Ok Việt',
      email: 'okv93664@gmail.com',
      phoneNumber: '',
      prefixPhoneNumber: '',
      status: 0,
      userRanking: '',
      walletStatus: '',
      walletName: '',
      activedWalletDate: null,
      facebookLink: null,
      zaloLink: null,
      wechatLink: null,
      address: null,
      userGroupName: '',
      tagName: '',
      phoneNumberConfirmed: false,
      emailConfirmed: true,
      note: null,
      verification: false,
      workSpaceId: '',
      activeAt: null,
      receiveEmail: null,
      avatarUrl: null,
      activedAt: '',
    },
  ]);
  const [pageNumber, setPageNumber] = useState(initPageNumber);

  const searchDebounce = useDebounce(searchKeyword);

  useGetBidCustomers({
    queryKey: [pageNumber, searchDebounce, workspace],
    queryParams: {
      textSearch: searchKeyword,
      pageSize: 50,
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

  const handleChange = (val: BidCustomerValueType) => {
    if (val === value) {
      onChange(undefined);
      return;
    }
    onChange(val);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const selected = list?.find((o) => o.id === value?.value);

  return (
    <div className="w-full">
      <InfiniteSelect
        onChange={handleChange}
        onClear={handleClear}
        placeholder={bid('customer')}
        options={list.map((item) => {
          const displayLabel = [
            item.code,
            item.fullName,
            item.phoneNumber &&
              `${item.prefixPhoneNumber}${item.phoneNumber?.replace(item.prefixPhoneNumber, '')}`.replace('+', ''),
            item.email,
          ]
            .filter((x) => !!x)
            .join(' - ');
          return {
            label: displayLabel,
            value: item.id,
          };
        })}
        loadMoreItems={() => {
          setPageNumber(pageNumber + 1);
        }}
        inputProps={{
          onChange: handleSearch,
        }}
        optionLabel={(value) => {
          return (
            <>
              {value ? (
                <span className="flex-1 text-left truncate text-ic-ink-6s">
                  {value.label ??
                    (selected &&
                      [
                        selected.code,
                        selected.fullName,
                        selected.phoneNumber &&
                          `${selected.prefixPhoneNumber}${selected.phoneNumber?.replace(
                            selected.prefixPhoneNumber,
                            '',
                          )}`.replace('+', ''),
                        selected.email,
                      ]
                        .filter((x) => !!x)
                        .join(' - '))}
                </span>
              ) : (
                <span className="text-ic-ink-4s">{bid('customer')}</span>
              )}
            </>
          );
        }}
      />
    </div>
  );
};
