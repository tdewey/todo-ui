export const TodoFilter = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
} as const;

export type TodoFilter = (typeof TodoFilter)[keyof typeof TodoFilter];
