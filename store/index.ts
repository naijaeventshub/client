/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { users } from './users';
import { roles } from './roles';
import { locations } from './locations';
import { auditLogs } from './audit-logs';
import dashboardFiltersReducer from './dashboard-filters';

const autoResetMiddleware =
  (storeAPI: any) => (next: any) => (action: AnyAction) => {
    // Check for fulfilled mutation actions
    if (action.type && action.type.endsWith('/fulfilled')) {
      // Pattern: brandsApi/executeMutation/fulfilled
      const match = action.type.match(/^(\w+)\/executeMutation\/fulfilled$/);
      if (match) {
        const [, reducerPath] = match;

        // Get the actual endpoint name from meta.arg.endpointName
        const endpointName = action.meta?.arg?.endpointName;

        if (endpointName) {
          // Check if this is a mutation that should trigger a reset
          const isMutation =
            endpointName.startsWith('create') ||
            endpointName.startsWith('update') ||
            endpointName.startsWith('delete');

          if (isMutation) {
            // Find the matching API and reset its state
            const apiEntry = Object.values(storeApis).find(
              (api: any) => api.reducerPath === reducerPath
            );

            if (apiEntry && apiEntry.util?.resetApiState) {
              setTimeout(() => {
                storeAPI.dispatch(apiEntry.util.resetApiState());
              }, 500);
            }
          }
        }
      }
    }

    return next(action);
  };

export const store = configureStore({
  reducer: {
    [users.reducerPath]: users.reducer,
    [roles.reducerPath]: roles.reducer,
    [locations.reducerPath]: locations.reducer,
    [auditLogs.reducerPath]: auditLogs.reducer,
    dashboardFilters: dashboardFiltersReducer,
  } as any,
  middleware: (getDefaultMiddleware) =>
    (getDefaultMiddleware() as any).concat([
      autoResetMiddleware,
      users.middleware,
      roles.middleware,
      locations.middleware,
      auditLogs.middleware,
    ]) as any,
});

export const storeApis = {
  users,
  roles,
  locations,
  auditLogs,
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
