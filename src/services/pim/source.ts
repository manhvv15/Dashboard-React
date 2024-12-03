import { ISource } from '@/types/pim/source';
import { instance } from '../xhr';
import { source } from './endpoint';

export const getAllSource = (): Promise<ISource[]> => {
  return instance.get(source.getAll);
};
