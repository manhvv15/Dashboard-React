import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { ApiPaginationResponse } from '@/types/common';
import { TransactionHistoryItem } from '@/types/loyalty';
import { formatNumber } from '@/utils/common';

const CustomerInformation = ({
  transactionList,
}: {
  transactionList: AxiosResponse<ApiPaginationResponse<TransactionHistoryItem>> | undefined;
}) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const getValueOpeningBalance = (data: string) => {
    if (!data) {
      return '0';
    }
    return formatNumber(parseFloat(data?.split(';')[0]! ?? 0));
  };
  const getValueEndingBalance = (data: string) => {
    if (!data) {
      return '0';
    }
    const values = data?.split(';');
    return values.length > 1 ? formatNumber(parseFloat(values[1]! ?? 0)) : '';
  };
  const getValueTotalDeposit = (data: string) => {
    if (!data) {
      return '0';
    }
    const values = data?.split(';');
    return values.length > 1 ? formatNumber(parseFloat(values[2]! ?? 0)) : '';
  };
  const getValueTotalSpent = (data: string) => {
    if (!data) {
      return '0';
    }
    const values = data?.split(';');
    return values.length > 1 ? formatNumber(parseFloat(values[3]! ?? 0)) : '';
  };
  return (
    <div className="flex flex-row flex-wrap bg-ic-primary-1s mb-3 p-2">
      <div className="grow text-sm">
        <span className="text-gray-600">{customer('customer.transacion.detail.history.openingBalance')}: </span>
        <span className="ml-3 bg-primary-1 font-bold pr-8">
          {getValueOpeningBalance(transactionList?.data?.summary!)}
        </span>{' '}
      </div>
      <div className="grow text-sm">
        <span className="text-gray-600">{customer('customer.transacion.detail.history.deposit')}: </span>
        <span className="ml-3 bg-primary-1 font-bold pr-8">
          {getValueTotalDeposit(transactionList?.data?.summary!)}
        </span>{' '}
      </div>
      <div className="grow text-sm">
        <span className="text-gray-600">{customer('customer.transacion.detail.history.spent')}: </span>
        <span className="ml-3 bg-primary-1 font-bold pr-8">
          {getValueTotalSpent(transactionList?.data?.summary!)}
        </span>{' '}
      </div>
      <div className="grow text-sm">
        <span className="text-gray-600">{customer('customer.transacion.detail.history.endingBalance')}: </span>
        <span className="ml-3 bg-primary-1 font-bold">
          {getValueEndingBalance(transactionList?.data?.summary!)}
        </span>{' '}
      </div>
    </div>
  );
};
export default CustomerInformation;
