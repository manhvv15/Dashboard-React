import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { LocaleNamespace } from '@/constants/enums/common';
import { getPaypal } from '@/services/payment-method';
import { MerchantAccountStatusEnum, MerchantAccountTypeEnum } from '@/types/payment-methods/enum';

import PaypalItem from './PaypalItem';

import ModalDeleteFromMyMethod from '../dialogs/ModalDeleteFromMyMethod';

export type FormValuePaypal = {
  paypal: {
    name: string;
    clientId: string;
    clientSecrect: string;
    paymentFeePercent?: string;
    paymentFeeFixed?: string;
    status?: boolean | null;
    isCollapse: boolean;
    isEdit: boolean;
    id?: string;
  }[];
};
const Paypals = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const [open, setOpen] = useState(false);

  const schema = yup.array().of(
    yup.object().shape({
      name: yup.string().required(error('fieldIsRequired')),
      clientId: yup.string().required(error('fieldIsRequired')),
      clientSecrect: yup.string().required(error('fieldIsRequired')),
      paymentFeePercent: yup.string().required(error('fieldIsRequired')),
      status: yup.boolean().notRequired().nullable(),
      isCollapse: yup.boolean(),
      id: yup.string().nullable().notRequired(),
    }),
  );

  const methods = useForm<FormValuePaypal>({
    mode: 'onBlur',
    resolver: yupResolver(yup.object().shape({ paypal: schema })),
  });

  const fieldArray = useFieldArray({
    name: 'paypal',
    control: methods.control,
  });

  useQuery({
    queryKey: ['getListPaypal'],
    queryFn: () => getPaypal(),
    onSuccess: (res) => {
      const listData = res.data.externalAccounts ?? [];

      const listAccount = listData.map((ite) => {
        return {
          id: ite.id,
          clientId: ite.clientId,
          clientSecrect: ite.clientSecrect,
          name: res.data.name,
          paymentFeePercent: String(ite.paymentFeePercent),
          paymentFeeFixed: String(ite.paymentFeeFixed),
          status: res.data.status === MerchantAccountStatusEnum.IntegrationSuccessfull,
          isCollapse: true,
          isEdit: true,
        };
      });

      fieldArray.replace(listAccount);
    },
  });

  const handleUpdateCollapse = (index: number) => {
    fieldArray.update(index, {
      ...methods.getValues(`paypal.${index}`),
      isCollapse: !methods.getValues(`paypal.${index}`).isCollapse,
    });
  };

  return (
    <div className="relative w-full h-full  flex flex-col">
      <div className="flex-1 flex flex-col gap-4">
        {fieldArray.fields.map((item, index) => {
          const onAction = () => {
            handleUpdateCollapse(index);
          };
          return (
            <PaypalItem key={item.id} index={index} item={item} methods={methods} handleUpdateCollapse={onAction} />
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-end w-full gap-x-4 border-t border-ic-ink-2s py-4">
        <Button onClick={() => setOpen(true)} color="danger" variant="filled">
          {common('removeFromMyMethod')}
        </Button>
      </div>
      <ModalDeleteFromMyMethod open={open} setOpen={setOpen} type={MerchantAccountTypeEnum.Paypal} />
    </div>
  );
};

export default Paypals;
