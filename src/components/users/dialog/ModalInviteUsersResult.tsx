import { Dispatch, SetStateAction } from 'react';

import { DialogBody, DialogHeader, Dialog, DialogFooter, Button } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { InviteUserResponse } from '@/types/user-management/user';

interface Props {
  open: boolean;
  data: InviteUserResponse;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalInviteUsersResult = ({ open, setOpen, data }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const navigate = useNavigate();

  const onHandleCloseModel = () => {
    setOpen(false);
    navigate('/user-and-roles/users');
  };
  return (
    <Dialog size="xs" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('user.userInvited')}</p>
        <button onClick={() => onHandleCloseModel()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="font-medium text-sm">
          {common('user.userInvited')}:{' '}
          <span className="text-ic-green-6s ml-1">
            {data.successes.length}/{data.successes.length + data.errors.length}
          </span>
        </div>
        <div className="font-medium text-sm mt-2">
          {common('user.usersCoundntBeInvited')}:
          <span className="text-ic-red-6s ml-1">
            {data.errors.length > 0 ? data.errors.join(',') : `0/${data.successes.length + data.errors.length}`}
          </span>
        </div>
        <div className="text-xs text-ic-black-5s mt-2">
          {common('user.youCannotReInviteUsersThatAreExistingInThisApplicaton')}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => onHandleCloseModel()} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalInviteUsersResult;
