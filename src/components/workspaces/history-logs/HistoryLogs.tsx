import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import TableInvoices from './TableInvoices';
import TableTransaction from './TableTransaction';

const listTab = [
  { label: 'invoices', value: '1' },
  { label: 'transactions', value: '2' },
];
interface IProp {
  workspaceId: string;
}
const HistoryLogs = ({ workspaceId }: IProp) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const [tab, setTab] = useSearchParams({ tab: '1' });
  const getTab = tab.get('tab');

  const handleTab = (tab: string) => {
    setTab({ tab: tab });
  };

  const renderContent = () => {
    if (getTab === '1') {
      return <TableInvoices workspaceId={workspaceId} />;
    }
    return <TableTransaction workspaceId={workspaceId} />;
  };

  return (
    <div className="w-full py-2 flex  flex-col justify-center flex-1 h-full">
      <div className="flex font-medium justify-between my-2 text-sm">
        <div>{common('historyLogs')}</div>
      </div>
      <div className="w-full h-full flex flex-col">
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
        <div className="flex justify-center h-full w-full">
          <div className="w-full block">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default HistoryLogs;
