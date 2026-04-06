/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from './baseApi';
import { Document, ApiResponse } from '../../types/api.types';

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<ApiResponse<Document[]>, string>({
      query: (projectId) => `/documents/project/${projectId}`,
      providesTags: ['Document'],
    }),
    getDocument: builder.query<ApiResponse<Document>, string>({
      query: (id) => `/documents/${id}`,
      providesTags: ['Document'],
    }),
    createDocument: builder.mutation<ApiResponse<Document>, { projectId: string; title?: string }>({
      query: (body) => ({ url: '/documents', method: 'POST', body }),
      invalidatesTags: ['Document'],
    }),
    updateDocument: builder.mutation<ApiResponse<Document>, { id: string; title?: string; content?: any; isPublic?: boolean }>({
      query: ({ id, ...body }) => ({ url: `/documents/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Document'],
    }),
    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({ url: `/documents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;