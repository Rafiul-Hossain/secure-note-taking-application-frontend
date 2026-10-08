import PostsPage from "./_components/PostsPage";

export default function Page({ params }: { params: { userId: string } }) {
  return <PostsPage key={params.userId} userId={params.userId} />;
}