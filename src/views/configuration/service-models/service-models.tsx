import { ChangeEvent, useState } from 'react';

import {
  Button,
  DropdownFilter,
  Input,
  LoadingOverlay,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import { ModalChangeLogServiceModel } from '@/components/configuration/modal/ModalChangeLogServiceModel';
import { ModalDeleteServiceModel } from '@/components/configuration/modal/ModalDeleteServiceModel';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import NoData from '@/public/static/svg/noDataIcon.svg?url';
import { getChargeUnits, getServiceModels } from '@/services/configuration';
import { GetServiceModelsPagingQueryResponse } from '@/types/common';
import { isGrantPermission, onlySpaces } from '@/utils/common';

const ServiceModels = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const navigate = useNavigate();

  const [modalDelete, setModalDelete] = useState(false);
  const [modalChangLog, setModalChangeLog] = useState(false);
  const [planId, setPlanId] = useState<string | undefined>();

  const [units, setUnits] = useDebounceValue<string[] | undefined>(undefined, 300);
  const [search, setSearch] = useDebounceValue<string | undefined>(undefined, 300);

  const [listServiceModels, setListServiceModels] = useState<GetServiceModelsPagingQueryResponse[]>();

  const { isLoading } = useQuery({
    queryKey: ['getServiceModels', search, units, status],
    queryFn: () => getServiceModels({ pageSize: 100, units: units, keyword: search }),
    onSuccess: (data) => {
      setListServiceModels(data.data.items);
    },
  });

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onlySpaces(value)) {
      setSearch(undefined);
      return;
    }
    setSearch(value);
  };
  const handleChangeUnits = (val?: string) => {
    setUnits(val ? [val] : []);
  };

  const chargeUnits =
    useQuery({
      queryKey: ['getChargeUnits'],
      queryFn: getChargeUnits,
    }).data?.data.map((el) => ({
      value: el.code,
      label: el.name,
    })) ?? [];

  const handleDeletePlan = (id: string) => {
    setModalDelete(true);
    setPlanId(id);
  };
  const handleChangeLog = (id: string) => {
    setModalChangeLog(true);
    setPlanId(id);
  };

  const handleCreateService = () => {
    navigate('create');
  };

  const handleDuplicateService = (id: string) => {
    navigate(`duplicate/${id}`);
  };

  const handleEditService = (id: string) => {
    if (isGrantPermission(OBJECTS.SERVICE_MODELS, ACTIONS.EDIT)) navigate(`${id}`);
  };

  return (
    <LayoutSection
      label={common('serviceModels')}
      right={
        <AccessibleComponent object={OBJECTS.SERVICE_MODELS} action={ACTIONS.CREATE}>
          <Button onClick={handleCreateService}>
            <SvgIcon icon="plus" width={20} height={20} />
            <p>{common('createANewService')}</p>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="w-full h-full" isLoading={isLoading}>
        <div className=" flex justify-center">
          <div className="p-4 w-full max-w-[1100px] bg-ic-white-6s rounded-lg border border-ic-ink-2s">
            <div className="flex items-center ">
              <div>
                <Input
                  hiddenClose
                  onChange={handleChangeSearch}
                  size={32}
                  placeholder="Search by name/code"
                  icon={<SvgIcon icon="search" width={20} height={20} className="text-ic-ink-6s" />}
                />
              </div>
              <div className="ml-4">
                <DropdownFilter
                  searchable={false}
                  onChange={handleChangeUnits}
                  options={chargeUnits}
                  multiple={false}
                  name={common('unit')}
                />
              </div>
            </div>
            <div className="mt-4">
              <Table className="table">
                <THead className=" w-full table  table-fixed">
                  <Tr>
                    <Th className="w-[600px]">{common('name')}</Th>
                    <Th className="w-60">{common('uom')}</Th>
                    <Th separation={false} className="w-32">
                      {common('action')}
                    </Th>
                  </Tr>
                </THead>
                {!!listServiceModels?.length && (
                  <TBody className="max-h-[470px] block w-full overflow-y-auto h-full">
                    {listServiceModels?.map((item) => {
                      const onDelete = () => {
                        handleDeletePlan(item.id);
                      };
                      const onChangeLog = () => {
                        handleChangeLog(item.id);
                      };
                      const onDuplicateService = () => {
                        handleDuplicateService(item.id);
                      };
                      const onEdit = () => {
                        handleEditService(item.id);
                      };
                      return (
                        <Tr className={clsx(` table-fixed table w-full`)} borderBottom key={item.id}>
                          <Td className="w-[600px]" onClick={onEdit}>
                            <p className="text-sm font-normal text-ic-primary-6s">{item.name}</p>
                          </Td>
                          <Td onClick={onEdit} className="text-center w-60">
                            {item.unit}
                          </Td>
                          <Td separation={false} className="w-32">
                            <Menu>
                              <MenuHandler>
                                <button className="flex justify-center w-full items-center">
                                  <SvgIcon icon="dots-menu" width={20} height={20} className="text-ic-ink-6s" />
                                </button>
                              </MenuHandler>
                              <MenuList>
                                <AccessibleComponent object={OBJECTS.SERVICE_MODELS} action={ACTIONS.VIEW_CHANGE_LOGS}>
                                  <MenuItem className="flex items-center" onClick={onChangeLog}>
                                    <SvgIcon icon="paper-notes-text" width={20} height={20} />
                                    <p className="ml-1">{common('changeLogs')}</p>
                                  </MenuItem>
                                </AccessibleComponent>
                                <AccessibleComponent object={OBJECTS.SERVICE_MODELS} action={ACTIONS.EDIT}>
                                  <MenuItem className="flex items-center" onClick={onDuplicateService}>
                                    <SvgIcon icon="copy-duplicate-object-add-plus" width={20} height={20} />
                                    <p className="ml-1">{common('duplicate')}</p>
                                  </MenuItem>
                                </AccessibleComponent>
                                <AccessibleComponent object={OBJECTS.SERVICE_MODELS} action={ACTIONS.DELETE}>
                                  <MenuItem className="flex items-center" onClick={onDelete}>
                                    <SvgIcon icon="delete" width={20} height={20} />
                                    <p className="ml-1">{common('delete')}</p>
                                  </MenuItem>
                                </AccessibleComponent>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      );
                    })}
                  </TBody>
                )}
                <TBody>
                  {!listServiceModels?.length && (
                    <Tr>
                      <Td separation={false} className="w-full flex justify-center" colSpan={4}>
                        <div className="flex flex-col items-center">
                          <img src={NoData} alt="Nodata" />
                          <p className="text-sm font-medium text-ic-ink-6s">{common('serviceModelNoData')}</p>
                        </div>
                      </Td>
                    </Tr>
                  )}
                </TBody>
              </Table>
            </div>
          </div>
        </div>
      </LoadingOverlay>
      <ModalDeleteServiceModel open={modalDelete} setOpen={setModalDelete} id={planId ?? ''} />
      <ModalChangeLogServiceModel open={modalChangLog} setOpen={setModalChangeLog} id={planId ?? ''} />
    </LayoutSection>
  );
};

export default ServiceModels;
