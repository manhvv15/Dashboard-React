import { useState } from 'react';

import { Button, Popover, PopoverContent, PopoverHandler } from '@ichiba/ichiba-core-ui';
import classNames from 'classnames';
import { t } from 'i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { OrganizationResponse } from '@/types/user-management/user';

interface IProps {
  organizations: OrganizationResponse[];
}

const OrganizationCol = ({ organizations }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>();
  if (organizations == null || !organizations.length) {
    return <span className="text-ic-ink-4"></span>;
  }
  const fistOrg = organizations[0];
  return (
    <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center justify-between">
      <div className="flex">
        <div className="mx-2">
          <div className="text-sm"> {fistOrg.name}</div>
          <div className="text-xs text-ic-black-5s"> {fistOrg.code}</div>
        </div>
      </div>
      {organizations.length > 1 && (
        <div className="flex">
          <div className="px-1.5 py-0.5 rounded-3xl bg-ic-ink-1s font-medium">+{organizations.length}</div>
          <Popover placement="bottom-end" open={isOpen} handler={setIsOpen}>
            <PopoverHandler className="rounded-full !p-0 !bg-transparent">
              <button>
                <SvgIcon icon="arrow" />
              </button>
            </PopoverHandler>
            <PopoverContent className={classNames('shadow-12 rounded-xl')}>
              <div className="scroll px-1 py-1 overflow-auto scrollbar" style={{ width: 320, maxHeight: 196 }}>
                {organizations.map((item) => (
                  <div className="flex mb-2" key={item.id}>
                    <div className="mx-2">
                      <div className="text-sm text-black"> {item.name}</div>
                      <div className="text-xs text-black text-ic-black-5s"> {item.code}</div>
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

export default OrganizationCol;
