import { FormHelperText, MultipleSelect } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

interface IAppItems {
  appRoles: Array<any>;
  rolesSelected: string[] | undefined;
  updateAppRole: (roleIds?: string[]) => void;
  error?: string;
}

export function ApplicationRoleForm({ appRoles, updateAppRole, error, rolesSelected }: IAppItems) {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  return (
    <div className="flex flex-col">
      <MultipleSelect
        options={appRoles}
        value={rolesSelected}
        placeholder={common('user.selectRole')}
        optionLabel={(option) => {
          return (
            <div className="flex flex-col w-full">
              <div className="text-sm">
                {option.label}
                {option.isSystem && (
                  <div className="ml-2 rounded border border-ic-blue-6s text-xs leading-5 font-normal text-ic-blue-6s px-2 bg-ic-blue-1s inline-block">
                    {common('systemRole')}
                  </div>
                )}
              </div>
            </div>
          );
        }}
        tagLabel="label"
        optionValue="value"
        className="w-full"
        onChange={updateAppRole}
        error={!!error}
        showSelected={2}
      />
      {!!error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
}
