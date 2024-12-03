import { FormHelperText, MultipleSelect } from '@ichiba/ichiba-core-ui';
import { t } from 'i18next';

import { FormApplicationRole } from '@/types/user-management/user';

interface IAppItems {
  data: FormApplicationRole;
  appRoles: Array<any>;
  rolesSelected: string[] | undefined;
  updateAppRole: (roleIds?: string[]) => void;
  error?: string;
}

export function ApplicationItem({ data, appRoles, updateAppRole, error, rolesSelected }: IAppItems) {
  return (
    <tr key={`${data.id}`} className="border-b border-ic-ink-2s  last:border-none table-fixed table w-full">
      <td
        className=" px-4 py-2 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%] before:bg-ic-ink-2s before:right-0 before:top-[50%] before:translate-y-[-50%]"
        align={'left'}
      >
        <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
          <img className="w-8 h-8 rounded-full object-cover" src={data.logoUrl ?? '/static/svg/profile.svg'} alt="" />
          <div className="mx-2">{data.name}</div>
        </div>
      </td>
      <td className="px-4 py-2 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%] before:right-0 before:top-[50%] before:translate-y-[-50%]">
        <div className="flex flex-col">
          <MultipleSelect
            options={appRoles}
            placeholder={t('user.selectRole')}
            value={rolesSelected}
            optionLabel={(option) => {
              return (
                <div className="flex flex-col">
                  <div className="text-base">{option.name}</div>
                </div>
              );
            }}
            tagLabel="name"
            optionValue="id"
            className="w-full"
            onChange={updateAppRole}
            error={!!error}
          />
          {!!error && <FormHelperText error>{error}</FormHelperText>}
        </div>
      </td>
    </tr>
  );
}
