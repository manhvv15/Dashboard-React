import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { getUrlAvatar } from '@/services/user-management/application';
import { UploadFile } from '@/types/user-management/application';
import { ValidFile } from '@/utils/uploadFile';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  updateImageURL: (image: string) => void;
  imageUpload: string | null;
  setImageUpload: Dispatch<SetStateAction<string | null>>;
}

export default function UploadImage({ updateImageURL, imageUpload, setImageUpload }: Props) {
  const { showToast } = useApp();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [validImage, setValidImage] = useState<string>('');
  const avatarRef = useRef<HTMLInputElement>(null);
  const accept = '.jpg,.png,.jpeg';

  const onSubmitImage = () => {
    avatarRef.current?.click();
  };

  const getUrlAvatarMutation = useMutation({
    mutationFn: getUrlAvatar,
  });

  const onChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0] as File;
      debugger;
      const options = {
        minWidth: 600,
        minHeight: 600,
        limitCapacity: 3,
        type: ['jpg', 'png', 'jpeg'],
      };

      const validated = await ValidFile(file, options);

      if (validated.isValid) {
        setValidImage('');
        const formData = new FormData();
        formData.append('File', file);
        getUrlAvatarMutation.mutate(formData, {
          onSuccess: (data: AxiosResponse<UploadFile>) => {
            setImageUpload(data.data.uri);
            updateImageURL(data.data.uri);
            showToast({
              type: 'success',
              summary: common('uploadImageSuccess'),
            });
          },
        });
      } else {
        setValidImage(
          common('validImage', {
            imageFormat: '.jpg, .png, .jpeg',
            minSizeWidth: 600,
            minSizeHeight: 600,
            capacity: 3,
          }),
        );
      }
    }
  };
  return (
    <div className="relative mt-4 flex">
      {imageUpload && (
        <div className="relative">
          <img
            className="object-cover w-24 h-24 overflow-hidden border-2 rounded-xl border-ic-ink-1s"
            src={imageUpload}
            width={96}
            height={96}
            alt="AvatarIcon"
          />
          <button
            onClick={onSubmitImage}
            className="absolute bottom-0 w-10 h-10 rounded-md flex items-center border border-ic-ink-1s right-[-20px] justify-center bg-ic-primary-1s z-50"
            type="button"
          >
            <SvgIcon icon="camera" width={16} height={16} className="text-ic-primary-6s" />
            <input type="file" className="hidden" accept={accept} ref={avatarRef} onChange={onChangeAvatar} />
          </button>
        </div>
      )}

      {getUrlAvatarMutation.isLoading && (
        <div className="absolute w-24 h-24 flex items-center justify-center z-50">
          <SvgIcon icon="three-dot" width={24} height={24} className="text-ic-ink-6s" />
        </div>
      )}
      {!imageUpload && (
        <button
          onClick={onSubmitImage}
          className={clsx(
            getUrlAvatarMutation.isLoading && 'pointer-events-none',
            'border-dashed border border-ic-ink-2s rounded-xl min-w-[96px] h-24  justify-center flex-col items-center inline-flex float-left',
          )}
        >
          <SvgIcon icon="upload-avt" width={40} height={40} className="cursor-pointer" />
          <p className="mt-2 text-xs font-normal leading-4 text-ic-ink-5s">{common('uploadLogo')}</p>
          <input type="file" className="hidden" accept={accept} ref={avatarRef} onChange={onChangeAvatar} />
        </button>
      )}
      <div className="ml-2 float-right">
        {validImage && (
          <p className="text-sm font-normal leading-5 text-ic-red-6s">
            {validImage.split(';').map((val) => (
              <p key={val}>{val}</p>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
