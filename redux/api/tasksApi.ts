/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from './baseApi';
import { Task, ApiResponse } from '../../types/api.types';
import { projectsApi } from './projectsApi';

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getTask: builder.query<ApiResponse<Task>, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: ['Task'],
    }),

    createTask: builder.mutation<ApiResponse<Task>, {
      boardId: string; 
      title: string; 
      description?: string;
      assigneeId?: string; 
      priority?: string; 
      dueDate?: string;
    }>({
      query: (body) => ({ url: '/tasks', method: 'POST', body }),
      invalidatesTags: ['Project'],
    }),

    updateTask: builder.mutation<ApiResponse<Task>, { id: string; title?: string; description?: string; assigneeId?: string; priority?: string; status?: string; dueDate?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Task', 'Project'],
    }),

    moveTask: builder.mutation<ApiResponse<Task>, {
         id: string; 
         targetBoardId: 
         string; order: 
         number; 
         projectId: string 
        }>({
      query: ({ id, projectId, ...body }) => ({
         url: `/tasks/${id}/move`, 
         method: 'PATCH', 
         body 
        }),
      async onQueryStarted({ 
        id, 
        targetBoardId, 
        order,
        projectId 
    }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patch = dispatch(
          projectsApi.util.updateQueryData('getProject' as any, projectId, (draft: any) => {

            if (!draft?.data?.boards) return;

            for (const board of draft.data.boards) {
              const taskIndex = board.tasks?.findIndex((t: Task) => t.id === id);

              if (taskIndex !== undefined && taskIndex > -1) {
                const [task] = board.tasks.splice(taskIndex, 1);
                task.boardId = targetBoardId;
                task.order = order;

                const targetBoard = draft.data.boards.find((b: any) => b.id === targetBoardId);
                if (targetBoard) {
                  targetBoard.tasks = targetBoard.tasks || [];
                  targetBoard.tasks.push(task);
                  targetBoard.tasks.sort((a: Task, b: Task) => a.order - b.order);
                }
                break;
              }
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ 
        url: `/tasks/${id}`,
         method: 'DELETE'
     }),
      invalidatesTags: ['Project'],
    }),

    addComment: builder.mutation<void, { 
        taskId: string; content: string 
    }>({
      query: ({ taskId, content }) => ({
         url: `/tasks/${taskId}/comments`, 
         method: 'POST', 
         body: { content } 
        }),
      invalidatesTags: ['Task'],
    }),

    deleteComment: builder.mutation<void, {
         taskId: string; commentId: string 
        }>({
      query: ({ taskId, commentId }) => ({
         url: `/tasks/${taskId}/comments/${commentId}`, 
         method: 'DELETE' 
        }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useDeleteTaskMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = tasksApi;