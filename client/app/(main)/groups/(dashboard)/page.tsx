import { redirect } from "next/navigation";

const GroupDashboardPage = () => {
  redirect("/groups/feed");
};

export default GroupDashboardPage;
