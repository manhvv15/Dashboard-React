import { useState } from 'react';

import { Tabs } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';

import LoyaltyTransactions from './transactions';
import LoyatiWallets from './wallets';

enum TabIndexEnum {
  overview,
  wallet,
  withDraw,
  transacion,
}
const ManagermentLoyalty = () => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const [tabIndex, setTabIndex] = useState<string | number>(TabIndexEnum.overview);

  const lableHeader = (
    <div className="flex gap-4 items-center ">
      <span className="text-base font-medium leading-6">{customer('customer.loyaty.wallet.title')}</span>
    </div>
  );
  const tabItems = [
    {
      label: customer('customer.loyalty.tab.overview'),
      value: TabIndexEnum.overview,
    },
    {
      label: customer('customer.loyalty.tab.wallet'),
      value: TabIndexEnum.wallet,
    },
    {
      label: customer('customer.loyalty.tab.withDraw'),
      value: TabIndexEnum.withDraw,
    },
    {
      label: customer('customer.loyalty.tab.transacion'),
      value: TabIndexEnum.transacion,
    },
  ];
  const onChangeTabs = (value: string | number) => {
    setTabIndex(value);
  };
  return (
    <LayoutSection label={lableHeader}>
      <div className="bg-white flex h-full flex-col rounded-lg">
        <div>
          <Tabs activeValue={tabIndex} items={tabItems} onChange={onChangeTabs} variant="14R" />
        </div>
        <div className="flex h-full flex-1">
          {tabIndex === TabIndexEnum.overview && <div></div>}

          {tabIndex === TabIndexEnum.wallet && <LoyatiWallets />}
          {tabIndex === TabIndexEnum.withDraw && <div></div>}
          {tabIndex === TabIndexEnum.transacion && <LoyaltyTransactions />}
        </div>
      </div>
    </LayoutSection>
  );
};
export default ManagermentLoyalty;
