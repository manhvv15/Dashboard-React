import { bidSourceValue } from '@/constants/bid';
import { BidSourceEnum } from '@/types/bid/enum';
import { EditNickFormType, OptionSelect } from '@/types/bid/interface';
import { cn } from '@/utils/common';
import { Checkbox, FormLabel, Input, InputNumber, SelectPortal, Switch, Textarea } from '@ichiba/ichiba-core-ui';
import { OptionValue } from '@ichiba/ichiba-core-ui/dist/components/multiple-select/types';
import { ChangeEvent, useEffect, useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormLayout } from './FormLayout';

export const EditNickForm = ({ formData }: { formData?: Partial<EditNickFormType> }) => {
  const { t: bid } = useTranslation('bid');

  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<EditNickFormType>();

  const sourceList = [
    {
      label: bid(bidSourceValue.ebay),
      value: BidSourceEnum.Ebay.toString(),
    },
    {
      label: bid(bidSourceValue.yahooAuction),
      value: BidSourceEnum.YahooAuction.toString(),
    },
  ];

  // const { data: proxyList } = useQuery({
  //   queryKey: ['getListProxy'],
  //   queryFn: () =>
  //     getAllProxyWorkspace({
  //       params: { usingFor: [2, 3] },
  //     }),
  //   select: (res) => {
  //     return res?.data?.map((item) => {
  //       return {
  //         label: `${item.ip} - ${item.port} - ${item.username} - ${item.origin}`,
  //         value: item.id,
  //       };
  //     });
  //   },
  // });

  const handleGetSource = (_: OptionValue, option: OptionSelect) => {
    setValue('source', option.value ?? '');
    trigger('source');
  };

  // const handleGetProxy = (_: OptionValue, option: OptionSelect) => {
  //   setValue('proxyWorkspaceId', option.value ?? '');
  //   trigger('proxyWorkspaceId');
  // };

  const handleBlurNickBid = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const inputValue = e.target.value;
    if (!watch('alias') && inputValue) {
      setValue('alias', inputValue);
      trigger('alias');
    }
  };

  // const handleChangeCustomer = (selected?: BidCustomerValueType) => {
  //   setValue('customer', selected);
  // };

  const handleAutoResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    const maxHeight = 498;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = 'scroll';
      textarea.style.height = `${maxHeight}px`;
    } else {
      textarea.style.overflowY = 'hidden';
    }
  };

  const taxError = [errors.isTax, errors.isNoTax].find((e) => !!e?.message);

  useLayoutEffect(() => {
    if (formData) {
      Object.keys(formData).forEach((item) => {
        const formItem = item as keyof EditNickFormType;
        setValue(formItem, formData[formItem] ?? '');
      });
    }
  }, [JSON.stringify(formData)]);

  useEffect(() => {
    trigger('isTax');
    trigger('isNoTax');
  }, [watch('isTax'), watch('isNoTax')]);

  return (
    <div className="w-full flex gap-6">
      <div className="flex flex-col gap-4 flex-1">
        <div title={bid('chooseSource')}>
          <FormLabel>
            {bid('source')}
            <span className="text-red-600 ml-1">&nbsp;*</span>
          </FormLabel>
          <SelectPortal
            error={!!errors.source?.message}
            onChange={handleGetSource}
            className="my-2"
            options={sourceList}
            placeholder={bid('chooseSource')}
          />
        </div>
        <FormLayout title={bid('generalInformation')} className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <FormLabel>
              {bid('nickBid')}
              <span className="text-red-600 ml-1">&nbsp;*</span>
            </FormLabel>
            <Input
              {...register('nickBid')}
              feedbackInvalid={errors.nickBid?.message}
              className="my-2"
              placeholder={bid('nickBid')}
              onClearData={() => setValue('nickBid', '')}
              hiddenClose={!watch('nickBid')}
              onBlur={(e) => {
                register('nickBid').onBlur(e);
                handleBlurNickBid(e);
              }}
            />
          </div>
          <div>
            <FormLabel>
              {bid('alias')}
              <span className="text-red-600 ml-1">&nbsp;*</span>
            </FormLabel>
            <Input
              {...register('alias')}
              feedbackInvalid={errors.alias?.message}
              type="text"
              className="my-2"
              placeholder={bid('alias')}
              onClearData={() => setValue('alias', '')}
              hiddenClose={!watch('alias')}
            />
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
              showPassword={true}
              onClearData={() => setValue('password', '')}
              hiddenClose={!watch('password')}
            />
          </div>
          <div>
            <FormLabel>{bid('note')}</FormLabel>
            <Input
              {...register('note')}
              feedbackInvalid={errors.note?.message}
              className="my-2"
              placeholder={bid('note')}
              onClearData={() => setValue('note', '')}
              hiddenClose={!watch('note')}
            />
          </div>
        </FormLayout>
        <FormLayout title={bid('proxy')} className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <FormLabel>{bid('proxyHost')}</FormLabel>
            <Input
              {...register('proxyHost')}
              feedbackInvalid={errors.proxyHost?.message}
              className="my-2"
              placeholder={bid('proxyHost')}
              onClearData={() => setValue('proxyHost', '')}
              hiddenClose={!watch('proxyHost')}
            />
          </div>
          <div>
            <FormLabel>{bid('proxyPort')}</FormLabel>
            <InputNumber
              {...register('proxyPort')}
              feedbackInvalid={errors.proxyPort?.message}
              className="my-2"
              placeholder={bid('proxyPort')}
              onClearData={() => setValue('proxyPort', '')}
              hiddenClose={!watch('proxyPort')}
            />
          </div>
          <div>
            <FormLabel>{bid('proxyUsername')}</FormLabel>
            <Input
              {...register('proxyUsername')}
              feedbackInvalid={errors.proxyUsername?.message}
              className="my-2"
              placeholder={bid('proxyUsername')}
              onClearData={() => setValue('proxyUsername', '')}
              hiddenClose={!watch('proxyUsername')}
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
              onClearData={() => setValue('proxyPassword', '')}
              hiddenClose={!watch('proxyPassword')}
            />
          </div>
        </FormLayout>
        {/* <FormLayout title={bid('proxy')}>
          <FormLabel>
            {bid('proxy')}
            <span className="text-red-600 ml-1">&nbsp;*</span>
          </FormLabel>
          <SelectPortal
            error={!!errors.proxyWorkspaceId?.message}
            onChange={handleGetProxy}
            className="my-2"
            options={proxyList || []}
            placeholder={bid('chooseProxy')}
          />
        </FormLayout> */}
        <FormLayout title={bid('cookiesInformation')}>
          <FormLabel>
            {bid('cookie')}
            <span className="text-red-600 ml-1">&nbsp;*</span>
          </FormLabel>
          <Textarea
            {...register('cookie')}
            onChange={(e) => {
              handleAutoResize(e);
              register('cookie').onChange(e);
            }}
            feedbackInvalid={errors.cookie?.message}
            className="my-2 w-full"
            placeholder={bid('enterCookie')}
          />
        </FormLayout>
        {/* <FormLayout title={bid('mappingNick')}>
          <FormLabel>{bid('toCustomer')}</FormLabel>
          <MappingNickDropdown onChange={handleChangeCustomer} value={watch('customer')} className="mt-2" />
        </FormLayout> */}
      </div>
      <div className="h-full w-[344px]">
        <FormLayout title={bid('bidSetting')} className="border border-ic-ink-2s flex flex-col gap-6">
          <div className="flex gap-2">
            <Switch defaultChecked={watch().isActive} onChange={() => setValue('isActive', !watch('isActive'))} />
            <p className="text-sm">{bid('active')}</p>
          </div>
          <div className="flex gap-2">
            <Switch defaultChecked={watch().isAllowBid} onChange={() => setValue('isAllowBid', !watch('isAllowBid'))} />
            <p className="text-sm">{bid('allowToBid')}</p>
          </div>
          <div className="flex gap-2">
            <Switch
              defaultChecked={watch().isAutoGetSuccessfulBid}
              onChange={() => setValue('isAutoGetSuccessfulBid', !watch('isAutoGetSuccessfulBid'))}
            />
            <p className="text-sm">{bid('isAutoGetSuccessfulBid')}</p>
          </div>
        </FormLayout>
        <FormLayout
          title={bid('taxSetting')}
          className={cn('border border-ic-ink-2s flex flex-col gap-2', taxError && 'border-red-600')}
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
        {taxError && <p className="mt-1 text-sm text-red-600">{taxError.message}</p>}
      </div>
    </div>
  );
};
