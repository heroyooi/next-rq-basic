'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts, type Post } from '@/lib/api';

export default function Home() {
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 30,
  });

  if (isLoading) return <p>불러오는 중...</p>;
  if (isError) return <p>{(error as Error).message}</p>;

  const isEmpty = posts.length === 0;

  return (
    <main style={{ padding: 16 }}>
      <h1>게시글 목록</h1>
      <Link href="/posts/new">+ 새 게시글 등록</Link>

      {isEmpty ? (
        <p>등록된 게시글이 없습니다.</p>
      ) : (
        <ul style={{ marginTop: 12 }}>
          {posts.map((p: Post) => (
            <li key={p.id}>
              {p.title}{' '}
              <small style={{ color: '#666' }}>
                ({new Date(p.createdAt).toLocaleString()})
              </small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
