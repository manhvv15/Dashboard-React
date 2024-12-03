import classNames from "classnames";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const BidFilterSection = ({ children, className }: Props) => {
  return <div className={classNames("flex gap-3", className)}>{children}</div>;
};
