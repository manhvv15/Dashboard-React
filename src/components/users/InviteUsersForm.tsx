import { FormHelperText, MultipleSelect, MultiTag } from '@ichiba/ichiba-core-ui';
import { Item } from '@ichiba/ichiba-core-ui/dist/components/multi-tag/MultiTag';
import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { REGEX_EMAIL } from '@/constants/variables/regexException';
import { useGetApplication } from '@/hooks-query/application';
import { getOrganizationPaging } from '@/services/user-management/organization';
import { getRolePaging } from '@/services/user-management/role';
import { RoleStatusEnum } from '@/types/user-management/role';
import { FormApplicationRole, FormInviteUser } from '@/types/user-management/user';

import { ApplicationItem } from './ApplicationItem';

export const InviteUsersForm = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormInviteUser>();
  const applicationSelected = watch('applicationRoles');

  useGetApplication({
    isSystem: true,
    onSuccess: (data) => {
      const applications = data.data.items.map(
        (el) =>
          ({
            id: el.id,
            logoUrl: el.logoUrl,
            name: el.name,
            roleIds: [],
            roles: [],
          }) as FormApplicationRole,
      );
      setValue('applicationRoles', applications ?? []);
    },
  });

  const roles = useQuery({
    queryKey: ['getRolePaging'],
    queryFn: () =>
      getRolePaging({
        pageNumber: 0,
        pageSize: 100,
        keyword: '',
        applicationIds: [],
        status: [RoleStatusEnum.Active],
        workspaceId: '',
      }),
    retry: true,
  }).data?.data.items;

  const organizations = useQuery({
    queryKey: ['getOrganizations'],
    queryFn: () => getOrganizationPaging({ pageNumber: 0, pageSize: 1000, workspaceId: '' }),
    select: (response) => {
      return response.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];
    },
  }).data;

  const handleChangeOrganizations = (data?: any) => {
    setValue('organizationIds', data);
  };

  const handleChangeEmail = (emails?: Item[]) => {
    const input = emails?.map((i) => i as string) ?? [];
    setValue('emails', input, {
      shouldValidate: true,
    });
  };

  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <div className="font-medium pb-0.5 text-base text-black">{common('user.inviteUsersTitle')}</div>
        <div className="font-medium border-b-[1px] pb-2 text-sm text-ic-black-5s">
          {common('user.inviteUsersDescription')}
        </div>
        <div className="mt-3">
          <div className="mb-1 text-sm">
            {common('emailAddress')} <span className="text-red-500">*</span>
          </div>
          <MultiTag
            className="!h-[100px]"
            regexItem={REGEX_EMAIL}
            placeholder="Eg: abc@gmail.com"
            onChange={handleChangeEmail}
            error={!!errors.emails?.message}
          />
          <div className="ml-1">
            {!!errors.emails?.message && <FormHelperText error>{errors.emails?.message}</FormHelperText>}
            {!errors.emails?.message && (
              <p className="text-sm font-medium text-ic-black-5s mt-0.5">
                {common('user.separateEmailsByUsingCommaOrEnterButton')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-ic-white-6s p-4 rounded-lg mt-3 ">
        <div className="font-medium border-b-[1px] pb-2">{common('user.selectApplicationsUserCanAccessTo')}</div>
        <div className="relative w-full shadow-1 mt-4 rounded-md overflow-hidden">
          <table className="table w-full bg-white text-sm">
            <thead className="border-b-2 border-ic-ink-2 bg-ic-ink-1s table table-fixed w-full">
              <tr>
                <th
                  className="py-3 px-3 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%]  before:bg-ic-ink-2s before:right-0 before:top-[50%] before:translate-y-[-50%]"
                  align="left"
                >
                  <span className="text-sm font-medium">{common('applications')}</span>
                </th>
                <th className="py-3 px-3" align="left">
                  <span className="text-sm font-medium">
                    {common('applicationRole')} <span className="text-red-500">*</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="scroll block w-full overflow-y-auto">
              {applicationSelected &&
                applicationSelected?.map((item, index) => {
                  const updateAppRole = (roleIds?: string[]) => {
                    setValue(
                      `applicationRoles.${index}`,
                      {
                        ...item,
                        roleIds: roleIds ? [...roleIds] : item.roleIds,
                      },
                      {
                        shouldValidate: true,
                      },
                    );
                  };
                  const error = errors.applicationRoles?.[index]?.roleIds?.message;

                  return (
                    <ApplicationItem
                      data={item}
                      appRoles={roles?.filter((x) => x.applicationId == item.id) ?? []}
                      key={index}
                      updateAppRole={updateAppRole}
                      error={error}
                      rolesSelected={item.roleIds}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-ic-white-6s p-4 rounded-lg mt-3">
        <div className="font-medium pb-0.5 text-base text-black">{common('selectGroupRoleForUsersToAccess')}</div>
        <div className="mt-2">
          <MultipleSelect
            options={organizations ?? []}
            placeholder={common('groupRole')}
            onChange={(e) => handleChangeOrganizations(e)}
            showSelected="all"
          ></MultipleSelect>
        </div>
      </div>
    </div>
  );
};
