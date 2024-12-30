import { useMemo, useState } from 'react';
import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { LocaleNamespace } from '@/constants/enums/common';
import AccessibleComponent from '../commons/AccessibleComponent';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import SvgIcon from '../commons/SvgIcon';
import ModalCreateAndEdit from '../actions/dialog/ModalCreateAndEdit';
import { useNavigate } from 'react-router-dom';
import { isGrantPermission } from '@/utils/common';
import { ReportGroupPagingResponse } from '@/types/document-service/report-group';
import ReportGroupStatus from './ReportGroupStatus';
import DeleteReportGroupForm from './DeleteReportGroupForm';

interface Props {
  items: ReportGroupPagingResponse[];
}
const TableReportGroup = ({ items }: Props) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [isShowModelCreateOrEdit, setIsShowModelCreateOrEdit] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const navigate = useNavigate();
  const handleEdit = (id: string) => {
    navigate(`edit/${id}`);
  };
  const initColumns: GridColumn<ReportGroupPagingResponse>[] = useMemo(
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
        headerName: common('code'),
        cellClass: 'flex',
        width: 240,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col">{data.code || '-'}</div>
          );
        },
      },
      {
        headerName: common('name'),
        cellClass: 'flex',
        width: 250,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col overflow-hidden">
              <span className="break-words">{data.name || '-'}</span>
            </div>
          );
        },
      },
      {
        headerName: common('description'),
        cellClass: 'flex',
        width: 270,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col overflow-hidden">
              <span className="break-words">{data.description || '-'}</span>
            </div>
          );
        },
      },
      {
        headerName: common('Display order'),
        width: 150,
        cellClass: 'flex justify-end',
        headerClass: 'text-center',
        headerComponent: () => {
          return <div className="flex justify-end items-end w-full text-end">{common('orderNumber')}</div>;
        },
        cellRenderer: ({ data }) => {
          return <div className="flex justify-end items-end h-full">{data.displayOrder || '-'}</div>;
        },
      },
      {
        headerName: common('status'),
        width: 90,
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex justify-center items-center h-full">
              <ReportGroupStatus status={data.status}></ReportGroupStatus>
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
              <AccessibleComponent object={OBJECTS.REPORT_GROUPS} action={ACTIONS.EDIT}>
                <Button className="px-2 w-40 text bg-ic-primary-6s" onClick={() => handleEdit(data.id)}>
                  {common('edit')}
                </Button>
              </AccessibleComponent>
              {isGrantPermission(OBJECTS.REPORT_GROUPS, ACTIONS.DELETE) && (
                <div className="mx-3">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <AccessibleComponent object={OBJECTS.REPORT_GROUPS} action={ACTIONS.DELETE}>
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
      <DeleteReportGroupForm id={currentId} open={openDelete} setOpen={setOpenDelete} />
      <ModalCreateAndEdit type="edit" id={currentId} open={isShowModelCreateOrEdit} setOpen={handleCloseCreateOrEdit} />
    </div>
  );
};
//
export default TableReportGroup;
