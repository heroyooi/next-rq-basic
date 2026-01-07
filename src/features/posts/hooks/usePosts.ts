import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api";
import { postKeys } from "../keys";

export function usePosts() {
  return useQuery({
    queryKey: postKeys.list(),
    queryFn: fetchPosts,
    staleTime: 1000 * 30,
  });
}