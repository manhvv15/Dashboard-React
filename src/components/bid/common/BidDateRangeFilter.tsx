import SvgIcon from '@/components/commons/SvgIcon';
import { BidDateType } from '@/types/bid';
import { Button, DateRangePicker, Menu, MenuHandler, MenuList } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { useLayoutEffect, useState } from 'react';

interface Props {
  onChange: (params: BidDateType) => void;
  title: string;
  value?: BidDateType;
  icon?: React.ReactNode;
  isGetThirtyDayAgo?: boolean;
}

const thirtyDayAgo = new Date();
thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);

const initThirtyDayAgo = {
  startDate: thirtyDayAgo,
  endDate: new Date(),
};

const initDateRange = {
  startDate: new Date(),
  endDate: new Date(),
};

export const BidDateRangeFilter = ({ title, onChange, value, icon = 'calendar', isGetThirtyDayAgo }: Props) => {
  const [currentDateRange, setCurrentDateRange] = useState<PickerRange>(initDateRange);

  const handleChange = (item: any) => {
    const startDate: Date = item.selection?.startDate ?? new Date();
    const endDate: Date = item.selection?.endDate ?? new Date();
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();
    onChange({
      start: formattedStartDate,
      end: formattedEndDate,
    });
    setCurrentDateRange({
      startDate,
      endDate,
    });
  };
  useLayoutEffect(() => {
    if (!value) {
      if (isGetThirtyDayAgo) {
        setCurrentDateRange({
          ...initThirtyDayAgo,
        });
      } else {
        setCurrentDateRange({
          ...initDateRange,
        });
      }
    }
  }, [JSON.stringify(value)]);

  return (
    <Menu>
      <MenuHandler className="flex justify-center items-center gap-2 hover:!bg-ic-ink-1s border border-ic-ink-2s !bg-white !text-ic-ink-6s !rounded-lg">
        <Button>
          {typeof icon === 'string' ? <SvgIcon icon={icon} width={16} height={16} /> : icon}
          <span className="text-sm whitespace-nowrap">{title}</span>
          <SvgIcon icon="arrow" width={24} height={24} />
        </Button>
      </MenuHandler>
      <MenuList className="w-fit z-50 pb-4">
        {/* <DateRangePicker /> */}
        <DateRangePicker onChange={handleChange} value={currentDateRange} />
      </MenuList>
    </Menu>
  );
};
