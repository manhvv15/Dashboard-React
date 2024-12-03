import { ChangeEvent, useRef, useState } from 'react';

import { Button, Input, SelectPortal, Table, TBody, Td, Th, THead, Tooltip, Tr } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import ImageUpload from '@/public/static/svg/ImageUpload.svg';
import { getUrlAvatar } from '@/services/user-management/application';
import { IBrandingSettings, ReferralImageBrandEnum } from '@/types/user-management/branding';
import { IOptionValidate } from '@/utils/common';
import { ValidFile } from '@/utils/uploadFile';
import SvgIcon from '../commons/SvgIcon';

export const SupportBranding = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { showToast } = useApp();
  const refImgs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<IBrandingSettings>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'referralImages',
  });

  const [imageTypes] = useState<{ id: number; name: string }[]>([
    {
      id: ReferralImageBrandEnum.Android,
      name: 'Android',
    },
    {
      id: ReferralImageBrandEnum.IOS,
      name: 'IOS',
    },
  ]);

  const uploadImgUrl = useMutation({
    mutationFn: getUrlAvatar,
  });

  const onChangeImage = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0] as File;
      const options = {
        minWidth: 60,
        minHeight: 60,
        limitCapacity: 3,
        type: ['jpg', 'png', 'jpeg'],
      } as IOptionValidate;
      const validated = await ValidFile(file, options);

      if (validated.isValid) {
        const formData = new FormData();
        formData.append('File', file);
        uploadImgUrl.mutate(formData, {
          onSuccess(data) {
            setValue(`referralImages.${index}.image`, data.data.uri);
            showToast({
              type: 'success',
              summary: common('uploadImageSuccess'),
            });
          },
        });
      } else {
        showToast({
          type: 'error',
          summary: common('validImage', {
            imageFormat: '.jpg, .png, .jpeg',
            minSizeWidth: 600,
            minSizeHeight: 600,
            capacity: 3,
          }),
        });
      }
    }
  };

  const onChangeImg = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    onChangeImage(event, index);
    if (refImgs && refImgs.current[index] && refImgs.current[index]?.value) {
      refImgs.current[index]!.value = '';
    }
  };

  const onClickChangeImage = (index: number) => {
    refImgs.current[index]?.click();
  };

  const onAddReferrelImage = () => {
    const nextType = imageTypes.find((x) => !(watch('referralImages') ?? []).some((y) => y.type === x.id));
    if (!nextType) {
      return;
    }
    append({
      image: '',
      type: nextType.id,
    });
  };

  const onRemoveReferrelImage = (index: number) => {
    remove(index);
  };

  const onHandleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('supportName', e.target.value);
  };

  const onHandleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('supportLink', e.target.value);
  };

  return (
    <div className="max-w-[1200px] w-full bg-white py-4 px-5 rounded-lg">
      <p className="text-sm font-normal">{common('supportLink')}</p>
      <div className="flex flex-row gap-2 mt-1">
        <div className="flex flex-col">
          <Input
            size={40}
            hiddenClose
            onClearData={() => {}}
            placeholder={common('notification.supportName.placeholder')}
            classNameContainer="w-60"
            value={watch('supportName') ?? ''}
            onChange={onHandleChangeName}
            error={errors?.supportName && errors?.supportName?.message ? true : false}
          />
          {errors?.supportName && errors?.supportName?.message && (
            <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">{errors?.supportName?.message}</p>
          )}
        </div>
        <div className="flex flex-col w-full">
          <Input
            className=""
            size={40}
            hiddenClose
            onClearData={() => {}}
            placeholder={common('notification.supportUrl.placeholder')}
            value={watch('supportLink') ?? ''}
            onChange={onHandleChangeUrl}
            error={errors?.supportLink && errors?.supportLink?.message ? true : false}
          />
          {errors?.supportLink && errors?.supportLink?.message && (
            <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">{errors?.supportLink?.message}</p>
          )}
        </div>
      </div>
      <p className="text-sm font-normal mt-2 flex items-center gap-1">
        {common('notification.referralImage')}
        <Tooltip content={common('notification.referralImage.description')} placement="top">
          <div>
            <SvgIcon
              icon="info-information-circle"
              width={14}
              height={14}
              className="cursor-pointer text-ic-black-6s to-black"
            />
          </div>
        </Tooltip>
      </p>
      <div className="mt-2">
        <Table>
          <THead>
            <Tr>
              <Th className="w-10">#</Th>
              <Th className="w-16">{common('image')}</Th>
              <Th className="flex items-start">{common('typeImage')}</Th>
              <Th className="w-32">{common('action')}</Th>
            </Tr>
          </THead>
          <TBody>
            {(fields ?? []).map((_, index) => {
              const onHandleRemoveImage = () => {
                onRemoveReferrelImage(index);
              };

              const onHandleChangeType = (value: number) => {
                clearErrors(`referralImages.${index}.type`);
                setValue(`referralImages.${index}.type`, value);
              };

              const onHandleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
                onChangeImg(event, index);
              };
              const onHandleClickImage = () => {
                onClickChangeImage(index);
              };
              return (
                <Tr borderBottom key={index}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <div
                      onClick={onHandleClickImage}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          onHandleClickImage();
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {watch(`referralImages.${index}.image`) ? (
                        <img src={watch(`referralImages.${index}.image`)} alt="download app" />
                      ) : (
                        <ImageUpload />
                      )}

                      <input
                        type="file"
                        className="hidden"
                        accept={'.jpg,.png,.jpeg'}
                        ref={(el) => (refImgs.current[index] = el)}
                        onChange={onHandleChangeImage}
                      />
                    </div>
                  </Td>
                  <Td>
                    <SelectPortal
                      placement="bottom-start"
                      options={(imageTypes ?? []).filter(
                        (x) =>
                          x.id === watch(`referralImages.${index}.type`) ||
                          !(watch(`referralImages`) ?? []).some((y) => y.type === x.id),
                      )}
                      onChange={onHandleChangeType}
                      value={watch(`referralImages.${index}.type`)}
                      optionValue="id"
                      optionLabel="name"
                    />
                  </Td>
                  <Td className="">
                    <div className="w-full flex items-center justify-center">
                      <SvgIcon
                        className="cursor-pointer"
                        icon="trash"
                        width={24}
                        height={24}
                        onClick={onHandleRemoveImage}
                      />
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>
      <Button
        className="mt-2 px-0 hover:bg-transparent active:bg-transparent"
        color="primary"
        size="32"
        variant="text"
        startIcon={<SvgIcon icon="plus" width={24} height={24} />}
        onClick={onAddReferrelImage}
        disabled={(watch('referralImages') ?? []).length >= imageTypes.length}
      >
        {common('addImage')}
      </Button>
    </div>
  );
};
