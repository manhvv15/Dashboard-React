import { useState } from 'react';

import { Button, Popover, PopoverContent, PopoverHandler } from '@ichiba/ichiba-core-ui';
import classNames from 'classnames';
import { t } from 'i18next';

import { MarketResponse } from '@/types/user-management/workspace';
import SvgIcon from '../../commons/SvgIcon';

interface IProps {
  markets: MarketResponse[];
}

const MarketCol = ({ markets }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>();
  if (markets == null || !markets.length) {
    return <span className="text-ic-ink-4"></span>;
  }
  const fistMarket = markets[0];
  return (
    <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-sm text-ic-primary-6s"> {fistMarket.name}</div>
      </div>
      {markets.length > 1 && (
        <div className="flex">
          <div className="px-1.5 py-0.5 rounded-3xl bg-ic-ink-1s font-medium">+{markets.length}</div>
          <Popover placement="bottom-end" open={isOpen} handler={setIsOpen}>
            <PopoverHandler className="rounded-full !p-0 !bg-transparent">
              <button>
                <SvgIcon icon="arrow" />
              </button>
            </PopoverHandler>
            <PopoverContent className={classNames('shadow-12 rounded-xl')}>
              <div className="scroll px-1 py-2 overflow-auto scrollbar" style={{ width: 320, maxHeight: 196 }}>
                {markets.map((item) => (
                  <div className="flex mb-3 border-b pb-2" key={item.id}>
                    <div className="text-sm text-ic-primary-6s"> {item.name}</div>
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

export default MarketCol;
