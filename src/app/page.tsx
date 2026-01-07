'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { PostList } from '@/features/posts/components/PostList';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { useDeletePost } from '@/features/posts/hooks/useDeletePost';

import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';
import { useToast } from '@/components/ToastProvider';

type Sort = 'latest' | 'oldest' | 'title';

function normalizeSort(v: string | null): Sort {
  if (v === 'oldest' || v === 'title' || v === 'latest') return v;
  return 'latest';
}

function normalizePage(v: string | null) {
  const n = Number(v ?? '1');
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function normalizeSize(v: string | null) {
  const n = Number(v ?? '10');
  const size = Number.isFinite(n) ? Math.floor(n) : 10;
  return Math.min(50, Math.max(1, size)); // 1~50 제한
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();

  // ✅ URL에서 적용 상태 읽기
  const q = searchParams.get('q') ?? '';
  const sort = normalizeSort(searchParams.get('sort'));
  const page = normalizePage(searchParams.get('page'));
  const size = normalizeSize(searchParams.get('size'));

  // ✅ 입력 중 상태
  const [inputQ, setInputQ] = useState(q);

  // URL 변경 시 input 동기화
  useEffect(() => {
    setInputQ(q);
  }, [q]);

  // ✅ 17강: page/size까지 포함해서 queryKey 분리
  const filters = useMemo(
    () => ({ q, sort, page, size }),
    [q, sort, page, size]
  );
  const postsQuery = usePosts(filters);

  const del = useDeletePost();

  // ✅ URL 업데이트 헬퍼 (page/size 포함)
  const setQuery = (
    next: { q?: string; sort?: Sort; page?: number; size?: number },
    mode: 'push' | 'replace' = 'replace'
  ) => {
    const sp = new URLSearchParams(searchParams.toString());

    if (next.q !== undefined) {
      const v = next.q.trim();
      if (v) sp.set('q', v);
      else sp.delete('q');

      // 검색 조건이 바뀌면 보통 1페이지로 리셋
      sp.delete('page');
    }

    if (next.sort !== undefined) {
      if (next.sort === 'latest') sp.delete('sort');
      else sp.set('sort', next.sort);

      // 정렬이 바뀌면 1페이지로 리셋
      sp.delete('page');
    }

    if (next.page !== undefined) {
      const p = Math.max(1, Math.floor(next.page));
      if (p === 1) sp.delete('page');
      else sp.set('page', String(p));
    }

    if (next.size !== undefined) {
      const s = Math.min(50, Math.max(1, Math.floor(next.size)));
      if (s === 10) sp.delete('size'); // 기본 10은 생략(원하시면 유지해도 OK)
      else sp.set('size', String(s));

      // size 바뀌면 1페이지로 리셋
      sp.delete('page');
    }

    const qs = sp.toString();
    const url = qs ? `/?${qs}` : `/`;

    if (mode === 'push') router.push(url);
    else router.replace(url);
  };

  const applySearch = () => setQuery({ q: inputQ }, 'push');
  const clearSearch = () => setQuery({ q: '' }, 'push');

  const onDelete = (id: string) => {
    del.mutate(id, {
      onSuccess: () => pushToast('삭제 완료!', 'success'),
      onError: (e) => pushToast((e as Error).message, 'error'),
    });
  };

  if (postsQuery.isLoading) {
    return (
      <main style={{ padding: 16 }}>
        <h1>게시글 목록</h1>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
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

  const pageData = postsQuery.data; // { items, page, size, total, totalPages }

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        게시글 목록
        {postsQuery.isFetching && (
          <small style={{ color: '#999' }}>동기화 중...</small>
        )}
      </h1>

      {/* 컨트롤 */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          margin: '12px 0',
          alignItems: 'center',
        }}
      >
        <input
          placeholder="제목 검색"
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applySearch();
          }}
          style={{ width: 240 }}
        />

        <button type="button" onClick={applySearch}>
          검색
        </button>

        <button type="button" onClick={clearSearch} disabled={!q}>
          초기화
        </button>

        <select
          value={sort}
          onChange={(e) =>
            setQuery({ sort: e.target.value as Sort }, 'replace')
          }
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="title">제목순</option>
        </select>

        {/* size(페이지 크기) - 선택 */}
        <select
          value={String(size)}
          onChange={(e) =>
            setQuery({ size: Number(e.target.value) }, 'replace')
          }
        >
          <option value="5">5개</option>
          <option value="10">10개</option>
          <option value="20">20개</option>
        </select>

        <Link href="/posts/new" style={{ marginLeft: 'auto' }}>
          + 새 게시글 등록
        </Link>
      </div>

      <div style={{ marginBottom: 12, color: '#666' }}>
        {q ? (
          <small>
            검색어: <b>{q}</b> / 정렬: <b>{sort}</b> / 페이지:{' '}
            <b>{pageData?.page}</b>
          </small>
        ) : (
          <small>
            정렬: <b>{sort}</b> / 페이지: <b>{pageData?.page}</b>
          </small>
        )}
      </div>

      <PostList
        posts={pageData?.items ?? []}
        isDeleting={del.isPending}
        onDelete={onDelete}
      />

      {/* 페이지네이션 */}
      <div
        style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}
      >
        <button
          disabled={!pageData || pageData.page <= 1}
          onClick={() =>
            setQuery({ page: (pageData?.page ?? 1) - 1 }, 'replace')
          }
        >
          이전
        </button>

        <small>
          {pageData?.page} / {pageData?.totalPages} (총 {pageData?.total}개)
        </small>

        <button
          disabled={!pageData || pageData.page >= pageData.totalPages}
          onClick={() =>
            setQuery({ page: (pageData?.page ?? 1) + 1 }, 'replace')
          }
        >
          다음
        </button>
      </div>
    </main>
  );
}
