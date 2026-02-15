import { auth } from "@/auth";
import UserFilter from "@/components/modules/dashboard/user/UserFilter";
import UserManagementHeader from "@/components/modules/dashboard/user/UserManagementHeader";
import UsersTable from "@/components/modules/dashboard/user/UsersTable";
import TablePagination from "@/components/shared/TablePagination";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { userApi } from "@/redux/features/user/userApi";
import { store } from "@/redux/store";
import { IResponse, IUser } from "@/types";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | number | object | undefined;
  }>;
}) => {
  const searchParamsObj = await searchParams;
  // if (!searchParamsObj?.search) {
  //   searchParamsObj.search = "";
  // }
  // if (searchParamsObj.page) {
  //   searchParamsObj.page = Number(searchParamsObj.page);
  // }
  // if (searchParamsObj.limit) {
  //   searchParamsObj.limit = Number(searchParamsObj.limit);
  // }
  // if (searchParamsObj.role) {
  //   searchParamsObj.filter = {
  //     ...(searchParamsObj.filter as Record<string, string>),
  //     role: searchParamsObj.role,
  //   };
  // }
  // if (searchParamsObj.gender) {
  //   searchParamsObj.filter = {
  //     ...(searchParamsObj.filter as Record<string, string>),
  //     gender: searchParamsObj.gender,
  //   };
  // }
  // if (searchParamsObj.status === "isDeleted") {
  //   searchParamsObj.filter = {
  //     ...(searchParamsObj.filter as Record<string, string>),
  //     isDeleted: "true",
  //   };
  // }
  // if (searchParamsObj.status === "isDisabled") {
  //   searchParamsObj.filter = {
  //     ...(searchParamsObj.filter as Record<string, string>),
  //     isDisabled: "true",
  //   };
  // }

  const session = await auth();

  // searchParamsObj.additionalFields = `createdAt gender friends {
  //       id
  //     }
  //     followers {
  //       id
  //     }
  //     followings {
  //       id
  //     }
  //       dateOfBirth
  //       role`;
  // const data = await store
  //   .dispatch(
  //     userApi.endpoints.getUsers.initiate(
  //       searchParamsObj as Record<string, string>,
  //       {
  //         forceRefetch: false,
  //       },
  //     ),
  //   )
  //   .unwrap();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      cookie: cookieHeader,
    },
    cache: "no-store",
    credentials: "include",
    body: JSON.stringify({
      query: `query GetUsers($limit: Int, $page: Int, $search: String, $filter: UserFilterInput, $sortBy: String, $sortOrder: String) {
            users(limit: $limit, page: $page, search: $search, filter: $filter, sortBy: $sortBy, sortOrder: $sortOrder) {
              users {
                id
                firstName
                lastName
                fullName
                email
                profilePicture {
                  url
                  pub_id
                }
                createdAt
                gender
                friends {
                  id
                }
                followers {
                  id
                }
                followings {
                  id
                }
                dateOfBirth
                role
              }
              meta {
                page
                limit
                totalPage
                totalResult
              }
            }
          }`,
      // variables: searchParamsObj,
    }),
  });

  console.log(res);
  return (
    <div className="space-y-4 p-6">
      <UserManagementHeader />
      <UserFilter />
      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <UsersTable users={[]} />
        <TablePagination currentPage={1} totalPages={1} />
      </Suspense>
    </div>
  );
};

export default page;
