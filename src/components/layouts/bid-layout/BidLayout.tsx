interface BidLayoutProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}
const BidLayout = ({ left, right, children }: BidLayoutProps) => {
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between h-[60px] w-full px-5 pt-3 pb-2 border-b border-ic-ink-2s bg-white sticky z-10">
        <div>{left}</div>
        <div>{right}</div>
      </div>
      <div className="p-2 flex-1 overflow-hidden flex flex-col">{children}</div>
    </div>
  );
};
export default BidLayout;
