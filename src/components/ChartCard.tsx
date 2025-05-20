import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  periodOptions?: string[];
  onPeriodChange?: (period: string) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  footer,
  periodOptions = ["3M", "1Y", "All"],
  onPeriodChange,
}) => {
  const [activePeriod, setActivePeriod] = useState(periodOptions[0]);
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period);
    onPeriodChange?.(period);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {title}
            </h3>
            {subtitle && (
              <div className="relative ml-2">
                <HelpCircle
                  size={16}
                  className="text-slate-400 cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute z-10 left-full ml-2 top-0 w-48 bg-slate-800 text-white text-xs p-2 rounded shadow-lg">
                    {subtitle}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {periodOptions && periodOptions.length > 0 && (
          <div className="flex space-x-2">
            {periodOptions.map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activePeriod === period
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-[300px]">{children}</div>

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default ChartCard;
