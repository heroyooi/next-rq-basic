'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/lib/api';

export default function Home() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <p>불러오는 중...</p>;
  }

  if (isError) {
    return <p>{(error as Error).message}</p>;
  }

  if (!posts || posts.length === 0) {
    return <p>게시글이 없습니다.</p>;
  }

  return (
    <div>
      <h1>게시글 목록</h1>
      <ul>
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
