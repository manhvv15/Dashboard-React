import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deteleRecomendEntries, updateRecomentedEntry } from '@/services/ship4p/recommented';
import { CreateRecommendedEntries, GetEntriesRecommendedResponse } from '@/types/ship4p/recomented';
import { Button, Close, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tag?: GetEntriesRecommendedResponse;
  type: 'delete' | 'edit';
}

export default function ModalRemoveRecoment({ isOpen, onClose, tag, type }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const updateRecomented = useMutation({
    mutationFn: updateRecomentedEntry,
  });
  const deleteRecomented = useMutation({
    mutationFn: deteleRecomendEntries,
  });
  const onHandleDeleteTag = () => {
    if (type === 'edit') {
      const dataUpdate = {
        accountSystemId: tag?.accountSystemId,
        countryCode: tag?.countryCode,
        countryId: tag?.countryId,
        countryName: tag?.countryName,
        recommeneds: tag?.tagRecommeneds,
        shippingType: tag?.shippingType,
      } as CreateRecommendedEntries;
      updateRecomented.mutate(dataUpdate, {
        onSuccess: () => {
          showToast({
            type: 'success',
            detail: ship4p('delete.recomented.succes'),
          });
          onClose();
        },
        onError: () => {
          showToast({
            type: 'error',
            detail: error('export.error'),
          });
        },
      });
    } else {
      deleteRecomented.mutate(
        {
          accountSystemId: tag?.accountSystemId ?? '',
        },
        {
          onSuccess: () => {
            showToast({
              type: 'success',
              detail: ship4p('delete.tag.succes'),
            });
            onClose();
          },
          onError: () => {
            showToast({
              type: 'error',
              detail: error('export.error'),
            });
          },
        },
      );
    }
  };
  return (
    <Dialog open={isOpen} size="sm" handler={onClose} className="'min-w-[1000px]': min-w-[1000px]">
      <DialogHeader className="flex justify-between">
        {ship4p('modal.recomentedTag.remove.title')}
        <div onClick={onClose} className="cursor-pointer">
          <Close />
        </div>
      </DialogHeader>
      <DialogBody className="relative text-ic-black-6">
        <p className="text-sm leading-5 font-normal text-ic-ink-5s">{ship4p('modal.recomentedTag.remove.label')}</p>
      </DialogBody>
      <DialogFooter>
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            size="40"
            className="w-[160px] justify-center items-center"
            variant="outlined"
            onClick={onClose}
          >
            {t('button.cancel')}
          </Button>

          <Button
            type="button"
            size="40"
            color="primary"
            className="w-[160px] justify-center items-center"
            variant="filled"
            loading={updateRecomented.isLoading || deleteRecomented.isLoading}
            disabled={updateRecomented.isLoading || deleteRecomented.isLoading}
            onClick={onHandleDeleteTag}
          >
            {t('confirm')}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
