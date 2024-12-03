import { useMemo, useState } from 'react';

import { DataGrid, GridColumn, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';

import { getInvoicePagingByWorkspace } from '@/services/payment/invoice';
import { InvoiceTypeEnum, PaymentStatusEnum } from '@/types/enums/payment';
import { InvoicePagingRequest, InvoicePagingResponse } from '@/types/user-management/invoice';
import { formatDate, formatNumber, SetStatePropertyFunc } from '@/utils/common';
interface IProp {
  workspaceId: string;
}
const TableInvoices = ({ workspaceId }: IProp) => {
  const navigate = useNavigate();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const [params, setParams] = useState<InvoicePagingRequest>({
    pageNumber: 1,
    pageSize: 10,
  } as InvoicePagingRequest);
  const invoice = useQuery({
    queryKey: ['getInvoicePagingByWorkspace', params],
    queryFn: () =>
      getInvoicePagingByWorkspace({
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        keyword: params?.keyword,
        workspaceId: workspaceId,
        paymentStatus: params.paymentStatus,
        createdFrom: params.createdFrom,
        createdTo: params.createdTo,
        currencyCode: params.currencyCode,
        fromTotalAmount: params.fromTotalAmount,
        toTotalAmount: params.toTotalAmount,
        types: params.types,
      }),
    retry: true,
  });

  const filterHandler: SetStatePropertyFunc<InvoicePagingRequest> = (propertyName, value) => {
    setParams((prev) => ({
      ...prev,
      pageNumber: 1,
      [propertyName]: value,
    }));
  };

  const handlePageChange = (page: number) => {
    filterHandler('pageNumber', page);
  };

  const handleSizeChange = (size: number) => {
    filterHandler('pageSize', size);
  };

  const onHandleClick = (id: string) => {
    navigate(`/customer/invoices/${id}/detail`);
  };
  const renderInvoiceStatus = (status: PaymentStatusEnum) => {
    if (status === PaymentStatusEnum.Paid)
      return (
        <>
          <div className="rounded-3xl border border-ic-green-6s text-xs leading-5 font-normal text-ic-green-6s px-2 bg-ic-green-1s inline-block w-16 text-center justify-center h-fit">
            {common('paid')}
          </div>
        </>
      );
    return (
      <>
        <div className="rounded-3xl border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal text-ic-red-6s px-2 bg-ic-red-1s inline-block w-16 text-center  justify-center h-fit">
          {common('unpaid')}
        </div>
      </>
    );
  };
  const renderTypeTemplate = (type: InvoiceTypeEnum) => {
    switch (type) {
      case InvoiceTypeEnum.Subscription:
        return common('Subscription');
      case InvoiceTypeEnum.DepositPoint:
        return common('Point');
      case InvoiceTypeEnum.PayShipmentShip4p:
        return common('Shipment');
      default:
        return common('Subscription');
    }
  };

  const initColumns: GridColumn<InvoicePagingResponse>[] = useMemo(
    () => [
      {
        headerName: common('#'),
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        width: 50,
        cellRenderer: ({ node }) => {
          return (
            <div className="text-sm  font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center text-center">
              {node.childIndex + 1}
            </div>
          );
        },
      },
      {
        headerName: common('code'),
        cellClass: 'flex',
        width: 260,
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div
              className="text-sm font-normal text-ic-primary-6s h-full flex flex-col justify-center w-full cursor-pointer"
              aria-hidden="true"
              onClick={() => onHandleClick(data.id)}
            >
              {data.code}
            </div>
          );
        },
      },
      {
        headerName: common('type'),
        cellClass: 'flex',
        width: 200,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal  h-full flex flex-col justify-center w-full ">
              {renderTypeTemplate(data.type)}
            </div>
          );
        },
      },
      {
        headerName: common('amount'),
        width: 210,
        cellClass: 'flex',
        headerComponent: () => {
          return <div className="flex justify-end items-end w-full text-end">{common('amount')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center items-end w-full">
              {formatNumber(data.totalAmount)} {data.currencyCode}
            </div>
          );
        },
      },
      {
        headerName: common('date'),
        width: 210,
        cellClass: 'text-center',
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('date')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              <p>{formatDate({ time: data.createdAt, dateFormat: 'MM/dd/yyyy' })}</p>
            </div>
          );
        },
      },
      {
        headerName: common('status'),
        width: 150,
        cellClass: 'flex justify-center',
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('status')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="flex justify-center items-center h-full">{renderInvoiceStatus(data.paymentStatus)}</div>
          );
        },
      },
      // {
      //   headerName: common('action'),
      //   width: 80,
      //   headerComponent: () => {
      //     return <div className="flex justify-center items-center w-full text-center">{common('action')}</div>;
      //   },
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="flex items-center w-full justify-center">
      //         <div className="mx-3">
      //           <Menu placement="bottom-start">
      //             <MenuHandler>
      //               <Button color="stroke" variant="outlined" className="px-2 h-9">
      //                 <SvgIcon icon="dots-menu" width={24} height={24} />
      //               </Button>
      //             </MenuHandler>
      //             <MenuList>
      //               <MenuItem onClick={() => onHandleClick(data.id)}>
      //                 <div className="flex items-center">{common('detail')}</div>
      //               </MenuItem>
      //             </MenuList>
      //           </Menu>
      //         </div>
      //       </div>
      //     );
      //   },
      // },
    ],
    [common],
  );

  return (
    <LoadingOverlay className="h-full w-full" isLoading={invoice.isLoading}>
      <div className="w-full flex flex-col bg-ic-white-6s p-4 rounded-md">
        <DataGrid
          domLayout="autoHeight"
          rowHeight={58}
          rowKey={'id'}
          columnDefs={initColumns}
          rowData={invoice?.data?.data.items}
          isLoading={invoice.isLoading}
        />
        <Pagination
          currentPage={params.pageNumber}
          setChangePage={handlePageChange}
          totalPage={invoice.data?.data.totalPages}
          totalRecords={invoice.data?.data.totalRecords}
          pageSize={params.pageSize}
          setChangePageSize={handleSizeChange}
        />
      </div>
    </LoadingOverlay>
  );
};

export default TableInvoices;
