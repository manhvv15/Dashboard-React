import { Dispatch, SetStateAction, createContext } from 'react';

import { Currency } from '@/types';

interface InvoiceContextProps {
  setCurrencies: Dispatch<SetStateAction<Currency[]>>;
  currencies: Currency[];
}

export const InvoiceContext = createContext({} as InvoiceContextProps);
