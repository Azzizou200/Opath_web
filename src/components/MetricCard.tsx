import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  prefix = "",
  suffix = "",
  icon,
  subtitle,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const absoluteChange = change ? Math.abs(change) : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </h3>
        {icon && (
          <div className="text-slate-400 dark:text-slate-500">{icon}</div>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-slate-700 dark:text-slate-200 text-2xl font-semibold">
          {prefix}
          {value}
          {suffix}
        </span>
        {subtitle && (
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </span>
        )}
      </div>

      {change !== undefined && (
        <div
          className={`mt-2 flex items-center text-sm
          ${isPositive ? "text-emerald-600 dark:text-emerald-400" : ""}
          ${isNegative ? "text-rose-600 dark:text-rose-400" : ""}
          ${
            !isPositive && !isNegative
              ? "text-slate-500 dark:text-slate-400"
              : ""
          }
        `}
        >
          {isPositive && <ArrowUp size={16} className="mr-1" />}
          {isNegative && <ArrowDown size={16} className="mr-1" />}
          <span>{absoluteChange}% from last month</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
