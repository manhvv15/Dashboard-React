import { useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { getUrlAvatar } from '@/services/user-management/application';
import ImageUpload from '@/static/svg/ImageUploadNoBorder.svg';
import { IOptionValidate } from '@/utils/common';
import { ValidFile } from '@/utils/uploadFile';
import SvgIcon from '../commons/SvgIcon';

interface IImageUploadProps {
  onChangeImages: (images: string, index: number) => void;
  onRemoveImages: (string: string, index: number) => void;
  images: string[];
  index: number;
  errorMessage?: string;
}

const UploadImage = ({ images, onChangeImages, onRemoveImages, index, errorMessage }: IImageUploadProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { showToast } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [maxImageCanUpload] = useState(8);
  const refImgs = useRef<(HTMLInputElement | null)[]>([]);

  const uploadImgUrl = useMutation({
    mutationFn: getUrlAvatar,
  });

  const onUploadImage = async (file: File) => {
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
          onChangeImages(data.data.uri, index);
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
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
    if (refImgs && refImgs.current[index] && refImgs.current[index]?.value) {
      refImgs.current[index]!.value = '';
    }
  };

  const onClickChangeImage = () => {
    refImgs.current[index]?.click();
  };

  if (images && images.length > 0) {
    return (
      <>
        <div className="grid grid-cols-8 w-full items-center justify-center">
          {images &&
            images.map((image) => {
              return (
                <div key={image} className="relative w-[120px] h-[120px] flex items-center justify-center">
                  <img src={image} className="max-w-[120px] max-h-[120px]" alt="card" />
                  <span className="absolute rounded-full top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 p-0.5 text-ic-ink-5s text-xs leading-none bg-ic-ink-2s">
                    <SvgIcon
                      icon="close"
                      className="w-4 h-4 cursor-pointer "
                      onClick={() => onRemoveImages(image, index)}
                    />
                  </span>
                </div>
              );
            })}
          {images.length < maxImageCanUpload && (
            <div
              className={clsx(
                'border-dashed border rounded-lg flex flex-col items-center justify-center p-4 w-[120px] h-[120px] cursor-pointer',
                isDragging ? 'border-blue-500' : 'border-ic-ink-2s',
              )}
              onClick={onClickChangeImage}
              onKeyUp={onClickChangeImage}
            >
              <ImageUpload />
              <input
                type="file"
                accept={'.jpg,.png,.jpeg'}
                ref={(el) => (refImgs.current[index] = el)}
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-sm font-normal text-ic-ink-5s mt-2">{common('uploadFile')}</p>
              <p className="text-sm font-normal text-ic-ink-5s">
                ({images.length + 1}/{maxImageCanUpload})
              </p>
            </div>
          )}
        </div>
        {errorMessage && errorMessage.length > 0 && (
          <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">{errorMessage}</p>
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={clsx(
          'border-dashed  border rounded-lg flex flex-col items-center justify-center col-span-3 p-4 pt-3',
          isDragging ? 'border-blue-500' : 'border-ic-ink-2s',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ImageUpload />
        <input
          type="file"
          accept={'.jpg,.png,.jpeg'}
          ref={(el) => (refImgs.current[index] = el)}
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex gap-2">
          <p className="text-sm font-medium text-ic-ink-6s">{common('dropYourImageHereOr')}</p>
          <button
            className="text-sm font-medium text-ic-primary-6s cursor-pointer"
            onKeyUp={onClickChangeImage}
            onClick={onClickChangeImage}
          >
            {common('chooseFile')}
          </button>
        </div>
        <p className="text-sm font-normal text-ic-ink-5s">{common('dropYourImageHereOr.description')}</p>
      </div>
      {errorMessage && errorMessage.length > 0 && (
        <p className="mt-1 text-sm font-normal text-ic-red-6s mx-4">{errorMessage}</p>
      )}
    </>
  );
};
export default UploadImage;
