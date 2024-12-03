import { useState } from 'react';

import { LoadingOverlay, Tag, Tooltip } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { WORKSPACEBYLV1 } from '@/constants/variables/common';
import { detailTransaction } from '@/services/payment/transaction';
import { TransactionDetail } from '@/types/payment/transaction';
import { formatNumberByCurrency } from '@/utils/common';

import { PaymentTransactionStatusEnum } from '@/types/enums/transaction';
import GeneralInformation from './components/detail/general-information';
import TableTransactionDetail from './components/detail/grid/table-transaction-detail';
import WorkspaceInformation from './components/detail/workspace-information';

const DetailTransaction = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataDetailTransaction, setDetailTransaction] = useState<TransactionDetail>({} as TransactionDetail);
  const { isLoading } = useQuery({
    queryKey: ['getDetailTransaction', id],
    queryFn: () =>
      detailTransaction({
        workspaceId: WORKSPACEBYLV1,
        transactionId: id ?? '',
      }),
    enabled: !!id,
    onSuccess: (data) => {
      setDetailTransaction(data.data);
    },
  });
  const onBack = () => {
    navigate(-1);
  };
  const layoutHeader = (
    <div className="flex gap-2 items-center">
      <Link to="#" onClick={onBack}>
        <SvgIcon icon="back-black" />
      </Link>
      <span className="text-base font-medium leading-6 text-ic-ink-6s">
        {customer('customer.transaction.detail.title')}
      </span>
    </div>
  );
  const renderStatus = (status?: PaymentTransactionStatusEnum) => {
    const { t } = useTranslation(LocaleNamespace.Common);
    switch (status) {
      case PaymentTransactionStatusEnum.Completed:
        return (
          <Tag
            value={t('completed')}
            variant="success"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded text-ic-light bg-ic-green-6s"
          />
        );
      case PaymentTransactionStatusEnum.Canceled:
        return (
          <Tag
            value={t('canceled')}
            variant="error"
            className="border min-w-[90px] justify-center flex-1 border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-red-6s text-ic-light "
          />
        );
      case PaymentTransactionStatusEnum.Created:
        return (
          <Tag
            value={t('created')}
            variant="blue"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-blue-6s text-ic-light "
          />
        );
      case PaymentTransactionStatusEnum.Failed:
        return (
          <Tag
            value={t('failed')}
            variant="error"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-red-6s text-ic-light "
          />
        );
      case PaymentTransactionStatusEnum.Refunded:
        return (
          <Tag
            value={t('refunded')}
            variant="warning"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-orange-6s text-ic-light "
          />
        );
      default:
        break;
    }
  };
  return (
    <LoadingOverlay isLoading={isLoading} className="flex h-full">
      <LayoutSection label={layoutHeader}>
        <div className="py-2 px-[150px] flex flex-1 w-full h-full">
          <div className="bg-white px-6 rounded-lg w-full h-full flex flex-col flex-1">
            <div className="flex flex-row justify-between items-center py-4 border-b border-ic-ink-1s">
              <div className="flex items-center gap-2">
                <div className="flex flex-1">
                  <Tooltip content={dataDetailTransaction?.code}>
                    <div className="font-medium text-base leading-6 truncate overflow-hidden max-w-[500px] text-ic-ink-6s">
                      {dataDetailTransaction?.code}
                    </div>
                  </Tooltip>
                </div>
                {renderStatus(dataDetailTransaction?.status)}
              </div>
            </div>
            <div className="py-6 flex gap-6 flex-row w-full justify-between text-sm">
              <GeneralInformation dataDetailTransaction={dataDetailTransaction} key={dataDetailTransaction.id} />
              <WorkspaceInformation dataDetailTransaction={dataDetailTransaction} key={dataDetailTransaction.id} />
            </div>
            <div className="p-3 mb-6 bg-ic-light flex-col rounded-lg flex-1 flex gap-3 text-sm">
              <div className="font-medium">
                <span>{customer('customer.transaction.detail.title')}</span>
              </div>
              <div className="flex flex-col gap-3 h-full flex-1 bg-ic-light">
                <div className="flex flex-1 max-h-[270px] overflow-hidden flex-col">
                  <TableTransactionDetail
                    data={dataDetailTransaction?.invoices || []}
                    currency={dataDetailTransaction.currency}
                  />
                </div>
                <div className="flex flex-row justify-between border-t-ic-ink-5s">
                  <div></div>
                  <div className="flex flex-row flex-1 justify-end items-end gap-7">
                    <div className="flex text-sm flex-col">
                      <span className="font-medium flex justify-end">{`${common('total')}: `}</span>
                    </div>
                    <div className="flex justify-end flex-row pl-10 gap-4">
                      <div className="flex flex-col">
                        <div className="flex gap-4 flex-1 text-sm items-center font-medium justify-end">
                          <span>
                            {formatNumberByCurrency(dataDetailTransaction.amount, dataDetailTransaction.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3 rounded-lg p-3 flex gap-3 bg-ic-light flex-col">
              <div className="flex gap-2 items-center font-medium text-base leading-6">
                <div>
                  <SvgIcon icon="icon-note" height={24} width={24} />
                </div>
                <span>{common('note')}</span>
              </div>
              <div className="p-3 bg-white rounded-lg flex gap-2 text-sm text-ic-ink-6s">
                {dataDetailTransaction.refundReason ? (
                  <div className="flex">
                    <div>
                      <span className="mr-2 text-ic-ink-6s">•</span>
                    </div>
                    {dataDetailTransaction.refundReason && <span>{dataDetailTransaction.refundReason}</span>}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <SvgIcon icon="empty" width={40} height={40} className="flex items-center" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </LayoutSection>
    </LoadingOverlay>
  );
};
export default DetailTransaction;
