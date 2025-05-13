import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Grid2 as Grid, TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useBinance } from "../../hooks/binance.hook";
import './orderCurrency.sass';

const OrderCurrency = ({ fetchURL, title, linkedComponent, onCurrencyTypeChange, selectedFiatCurrency }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const [amount, setAmount] = useState(1);
  const [currency, setCurrency] = useState(null);
  const [showCurrencies, setShowCurrencies] = useState(null);
  const [currentSymbol, setCurrentSymbol] = useState(null);

  const { price: binancePrice, loading, error } = useBinance(
    currency === 'crypto' ? selectedValue : null,
    currency === 'fiat' ? selectedValue : selectedFiatCurrency
  );

  const getCurrency = async (url, currencyType) => {
    try {
      const res = await fetch(`${url}/${currencyType}`, { method: "GET" });
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }
      const data = await res.json();
      setDataArray(data);
    } catch (err) {
      console.error(err);
    }
  }

  const fetchUsdToRub = async () => {
    const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
    const data = await response.json();
    return parseFloat(data.Valute.USD.Value);
  };

  useEffect(() => {
    if (fetchURL) {
      getCurrency(fetchURL, 'fiatCurrencies');
      fetchUsdToRub();
    }
  }, [fetchURL]);

  useEffect(() => {
    if (linkedComponent) {
      const oppositeType = linkedComponent === 'fiat' ? 'crypto' : 'fiat';

      if (currency !== oppositeType) {
        setCurrency(oppositeType);
        const endpoint = oppositeType === 'fiat' ? 'fiatCurrencies' : 'cryptoCurrencies';
        getCurrency(fetchURL, endpoint);
        setShowCurrencies(true);
      }
    }
  }, [linkedComponent, fetchURL, currency]);

  const handleCryptoClick = (currency, symbol) => {
    setSelectedValue(currency);
    setCurrentSymbol(symbol);
  };

  const handleInputChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);
  }

  const handleCurrencyTypeChange = (type) => {
    setCurrency(type);
    getCurrency(fetchURL, type === 'fiat' ? 'fiatCurrencies' : 'cryptoCurrencies');
    setShowCurrencies(true);

    if (onCurrencyTypeChange) {
      onCurrencyTypeChange(type);
    }
  };

  const totalPrice = binancePrice ? (binancePrice * amount).toFixed(2) : 'Select currency';

  const currenciesWithKeys = dataArray.map(value => ({ ...value, id: uuidv4() }));

  return (
    <Grid className="exchange-order" size={{ xs: 5 }}>
      <h2>{title}</h2>
      <div className="exchange-order__select">
        <motion.button
          className={`exchange-order__select_type ${currency === 'fiat' ? 'exchange-order__select_type-active' : ''}`}
          onClick={() => handleCurrencyTypeChange('fiat')}>
          Fiat
        </motion.button>
        <motion.button
          className={`exchange-order__select_type ${currency === 'crypto' ? 'exchange-order__select_type-active' : ''}`}
          onClick={() => handleCurrencyTypeChange('crypto')}>
          Crypto
        </motion.button>
      </div>
      <div className="exchange-order__currency" style={{ margin: '20px 0' }}>
        <div className="exchange-order__crypto">
          <motion.div
            className={showCurrencies ? "exchange-order__list exchange-order__list_active" : "exchange-order__list"}
            animate={{ height: showCurrencies ? "20rem" : 0, opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <h3>Select value</h3>
            <ul>
              {currenciesWithKeys.map(({ name, id, symbol }) => (
                <motion.li
                  key={id}
                  initial={false}
                  animate={{
                    backgroundColor: selectedValue === name ? "rgba(255,128,0,0.85)" : "rgba(255,128,0,0.35)",
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    backgroundColor: { when: "beforeChildren" }
                  }}
                  whileHover={{
                    backgroundColor: selectedValue === name ?
                      "rgba(255,128,0,0.85)" :
                      "rgba(255,128,0,0.5)",
                  }}
                  className={"exchange-order__item"}
                  onClick={() => handleCryptoClick(name, symbol)}
                  aria-label={name}>
                  {name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <TextField
            type="number"
            variant="standard"
            className="exchange-order__amount"
            onWheel={(e) => e.target.blur()}
            name="amount"
            label="Enter amount"
            autoComplete="off"
            placeholder={amount.toString()}
            slotProps={{
              inputLabel: {
                shrink: true,
              }
            }}
            sx={{ maxWidth: "150px", marginTop: "10px" }}
            onChange={handleInputChange} />
          <div className="exchange-order__price">
            Price: {currentSymbol} <b>{loading ? 'Loading...' : error ? 'Error' : totalPrice}</b>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default OrderCurrency;