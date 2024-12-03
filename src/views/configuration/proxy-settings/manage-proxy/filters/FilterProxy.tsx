import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { EProxyStatus, EProxyUsingFor, IProxyWorkspaceFilter } from '@/types/pim/proxy';
import { DropdownFilter, Input, SearchIcon } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

interface props {
  searchFilter: IProxyWorkspaceFilter;
  onChangeSearchInput: (keyword: string) => void;
  onHandleChangeUsingFor: (value: EProxyUsingFor) => void;
  onHandleChangeStatus: (value: EProxyStatus) => void;
  onHandleChangeOrigin: (value: string) => void;
}
export const FilterProxy = ({
  searchFilter,
  onChangeSearchInput,
  onHandleChangeUsingFor,
  onHandleChangeStatus,
  onHandleChangeOrigin,
}: props) => {
  const { t } = useTranslation(LocaleNamespace.Pim);
  const onChangeSearchKeyword = (val: React.ChangeEvent<HTMLInputElement>) => {
    const value = val.target.value;
    onChangeSearchInput(value);
  };
  const onClearInputSearch = () => {
    onChangeSearchInput('');
  };
  return (
    <div className="flex gap-6">
      <div className="w-[500px]">
        <Input
          icon={<SearchIcon />}
          size={32}
          className="w-[500px]"
          value={searchFilter.keyword}
          hiddenClose={!searchFilter.keyword}
          onClearData={onClearInputSearch}
          onChange={(value) => onChangeSearchKeyword(value)}
          placeholder={`${t('search')}...`}
        />
      </div>
      <div className="flex gap-3">
        <DropdownFilter
          name={t('country')}
          options={[
            {
              label: 'VN',
              value: 'VN',
            },
            {
              label: 'US',
              value: 'US',
            },
            {
              label: 'JP',
              value: 'JP',
            },
          ]}
          icon={<SvgIcon width={16} height={16} icon="icon-netword" />}
          onChange={(value) => onHandleChangeOrigin(value as string)}
        />
        <DropdownFilter
          options={[
            {
              label: t('proxyAndSetting.manageProxy.crawl'),
              value: EProxyUsingFor.Crawler,
            },
            {
              label: t('proxyAndSetting.manageProxy.bidding'),
              value: EProxyUsingFor.Bidding,
            },
            {
              label: t('proxyAndSetting.manageProxy.both'),
              value: EProxyUsingFor.Both,
            },
          ]}
          searchable={false}
          name={t('proxyAndSetting.manageProxy.usingFor')}
          icon={<SvgIcon icon="list-check-icon" height={16} width={16} />}
          onChange={(value) => onHandleChangeUsingFor(value as EProxyUsingFor)}
        />
        <DropdownFilter
          name={t('proxyAndSetting.manageProxy.status')}
          options={[
            {
              label: t('active'),
              value: EProxyStatus.Active,
            },
            {
              label: t('inactive'),
              value: EProxyStatus.DeActive,
            },
          ]}
          searchable={false}
          icon={<SvgIcon icon="status-icon-filter" height={16} width={16} />}
          onChange={(value) => onHandleChangeStatus(value as EProxyStatus)}
        />
      </div>
    </div>
  );
};
