/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, ApiRequestConfig } from '@/lib/api/api-client';
import { createApi } from '@reduxjs/toolkit/query/react';
import { DocumentNode } from 'graphql';
import { ApolloClient } from '@apollo/client';
import apolloClient from '@/lib/api/apollo-client';

// Types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type EntityApiOptions<T, _CreateT = Partial<T>, _UpdateT = Partial<T>> = {
  reducerPath: string;
  entityEndpoint?: string;
  entityName?: string; // Optional singular entity name (e.g., "Branch" for "branches")
  tagTypes?: string[];
  // GraphQL support
  graphqlQueries?: {
    getAll?: DocumentNode;
    getById?: DocumentNode;
    getSingle?: DocumentNode;
  };
  graphqlMutations?: {
    create?: DocumentNode;
    update?: DocumentNode;
    patch?: DocumentNode;
    delete?: DocumentNode;
  };
  graphqlClient?: ApolloClient;
  useGraphQL?: boolean;
};

type QueryArg<T = any> =
  | T
  | { params?: T; config?: ApiRequestConfig; extraPath?: string };
type MutationArg<T = any> =
  | { data: T; config?: ApiRequestConfig; extraPath?: string }
  | T;
type IdArg =
  | { id: string | number; config?: ApiRequestConfig; extraPath?: string }
  | string
  | number;

// URL utilities
const substituteUrlParams = (
  endpoint: string,
  params: Record<string, any> = {}
): string => {
  return endpoint.replace(
    /:(\w+)/g,
    (_, paramName) => params[paramName] || `:${paramName}`
  );
};

const getUrlParamNames = (endpoint: string): string[] => {
  return endpoint.match(/:(\w+)/g)?.map((match) => match.substring(1)) || [];
};

// Helper function to build URLs with extra path segments
const buildUrl = (baseUrl: string, extraPath?: string): string => {
  if (!extraPath) return baseUrl;
  const normalizedExtraPath = extraPath.startsWith('/')
    ? extraPath
    : `/${extraPath}`;
  return `${baseUrl}${normalizedExtraPath}`;
};

// Helper function to build URLs with parameters and extra path segments
const buildUrlWithParams = (
  endpoint: string,
  params: Record<string, any> = {},
  extraPath?: string
): string => {
  const urlParamNames = getUrlParamNames(endpoint);
  const queryParams = Object.entries(params)
    .filter(
      ([key, value]) =>
        value != null && value !== '' && !urlParamNames.includes(key)
    )
    .reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    );

  let url = `/${substituteUrlParams(endpoint, params)}`;

  // Append extra path if provided
  if (extraPath) {
    // Ensure extraPath starts with / if it doesn't already
    const normalizedExtraPath = extraPath.startsWith('/')
      ? extraPath
      : `/${extraPath}`;
    url += normalizedExtraPath;
  }

  if (Object.keys(queryParams).length > 0) {
    url += `?${new URLSearchParams(queryParams).toString()}`;
  }

  return url;
};

// Argument extractors
const extractQueryArgs = <T>(
  arg: QueryArg<T> | void
): { params: T; config?: ApiRequestConfig; extraPath?: string } => {
  if (!arg) return { params: {} as T };

  if (typeof arg === 'object' && 'params' in arg) {
    return {
      params: arg.params || ({} as T),
      config: arg.config,
      extraPath: arg.extraPath,
    };
  }

  // Handle case where extraPath is passed directly in the object
  if (typeof arg === 'object' && 'extraPath' in arg) {
    const { extraPath, config, ...params } = arg as any;
    return { params: params as T, config, extraPath };
  }

  return { params: arg as T, config: undefined, extraPath: undefined };
};

const extractIdArgs = (
  arg: IdArg
): { id: string; config?: ApiRequestConfig; extraPath?: string } => {
  if (typeof arg === 'string' || typeof arg === 'number') {
    return { id: String(arg), config: undefined, extraPath: undefined };
  }
  return { id: String(arg.id), config: arg.config, extraPath: arg.extraPath };
};

const extractMutationArgs = <T>(
  arg: MutationArg<T>
): { data: T; config?: ApiRequestConfig; extraPath?: string } => {
  if (typeof arg === 'object' && arg !== null && 'data' in arg) {
    return { data: arg.data, config: arg.config, extraPath: arg.extraPath };
  }

  return { data: arg as T, config: undefined, extraPath: undefined };
};

