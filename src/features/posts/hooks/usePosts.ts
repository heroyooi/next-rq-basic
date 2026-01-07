import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api";
import { postKeys } from "../keys";

export function usePosts(filters?: { q?: string; sort?: string }) {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => fetchPosts(filters),
    staleTime: 1000 * 30,
    keepPreviousData: true, // UX 핵심
  });
}