import { promises as fs } from 'fs';
import path from 'path';

export type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

const DB_PATH = path.join(process.cwd(), 'data', 'posts.json');

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, '[]', 'utf-8');
  }
}

export async function readPosts(): Promise<Post[]> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  const data = JSON.parse(raw) as Post[];
  return Array.isArray(data) ? data : [];
}

export async function writePosts(posts: Post[]) {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(posts, null, 2), 'utf-8');
}
