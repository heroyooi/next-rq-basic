"use client";

import Link from "next/link";
import { PostList } from "@/features/posts/components/PostList";
import { usePosts } from "@/features/posts/hooks/usePosts";
import { useDeletePost } from "@/features/posts/hooks/useDeletePost";
import { Skeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import { useToast } from "@/components/ToastProvider";
import { useState } from "react";

export default function Home() {
  const { pushToast } = useToast();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest" | "title">("latest");

  const postsQuery = usePosts({ q, sort });
  const del = useDeletePost();

  // 삭제 성공/실패 피드백(실무 감각)
  const onDelete = (id: string) => {
    del.mutate(id, {
      onSuccess: () => pushToast("삭제 완료!", "success"),
      onError: (e) => pushToast((e as Error).message, "error"),
    });
  };

  if (postsQuery.isLoading) {
    return (
      <main style={{ padding: 16 }}>
        <h1>게시글 목록</h1>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <Skeleton height={18} width={220} />
          <Skeleton height={52} />
          <Skeleton height={52} />
          <Skeleton height={52} />
        </div>
      </main>
    );
  }

  if (postsQuery.isError) {
    return (
      <main style={{ padding: 16 }}>
        <h1>게시글 목록</h1>
        <ErrorState
          message={(postsQuery.error as Error).message}
          onRetry={() => postsQuery.refetch()}
        />
      </main>
    );
  }

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ display: "flex", gap: 8, alignItems: "center" }}>
        게시글 목록
        {postsQuery.isFetching && <small style={{ color: "#999" }}>동기화 중...</small>}
      </h1>

      {/* 컨트롤 */}
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          placeholder="제목 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="title">제목순</option>
        </select>

        <Link href="/posts/new">+ 새 게시글 등록</Link>
      </div>

      <PostList posts={postsQuery.data ?? []} isDeleting={del.isPending} onDelete={onDelete} />
    </main>
  );
}
