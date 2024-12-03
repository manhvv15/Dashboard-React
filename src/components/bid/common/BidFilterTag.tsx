import { LocaleNamespace } from '@/constants/enums/common';
import type { BidFilterType } from '@/types/bid';
import { cn } from '@/utils/common';
import { Close } from '@ichiba/ichiba-core-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  tag: {
    type: BidFilterType;
    onClear: (e?: any) => void;
    value?: (string | number)[] | string | number;
    tagRender?: React.ReactNode;
  }[];
  onClearAll: (e?: any) => void;
  className?: string;
}

export const BidFilterTag = ({ tag, onClearAll, className }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const isShowed = tag.some((o) => [o.value, o.tagRender].some((x) => !!x));

  return (
    <>
      {isShowed && (
        <div className={cn('flex flex-wrap items-center gap-3', className)}>
          {tag.map((o, idx) => {
            const isTagShowed = !!o.value || !!o.tagRender;
            return (
              <React.Fragment key={idx}>
                {isTagShowed && (
                  <div className="text-sm leading-5 text-ic-ink-6s bg-ic-ink-1s rounded-lg px-2 py-1 flex items-center gap-2">
                    {o.tagRender
                      ? o.tagRender
                      : common('fieldValueIs', {
                          field: o.type,
                          value: Array.isArray(o.value) ? o.value.join(', ') : o.value,
                        })}
                    <Close color="black" onClick={() => o.onClear(undefined)} className="cursor-pointer" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          <p className="text-sm font-medium text-ic-brand-b cursor-pointer" onClick={onClearAll}>
            {common('clearAll')}
          </p>
        </div>
      )}
    </>
  );
};
