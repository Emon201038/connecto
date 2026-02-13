import { ReactNode } from "react";

export default async function ProfilePage({
  intro,
  photos,
  friends,
  children,
}: {
  intro: ReactNode;
  photos: ReactNode;
  friends: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="pt-4 px-4  mx-auto ">
      <div className="flex flex-col md:flex-row gap-4  max-w-5xl mx-auto">
        {/* Left sidebar */}
        <div className="md:col-span-1 space-y-4 md:w-1/3 left-0 top-16 ">
          {intro}

          {photos}

          {friends}
        </div>

        {/* Content Area */}
        {children}
      </div>
    </div>
  );
}
