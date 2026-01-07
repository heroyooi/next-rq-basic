"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "@/features/posts/components/PostForm";
import { useCreatePost } from "@/features/posts/hooks/useCreatePost";
import { useToast } from "@/components/ToastProvider";

export default function NewPostPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const { mutate, isPending } = useCreatePost();

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>게시글 등록</h1>
      <PostForm
        submitText="등록하기"
        isSubmitting={isPending}
        onSubmit={(input) => mutate(input, {
          onSuccess: () => {
            pushToast("등록 완료!", "success");
            router.push("/");
          },
          onError: (e) => pushToast((e as Error).message, "error"),
        })}
        onCancel={() => router.back()}
      />
    </main>
  );
}