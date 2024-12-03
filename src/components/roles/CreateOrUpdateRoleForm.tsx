import { ChangeEvent, useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  CheckboxTree,
  Collapse,
  FormHelperText,
  FormLabel,
  Input,
  SelectPortal,
  Textarea,
  TreeNode,
} from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

import { LocaleNamespace } from '@/constants/enums/common';
import { useGetApplication } from '@/hooks-query/application';
import { getTreePermission } from '@/services/user-management/permission';
import { getRoleById } from '@/services/user-management/role';
import { FormRole, RoleByIdResponse } from '@/types/user-management/role';

import SvgIcon from '../commons/SvgIcon';

interface IProps {
  id?: string;
}
export const CreateOrUpdateRoleForm = ({ id }: IProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [textSearch, setTextSearch] = useState<string>();
  const [visible, setVisible] = useState(true);
  const [isSavePermisisonsSeleted, setIsSavePermisisonsSeleted] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(true);

  const handleToggle = () => setVisible((prevState) => !prevState);

  const searchDebounce = useDebounce(textSearch);

  const applications =
    useGetApplication({
      isSystem: null,
    }).data?.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];

  useQuery({
    queryKey: ['getRoleById', id],
    queryFn: () => getRoleById(id as string),
    enabled: !!id,
    onSuccess: (data: AxiosResponse<RoleByIdResponse>) => {
      setValue('code', data.data.code);
      setValue('name', data.data.name);
      setValue('isDefault', data.data.isDefault);
      setValue('applicationId', data.data.applicationId);
      setValue('accessDataType', data.data.accessDataType);
      setValue('description', data.data.description);
      setValue('permissionIds', data.data.permissionIds);
    },
  });

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<FormRole>();

  const permissions = useQuery({
    queryKey: ['getTreePermission', getValues('applicationId')],
    queryFn: () =>
      getTreePermission({
        applicationId: getValues('applicationId') ?? '',
        workspaceId: '',
      }),
    enabled: !!getValues('applicationId'),
  }).data?.data;

  const handleChangeApplication = (data?: string) => {
    setIsSavePermisisonsSeleted(true);
    setValue('applicationId', data ?? '');
  };

  const onChangePermission = (input: TreeNode[]) => {
    const permissonIdsSelected = input.length > 0 ? input?.map((el) => el.value?.toString()) : [];
    setValue('permissionIds', permissonIdsSelected);
  };

  const getAllValuesFromTree = (tree: TreeNode) => {
    let values: string[] = [];
    values.push(tree.value);

    if (tree.children && tree.children.length > 0) {
      tree.children.forEach((child) => {
        const childValues = getAllValuesFromTree(child);
        values = values.concat(childValues);
      });
    }
    return values;
  };

  const [allPermissionIds, setAllPermissionIds] = useState<string[]>();
  const getAllValuesFromTrees = (trees: TreeNode[]) => {
    let values: string[] = [];
    trees.forEach((tree) => {
      const ids = getAllValuesFromTree(tree);
      values = values.concat(ids);
    });
    return values;
  };

  const onChangeSelectAll = (event?: ChangeEvent<HTMLInputElement>) => {
    setIsSelectAll(event?.target.checked ?? true);
    if (event?.target.checked && allPermissionIds) {
      setValue('permissionIds', allPermissionIds);
    } else {
      setValue('permissionIds', []);
    }
  };
  const onHandleClearAll = () => {
    setIsSelectAll(false);
    setValue('permissionIds', []);
  };

  const onChangeTextSearchPermission = (event?: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event?.target.value);
  };
  const handleChangeName = (event?: ChangeEvent<HTMLInputElement>) => {
    if (!!event?.target.value && !!event?.target.value.trim()) setValue('code', processString(event?.target.value));
  };
  const processString = (inputString: string) => {
    const normalizedString = inputString.normalize('NFD');
    const withoutDiacritics = normalizedString.replace(/[\u0300-\u036f]/g, '');

    const words = withoutDiacritics.split(' ');
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    const processedString = capitalizedWords.join('');

    return processedString;
  };

  useEffect(() => {
    if (permissions) {
      const ids = getAllValuesFromTrees(permissions);
      setAllPermissionIds(ids);
      setIsSavePermisisonsSeleted(false);
      if (!id && isSavePermisisonsSeleted) setValue('permissionIds', ids);
    }
  }, [permissions, isSavePermisisonsSeleted]);

  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <button className="font-medium border-b-[1px] pb-2 w-full text-left flex" onClick={handleToggle}>
          {common('role.roleInfomation')}
          <SvgIcon width={24} height={24} icon={visible ? 'arrow-up' : 'arrow-2'} className="ml-2" />
        </button>
        <Collapse orientation="vertical" expanded={visible}>
          <div className="flex">
            <div className="grid grid-cols-3 gap-4 flex-1">
              <div className="mt-4">
                <FormLabel required>{common('application')}</FormLabel>
                <SelectPortal
                  placeholder={common('application')}
                  options={applications ?? []}
                  onChange={(e: any) => handleChangeApplication(e)}
                  value={watch('applicationId')}
                />
                {errors?.applicationId?.message && (
                  <FormHelperText error>{error(errors?.applicationId?.message)}</FormHelperText>
                )}
              </div>
              <div className="mt-4">
                <FormLabel required>{t('role.name')}</FormLabel>
                <Input
                  {...register('name')}
                  feedbackInvalid={errors?.name?.message}
                  classNameContainer="mt-2"
                  placeholder={t('role.name')}
                  hiddenClose
                  onChange={(el) => handleChangeName(el)}
                  name="name"
                />
                {errors?.name?.message && <FormHelperText error>{t(errors?.name?.message)}</FormHelperText>}
              </div>
              <div className="mt-4">
                <FormLabel required>{t('role.code')}</FormLabel>
                <Input
                  {...register('code')}
                  feedbackInvalid={errors?.code?.message}
                  classNameContainer="mt-2"
                  placeholder={t('role.code')}
                  hiddenClose
                  name="code"
                />
                {errors?.code?.message && <FormHelperText error>{t(errors?.code?.message)}</FormHelperText>}
              </div>
            </div>
            <div className="mt-14 ml-3">
              <Checkbox {...register('isDefault')} label="Is default" />
            </div>
          </div>

          <div className="mt-4">
            <FormLabel>{common('description')}</FormLabel>
            <Textarea cols={50} placeholder={common('role.description')} rows={5} {...register('description')} />
            {errors?.description?.message && (
              <FormHelperText error>{error(errors?.description?.message)}</FormHelperText>
            )}
          </div>
        </Collapse>
      </div>
      <div className="bg-ic-white-6s p-4 rounded-lg mt-3 ">
        <div className="font-medium border-b-[1px] pb-2">
          <div className="flex justify-between">{common('role.selectPermission')}</div>
        </div>
        {watch('applicationId') && (
          <Input
            classNameContainer="mt-2"
            placeholder={t('role.selectPermissionTextSearch')}
            hiddenClose
            name="name"
            onChange={onChangeTextSearchPermission}
          />
        )}
        {permissions != null && permissions.length > 0 ? (
          <div>
            <div className="mt-4">
              <div className="my-4 flex">
                <Checkbox
                  label={common('selectAllFunctions')}
                  onChange={(e) => onChangeSelectAll(e)}
                  checked={isSelectAll}
                />
                <Button
                  className="text-ic-primary-6s cursor-pointer ml-2"
                  variant="text"
                  onClick={() => onHandleClearAll()}
                >
                  {common('clearAll')}
                </Button>
              </div>
              <div className="mt-4 max-h-[500px] overflow-y-auto scrollbar">
                <CheckboxTree
                  filters={{ keyword: searchDebounce }}
                  nodes={permissions ?? []}
                  value={watch('permissionIds')}
                  onChange={(el) => onChangePermission(el)}
                ></CheckboxTree>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col w-full h-[350px]">
            <img src={'/static/svg/noDataIcon.svg'} alt="NodataIcon" />
            <div>{common('role.noPermission')}</div>
          </div>
        )}
      </div>
    </div>
  );
};
