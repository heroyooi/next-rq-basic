import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api";
import { postKeys } from "../keys";

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: async (created) => {
      // 즉시 반영(선택)
      qc.setQueryData(postKeys.list(), (prev: any) => {
        if (!Array.isArray(prev)) return prev;
        return [created, ...prev];
      });
      // 서버 동기화
      await qc.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
}