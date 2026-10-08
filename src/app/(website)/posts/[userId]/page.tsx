import PostsPage from "./_components/PostsPage";

export default function Page({ params }: { params: { userId: string } }) {
  return <PostsPage userId={params.userId} />;
}