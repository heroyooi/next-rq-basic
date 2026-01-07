import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { deletePost } from '../api';
import type { PostsPage } from '../types';

/**
 * 무한 스크롤 캐시 구조:
 * InfiniteData<PostsPage> = { pages: PostsPage[]; pageParams: unknown[] }
 */
export function useDeletePostInfinite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),

    // ✅ 1) 삭제 직전: 캐시를 "즉시" 업데이트 (Optimistic Update)
    onMutate: async (id: string) => {
      // 관련 요청 중단
      await qc.cancelQueries({ queryKey: ['posts', 'infinite'] });

      // 롤백용 스냅샷 저장
      const prev = qc.getQueriesData<InfiniteData<PostsPage>>({
        queryKey: ['posts', 'infinite'],
      });

      // 캐시에서 id 제거(즉시 UI 반영)
      qc.setQueriesData<InfiniteData<PostsPage>>(
        { queryKey: ['posts', 'infinite'] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((p) => p.id !== id),
              total: Math.max(0, page.total - 1),
            })),
          };
        }
      );

      // onError에서 사용할 context 반환
      return { prev };
    },

    // ✅ 2) 서버 삭제 실패 시 롤백
    onError: (_err, _id, ctx) => {
      ctx?.prev?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    // ✅ 3) 성공/실패 이후 최종 동기화(선택이지만 추천)
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ['posts', 'infinite'] });
    },
  });
}