// API method handlers
const createApiHandler = (
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  dataExtractor: (result: any) => any
) => {
  return (url: string, bodyOrConfig?: any, config?: ApiRequestConfig) => {
    const actualConfig =
      bodyOrConfig &&
      typeof bodyOrConfig === 'object' &&
      'showToast' in bodyOrConfig
        ? bodyOrConfig
        : config;
    const actualBody =
      method === 'get' || method === 'delete' ? undefined : bodyOrConfig;

    return apiClient[method](url, actualBody, actualConfig).then((result) => ({
      data: dataExtractor(result),
    }));
  };
};

const apiHandlers = {
  GET_ALL: createApiHandler('get', (result) => result),
  GET_SINGLE: createApiHandler('get', (result) => result?.data?.items),
  GET_BY_ID: createApiHandler('get', (result) => result?.data?.item),
  POST: createApiHandler(
    'post',
    (result) => result?.data?.item || result?.data
  ),
  PUT: createApiHandler('put', (result) => result?.data?.item || result?.data),
  PATCH: createApiHandler(
    'patch',
    (result) => result?.data?.item || result?.data
  ),
  DELETE: createApiHandler(
    'delete',
    (result) => result?.data || { success: true }
  ),
} as const;

type ApiMethod = keyof typeof apiHandlers;

export const customBaseQuery = async ({
  url,
  method,
  body,
  config,
}: {
  url: string;
  method?: ApiMethod;
  body?: any;
  config?: ApiRequestConfig;
}) => {
  try {
    const methodKey = method || 'GET_BY_ID';
    const handler = apiHandlers[methodKey];

    if (!handler) {
      return {
        error: {
          status: 'METHOD_NOT_SUPPORTED',
          error: 'Method not supported',
        },
      };
    }

    // Handle different method signatures
    const needsBody = ['POST', 'PUT', 'PATCH'].includes(methodKey);
    return needsBody
      ? await handler(url, body, config)
      : await handler(url, config);
  } catch (error: any) {
    return {
      error: {
        status: error?.code || 'CUSTOM_ERROR',
        error: error?.message || 'Unknown error',
        data: error?.errors,
      },
    };
  }
};

// GraphQL base query helper
export const graphqlBaseQuery =
  (client: ApolloClient) =>
  async ({
    query,
    mutation,
    variables,
  }: {
    query?: DocumentNode;
    mutation?: DocumentNode;
    variables?: any;
    operationName?: string;
  }) => {
    try {
      if (query) {
        const result = await client.query({
          query,
          variables,
        });
        return { data: result.data };
      }

      if (mutation) {
        const result = await client.mutate({
          mutation,
          variables,
        });
        return { data: result.data };
      }

      return {
        error: {
          status: 'NO_OPERATION',
          error: 'No query or mutation provided',
        },
      };
    } catch (error: any) {
      return {
        error: {
          status: error?.networkError?.status || 'GRAPHQL_ERROR',
          error: error?.message || 'GraphQL request failed',
          data: error?.graphQLErrors,
        },
      };
    }
  };

