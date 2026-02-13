interface IProps {
  leftSidebar: React.ReactNode;
  rightSidebar: React.ReactNode;
  createPostCard: React.ReactNode;
  stories: React.ReactNode;
  children: React.ReactNode;
}

export default async function HomePage({
  leftSidebar,
  rightSidebar,
  createPostCard,
  stories,
  children,
}: IProps) {
  return (
    <div className="flex mt-24 md:mt-12">
      {/* Left Sidebar - hidden on mobile */}
      <div className="hidden lg:block w-1/4 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {leftSidebar}
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-1/2 md:w-2/3 lg:px-20 mx-auto md:mx-0 md:mr-[25%] lg:mx-auto">
        <div className="p-4">
          {createPostCard}
          {stories}
          {children}
        </div>
      </div>

      {/* Right Sidebar - hidden on mobile */}
      <div className="hidden md:block md:w-1/4 lg:w-1/5 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {rightSidebar}
      </div>
    </div>
  );
}
