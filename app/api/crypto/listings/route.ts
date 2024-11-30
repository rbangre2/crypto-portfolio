import { NextResponse } from "next/server";

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const BASE_URL = "https://pro-api.coinmarketcap.com/v1";

export async function GET() {
  try {
    const response = await fetch(
      `${BASE_URL}/cryptocurrency/listings/latest?limit=100`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY!,
        },
      }
    );

    const data = await response.json();
    const cryptos = data.data.map((crypto: any) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      currentPrice: crypto.quote.USD.price,
    }));

    return NextResponse.json(cryptos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch crypto listings" },
      { status: 500 }
    );
  }
}
