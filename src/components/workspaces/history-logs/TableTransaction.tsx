import { useMemo, useState } from 'react';

import {
  DataGrid,
  GridColumn,
  LoadingOverlay,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Pagination,
  Typography,
} from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import { getTransactionByWorkspace } from '@/services/payment/transaction';
import { MerchantAccountTypeEnum, TransactionTypeEnum } from '@/types/enums/transaction';
import { GetTransactionByWorkspaceRequest, GetTransactionWorkspaceResponse } from '@/types/payment/transaction';
import { exportEnum, formatDate, formatNumber, SetStatePropertyFunc } from '@/utils/common';
import { useNavigate } from 'react-router-dom';
import SvgIcon from '../../commons/SvgIcon';
interface IProp {
  workspaceId: string;
}
const TableTransaction = ({ workspaceId }: IProp) => {
  const navigate = useNavigate();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const listMethod = exportEnum(MerchantAccountTypeEnum);
  const listType = exportEnum(TransactionTypeEnum);
  const [params, setParams] = useState<GetTransactionByWorkspaceRequest>({
    pageNumber: 1,
    pageSize: 10,
    workspaceId: workspaceId,
  } as GetTransactionByWorkspaceRequest);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['getTransactionByWorkspace', params],
    queryFn: () => getTransactionByWorkspace(params),
    retry: true,
    enabled: !!params,
  });
  const filterHandler: SetStatePropertyFunc<GetTransactionByWorkspaceRequest> = (propertyName, value) => {
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
    navigate(`/customer/transactions/${id}/detail`);
  };
  const initColumns: GridColumn<GetTransactionWorkspaceResponse>[] = useMemo(
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
        headerName: common('transactionCode'),
        cellClass: 'flex',
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="flex flex-col justify-start">
              <div className="flex items-center cursor-pointer" onClick={() => onHandleClick(data.id)}>
                <span className="text-sm font-normal text-ic-primary-6s">{data.code}</span>
              </div>
              <p className="mt-1 text-sm font-normal text-ic-ink-6s">{formatDate({ time: data.createdAt })}</p>
            </div>
          );
        },
      },
      {
        headerName: common('type'),
        width: 250,
        cellRenderer: ({ data }) => {
          const findData = listType.find((i) => i.value === data.type)?.key;
          return (
            <Typography variant="14R" className="text-left text-ic-ink-6s">
              {findData}
            </Typography>
          );
        },
      },
      {
        headerName: common('referenceCode'),
        width: 250,
        cellRenderer: ({ data }) => {
          const multiData = data.referenceCode?.split(' ');

          if (!data.referenceCode) {
            return <p>-</p>;
          }
          if (multiData?.length > 1) {
            return (
              <Menu>
                <MenuHandler>
                  <button className="flex items-center justify-between">
                    <span>Multi</span>
                    <SvgIcon icon="arrow" width={20} height={20} className="ml-2" />
                  </button>
                </MenuHandler>
                <MenuList>{multiData?.map((i: string) => <MenuItem key={i}>{i}</MenuItem>)}</MenuList>
              </Menu>
            );
          }
          return (
            <div>
              <Typography variant="14R" className="flex items-center text-ic-ink-6s">
                <span>{data.referenceCode}</span>
              </Typography>
            </div>
          );
        },
      },
      {
        headerName: common('method'),
        width: 200,
        cellRenderer: ({ data }) => {
          const findData = listMethod.find((i) => i.value === data.paymentMethod)?.key;
          return (
            <Typography variant="14R" className=" text-ic-ink-6s">
              {findData}
            </Typography>
          );
        },
      },
      {
        headerName: common('paymentAccount'),
        width: 230,
        cellRenderer: ({ data }) => {
          if (data.receiveAccount)
            return (
              <Typography variant="14R" className=" text-ic-ink-6s">
                {data.receiveAccount}
              </Typography>
            );
          return <p>-</p>;
        },
      },
      {
        headerComponent: () => {
          return (
            <div className="flex w-full justify-end items-end text-end">
              <p>{common('amount')}</p>
            </div>
          );
        },
        width: 160,
        cellRenderer: ({ data }) => {
          return (
            <Typography variant="14R" className="text-right text-ic-ink-6s">
              {`${formatNumber(data.amount)} ${data.currency}`}
            </Typography>
          );
        },
      },
    ],
    [common],
  );

  return (
    <LoadingOverlay className="h-full w-full">
      <div className="w-full flex flex-col bg-ic-white-6s p-4 rounded-md">
        <DataGrid
          domLayout="autoHeight"
          rowHeight={58}
          rowKey={'id'}
          columnDefs={initColumns}
          rowData={transactions?.data.items}
          isLoading={isLoading}
        />

        <Pagination
          currentPage={params.pageNumber}
          setChangePage={handlePageChange}
          totalPage={transactions?.data.totalPages}
          totalRecords={transactions?.data.totalRecords}
          pageSize={params.pageSize}
          setChangePageSize={handleSizeChange}
        />
      </div>
    </LoadingOverlay>
  );
};

export default TableTransaction;
