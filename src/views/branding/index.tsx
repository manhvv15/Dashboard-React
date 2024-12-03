import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { LabelBranding, LayoutBranding, ModalPreview, SocialBranding, SupportBranding } from '@/components/branding';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';

import SvgIcon from '@/components/commons/SvgIcon';
import { REGEX_URL_BRANDING } from '@/constants/variables/regexException';
import { getBrandingSettings, insertBrandingSettings } from '@/services/user-management/branding';
import { IBrandingSettings } from '@/types/user-management/branding';

const WorkspaceBranding = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const { showToast } = useApp();
  const [isShowPreview, setIsShowPreview] = useState(false);
  //const [variableDefaults, setVariableDefaults] = useState<ITemplateVariable[]>([]);
  const [variableCustom, setVariableCustom] = useState<{ name: string; value: any }[]>([]);

  const marketId = '00000000-0000-0000-0000-000000000000';
  const workspaceId = '00000000-0000-0000-0000-000000000000';
  const workspaceName = 'Ichiba OnePlatform';
  const defaultSignature = `<p>This email has been sent to ${workspaceName} user. </p><p>Yout privacy is our priority. We protect your data to give you the best shopping experience. </p><p><br></p><p>If you have any questions, feel free to contact us.</p>`;

  const defaultLayoutColor = {
    button: {
      buttonColor: '#1D39C4',
      fontColor: '#ffffff',
    },
    header: {
      fontColor: '#F2F7F9',
      textColor: '#333333',
    },
  };

  const schema = yup.object().shape({
    socials: yup.array().of(
      yup.object().shape({
        url: yup
          .string()
          .required(error('fieldIsRequired'))
          .max(255, error('fieldIsInvalid'))
          .matches(REGEX_URL_BRANDING, {
            message: error('linkformatIsInvalid'),
          }),
        type: yup.number().required(error('fieldIsRequired')),
        name: yup.string().nullable().notRequired(),
        logo: yup.string().nullable().notRequired(),
      }),
    ),
    labels: yup.array().of(
      yup.object().shape({
        type: yup.number().required(error('fieldIsRequired')),
        name: yup
          .string()
          .required(error('fieldIsRequired'))
          .min(2, error('fieldIsInvalid'))
          .max(50, error('fieldIsInvalid')),
        url: yup
          .string()
          .required(error('fieldIsRequired'))
          .max(255, error('fieldIsInvalid'))
          .matches(REGEX_URL_BRANDING, {
            message: error('linkformatIsInvalid'),
          }),
        position: yup.number().required(),
      }),
    ),
    supportName: yup
      .string()
      .nullable()
      .notRequired()
      .when('supportLink', {
        is: (value: string) => value?.length,
        then: (rule) => rule.required(error('fieldIsRequired')),
      }),
    supportLink: yup
      .string()
      .nullable()
      .notRequired()
      .max(255, error('fieldIsInvalid'))
      .test('is-valid-url', error('linkformatIsInvalid'), (value) => {
        if (!value || value.length === 0) return true; // Allow empty values
        return REGEX_URL_BRANDING.test(value);
      }),
    referralImages: yup.array().of(
      yup.object().shape({
        type: yup.number().required(error('fieldIsRequired')),
        image: yup.string().required(error('fieldIsRequired')),
      }),
    ),
    layoutColor: yup.object().shape({
      button: yup.object().shape({
        buttonColor: yup.string().required(error('fieldIsRequired')),
        fontColor: yup.string().required(error('fieldIsRequired')),
      }),
      header: yup.object().shape({
        fontColor: yup.string().required(error('fieldIsRequired')),
        textColor: yup.string().required(error('fieldIsRequired')),
      }),
    }),
    signature: yup.string().nullable().notRequired().max(255, error('fieldIsInvalid')),
    cards: yup.array().of(
      yup.object().shape({
        type: yup.number().required(error('fieldIsRequired')),
        name: yup
          .string()
          .required(error('fieldIsRequired'))
          .min(2, error('fieldIsInvalid'))
          .max(50, error('fieldIsInvalid')),
        images: yup.array().of(yup.string()).required(error('fieldIsRequired')).min(1, error('fieldIsRequired')),
      }),
    ),
  });

  const methods = useForm<IBrandingSettings>({
    resolver: yupResolver(schema),
    defaultValues: {
      layoutColor: defaultLayoutColor,
      signature: defaultSignature,
    },
  });

  // useQuery({
  //   queryKey: ['getVariableTemplateDefault', workspace.slug],
  //   enabled: !!workspace.slug,
  //   queryFn: () => getVariableTemplateDefault(workspace.slug),
  //   onSuccess(data: AxiosResponse<ITemplateVariable[]>) {
  //     setVariableDefaults(data.data);
  //   },
  // });

  const { data: dataBranding, refetch: refetchBranding } = useQuery({
    queryKey: ['getBrandingSettings'],
    queryFn: () =>
      getBrandingSettings({
        workspaceId: workspaceId,
        marketId: marketId,
      }),
    onSuccess(data: AxiosResponse<IBrandingSettings>) {
      methods.setValue('labels', data?.data?.labels ?? []);
      methods.setValue('socials', data?.data?.socials ?? []);
      methods.setValue('supportLink', data?.data?.supportLink ?? null);
      methods.setValue('supportName', data?.data?.supportName ?? null);
      methods.setValue('referralImages', data?.data?.referralImages ?? []);
      methods.setValue('layoutColor', data?.data?.layoutColor ?? defaultLayoutColor);
      methods.setValue('signature', data?.data?.signature ?? defaultSignature);
    },
  });

  const onHandleClickPreview = () => {
    var layoutData = methods.getValues('layoutColor');
    setVariableCustom([
      {
        name: 'workspace_support_name',
        value: methods.getValues('supportName') ?? '',
      },
      {
        name: 'workspace_support_link',
        value: methods.getValues('supportLink') ?? '',
      },
      {
        name: 'workspace_signature',
        value: methods.getValues('signature') ?? '',
      },
      {
        name: 'workspace_name',
        value: workspaceName,
      },
      {
        name: 'workspace_url',
        value: '#',
      },
      {
        name: 'workspace_socials',
        value: (methods.getValues('socials') ?? []).map((item) => {
          return {
            social_url: item.url,
            social_logo: item.logo,
            social_name: item.name,
          };
        }),
      },
      {
        name: 'workspace_labels',
        value: (methods.getValues('labels') ?? []).map((item) => {
          return {
            label_url: item.url,
            label_name: item.name,
            label_type: item.type,
            label_position: item.position,
          };
        }),
      },
      {
        name: 'workspace_referral_images',
        value: (methods.getValues('referralImages') ?? []).map((item) => {
          return {
            referral_image_url: item.image,
            referral_image_type: item.type,
          };
        }),
      },
      {
        name: 'workspace_layout_color',
        value: {
          layout_header: {
            header_text_color: layoutData?.header.textColor,
            header_background_color: layoutData?.header.fontColor,
          },
          layout_button: {
            button_font_color: layoutData?.button.fontColor,
            button_background_color: layoutData?.button.buttonColor,
          },
        },
      },
    ]);
    setIsShowPreview(true);
  };

  const onCancelPreview = () => {
    setIsShowPreview(false);
  };

  const insertMutation = useMutation({
    mutationFn: insertBrandingSettings,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('notificaiton.updateSuccess'),
      });
      refetchBranding();
    },
    onError: (err: any) => {
      const { errorNormal } = err;
      if (errorNormal) {
        showToast({
          type: 'error',
          summary: error(errorNormal),
        });
      } else {
        showToast({
          type: 'error',
          summary: error('somethingWentWrong'),
        });
      }
    },
  });

  const onHandleClickSave = () => {
    methods.handleSubmit((data) => {
      const newData = {
        marketId: marketId,
        workspaceId: workspaceId,
        brandingSetting: data,
      };
      insertMutation.mutate(newData);
    })();
  };

  // const renderVariable = (variable: ITemplateVariable) => {
  //   if (variable.typeEnum === VariableTypeEnum.Object || variable.isArray) {
  //     return (
  //       <li key={variable.value}>
  //         <CollapseVariable variable={variable} renderFC={renderVariable} />
  //       </li>
  //     );
  //   } else {
  //     return (
  //       <li key={variable.value}>
  //         <BtnCopy description={variable.description} content={variable.value} value={`{{${variable.value}}}`} />
  //       </li>
  //     );
  //   }
  // };

  const disableCancelButton = () => {
    const areObjectsEqual = (obj1: any, obj2: any): boolean => {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    const areListsEqual = (list1: any[], list2: any[]): boolean => {
      if (list1.length !== list2.length) return false;
      for (let i = 0; i < list1.length; i++) {
        if (!areObjectsEqual(list1[i], list2[i])) return false;
      }
      return true;
    };

    return (
      areListsEqual(methods.watch('labels') ?? [], dataBranding?.data.labels ?? []) &&
      areListsEqual(methods.watch('socials') ?? [], dataBranding?.data.socials ?? []) &&
      methods.watch('supportName') === dataBranding?.data.supportName &&
      methods.watch('supportLink') === dataBranding?.data.supportLink &&
      areListsEqual(methods.watch('referralImages') ?? [], dataBranding?.data.referralImages ?? []) &&
      areObjectsEqual(methods.watch('layoutColor'), dataBranding?.data.layoutColor) &&
      methods.watch('signature') === dataBranding?.data.signature
    );
  };

  const onHandleClickCancel = () => {
    methods.setValue('labels', dataBranding?.data.labels ?? []);
    methods.setValue('socials', dataBranding?.data.socials ?? []);
    methods.setValue('supportName', dataBranding?.data.supportName ?? '');
    methods.setValue('supportLink', dataBranding?.data.supportLink ?? '');
    methods.setValue('referralImages', dataBranding?.data.referralImages ?? []);
    methods.setValue('layoutColor', dataBranding?.data.layoutColor ?? defaultLayoutColor);
    methods.setValue('signature', dataBranding?.data.signature ?? defaultSignature);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <LayoutSection
          label={
            <div className="flex flex-col gap-1 py-2">
              <p className="text-base font-medium">{common('notification.branding')}</p>
            </div>
          }
          right={
            <div className="flex gap-3">
              <Button
                className=""
                type={'button'}
                variant="outlined"
                color="danger"
                disabled={disableCancelButton()}
                startIcon={<SvgIcon icon="close-circle" width={24} height={24} />}
                onClick={onHandleClickCancel}
              >
                {common('cancel')}
              </Button>
              <Button className="" type={'button'} variant="outlined" color="primary" onClick={onHandleClickPreview}>
                {common('notification.button.preview')}
              </Button>
              <Button
                className=""
                type={'button'}
                variant="filled"
                color="primary"
                onClick={onHandleClickSave}
                //disabled={disableSave()}
                startIcon={<SvgIcon icon="save" width={24} height={24} />}
              >
                {common('save')}
              </Button>
            </div>
          }
        >
          <div className="flex w-full justify-center pt-2 ">
            <div className="max-w-[1200px] w-full">
              <div className="flex w-full items-start mb-4 gap-x-2 flex-row">
                <div
                  className={clsx(
                    'flex w-full items-center justify-center gap-y-3 flex-col',
                    //'flex-[0_0_calc(70%-16px)] ',
                  )}
                >
                  <FormProvider {...methods}>
                    <SocialBranding />
                    <LabelBranding />
                    <SupportBranding />
                    <LayoutBranding />
                  </FormProvider>
                </div>
                {/* <div className="flex-[0_0_30%] px-5 py-4 bg-ic-light flex flex-col items-start justify-start">
                  <p className="text-sm font-medium">{common('notification.variables')}</p>
                  <p className="text-sm font-normal my-1">{common('notification.variables.description')}</p>
                  <ul className="flex flex-col gap-1 scrollbar h-fit  w-full">
                    {(variableDefaults ?? []).map((variable) => renderVariable(variable))}
                  </ul>
                </div> */}
              </div>
            </div>
          </div>

          <ModalPreview
            isShowModal={isShowPreview}
            onCancel={onCancelPreview}
            variables={variableCustom}
            marketId={marketId}
          />
        </LayoutSection>
      </div>
    </>
  );
};
export default WorkspaceBranding;
