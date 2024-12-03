import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';

interface Props {
  isAppliesToAllWorkspaces: boolean;
  setIsAppliesToAllWorkspaces: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalSynchronizePermissionsForWorkspaces = ({
  isAppliesToAllWorkspaces,
  setIsAppliesToAllWorkspaces,
  open,
  setOpen,
}: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsAppliesToAllWorkspaces(event.target.checked);
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('synchronizePermissionsForWorkspaces')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm mb-2">{common('synchronizePermissionsForWorkspacesDescription')}</p>
        <Checkbox
          checked={isAppliesToAllWorkspaces}
          onChange={handleChange}
          label={common('synchronizePermissionsForWorkspaces')}
        />
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button onClick={() => setOpen(true)}>{common('confirm')}</Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalSynchronizePermissionsForWorkspaces;
