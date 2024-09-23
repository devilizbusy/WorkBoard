// src/store/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }), // Adjust the base URL as necessary
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout/',
        method: 'POST',
      }),
    }),
    validateToken: builder.query({
      query: () => '/validate-token/', // Endpoint to validate token
    }),
    // Work Boards
    getWorkBoards: builder.query({
      query: () => '/workboards/', // Get all work boards
    }),
    getWorkBoardById: builder.query({
      query: (id) => `/workboards/${id}/`, // Get a specific work board by ID
    }),
    createWorkBoard: builder.mutation({
      query: (newBoard) => ({
        url: '/workboards/',
        method: 'POST',
        body: newBoard,
      }),
    }),
    updateWorkBoard: builder.mutation({
      query: ({ id, ...updatedBoard }) => ({
        url: `/workboards/${id}/`,
        method: 'PUT',
        body: updatedBoard,
      }),
    }),
    deleteWorkBoard: builder.mutation({
      query: (id) => ({
        url: `/workboards/${id}/`,
        method: 'DELETE',
      }),
    }),

    // Tasks
    getTasks: builder.query({
      query: (boardId) => `/workboards/${boardId}/tasks/`, // Get tasks for a specific work board
    }),
    createTask: builder.mutation({
      query: ({ boardId, newTask }) => ({
        url: `/workboards/${boardId}/tasks/`,
        method: 'POST',
        body: newTask,
      }),
    }),
    updateTask: builder.mutation({
      query: ({ boardId, taskId, ...updatedTask }) => ({
        url: `/workboards/${boardId}/tasks/${taskId}/`,
        method: 'PUT',
        body: updatedTask,
      }),
    }),
    deleteTask: builder.mutation({
      query: ({ boardId, taskId }) => ({
        url: `/workboards/${boardId}/tasks/${taskId}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetWorkBoardsQuery,
  useGetWorkBoardByIdQuery,
  useCreateWorkBoardMutation,
  useUpdateWorkBoardMutation,
  useDeleteWorkBoardMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = api;
