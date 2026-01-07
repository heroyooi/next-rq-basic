import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type { PostsPage, Post } from '../types';

/**
 * 업데이트 성공 후 infinite 캐시에 반영하는 유틸 훅
 */
export function useUpdatePostInfiniteSync() {
  const qc = useQueryClient();

  return (updated: Post) => {
    qc.setQueriesData<InfiniteData<PostsPage>>(
      { queryKey: ['posts', 'infinite'] },
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((p) => (p.id === updated.id ? updated : p)),
          })),
        };
      }
    );
  };
}
