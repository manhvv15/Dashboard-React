import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { getTemplateFile } from '@/services/document-service/report';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { UploadFile } from '@/types/user-management/application';
import { ValidFile } from '@/utils/uploadFile';
import { flatMap } from 'lodash';
import SvgIcon from '../commons/SvgIcon';

type FileInfo = {
  name: string;
  uri: string;
  contentType: string;
  size: number;
} | null;

interface IProps {
  fileInfo: FileInfo;
  setFileInfo: React.Dispatch<React.SetStateAction<FileInfo>>;
  allowTypes: string[];
  templateName: string;
}

const UploadFileTemplate = ({ fileInfo, setFileInfo, allowTypes, templateName }: IProps) => {
  const { showToast } = useApp();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [isUploading, setIsUploading] = useState(false);
  const [size, setSize] = useState(0);

  const accept = flatMap(
    allowTypes.map((type) => {
      switch (type) {
        case 'XLSX':
          return ['.xls', '.xlsx'];
        case 'DOCX':
          return ['.doc', '.docx'];
        case 'PDF':
          return ['.pdf'];
        default:
          return [];
      }
    }),
  ).join(',');

  const { mutate: uploadFile } = useMutation({
    mutationFn: getTemplateFile,
    onSuccess: (data: AxiosResponse<UploadFile>) => {
      const { name, uri, contentType } = data.data;
      setFileInfo({ name, uri, contentType, size });
      setIsUploading(false);
      showToast({
        type: 'success',
        summary: common('uploadFileSuccess'),
      });
    },
    onError: () => {
      setIsUploading(false);
      showToast({
        type: 'error',
        summary: common('uploadFileFailed'),
      });
    },
  });

  const onChangeFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0] as File;
      const options = {
        limitCapacity: 5,
        type: allowTypes.map((type) => type.toLowerCase()),
      };

      const validated = await ValidFile(file, options);

      if (validated.isValid) {
        setSize(file.size);
        setIsUploading(true);
        const formData = new FormData();
        formData.append('File', file);
        uploadFile(formData);
      } else {
        showToast({
          type: 'error',
          summary: common('invalidFileType'),
        });
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const options = {
        limitCapacity: 5,
        type: allowTypes.map((type) => type.toLowerCase()),
      };

      const validated = await ValidFile(file, options);

      if (validated.isValid) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('File', file);
        uploadFile(formData);
      } else {
        showToast({
          type: 'error',
          summary: common('invalidFileType'),
        });
      }
    }
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.getElementById('fileInput')?.click();
  };

  return (
    <div className="relative mt-4 flex flex-col">
      <div
        className={`pt-3 pb-3 pl-4 pr-4 border border-dashed cursor-pointer ${isUploading ? 'cursor-not-allowed' : ''}`}
        onClick={handleFileClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {fileInfo ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span>{fileInfo.name}</span>
            </div>
            <button onClick={handleFileClick} className="ml-4 p-1 rounded-full">
              <SvgIcon icon="uploadfile" width={16} height={16} className="text-ic-primary-6s" />
            </button>
          </div>
        ) : (
          <div className="mx-auto flex flex-col items-center text-center max-w-[400px]">
            <SvgIcon icon="uploadfile" width={40} height={40} className="text-ic-primary-6s mt-10" />
            <p className="mt-2 font-medium">Drop your file here, or browse</p>
            <p className="mt-2 text-opacity-100 text-gray-600">
              (File size must not exceed 5 MB and only PDF, DOCX, XLSX file formats are allowed to upload.)
            </p>
          </div>
        )}

        <input
          id="fileInput"
          type="file"
          accept={accept}
          multiple
          name={templateName || 'fileInput'}
          onChange={onChangeFiles}
          className="border-0 clip-rect-[0px_0px_0px_0px] clip-path-inset-[50%] h-[1px] m-[-1px_-1px_-1px_0px] overflow-hidden p-0 absolute w-[1px] whitespace-nowrap"
        />
      </div>
      {isUploading && <div className="loading">Uploading...</div>}
    </div>
  );
};

export default UploadFileTemplate;
