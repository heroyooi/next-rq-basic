"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "@/features/posts/components/PostForm";
import { useCreatePost } from "@/features/posts/hooks/useCreatePost";

export default function NewPostPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreatePost();

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>게시글 등록</h1>
      <PostForm
        submitText="등록하기"
        isSubmitting={isPending}
        onSubmit={(input) => mutate(input, { onSuccess: () => router.push("/") })}
        onCancel={() => router.back()}
      />
    </main>
  );
}