import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, dateFormat, OBJECTS } from '@/constants/variables/common';
import { ACTIONS_VALUE } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { TagsRecomented } from '@/types/ship4p/recomented';
import { cn, formatDate, isGrantPermission } from '@/utils/common';
import { Draggable } from '@hello-pangea/dnd';
import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import clsx from 'clsx';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateTagRecommented } from './create';
import ModalRemoveTagRecoment from './remove';
interface props {
  item: TagsRecomented;
  onConfirm: () => void;
  index: number;
}
export const TabRecomentItems = ({ item, onConfirm, index }: props) => {
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const [visibleUpdate, setVisibleUpdate] = useState<boolean>(false);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const listAction = [
    {
      label: tShip4p('action.delete'),
      value: ACTIONS_VALUE.REMOVE,
      isShow: isGrantPermission(OBJECTS.MANAGE_TAG, ACTIONS.DELETE),
    },
  ];
  const onCloseDelete = () => {
    setVisibleDelete(false);
    onConfirm();
  };
  const onClickUpdate = () => {
    setVisibleUpdate(true);
  };
  const onCloseUpdate = () => {
    setVisibleUpdate(false);
    onConfirm();
  };
  const onAction = (action: string) => {
    switch (action) {
      case ACTIONS_VALUE.REMOVE:
        setVisibleDelete(true);
        break;
      default:
        break;
    }
  };

  return (
    <Draggable index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div
            className={cn('flex flex-row  h-14 items-center font-medium text-sm border-b', {
              'bg-ic-blue-1s border-ic-blue-2s border rounded-lg': snapshot.isDragging,
            })}
          >
            <div className="p-2 border-r-2 w-[42px]">
              <div>
                <SvgIcon icon="dragging" width={24} height={24} />
              </div>
            </div>
            <div className="p-2 border-r-2 flex items-center justify-center w-[43px]">
              <div className="h-6">{item?.stt}</div>
            </div>
            <div className="p-2 w-[830px] flex items-center justify-between relative before:content-[''] before:block before:right-0 before:top-0 before:border-r-ic-ink-2s before:border before:h-[100%] before:absolute">
              <div
                className={clsx(
                  'h-5 gap-4 flex px-2 py-0.5 items-center max-w-max border-ic-ink-4s justify-center rounded',
                )}
                style={{
                  backgroundColor: item?.backgroundColor ?? '',
                }}
              >
                <span className={clsx('text-xs', item?.backgroundColor && 'text-white')}>{item?.name}</span>
              </div>
            </div>
            <div className="w-60 p-2 flex  items-center justify-start relative before:content-[''] before:block before:right-0 before:top-0 before:border-r-ic-ink-2s before:border before:h-[100%] before:absolute">
              {item?.updateAt && (
                <div className="flex h-6 justify-center flex-col gap-1 text-sm text-ic-ink-6s">
                  <span>
                    {formatDate({
                      time: item?.updateAt?.toString(),
                      dateFormat: dateFormat.MM_DD_YYYY,
                    })}
                  </span>
                  <span>
                    {formatDate({
                      time: item?.updateAt?.toString(),
                      dateFormat: dateFormat.hh_mm,
                    })}
                  </span>
                </div>
              )}
            </div>
            <div className="w-60 p-2 flex items-center justify-start relative before:content-[''] before:block before:right-0 before:top-0 before:border-r-ic-ink-2s before:border before:h-[100%] before:absolute">
              {item?.createAt && (
                <div className="flex h-6 justify-center flex-col gap-1 text-sm text-ic-ink-6s">
                  <span>
                    {formatDate({
                      time: item?.createAt?.toString(),
                      dateFormat: dateFormat.MM_DD_YYYY,
                    })}
                  </span>
                  <span>
                    {formatDate({
                      time: item?.createAt?.toString(),
                      dateFormat: dateFormat.hh_mm,
                    })}
                  </span>
                </div>
              )}
            </div>
            <div className="w-60 flex items-center justify-start p-2">
              <div className="flex gap-2">
                <Button size="40" variant="outlined" className="w-[69px]" color="primary" onClick={onClickUpdate}>
                  {tShip4p('btn.edit')}
                </Button>
                <Menu>
                  <MenuHandler className=" rounded-lg  !p-2">
                    <AccessibleComponent object={OBJECTS.MANAGE_TAG} action={ACTIONS.EDIT}>
                      <Button color="stroke" size="40" variant="outlined" className="w-10 h-10">
                        <SvgIcon icon="dots-menu" className="mx-1" width={16} height={16} />
                      </Button>
                    </AccessibleComponent>
                  </MenuHandler>
                  <MenuList>
                    {listAction
                      .filter((x) => x.isShow)
                      .map((i) => {
                        return (
                          <MenuItem key={i.value} onClick={() => onAction(i.value)} className="cursor-pointer">
                            {i.label}
                          </MenuItem>
                        );
                      })}
                  </MenuList>
                </Menu>
              </div>
              {visibleDelete && (
                <Suspense>
                  <ModalRemoveTagRecoment isOpen={visibleDelete} onClose={onCloseDelete} tag={item} />
                </Suspense>
              )}
              {visibleUpdate && (
                <Suspense>
                  <CreateTagRecommented type="edit" open={visibleUpdate} onClose={onCloseUpdate} dataUpdate={item} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
