import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface DataKey {
  key: string;
  color: string;
  name: string;
}

interface StackedAreaChartProps {
  data: any[];
  dataKeys: DataKey[];
  formatter?: (value: number) => string;
}

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  data,
  dataKeys,
  formatter,
}) => {
  const customTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
            {label}
          </p>
          <div className="space-y-1">
            {payload.map((entry, index) => {
              const value = formatter
                ? formatter(Number(entry.value))
                : entry.value;

              return (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-400 mr-2">
                    {entry.name}:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E2E8F0"
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          dy={10}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          tickFormatter={formatter}
          dx={-10}
        />

        <Tooltip content={customTooltip} />

        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {value}
            </span>
          )}
        />

        {dataKeys.map((dataKey, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={dataKey.key}
            name={dataKey.name}
            stackId="1"
            stroke={dataKey.color}
            fill={dataKey.color}
            animationDuration={1000 + index * 300}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StackedAreaChart;
