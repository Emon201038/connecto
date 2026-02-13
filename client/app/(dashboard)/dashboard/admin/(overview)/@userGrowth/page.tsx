import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserGrowthChart from "./UserGrowthChart";
import { store } from "@/redux/store";
import { adminApi } from "@/redux/features/admin/adminApi";

const UserGrowthPage = async () => {
  const res = await store.dispatch(adminApi.endpoints.userGrowth.initiate());
  const userGrowthData = res.data || [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>
          Monthly user acquisition and total users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserGrowthChart userGrowthData={userGrowthData} />
      </CardContent>
    </Card>
  );
};

export default UserGrowthPage;
