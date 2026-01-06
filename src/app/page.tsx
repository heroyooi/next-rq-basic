'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePost, fetchPosts, type Post } from '@/lib/api';

export default function Home() {
  const qc = useQueryClient();

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 30,
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePost(id),

    // ✅ Optimistic Update: 일단 화면에서 먼저 제거(체감 매우 좋음)
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['posts'] });

      const prev = qc.getQueryData<Post[]>(['posts']);
      qc.setQueryData<Post[]>(['posts'], (old) =>
        (old ?? []).filter((p) => p.id !== id)
      );

      // 실패 시 롤백용
      return { prev };
    },

    // 실패하면 롤백
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['posts'], ctx.prev);
      alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },

    // 성공/실패와 상관없이 서버 기준으로 동기화
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const onClickDelete = (id: string) => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;
    remove(id);
  };

  if (isLoading) return <p>불러오는 중...</p>;
  if (isError) return <p>{(error as Error).message}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        게시글 목록
        {isFetching && <small style={{ color: '#999' }}>동기화 중...</small>}
      </h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Link href="/posts/new">+ 새 게시글 등록</Link>
      </div>

      {posts.length === 0 ? (
        <p>등록된 게시글이 없습니다.</p>
      ) : (
        <ul style={{ display: 'grid', gap: 8 }}>
          {posts.map((p) => (
            <li
              key={p.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #eee',
                padding: 12,
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'grid', gap: 4 }}>
                <Link href={`/posts/${p.id}`}>{p.title}</Link>
                <small style={{ color: '#666' }}>
                  {new Date(p.createdAt).toLocaleString()}
                </small>
              </div>

              <button
                type="button"
                onClick={() => onClickDelete(p.id)}
                disabled={isDeleting}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
