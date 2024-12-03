import { cn } from '@/utils/common';
import React from 'react';

const colorList = {
  green: 'text-green-600 border-green-600 bg-green-100',
  red: 'text-red-600 border-red-600 bg-red-100',
  blue: 'text-blue-600 border-blue-600 bg-blue-100',
  orange: 'text-orange-600 border-orange-600 bg-orange-100',
  gray: 'text-pending-400 border-pending-400 bg-pending-100',
};

export type StatusButtonColorType = keyof typeof colorList;

interface Props extends React.HTMLProps<HTMLDivElement> {
  colorType?: StatusButtonColorType;
}

export const StatusButton = ({ children, className, colorType = 'green' }: Props) => {
  return (
    <div
      className={cn(
        'border w-fit rounded px-2 py-[2px] flex items-center justify-center text-sm',
        className,
        colorList[colorType],
      )}
    >
      {children}
    </div>
  );
};
