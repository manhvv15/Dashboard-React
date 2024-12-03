import SvgIcon from '@/components/commons/SvgIcon';
import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { listShippingTypeSearch } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { getCarrierSystems } from '@/services/ship4p/carrier-system';
import { createRecommentedEntry, updateRecomentedEntry, validateEntryRecoment } from '@/services/ship4p/recommented';
import { getAllCountries } from '@/services/user-management/master-data';
import { CourierAccountViewModel } from '@/types/ship4p/carrier';
import { CreateRecommendedEntries, TagRecommened, TagsRecomented } from '@/types/ship4p/recomented';
import { CountryApi } from '@/types/user-management/master-data';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  MultipleSelect,
  SelectPortal,
} from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
interface props {
  open: boolean;
  onClose: () => void;
  type: 'create' | 'edit';
  dataUpdate?: CreateRecommendedEntries;
  tagRecomments: TagsRecomented[] | undefined;
}
export const CreateRecomentedEntry = ({ onClose, type, dataUpdate, open, tagRecomments }: props) => {
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [countries, setCountries] = useState<CountryApi[]>();
  const listShippingRateCarrier = listShippingTypeSearch(tShip4p);
  const [listCouriersystem, setListCouriersystem] = useState<CourierAccountViewModel[]>([]);

  const onHandleClose = () => {
    resetForm();
    onClose();
  };
  const schemaValidate = yup.object().shape({
    accountSystemId: yup
      .string()
      .required(error('required'))
      .test({
        test: async function (val, context) {
          if (!val) return true;
          try {
            await validateEntryRecoment({
              accountSystemId: val,
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
    countryId: yup.string().required(error('required')),
    countryName: yup.string().required(error('required')),
    shippingType: yup.number().required(error('required')),
    countryCode: yup.string().required(error('required')),
  });
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<CreateRecommendedEntries>({
    mode: 'onBlur',
    resolver: yupResolver(schemaValidate),
  });
  useQuery({
    queryFn: () => getAllCountries(),
    onSuccess: (res) => {
      setCountries(res.data);
    },
  });
  useQuery({
    queryKey: ['getCourierSystemShip4p', watch('countryId'), watch('shippingType')],
    queryFn: () =>
      getCarrierSystems({
        countryIds: [watch('countryId')],
        shippingTypies: [watch('shippingType')],
      }),
    onSuccess: (res) => {
      const accountSystems = res.data.find((e) => e.countryId.includes(watch('countryId')));
      setListCouriersystem(accountSystems?.courierViewModels || []);
    },
  });

  const createRecomentEntry = useMutation({
    mutationFn: createRecommentedEntry,
  });
  const updateRecomentEntry = useMutation({
    mutationFn: updateRecomentedEntry,
  });
  const resetForm = () => {
    setValue('countryCode', '');
    setValue('countryCode', '');
    setValue('accountSystemId', '');
    setValue('countryId', '');
    setValue('recommeneds', []);
  };
  useEffect(() => {
    if (type === 'edit' && dataUpdate) {
      setValue('countryCode', dataUpdate.countryCode ?? '');
      setValue('countryName', dataUpdate.countryName);
      setValue('countryId', dataUpdate.countryId ?? '');
      setValue('accountSystemId', dataUpdate.accountSystemId ?? '');
      setValue('accountSystemIdUpdate', dataUpdate.accountSystemId ?? '');
      setValue('shippingType', dataUpdate.shippingType ?? '');
      setValue('recommeneds', dataUpdate.recommeneds ?? []);
      setValue('id', dataUpdate.id ?? []);
    }
  }, [type, dataUpdate]);
  const onChangeSelectCountry = (value: string) => {
    const countrySelected = countries?.find((e) => value.includes(e.id));
    setValue('countryId', countrySelected?.id ?? '', {
      shouldValidate: true,
    });
    setValue('countryCode', countrySelected?.code ?? '');
    setValue('countryName', countrySelected?.name ?? '');
  };
  const onChangeSelectShipingType = (value: number) => {
    setValue('shippingType', value, {
      shouldValidate: true,
    });
  };
  const onChangeSelectCarrireSystem = (value: string) => {
    switch (type) {
      case 'edit':
        setValue('accountSystemIdUpdate', value, {
          shouldValidate: true,
        });
        break;
      case 'create':
        setValue('accountSystemId', value, {
          shouldValidate: true,
        });
        break;
      default:
        break;
    }
  };
  const onChangeSelectTagRecoment = (value: string[]) => {
    const tags = tagRecomments
      ?.filter((e) => value.includes(e.id))
      .map(
        (e) =>
          ({
            tagId: e.id,
            backgroundColor: e.backgroundColor,
            index: e.index,
            name: e.name,
          }) as TagRecommened,
      );
    setValue('recommeneds', tags || [], {
      shouldValidate: true,
    });
  };
  const onHandleRecomentEntry = (data: CreateRecommendedEntries) => {
    if (type === 'create') {
      createRecomentEntry.mutate(data, {
        onSuccess: () => {
          showToast({
            type: 'success',
            detail: tShip4p('create.recoment.entry.succes'),
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
      updateRecomentEntry.mutate(data, {
        onSuccess: () => {
          showToast({
            type: 'success',
            detail: tShip4p('update.recoment.entry.succes'),
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
  return (
    <Dialog open={open} handler={onHandleClose} size="sm">
      <DialogHeader>
        <div className="flex justify-between w-full items-center">
          {type === 'create' ? (
            <span className="font-medium text-lg text-ic-ink-6s">{tShip4p('modal.create.recommentEntry.title')}</span>
          ) : (
            <span className="font-medium text-lg text-ic-ink-6s">{tShip4p('modal.edit.recommentEntry.title')}</span>
          )}
          <SvgIcon onClick={onHandleClose} icon="close" className="cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody>
        <div className="mb-2">
          <MixLabel label={tShip4p('modal.create.recomented.country')} required>
            <SelectPortal
              options={countries || []}
              optionValue="id"
              optionLabel="name"
              value={watch('countryId')}
              placeholder={tShip4p('modal.create.recomented.country.placeholder')}
              onChange={onChangeSelectCountry}
              error={!!errors.countryId?.message}
              helperText={errors.countryId?.message}
            />
          </MixLabel>
        </div>
        <div className="mb-2">
          <MixLabel label={tShip4p('modal.create.recomented.shippingType')} required>
            <SelectPortal
              options={listShippingRateCarrier || []}
              optionValue="value"
              optionLabel="label"
              value={watch('shippingType') as number}
              placeholder={tShip4p('modal.create.recomented.shippingType.placeholder')}
              onChange={onChangeSelectShipingType}
              error={!!errors.shippingType?.message}
              helperText={errors.shippingType?.message}
            />
          </MixLabel>
        </div>
        <div className="mb-2">
          <MixLabel label={tShip4p('modal.create.recomented.carrier')} required>
            <SelectPortal
              options={listCouriersystem || []}
              optionValue="id"
              optionLabel="courierName"
              value={type === 'create' ? watch('accountSystemId') : watch('accountSystemIdUpdate')}
              placeholder={tShip4p('modal.create.recomented.carrier.placeholder')}
              onChange={onChangeSelectCarrireSystem}
              error={!!errors.accountSystemId?.message}
              helperText={errors.accountSystemId?.message}
            />
          </MixLabel>
        </div>
        <div className="mb-2">
          <MixLabel label={tShip4p('modal.create.recomented.tag')}>
            <MultipleSelect
              options={tagRecomments || []}
              optionValue="id"
              optionLabel="name"
              value={watch('recommeneds')?.map((e) => e.tagId)}
              placeholder={tShip4p('modal.create.recomented.tag.placeholder')}
              onChange={onChangeSelectTagRecoment}
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
          disabled={createRecomentEntry.isLoading || updateRecomentEntry.isLoading}
          loading={createRecomentEntry.isLoading || updateRecomentEntry.isLoading}
          color="primary"
          variant="filled"
          onClick={handleSubmit(onHandleRecomentEntry)}
        >
          {t('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
