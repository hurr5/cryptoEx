import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Grid2 as Grid, TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useBinance } from "../../hooks/binance.hook";
import { useCbr } from "../../hooks/cbr.hook";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
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

  const { price: binancePrice } = useBinance(
    currency === 'crypto' ? selectedValue : null,
    currency === 'fiat' ? selectedValue : selectedFiatCurrency
  );

  const { price: cbrPrice } = useCbr(
    currency === 'fiat' ? selectedValue : null
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

  useEffect(() => {
    if (fetchURL) {
      getCurrency(fetchURL, 'fiatCurrencies');
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

  const handleCryptoClick = (currency) => {
    setSelectedValue(currency);
  };

  const handleInputChange = (e) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(newAmount);
    if (onAmountChange) {
      onAmountChange(newAmount, currency, selectedValue);
    }
  }

  useEffect(() => {
    if (otherComponentAmount && selectedValue && binancePrice && cbrPrice) {
      if (currency === 'fiat') {
        const totalInUsd = otherComponentAmount * binancePrice;
        const converted = totalInUsd * cbrPrice;
        setAmount(converted);
      } else {
        const totalInFiat = otherComponentAmount / cbrPrice;
        const converted = totalInFiat / binancePrice;
        setAmount(converted);
      }
    }
  }, [otherComponentAmount, selectedValue, binancePrice, cbrPrice, currency]);

  const handleCurrencyTypeChange = (type) => {
    setCurrency(type);
    getCurrency(fetchURL, type === 'fiat' ? 'fiatCurrencies' : 'cryptoCurrencies');
    setShowCurrencies(true);

    if (onCurrencyTypeChange) {
      onCurrencyTypeChange(type);
    }
  };

  const placeholderText = currency === 'fiat' && cbrPrice ?
    `1 USD = ${cbrPrice.toFixed(2)} ${selectedValue}` :
    binancePrice ?
      `1 ${selectedValue} = ${binancePrice.toFixed(4)} USD` :
      'Select currency first';

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
              {currenciesWithKeys.map(({ name, id }) => (
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
                  onClick={() => handleCryptoClick(name)}
                  aria-label={name}>
                  <img className="exchange-order__icon" src={`/currencies/${name}.svg`} alt={name} />
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
            label={placeholderText}
            autoComplete="off"
            value={amount}
            slotProps={{
              inputLabel: {
                shrink: true,
              }
            }}
            sx={{ maxWidth: "150px", marginTop: "10px" }}
            onChange={handleInputChange} />

          {/* <NumericFormat
            className="exchange-order__amount"
            customInput={TextField}
            label={placeholderText}
            thousandSeparator=" "
            decimalSeparator="."

            variant="standard"
            slotProps={{
              inputLabel: {
                shrink: true,
              }
            }}
            value={amount}
            onChange={handleInputChange}
            sx={{ maxWidth: "150px", marginTop: "10px" }}
          /> */}
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