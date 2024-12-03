import { LocaleNamespace } from '@/constants/enums/common';
import { OrganizationByIdResponse } from '@/types/user-management/organization';
import { Button } from '@ichiba/ichiba-core-ui';
import { t } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../commons/SvgIcon';
import ModalEditGroupRole from './dialog/ModalEditGroupRole';

interface IProps {
  organization: OrganizationByIdResponse;
}
export const GroupRoleInformation = ({ organization }: IProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <div className="flex justify-between">
          <div>
            <div className="flex text-ic-black-5s">
              <div className="text-lg font-medium">
                {organization.name}{' '}
                <div className="rounded border border-ic-primary-6s bg-orange-1 text-xs leading-5 font-normal text-ic-primary-6s px-2 bg-ic-primary-1s inline-block">
                  {organization.isSystem ? common('forSystem') : common('forWorkspace')}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-ic-black-5s">{organization.description ?? common('noDescription')}</div>
            <div className="flex">
              <div className="flex text-sm border-r-2 pr-2 border-ic-black-3s">
                <div className="">{common('Number of users:')}</div>
                <div className="ml-1 text-black font-medium">{organization.totalUser}</div>
              </div>
              <div className="flex text-sm ml-2">
                <div>{common('Application access:')}</div>
                <div className="ml-1 text-black font-medium">{organization.totalApplication}</div>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsOpen(true)} variant="outlined">
            <SvgIcon icon="pen" width={24} height={24} />
            <span className="ml-1">{t('editGroupInfo')}</span>
          </Button>
        </div>
      </div>

      <ModalEditGroupRole open={isOpen} setOpen={setIsOpen} id={organization.id}></ModalEditGroupRole>
    </div>
  );
};
