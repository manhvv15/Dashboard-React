import SvgIcon from '@/components/commons/SvgIcon';
import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { regexName } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { createTagRecomented, updateTagRecomented, validatorTagRecom } from '@/services/ship4p/recommented';
import { TagsRecomented, TagsRecomentedRequest, UpdateTagRecomented } from '@/types/ship4p/recomented';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
  Textarea,
} from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
interface props {
  open: boolean;
  onClose: () => void;
  type: 'create' | 'edit';
  dataUpdate?: TagsRecomented;
  index?: number | undefined | null;
}
export const CreateTagRecommented = ({ open, onClose, type, dataUpdate, index }: props) => {
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [openSelectCorlor, setOpenSelectCorlor] = useState<boolean>(false);
  const schemaValidate = yup.object().shape({
    recommendedName: yup
      .string()
      .required(error('required'))
      .matches(regexName, error('error.tagRecommented.validName'))
      .test({
        test: async function (val, context) {
          if (!val) return true;
          try {
            await validatorTagRecom({
              keyword: val,
              id: context.parent.id,
            });
            return this.resolve(true);
          } catch (errorMessage: any) {
            const { errorNormal } = errorMessage;
            return this.createError({
              message: error(errorNormal),
            });
          }
        },
      }),
    backgroundColor: yup.string().required(error('required')),
  });
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    register,
  } = useForm<TagsRecomentedRequest>({
    mode: 'onChange',
    resolver: yupResolver(schemaValidate),
    defaultValues: {
      backgroundColor: 'rgb(0, 0, 0)',
      indexOrder: !index ? (index === 0 ? index + 1 : 0) : index + 1,
    },
  });
  const resetForm = () => {
    setValue('backgroundColor', '');
    setValue('recommendedName', '');
    setValue('description', '');
  };
  useEffect(() => {
    if (type === 'edit' && dataUpdate) {
      setValue('recommendedName', dataUpdate.name ?? '');
      setValue('indexOrder', dataUpdate.index ?? 0);
      setValue('id', dataUpdate.id ?? '');
      setValue('description', dataUpdate.description ?? '');
      setValue('backgroundColor', dataUpdate.backgroundColor ?? '');
    }
  }, [type, dataUpdate]);

  const createTagRecommented = useMutation({
    mutationFn: createTagRecomented,
  });
  const updateTagRecoment = useMutation({
    mutationFn: updateTagRecomented,
  });
  const onHandleTagRecoment = (data: TagsRecomentedRequest) => {
    if (type === 'create') {
      createTagRecommented.mutate(data, {
        onSuccess: () => {
          showToast({
            type: 'success',
            detail: tShip4p('createtagName.succes'),
          });
          onHandleClose();
        },
        onError: () => {
          showToast({
            type: 'error',
            detail: error('export.error'),
          });
        },
      });
    } else {
      const dataUpdate = {
        backgroundColor: data.backgroundColor,
        description: data.description,
        id: data.id,
        index: data.indexOrder,
        name: data.recommendedName,
      } as UpdateTagRecomented;
      updateTagRecoment.mutate(dataUpdate, {
        onSuccess: () => {
          showToast({
            type: 'success',
            detail: tShip4p('updatetagName.succes'),
          });
          onHandleClose();
        },
        onError: () => {
          showToast({
            type: 'error',
            detail: error('export.error'),
          });
        },
      });
    }
  };
  const onClearTagName = () => {
    setValue('recommendedName', '', {
      shouldValidate: true,
    });
    setValue('backgroundColor', '', {
      shouldValidate: true,
    });
  };
  const onChangeTagName = (value: React.ChangeEvent<HTMLInputElement>) => {
    setValue('recommendedName', value.target.value, {
      shouldValidate: true,
    });
    if (value.target.value && !watch('backgroundColor')) {
      setValue('backgroundColor', 'rgb(255, 0, 0)');
    }
  };
  const onChangeColor = (color: string) => {
    setValue('backgroundColor', color);
  };
  const onHandleClose = () => {
    resetForm();
    onClose();
  };
  return (
    <Dialog open={open} handler={onHandleClose} size="sm">
      <DialogHeader>
        <div className="flex justify-between w-full items-center">
          {type === 'create' ? (
            <span className="font-medium text-lg text-ic-ink-6s">{tShip4p('modal.create.tagRecomment.title')}</span>
          ) : (
            <span className="font-medium text-lg text-ic-ink-6s">{tShip4p('modal.edit.tagRecomment.title')}</span>
          )}
          <SvgIcon onClick={onHandleClose} icon="close" className="cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody>
        <div className="mb-2">
          <MixLabel label={tShip4p('modal.create.tagName')} required>
            <div className="flex items-center gap-2">
              <Input
                onClearData={onClearTagName}
                hiddenClose={!watch('recommendedName')}
                error={!!errors.recommendedName?.message}
                value={watch('recommendedName')}
                onChange={onChangeTagName}
                placeholder={tShip4p('modal.create.tagName.placeholder')}
              />
              <Popover open={openSelectCorlor} handler={() => setOpenSelectCorlor(!openSelectCorlor)}>
                <PopoverHandler>
                  <div className="cursor-pointer">
                    <SvgIcon icon="paint" height={24} width={24} />
                  </div>
                </PopoverHandler>
                <PopoverContent>
                  <HexColorPicker color={watch('backgroundColor')} onChange={onChangeColor} />
                </PopoverContent>
              </Popover>
            </div>
            <FormHelperText className="text-ic-red-6s">{errors.recommendedName?.message}</FormHelperText>
          </MixLabel>
        </div>
        <div className="mb-2">
          <div className="flex flex-row gap-10 w-full">
            <span className="text-sm">{tShip4p('modal.create.tagName.preview')}</span>
            {watch('recommendedName') && (
              <div
                className={clsx(
                  'h-5 gap-4 flex px-2 py-0.5 items-center max-w-max border-ic-ink-4s justify-center rounded',
                )}
                style={{
                  backgroundColor: watch('backgroundColor'),
                }}
              >
                <span className={clsx('text-xs', watch('backgroundColor') && 'text-white')}>
                  {watch('recommendedName')}
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          <MixLabel label={tShip4p('modal.create.description')}>
            <Textarea
              value={watch('description')}
              {...register('description')}
              placeholder={tShip4p('modal.create.description.placeholder')}
            />
          </MixLabel>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-4">
        <Button
          type="button"
          size="40"
          className="w-[160px] justify-center items-center"
          variant="outlined"
          onClick={onHandleClose}
        >
          {t('button.cancel')}
        </Button>

        <Button
          type="button"
          size="40"
          className="w-[160px] justify-center items-center"
          disabled={createTagRecommented.isLoading || updateTagRecoment.isLoading}
          loading={createTagRecommented.isLoading || updateTagRecoment.isLoading}
          color="primary"
          variant="filled"
          onClick={handleSubmit(onHandleTagRecoment)}
        >
          {t('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
