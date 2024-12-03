import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';

import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { useApp } from '@/hooks/use-app';
import { resendInviteSystem } from '@/services/user-management/user';
import { UserByIdResponse, UserStatusEnum } from '@/types/user-management/user';
import { formatDate } from '@/utils/common';

import ModalDeleteUser from './dialog/ModalDeleteUser';
import UserStatus from './UserStatus';

import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';

interface IProps {
  user: UserByIdResponse;
}
export const DetailUserInfomation = ({ user }: IProps) => {
  const [openDelete, setOpenDelete] = useState(false);
  const { showToast } = useApp();

  const sendInviteMutation = useMutation({
    mutationFn: resendInviteSystem,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: t('user.resendInviteSuccessfully'),
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: t('somethingWentWrongPleaseTryAgain'),
      });
    },
  });

  const handleResendInvite = () => {
    const request = {
      userId: user.id,
      returnUrl: `${window.location.origin}/email-confirm`,
    };
    sendInviteMutation.mutate(request);
  };

  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s py-4 px-5 rounded-lg">
        <div className="grid grid-cols-2 bg-white rounded-xl">
          <div className="flex">
            <img
              className="w-[102px] h-[102px] rounded-full object-cover"
              src={user.avatarUrl ?? '/static/svg/profile.svg'}
              alt=""
            />
            <div className="ml-4">
              <div className="text-lg font-medium">
                {user.fullName ?? user.email} <UserStatus status={user.status}></UserStatus>
              </div>
              <div className="text-sm text-ic-black-5s">{user.email}</div>
              <div className="flex items-center mt-2">
                <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.INVITE_USERS}>
                  {user.status == UserStatusEnum.Invited && (
                    <>
                      <button
                        className="flex items-center cursor-pointer text-ic-primary-6s"
                        onClick={handleResendInvite}
                      >
                        <SvgIcon icon="send"></SvgIcon>
                        <p className="flex font-medium leading-5 text-sm cursor-pointer ">
                          {t('user.resendInvitation')}
                        </p>
                      </button>
                      <div className="mx-3 h-5 w-[1px] bg-[#D9D9D9]"></div>
                    </>
                  )}
                </AccessibleComponent>

                <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.REMOVE_USER}>
                  <div className="flex items-center cursor-pointer">
                    <button
                      className="font-medium leading-20 text-sm text-ic-red-6s cursor-pointer"
                      onClick={() => setOpenDelete(true)}
                    >
                      {t('user.removeUser')}
                    </button>
                  </div>
                </AccessibleComponent>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-normal leading-5 text-ic-ink-5">{t('user.memberSince')}</div>
                <div className="text-sm font-normal leading-5 text-ic-ink-6">
                  {formatDate({ time: user.inviteAt, dateFormat: 'hh:mm MM/dd/yyyy' })}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-normal leading-5 text-ic-ink-5">{t('user.inviteBy')}</div>
                <div className="text-sm font-normal leading-5 text-ic-ink-6">{user.inviteBy}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalDeleteUser id={user.id} open={openDelete} setOpen={setOpenDelete} userName={user.fullName ?? ''} />
    </div>
  );
};
