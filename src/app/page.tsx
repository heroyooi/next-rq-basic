"use client";

import Link from "next/link";
import { PostList } from "@/features/posts/components/PostList";
import { usePosts } from "@/features/posts/hooks/usePosts";
import { useDeletePost } from "@/features/posts/hooks/useDeletePost";

export default function Home() {
  const { data: posts = [], isLoading, isError, error, isFetching } = usePosts();
  const del = useDeletePost();

  if (isLoading) return <p>불러오는 중...</p>;
  if (isError) return <p>{(error as Error).message}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ display: "flex", gap: 8, alignItems: "center" }}>
        게시글 목록
        {isFetching && <small style={{ color: "#999" }}>동기화 중...</small>}
      </h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Link href="/posts/new">+ 새 게시글 등록</Link>
      </div>

      <PostList
        posts={posts}
        isDeleting={del.isPending}
        onDelete={(id) => del.mutate(id)}
      />
    </main>
  );
}
