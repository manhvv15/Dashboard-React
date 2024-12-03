import { Tooltip } from '@ichiba/ichiba-core-ui';
import { t } from 'i18next';

import { ApplicationResponse } from '@/types/user-management/user';

interface Props {
  applications: ApplicationResponse[] | [];
}

const ApplicationAccess = ({ applications }: Props) => {
  if (applications == undefined || applications.length == 0) return <div className="">0 application</div>;
  return (
    <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col items-start">
      <div className="w-full flex">
        <Tooltip
          content={
            <>
              <div className="w-full h-full">
                <div className="text-lg font-medium text-ic-black-5s">{t('listApplicationAccess')}</div>
                {applications.map((el) => (
                  <>
                    <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center p-3">
                      <img className="w-8 h-8 rounded-full object-cover" src={el.logoUrl ?? ''} alt="No logo" />
                      <div className="mx-2">
                        <div className="text-sm font-normal text-ic-black-6s">{el.name}</div>
                        <div className="text-xs font-normal text-ic-black-5s">{el.roleNames}</div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </>
          }
          placement="top-end"
          contentWidth={500}
          className="bg-white p-4 border border-blue-gray-50 shadow-lg font-sans text-sm font-normal text-blue-gray-500 focus:outline-none break-words whitespace-normal z-[9999] shadow-12 rounded-xl w-[500px]"
        >
          <div className="cursor-pointer">
            {applications.length} {applications.length > 1 ? 'applications' : 'application'}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default ApplicationAccess;
