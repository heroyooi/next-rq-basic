import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../api";
import { postKeys } from "../keys";

export function useUpdatePost(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; body: string }) => updatePost(id, input),
    onSuccess: async (updated) => {
      qc.setQueryData(postKeys.detail(id), updated);
      await qc.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
}