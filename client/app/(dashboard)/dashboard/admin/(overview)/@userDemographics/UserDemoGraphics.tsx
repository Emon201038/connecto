"use client";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const UserDemoGraphics = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  const demographicsData = data.map((entry) => ({
    ...entry,
    color:
      entry.name === "18-24"
        ? "var(--color-chart-1)"
        : entry.name === "25-34"
          ? "var(--color-chart-2)"
          : entry.name === "35-44"
            ? "var(--color-chart-3)"
            : entry.name === "45-54"
              ? "var(--color-chart-4)"
              : "var(--color-chart-5)",
  }));
  // [
  //   { name: "18-24", value: 35, color: "var(--color-chart-1)" },
  //   { name: "25-34", value: 28, color: "var(--color-chart-2)" },
  //   { name: "35-44", value: 20, color: "var(--color-chart-3)" },
  //   { name: "45-54", value: 12, color: "var(--color-chart-4)" },
  //   { name: "55+", value: 5, color: "var(--color-chart-5)" },
  // ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={demographicsData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, value }) =>
            `${name}: ${((((value as number) || 0) / demographicsData.reduce((total, entry) => total + entry.value, 0)) * 100).toFixed(2)}%`
          }
        >
          {demographicsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default UserDemoGraphics;
