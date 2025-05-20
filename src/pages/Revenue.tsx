import React, { useEffect, useState } from "react";
import { DollarSign, Percent, ShoppingCart, Users } from "lucide-react";
import ChartCard from "../components/ChartCard";
import MetricCard from "../components/MetricCard";
import TimelineChart from "../components/TimelineChart";
import StackedAreaChart from "../components/StackedAreaChart";
import { formatCurrency } from "../data/revenueData";
import { auth, supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface ChartDataPoint {
  name: string;
  revenue: number;
  profit: number;
  expenses: number;
}

interface YearlyDataPoint {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
}

type Period = "3M" | "1Y" | "All";
type YearlyPeriod = "3Y" | "5Y" | "All";

const Revenue: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [monthlyData, setMonthlyData] = useState<ChartDataPoint[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyDataPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("3M");
  const [selectedYearlyPeriod, setSelectedYearlyPeriod] =
    useState<YearlyPeriod>("3Y");

  useEffect(() => {
    async function getCurrentUser() {
      const { data } = await auth.getUser();
      setCurrentUser(data?.user || null);
    }

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    async function fetchRevenue() {
      const { data, error } = await supabase
        .from("finance")
        .select("*")
        .eq("admin_id", currentUser?.id)
        .order("month", { ascending: true });

      if (error) {
        console.error("Error fetching revenue:", error);
      } else {
        console.log("Raw data from database:", data);

        // Transform data for monthly charts
        const monthlyChartData =
          data?.map((item) => ({
            name: new Date(item.month).toLocaleString("default", {
              month: "short",
            }),
            revenue: item.net_income,
            profit: item.net_profit,
            expenses: item.net_cost,
          })) || [];
        console.log("Transformed monthly data:", monthlyChartData);
        setMonthlyData(monthlyChartData);

        // Transform data for yearly charts
        const yearlyChartData = data?.reduce((acc: YearlyDataPoint[], item) => {
          const year = new Date(item.month).getFullYear();
          const existingYear = acc.find((y) => y.name === year.toString());

          if (existingYear) {
            existingYear.revenue += item.net_income;
            existingYear.expenses += item.net_cost;
            existingYear.profit += item.net_profit;
          } else {
            acc.push({
              name: year.toString(),
              revenue: item.net_income,
              expenses: item.net_cost,
              profit: item.net_profit,
            });
          }
          return acc;
        }, []);
        console.log("Transformed yearly data:", yearlyChartData);
        setYearlyData(yearlyChartData);
      }
    }
    fetchRevenue();
  }, [currentUser]);

  const filterDataByPeriod = (
    data: ChartDataPoint[],
    period: Period
  ): ChartDataPoint[] => {
    if (period === "All") return data;

    if (period === "3M") {
      // Get the last 3 months of data
      const lastThreeMonths = data.slice(-3);
      console.log("Last 3 months data:", lastThreeMonths);
      return lastThreeMonths;
    }

    if (period === "1Y") {
      // Get exactly the last 12 months of data
      const lastTwelveMonths = data.slice(-12);
      console.log("Last 12 months data:", lastTwelveMonths);
      return lastTwelveMonths;
    }

    console.log("All data:", data);
    return data;
  };

  const filteredMonthlyData = filterDataByPeriod(monthlyData, selectedPeriod);
  console.log(
    "Current filtered data for period",
    selectedPeriod,
    ":",
    filteredMonthlyData
  );

  // Calculate metrics based on filtered data
  const totalRevenue = filteredMonthlyData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalProfit = filteredMonthlyData.reduce(
    (sum, item) => sum + item.profit,
    0
  );
  const profitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const totalExpenses = filteredMonthlyData.reduce(
    (sum, item) => sum + item.expenses,
    0
  );
  const avgOrderValue =
    filteredMonthlyData.length > 0
      ? totalRevenue / filteredMonthlyData.length
      : 0;

  // Get current month's data
  const currentMonthData = filteredMonthlyData[filteredMonthlyData.length - 1];
  const currentMonthRevenue = currentMonthData?.revenue || 0;
  const currentMonthProfit = currentMonthData?.profit || 0;
  const currentMonthExpenses = currentMonthData?.expenses || 0;
  const currentMonthProfitMargin =
    currentMonthRevenue > 0
      ? (currentMonthProfit / currentMonthRevenue) * 100
      : 0;

  console.log("Calculated metrics:", {
    totalRevenue,
    totalProfit,
    profitMargin,
    totalExpenses,
    avgOrderValue,
    currentMonthRevenue,
    currentMonthProfit,
    currentMonthExpenses,
    currentMonthProfitMargin,
  });

  // Calculate month-over-month changes
  const getMonthOverMonthChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const lastMonthRevenue =
    filteredMonthlyData[filteredMonthlyData.length - 2]?.revenue || 0;
  const revenueChange = getMonthOverMonthChange(
    currentMonthRevenue,
    lastMonthRevenue
  );

  const lastMonthProfit =
    filteredMonthlyData[filteredMonthlyData.length - 2]?.profit || 0;
  const profitChange = getMonthOverMonthChange(
    currentMonthProfit,
    lastMonthProfit
  );

  const filterYearlyDataByPeriod = (
    data: YearlyDataPoint[],
    period: YearlyPeriod
  ): YearlyDataPoint[] => {
    if (period === "All") return data;
    const years = parseInt(period);
    return data.slice(-years);
  };

  const filteredYearlyData = filterYearlyDataByPeriod(
    yearlyData,
    selectedYearlyPeriod
  );

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as Period);
  };

  const handleYearlyPeriodChange = (period: string) => {
    setSelectedYearlyPeriod(period as YearlyPeriod);
  };

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
          value={`${formatCurrency(totalRevenue)} DA`}
          subtitle={`This month: ${formatCurrency(currentMonthRevenue)} DA`}
          change={revenueChange}
          icon={<DollarSign size={20} />}
        />
        <MetricCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          subtitle={`This month: ${currentMonthProfitMargin.toFixed(1)}%`}
          change={profitChange}
          icon={<Percent size={20} />}
        />
        <MetricCard
          title="Total Expenses"
          value={`${formatCurrency(totalExpenses)} DA`}
          subtitle={`This month: ${formatCurrency(currentMonthExpenses)} DA`}
          change={0}
          icon={<Users size={20} />}
        />
        <MetricCard
          title="Average Revenue"
          value={`${formatCurrency(avgOrderValue)} DA`}
          subtitle={`This month: ${formatCurrency(currentMonthRevenue)} DA`}
          change={0}
          icon={<ShoppingCart size={20} />}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Monthly Revenue"
          subtitle="Total revenue generated each month including all sales channels"
          periodOptions={["3M", "1Y", "All"]}
          onPeriodChange={handlePeriodChange}
        >
          <TimelineChart
            data={filteredMonthlyData}
            dataKey="revenue"
            stroke="#2563EB"
            fill="#2563EB"
            formatter={formatCurrency}
          />
        </ChartCard>

        <ChartCard
          title="Net Profit"
          subtitle="Monthly net profit after all expenses and operating costs"
          periodOptions={["3M", "1Y", "All"]}
          onPeriodChange={handlePeriodChange}
        >
          <TimelineChart
            data={filteredMonthlyData}
            dataKey="profit"
            splitColor={true}
            formatter={formatCurrency}
          />
        </ChartCard>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          title="Yearly Performance"
          subtitle="Annual revenue, expenses and profit comparison"
          periodOptions={["3Y", "5Y", "All"]}
          onPeriodChange={handleYearlyPeriodChange}
        >
          <StackedAreaChart
            data={filteredYearlyData}
            dataKeys={[
              { key: "profit", color: "#10B981", name: "Profit" },
              { key: "expenses", color: "#F59E0B", name: "Expenses" },
            ]}
            formatter={formatCurrency}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default Revenue;
