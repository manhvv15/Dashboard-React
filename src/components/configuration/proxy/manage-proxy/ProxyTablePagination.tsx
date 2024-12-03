import ArrowIcon from '@/public/static/icons/arrow.svg';
import { IProxyWorkspace, PageResponse } from '@/types/pim/proxy';
import { PageFilter } from '@/types/user-management/common';
import { cn } from '@/utils/common';
import { PAGE_SIZES } from '@/utils/constants';
import { Button, Pagination, SelectPortal } from '@ichiba/ichiba-core-ui';
import { ChangeEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface IProxyTablePaginationProp {
  hidden: boolean;
  moveToPage: string | undefined;
  filterForm: PageFilter;
  proxies: PageResponse<IProxyWorkspace> | undefined;
  handlePageChange: (pageIndex: number) => void;
  handleMoveToPageChanged: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMoveToPage: () => void;
  setFilterForm: React.Dispatch<React.SetStateAction<PageFilter>>;
  onHandleChangePageSize: (value: number) => void;
}

const ProxyTablePagination: React.FC<IProxyTablePaginationProp> = (props) => {
  const { t: common } = useTranslation('pim-trading');

  const handlePageChange = (pageIndex: number) => {
    props.setFilterForm((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const onHandleChangePageSize = useCallback((value: any) => {
    props.setFilterForm((prev) => ({
      ...prev,
      pageIndex: 1,
      pageSize: Number(value) !== prev.pageSize ? Number(value) : prev.pageSize,
    }));
  }, []);
  return (
    <div
      className={cn(
        'w-full bg-white flex py-2 pr-8 text-sm justify-between items-center border-t border-ic-black-2s',
        props.hidden && 'hidden',
      )}
    >
      <div className="flex items-center ml-8">
        <div className="flex items-center">
          <p className=" whitespace-nowrap">{common('show')}: </p>
          <SelectPortal
            onChange={props.onHandleChangePageSize}
            defaultValue={props.filterForm.pageSize}
            options={PAGE_SIZES.map((x) => {
              return { value: String(x), label: String(x) };
            })}
            className="ml-2 w-[100px]"
          />
        </div>
        <div className="flex items-center ml-4">
          <p>{common('result')}</p>
          <div className="w-[1px] h-[20px] bg-ic-ink-2s mx-3"></div>
          <p>
            {common('showPage', {
              currentPage:
                props.filterForm.pageIndex === 0
                  ? props.filterForm.pageIndex
                  : (props.filterForm.pageIndex! - 1) * props.filterForm.pageSize! + 1,
              nextPage:
                (props.proxies?.totalRecords || 0) < props.filterForm.pageIndex! * props.filterForm.pageSize!
                  ? props.proxies?.totalRecords
                  : props.filterForm.pageIndex! * props.filterForm.pageSize!,
              totalRecords: props.proxies?.totalRecords,
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Pagination
          totalPage={props.proxies?.totalPages}
          pageSize={props.proxies?.pageSize}
          setChangePage={handlePageChange}
          setChangePageSize={onHandleChangePageSize}
          currentPage={props.proxies?.pageIndex || 1}
          totalRecords={props.proxies?.totalRecords}
        />
        <div className="flex items-center ml-4">
          <p>{common('goto')}</p>
          <input
            placeholder={String(props.filterForm.pageIndex! + 1)}
            value={props.moveToPage}
            onChange={props.handleMoveToPageChanged}
            className="w-[58px] h-9 border border-ic-ink-2 outline-none px-2 py-1.5 ml-2 rounded-lg"
            type="text"
          />
          <Button disabled={!props.moveToPage} onClick={props.handleMoveToPage} className="!py-[6px] ml-2 !px-2">
            {/* <Image src={ArrowRightIcon} width={24} height={24} className="!px-0" alt="ArrowRightIcon" /> */}
            <ArrowIcon className={cn('text-ic-white-6s transition-transform')} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProxyTablePagination;
