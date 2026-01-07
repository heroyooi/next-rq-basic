import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api';

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onSuccess: async (created) => {
      // ✅ 17강에서는 list가 필터별로 여러 개 존재하므로 "lists 전체"를 날리는 게 안전
      await qc.invalidateQueries({
        queryKey: ['posts', 'list'],
      });
    },
  });
}
