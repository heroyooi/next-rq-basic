import { NextResponse } from 'next/server';
import { readPosts, writePosts } from '@/lib/posts.db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const posts = await readPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json(
      { message: '해당 게시글이 없습니다.' },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
  const idx = posts.findIndex((p) => p.id === id);

  if (idx === -1) {
    return NextResponse.json(
      { message: '해당 게시글이 없습니다.' },
      { status: 404 }
    );
  }

  const updated = {
    ...posts[idx],
    title,
    body: content,
    // updatedAt을 넣고 싶으면 posts.db 타입에도 추가하셔도 됩니다.
    // updatedAt: new Date().toISOString(),
  };

  const nextPosts = [...posts];
  nextPosts[idx] = updated;

  await writePosts(nextPosts);
  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const posts = await readPosts();
  const nextPosts = posts.filter((p) => p.id !== id);

  if (nextPosts.length === posts.length) {
    return NextResponse.json(
      { message: '해당 게시글이 없습니다.' },
      { status: 404 }
    );
  }

  await writePosts(nextPosts);
  return NextResponse.json({ ok: true }, { status: 200 });
}
