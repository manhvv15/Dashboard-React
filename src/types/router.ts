import { HttpStatus } from '@/constants/enums/common';

export interface ShowRouterErrorBoundaryPayload {
  status: HttpStatus;
  message?: string;
}
