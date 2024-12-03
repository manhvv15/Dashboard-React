import { DateTime } from 'luxon';

import { formatDate } from '@/utils/common';

export function formatTimeSimple({ time }: { time: string }) {
  if (!time) {
    return '';
  }
  const formatTime = DateTime.fromISO(time).setZone(window.timeZone);
  return formatTime.toLocaleString(DateTime.TIME_SIMPLE);
}
export const TimeFormatOnly = (data: any) => {
  return <>{formatTimeSimple({ time: data })}</>;
};
export const DateTimeFormatCustom = (data: any, format?: string) => {
  return data ? (
    <>
      {formatDate({
        time: data,
        dateFormat: format,
      })}{' '}
      {'  '}
      {TimeFormatOnly(data)}
    </>
  ) : (
    <></>
  );
};
export const DateFormatOnly = (data: any, format?: string) => {
  return <>{formatDate({ time: data, DATE_MED: false, dateFormat: format })}</>;
};
