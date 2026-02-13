"use client";
import React from "react";
import {
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

const WeeklyAngagementChart = ({
  engagementData,
}: {
  engagementData: {
    day: string;
    likes: number;
    comments: number;
    shares: number;
  }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={engagementData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="likes" fill="var(--color-chart-1)" />
        <Bar dataKey="comments" fill="var(--color-chart-2)" />
        <Bar dataKey="shares" fill="var(--color-chart-3)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyAngagementChart;
