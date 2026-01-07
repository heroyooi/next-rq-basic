export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: { q: string; sort: string; page: number; size: number }) =>
    ['posts', 'list', filters] as const,
  detail: (id: string) => ['posts', 'detail', id] as const,
  details: () => [...postKeys.all, 'detail'] as const,
};
