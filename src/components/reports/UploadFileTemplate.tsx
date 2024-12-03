import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { getTemplateFile } from '@/services/document-service/report';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { UploadFile } from '@/types/user-management/application';

type FileInfo = {
  name: string;
  uri: string;
  contentType: string;
} | null;

interface IProps {
  fileInfo: FileInfo;
  setFileInfo: React.Dispatch<React.SetStateAction<FileInfo>>;
}
const UploadFileTemplate = ({ fileInfo, setFileInfo }: IProps) => {
  const { showToast } = useApp();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [isUploading, setIsUploading] = useState(false);

  const accept = '.jpg,.png,.jpeg,.pdf,.docx,.xlsx';

  const getTemplateFileMutation = useMutation({
    mutationFn: getTemplateFile,
    onMutate: () => {
      setIsUploading(true);
      setFileInfo(null);
    },
    onSuccess: (data: AxiosResponse<UploadFile>) => {
      const { name, uri, contentType } = data.data;
      setFileInfo({
        name,
        uri,
        contentType,
      });

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
      const formData = new FormData();
      formData.append('File', file);
      getTemplateFileMutation.mutate(formData);
    }
  };

  return (
    <div className="relative mt-4 flex flex-col">
      <div className="input-group mb-4">
        <input id="file" type="file" accept={accept} onChange={onChangeFiles} />
      </div>

      {isUploading && <div className="loading">Uploading...</div>}

      {fileInfo && (
        <div className="uploaded-file-info">
          <h3 className="text-xl font-semibold mb-4">File Uploaded:</h3>
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-4 py-2 text-left font-medium">Name:</th>
                <td className="px-4 py-2 border-l border-gray-300">{fileInfo.name}</td>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300">
                <th className="px-4 py-2 text-left font-medium">Content Type:</th>
                <td className="px-4 py-2 border-l border-gray-300">{fileInfo.contentType}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default UploadFileTemplate;
