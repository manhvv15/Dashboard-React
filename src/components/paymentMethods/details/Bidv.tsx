import { useState } from 'react';

import { Button, Switch } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { getBidvs, updateStatusMerchantAccount } from '@/services/payment-method';
import { PaymentMethodEnum } from '@/types/enums/payment';
import { MerchantAccountStatusEnum, MerchantAccountTypeEnum } from '@/types/payment-methods/enum';
import { BidvDetail } from '@/types/payment-methods/payment-method';
import { showToast } from '@/utils/toasts';

import ModalAddBidv from '../dialogs/ModalAddBidv';
import ModalBidvQR from '../dialogs/ModalBidvQR';
import ModalDeleteFromMyMethod from '../dialogs/ModalDeleteFromMyMethod';
import ModalEditAccountBidv from '../dialogs/ModalEditAccountBidv';

const Bidv = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const [open, setOpen] = useState(false);

  const [checkStatus, setCheckStatus] = useState<MerchantAccountStatusEnum>(MerchantAccountStatusEnum.None);

  const [addAccount, setAddAccount] = useState<boolean>(false);

  const [modalOverviewQR, setModalOverviewQR] = useState(false);

  const [modalEditAccount, setModalEditAccount] = useState(false);

  const [infoBankAccount, setInfoBankAccount] = useState<{
    accountNumber: string;
    accountHolder: string;
    bin: string;
  } | null>(null);

  const [editBankAccount, setEditBankAccount] = useState<BidvDetail | null>(null);

  const { data: getBankAccount, refetch } = useQuery({
    queryKey: ['getBidvs'],
    queryFn: () => getBidvs(),
    onSuccess: (res) => {
      if (!res.data.bankAccounts.length) {
        setCheckStatus(MerchantAccountStatusEnum.None);
        return;
      }
      setCheckStatus(res.data.status);
    },
    onError: () => {
      setCheckStatus(MerchantAccountStatusEnum.None);
    },
  });

  const updateStatusMerchantAccountMutation = useMutation({
    mutationFn: updateStatusMerchantAccount,
    onSuccess: () => {
      refetch();
      showToast({
        type: 'success',
        summary: common('updateSuccess'),
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('updateFailed'),
      });
    },
  });

  const onUpdateStatusMerchantAccount = () => {
    updateStatusMerchantAccountMutation.mutate({
      isActive: !(checkStatus === MerchantAccountStatusEnum.IntegrationSuccessfull),
      type: PaymentMethodEnum.BIDV,
    });
  };

  const handleOpenModal = () => {
    setAddAccount(true);
  };

  const onOpenModalOverviewQR = (accountNumber: string, accountHolder: string, bin: string) => {
    setInfoBankAccount({ accountNumber, accountHolder, bin });
    setModalOverviewQR(true);
  };

  const onOpenModalEditAccount = (item: BidvDetail) => {
    setEditBankAccount(item);
    setModalEditAccount(true);
  };

  return (
    <div className="relative w-full h-full ">
      <div className="rounded-xl p-6 border border-ic-ink-2s w-full">
        <div className="flex items-center justify-between">
          <p className="text-lg font-normal leading-6 text-ic-ink-6s"></p>
          <div className="flex items-center gap-x-2">
            <span className="text-base font-normal leading-6 text-ic-ink-6s">{common('activeStatus')}</span>
            <Switch
              onChange={onUpdateStatusMerchantAccount}
              checked={checkStatus === MerchantAccountStatusEnum.IntegrationSuccessfull}
            />
          </div>
        </div>
        <div className="mt-4">{/* <FormLabel required>{common('market')}</FormLabel> */}</div>
        <div className="mt-4">
          <table className="w-full">
            <tr className="border-b border-ic-ink-2s bg-ic-light">
              <th className="text-left p-2 text-sm font-medium leading-5 text-ic-ink-6s">{common('virtualAccount')}</th>
              <th className="w-28 p-2">
                <div className="text-sm  font-medium leading-5 text-ic-ink-6s border-l border-ic-ink-2s">
                  {common('action')}
                </div>
              </th>
            </tr>
            {getBankAccount?.data.bankAccounts.map((item) => {
              const action = () => {
                onOpenModalOverviewQR(item.accountNumber, item.accountHolder, item.bin);
              };
              const onEdit = () => {
                onOpenModalEditAccount(item);
              };
              return (
                <tr key={item.id} className={clsx('border-b border-ic-ink-1s')}>
                  <td className="p-2 flex items-center justify-between">
                    <div className="mt-2">
                      <div className="flex items-center text-sm font-bold leading-5 text-ic-ink-6s">
                        <p>{`${common('virtualAccount')}:`}</p>
                        <p className="ml-1">{`${item.virtualAccount}`}</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-bold leading-5 text-ic-ink-6s">{`${common('bankName')}:`}</p>
                        <p className="ml-1 text-sm font-normal leading-5 text-ic-ink-6s">{`${item.bankShortName} - ${item.accountNumber} - ${item.accountHolder}`}</p>
                      </div>
                    </div>
                    {item.isDefault && (
                      <div className="font-normal text-xs leading-4 text-ic-blue-7s py-[2px] px-2 rounded bg-ic-blue-2s ml-2">
                        {common('default')}
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex mt-2 justify-center items-center border-l border-ic-ink-2s">
                      <button onClick={action}>
                        <SvgIcon icon="qr-code" width={20} height={20} className="text-ic-ink-6s" />
                      </button>
                      <div className="h-3 w-[1px] bg-ic-ink-6s mx-2" />
                      <button onClick={onEdit}>
                        <SvgIcon icon="settings" width={20} height={20} className="text-ic-ink-6s" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </table>

          <div className="flex justify-end">
            <Button onClick={handleOpenModal} className="mt-4 ml-3">
              <SvgIcon icon="plus" width={20} height={20} />
              <p className="ml-2">{common('createBIDV')}</p>
            </Button>
          </div>
          <div className="my-4 bg-ic-ink-2s w-full h-[1px]"></div>
          <div className="text-base font-normal leading-6 text-ic-ink-5s flex items-center">
            <p>{common('agreeToTerms')}</p>
            <Link to={'#'} className="text-ic-primary-6s ml-1">
              {common('termOfServices')}
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex items-center justify-end w-full gap-x-4 border-t border-ic-ink-2s py-4">
        <Button onClick={() => setOpen(true)} color="danger" variant="filled">
          {common('removeFromMyMethod')}
        </Button>
        <Button className="px-10">{common('save')}</Button>
      </div>
      <ModalDeleteFromMyMethod open={open} setOpen={setOpen} type={MerchantAccountTypeEnum.BIDV} />
      <ModalAddBidv open={addAccount} setOpen={setAddAccount} />
      <ModalBidvQR
        open={modalOverviewQR}
        setOpen={setModalOverviewQR}
        accountHolder={infoBankAccount?.accountHolder as string}
        accountNumber={infoBankAccount?.accountNumber as string}
        bin={infoBankAccount?.bin as string}
      />
      <ModalEditAccountBidv
        visible={modalEditAccount}
        onClose={setModalEditAccount}
        length={getBankAccount?.data.bankAccounts.length}
        bankAccount={editBankAccount}
      />
    </div>
  );
};

export default Bidv;
