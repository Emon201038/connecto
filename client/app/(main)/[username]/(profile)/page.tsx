import { auth } from "@/auth";
import Posts from "../components/post-wraper";
import { redirect } from "next/navigation";
import { store } from "@/redux/store";
import { userApi } from "@/redux/features/user/userApi";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login?callback=/profile");
  }

  const { username } = await params;

  const res = await store.dispatch(
    userApi.endpoints.getUserPosts.initiate(
      {
        username: username,
        cookie: undefined,
      },
      {
        forceRefetch: true,
      }
    )
  );

  return (
    <div className="md:col-span-2 space-y-4 md:w-2/3 w-full mx-auto">
      <Posts posts={res?.data?.data?.posts || []} />
    </div>
  );
}
