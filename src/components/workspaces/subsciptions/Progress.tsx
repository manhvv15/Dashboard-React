import clsx from 'clsx';

interface Props {
  value: number;
  total: number;
  className?: string;
}

export default function Progress({ value, total, className }: Props) {
  return (
    <div className={clsx(className, 'w-full bg-ic-primary-1s h-2 rounded overflow-hidden')}>
      <div className="bg-ic-primary-6s h-full rounded" style={{ width: `${(value / total) * 100}%` }}></div>
    </div>
  );
}
