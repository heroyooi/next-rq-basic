type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  return <h1>게시글 {id}</h1>;
}
