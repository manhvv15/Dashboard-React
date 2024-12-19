import { useMemo, useState } from 'react';
import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { LocaleNamespace } from '@/constants/enums/common';
import { ReportPagingResponse } from '@/types/document-service/report';
import AccessibleComponent from '../commons/AccessibleComponent';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import SvgIcon from '../commons/SvgIcon';
import ModalCreateAndEdit from '../actions/dialog/ModalCreateAndEdit';
import { useNavigate } from 'react-router-dom';
import { isGrantPermission } from '@/utils/common';
import ReportStatus from './ReportStatus';
import DeleteReportForm from './DeleteReportForm';
import { useMutation } from '@tanstack/react-query';
import { downloadReport } from '@/services/document-service/report';
import { AxiosResponse } from 'axios';
import saveAs from 'file-saver';
import { showToast } from '@/utils/toasts';

interface Props {
  items: ReportPagingResponse[];
}
const TableReport = ({ items }: Props) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [isShowModelCreateOrEdit, setIsShowModelCreateOrEdit] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const navigate = useNavigate();
  const handleEdit = (id: string) => {
    navigate(`edit/${id}`);
  };
  const { mutate: handleDownload } = useMutation((id: string) => downloadReport(id), {
    onSuccess: (data: AxiosResponse) => {
      const binary = atob(data.data.fileContent);
      const arrayBuffer = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        arrayBuffer[i] = binary.charCodeAt(i);
      }
      const file = new Blob([arrayBuffer], {
        type: data.data.type,
      });
      saveAs(file, data.data.name);
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: common('downloadFail'),
      });
    },
  });

  const handleDownloadClick = (id: string) => {
    handleDownload(id);
  };

  const initColumns: GridColumn<ReportPagingResponse>[] = useMemo(
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
        width: 270,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col">{data.code || '-'}</div>
          );
        },
      },
      {
        headerName: common('name'),
        cellClass: 'flex',
        width: 220,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col overflow-hidden">
              <span className="break-words">{data.name || '-'}</span>
            </div>
          );
        },
      },
      {
        headerName: common('report.applicationName'),
        width: 220,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col">
              <span className="break-words">{data.applicationName || '-'}</span>
            </div>
          );
        },
      },
      {
        headerName: common('report.reportGroupName'),
        width: 220,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col">
              {data.reportGroupName || '-'}
            </div>
          );
        },
      },
      {
        headerName: common('status'),
        width: 120,
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex justify-center items-center h-full">
              <ReportStatus status={data.status}></ReportStatus>
            </div>
          );
        },
      },
      {
        headerName: common('report.allowTypes'),
        width: 200,
        cellClass: 'flex',
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              {data.allowTypes?.join(', ') || '-'}
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
              <AccessibleComponent object={OBJECTS.REPORTS} action={ACTIONS.EDIT}>
                <Button className="px-2 w-40 text bg-ic-primary-6s" onClick={() => handleEdit(data.id)}>
                  {common('edit')}
                </Button>
              </AccessibleComponent>
              {isGrantPermission(OBJECTS.REPORTS, ACTIONS.DELETE) && (
                <div className="mx-3">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <AccessibleComponent object={OBJECTS.REPORTS} action={ACTIONS.DELETE}>
                        <MenuItem
                          onClick={() => {
                            setOpenDelete(true);
                            setCurrentId(data.id);
                          }}
                        >
                          {common('delete')}
                        </MenuItem>
                      </AccessibleComponent>
                      <AccessibleComponent object={OBJECTS.REPORTS} action={ACTIONS.DOWNLOAD}>
                        <MenuItem
                          onClick={() => {
                            handleDownloadClick(data.id);
                          }}
                        >
                          Download
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
      <DeleteReportForm id={currentId} open={openDelete} setOpen={setOpenDelete} />
      <ModalCreateAndEdit type="edit" id={currentId} open={isShowModelCreateOrEdit} setOpen={handleCloseCreateOrEdit} />
    </div>
  );
};
export default TableReport;
