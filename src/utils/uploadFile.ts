import { IErrorValidate, IOptionValidate } from './common';

const getMeta = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });

export const ValidFile = async (file: File, options?: IOptionValidate) => {
  const message: string[] = [];
  if (file) {
    let isValidSize = true;
    let isValidExtension = true;
    let isValidDimensions = true;

    if (options?.type && options?.type.length > 0) {
      const regex = new RegExp(`.(${options?.type.join('|')})$`);
      if (!file.name.match(regex)) {
        isValidExtension = false;
        message.push('ExtensionNotMatch');
      }
    }
    if (options?.limitCapacity && options?.limitCapacity > 0) {
      const currentSize = file.size / 1024 / 1024;
      if (currentSize <= 0 || currentSize > options?.limitCapacity) {
        isValidSize = false;
        message.push('CapacityNotMatch');
      }
    }
    if (options?.minWidth || options?.maxWidth || options?.minHeight || options?.maxHeight) {
      const imageLoaded = await getMeta(window.URL.createObjectURL(file));
      if (options?.minWidth && options?.minWidth > 0 && imageLoaded.naturalWidth < options?.minWidth) {
        isValidDimensions = false;
      } else if (options?.maxWidth && options?.maxWidth > 0 && imageLoaded.naturalWidth > options?.maxWidth) {
        isValidDimensions = false;
      } else if (options?.minHeight && options?.minHeight > 0 && imageLoaded.naturalHeight < options?.minHeight) {
        isValidDimensions = false;
      } else if (options?.maxHeight && options?.maxHeight > 0 && imageLoaded.naturalHeight > options?.maxHeight) {
        isValidDimensions = false;
      }
      if (!isValidDimensions) {
        message.push('DimensionsNotMatch');
      }
    }
    const fullMessage = message.join(',');
    if (isValidSize && isValidExtension && isValidDimensions) {
      return {
        message: fullMessage,
        isValid: true,
      } as IErrorValidate;
    }
    return {
      message: fullMessage,
      isValid: false,
    } as IErrorValidate;
  }
  return {
    message: 'FileNotFound',
    isValid: false,
  } as IErrorValidate;
};
