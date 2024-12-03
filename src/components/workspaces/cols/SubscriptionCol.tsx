import { useState } from 'react';

import { Button, Popover, PopoverContent, PopoverHandler } from '@ichiba/ichiba-core-ui';
import classNames from 'classnames';
import { t } from 'i18next';

import { SubscriptionInforResponse } from '@/types/user-management/workspace';
import { formatNumber } from '@/utils/common';
import SvgIcon from '../../commons/SvgIcon';
import SubscriptionStatus from '../subsciptions/SubscriptionStatus';

interface IProps {
  subscriptions: SubscriptionInforResponse[];
}

const SubscriptionCol = ({ subscriptions }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>();
  if (subscriptions == null || !subscriptions.length) {
    return <span className="text-ic-ink-4"></span>;
  }
  const fistSub = subscriptions[0];
  return (
    <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center justify-between">
      <div className="flex items-center">
        <SubscriptionStatus status={fistSub.status}></SubscriptionStatus>
        <div className="mx-2">
          <div className="text-sm"> {fistSub.name}</div>
          {fistSub.amount && (
            <div className="text-xs text-ic-black-5s">
              {formatNumber(fistSub.amount ?? 0)} {fistSub.currencyCode}/{fistSub.periodType}
            </div>
          )}
        </div>
      </div>
      {subscriptions.length > 1 && (
        <div className="flex">
          <div className="px-1.5 py-0.5 rounded-3xl bg-ic-ink-1s font-medium">+{subscriptions.length}</div>
          <Popover placement="bottom-end" open={isOpen} handler={setIsOpen}>
            <PopoverHandler className="rounded-full !p-0 !bg-transparent">
              <button>
                <SvgIcon icon="arrow" />
              </button>
            </PopoverHandler>
            <PopoverContent className={classNames('shadow-12 rounded-xl')}>
              <div className="scroll px-1 py-2 overflow-auto scrollbar" style={{ width: 320, maxHeight: 196 }}>
                {subscriptions.map((item) => (
                  <div className="flex mb-3" key={item.id}>
                    <SubscriptionStatus status={item.status}></SubscriptionStatus>
                    <div className="mx-2">
                      <div className="text-sm text-black"> {item.name}</div>
                      <div className="text-xs text-ic-black-5s"> {item.periodType}</div>
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

export default SubscriptionCol;
