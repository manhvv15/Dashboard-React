import { useState } from 'react';

import { Button, DragDropContext, Draggable, Droppable, DropResult, Input, SelectPortal } from '@ichiba/ichiba-core-ui';
import clsx from 'clsx';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { IBrandingSettings, ISocialBranding, SocialBrandingEnum } from '@/types/user-management/branding';
import SvgIcon from '../commons/SvgIcon';

export const SocialBranding = () => {
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
    name: 'socials',
  });

  const [socials] = useState<ISocialBranding[]>([
    {
      type: SocialBrandingEnum.Facebook,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/facebook_20240730070628238.png',
      name: 'Facebook',
    },
    {
      type: SocialBrandingEnum.Instagram,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/instagram_20240730070641495.png',
      name: 'Instagram',
    },
    {
      type: SocialBrandingEnum.Google,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/google_20240730070440971.png',
      name: 'Google',
    },
    {
      type: SocialBrandingEnum.TikTok,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/tiktok_20240730070424373.png',
      name: 'TikTok',
    },
    {
      type: SocialBrandingEnum.Zalo,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/zalo_20240730070541007.png',
      name: 'Zalo',
    },
    {
      type: SocialBrandingEnum.Sendo,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/sendo_20240730070606340.png',
      name: 'Sendo',
    },
    {
      type: SocialBrandingEnum.Tiki,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/tiki_20240730070454766.png',
      name: 'Tiki',
    },
    {
      type: SocialBrandingEnum.Lazada,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/lazada_20240730070526134.png',
      name: 'Lazada',
    },
    {
      type: SocialBrandingEnum.Apple,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/7/30/apple_20240730070352926.png',
      name: 'Apple',
    },
    {
      type: SocialBrandingEnum.Youtube,
      url: '',
      logo: 'https://api.ichiba.net/storage/files/ichiba-prod/org/public/social/logo/2024/10/2/logo_youtube_20241002045312032.png',
      name: 'Youtube',
    },
  ]);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorder = (list: ISocialBranding[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };
    clearErrors('socials');
    const data = reorder(watch('socials') ?? [], result.source.index, result.destination.index);

    setValue('socials', [...data]);
  };

  const getItemStyle2 = (isDragging: any, draggableStyle: any) => ({
    userSelect: 'none',

    background: isDragging ? '#F9F9F9' : '',

    ...draggableStyle,
  });

  const onAddSocialMedia = () => {
    const nextSocial = socials.filter((x) => !(watch('socials') ?? []).some((z) => z.type === x.type))[0];
    append({
      type: nextSocial.type,
      url: '',
      name: nextSocial.name,
      logo: nextSocial.logo,
    });
  };

  const onRemoveSocialMedia = (index: number) => {
    remove(index);
  };

  return (
    <div className="max-w-[1200px] w-full bg-white py-4 px-5 rounded-lg">
      <p className="text-sm font-medium">{common('notification.socialMedia')}</p>
      {fields && fields.length > 0 && (
        <p className="text-sm font-normal mt-4 pl-2">{common('notification.flatForm')}</p>
      )}
      <div className="mt-1">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                className="flex flex-col gap-y-4 overflow-hidden"
                {...provided.droppableProps}
              >
                {fields?.map((item, index) => {
                  const onHandleRemove = () => {
                    onRemoveSocialMedia(index);
                  };
                  const onHandleChangeUrl = (e: any) => {
                    clearErrors(`socials.${index}.url`);
                    setValue(`socials.${index}.url`, e.target.value);
                  };
                  const onHandleChangeSocialType = (type: number) => {
                    clearErrors(`socials.${index}.type`);
                    const chooseSocial = socials.find((t) => t.type === type);
                    setValue(`socials.${index}.type`, type);
                    setValue(`socials.${index}.logo`, chooseSocial?.logo);
                    setValue(`socials.${index}.name`, chooseSocial?.name);
                  };
                  return (
                    <Draggable key={item.type} draggableId={item.type.toString()} index={index}>
                      {(provided, snapshot) => (
                        <button
                          key={item.type}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={getItemStyle2(snapshot.isDragging, provided.draggableProps.style)}
                          className={clsx('flex flex-row gap-2 items-start justify-between content-between')}
                        >
                          <div>
                            <div className="flex gap-x-2 rounded-lg border border-ic-ink-2s shadow-sm w-44 justify-between">
                              <div className="flex gap-x-2 items-center">
                                <button {...provided.dragHandleProps}>
                                  <SvgIcon icon="dots" width={20} height={20} className="text-ic-ink-6s" />
                                </button>
                                <img
                                  src={`${socials.find((t) => t.type === watch(`socials.${index}.type`))?.logo}`}
                                  className="w-7 h-7"
                                  width={24}
                                  height={24}
                                  alt={item.name ?? 'logo social'}
                                />
                              </div>
                              <SelectPortal
                                placement="bottom-start"
                                options={
                                  socials.filter(
                                    (x) =>
                                      x.type === watch(`socials.${index}.type`) ||
                                      !(watch('socials') ?? []).some((z) => z.type === x.type),
                                  ) ?? []
                                }
                                onChange={onHandleChangeSocialType}
                                value={watch(`socials.${index}.type`)}
                                defaultValue={watch(`socials.${index}.type`)}
                                optionValue="type"
                                optionLabel="name"
                                size="40"
                                outline={false}
                                //error={errors?.socials && errors?.socials[index]?.type?.message ? true : false}
                              />
                            </div>
                            {/* {errors?.socials && errors?.socials[index]?.type?.message && (
                              <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">
                                {errors?.socials[index]?.type?.message}
                              </p>
                            )} */}
                          </div>

                          <div className="flex-1 flex flex-col items-start content-start">
                            <div className="flex flex-row w-full items-center justify-center gap-2">
                              <Input
                                size={40}
                                hiddenClose
                                placeholder={common('notification.social.placeholder')}
                                value={watch(`socials.${index}.url`)}
                                onChange={onHandleChangeUrl}
                                error={errors?.socials && errors?.socials[index]?.url?.message ? true : false}
                              />
                              <SvgIcon icon="trash" width={24} height={24} onClick={onHandleRemove} />
                            </div>

                            {errors?.socials && errors?.socials[index]?.url?.message && (
                              <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">
                                {errors?.socials[index]?.url?.message}
                              </p>
                            )}
                          </div>
                        </button>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <Button
        className="mt-4 px-0 hover:bg-transparent active:bg-transparent"
        color="primary"
        size="32"
        variant="text"
        startIcon={<SvgIcon icon="plus" width={24} height={24} />}
        onClick={onAddSocialMedia}
        disabled={(watch('socials') ?? []).length >= socials.length}
      >
        {common('notification.addSocialMedia')}
      </Button>
    </div>
  );
};
