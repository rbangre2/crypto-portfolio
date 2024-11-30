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
    const interval = setInterval(fetchCurrentPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-surface rounded-lg">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-left">Asset</th>
            <th className="p-4 text-left">Date Bought</th>
            <th className="p-4 text-left">Purchase Price</th>
            <th className="p-4 text-left">Current Price</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Total Invested</th>
            <th className="p-4 text-left">Current Value</th>
            <th className="p-4 text-left">Profit/Loss</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => {
            const currentPrice =
              currentPrices[asset.cryptoId] || asset.pricePaid;
            const totalInvested = asset.pricePaid * asset.quantity;
            const currentValue = currentPrice * asset.quantity;
            const profitLoss = currentValue - totalInvested;
            const profitLossPercentage = (profitLoss / totalInvested) * 100;

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
                <td className="p-4">${currentPrice.toFixed(2)}</td>
                <td className="p-4">{asset.quantity}</td>
                <td className="p-4">${totalInvested.toFixed(2)}</td>
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
