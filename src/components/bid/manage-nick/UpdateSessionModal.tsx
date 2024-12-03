import { LocaleNamespace } from '@/constants/enums/common';
import { EditNickFormType, GetBidNickResponse } from '@/types/bid/interface';
import { cn } from '@/utils/common';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  FormLabel,
  Input,
  InputNumber,
  Switch,
  Textarea,
} from '@ichiba/ichiba-core-ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FormLayout } from '../add-nick';

type FormType = Pick<
  EditNickFormType,
  | 'alias'
  | 'nickBid'
  | 'cookie'
  | 'proxyHost'
  | 'proxyPort'
  | 'proxyUsername'
  | 'proxyPassword'
  | 'customer'
  | 'password'
  | 'note'
  | 'isTax'
  | 'isNoTax'
  | 'isAllowBid'
  | 'proxyWorkspaceId'
>;

export type EditNickRequestType = GetBidNickResponse & Pick<EditNickFormType, 'customer'>;

interface Props {
  dataSource?: GetBidNickResponse;
  isLoading: boolean;
  onClose: () => void;
  onSave: (params: EditNickRequestType) => void;
}

const ModalForm = ({ isLoading, dataSource, onClose, onSave }: Props) => {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const { t: error } = useTranslation('error');

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    mode: 'onChange',
    defaultValues: {
      nickBid: dataSource?.username,
      alias: dataSource?.alias,
      cookie: dataSource?.cookie,
      proxyHost: dataSource?.proxyHost ?? undefined,
      proxyPort: dataSource?.proxyPort?.toString(),
      proxyUsername: dataSource?.proxyUsername ?? undefined,
      proxyPassword: dataSource?.proxyPassword ?? undefined,
      password: dataSource?.password,
      note: dataSource?.note,
      isTax: dataSource?.isTax || false,
      isNoTax: dataSource?.isNoTax || false,
      isAllowBid: dataSource ? !dataSource.isAllowBid : true,
    },
    resolver: yupResolver(
      yup.object().shape({
        // cookie: yup
        //   .string()
        //   .required(error('required'))
        //   .test('JSON-format', error('cookiesIsInvalidFormat'), (value) => {
        //     try {
        //       if (!value) {
        //         return false;
        //       }
        //       JSON.parse(value);
        //       return true;
        //     } catch (err) {
        //       return false;
        //     }
        //   }),
        password: yup.string().required(error('required')),
        isTax: yup
          .boolean()
          .nullable()
          .test('validateTax', error('mustChooseAtLeastOneOptionInTaxSetting'), (value, ctx) => {
            const { parent } = ctx;
            return value ? true : !!parent.isNoTax;
          }),
        isNoTax: yup
          .boolean()
          .nullable()
          .test('validateNoTax', error('mustChooseAtLeastOneOptionInTaxSetting'), (value, ctx) => {
            const { parent } = ctx;
            return value ? true : !!parent.isTax;
          }),
      }),
    ),
  });

  const isButtonDisabled = [isLoading, errors.cookie?.message].some((x) => {
    return !!x;
  });

  const handleSave = ({ proxyPort, ...rest }: FormType) => {
    if (dataSource) {
      const payload = {
        ...dataSource,
        ...rest,
        proxyPort: proxyPort ? +proxyPort.replaceAll(',', '') : undefined,
      };
      onSave(payload);
    }
  };

  return (
    <>
      <DialogHeader>
        <strong>{bid('configure')}</strong>
      </DialogHeader>

      <DialogBody className="scrollbar max-h-[700px] overflow-auto">
        <FormHelperText>
          <FormLayout title={bid('generalInformation')} className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <FormLabel>
                {bid('nickBid')}
                <span className="text-red-600 ml-1">&nbsp;*</span>
              </FormLabel>
              <Input {...register('nickBid')} className="my-2" disabled />
            </div>
            <div>
              <FormLabel>
                {bid('alias')}
                <span className="text-red-600 ml-1">&nbsp;*</span>
              </FormLabel>
              <Input {...register('alias')} className="my-2" disabled />
            </div>
            {/** Using form to prevent browser from auto filling fields */}
            <div>
              <FormLabel>
                {bid('password')}
                <span className="text-red-600 ml-1">&nbsp;*</span>
              </FormLabel>
              <Input
                {...register('password')}
                feedbackInvalid={errors.password?.message}
                className="my-2"
                type="password"
                placeholder={bid('password')}
                showPassword={false}
              />
            </div>
            <div>
              <FormLabel>{bid('note')}</FormLabel>
              <Input
                {...register('note')}
                feedbackInvalid={errors.note?.message}
                className="my-2"
                placeholder={bid('note')}
              />
            </div>
          </FormLayout>
          <FormLayout title={bid('bidSetting')} className="border border-ic-ink-2s flex flex-col gap-2">
            <div className="flex gap-2">
              <Switch
                {...register('isAllowBid')}
                defaultChecked={watch().isAllowBid}
                onChange={() => setValue('isAllowBid', !watch().isAllowBid, { shouldDirty: true })}
              />
              <p className="text-sm">{bid('allowToBid')}</p>
            </div>
          </FormLayout>
          <FormLayout
            title={bid('taxSetting')}
            className={cn(
              'border border-ic-ink-2s flex flex-col gap-2',
              (errors.isTax || errors.isNoTax) && 'border-red-600',
            )}
            containerStyle="mt-4"
          >
            <div>
              <Checkbox {...register('isTax')} type="checkbox" className="text-sm" label={bid('withTax')} />
              <p className="text-sm mt-1 ml-[26px] text-ic-ink-4s">{bid('isTaxDescription')}</p>
            </div>
            <div>
              <Checkbox {...register('isNoTax')} type="checkbox" className="text-sm" label={bid('withoutTax')} />
              <p className="text-sm mt-1 ml-[26px] text-ic-ink-4s">{bid('isNotTaxDescription')}</p>
            </div>
          </FormLayout>
          {(errors.isTax || errors.isNoTax) && (
            <p className="mt-1 text-sm text-red-6">{errors.isTax?.message || errors.isNoTax?.message}</p>
          )}
          <FormLayout title={bid('proxy')} className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <FormLabel>{bid('proxyHost')}</FormLabel>
              <Input
                {...register('proxyHost')}
                feedbackInvalid={errors.proxyHost?.message}
                className="my-2"
                placeholder={bid('proxyHost')}
              />
            </div>
            <div>
              <FormLabel>{bid('proxyPort')}</FormLabel>
              <InputNumber
                {...register('proxyPort')}
                feedbackInvalid={errors.proxyPort?.message}
                className="my-2"
                placeholder={bid('proxyPort')}
              />
            </div>
            <div>
              <FormLabel>{bid('proxyUsername')}</FormLabel>
              <Input
                {...register('proxyUsername')}
                feedbackInvalid={errors.proxyUsername?.message}
                className="my-2"
                placeholder={bid('proxyUsername')}
              />
            </div>
            {/** Using form to prevent browser from auto filling fields */}
            <div>
              <FormLabel>{bid('proxyPassword')}</FormLabel>
              <Input
                {...register('proxyPassword')}
                feedbackInvalid={errors.proxyPassword?.message}
                className="my-2"
                type="password"
                placeholder={bid('proxyPassword')}
              />
            </div>
          </FormLayout>
          <FormLayout title={bid('cookiesInformation')} containerStyle="mt-4">
            <FormLabel>
              {bid('cookie')}
              <span className="text-red-600 ml-1">&nbsp;*</span>
            </FormLabel>
            <Textarea
              {...register('cookie')}
              defaultValue={watch('cookie')}
              feedbackInvalid={errors.cookie?.message}
              className="my-2 w-full"
            />
          </FormLayout>
        </FormHelperText>
      </DialogBody>

      <DialogFooter className="flex items-center justify-end gap-4">
        <Button variant="outlined" onClick={onClose}>
          {bid('cancel')}
        </Button>
        <Button onClick={handleSubmit(handleSave)} loading={isLoading} disabled={isButtonDisabled}>
          {bid('save')}
        </Button>
      </DialogFooter>
    </>
  );
};

export const UpdateSessionModal = ({ visible, ...rest }: Props & Pick<any, 'visible'>) => {
  return (
    <Dialog open={visible} onClose={rest.onClose}>
      <ModalForm {...rest} />
    </Dialog>
  );
};
