'use client';

import Link from 'next/link';
import { useMemo, useState, useRef } from 'react';

import { PostList } from '@/features/posts/components/PostList';
import { useInfinitePosts } from '@/features/posts/hooks/useInfinitePosts';
import { useIntersection } from '@/hooks/useIntersection';

import { Skeleton } from '@/components/Skeleton';
import { ErrorState } from '@/components/ErrorState';

type Sort = 'latest' | 'oldest' | 'title';

export default function InfinitePage() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('latest');
  const [size, setSize] = useState(10);

  const query = useInfinitePosts({ q, sort, size });
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const posts = useMemo(() => {
    return query.data?.pages.flatMap((p) => p.items) ?? [];
  }, [query.data]);

  const total = query.data?.pages?.[0]?.total ?? 0;
  const loaded = posts.length;

  useIntersection(
    sentinelRef,
    () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    },
    !!query.hasNextPage
  );

  if (query.isLoading) {
    return (
      <main style={{ padding: 16 }}>
        <h1>무한 스크롤 목록</h1>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <Skeleton height={18} width={220} />
          <Skeleton height={52} />
          <Skeleton height={52} />
          <Skeleton height={52} />
        </div>
      </main>
    );
  }

  if (query.isError) {
    return (
      <main style={{ padding: 16 }}>
        <h1>무한 스크롤 목록</h1>
        <ErrorState
          message={(query.error as Error).message}
          onRetry={() => query.refetch()}
        />
      </main>
    );
  }

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        무한 스크롤 목록
        {query.isFetching && (
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
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 240 }}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="title">제목순</option>
        </select>

        <select
          value={String(size)}
          onChange={(e) => setSize(Number(e.target.value))}
        >
          <option value="5">5개씩</option>
          <option value="10">10개씩</option>
          <option value="20">20개씩</option>
        </select>

        <Link href="/" style={{ marginLeft: 'auto' }}>
          페이지네이션 보기 →
        </Link>
      </div>

      <div style={{ marginBottom: 12, color: '#666' }}>
        <small>
          로드됨: <b>{loaded}</b> / 전체: <b>{total}</b>
        </small>
      </div>

      <PostList posts={posts} />

      {/* 더 보기 */}
      <div style={{ marginTop: 12 }}>
        {query.hasNextPage ? (
          <button
            type="button"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
          >
            {query.isFetchingNextPage ? '불러오는 중...' : '더 보기'}
          </button>
        ) : (
          <small style={{ color: '#666' }}>마지막 페이지입니다.</small>
        )}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
    </main>
  );
}
