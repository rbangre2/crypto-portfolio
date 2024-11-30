"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import Header from "../components/Header";
import AssetForm from "../components/AssetForm";
import AssetTable from "../components/AssetTable";
import PortfolioGraph from "../components/PortfolioGraph";
import { Asset } from "../types";

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);

  // Load assets from Firestore
  useEffect(() => {
    const q = query(collection(db, "assets"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const assetsList: Asset[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        assetsList.push({
          ...data,
          id: doc.id,
          dateBought: new Date(data.dateBought.toDate()),
        } as Asset);
      });
      setAssets(assetsList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddAsset = async (asset: Asset) => {
    try {
      await addDoc(collection(db, "assets"), {
        ...asset,
        dateBought: new Date(asset.dateBought),
      });
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteDoc(doc(db, "assets", id));
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <AssetForm onSubmit={handleAddAsset} />
        <AssetTable assets={assets} onDelete={handleDeleteAsset} />
        <PortfolioGraph data={assets} />
      </div>
    </main>
  );
}
