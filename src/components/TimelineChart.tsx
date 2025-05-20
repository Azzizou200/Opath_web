import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
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

interface TimelineChartProps {
  data: any[];
  dataKey: string;
  stroke?: string;
  fill?: string;
  gradient?: boolean;
  splitColor?: boolean;
  tooltipFormatter?: (
    value: ValueType,
    name: NameType
  ) => [ValueType, NameType];
  formatter?: (value: number) => string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  dataKey,
  stroke = "#2563EB",
  fill = "#2563EB",
  gradient = true,
  splitColor = false,
  tooltipFormatter,
  formatter,
}) => {
  const gradientOffset = useMemo(() => {
    if (!splitColor) return 0;

    const dataMax = Math.max(...data.map((i) => i[dataKey]));
    const dataMin = Math.min(...data.map((i) => i[dataKey]));

    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;

    return dataMax / (dataMax - dataMin);
  }, [data, dataKey, splitColor]);

  const customTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const value = formatter
        ? formatter(Number(payload[0].value))
        : payload[0].value;

      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            <span className="font-medium">{value}</span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          {gradient && !splitColor && (
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fill} stopOpacity={0.3} />
              <stop offset="95%" stopColor={fill} stopOpacity={0} />
            </linearGradient>
          )}

          {splitColor && (
            <linearGradient id="splitColorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={gradientOffset}
                stopColor="#10B981"
                stopOpacity={0.3}
              />
              <stop
                offset={gradientOffset}
                stopColor="#EF4444"
                stopOpacity={0.3}
              />
            </linearGradient>
          )}
        </defs>

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#94A3B8" }}
          dy={10}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          tickFormatter={formatter}
          dx={-10}
        />

        <Tooltip content={customTooltip} formatter={tooltipFormatter} />

        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={
            splitColor
              ? gradientOffset >= 0.5
                ? "#10B981"
                : "#EF4444"
              : stroke
          }
          strokeWidth={2}
          fill={
            splitColor
              ? "url(#splitColorGradient)"
              : gradient
              ? "url(#colorGradient)"
              : fill
          }
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;
