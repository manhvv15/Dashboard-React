import SvgIcon from '@/components/commons/SvgIcon';
import { cn } from '@/utils/common';

export const NoProduct = ({
  text,
  children,
  className,
}: {
  text: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(className, 'flex flex-col justify-center items-center')}>
      <SvgIcon icon="not-found-product" width={150} height={150} />
      <p className="font-medium text-ic-ink-6s text-center mt-4">{text}</p>
      {children}
    </div>
  );
};
