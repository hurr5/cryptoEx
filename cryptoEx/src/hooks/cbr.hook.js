import { useEffect, useState } from 'react';

export function useCbr(targetCurrency) {
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrencyRate = async (symbol) => {
    const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
    const data = await response.json();
    const valute = data.Valute[symbol];

    if (valute) {
      const realRate = valute.Value / valute.Nominal;
      console.log(`${symbol}: Value = ${valute.Value}, Nominal = ${valute.Nominal}, Rate per unit = ${realRate}`);
      return realRate;
    }

    return null;
  };

  useEffect(() => {
    if (!targetCurrency) return;

    const convertUsdToTarget = async () => {
      setLoading(true);
      setError(null);

      try {
        const [usdToRub, targetToRub] = await Promise.all([
          fetchCurrencyRate("USD"),
          fetchCurrencyRate(targetCurrency)
        ]);

        if (targetCurrency === "RUB") {
          fetchCurrencyRate("USD").then((rate) => {
            setConvertedPrice(rate);
          }
          );
          setLoading(false);
          return;
        }

        if (!usdToRub || !targetToRub) {
          throw new Error("Невозможно получить курс валют");
        }

        const rate = usdToRub / targetToRub;
        setConvertedPrice(rate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    convertUsdToTarget();
  }, [targetCurrency]);

  return { price: convertedPrice, loading, error };
}