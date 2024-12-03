import { Dispatch, SetStateAction } from 'react';

import { Dialog, DialogBody, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { changeLogServiceModel } from '@/services/configuration';
import { formatDate } from '@/utils/common';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

export const ModalChangeLogServiceModel = ({ open, setOpen, id }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const { data } = useQuery({
    queryKey: ['changeLogServiceModel', id],
    queryFn: () => changeLogServiceModel(id),
    enabled: !!id,
  });

  return (
    <Dialog size="xs" onClose={() => setOpen(false)} open={open} handler={setOpen}>
      <DialogHeader closeable>
        <p>{common('changeLogs')}</p>
      </DialogHeader>
      <DialogBody className="mb-6">
        <div>
          <div className="grid grid-cols-2 bg-ic-light rounded">
            <p className="text-center p-2 text-base font-bold leading-6 text-ic-ink-5s">{common('time')}</p>
            <p className="text-center p-2 text-base font-bold leading-6 text-ic-ink-5s">{common('editor')}</p>
          </div>
          <div>
            {data?.data?.map((i) => {
              return (
                <div className="grid grid-cols-2 border-b border-ic-ink-2s w-full" key={i.id}>
                  <p className="text-base p-2 text-center font-normal leading-6 text-ic-ink-5s">
                    {formatDate({ time: i.createdAt, dateFormat: 'hh:mm MM/dd/yyyy' })}
                  </p>
                  <p className="text-base p-2 text-center font-normal leading-6 text-ic-ink-5s">{i.createdBy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};
