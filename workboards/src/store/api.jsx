// src/store/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'api-token-auth/',
        method: 'POST',
        body: credentials,
      }),
    }),
    getWorkBoards: builder.query({
      query: () => 'workboards/',
    }),
    getWorkBoard: builder.query({
      query: (id) => `workboards/${id}/`,
    }),
    createWorkBoard: builder.mutation({
      query: (newWorkBoard) => ({
        url: 'workboards/',
        method: 'POST',
        body: newWorkBoard,
      }),
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `tasks/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetWorkBoardsQuery,
  useGetWorkBoardQuery,
  useCreateWorkBoardMutation,
  useUpdateTaskMutation,
} = api;