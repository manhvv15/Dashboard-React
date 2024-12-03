import SvgIcon from '@/components/commons/SvgIcon';

interface Props {
  children: React.ReactNode;
}

export default function NoDataTable({ children }: Props) {
  return (
    <div className="w-full h-full gap-y-2 flex items-center justify-center flex-col">
      <SvgIcon icon="empty" width={168} height={168} className="flex items-center" />
      <div>{children}</div>
    </div>
  );
}
