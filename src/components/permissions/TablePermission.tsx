import { useMemo, useState } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { PagingPermissionResponse } from '@/types/user-management/permission';
import { formatDate, isGrantPermission } from '@/utils/common';

import ModalCreateAndEdit from './dialog/ModalCreateAndEdit';
import ModalDeletePermission from './dialog/ModalDeletePermission';

import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  items: PagingPermissionResponse[];
}

const TablePermission = ({ items }: Props) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [isShowModelCreateOrEdit, setIsShowModelCreateOrEdit] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const { t: common } = useTranslation(LocaleNamespace.Common);
  const initColumns: GridColumn<PagingPermissionResponse>[] = useMemo(
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
        headerName: common('application'),
        width: 250,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.applicationLogoUrl ?? '/static/svg/profile.svg'}
                alt=""
              />
              <div className="mx-2">{data.applicationName || '-'}</div>
            </div>
          );
        },
      },
      {
        headerName: common('object'),
        cellClass: 'flex',
        width: 260,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              {data.objectCode || '-'}
            </div>
          );
        },
      },
      {
        headerName: common('Action'),
        width: 250,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              {data.actionCode || '-'}
            </div>
          );
        },
      },
      {
        headerName: common('method'),
        width: 300,
        flex: 1,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              <div>
                {t('method')}: {data.method}
              </div>
              <div>
                {t('endpoint')}: {data.endpoint}
              </div>
            </div>
          );
        },
      },
      {
        headerName: common('createdAt'),
        width: 220,
        headerClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center text-center">
              <p>{formatDate({ time: data.createdAt, dateFormat: ' hh:mm MM/dd/yyyy' })}</p>
            </div>
          );
        },
      },
      {
        headerName: common('action'),
        width: 210,
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center ">
              <AccessibleComponent object={OBJECTS.PERMISSIONS} action={ACTIONS.EDIT}>
                <Button
                  onClick={() => {
                    setIsShowModelCreateOrEdit(true);
                    setCurrentId(data.id);
                  }}
                  className="px-2 w-40 text bg-ic-primary-6s"
                >
                  {common('edit')}
                </Button>
              </AccessibleComponent>
              {isGrantPermission(OBJECTS.PERMISSIONS, ACTIONS.DELETE) && (
                <div className="mx-3">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <AccessibleComponent object={OBJECTS.PERMISSIONS} action={ACTIONS.DELETE}>
                        <MenuItem
                          onClick={() => {
                            setOpenDelete(true);
                            setCurrentId(data.id);
                          }}
                        >
                          {common('delete')}
                        </MenuItem>
                      </AccessibleComponent>
                    </MenuList>
                  </Menu>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  const handleCloseCreateOrEdit = () => {
    setIsShowModelCreateOrEdit(false);
    setCurrentId('');
  };

  return (
    <div className="h-full">
      <DataGrid rowHeight={58} rowKey={'id'} columnDefs={initColumns} rowData={items} />
      <ModalDeletePermission id={currentId} open={openDelete} setOpen={setOpenDelete} />
      <ModalCreateAndEdit type="edit" id={currentId} open={isShowModelCreateOrEdit} setOpen={handleCloseCreateOrEdit} />
    </div>
  );
};

export default TablePermission;
