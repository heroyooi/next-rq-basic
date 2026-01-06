import { NextResponse } from 'next/server';
import { readPosts, writePosts } from '@/lib/posts.db';

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
