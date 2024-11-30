"use client";

import { format } from "date-fns";
import { Asset } from "../types";
import { useEffect, useState } from "react";

interface AssetTableProps {
  assets: Asset[];
  onDelete: (id: string) => void;
}

export default function AssetTable({ assets, onDelete }: AssetTableProps) {
  const [currentPrices, setCurrentPrices] = useState<Record<number, number>>(
    {}
  );

  // Fetch current prices for all assets
  useEffect(() => {
    const fetchCurrentPrices = async () => {
      try {
        const response = await fetch("/api/crypto/listings");
        const data = await response.json();
        const prices = data.reduce(
          (acc: Record<number, number>, crypto: any) => {
            acc[crypto.id] = crypto.currentPrice;
            return acc;
          },
          {}
        );
        setCurrentPrices(prices);
      } catch (error) {
        console.error("Failed to fetch current prices:", error);
      }
    };

    fetchCurrentPrices();
    const interval = setInterval(fetchCurrentPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (assets.length === 0) {
    return (
      <div className="bg-surface p-6 rounded-lg text-center">
        No assets added yet. Use the form above to add your first asset.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-surface rounded-lg">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-left">Asset Name</th>
            <th className="p-4 text-left">Date Bought</th>
            <th className="p-4 text-left">Price Paid</th>
            <th className="p-4 text-left">Current Value</th>
            <th className="p-4 text-left">Profit/Loss</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => {
            const currentPrice =
              currentPrices[asset.cryptoId] || asset.pricePaid;
            const currentValue = currentPrice * asset.quantity;
            const profitLoss =
              (currentPrice - asset.pricePaid) * asset.quantity;
            const profitLossPercentage =
              (profitLoss / (asset.pricePaid * asset.quantity)) * 100;

            return (
              <tr
                key={asset.id}
                className={`
                  ${index % 2 === 0 ? "bg-row-base" : "bg-row-alt"}
                  hover:bg-gray-800 transition-colors duration-150
                `}
              >
                <td className="p-4">{asset.name}</td>
                <td className="p-4">{format(asset.dateBought, "PP")}</td>
                <td className="p-4">${asset.pricePaid.toFixed(2)}</td>
                <td className="p-4">${currentValue.toFixed(2)}</td>
                <td
                  className={`p-4 ${
                    profitLoss >= 0 ? "text-primary" : "text-danger"
                  }`}
                >
                  ${profitLoss.toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
                </td>
                <td className="p-4">
                  <button
                    onClick={() => asset.id && onDelete(asset.id)}
                    className="text-danger hover:text-red-400 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
