import { LoadingOverlay } from '@ichiba/ichiba-core-ui';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import LayoutSection from '@/components/layouts/layout-section';
import AllMethods from '@/components/paymentMethods/AllMethods';
import MyMethods from '@/components/paymentMethods/MyMethods';
import { LocaleNamespace } from '@/constants/enums/common';

const tabs = [
  {
    label: 'allMethods',
    value: 'all-methods',
  },
  {
    label: 'myMethods',
    value: 'my-methods',
  },
];

const PaymentMethods = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [tab, setTab] = useSearchParams({ tab: 'all-methods' });
  const getTab = tab.get('tab') ?? 'all-methods';
  const getType = tab.get('type');
  return (
    <LayoutSection label={common('paymentMethods')}>
      <LoadingOverlay className="w-full h-full p-2 flex justify-center">
        <div className="w-full h-full flex flex-col max-w-[1200px] bg-ic-white-6s">
          <div className="border-b border-ic-ink-2s">
            {tabs.map((i) => {
              return (
                <button
                  onClick={() => setTab({ tab: i.value, ...(getType && { type: getType }) })}
                  key={i.value}
                  className={clsx('text-sm font-normal leading-5 text-ic-ink-6s px-4 py-3', {
                    'text-ic-primary-6s border-b-2 border-ic-primary-6s': i.value === getTab,
                  })}
                >
                  {common(i.label)}
                </button>
              );
            })}
          </div>
          <div className="flex-1 h-full ">
            {getTab === 'all-methods' && <AllMethods />}
            {getTab === 'my-methods' && <MyMethods />}
          </div>
        </div>
      </LoadingOverlay>
    </LayoutSection>
  );
};
export default PaymentMethods;
