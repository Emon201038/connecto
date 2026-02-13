import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { IColumn } from "@/components/shared/ManagementTable";
import { formatDateTime } from "@/lib/formatters";
import { IUser } from "@/types";

export const userColumns: IColumn<IUser>[] = [
  {
    header: "Users",
    accessor: (user) => (
      <UserInfoCell
        name={user.fullName}
        email={user.email}
        photo={user.profilePicture?.url}
      />
    ),
  },
  {
    header: "Gender",
    accessor: (user) => user.gender,
  },
  {
    header: "Joined",
    accessor: (user) => formatDateTime(new Date(parseInt(user.createdAt))),
    sortKey: "createdAt",
  },
  {
    header: "Friends",
    accessor: (user) => user.friends.length,
  },
  {
    header: "Followers",
    accessor: (user) => user.followers.length,
  },
  {
    header: "Following",
    accessor: (user) => user.followings.length,
  },
  {
    header: "Date of birth",
    accessor: (user) => (
      <div>{new Date(parseInt(user.dateOfBirth)).toLocaleDateString()}</div>
    ),
    sortKey: "dateOfBirth",
  },
];
