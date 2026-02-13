import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { store } from "@/redux/store";
import { adminApi } from "@/redux/features/admin/adminApi";
import WeeklyAngagementChart from "./WeeklyAngagementChart";

const WeeklyAngagementPage = async () => {
  const res = await store.dispatch(
    adminApi.endpoints.weeklyEngagement.initiate(),
  );
  const weeklyEngagementData = res.data || [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Engagement</CardTitle>
        <CardDescription>
          Likes, comments, and shares over the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WeeklyAngagementChart engagementData={weeklyEngagementData} />
      </CardContent>
    </Card>
  );
};

export default WeeklyAngagementPage;
