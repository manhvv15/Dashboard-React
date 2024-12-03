import { createRef } from 'react';

import { ToastRefType } from '@ichiba/ichiba-core-ui';
import { ToastMessageProps } from '@ichiba/ichiba-core-ui/dist/components/toast/ToastMessage';

export const toastRef = createRef<ToastRefType>();

export const showToast = (params: ToastMessageProps) => {
  toastRef.current?.show(params);
};
