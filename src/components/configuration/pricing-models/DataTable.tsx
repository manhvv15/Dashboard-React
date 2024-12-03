import { useRef, useState } from 'react';

import { Button, DataGrid, Label, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { redirect, useNavigate } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import DuplicateIcon from '@/public/static/icons/duplicate.svg';
import LogFileIcon from '@/public/static/icons/log-file.svg';
import { PricingModelResponse } from '@/types/user-management/configuration';
import { formatDate, formatNumber, isGrantPermission } from '@/utils/common';

import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import ModalChangeLogs, { ModalChangeLogsRef } from './dialog/ModalChangeLogs';
import ModalConfirmDelete, { ModalConfirmDeleteRef } from './dialog/ModalConfirmDelete';

interface Props {
  items: PricingModelResponse[];
}

const DataTable = ({ items }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const navigate = useNavigate();

  const [changeLogId, setChangeLogId] = useState<string>();
  const logRef = useRef<ModalChangeLogsRef>(null);

  const [deleteId, setDeleteId] = useState<string>();
  const deleteRef = useRef<ModalConfirmDeleteRef>(null);

  const handleChangLogs = (id: string) => {
    setChangeLogId(id);
    logRef.current?.open();
  };
  const handleDuplicate = () => {
    redirect('/');
  };

  const handlePlanDetail = (id: string) => {
    navigate(`/configuration/plans/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    deleteRef.current?.open();
  };

  const period = ['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Customize'];
  const trial = ['NoTrial', 'Weekly', 'Quarterly', 'Yearly', 'Customize'];

  return (
    <div className="flex-1">
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
            headerName: common('plans'),
            flex: 1,
            cellRenderer: (data) => {
              return (
                <div className="flex items-center">
                  {data.data.activated ? (
                    <Label variant={'12R'} color="green">
                      Activate
                    </Label>
                  ) : (
                    <Label variant={'12R'}>Deactivate</Label>
                  )}
                  <div className="ml-3">
                    <Typography className=" text-ic-primary-6s" variant="14R">
                      {data.data.planName}
                    </Typography>
                    {data.data.planCode && (
                      <Typography className=" text-ic-primary-6s" variant="14R">
                        {data.data.planCode}
                      </Typography>
                    )}
                  </div>
                </div>
              );
            },
          },
          {
            headerName: common('effectiveTime'),
            width: 250,
            cellRenderer: (data) => {
              return (
                <div className="h-full flex items-center">
                  <div className="flex gap-2">
                    <div>
                      <Typography variant="14R">{formatDate({ time: data.data.effectiveDateStart })}</Typography>
                      <Typography variant="14R">
                        {formatDate({ time: data.data.effectiveDateStart, dateFormat: 'HH:mm' })}
                      </Typography>
                    </div>
                    {data.data.effectiveDateEnd && (
                      <>
                        <div>-</div>
                        <div>
                          <Typography variant="14R">{formatDate({ time: data.data.effectiveDateEnd })}</Typography>
                          <Typography variant="14R">
                            {formatDate({ time: data.data.effectiveDateEnd, dateFormat: 'HH:mm' })}
                          </Typography>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            },
          },
          {
            headerName: common('price'),
            width: 150,
            headerComponent: () => {
              return (
                <div className="flex justify-end w-full">
                  <Typography variant="14M">{common('price')}</Typography>
                </div>
              );
            },
            cellClass: 'text-right',
            cellRenderer: (data) => {
              return (
                <div className="h-full flex flex-col justify-center self-end">
                  {data.data.feeCurrencies.map((i: any) => (
                    <Typography
                      variant="14R"
                      key={i.currencyCode}
                    >{`${formatNumber(i.amount)} ${i.currencyCode}`}</Typography>
                  ))}
                </div>
              );
            },
          },
          {
            headerName: common('period'),
            width: 150,
            cellRenderer: (data) => {
              return (
                <div className="h-full flex flex-col justify-center">
                  <Typography variant="14R">{period[data.data.period.periodType]}</Typography>
                </div>
              );
            },
          },
          {
            headerName: common('trial'),
            width: 150,
            cellRenderer: (data) => {
              return (
                <div className="flex items-center h-full">
                  <Typography variant="14R">{trial[data.data.billing.trialType]}</Typography>
                </div>
              );
            },
          },
          {
            headerName: common('action'),
            width: 70,
            resizable: false,
            cellRenderer: ({ data }: any) => {
              return (
                <div className="flex items-center h-full">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button variant="text">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      {[
                        {
                          icon: <SvgIcon icon="information" width={24} height={24} className="text-ic-ink-6s" />,
                          name: common('viewPlanDetail'),
                          onClick: () => handlePlanDetail(data.planId),
                          isShow: isGrantPermission(OBJECTS.PRICING_MODEL, ACTIONS.VIEW),
                        },
                        {
                          icon: <LogFileIcon />,
                          name: common('configuration.changeLogs'),
                          onClick: () => handleChangLogs(data.id),
                          isShow: isGrantPermission(OBJECTS.PRICING_MODEL, ACTIONS.VIEW_CHANGE_LOGS),
                        },
                        {
                          icon: <DuplicateIcon />,
                          name: common('configuration.duplicate'),
                          onClick: () => handleDuplicate(),
                          isShow: isGrantPermission(OBJECTS.PRICING_MODEL, ACTIONS.CREATE),
                        },
                        {
                          icon: <SvgIcon icon="trash" width={24} height={24} />,
                          name: common('configuration.delete'),
                          onClick: () => handleDelete(data.id),
                          isShow: isGrantPermission(OBJECTS.PRICING_MODEL, ACTIONS.DELETE),
                        },
                      ]
                        .filter((x) => x.isShow)
                        .map(({ name, icon, ...rest }) => {
                          return (
                            <MenuItem key={name} {...rest} className="flex items-center gap-2">
                              {icon}
                              <Typography variant="14R">{name}</Typography>
                            </MenuItem>
                          );
                        })}
                    </MenuList>
                  </Menu>
                </div>
              );
            },
          },
        ]}
        rowData={items}
      />
      <ModalChangeLogs id={changeLogId} ref={logRef} />
      <ModalConfirmDelete id={deleteId} ref={deleteRef} />
    </div>
  );
};

export default DataTable;
