import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { BidNickStatusEnum } from '@/types/bid/enum';
import { GetBidNickResponse } from '@/types/bid/interface';
import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

type Props = {
  data: GetBidNickResponse;
  onRemove: () => void;
  onEdit: () => void;
  onStopBidding: () => void;
  onConfirmAccountBlocked: () => void;
  onGetSuccessfullBidNow: () => void;
};
export default function ActionColRender({
  data,
  onRemove,
  onStopBidding,
  onEdit,
  onConfirmAccountBlocked,
  onGetSuccessfullBidNow,
}: Props) {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  return (
    <Menu>
      <MenuHandler>
        <Button variant="outlined" className="w-10 h-10 p-0 flex items-center justify-center">
          <SvgIcon icon="three-dots" width={24} height={24} />
        </Button>
      </MenuHandler>
      <MenuList>
        {data.status === BidNickStatusEnum.Ready && (
          <MenuItem key="StopBidding" className={'cursor-pointer flex items-center'} onClick={onStopBidding}>
            {bid('contextMenu.stopBidding')}
          </MenuItem>
        )}

        {data.status !== BidNickStatusEnum.Ready && data.status !== BidNickStatusEnum.BlockedByAuction && (
          <MenuItem key="StopBidding" className={'cursor-pointer flex items-center'} onClick={onStopBidding}>
            {bid('contextMenu.startBidding')}
          </MenuItem>
        )}

        <MenuItem
          key="GetSuccessfulBid"
          className={'cursor-pointer flex items-center'}
          onClick={onGetSuccessfullBidNow}
        >
          {bid('contextMenu.getSuccessfulBid')}
        </MenuItem>

        {data.status !== BidNickStatusEnum.BlockedByAuction && (
          <MenuItem
            key="ConfirmAccount"
            className={'cursor-pointer flex items-center'}
            onClick={onConfirmAccountBlocked}
          >
            {bid('contextMenu.confirmAccountBlocked')}
          </MenuItem>
        )}

        <MenuItem key="Edit" className={'cursor-pointer flex items-center'} onClick={onEdit}>
          <SvgIcon icon={'edit_c'} width={24} height={24} className="mr-2" />
          {common('edit')}
        </MenuItem>

        <MenuItem key="Delete" className={'cursor-pointer flex items-center'} onClick={onRemove}>
          <SvgIcon icon={'delete'} width={24} height={24} className="mr-2" />
          {common('delete')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
