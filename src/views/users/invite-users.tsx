import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import ModalInviteUsersResult from '@/components/users/dialog/ModalInviteUsersResult';
import { InviteUsersForm } from '@/components/users/InviteUsersForm';
import { LocaleNamespace } from '@/constants/enums/common';
import { sendInviteSystem } from '@/services/user-management/user';
import { FormInviteUser, InviteUserResponse } from '@/types/user-management/user';
import { responseErrorCode } from '@/utils/common';

const InviteUsers = () => {
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [openModelResultUserInvited, setOpenModelResultUserInvited] = useState(false);
  const [inviteUserResponse, setInviteUserResponse] = useState<InviteUserResponse>();

  const navigate = useNavigate();

  const schema = yup
    .object()
    .shape({
      emails: yup.array().min(1, error('fieldRequired')).required(error('fieldRequired')),
      // applicationRoles: yup
      //   .array()
      //   .of(
      //     yup.object().shape({
      //       applicationId: yup.string().required(error('fieldRequired')),
      //       roleIds: yup.array().min(1, error('fieldRequired')),
      //     }),
      //   )
      //   .required(error('fieldRequired')),
    })
    .required();

  const methods = useForm<FormInviteUser>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const sendInviteMutation = useMutation({
    mutationFn: sendInviteSystem,
    onSuccess: (response) => {
      setOpenModelResultUserInvited(true);
      setInviteUserResponse(response.data);
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorNormal && errorNormal === 'invalidEmailSuffix') {
        methods.setError('emails', { message: error('invalidEmailSuffix') });
      }
      if (errorFrom) {
        responseErrorCode(err.errorFrom).forEach(({ name, message, type }) => {
          const mess = error(message);
          methods.setError(name, { type, message: mess });
        });
      }
    },
  });

  const submitData = (data: FormInviteUser) => {
    const request = {
      ...data,
      returnUrl: `${window.location.origin}/email-confirm`,
    };
    sendInviteMutation.mutate(request);
  };

  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('user.inviteUsers')}</span>
        </button>
      }
      right={
        <div className="flex items-center gap-x-3">
          <Button onClick={() => navigate(-1)} color="danger" variant="outlined">
            <SvgIcon icon="close-circle" width={20} height={20} />
            <p className="ml-1">{t('cancel')}</p>
          </Button>

          <Button variant="outlined" onClick={methods.handleSubmit(submitData)} loading={sendInviteMutation.isLoading}>
            <SvgIcon icon="send" width={20} height={20} />
            <p className="ml-1">{t('user.sendInvite')}</p>
          </Button>
        </div>
      }
    >
      <div className="scroll h-[calc(100vh_-_100px)] flex flex-col overflow-y-auto">
        <div className="flex justify-center p-6">
          <FormProvider {...methods}>
            <InviteUsersForm />
          </FormProvider>
        </div>

        {inviteUserResponse && (
          <ModalInviteUsersResult
            data={inviteUserResponse}
            open={openModelResultUserInvited}
            setOpen={setOpenModelResultUserInvited}
          ></ModalInviteUsersResult>
        )}
      </div>
    </LayoutSection>
  );
};

export default InviteUsers;
