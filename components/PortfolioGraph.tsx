"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Asset } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PortfolioGraphProps {
  data: Asset[];
}

export default function PortfolioGraph({ data }: PortfolioGraphProps) {
  // Generate a global date range from the earliest to the latest date across all assets
  const generateGlobalDateRange = () => {
    const earliestDate = new Date(
      Math.min(...data.map((a) => a.dateBought.getTime()))
    );
    const currentDate = new Date();
    const dates: string[] = [];
    let iterDate = new Date(earliestDate);

    while (iterDate <= currentDate) {
      dates.push(iterDate.toISOString().split("T")[0]);
      iterDate.setDate(iterDate.getDate() + 1);
    }

    return dates;
  };

  // Generate curve data from purchase date to current
  const generateCurveData = (
    asset: Asset,
    currentPrice: number,
    globalDates: string[]
  ) => {
    const profitLoss = (currentPrice - asset.pricePaid) * asset.quantity;

    const assetDates = globalDates.map((date) => {
      if (new Date(date) < asset.dateBought) return null;

      const totalDays =
        globalDates.length -
        globalDates.indexOf(asset.dateBought.toISOString().split("T")[0]) -
        1;

      const progress =
        (globalDates.indexOf(date) -
          globalDates.indexOf(asset.dateBought.toISOString().split("T")[0])) /
        totalDays;

      const smoothProgress = Math.max(
        0,
        progress * progress * (3 - 2 * progress)
      );
      return profitLoss * smoothProgress;
    });

    assetDates[assetDates.length - 1] = profitLoss; // Ensure last value matches table
    return assetDates;
  };

  const colors = [
    "#4F46E5", // Indigo
    "#06B6D4", // Cyan
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
  ];

  const globalDates = generateGlobalDateRange();

  const datasets = data.map((asset, index) => {
    const currentPrice =
      asset.currentValue !== undefined
        ? asset.currentValue / asset.quantity // Adjusted for total vs unit price
        : asset.pricePaid;

    const curveData = generateCurveData(asset, currentPrice, globalDates);

    return {
      label: `${asset.name} P/L`,
      data: curveData,
      borderColor: colors[index % colors.length],
      backgroundColor: `${colors[index % colors.length]}33`,
      fill: false,
      tension: 0.8,
      spanGaps: true, // Ensure the graph skips over null values
    };
  });

  const chartData = {
    labels: globalDates,
    datasets: datasets,
  };

  return (
    <div className="space-y-4">
      <div className="h-[400px]">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top" as const,
                labels: {
                  color: "#E0E0E0",
                },
              },
              title: {
                display: true,
                text: "Asset Profit/Loss Over Time",
                color: "#E0E0E0",
              },
            },
            scales: {
              x: {
                grid: {
                  color: "#2E2E2E",
                },
                ticks: {
                  color: "#E0E0E0",
                },
              },
              y: {
                grid: {
                  color: "#2E2E2E",
                },
                ticks: {
                  color: "#E0E0E0",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
