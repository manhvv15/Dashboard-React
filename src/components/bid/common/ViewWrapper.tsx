import { SubStatusPackageEnum } from '@/types/bid/enum';
import type { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
  status: SubStatusPackageEnum;
}

export const ViewWrapper = ({ status, children, ...rest }: Props) => {
  if (status !== SubStatusPackageEnum.Processing) {
    return <> {children}</>;
  }
  return (
    <div className="pointer-events-none" {...rest}>
      {children}
    </div>
  );
};
