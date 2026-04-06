import { ApiResponse, Project } from '../../types/api.types';
import { baseApi } from './baseApi';

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ApiResponse<Project[]>, string>({
      query: (workspaceId) => `/projects/workspace/${workspaceId}`,
      providesTags: ['Project'],
    }),
    getProject: builder.query<ApiResponse<Project>, string>({
      query: (id) => `/projects/${id}`,
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<ApiResponse<Project>, { workspaceId: string; name: string; description?: string; icon?: string; color?: string }>({
      query: (body) => ({ url: '/projects', method: 'POST', body }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<ApiResponse<Project>, { id: string; name?: string; description?: string; status?: string }>({
      query: ({ id, ...body }) => ({ url: `/projects/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;