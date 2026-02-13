import UserFilter from "@/components/modules/dashboard/user/UserFilter";
import UserManagementHeader from "@/components/modules/dashboard/user/UserManagementHeader";
import UsersTable from "@/components/modules/dashboard/user/UsersTable";
import TablePagination from "@/components/shared/TablePagination";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { userApi } from "@/redux/features/user/userApi";
import { store } from "@/redux/store";
import { IResponse, IUser } from "@/types";
import React, { Suspense } from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | number | object | undefined;
  }>;
}) => {
  const searchParamsObj = await searchParams;
  if (!searchParamsObj?.search) {
    searchParamsObj.search = "";
  }
  if (searchParamsObj.page) {
    searchParamsObj.page = Number(searchParamsObj.page);
  }
  if (searchParamsObj.limit) {
    searchParamsObj.limit = Number(searchParamsObj.limit);
  }
  if (searchParamsObj.role) {
    searchParamsObj.filter = {
      ...(searchParamsObj.filter as Record<string, string>),
      role: searchParamsObj.role,
    };
  }
  if (searchParamsObj.gender) {
    searchParamsObj.filter = {
      ...(searchParamsObj.filter as Record<string, string>),
      gender: searchParamsObj.gender,
    };
  }
  if (searchParamsObj.status === "isDeleted") {
    searchParamsObj.filter = {
      ...(searchParamsObj.filter as Record<string, string>),
      isDeleted: "true",
    };
  }
  if (searchParamsObj.status === "isDisabled") {
    searchParamsObj.filter = {
      ...(searchParamsObj.filter as Record<string, string>),
      isDisabled: "true",
    };
  }

  searchParamsObj.additionalFields = `createdAt gender friends {
        id
      }
      followers {
        id
      }
      followings {
        id
      }
        dateOfBirth
        role`;
  const data = await store
    .dispatch(
      userApi.endpoints.getUsers.initiate(
        searchParamsObj as Record<string, string>,
        { forceRefetch: true },
      ),
    )
    .unwrap();
  return (
    <div className="space-y-4 p-6">
      <UserManagementHeader />
      <UserFilter />
      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <UsersTable users={data.data.users || []} />
        <TablePagination
          currentPage={data?.data?.meta?.page || 1}
          totalPages={data?.data?.meta?.totalPage || 1}
        />
      </Suspense>
    </div>
  );
};

export default page;
