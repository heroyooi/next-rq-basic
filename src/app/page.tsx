"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PostList } from "@/features/posts/components/PostList";
import { usePosts } from "@/features/posts/hooks/usePosts";
import { useDeletePost } from "@/features/posts/hooks/useDeletePost";

import { Skeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import { useToast } from "@/components/ToastProvider";

type Sort = "latest" | "oldest" | "title";

function normalizeSort(v: string | null): Sort {
  if (v === "oldest" || v === "title" || v === "latest") return v;
  return "latest";
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();

  // ✅ URL에서 “적용된 상태” 읽기
  const q = searchParams.get("q") ?? "";
  const sort = normalizeSort(searchParams.get("sort"));

  // ✅ input은 “타이핑 중 상태”
  const [inputQ, setInputQ] = useState(q);

  // 뒤로가기/링크 진입/URL 변경에 대응해서 input도 동기화
  useEffect(() => {
    setInputQ(q);
  }, [q]);

  // ✅ React Query는 URL 기준 필터로 호출
  const filters = useMemo(() => ({ q, sort }), [q, sort]);
  const postsQuery = usePosts(filters);

  const del = useDeletePost();

  // URL 업데이트 헬퍼
  const setQuery = (
    next: { q?: string; sort?: Sort },
    mode: "push" | "replace" = "replace"
  ) => {
    const sp = new URLSearchParams(searchParams.toString());

    if (next.q !== undefined) {
      const v = next.q.trim();
      if (v) sp.set("q", v);
      else sp.delete("q");
    }

    if (next.sort !== undefined) {
      // 기본값(latest)은 URL에서 생략하면 URL이 깔끔해집니다.
      if (next.sort === "latest") sp.delete("sort");
      else sp.set("sort", next.sort);
    }

    const qs = sp.toString();
    const url = qs ? `/?${qs}` : `/`;

    if (mode === "push") router.push(url);
    else router.replace(url);
  };

  // 검색 적용
  const applySearch = () => setQuery({ q: inputQ }, "push");

  // 검색 초기화
  const clearSearch = () => setQuery({ q: "" }, "push");

  // 삭제 성공/실패 피드백(실무 감각)
  const onDelete = (id: string) => {
    del.mutate(id, {
      onSuccess: () => pushToast("삭제 완료!", "success"),
      onError: (e) => pushToast((e as Error).message, "error"),
    });
  };

  // 로딩/에러 UI는 기존 그대로
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
        {postsQuery.isFetching && (
          <small style={{ color: "#999" }}>동기화 중...</small>
        )}
      </h1>

      {/* ✅ 컨트롤 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          margin: "12px 0",
          alignItems: "center",
        }}
      >
        {/* input은 로컬 상태 */}
        <input
          placeholder="제목 검색"
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applySearch();
          }}
          style={{ width: 240 }}
        />

        <button type="button" onClick={applySearch}>
          검색
        </button>

        <button type="button" onClick={clearSearch} disabled={!q}>
          초기화
        </button>

        {/* 정렬은 즉시 적용 */}
        <select
          value={sort}
          onChange={(e) =>
            setQuery({ sort: e.target.value as Sort }, "replace")
          }
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="title">제목순</option>
        </select>

        <Link href="/posts/new" style={{ marginLeft: "auto" }}>
          + 새 게시글 등록
        </Link>
      </div>

      {/* ✅ 현재 적용 상태 안내(실무 감각) */}
      <div style={{ marginBottom: 12, color: "#666" }}>
        {q ? (
          <small>
            검색어: <b>{q}</b> / 정렬: <b>{sort}</b>
          </small>
        ) : (
          <small>
            정렬: <b>{sort}</b>
          </small>
        )}
      </div>

      <PostList
        posts={postsQuery.data ?? []}
        isDeleting={del.isPending}
        onDelete={onDelete}
      />
    </main>
  );
}