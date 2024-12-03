import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import NodataImage from '@/public/static/images/empty.png';

const Nodata = () => {
  const { t } = useTranslation(LocaleNamespace.Common);
  return (
    <>
      <div className="flex flex-col flex-1 w-full items-center justify-center text-4xl ">
        <img src={NodataImage} alt="" width={168} height={168} />
        <div className="text-base text-ic-black-5s font-medium">Sorry,...</div>
        <div className="text-sm text-ic-black-5s mt-2">{t('nodata.description1')}</div>
        <div className="text-sm text-ic-black-5s">{t('nodata.description2')}</div>
        <div></div>
      </div>
    </>
  );
};
export default Nodata;
