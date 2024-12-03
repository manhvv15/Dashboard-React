import {
  DataGrid,
  Label,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace, StatusPlanEnum } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { GetPlansPagingQueryResponse } from '@/types/common';
import { useState } from 'react';
import { ModalChangeLog } from '../modal/ModalChangeLogPlan';
import { ModalDeletePlan } from '../modal/ModalDeletePlan';

interface Props {
  items: GetPlansPagingQueryResponse[];
}

const PlanTable = ({ items }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const [modalDelete, setModalDelete] = useState(false);
  const [modalChangLog, setModalChangeLog] = useState(false);
  const [planId, setPlanId] = useState<string>();

  const navigate = useNavigate();

  const handleChangeLog = (id: string) => {
    setModalChangeLog(true);
    setPlanId(id);
  };

  const handleDuplicatePlan = (id: string) => {
    navigate(`duplicate/${id}`);
  };

  const handleDeletePlan = (id: string) => {
    setModalDelete(true);
    setPlanId(id);
  };

  const Application = (data: any[]) => {
    if (data.length === 1) {
      return <Label variant="12R">{data[0].name}</Label>;
    }
    return (
      <Popover>
        <PopoverHandler>
          <button>
            <Label variant="12R">{`Multi-app (${data.length})`}</Label>
          </button>
        </PopoverHandler>
        <PopoverContent>
          {data.map((i) => (
            <p className="text-sm font-normal text-ic-ink-6s py-1" key={i.id}>
              {i.name}
            </p>
          ))}
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex-1 h-full">
      <DataGrid
        rowHeight={72}
        rowKey={'id'}
        onCellClicked={(e) => {
          if (e.colDef.headerName !== 'Action') {
            navigate(`${e.data.id}`);
          }
        }}
        columnDefs={[
          {
            headerName: common('name'),
            cellClass: 'flex',
            flex: 1,
            cellRenderer: ({ data }) => {
              return (
                <div>
                  <p className="text-sm font-normal text-ic-primary-6s flex">
                    {data.name}
                    <div className="ml-1">
                      {data.isDefault && (
                        <div className="ml-2 rounded border border-ic-blue-6s text-xs leading-5 font-normal text-ic-blue-6s px-2 bg-ic-blue-1s inline-block">
                          {common('default')}
                        </div>
                      )}
                    </div>
                  </p>
                  <div className="mt-3">
                    {data.status === StatusPlanEnum.Active ? (
                      <Label color="green" variant="12R">
                        Active
                      </Label>
                    ) : (
                      <Label color="orange" variant="12R">
                        Deactivate
                      </Label>
                    )}
                  </div>
                </div>
              );
            },
          },
          {
            headerName: common('planCode'),
            width: 320,
            cellRenderer: ({ data }) => {
              return (
                <div className="h-full flex flex-col justify-center">
                  <Typography variant="14R">{data.code}</Typography>
                </div>
              );
            },
          },
          {
            headerName: common('application'),
            width: 250,
            cellRenderer: ({ data }) => {
              return Application(data.applications);
            },
          },

          {
            headerName: common('action'),
            width: 70,
            resizable: false,
            cellRenderer: ({ data }: any) => {
              return (
                <div className="flex items-center h-full">
                  <Menu>
                    <MenuHandler>
                      <button className="flex justify-center w-full items-center">
                        <SvgIcon icon="dots-menu" width={20} height={20} className="text-ic-ink-6s" />
                      </button>
                    </MenuHandler>
                    <MenuList>
                      <AccessibleComponent object={OBJECTS.PLANS} action={ACTIONS.VIEW_CHANGE_LOGS}>
                        <MenuItem className="flex items-center" onClick={() => handleChangeLog(data.id)}>
                          <SvgIcon icon="paper-notes-text" width={20} height={20} />
                          <p className="ml-1">{common('changeLogs')}</p>
                        </MenuItem>
                      </AccessibleComponent>
                      <AccessibleComponent object={OBJECTS.PLANS} action={ACTIONS.CREATE}>
                        <MenuItem className="flex items-center" onClick={() => handleDuplicatePlan(data.id)}>
                          <SvgIcon icon="copy-duplicate-object-add-plus" width={20} height={20} />
                          <p className="ml-1">{common('duplicate')}</p>
                        </MenuItem>
                      </AccessibleComponent>
                      <AccessibleComponent object={OBJECTS.PLANS} action={ACTIONS.DELETE}>
                        <MenuItem className="flex items-center" onClick={() => handleDeletePlan(data.id)}>
                          <SvgIcon icon="delete" width={20} height={20} />
                          <p className="ml-1">{common('delete')}</p>
                        </MenuItem>
                      </AccessibleComponent>
                    </MenuList>
                  </Menu>
                </div>
              );
            },
          },
        ]}
        rowData={items}
      />
      <ModalDeletePlan open={modalDelete} setOpen={setModalDelete} id={planId ?? ''} />
      <ModalChangeLog open={modalChangLog} setOpen={setModalChangeLog} id={planId ?? ''} />
    </div>
  );
};

export default PlanTable;
