import { useState } from 'react';

import { LoadingOverlay, Tag, Tooltip } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { WORKSPACEBYLV1, dateFormat } from '@/constants/variables/common';
import { invoiceDetails } from '@/services/payment/invoice';
import { PaymentStatusEnum } from '@/types/enums/payment';
import { InvoiceDetail } from '@/types/payment/invoice';
import { formatDate, formatNumberByCurrency } from '@/utils/common';

import TableServices from './components/detail/table-services';
import WorkspaceInformation from './components/detail/workspace-information';

const CustomerInvoiceDetails = () => {
  const { id } = useParams();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const [dataDetailInvoice, setDataDetailInvoice] = useState<InvoiceDetail>();
  const navigate = useNavigate();
  const { data: detailInvoice, isLoading } = useQuery({
    queryKey: ['getDetailInvoice', id],
    queryFn: () =>
      invoiceDetails({
        invoiceIds: [id || ''],
        workspaceId: WORKSPACEBYLV1,
      }),
    onSuccess: (data) => {
      setDataDetailInvoice(data.data[0]);
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
      <div className="text-base font-medium leading-6 text-ic-ink-6s">{common('detailInvoice')}</div>
    </div>
  );
  const renderStatus = (status?: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.Paid:
        return (
          <Tag
            value={common('paid')}
            variant="success"
            className="border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded text-ic-light bg-ic-green-6s  w-max"
          />
        );
      case PaymentStatusEnum.Unpaid:
        return (
          <Tag
            value={common('notPaid')}
            variant="error"
            className="border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-red-6s text-ic-light w-max"
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
          <div className="bg-white rounded-lg px-6 pb-6 pt-3 w-full h-full flex flex-col">
            <div className="flex justify-between items-center py-4 border-b border-ic-ink-2s">
              <div className="flex items-center gap-2">
                <div className="flex flex-1">
                  <Tooltip content={detailInvoice?.data[0]?.code}>
                    <div className="font-medium text-base leading-6 truncate overflow-hidden max-w-[500px] text-ic-ink-6s">
                      {detailInvoice?.data[0]?.code}
                    </div>
                  </Tooltip>
                </div>
                {renderStatus(detailInvoice?.data[0]?.paymentStatus)}
              </div>
              <div className="text-sm leading-5 text-ic-ink-5s flex gap-1">
                <span>{common('createdAt')}</span>
                <span>
                  {formatDate({
                    time: detailInvoice?.data[0]?.createdAt,
                    dateFormat: dateFormat.MM_DD_YYYY_HH_mm,
                  })}
                </span>
              </div>
            </div>
            <div className="pt-6 flex gap-6 flex-1 flex-col overflow-hidden max-h-max">
              <WorkspaceInformation dataDetailInvoice={dataDetailInvoice} key={dataDetailInvoice?.id} />
              <div className="pl-2 flex gap-3 flex-1 overflow-hidden flex-col">
                <>
                  <TableServices
                    data={dataDetailInvoice?.items || []}
                    currency={dataDetailInvoice?.currencyCode || ''}
                  />
                  <div className="flex flex-row justify-between border-t-ic-ink-5s">
                    <div></div>
                    <div className="flex flex-row flex-1 justify-end items-end gap-7">
                      <div className="flex text-sm flex-col gap-3.5">
                        <span className="font-medium flex justify-end">{`${common('total')}: `}</span>
                        <span className="flex justify-end">{`${common('coint')}: `}</span>
                        <span className="flex justify-end">{`${common('paid')}: `}</span>
                      </div>
                      <div className="flex justify-end flex-row pl-10 gap-4 text-sm">
                        <div className="flex flex-col gap-3">
                          <div
                            className={clsx(
                              'text-sm items-center font-medium ',
                              dataDetailInvoice?.paidAmount ? 'flex gap-4 pr-10 flex-1 justify-end' : '',
                            )}
                          >
                            <span>
                              {formatNumberByCurrency(dataDetailInvoice?.totalAmount, dataDetailInvoice?.currencyCode)}
                            </span>
                          </div>
                          <div className="flex gap-4 pr-10 flex-1 text-sm items-center text-ic-primary-6s  justify-end">
                            <span>
                              {formatNumberByCurrency(
                                dataDetailInvoice?.paidCoinAmount,
                                dataDetailInvoice?.currencyCode,
                              )}
                            </span>
                          </div>
                          <div className="flex gap-4 flex-1 text-sm  items-center  justify-end">
                            <span className="text-ic-primary-6s">
                              {formatNumberByCurrency(dataDetailInvoice?.paidAmount, dataDetailInvoice?.currencyCode)}
                            </span>
                            {(dataDetailInvoice?.paidAmount || (dataDetailInvoice?.paidAmount ?? 0) > 0) && (
                              <Tooltip
                                content={customer('customer.invoice.detail.tootip.paid', {
                                  value: formatDate({
                                    time: dataDetailInvoice?.paymentDate || '',
                                    dateFormat: dateFormat.HH_mm_MM_DD_YYYY,
                                  }),
                                  bank: (dataDetailInvoice?.invoiceTransactions || [])[0]?.bankName,
                                })}
                              >
                                <div className="flex items-end h-full cursor-pointer">
                                  <SvgIcon icon="icon-tooltip" />
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </LayoutSection>
    </LoadingOverlay>
  );
};
export default CustomerInvoiceDetails;
