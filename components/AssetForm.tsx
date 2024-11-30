"use client";

import { useState, useEffect } from "react";
import { Asset } from "../types";

interface CryptoListing {
  id: number;
  name: string;
  symbol: string;
  currentPrice: number;
}

interface AssetFormProps {
  onSubmit: (asset: Asset) => void;
}

export default function AssetForm({ onSubmit }: AssetFormProps) {
  const [cryptoListings, setCryptoListings] = useState<CryptoListing[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoListing | null>(
    null
  );
  const [formData, setFormData] = useState({
    dateBought: "",
    pricePaid: "",
    quantity: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/crypto/listings")
      .then((res) => res.json())
      .then((data) => setCryptoListings(data))
      .catch((error) =>
        console.error("Failed to fetch crypto listings:", error)
      );
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCrypto) {
      newErrors.selectedCrypto = "You must select a cryptocurrency";
    }
    if (!formData.dateBought) {
      newErrors.dateBought = "Date is required";
    }
    if (!formData.pricePaid || isNaN(Number(formData.pricePaid))) {
      newErrors.pricePaid = "Valid price is required";
    }
    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      newErrors.quantity = "Valid quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && selectedCrypto) {
      onSubmit({
        name: selectedCrypto.name,
        dateBought: new Date(formData.dateBought),
        pricePaid: Number(formData.pricePaid),
        quantity: Number(formData.quantity),
        cryptoId: selectedCrypto.id,
        currentValue: selectedCrypto.currentPrice * Number(formData.quantity),
      });

      // Reset the form
      setFormData({
        dateBought: "",
        pricePaid: "",
        quantity: "",
      });
      setSelectedCrypto(null);
      setErrors({});
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface p-6 rounded-lg shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Select Crypto
          </label>
          <select
            value={selectedCrypto?.id || ""}
            onChange={(e) => {
              const crypto = cryptoListings.find(
                (c) => c.id === Number(e.target.value)
              );
              setSelectedCrypto(crypto || null);
            }}
            className="w-full p-2 bg-background border border-gray-600 rounded focus:outline-none focus:border-primary"
          >
            <option value="">Select a cryptocurrency</option>
            {cryptoListings.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </option>
            ))}
          </select>
          {errors.selectedCrypto && (
            <p className="mt-1 text-danger text-sm">{errors.selectedCrypto}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Date Bought</label>
          <input
            type="date"
            value={formData.dateBought}
            onChange={(e) =>
              setFormData({ ...formData, dateBought: e.target.value })
            }
            className="w-full p-2 bg-background border border-gray-600 rounded focus:outline-none focus:border-primary"
          />
          {errors.dateBought && (
            <p className="mt-1 text-danger text-sm">{errors.dateBought}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Price Paid</label>
          <input
            type="number"
            value={formData.pricePaid}
            onChange={(e) =>
              setFormData({ ...formData, pricePaid: e.target.value })
            }
            className="w-full p-2 bg-background border border-gray-600 rounded focus:outline-none focus:border-primary"
            placeholder="Enter Price Paid"
            step="0.01"
          />
          {errors.pricePaid && (
            <p className="mt-1 text-danger text-sm">{errors.pricePaid}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="w-full p-2 bg-background border border-gray-600 rounded focus:outline-none focus:border-primary"
            placeholder="Enter Quantity"
            step="any"
          />
          {errors.quantity && (
            <p className="mt-1 text-danger text-sm">{errors.quantity}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-primary text-background px-6 py-2 rounded hover:bg-primary-hover transition-colors duration-200"
      >
        Add Asset
      </button>
    </form>
  );
}
