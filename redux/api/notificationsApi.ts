import { baseApi } from './baseApi';
import { Notification, PaginatedResponse } from '../../types/api.types';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<Notification>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => `/notifications?page=${page}&limit=${limit}`,
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;