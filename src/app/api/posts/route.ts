import { NextResponse } from 'next/server';
import { readPosts, writePosts, type Post } from '@/lib/posts.db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const sort = searchParams.get("sort") ?? "latest";

  let posts = await readPosts();

  // 검색 (제목)
  if (q) {
    posts = posts.filter((p) => p.title.toLowerCase().includes(q));
  }

  // 정렬
  if (sort === "oldest") {
    posts = posts.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  } else if (sort === "title") {
    posts = posts.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // latest (기본)
    posts = posts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const title = (body?.title ?? '').toString().trim();
  const content = (body?.body ?? '').toString().trim();

  if (title.length < 3) {
    return NextResponse.json(
      { message: '제목은 3자 이상이어야 합니다.' },
      { status: 400 }
    );
  }
  if (content.length < 10) {
    return NextResponse.json(
      { message: '내용은 10자 이상이어야 합니다.' },
      { status: 400 }
    );
  }

  const posts = await readPosts();

  const newPost: Post = {
    id: crypto.randomUUID(),
    title,
    body: content,
    createdAt: new Date().toISOString(),
  };

  await writePosts([newPost, ...posts]); // 새 글을 앞에 넣기
  return NextResponse.json(newPost, { status: 201 });
}
