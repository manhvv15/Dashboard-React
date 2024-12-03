import { useMemo } from 'react';

import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import Delete from '@/public/static/icons/delete.svg';
import Edit from '@/public/static/icons/edit.svg';
import { IProxySourceWorkspace } from '@/types/pim/proxy';
import { showToast } from '@/utils/toasts';

interface props {
  data?: IProxySourceWorkspace[];
  onEditClick: (data: IProxySourceWorkspace) => void;
  onDeleteClick: (data: IProxySourceWorkspace) => void;
}
const ProxyConfigTable = ({ data, onEditClick, onDeleteClick }: props) => {
  const { t: pim } = useTranslation(LocaleNamespace.Pim);
  const dataGridColumn: GridColumn<IProxySourceWorkspace>[] = useMemo(
    () => [
      {
        headerName: pim('proxyAndSetting.proxyConfig.sourceName'),
        width: 200,
        cellRenderer: (params) => {
          return <p>{params.data.sourceName}</p>;
        },
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.ip'),
        flex: 1,
        cellRenderer: (params) => (
          <div className="flex gap-1 flex-wrap">
            {params?.data?.proxyInfos?.map((x: any) => {
              return (
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(x.ip);
                    showToast({
                      type: 'success',
                      summary: pim('copySuccess'),
                    });
                  }}
                  className="p-1 cursor-pointer bg-ic-green-2s border text-ic-ink-5s border-green-6s rounded-md font-medium"
                >
                  {x.ip}
                </span>
              );
            })}
          </div>
        ),
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.origin'),
        width: 120,
        cellRenderer: (params) => {
          return <p>{params.data.origin}</p>;
        },
      },
      {
        headerName: pim('action'),
        width: 120,
        cellRenderer: (params) => (
          <div className="flex w-full">
            <AccessibleComponent object={OBJECTS.PROXY_CONFIGURATION} action={ACTIONS.EDIT}>
              <div
                className="cursor-pointer border border-slate-300 flex justify-center rounded-lg w-10 h-10 p-2"
                onClick={() => onEditClick(params.data)}
              >
                <Edit width={24} height={24} />
              </div>
            </AccessibleComponent>

            <AccessibleComponent object={OBJECTS.PROXY_CONFIGURATION} action={ACTIONS.DELETE}>
              <div
                className="cursor-pointer border border-slate-300 flex justify-center rounded-lg w-10 h-10 p-2 ml-2"
                onClick={() => onDeleteClick(params.data)}
              >
                <Delete width={24} height={24} />
              </div>
            </AccessibleComponent>
          </div>
        ),
      },
    ],
    [pim],
  );
  return (
    <div className="h-full">
      <DataGrid rowData={data ?? []} rowKey="sourceId" rowAutoHeight columnDefs={dataGridColumn}></DataGrid>
    </div>
  );
};
export default ProxyConfigTable;
