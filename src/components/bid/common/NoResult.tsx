import { cn } from '@/utils/common';
import { useTranslation } from 'react-i18next';

export const NoResult = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  const { t: bid } = useTranslation('bid');
  return (
    <div className={cn(className, 'flex flex-col gap-4 justify-center items-center')}>
      <img src={'/public/svg/notFound.svg'} alt="NotFound" />
      <div className="flex flex-col justify-center items-center gap-2">
        <p className="font-medium text-ic-ink-6s text-center">{bid('thereIsNoResult')}</p>
        <p className="text-sm text-hint">{bid('pleaseSearchByOtherInformationFields')}</p>
      </div>
      {children}
    </div>
  );
};
