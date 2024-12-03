import { showToast } from '@/utils/toasts';

import { AppContext } from './context';

export interface AppProviderProps {
  children?: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  return <AppContext.Provider value={{ showToast }}>{children}</AppContext.Provider>;
};

export default AppProvider;
