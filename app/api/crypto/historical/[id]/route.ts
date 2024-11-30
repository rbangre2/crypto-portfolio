import { NextResponse } from "next/server";

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const BASE_URL = "https://pro-api.coinmarketcap.com/v1";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!COINMARKETCAP_API_KEY) {
      console.error("Missing API key");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    if (!params.id) {
      return NextResponse.json(
        { error: "Missing cryptocurrency ID" },
        { status: 400 }
      );
    }

    // Correct API endpoint for historical data
    const response = await fetch(
      `${BASE_URL}/cryptocurrency/ohlcv/historical?id=${params.id}&interval=daily&count=30`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API Error:", errorBody);
      return NextResponse.json(
        {
          error: "Failed to fetch historical data from CoinMarketCap",
          details: errorBody,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.data || !data.data[params.id]) {
      console.error("Unexpected API response:", data);
      return NextResponse.json(
        { error: "Unexpected API response format" },
        { status: 500 }
      );
    }

    const prices = data.data[params.id].quotes.map((quote: any) => ({
      date: quote.timestamp,
      value: quote.quote.USD.price,
    }));

    return NextResponse.json(prices);
  } catch (error) {
    console.error("Failed to fetch historical data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