export function createEntity<T, CreateT = Partial<T>, UpdateT = Partial<T>>(
  options: EntityApiOptions<T, CreateT, UpdateT>
) {
  const {
    reducerPath,
    entityEndpoint,
    entityName = '',
    tagTypes = [],
    graphqlQueries = {},
    graphqlMutations = {},
    graphqlClient,
    useGraphQL = false,
  } = options;

  const mainTag = tagTypes?.[0] || entityName || entityEndpoint || 'Entity';

  // Determine which base query to use
  const client = graphqlClient || apolloClient;
  const baseQuery =
    useGraphQL && client ? graphqlBaseQuery(client) : customBaseQuery;

  const api = createApi({
    reducerPath,
    baseQuery: baseQuery as any,
    tagTypes: [entityName, ...tagTypes],
    endpoints: (builder) => {
      const endpoints: any = {};

      // GET ALL
      if (useGraphQL && graphqlQueries.getAll) {
        endpoints.getAll = builder.query<
          T[],
          QueryArg<Record<string, any>> | void
        >({
          query: (arg) => {
            const { params } = extractQueryArgs(arg);
            return {
              query: graphqlQueries.getAll,
              variables: params,
              operationName: 'GetAll',
            };
          },
          transformResponse: (result: any) => {
            // Extract items from nested GraphQL response structure
            if (Array.isArray(result)) return result;

            // Handle { users: { items: [...] } } structure from USERS_QUERY
            if (result?.users?.items) return result.users.items;

            // Handle other possible nested structures
            if (result?.items) return result.items;
            if (result?.data?.items) return result.data.items;
            if (result?.edges) return result.edges.map((e: any) => e.node);

            return [];
          },
          providesTags: (result: any) => {
            const items = Array.isArray(result) ? result : [];

            return items.length > 0
              ? [
                  ...items.map((item: any) => ({
                    type: mainTag as any,
                    id: item.uuid || item.id,
                  })),
                  { type: mainTag as any, id: 'LIST' },
                ]
              : [{ type: mainTag as any, id: 'LIST' }];
          },
        });
      } else if (entityEndpoint) {
        endpoints.getAll = builder.query<
          T[],
          QueryArg<Record<string, any>> | void
        >({
          query: (arg) => {
            const { params, config, extraPath } = extractQueryArgs(arg);
            return {
              url: buildUrlWithParams(entityEndpoint, params, extraPath),
              method: 'GET_ALL',
              config,
            };
          },
          providesTags: (result) => {
            const items = Array.isArray(result)
              ? result
              : (result as any)?.data?.items || [];

            return items.length > 0
              ? [
                  ...items.map((item: any) => ({
                    type: mainTag as any,
                    id: item.uuid || item.id,
                  })),
                  { type: mainTag as any, id: 'LIST' },
                ]
              : [{ type: mainTag as any, id: 'LIST' }];
          },
        });
      }

      // GET BY ID
      if (useGraphQL && graphqlQueries.getById) {
        endpoints.getById = builder.query<T, IdArg>({
          query: (arg) => {
            const { id } = extractIdArgs(arg);
            return {
              query: graphqlQueries.getById,
              variables: { id },
              operationName: 'GetById',
            };
          },
          providesTags: (_result, _error, arg) => {
            const { id } = extractIdArgs(arg);
            return [{ type: mainTag as any, id }];
          },
        });
      } else if (entityEndpoint) {
        endpoints.getById = builder.query<T, IdArg>({
          query: (arg) => {
            const { id, config, extraPath } = extractIdArgs(arg);
            const baseUrl = `/${entityEndpoint}/${id}`;
            return {
              url: buildUrl(baseUrl, extraPath),
              method: 'GET_BY_ID',
              config,
            };
          },
          providesTags: (_result, _error, arg) => {
            const { id } = extractIdArgs(arg);
            return [{ type: mainTag as any, id }];
          },
        });
      }

      // GET SINGLE
      if (useGraphQL && graphqlQueries.getSingle) {
        endpoints.getSingle = builder.query<
          T,
          QueryArg<Record<string, any>> | void
        >({
          query: (arg) => {
            const { params } = extractQueryArgs(arg);
            return {
              query: graphqlQueries.getSingle,
              variables: params,
              operationName: 'GetSingle',
            };
          },
          providesTags: [{ type: mainTag as any, id: 'SINGLE' }],
        });
      } else if (entityEndpoint) {
        endpoints.getSingle = builder.query<
          T,
          QueryArg<Record<string, any>> | void
        >({
          query: (arg) => {
            const { params, config, extraPath } = extractQueryArgs(arg);
            return {
              url: buildUrlWithParams(entityEndpoint, params, extraPath),
              method: 'GET_SINGLE',
              config,
            };
          },
          providesTags: [{ type: mainTag as any, id: 'SINGLE' }],
        });
      }

      // CREATE
      if (useGraphQL && graphqlMutations.create) {
        endpoints.create = builder.mutation<T, MutationArg<CreateT>>({
          query: (arg) => {
            const { data } = extractMutationArgs(arg);
            return {
              mutation: graphqlMutations.create,
              variables: { input: data },
              operationName: 'Create',
            };
          },
          invalidatesTags: [{ type: mainTag as any, id: 'LIST' }],
        });
      } else if (entityEndpoint) {
        endpoints.create = builder.mutation<T, MutationArg<CreateT>>({
          query: (arg) => {
            const { data, config, extraPath } = extractMutationArgs(arg);
            const baseUrl = `/${entityEndpoint}`;
            return {
              url: buildUrl(baseUrl, extraPath),
              method: 'POST',
              body: data,
              config,
            };
          },
          invalidatesTags: [{ type: mainTag as any, id: 'LIST' }],
        });
      }

      // UPDATE
      if (useGraphQL && graphqlMutations.update) {
        endpoints.update = builder.mutation<
          T,
          {
            id: string | number;
            data: UpdateT;
            config?: ApiRequestConfig;
            extraPath?: string;
          }
        >({
          query: ({ id, data }) => {
            return {
              mutation: graphqlMutations.update,
              variables: { id, input: data },
              operationName: 'Update',
            };
          },
          invalidatesTags: (_result, _error, { id }) => [
            { type: mainTag as any, id },
            { type: mainTag as any, id: 'LIST' },
          ],
        });
      } else if (entityEndpoint) {
        endpoints.update = builder.mutation<
          T,
          {
            id: string | number;
            data: UpdateT;
            config?: ApiRequestConfig;
            extraPath?: string;
          }
        >({
          query: ({ id, data, config, extraPath }) => {
            const baseUrl = `/${entityEndpoint}/${id}`;
            return {
              url: buildUrl(baseUrl, extraPath),
              method: 'PUT',
              body: data,
              config,
            };
          },
          invalidatesTags: (_result, _error, { id }) => [
            { type: mainTag as any, id },
            { type: mainTag as any, id: 'LIST' },
          ],
        });
      }

      // PATCH
      if (useGraphQL && graphqlMutations.patch) {
        endpoints.patch = builder.mutation<
          T,
          {
            id: string | number;
            data: UpdateT;
            config?: ApiRequestConfig;
            extraPath?: string;
          }
        >({
          query: ({ id, data }) => {
            return {
              mutation: graphqlMutations.patch,
              variables: { id, input: data },
              operationName: 'Patch',
            };
          },
          invalidatesTags: (_result, _error, { id }) => [
            { type: mainTag as any, id },
            { type: mainTag as any, id: 'LIST' },
          ],
        });
      } else if (entityEndpoint) {
        endpoints.patch = builder.mutation<
          T,
          {
            id: string | number;
            data: UpdateT;
            config?: ApiRequestConfig;
            extraPath?: string;
          }
        >({
          query: ({ id, data, config, extraPath }) => {
            const baseUrl = `/${entityEndpoint}/${id}`;
            return {
              url: buildUrl(baseUrl, extraPath),
              method: 'PATCH',
              body: data,
              config,
            };
          },
          invalidatesTags: (_result, _error, { id }) => [
            { type: mainTag as any, id },
            { type: mainTag as any, id: 'LIST' },
          ],
        });
      }

      // DELETE
      if (useGraphQL && graphqlMutations.delete) {
        endpoints.delete = builder.mutation<{ success: boolean }, IdArg>({
          query: (arg) => {
            const { id } = extractIdArgs(arg);
            return {
              mutation: graphqlMutations.delete,
              variables: { id },
              operationName: 'Delete',
            };
          },
          invalidatesTags: (_result, _error, arg) => {
            const { id } = extractIdArgs(arg);
            return [
              { type: mainTag as any, id },
              { type: mainTag as any, id: 'LIST' },
            ];
          },
        });
      } else if (entityEndpoint) {
        endpoints.delete = builder.mutation<{ success: boolean }, IdArg>({
          query: (arg) => {
            const { id, config, extraPath } = extractIdArgs(arg);
            const baseUrl = `/${entityEndpoint}/${id}`;
            return {
              url: buildUrl(baseUrl, extraPath),
              method: 'DELETE',
              config,
            };
          },
          invalidatesTags: (_result, _error, arg) => {
            const { id } = extractIdArgs(arg);
            return [
              { type: mainTag as any, id },
              { type: mainTag as any, id: 'LIST' },
            ];
          },
        });
      }

      return endpoints;
    },
  });

  // Add entityEndpoint and entityName to the API instance for external access
  Object.assign(api, { entityEndpoint, entityName });

  return api;
}
