'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPost, updatePost } from '@/lib/api';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id, // id 있을 때만 요청
  });

  // ✅ 폼 상태
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // 최초 로딩 후 폼 값 채우기
  useEffect(() => {
    if (post) {
      setTitle(post.title ?? '');
      setBody(post.body ?? '');
    }
  }, [post]);

  const titleTrim = title.trim();
  const bodyTrim = body.trim();

  const validationMessage = useMemo(() => {
    if (!titleTrim) return '제목을 입력해주세요.';
    if (titleTrim.length < 3) return '제목은 3자 이상 입력해주세요.';
    if (!bodyTrim) return '내용을 입력해주세요.';
    if (bodyTrim.length < 10) return '내용은 10자 이상 입력해주세요.';
    return null;
  }, [titleTrim, bodyTrim]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => updatePost(id, { title: titleTrim, body: bodyTrim }),

    onSuccess: async (updated) => {
      // ✅ 1) 상세 캐시 즉시 반영
      qc.setQueryData(['post', id], updated);

      // ✅ 2) 목록도 서버 기준으로 동기화
      await qc.invalidateQueries({ queryKey: ['posts'] });

      // ✅ 3) 상세도 동기화(선택) - 보통은 setQueryData면 충분
      // await qc.invalidateQueries({ queryKey: ["post", id] });

      alert('수정 완료!');
    },

    onError: (err) => {
      alert((err as Error).message);
    },
  });

  if (!id) return <p>잘못된 접근입니다.</p>;
  if (isLoading) return <p>불러오는 중...</p>;
  if (isError) return <p>{(error as Error).message}</p>;
  if (!post) return <p>게시글이 없습니다.</p>;

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 12 }}>게시글 수정</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validationMessage) {
            alert(validationMessage);
            return;
          }
          mutate();
        }}
        style={{ display: 'grid', gap: 12 }}
      >
        <label style={{ display: 'grid', gap: 6 }}>
          <span>제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>내용</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            disabled={isPending}
          />
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={isPending || !!validationMessage}>
            {isPending ? '저장 중...' : '수정 저장'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
          >
            취소
          </button>
        </div>

        {validationMessage && (
          <p style={{ margin: 0, color: '#666' }}>{validationMessage}</p>
        )}
      </form>
    </main>
  );
}
