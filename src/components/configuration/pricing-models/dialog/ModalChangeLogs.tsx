import { forwardRef, useImperativeHandle, useState } from 'react';

import { DataGrid, Dialog, DialogBody, DialogHeader, Typography } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { getPricingModelChangeLogs } from '@/services/user-management/configuration';

interface Props {
  id?: string;
}

export interface ModalChangeLogsRef {
  open: () => void;
  close: () => void;
}

const ModalChangeLogs = forwardRef<ModalChangeLogsRef, Props>(({ id }, ref) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [open, setOpen] = useState(false);

  const { data: logs } = useQuery({
    queryKey: ['getChangeLogs', id],
    queryFn: () =>
      getPricingModelChangeLogs({
        workspaceId: '',
        id: id ?? '',
        pageNumber: 1,
        pageSize: 10,
      }),
    enabled: !!id,
    select: (res) => res.data.items,
  });

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader>{common('configuration.changeLogs')}</DialogHeader>
      <DialogBody className="w-full">
        <DataGrid
          rowHeight={72}
          rowKey={'id'}
          columnDefs={[
            {
              headerName: common('time'),
              headerClass: 'text-center',
              cellClass: 'text-center',
              flex: 1,
              cellRenderer: () => {
                return <Typography variant="14R">14:00 01/04/2024</Typography>;
              },
            },
            {
              headerName: common('editor'),
              headerClass: 'text-center',
              cellClass: 'text-center',
              width: 260,
              cellRenderer: () => {
                return <Typography variant="14R">Tungpn</Typography>;
              },
            },
          ]}
          rowData={logs ?? []}
        />
      </DialogBody>
    </Dialog>
  );
});

export default ModalChangeLogs;
