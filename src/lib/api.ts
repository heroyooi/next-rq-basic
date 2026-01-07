export type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('게시글 목록을 불러오지 못했습니다.');
  return res.json();
}

export async function createPost(input: {
  title: string;
  body: string;
}): Promise<Post> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? '게시글 등록에 실패했습니다.');
  }

  return res.json();
}

export async function deletePost(id: string) {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? '삭제에 실패했습니다.');
  }

  return res.json(); // { ok: true }
}

export async function fetchPost(id: string) {
  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? '게시글을 불러오지 못했습니다.');
  }
  return res.json();
}

export async function updatePost(
  id: string,
  input: { title: string; body: string }
) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? '게시글 수정에 실패했습니다.');
  }

  return res.json();
}
