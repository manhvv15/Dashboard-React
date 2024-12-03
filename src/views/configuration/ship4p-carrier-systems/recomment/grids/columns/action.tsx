import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { ACTIONS_VALUE } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { getTagRecomented } from '@/services/ship4p/recommented';
import { CreateRecommendedEntries, GetEntriesRecommendedResponse, TagsRecomented } from '@/types/ship4p/recomented';
import { isGrantPermission } from '@/utils/common';
import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateRecomentedEntry } from '../../modals/create';
import ModalRemoveRecoment from '../../modals/remove';

export const ActionRecomented = ({ data, confirm }: { data: GetEntriesRecommendedResponse; confirm: () => void }) => {
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const [tagRecomments, setTagRecomments] = useState<TagsRecomented[]>();
  const [itemDelete, setItemDelete] = useState<GetEntriesRecommendedResponse>();
  const [itemUpdate, setItemUpdate] = useState<CreateRecommendedEntries>();
  const [visibleUpdate, setVisibleUpdate] = useState<boolean>(false);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const listAction = [
    {
      label: tShip4p('action.delete'),
      value: ACTIONS_VALUE.REMOVE,
      isShow: isGrantPermission(OBJECTS.MANAGE_RECOMMENDS, ACTIONS.DELETE),
    },
  ];
  const onCloseDelete = () => {
    setVisibleDelete(false);
    confirm();
  };
  const onClickUpdate = () => {
    setVisibleUpdate(true);
    const dataUpdate = {
      accountSystemId: data?.accountSystemId,
      countryCode: data?.countryCode,
      countryId: data?.countryId,
      countryName: data?.countryName,
      recommeneds: data?.tagRecommeneds,
      shippingType: data?.shippingType,
      id: data?.id,
    } as CreateRecommendedEntries;
    setItemUpdate(dataUpdate);
  };
  const onCloseUpdate = () => {
    setVisibleUpdate(false);
    confirm();
  };
  const onAction = (action: string) => {
    switch (action) {
      case ACTIONS_VALUE.REMOVE:
        const itemDelete = {
          accountSystemId: data.accountSystemId,
        } as GetEntriesRecommendedResponse;
        setItemDelete(itemDelete);
        setVisibleDelete(true);
        break;
      default:
        break;
    }
  };
  useQuery({
    queryKey: ['getTagRecommentForCreate'],
    queryFn: () =>
      getTagRecomented({
        keyword: '',
      }),
    onSuccess: (res) => {
      setTagRecomments(res.data);
    },
  });
  return (
    <div className="flex items-center justify-start">
      <div className="flex gap-2">
        <AccessibleComponent object={OBJECTS.MANAGE_RECOMMENDS} action={ACTIONS.EDIT}>
          <Button size="40" variant="outlined" className="w-[69px]" color="primary" onClick={onClickUpdate}>
            {tShip4p('btn.edit')}
          </Button>
        </AccessibleComponent>
        <Menu>
          <MenuHandler className=" rounded-lg  !p-2">
            <Button color="stroke" size="40" variant="outlined" className="w-10 h-10">
              <SvgIcon icon="dots-menu" className="mx-1" width={16} height={16} />
            </Button>
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
          <ModalRemoveRecoment isOpen={visibleDelete} onClose={onCloseDelete} tag={itemDelete} type="delete" />
        </Suspense>
      )}
      {visibleUpdate && (
        <Suspense>
          <CreateRecomentedEntry
            type="edit"
            open={visibleUpdate}
            onClose={onCloseUpdate}
            dataUpdate={itemUpdate}
            tagRecomments={tagRecomments}
          />
        </Suspense>
      )}
    </div>
  );
};
