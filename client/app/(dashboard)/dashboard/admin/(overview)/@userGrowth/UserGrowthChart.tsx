"use client";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const UserGrowthChart = ({
  userGrowthData,
}: {
  userGrowthData: { month: string; users: number; newUsers: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={userGrowthData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="users"
          stackId="1"
          stroke="var(--color-chart-1)"
          fill="var(--color-chart-1)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="newUsers"
          stackId="2"
          stroke="var(--color-chart-2)"
          fill="var(--color-chart-2)"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
