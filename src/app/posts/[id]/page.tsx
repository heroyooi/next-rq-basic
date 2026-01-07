'use client';

import { useRouter, useParams } from 'next/navigation';
import { PostForm } from '@/features/posts/components/PostForm';
import { usePost } from '@/features/posts/hooks/usePost';
import { useUpdatePost } from '@/features/posts/hooks/useUpdatePost';
import { useUpdatePostInfiniteSync } from '@/features/posts/hooks/useUpdatePostInfiniteSync';
import { useToast } from '@/components/ToastProvider';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { pushToast } = useToast();

  const { data: post, isLoading, isError, error } = usePost(id);
  const update = useUpdatePost(id);

  const syncInfinite = useUpdatePostInfiniteSync();

  if (!id) return <p>잘못된 접근입니다.</p>;
  if (isLoading) return <p>불러오는 중...</p>;
  if (isError) return <p>{(error as Error).message}</p>;
  if (!post) return <p>게시글이 없습니다.</p>;

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 12 }}>게시글 수정</h1>

      <PostForm
        initialTitle={post.title}
        initialBody={post.body}
        submitText="수정 저장"
        isSubmitting={update.isPending}
        onSubmit={(input) =>
          update.mutate(input, {
            onSuccess: (updated) => {
              pushToast('수정 완료!', 'success');
              syncInfinite(updated); // ✅ 무한 스크롤 목록에도 즉시 반영
              router.push('/');
            },
            onError: (e) => pushToast((e as Error).message, 'error'),
          })
        }
        onCancel={() => router.back()}
      />
    </main>
  );
}
