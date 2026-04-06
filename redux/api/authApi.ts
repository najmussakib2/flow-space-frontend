import { ApiResponse, AuthResponse, User } from '../../types/api.types';
import { baseApi } from './baseApi';


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<AuthResponse>, { email: string; name: string; password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<ApiResponse<AuthResponse>, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/logout', method: 'POST', body }),
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;