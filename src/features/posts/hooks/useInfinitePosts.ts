import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api';
import type { PostsPage } from '../types';

type Filters = {
  q: string;
  sort: 'latest' | 'oldest' | 'title';
  size: number;
};

export function useInfinitePosts(filters: Filters) {
  return useInfiniteQuery<PostsPage, Error>({
    queryKey: ['posts', 'infinite', filters],
    queryFn: ({ pageParam }) =>
      fetchPosts({
        q: filters.q,
        sort: filters.sort,
        page: Number(pageParam),
        size: filters.size,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages) return undefined;
      return lastPage.page + 1;
    },
    staleTime: 1000 * 30,
  });
}
