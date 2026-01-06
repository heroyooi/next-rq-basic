export async function fetchPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');

  if (!response.ok) {
    throw new Error('게시글을 불러오지 못했습니다.');
  }

  return response.json();
}
