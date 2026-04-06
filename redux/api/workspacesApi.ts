import { ApiResponse, Workspace } from '../../types/api.types';
import { baseApi } from './baseApi';

export const workspacesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query<ApiResponse<Workspace[]>, void>({
      query: () => '/workspaces',
      providesTags: ['Workspace'],
    }),
    getWorkspace: builder.query<ApiResponse<Workspace>, string>({
      query: (slug) => `/workspaces/${slug}`,
      providesTags: ['Workspace'],
    }),
    createWorkspace: builder.mutation<ApiResponse<Workspace>, { name: string; slug: string }>({
      query: (body) => ({ url: '/workspaces', method: 'POST', body }),
      invalidatesTags: ['Workspace'],
    }),
    updateWorkspace: builder.mutation<ApiResponse<Workspace>, { id: string; name?: string; logoUrl?: string }>({
      query: ({ id, ...body }) => ({ url: `/workspaces/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Workspace'],
    }),
    inviteMember: builder.mutation<void, { workspaceId: string; email: string; role: string }>({
      query: ({ workspaceId, ...body }) => ({
        url: `/workspaces/${workspaceId}/members/invite`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Workspace'],
    }),
  }),
});

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useInviteMemberMutation,
} = workspacesApi;