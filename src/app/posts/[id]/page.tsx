"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostForm } from "@/features/posts/components/PostForm";
import { usePost } from "@/features/posts/hooks/usePost";
import { useUpdatePost } from "@/features/posts/hooks/useUpdatePost";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: post, isLoading, isError, error } = usePost(id);
  const update = useUpdatePost(id);

  const [initTitle, setInitTitle] = useState("");
  const [initBody, setInitBody] = useState("");

  useEffect(() => {
    if (post) {
      setInitTitle(post.title);
      setInitBody(post.body);
    }
  }, [post]);

  if (!id) return <p>잘못된 접근입니다.</p>;
  if (isLoading) return <p>불러오는 중...</p>;
  if (isError) return <p>{(error as Error).message}</p>;
  if (!post) return <p>게시글이 없습니다.</p>;

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>게시글 수정</h1>
      <PostForm
        initialTitle={initTitle}
        initialBody={initBody}
        submitText="수정 저장"
        isSubmitting={update.isPending}
        onSubmit={(input) => update.mutate(input)}
        onCancel={() => router.back()}
      />
    </main>
  );
}