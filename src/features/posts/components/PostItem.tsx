"use client";

import Link from "next/link";
import type { Post } from "../types";

type Props = {
  post: Post;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

export function PostItem({ post, onDelete, isDeleting = false }: Props) {
  const onClickDelete = () => {
    if (!onDelete) return;

    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    onDelete(post.id);
  };

  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #eee",
        padding: 12,
        borderRadius: 8,
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <Link href={`/posts/${post.id}`} style={{ fontWeight: 600 }}>
          {post.title}
        </Link>
        <small style={{ color: "#666" }}>
          {new Date(post.createdAt).toLocaleString()}
        </small>
      </div>

      {onDelete && (
        <button type="button" onClick={onClickDelete} disabled={isDeleting}>
          삭제
        </button>
      )}
    </li>
  );
}
