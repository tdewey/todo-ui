// `as const` narrows value types to literals ('all' | 'active' | 'completed')
// so the derived typeof TodoFilter is a useful union rather than just `string`
export const TodoFilter = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
} as const;

export type TodoFilter = (typeof TodoFilter)[keyof typeof TodoFilter];
