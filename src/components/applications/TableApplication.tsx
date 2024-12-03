import { useMemo } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { formatDate, isGrantPermission } from '@/utils/common';

import { ApplicationManagementResponse } from '@/types/user-management/application';
import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';
import ApplicationStatus from './ApplicationStatus';

interface Props {
  items: ApplicationManagementResponse[];
  isLoading: boolean;
}

const TableApplication = ({ items, isLoading }: Props) => {
  const navigate = useNavigate();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const handleEditRole = (id: string) => {
    navigate(`edit/${id}`);
  };

  const isShowButtonAction = () => {
    return isGrantPermission(OBJECTS.ROLES, ACTIONS.DELETE) || isGrantPermission(OBJECTS.ROLES, ACTIONS.CREATE);
  };
  const initColumns: GridColumn<ApplicationManagementResponse>[] = useMemo(
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
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.logoUrl ?? '/static/svg/profile.svg'}
                alt=""
              />
              <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center ml-2">
                <div className="overflow-hidden text-ellipsis"> {data.name}</div>
                <div className="overflow-hidden text-ellipsis text-xs text-ic-black-5s"> {data.code}</div>
              </div>
            </div>
          );
        },
      },
      {
        headerName: common('applicationGroups'),
        width: 250,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return <div className="flex h-full">{data.applicationGroupName}</div>;
        },
      },
      {
        headerName: common('workspace'),
        width: 150,
        cellClass: 'flex justify-center',
        headerComponent: () => {
          return <div className="flex justify-end items-end w-full text-end">{common('workspace')}</div>;
        },
        cellRenderer: ({ data }) => {
          return <div className="flex justify-end items-end h-full">{data.workspaceCount}</div>;
        },
      },
      {
        headerName: common('status'),
        width: 200,
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex justify-center items-center h-full">
              <ApplicationStatus status={data.status}></ApplicationStatus>
            </div>
          );
        },
      },
      {
        headerName: common('orderNumber'),
        width: 200,
        cellClass: 'flex justify-end',
        headerClass: 'text-center',
        headerComponent: () => {
          return <div className="flex justify-end items-end w-full text-end">{common('orderNumber')}</div>;
        },
        cellRenderer: ({ data }) => {
          return <div className="flex justify-end items-end h-full">{data.order}</div>;
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
        headerName: common('updatedAt'),
        width: 190,
        headerClass: 'text-center',
        cellClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              {data.updatedAt ? (
                <>
                  <p>{formatDate({ time: data.updatedAt, dateFormat: 'hh:mm MM/dd/yyyy' })}</p>
                </>
              ) : (
                ''
              )}
            </div>
          );
        },
      },
      {
        headerName: common('action'),
        width: 100,
        headerClass: 'text-center',
        cellClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center justify-center">
              {isShowButtonAction() && (
                <div className="mx-3">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <AccessibleComponent object={OBJECTS.APPLICATIONS} action={ACTIONS.EDIT}>
                        <MenuItem onClick={() => handleEditRole(data.id)}>
                          <div className="flex items-center">{common('edit')}</div>
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

  return (
    <div className="h-full flex-1 my-3">
      <DataGrid rowHeight={58} rowKey={'id'} columnDefs={initColumns} rowData={items} isLoading={isLoading} />
    </div>
  );
};

export default TableApplication;
