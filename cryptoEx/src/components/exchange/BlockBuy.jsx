import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Grid2 as Grid, TextField } from "@mui/material";
import { useBinance } from "../../hooks/binance.hook";
import { useCbr } from "../../hooks/cbr.hook";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import './orderCurrency.sass';

const BlockBuy = ({
  fetchURL,
  title,
  linkedComponent,
  onCurrencyTypeChange,
  onAmountChange,
  otherComponentAmount,
  otherComponentCurrency
}) => {
  const selectedFiatCurrency = useSelector((state) => state.exchange.selectedFiatCurrency);
  const [selectedValue, setSelectedValue] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(null);
  const [showCurrencies, setShowCurrencies] = useState(null);

  const { price: ownBinancePrice, loading: ownBinanceLoading, error: ownBinanceError } = useBinance(
    currency === 'crypto' ? selectedValue : null
  );
  const { price: ownCbrPrice, loading: ownCbrLoading, error: ownCbrError } = useCbr(
    currency === 'fiat' ? selectedValue : null
  );

  const otherCurrencyType = linkedComponent;
  const { price: otherBinancePrice, loading: otherBinanceLoading, error: otherBinanceError } = useBinance(
    otherCurrencyType === 'crypto' ? otherComponentCurrency : null
  );
  const { price: otherCbrPrice, loading: otherCbrLoading, error: otherCbrError } = useCbr(
    otherCurrencyType === 'fiat' ? otherComponentCurrency : null
  );

  const getCurrency = async (url, currencyTypeToFetch) => {
    try {
      const res = await fetch(`${url}/${currencyTypeToFetch}`, { method: "GET" });
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}/${currencyTypeToFetch}, status: ${res.status}`);
      }
      const data = await res.json();
      setDataArray(data);
      if (!selectedValue && data.length > 0) {
        const firstCurrencyName = data[0].name;
        setSelectedValue(firstCurrencyName);
        if (onAmountChange) {
          const currentAmount = parseFloat(amount) || 0;
          onAmountChange(currentAmount, currency, firstCurrencyName);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (fetchURL) {
      const initialTypeToLoad = currency === 'fiat' ? 'fiatCurrencies' : (currency === 'crypto' ? 'cryptoCurrencies' : 'fiatCurrencies');
      getCurrency(fetchURL, initialTypeToLoad);
    }
  }, [fetchURL]);

  useEffect(() => {
    if (linkedComponent && fetchURL) {
      const ownExpectedType = linkedComponent === 'fiat' ? 'crypto' : 'fiat';
      if (currency !== ownExpectedType) {
        setCurrency(ownExpectedType);
        const endpoint = ownExpectedType === 'fiat' ? 'fiatCurrencies' : 'cryptoCurrencies';
        setSelectedValue(null);
        setDataArray([]);
        getCurrency(fetchURL, endpoint);
        setShowCurrencies(true);
      }
    }
  }, [linkedComponent, fetchURL]);

  useEffect(() => {
    if (selectedValue && currency && onAmountChange) {
      const currentAmount = parseFloat(amount) || 0;
      onAmountChange(currentAmount, currency, selectedValue);
    }
  }, [selectedValue]);


  const handleCryptoClick = (currencyName) => {
    setSelectedValue(currencyName);
    if (onAmountChange) {
      const currentAmount = parseFloat(amount) || 0;
      onAmountChange(currentAmount, currency, currencyName);
    }
  };

  const handleInputChange = (e) => {
    const newAmountStr = e.target.value;
    setAmount(newAmountStr);
    const newAmountNum = parseFloat(newAmountStr);
    if (onAmountChange && !isNaN(newAmountNum)) {
      onAmountChange(newAmountNum, currency, selectedValue);
    } else if (onAmountChange && newAmountStr === "") {
      onAmountChange(0, currency, selectedValue);
    }
  };

  useEffect(() => {
    if (
      otherComponentAmount === null ||
      otherComponentCurrency === null ||
      selectedValue === null ||
      currency === null ||
      linkedComponent === null
    ) {
      setAmount('');
      return;
    }

    if (Number(otherComponentAmount) === 0) {
      setAmount('0');
      return;
    }


    let amountInUSD;

    if (otherCurrencyType === 'crypto') {
      if (otherBinancePrice === null || otherBinanceLoading) return;
      if (otherBinanceError) { console.error("Error getting other binance price:", otherBinanceError); return; }
      amountInUSD = Number(otherComponentAmount) * otherBinancePrice;
    } else {
      if (otherCbrPrice === null || otherCbrLoading) return;
      if (otherCbrError) { console.error("Error getting other CBR price:", otherCbrError); return; }
      amountInUSD = Number(otherComponentAmount) / otherCbrPrice;
    }

    if (isNaN(amountInUSD)) {
      setAmount('');
      return;
    }

    let finalAmount;
    if (currency === 'crypto') {
      if (ownBinancePrice === null || ownBinanceLoading) return;
      if (ownBinanceError) { console.error("Error getting own binance price:", ownBinanceError); return; }
      finalAmount = amountInUSD / ownBinancePrice;
    } else {
      if (ownCbrPrice === null || ownCbrLoading) return;
      if (ownCbrError) { console.error("Error getting own CBR price:", ownCbrError); return; }
      finalAmount = amountInUSD * ownCbrPrice;
    }

    if (!isNaN(finalAmount)) {
      const roundedAmount = parseFloat(finalAmount.toFixed(currency === 'crypto' ? 8 : 2));
      setAmount(String(roundedAmount));
    } else {
      setAmount('');
    }

  }, [
    otherComponentAmount,
    otherComponentCurrency,
    otherCurrencyType,
    selectedValue,
    currency,
    ownBinancePrice,
    ownCbrPrice,
    otherBinancePrice,
    otherCbrPrice,
    ownBinanceLoading, ownCbrLoading, otherBinanceLoading, otherCbrLoading,
    ownBinanceError, ownCbrError, otherBinanceError, otherCbrError
  ]);

  const handleCurrencyTypeChange = (type) => {
    if (currency === type) return;

    setSelectedValue(null);
    setDataArray([]);
    setAmount('');

    setCurrency(type);
    const endpoint = type === 'fiat' ? 'fiatCurrencies' : 'cryptoCurrencies';
    getCurrency(fetchURL, endpoint);
    setShowCurrencies(true);

    if (onCurrencyTypeChange) {
      onCurrencyTypeChange(type);
    }
  };

  const placeholderText = currency === 'fiat' && ownCbrPrice ?
    `1 USD = ${ownCbrPrice.toFixed(2)} ${selectedValue || ''}` :
    currency === 'crypto' && ownBinancePrice ?
      `1 ${selectedValue || ''} = ${ownBinancePrice.toFixed(4)} USD` :
      'Выберите валюту';


  const currenciesWithKeys = dataArray.map(value => ({ ...value, id: value.name }));

  return (
    <Grid className="exchange-order" size={{ xs: 12, lg: 5 }}>
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
          {currency && (<motion.div
            className={showCurrencies ? "exchange-order__list exchange-order__list_active" : "exchange-order__list"}
            animate={{ height: showCurrencies ? "auto" : 0, opacity: showCurrencies ? 1 : 0, overflow: 'hidden' }}
            initial={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <h3>Выберите валюту</h3>
            <ul>
              {currenciesWithKeys.map(({ name, id }) => (
                <motion.li
                  key={id}
                  initial={false}
                  animate={{
                    backgroundColor: selectedValue === name ? "rgba(255,128,0,0.85)" : "rgba(255,128,0,0.35)",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    backgroundColor: selectedValue === name ?
                      "rgba(255,128,0,0.85)" :
                      "rgba(255,128,0,0.5)",
                  }}
                  className={"exchange-order__item"}
                  onClick={() => handleCryptoClick(name)}
                  aria-label={name}>
                  <img className="exchange-order__icon" src={`/currencies/${name}.svg`} alt={name} />
                  {name}
                </motion.li>
              ))}
            </ul>
          </motion.div>)}
          <TextField
            type="number"
            variant="standard"
            className="exchange-order__amount"
            onWheel={(e) => e.target.blur()}
            name="amount"
            label={placeholderText}
            autoComplete="off"
            value={amount}
            disabled={!selectedValue}
            InputProps={{
              inputProps: {
                min: 0
              }
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              }
            }}
            sx={{ maxWidth: "150px", marginTop: "10px" }}
            onChange={handleInputChange} />
        </div>
      </div>
    </Grid>
  );
};

BlockBuy.propTypes = {
  fetchURL: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  linkedComponent: PropTypes.oneOf(['fiat', 'crypto']),
  onCurrencyTypeChange: PropTypes.func,
  onAmountChange: PropTypes.func,
  otherComponentAmount: PropTypes.number,
  otherComponentCurrency: PropTypes.string
};

export default BlockBuy;