import { UserStatusEnum } from '@/types/user-management/customer';

interface IProps {
  status: UserStatusEnum;
}

const CustomerStatus = ({ status }: IProps) => {
  if (status == UserStatusEnum.Active)
    return (
      <>
        <div className="rounded-full border border-ic-green-6s text-xs leading-5 font-normal px-2 bg-ic-green-5s inline-block">
          <div className="h-4"></div>
        </div>
      </>
    );
  return (
    <>
      <div className="rounded-full border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal px-2 bg-ic-red-5s inline-block">
        <div className="h-4"></div>
      </div>
    </>
  );
};

export default CustomerStatus;
