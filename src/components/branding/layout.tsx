import { ChangeEvent } from 'react';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';

import { LocaleNamespace } from '@/constants/enums/common';
import { IBrandingSettings } from '@/types/user-management/branding';
import 'react-quill/dist/quill.snow.css';

export const LayoutBranding = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IBrandingSettings>();

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          //, { indent: '-1' }, { indent: '+1' }
        ],
        //[{ align: [false, 'right', 'center', 'justify'] }],
        //['align'],
        ['link'],
        ['clean'],
      ],
    },
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'align', 'indent', 'link'];

  const onChangeButtonFontColor = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('layoutColor.button.fontColor', e.target.value);
  };
  const onChangeButtonButtonColor = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('layoutColor.button.buttonColor', e.target.value);
  };
  const onChangeHeaderFontColor = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('layoutColor.header.fontColor', e.target.value);
  };
  const onChangeHeaderTextColor = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('layoutColor.header.textColor', e.target.value);
  };

  const onChangeSignature = (e: string) => {
    console.log('e', e);
    if (e === '<p><br></p>' || e === '<p></p>') {
      e = '';
    }
    setValue('signature', e);
  };

  return (
    <div className="max-w-[1200px] w-full bg-white py-4 px-5 rounded-lg">
      <p className="text-sm font-medium">{common('notification.layoutColor')}</p>
      <div className="flex items-start justify-between px-5 mt-3">
        <div className="flex flex-col gap-y-3 items-start">
          <p className="text-sm font-normal">{common('notification.buttonColor')}</p>
          <div className="flex flex-row items-start justify-center gap-x-2">
            <input
              className="w-12 h-12 !border-none border-transparent"
              type="color"
              value={watch('layoutColor.button.fontColor')}
              onChange={onChangeButtonFontColor}
            />
            <div className="flex flex-col">
              <p className="text-sm font-normal">{common('notification.fontColor')}</p>
              <p className="text-sm font-normal text-ic-black-5s">{watch('layoutColor.button.fontColor')}</p>
            </div>
          </div>
          <div className="flex flex-row items-start justify-center gap-x-2">
            <input
              className="w-12 h-12 !border-none border-transparent"
              type="color"
              value={watch('layoutColor.button.buttonColor')}
              onChange={onChangeButtonButtonColor}
            />
            <div className="flex flex-col">
              <p className="text-sm font-normal">{common('notification.buttonColor')}</p>
              <p className="text-sm font-normal text-ic-black-5s">{watch('layoutColor.button.buttonColor')}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3 items-start">
          <p className="text-sm font-normal">{common('notification.headerColor')}</p>
          <div className="flex flex-row items-start justify-center gap-x-2">
            <input
              className="w-12 h-12 !border-none border-transparent"
              type="color"
              value={watch('layoutColor.header.fontColor')}
              onChange={onChangeHeaderFontColor}
            />
            <div className="flex flex-col">
              <p className="text-sm font-normal">{common('notification.fontColor')}</p>
              <p className="text-sm font-normal text-ic-black-5s">{watch('layoutColor.header.fontColor')}</p>
            </div>
          </div>
          <div className="flex flex-row items-start justify-center gap-x-2">
            <input
              className="w-12 h-12 !border-none border-transparent"
              type="color"
              value={watch('layoutColor.header.textColor')}
              onChange={onChangeHeaderTextColor}
            />
            <div className="flex flex-col">
              <p className="text-sm font-normal">{common('notification.textColor')}</p>
              <p className="text-sm font-normal text-ic-black-5s">{watch('layoutColor.header.textColor')}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium mt-8 mb-2">{common('notification.signature')}</p>
      <div className="min-h-[300px]">
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={watch('signature') ?? ''}
          onChange={onChangeSignature}
          className="h-64"
        />
      </div>
      {errors?.signature && errors?.signature?.message && (
        <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">{errors?.signature?.message}</p>
      )}
    </div>
  );
};
