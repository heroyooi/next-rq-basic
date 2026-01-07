"use client";

import type { Post } from "../types";
import { PostItem } from "./PostItem";

type Props = {
  posts: Post[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

export function PostList({ posts, onDelete, isDeleting = false }: Props) {
  if (posts.length === 0) {
    return <p>등록된 게시글이 없습니다.</p>;
  }

  return (
    <ul style={{ display: "grid", gap: 8, marginTop: 12 }}>
      {posts.map((p) => (
        <PostItem
          key={p.id}
          post={p}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </ul>
  );
}
