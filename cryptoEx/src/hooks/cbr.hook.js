// cbr.hook.js
import { useEffect, useState } from 'react';

export function useCbr(targetCurrency) {
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Вспомогательная функция для получения курса с обработкой номинала
  const fetchCurrencyRateFromCBR = async (symbol) => {
    const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
    if (!response.ok) {
      throw new Error(`CBR daily_json.js request failed: ${response.status}`);
    }
    const data = await response.json();
    const valute = data.Valute[symbol.toUpperCase()];

    if (valute) {
      return valute.Value / valute.Nominal; // Курс за одну единицу валюты к рублю
    }
    return null;
  };

  useEffect(() => {
    if (!targetCurrency) {
      setConvertedPrice(null);
      setLoading(false);
      setError(null);
      return;
    }

    const convertUsdToTarget = async () => {
      setLoading(true);
      setError(null);
      setConvertedPrice(null);

      try {
        // Курс USD к RUB (сколько рублей за 1 USD)
        const usdToRubRate = await fetchCurrencyRateFromCBR("USD");

        if (!usdToRubRate) {
          throw new Error("Невозможно получить курс USD к RUB от ЦБ РФ");
        }

        if (targetCurrency.toUpperCase() === "RUB") {
          setConvertedPrice(usdToRubRate);
        } else {
          const targetToRubRate = await fetchCurrencyRateFromCBR(targetCurrency);
          if (!targetToRubRate) {
            throw new Error(`Невозможно получить курс ${targetCurrency} к RUB от ЦБ РФ`);
          }
          const rate = usdToRubRate / targetToRubRate;
          setConvertedPrice(rate);
        }
      } catch (err) {
        console.error(`CBR hook error for ${targetCurrency}:`, err);
        setError(err.message);
        setConvertedPrice(null);
      } finally {
        setLoading(false);
      }
    };

    convertUsdToTarget();
  }, [targetCurrency]);

  return { price: convertedPrice, loading, error };
}