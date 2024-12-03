import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label?: ReactNode;
  right?: ReactNode;
}

const LayoutSection = ({ children, label, right }: Props) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="z-50 sticky top-0 w-full min-h-14 border-b bg-ic-white-6s border-ic-ink-2s flex items-center justify-between px-6">
        <div className="text-base font-medium leading-6 text-ic-ink-6s">{label}</div>
        <div>{right}</div>
      </div>
      <div className="flex-1 bg-ic-ink-1s m-2 rounded-t-lg">{children}</div>
    </div>
  );
};
export default LayoutSection;
