import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../api";
import { postKeys } from "../keys";
import type { Post } from "../types";

export function useDeletePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: postKeys.list() });
      const prev = qc.getQueryData<Post[]>(postKeys.list());

      qc.setQueryData<Post[]>(postKeys.list(), (old) =>
        (old ?? []).filter((p) => p.id !== id)
      );

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(postKeys.list(), ctx.prev);
      alert("삭제에 실패했습니다.");
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
}