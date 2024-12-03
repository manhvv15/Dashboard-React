import { cn } from '@/utils/common';
import { DateRangePicker, DateRangePickerProps } from '@ichiba/ichiba-core-ui';
import { useState } from 'react';
import SvgIcon from './SvgIcon';

interface DateRangeFilterProps extends DateRangePickerProps {
  name: string;
}

const DateRangeFilter = ({ name, ...props }: DateRangeFilterProps) => {
  const [visible, setVisible] = useState(false);

  const onOpenChange = (val: boolean) => {
    setVisible(val);
  };

  return (
    <DateRangePicker
      suffix={<SvgIcon icon="arrow" className={cn('transition-transform', visible ? '-rotate-180' : 'rotate-0')} />}
      prefix={<SvgIcon icon="calendar" className="justify-start" width={16} height={16} />}
      onOpenChange={onOpenChange}
      placement="bottom-end"
      size="40"
      rangeValueRenderer={() => <span className="whitespace-nowrap">{name}</span>}
      {...props}
    />
  );
};

export default DateRangeFilter;
