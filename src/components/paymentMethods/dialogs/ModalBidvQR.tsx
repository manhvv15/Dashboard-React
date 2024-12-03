import { Dispatch, SetStateAction } from 'react';

import { Dialog, DialogBody, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { LocaleNamespace } from '@/constants/enums/common';
import { overviewQRBidv } from '@/services/payment-method';
import { showToast } from '@/utils/toasts';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  accountNumber: string;
  accountHolder: string;
  bin: string;
}

const ModalBidvQR = ({ open, setOpen, accountNumber, accountHolder, bin }: Props) => {
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const { data, isRefetching } = useQuery({
    queryKey: ['overviewQRBidv', accountHolder, accountNumber],
    queryFn: () =>
      overviewQRBidv({
        useId: uuidv4(),
        body: {
          amount: 10000,
          accountNumber,
          accountHolder,
          bin,
        },
      }),
    enabled: !!accountHolder && !!accountNumber && !!bin,
    retry: false,
    onError: (err: any) => {
      const { errorNormal } = err;
      if (errorNormal) {
        showToast({
          type: 'error',
          summary: error(errorNormal),
        });
      }
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} size="sm" className="min-h-[60vh]" handler={setOpen}>
      <DialogBody>
        <LoadingOverlay isLoading={isRefetching} className="w-full h-full">
          {data && (
            <div className="flex justify-center">
              <img className="" width={'450'} height={'550'} src={data.data.qrContentURL} alt="QRcode" />
            </div>
          )}
        </LoadingOverlay>
      </DialogBody>
    </Dialog>
  );
};

export default ModalBidvQR;
