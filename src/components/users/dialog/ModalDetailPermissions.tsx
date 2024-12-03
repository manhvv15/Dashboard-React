import { Dispatch, SetStateAction } from 'react';

import { Button, CheckboxTree, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { getTreePermissionByRoleId } from '@/services/user-management/permission';

interface Props {
  roleId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDetailPermissions = ({ roleId, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const permissions = useQuery({
    queryKey: ['getTreePermissionByRoleId', roleId],
    queryFn: () => getTreePermissionByRoleId(roleId),
    enabled: !!roleId,
  }).data?.data;

  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <Dialog size="sm" open={open} handler={handleCloseModal}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('user.viewDetailPermissions')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="mt-4 max-h-[500px] overflow-y-auto scrollbar">
          <CheckboxTree nodes={permissions ?? []} selection={false}></CheckboxTree>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModal()} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDetailPermissions;
