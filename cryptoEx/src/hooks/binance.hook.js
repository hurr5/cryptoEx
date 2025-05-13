import { useEffect, useState } from 'react';

export function useBinance(symbol) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fetchUsdToRub = async () => {
  //   const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
  //   const data = await response.json();
  //   return parseFloat(data.Valute.USD.Value);
  // };

  useEffect(() => {
    if (!symbol) return;

    const fetchPrice = async () => {
      setLoading(true);
      setError(null);

      if (symbol.includes('USD')) {
        setPrice(1.05);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
        );
        if (!response.ok) throw new Error('Ошибка запроса');
        const data = await response.json();
        setPrice(+data.price);
      } catch (err) {
        setError(err.message || 'Ошибка получения курса');
        throw new Error()
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [symbol]);

  return { price, loading, error };
}