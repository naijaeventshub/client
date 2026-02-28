import { AnyAction, configureStore } from "@reduxjs/toolkit";
import { auditLogs } from "./audit-logs";
import { dashboardApi } from "./dashboard-api";
import dashboardFiltersReducer from "./dashboard-filters";
import { locations } from "./locations";
import { reports } from "./reports";
import { roles } from "./roles";
import { settings } from "./settings";
import { users } from "./users";
import { webUsers } from "./web-users";

const autoResetMiddleware =
  (storeAPI: any) => (next: any) => (action: AnyAction) => {
    // Check for fulfilled mutation actions
    if (action.type && action.type.endsWith("/fulfilled")) {
      // Pattern: brandsApi/executeMutation/fulfilled
      const match = action.type.match(/^(\w+)\/executeMutation\/fulfilled$/);
      if (match) {
        const [, reducerPath] = match;

        // Get the actual endpoint name from meta.arg.endpointName
        const endpointName = action.meta?.arg?.endpointName;

        if (endpointName) {
          // Check if this is a mutation that should trigger a reset
          const isMutation =
            endpointName.startsWith("create") ||
            endpointName.startsWith("update") ||
            endpointName.startsWith("delete");

          if (isMutation) {
            // Find the matching API and reset its state
            const apiEntry = Object.values(storeApis).find(
              (api: any) => api.reducerPath === reducerPath,
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
    [auditLogs.reducerPath]: auditLogs.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    dashboardFilters: dashboardFiltersReducer,
    [locations.reducerPath]: locations.reducer,
    [reports.reducerPath]: reports.reducer,
    [roles.reducerPath]: roles.reducer,
    [settings.reducerPath]: settings.reducer,
    [users.reducerPath]: users.reducer,
    [webUsers.reducerPath]: webUsers.reducer,
  } as any,
  middleware: (getDefaultMiddleware) =>
    (getDefaultMiddleware() as any).concat([
      autoResetMiddleware,
      auditLogs.middleware,
      dashboardApi.middleware,
      locations.middleware,
      reports.middleware,
      roles.middleware,
      settings.middleware,
      users.middleware,
      webUsers.middleware,
    ]) as any,
});

export const storeApis = {
  auditLogs,
  dashboardApi,
  locations,
  reports,
  roles,
  settings,
  users,
  webUsers,
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
