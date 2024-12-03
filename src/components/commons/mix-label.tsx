import clsx from 'clsx';

type MixLabelProps = {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  classNames?: string;
} & React.JSX.IntrinsicElements['div'];
const MixLabel = ({ label, children, required, classNames, ...props }: MixLabelProps) => {
  return (
    <div className={clsx('flex flex-col gap-2 w-full', classNames)} {...props}>
      <span className="font-normal text-sm">
        {label}
        {required && <span className="text-ic-red-6s">&nbsp;*</span>}
      </span>
      <div className="w-full">{children}</div>
    </div>
  );
};
export default MixLabel;
