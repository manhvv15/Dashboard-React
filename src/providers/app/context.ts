import { createContext } from 'react';

import { ToastMessageProps } from '@ichiba/ichiba-core-ui/dist/components/toast/ToastMessage';

export interface AppContextProps {
  showToast: (toast: ToastMessageProps) => void;
}

export const AppContext = createContext({} as AppContextProps);
