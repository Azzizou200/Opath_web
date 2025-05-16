import React from "react";
import { DollarSign, Percent, ShoppingCart, Users } from "lucide-react";
import ChartCard from "../components/ChartCard";
import MetricCard from "../components/MetricCard";
import TimelineChart from "../components/TimelineChart";
import StackedAreaChart from "../components/StackedAreaChart";
import {
  formatCurrency,
  formatPercentage,
  monthlyRevenue,
  profitData,
  quarterlyGrowth,
  revenueByChannel,
  yearlyFinancials,
} from "../data/revenueData";

const Revenue: React.FC = () => {
  return (
    <div className="space-y-6 p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Revenue Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Financial performance overview and analytics
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(107000)}
          change={12.3}
          icon={<DollarSign size={20} />}
        />
        <MetricCard
          title="Profit Margin"
          value="36.4%"
          change={4.8}
          icon={<Percent size={20} />}
        />
        <MetricCard
          title="Customer Acquisition"
          value="$21.50"
          change={-2.1}
          icon={<Users size={20} />}
        />
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(87)}
          change={5.6}
          icon={<ShoppingCart size={20} />}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Monthly Revenue"
          subtitle="Total revenue generated each month including all sales channels"
        >
          <TimelineChart
            data={monthlyRevenue}
            dataKey="revenue"
            stroke="#2563EB"
            fill="#2563EB"
            formatter={formatCurrency}
          />
        </ChartCard>

        <ChartCard
          title="Net Profit"
          subtitle="Monthly net profit after all expenses and operating costs"
        >
          <TimelineChart
            data={profitData}
            dataKey="profit"
            splitColor={true}
            formatter={formatCurrency}
          />
        </ChartCard>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1  gap-6">
        <ChartCard
          title="Revenue by Channel"
          subtitle="Breakdown of revenue streams by different acquisition channels"
          periodOptions={["30D", "3M", "6M", "1Y"]}
        >
          <StackedAreaChart
            data={revenueByChannel}
            dataKeys={[
              { key: "direct", color: "#3B82F6", name: "Direct" },
              { key: "affiliate", color: "#8B5CF6", name: "Affiliate" },
              { key: "referral", color: "#EC4899", name: "Referral" },
            ]}
            formatter={formatCurrency}
          />
        </ChartCard>

        <ChartCard
          title="Yearly Performance"
          subtitle="Annual revenue, expenses and profit comparison"
          periodOptions={["3Y", "5Y", "10Y", "All"]}
        >
          <StackedAreaChart
            data={yearlyFinancials}
            dataKeys={[
              { key: "profit", color: "#10B981", name: "Profit" },
              { key: "expenses", color: "#F59E0B", name: "Expenses" },
            ]}
            formatter={formatCurrency}
          />
        </ChartCard>

        <ChartCard
          title="Quarterly Growth"
          subtitle="Percentage growth in revenue compared to previous quarter"
          periodOptions={["1Y", "2Y", "3Y"]}
        >
          <TimelineChart
            data={quarterlyGrowth}
            dataKey="growth"
            stroke="#10B981"
            fill="#10B981"
            formatter={formatPercentage}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default Revenue;
