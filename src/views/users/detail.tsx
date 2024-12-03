import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useNavigate, useParams } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { DetailUserInfomation } from '@/components/users/DetailUserInfomation';

import { DetailUserGroupRoles } from '@/components/users/DetailUserGroupRoles';
import { getUserById } from '@/services/user-management/user';
import { DetailUserApplications } from '@/components/users/DetailUserApplications';

const DetailUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: user, isLoading } = useQuery({
    queryKey: ['getDetailUserById', id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
    select: (res) => res.data,
  });

  return (
    <>
      <LayoutSection
        label={
          <button onClick={() => navigate(-1)} className="flex items-center">
            <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
            <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('user.detail')}</span>
          </button>
        }
      >
        <div className="h-full flex flex-col">
          {user && (
            <>
              <div className="flex justify-center pt-1">
                <DetailUserInfomation user={user} />
              </div>
              <div className="flex justify-center pt-3">
                <DetailUserApplications user={user} />
              </div>
              <div className="flex justify-center">
                <DetailUserGroupRoles user={user} isloading={isLoading} />
              </div>
            </>
          )}
        </div>
      </LayoutSection>
    </>
  );
};

export default DetailUser;
