import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../api";
import { postKeys } from "../keys";

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
}