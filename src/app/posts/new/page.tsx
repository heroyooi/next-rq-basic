'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/api';

export default function NewPostPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => createPost({ title, body }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['posts'] });
      router.push('/');
    },
  });

  return (
    <main style={{ padding: 16, maxWidth: 720 }}>
      <h1>게시글 등록</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        style={{ display: 'grid', gap: 12 }}
      >
        <input
          placeholder="제목 (3자 이상)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />
        <textarea
          placeholder="내용 (10자 이상)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          disabled={isPending}
        />

        {isError && (
          <p style={{ color: 'crimson' }}>{(error as Error).message}</p>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={isPending}>
            {isPending ? '등록 중...' : '등록하기'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
          >
            취소
          </button>
        </div>
      </form>
    </main>
  );
}
