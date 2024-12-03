import { useErrorBoundary } from 'react-error-boundary';

import { ShowRouterErrorBoundaryPayload } from '@/types/router';

export const useRouterError = () => {
  const { showBoundary } = useErrorBoundary();

  const showRouterErrorBoundary = (error: ShowRouterErrorBoundaryPayload) => {
    showBoundary(error);
  };

  return { showRouterErrorBoundary };
};
