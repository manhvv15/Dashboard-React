import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useTranslation } from 'react-i18next';

export const TagRecomentHeader = () => {
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  return (
    <div className="flex flex-row font-medium text-sm border-b-2">
      <div className="p-2 w-[50px]">
        <div className="border-r-2 pr-2">
          <SvgIcon icon="dragging" width={24} height={24} />
        </div>
      </div>
      <div className="py-2 pl-2 w-[35px]">
        <div className="border-r-2 pr-4 h-6">#</div>
      </div>
      <div className=" pl-2 flex w-[826px] items-center justify-between relative before:content-[''] before:block before:right-0 before:top-2 before:border-r-ic-ink-2s before:border before:h-[70%] before:absolute">
        <span className="">{tShip4p('table.nameTag')}</span>
      </div>
      <div className="w-60 p-2 flex items-center justify-start relative before:content-[''] before:block before:right-0 before:top-2 before:border-r-ic-ink-2s before:border before:h-[70%] before:absolute">
        {tShip4p('table.update')}
      </div>
      <div className="w-60 p-2 flex items-center justify-start relative before:content-[''] before:block before:right-0 before:top-2 before:border-r-ic-ink-2s before:border before:h-[70%] before:absolute">
        {tShip4p('table.create')}
      </div>
      <div className="w-60 flex items-center justify-start p-2">{tShip4p('table.action')}</div>
    </div>
  );
};
