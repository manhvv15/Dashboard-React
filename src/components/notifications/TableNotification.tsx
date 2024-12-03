import { useMemo, useState } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'usehooks-ts';

import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { NotificationPagingResponse } from '@/types/user-management/notification';
import { formatDate } from '@/utils/common';

import ModalDeleteNotification from './dialog/ModalDeleteNotification';
import NotificationStatus from './NotificationStatus';

import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  items: NotificationPagingResponse[];
}

const TableNotification = ({ items }: Props) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [, setCopy] = useCopyToClipboard();
  const { showToast } = useApp();

  const copyCode = (code: string) => {
    setCopy(code);
    showToast({
      type: 'success',
      summary: common('Copy successful.'),
    });
  };

  const navigate = useNavigate();
  const handleEdit = (id: string) => {
    navigate(`edit/${id}`);
  };

  const initColumns: GridColumn<NotificationPagingResponse>[] = useMemo(
    () => [
      {
        headerName: common('#'),
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        width: 50,
        cellRenderer: ({ node }) => {
          return (
            <div className="text-sm  font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center text-center">
              {node.childIndex + 1}
            </div>
          );
        },
      },
      {
        headerName: common('Notification type'),
        cellClass: 'flex',
        width: 300,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              <div className="overflow-hidden text-ellipsis"> {data.name}</div>
              <div className="cursor-pointer overflow-hidden text-ellipsis" onClickCapture={() => copyCode(data.code)}>
                {data.code}
              </div>
            </div>
          );
        },
      },
      {
        headerName: common('Notification group'),
        cellClass: 'flex',
        width: 260,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              <div> {data.notificationGroupName}</div>
            </div>
          );
        },
      },
      {
        headerName: common('Channel'),
        width: 240,
        cellClass: 'flex',
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              {data.channel.split(',').join(',  ') || '-'}
            </div>
          );
        },
      },
      {
        headerName: common('Status'),
        width: 130,
        headerClass: 'text-center',
        cellClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center items-center">
              <NotificationStatus status={data.status}></NotificationStatus>
            </div>
          );
        },
      },
      {
        headerName: common('createdAt'),
        width: 190,
        headerClass: 'text-center',
        cellClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              <p>{formatDate({ time: data.createdAt, dateFormat: ' hh:mm MM/dd/yyyy' })}</p>
            </div>
          );
        },
      },
      {
        headerName: common('action'),
        width: 200,
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center">
              <Button className="px-2 w-40 text bg-ic-primary-6s" onClick={() => handleEdit(data.id)}>
                {common('edit')}
              </Button>
              <div className="mx-3">
                <Menu placement="bottom-start">
                  <MenuHandler>
                    <AccessibleComponent object={OBJECTS.NOTIFICATIONS} action={ACTIONS.EDIT}>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </AccessibleComponent>
                  </MenuHandler>
                  <MenuList>
                    <AccessibleComponent object={OBJECTS.NOTIFICATIONS} action={ACTIONS.DELETE}>
                      <MenuItem
                        onClick={() => {
                          setOpenDelete(true);
                          setCurrentId(data.id);
                        }}
                      >
                        <div className="flex items-center">
                          <SvgIcon icon="trash-delete-bin-2" width={24} height={24} className="text-ic-ink-6s mr-2" />
                          {common('delete')}
                        </div>
                      </MenuItem>
                    </AccessibleComponent>
                  </MenuList>
                </Menu>
              </div>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="h-full flex-1 my-3">
      <DataGrid rowHeight={58} rowKey={'id'} columnDefs={initColumns} rowData={items} />
      <ModalDeleteNotification id={currentId} open={openDelete} setOpen={setOpenDelete} />
    </div>
  );
};

export default TableNotification;
