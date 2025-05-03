import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  periodOptions?: string[];
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  footer,
  periodOptions = ["7D", "30D", "3M", "1Y", "All"],
}) => {
  const [activePeriod, setActivePeriod] = useState(periodOptions[1]);
  const [showTooltip, setShowTooltip] = useState(false);

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

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1 text-sm flex-grow sm:flex-grow-0">
            {periodOptions.map((period) => (
              <button
                key={period}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activePeriod === period
                    ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                onClick={() => setActivePeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[280px]">{children}</div>

      {footer && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
