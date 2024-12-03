import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { DialogHeader, Button, DialogBody, DialogFooter, Input, Dialog, Checkbox } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { addUsersToRole, getUserAvailableToAddRole } from '@/services/user-management/user';

interface Props {
  roleId: string;
  open: boolean;
  roleName: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalAddUsersToRole = ({ roleId, open, setOpen, roleName }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [userIds, setUserIds] = useState<string[]>([]);
  const { showToast } = useApp();
  const queryClient = useQueryClient();
  const [textSearch, setTextSearch] = useState<string>();
  const searchDebounce = useDebounce(textSearch);

  const usersAvailable = useQuery({
    queryKey: ['getUsersAvailableToAddRole', roleId, searchDebounce],
    queryFn: () =>
      getUserAvailableToAddRole({
        keyword: searchDebounce,
        roleId: roleId,
        pageSize: 30,
      }),
    enabled: open,
  }).data?.data;

  const addUsersToRoleMutation = useMutation({
    mutationFn: addUsersToRole,
    onSuccess: () => {
      if (userIds.length === 1) {
        const userName = usersAvailable?.find((x) => x.id == userIds[0])?.fullName;
        showToast({
          type: 'success',
          summary: common('user.addOneUserSuccessfully.description', { userName: userName }),
        });
      } else {
        showToast({
          type: 'success',
          summary: common('user.addManyUserSuccessfully.description', { numberOfUsers: userIds.length }),
        });
      }
      responseSuccess();
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('somethingWentWrongPleaseTryAgain'),
      });
    },
  });

  const submitData = () => {
    if (!userIds || userIds.length < 1) {
      showToast({
        type: 'error',
        summary: error('user.pleaseSelectUser'),
      });
      return;
    }

    addUsersToRoleMutation.mutate({
      roleIds: [roleId],
      userIds: userIds,
    });
  };

  const responseSuccess = () => {
    setOpen(false);
    setUserIds([]);
    queryClient.invalidateQueries(['getRolePaging']);
  };

  const handleCloseModel = () => {
    setUserIds([]);
    setOpen(false);
  };
  const onChangeTextSearchPermission = (event?: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event?.target.value);
  };
  const handleChangeUsers = (event: ChangeEvent<HTMLInputElement>) => {
    let updatedList = [...userIds];
    if (event.target.checked) {
      updatedList = [...userIds, event.target.value];
    } else {
      updatedList.splice(userIds.indexOf(event.target.value), 1);
    }
    setUserIds(updatedList);
  };

  const onHandleClear = () => {
    setUserIds([]);
  };
  const onHandleSelectAll = () => {
    const ids = usersAvailable?.map((el) => el.id);
    setUserIds(ids ?? []);
  };
  return (
    <Dialog
      size="xs"
      open={open}
      handler={setOpen}
      dismiss={{
        outsidePress: false,
      }}
    >
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">
          {common('user.addUserToRole')} {roleName}
        </p>
        <button onClick={() => handleCloseModel()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="w-full border-[1px] border-solid border-ic-black-6s rounded-lg">
          <div className="px-4">
            <Input
              classNameContainer="mt-2"
              placeholder={t('user.textSearchUser')}
              hiddenClose
              name="name"
              onChange={onChangeTextSearchPermission}
              icon={<SvgIcon icon="search" />}
            />
          </div>
          <div className="mt-2 p-2 max-h-[500px] overflow-auto scrollbar">
            {usersAvailable && usersAvailable.length >= 1 ? (
              <>
                <div className="mt-2 p-2">
                  {usersAvailable?.map((user) => (
                    <>
                      <div
                        className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center p-2"
                        key={user.id}
                      >
                        <Checkbox
                          value={user.id}
                          onChange={handleChangeUsers}
                          checked={userIds.findIndex((x) => x == user.id) !== -1}
                        />
                        <img
                          className="w-8 h-8 rounded-full object-cover ml-2"
                          src={user.avatarUrl ?? '/static/svg/profile.svg'}
                          alt=""
                        />
                        <div className="mx-2">
                          <div> {user.fullName}</div>
                          <div> {user.email}</div>
                        </div>
                      </div>
                    </>
                  ))}
                  <div className="flex  justify-between mb-4">
                    <button className="ml-4 cursor-pointer text-ic-primary-6s text-sm" onClick={onHandleClear}>
                      {common('clear')}{' '}
                    </button>
                    <button className="mr-4 cursor-pointer text-ic-primary-6s text-sm" onClick={onHandleSelectAll}>
                      {common('selectAll')} ({usersAvailable?.length}){' '}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center flex-col w-full h-[150px]">
                  <img src={'/static/svg/noDataIcon.svg'} alt="NodataIcon" width={100} />
                  <div>{common('role.noUsers')}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModel()} color="stroke" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={addUsersToRoleMutation.isLoading} onClick={submitData} className="ml-3">
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalAddUsersToRole;
