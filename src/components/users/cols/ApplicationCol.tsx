import { useState } from 'react';

import { Button, Popover, PopoverContent, PopoverHandler } from '@ichiba/ichiba-core-ui';
import classNames from 'classnames';
import { t } from 'i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { ApplicationInfoResponse } from '@/types/user-management/user';

interface IProps {
  applications: ApplicationInfoResponse[];
}

const ApplicationCol = ({ applications }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>();
  if (applications == null || !applications.length) {
    return <span className="text-ic-ink-4"></span>;
  }
  const fistApp = applications[0];
  return (
    <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center justify-between">
      <div className="flex">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={fistApp.applicatioLogoUrl ?? '/static/svg/profile.svg'}
          alt=""
        />
        <div className="mx-2">
          <div className="text-sm"> {fistApp.applicationName}</div>
          <div className="text-xs text-ic-black-5s"> {fistApp.roleName}</div>
        </div>
      </div>
      {applications.length > 1 && (
        <div className="flex">
          <div className="px-1.5 py-0.5 rounded-3xl bg-ic-ink-1s font-medium">+{applications.length}</div>
          <Popover placement="bottom-end" open={isOpen} handler={setIsOpen}>
            <PopoverHandler className="rounded-full !p-0 !bg-transparent">
              <button>
                <SvgIcon icon="arrow" />
              </button>
            </PopoverHandler>
            <PopoverContent className={classNames('shadow-12 rounded-xl')}>
              <div className="scroll px-1 py-2 overflow-auto scrollbar" style={{ width: 320, maxHeight: 196 }}>
                {applications.map((item) => (
                  <div className="flex mb-3" key={item.applicationId}>
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={item.applicatioLogoUrl ?? '/static/svg/profile.svg'}
                      alt=""
                    />
                    <div className="mx-2">
                      <div className="text-sm text-black"> {item.applicationName}</div>
                      <div className="text-xs text-ic-black-5s"> {item.roleName}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-3 text-right w-full sticky">
                <Button onClick={() => setIsOpen(false)} variant="outlined">
                  {t('cancel')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default ApplicationCol;
