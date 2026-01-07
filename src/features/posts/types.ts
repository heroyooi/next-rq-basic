export type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type PostsPage = {
  items: Post[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
};
