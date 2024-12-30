import { Button, FormHelperText, FormLabel, Input, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { LocaleNamespace } from '@/constants/enums/common';
import { useGetAction, useGetApplication, useGetObject } from '@/hooks-query/application';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PermissionMultiple } from '@/types/user-management/permission';

const ModalCreateAndEditMultiple = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t } = useTranslation(LocaleNamespace.Common);

  const {
    control,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<PermissionMultiple>();

  const { fields, append } = useFieldArray({
    control,
    name: 'list',
  });

  const methodOptions = [
    { value: '', label: common('No data') },
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
  ];

  const actions =
    useGetAction({}).data?.data?.items.map((i) => ({
      label: i.name,
      value: i.id,
    })) ?? [];

  const applications =
    useGetApplication({ isSystem: null }).data?.data?.items.map((i) => ({
      label: i.name,
      value: i.id,
    })) ?? [];

  const objects =
    useGetObject({}).data?.data?.items.map((i) => ({
      label: i.name,
      value: i.id,
    })) ?? [];

  const addGroup = () => {
    const lastGroup = watch('list')?.[fields.length - 1];
    if (!lastGroup || !lastGroup.actionId) {
      return;
    }
    append({ actionId: '', method: null, endpoint: null });
  };

  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <div className="mt-2">
          <FormLabel required>{common('application')}</FormLabel>
          <SelectPortal
            options={applications ?? []}
            onChange={(e: string) => setValue('applicationId', e)}
            value={watch('applicationId')}
          />
          {errors?.applicationId?.message && <FormHelperText error>{t(errors.applicationId.message)}</FormHelperText>}
        </div>

        <div className="mt-2">
          <FormLabel required>{common('object')}</FormLabel>
          <SelectPortal
            options={objects ?? []}
            onChange={(e: string) => setValue('objectId', e)}
            value={watch('objectId')}
          />
          {errors?.objectId?.message && <FormHelperText error>{t(errors.objectId.message)}</FormHelperText>}
        </div>

        {fields.map((group, index) => (
          <section key={group.id} className="border border-x-300 rounded-lg p-4 mt-4">
            <div className="mt-2">
              <FormLabel required>{common('action')}</FormLabel>
              <SelectPortal
                options={actions}
                onChange={(e) => setValue(`list.${index}.actionId`, e)}
                value={watch(`list.${index}.actionId`)}
              />
              {errors?.list?.[index]?.actionId?.message && (
                <FormHelperText error>{t(errors.list?.[index]?.actionId?.message ?? '')}</FormHelperText>
              )}
            </div>
            <div className="mt-2">
              <FormLabel>{common('method')}</FormLabel>
              <SelectPortal
                options={methodOptions}
                onChange={(e) => setValue(`list.${index}.method`, e)}
                value={watch(`list.${index}.method`)}
              />
            </div>
            <div className="mt-4">
              <FormLabel>{common('endpoint')}</FormLabel>
              <Input
                value={watch(`list.${index}.endpoint`) || ''}
                onChange={(e) => setValue(`list.${index}.endpoint`, e.target.value)}
              />
            </div>
          </section>
        ))}

        <div className="mt-4">
          <Button type="button" onClick={addGroup}>
            {common('addAction')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateAndEditMultiple;
