// binance.hook.js
import { useEffect, useState } from 'react';

export function useBinance(symbol, quoteCurrency = 'USDT') {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) {
      setPrice(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Если базовая валюта совпадает с котируемой (например, USDT к USDT)
    if (symbol.toUpperCase() === quoteCurrency.toUpperCase()) {
      setPrice(1.0);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchPrice = async () => {
      setLoading(true);
      setError(null);
      setPrice(null);

      try {
        const pair = `${symbol.toUpperCase()}${quoteCurrency.toUpperCase()}`;
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Ошибка запроса для ${pair}: ${response.status} ${errorData.msg || ''}`);
        }
        const data = await response.json();
        setPrice(parseFloat(data.price));
      } catch (err) {
        console.error(`Binance hook error for ${symbol} to ${quoteCurrency}:`, err);
        setError(err.message || 'Ошибка получения курса Binance');
        setPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [symbol, quoteCurrency]);

  return { price, loading, error };
}