import { EditNickForm } from '@/components/bid';
import SvgIcon from '@/components/commons/SvgIcon';
import BidLayout from '@/components/layouts/bid-layout/BidLayout';
import { MAX_LENGTH_100 } from '@/constants/bid';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { createBiddingAccount } from '@/services/bid';
import { CreateBiddingAccountRequest, EditNickFormType } from '@/types/bid/interface';
import { responseErrorCode } from '@/utils/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const fieldMapping: {
  [K: string]: keyof EditNickFormType;
} = {
  type: 'source',
  alias: 'alias',
  username: 'nickBid',
  password: 'password',
  cookie: 'cookie',
  buyer: 'customer',
  isAllowBid: 'isAllowBid',
  note: 'note',
  isTax: 'isTax',
  isNoTax: 'isNoTax',
  proxyHost: 'proxyHost',
  proxyPort: 'proxyPort',
  proxyusername: 'proxyUsername',
  proxypassword: 'proxyPassword',
  isActive: 'isActive',
};

function Index() {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const { t: common } = useTranslation(LocaleNamespace.Bid);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const { showToast } = useApp();

  const methods = useForm<EditNickFormType>({
    mode: 'onBlur',
    defaultValues: {
      isActive: true,
      isAllowBid: true,
      isTax: true,
      isNoTax: false,
    },
    resolver: yupResolver(
      yup.object().shape(
        {
          source: yup.string().required(error('required')),
          nickBid: yup.string().required(error('required')).max(MAX_LENGTH_100, error('minLength1MaxLength100')),
          alias: yup.string().required(error('required')).max(MAX_LENGTH_100, error('minLength1MaxLength100')),
          password: yup.string().required(error('required')),
          proxyWorkspaceId: yup.string().required(error('required')),
          cookie: yup
            .string()
            .required(error('required'))
            .test('JSON-format', error('cookiesIsInvalidFormat'), (value) => {
              try {
                if (!value) {
                  return false;
                }
                JSON.parse(value);
                return true;
              } catch (err) {
                return false;
              }
            }),
          isTax: yup.boolean().when('isNoTax', {
            is: false,
            then: yup.boolean().when({
              is: false,
              then: yup.boolean().oneOf([true], error('mustChooseAtLeastOneOptionInTaxSetting')),
            }),
          }),
          isNoTax: yup.boolean().when('isTax', {
            is: false,
            then: yup.boolean().oneOf([true], error('mustChooseAtLeastOneOptionInTaxSetting')),
          }),
        },
        [['isTax', 'isNoTax']],
      ),
    ),
  });
  const createAccount = useMutation({
    mutationFn: createBiddingAccount,
  });
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/configuration/bid-and-offer/setting/manage-nick');
  };
  const handleSave = (data: EditNickFormType) => {
    const payload: CreateBiddingAccountRequest = {
      type: data.source,
      alias: data.alias,
      username: data.nickBid,
      password: data.password,
      cookie: data.cookie,
      isAllowBid: data.isAllowBid,
      note: data.note,
      isTax: data.isTax,
      isNoTax: data.isNoTax,
      buyer: data.customer?.value || null,
      proxyHost: data.proxyHost || null,
      proxyPort: data.proxyPort ? +data.proxyPort.replaceAll(',', '') : null,
      Proxyusername: data.proxyUsername || null,
      Proxypassword: data.proxyPassword || null,
      proxyWorkspaceId: data?.proxyWorkspaceId ?? '',
      isActive: data.isActive,
      isAutoGetSuccessfulBid: data.isAutoGetSuccessfulBid,
    };
    createAccount.mutate(
      { data: payload },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: bid('addNickSuccessfully'),
          });
          navigate('/configuration/bid-and-offer/setting/manage-nick');
        },
        onError: (err: any) => {
          const { errorFrom, errorNormal } = err;
          if (errorFrom) {
            responseErrorCode(errorFrom).forEach(
              ({ name, message, type }: { name: string; message: string; type: string }) => {
                if (fieldMapping[name]) {
                  methods.setError(fieldMapping[name] as any, {
                    type,
                    message: error(message),
                  });
                }
              },
            );
          }
          if (errorNormal) {
            showToast({
              type: 'error',
              summary: error(errorNormal),
            });
          }
        },
      },
    );
  };

  return (
    <BidLayout
      left={
        <div className="flex gap-2">
          <div className="cursor-pointer" onClick={handleCancel}>
            <SvgIcon icon="left-arrow" />
          </div>
          <h2 className="text-lg font-medium">{bid('addNick')}</h2>
        </div>
      }
      right={
        <div className="flex gap-3">
          <Button color="danger" className="flex items-center justify-center gap-2" onClick={handleCancel}>
            <SvgIcon icon="cancel" className="stroke-red-6" height={24} width={24} />
            {common('cancel')}
          </Button>
          <Button
            className="flex items-center justify-center"
            onClick={methods.handleSubmit(handleSave)}
            loading={createAccount.isLoading}
            disabled={createAccount.isLoading}
          >
            {!createAccount.isLoading && <SvgIcon width={24} height={24} icon="save" />}
            {common('save')}
          </Button>
        </div>
      }
    >
      <div className="scroll w-full h-full py-6 overflow-y-scroll bg-white">
        <div className="w-[1108px] mx-auto">
          <FormProvider {...methods}>
            <EditNickForm />
          </FormProvider>
        </div>
      </div>
    </BidLayout>
  );
}

export default Index;
