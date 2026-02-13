import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import UserDemoGraphics from "./UserDemoGraphics";
import { store } from "@/redux/store";
import { adminApi } from "@/redux/features/admin/adminApi";

const UserDemographicsPage = async () => {
  const res = await store.dispatch(adminApi.endpoints.demographics.initiate());
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Demographics</CardTitle>
        <CardDescription>Age distribution of active users</CardDescription>
      </CardHeader>
      <CardContent>
        <UserDemoGraphics data={res.data || []} />
      </CardContent>
    </Card>
  );
};

export default UserDemographicsPage;
