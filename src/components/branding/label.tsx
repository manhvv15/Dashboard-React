import { useState } from 'react';

import SvgIcon from '@/components/commons/SvgIcon';
import { Button, Input, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { IBrandingSettings, LabelBrandingPositionEnum, LabelBrandingTypeEnum } from '@/types/user-management/branding';

export const LabelBranding = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<IBrandingSettings>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'labels',
  });

  const [LabelPositions] = useState<{ id: number; name: string }[]>([
    {
      id: LabelBrandingPositionEnum.TopCenter,
      name: 'Top Center',
    },
    {
      id: LabelBrandingPositionEnum.TopLeft,
      name: 'Top Left',
    },
    {
      id: LabelBrandingPositionEnum.TopRight,
      name: 'Top Right',
    },
    {
      id: LabelBrandingPositionEnum.BottomCenter,
      name: 'Bottom Center',
    },
    {
      id: LabelBrandingPositionEnum.BottomLeft,
      name: 'Bottom Left',
    },
    {
      id: LabelBrandingPositionEnum.BottomRight,
      name: 'Bottom Right',
    },
  ]);

  const [labelTypes] = useState<{ id: number; name: string }[]>([
    {
      id: LabelBrandingTypeEnum.DirectLink,
      name: 'Direct Link',
    },
    {
      id: LabelBrandingTypeEnum.FirstTimeUser,
      name: 'First Time User',
    },
    {
      id: LabelBrandingTypeEnum.HelpCenter,
      name: 'Help Center',
    },
    {
      id: LabelBrandingTypeEnum.MyAccount,
      name: 'My Account',
    },
    {
      id: LabelBrandingTypeEnum.PrivacyPolicy,
      name: 'Privacy Policy',
    },
    {
      id: LabelBrandingTypeEnum.TermAndCondition,
      name: 'Term And Condition',
    },
    {
      id: LabelBrandingTypeEnum.AboutUs,
      name: 'About Us',
    },
  ]);

  const onAddLabelBranding = () => {
    append({
      name: '',
      type: LabelBrandingTypeEnum.DirectLink,
      url: '',
      position: LabelPositions.filter((x) => !(watch('labels') ?? []).some((z) => z.position === x.id))[0].id,
    });
  };

  const onRemoveLabelBranding = (index: number) => {
    remove(index);
  };

  return (
    <div className="max-w-[1200px] w-full bg-white py-4 px-5 rounded-lg">
      {fields?.length === 0 && <p className="text-sm font-medium ">{common('label')}</p>}
      <div className="flex flex-col gap-2">
        {(fields ?? []).map((item, index) => {
          const onHandleRemove = () => {
            onRemoveLabelBranding(index);
          };

          const onHandleChangeType = (type: number) => {
            clearErrors(`labels.${index}.type`);
            if (type !== LabelBrandingTypeEnum.DirectLink) {
              const nameType = labelTypes.find((x) => x.id === type)?.name ?? '';
              clearErrors(`labels.${index}.name`);
              setValue(`labels.${index}.name`, nameType);
            }

            setValue(`labels.${index}.type`, type);
          };

          const onHandleChangePosition = (position: number) => {
            clearErrors(`labels.${index}.position`);
            setValue(`labels.${index}.position`, position);
          };

          const onHandleChangeName = (e: any) => {
            clearErrors(`labels.${index}.name`);
            setValue(`labels.${index}.name`, e.target.value);
          };

          const onHandleChangeUrl = (e: any) => {
            clearErrors(`labels.${index}.url`);
            setValue(`labels.${index}.url`, e.target.value);
          };
          return (
            <div className="flex flex-col" key={item.id}>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium ">{common('label')}</p>
                <Button className="" color="primary" size="32" variant="text" onClick={onHandleRemove}>
                  {common('notification.remove')}
                </Button>
              </div>
              <SelectPortal
                placement="bottom-start"
                options={
                  labelTypes.filter(
                    (x) =>
                      x.id === LabelBrandingTypeEnum.DirectLink ||
                      x.id === watch(`labels.${index}.type`) ||
                      !(watch('labels') ?? []).some((z) => z.type === x.id),
                  ) ?? []
                }
                onChange={onHandleChangeType}
                value={watch(`labels.${index}.type`)}
                optionValue="id"
                optionLabel="name"
              />
              <div className="mt-2 pl-2">
                <p className="text-sm font-medium">{common('labelName')}</p>
                <div className="flex flex-row gap-2 mt-1 w-full">
                  <div className="flex flex-col">
                    <Input
                      size={40}
                      placeholder={common('notification.labelName.placeholder')}
                      classNameContainer="w-52"
                      value={watch(`labels.${index}.name`)}
                      onChange={onHandleChangeName}
                      disabled={watch(`labels.${index}.type`) !== LabelBrandingTypeEnum.DirectLink}
                      error={errors?.labels && errors?.labels[index]?.name?.message ? true : false}
                    />
                    {errors?.labels && errors?.labels[index]?.name?.message && (
                      <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">
                        {errors?.labels[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    <Input
                      size={40}
                      placeholder={common('notification.labelUrl.placeholder')}
                      value={`${watch(`labels.${index}.url`)}`}
                      onChange={onHandleChangeUrl}
                      error={errors?.labels && errors?.labels[index]?.url?.message ? true : false}
                    />
                    {errors?.labels && errors?.labels[index]?.url?.message && (
                      <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">
                        {errors?.labels[index]?.url?.message}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">{common('labelPosition')}</p>
                <SelectPortal
                  placement="bottom-start"
                  options={
                    LabelPositions.filter(
                      (x) =>
                        x.id === watch(`labels.${index}.position`) ||
                        !(watch('labels') ?? []).some((z) => z.position === x.id),
                    ) ?? []
                  }
                  onChange={onHandleChangePosition}
                  value={watch(`labels.${index}.position`)}
                  optionValue="id"
                  optionLabel="name"
                  className="mt-1"
                />
              </div>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-2 px-0 hover:bg-transparent active:bg-transparent"
        color="primary"
        size="32"
        variant="text"
        startIcon={<SvgIcon icon="plus" width={24} height={24} />}
        onClick={onAddLabelBranding}
        disabled={(watch('labels') ?? []).length >= LabelPositions.length}
      >
        {common('addLabel')}
      </Button>
    </div>
  );
};
