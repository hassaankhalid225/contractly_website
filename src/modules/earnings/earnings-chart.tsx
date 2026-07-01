"use client";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from "recharts";

export function EarningsChart({ data, currency }: { data: { month: string; amount: number }[]; currency: string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0000000d" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#666" }} />
        <Tooltip
          cursor={{ fill: "#534AB70d" }}
          contentStyle={{ borderRadius: 8, border: "1px solid #00000010", fontSize: 13 }}
          formatter={(v: number) => [`${currency} ${v.toLocaleString()}`, "Earned"]}
        />
        <Bar dataKey="amount" fill="#534AB7" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
