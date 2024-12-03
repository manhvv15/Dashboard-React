import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import LayoutSection from '@/components/layouts/layout-section';
import WrokspaceInformation from '@/components/workspaces/WorkspaceInformation';
import { LocaleNamespace } from '@/constants/enums/common';

const listTab = [
  { label: 'information', value: '1' },
  { label: 'subcriptions', value: '2' },
  { label: 'invoices', value: '3' },
  { label: 'transactions', value: '4' },
  { label: 'wallet', value: '5' },
  { label: 'markets', value: '6' },
  { label: 'customers', value: '7' },
];

const CustomerDetail = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const { id } = useParams();
  const [tab, setTab] = useSearchParams({ tab: '1' });
  const getTab = tab.get('tab');

  const handleTab = (input: string) => {
    setTab({ tab: input });
  };
  if (id == null) return;

  if (id === null) return <></>;
  const renderContent = () => {
    if (getTab === '1') {
      return (
        <>
          <WrokspaceInformation workspaceId={id}></WrokspaceInformation>
        </>
      );
    }
    if (getTab === '2') {
      return <div>Subcriptions</div>;
    }
    if (getTab === '3') {
      return <div>Invoices</div>;
    }
    if (getTab === '4') {
      return <div>Transactions</div>;
    }
    if (getTab === '5') {
      return <div>Wallet</div>;
    }
    if (getTab === '6') {
      return <div>Markets</div>;
    }
    if (getTab === '7') {
      return <div>Customers</div>;
    }
    return <div></div>;
  };

  return (
    <LayoutSection label={common('workspaces')}>
      <div className="w-full p-2 flex justify-center flex-1 h-full">
        <div className="w-full h-full flex flex-col ">
          <div className="bg-ic-white-6s rounded-lg overflow-hidden">
            {listTab.map((o) => {
              const onAction = () => {
                handleTab(o.value);
              };
              return (
                <button
                  onClick={onAction}
                  key={o.value}
                  className={clsx('px-4 py-3 text-sm font-normal text-ic-ink-6s', {
                    'text-ic-primary-6s font-medium border-b-2 border-ic-primary-6s': o.value === getTab,
                  })}
                >
                  {common(o.label)}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center h-full w-full">
            <div className="w-full  block">{renderContent()}</div>
          </div>
        </div>
      </div>
    </LayoutSection>
  );
};

export default CustomerDetail;
