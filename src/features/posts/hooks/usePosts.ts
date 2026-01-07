import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api';
import { postKeys } from '../keys';
import type { PostsPage } from '../types';

export function usePosts(filters: {
  q: string;
  sort: string;
  page: number;
  size: number;
}) {
  return useQuery<PostsPage, Error>({
    queryKey: postKeys.list(filters),
    queryFn: () => fetchPosts(filters),
    staleTime: 1000 * 30,
    // (TanStack Query v5일 경우 keepPreviousData 대신 placeholderData를 쓰는 편이 안전)
    // placeholderData: (prev) => prev,
  });
}
