import { Grid2 as Grid, Checkbox, FormControlLabel, TextField, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SwapIcon from "../common/SwapIcon";
import BlockBuy from "./BlockBuy";

import './exchange.sass';

export default function Exchange() {
  const navigate = useNavigate();

  const [firstComponentType, setFirstComponentType] = useState(null);
  const [secondComponentType, setSecondComponentType] = useState(null);
  const [firstAmount, setFirstAmount] = useState(0);
  const [secondAmount, setSecondAmount] = useState(0);
  const [firstCurrency, setFirstCurrency] = useState(null);
  const [secondCurrency, setSecondCurrency] = useState(null);

  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);

  // Функция для удаления конечных нулей после 4-го знака после запятой
  const trimTrailingZeros = (num, fixedDecimalPlaces) => {
    if (typeof num !== 'number') return num; // Ensure it's a number
    if (isNaN(num)) return ''; // Handle NaN

    const formatted = num.toFixed(fixedDecimalPlaces);
    // Remove trailing zeros and a decimal point if all are zeros
    let result = formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
    return result;
  };

  const handleFirstAmountChange = (amount, currency, selectedValue) => {
    setFirstAmount(Number(amount));
    setFirstCurrency(selectedValue);
  };

  const handleSecondAmountChange = (amount, currency, selectedValue) => {
    setSecondAmount(Number(amount));
    setSecondCurrency(selectedValue);
  };

  const handleFirstComponentTypeChange = (type) => {
    setFirstComponentType(type);
    setSecondComponentType(type === 'fiat' ? 'crypto' : 'fiat');
  };

  const handleSecondComponentTypeChange = (type) => {
    setSecondComponentType(type);
    setFirstComponentType(type === 'fiat' ? 'crypto' : 'fiat');
  };

  const handleSwapAction = () => {
    if (!firstComponentType || !secondComponentType) {
      setError("Пожалуйста, выберите типы валют в обоих блоках перед обменом.");
      return;
    }
    setError("");

    const tempType = firstComponentType;
    setFirstComponentType(secondComponentType);
    setSecondComponentType(tempType);

    const tempCurrency = firstCurrency;
    setFirstCurrency(secondCurrency);
    setSecondCurrency(tempCurrency);

    const tempAmount = firstAmount;
    setFirstAmount(secondAmount);
    setSecondAmount(tempAmount);
  };

  const handleSubmitOrder = async () => {
    if (!email || !walletAddress || !agreedToTerms) {
      setError("Пожалуйста, заполните все поля и согласитесь с условиями перед продолжением.");
      return;
    }

    if (firstAmount <= 0 || secondAmount <= 0) {
      setError("Суммы должны быть больше нуля.");
      return;
    }

    if (!firstCurrency || !secondCurrency || !firstComponentType || !secondComponentType) {
      setError("Пожалуйста, выберите валюты и их типы в обоих блоках.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setDebugInfo(null);

      const paymentDetailsResponse = await fetch(`http://localhost:8000/api/payment-details/?currency_code=${firstCurrency}&type=${firstComponentType}`);
      if (!paymentDetailsResponse.ok) {
        throw new Error(`Не удалось получить данные для оплаты: ${paymentDetailsResponse.status}`);
      }

      const paymentDetailsData = await paymentDetailsResponse.json();

      if (!paymentDetailsData || paymentDetailsData.length === 0) {
        throw new Error(`Данные для оплаты ${firstCurrency} недоступны`);
      }

      const paymentDetails = paymentDetailsData[0];

      const orderData = {
        email,
        wallet_address: walletAddress,
        from_currency: firstCurrency,
        to_currency: secondCurrency,
        amount: firstAmount,
        rate: firstAmount !== 0 ? parseFloat((secondAmount / firstAmount).toFixed(8)) : 0,
        total: secondAmount,
        payment_details: paymentDetails.id
      };

      console.log("Sending order data:", orderData);

      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(errorText || "Не удалось создать заказ");
      }

      const responseData = await response.json();
      console.log("Order created successfully with ID:", responseData.id);
      navigate(`/order/${responseData.id}`);
    } catch (err) {
      console.error("Order submission error:", err);
      setError(err.message || "Произошла неизвестная ошибка");
      setDebugInfo({
        error: err.toString(),
        message: err.message,
        firstAmount_at_submit: firstAmount,
        secondAmount_at_submit: secondAmount,
        firstCurrency_at_submit: firstCurrency,
        secondCurrency_at_submit: secondCurrency,
        firstComponentType_at_submit: firstComponentType,
        secondComponentType_at_submit: secondComponentType
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid className="exchange" container>

      <BlockBuy
        fetchURL='http://localhost:3001'
        title="Вы отдаете"
        linkedComponent={secondComponentType}
        onCurrencyTypeChange={handleFirstComponentTypeChange}
        onAmountChange={handleFirstAmountChange}
        otherComponentAmount={Number(secondAmount)}
        otherComponentCurrency={secondCurrency}
      />

      <SwapIcon
        isClickable={true}
        onClick={handleSwapAction}
      />

      <BlockBuy
        fetchURL='http://localhost:3001'
        title="Вы получаете"
        linkedComponent={firstComponentType}
        onCurrencyTypeChange={handleSecondComponentTypeChange}
        onAmountChange={handleSecondAmountChange}
        otherComponentAmount={Number(firstAmount)}
        otherComponentCurrency={firstCurrency}
      />

      <Grid className="exchange-final" size={{ lg: 8, xs: 12 }}>
        <h2>Подтвердить заказ</h2>

        <div className="exchange-final__container">

          <div className="exchange-final__inputs">
            <div className="exchange-final__input">
              <TextField
                type="email"
                name="email"
                label="Введите ваш email"
                color="black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ maxWidth: '25rem', width: '100%' }}
                required
              />
            </div>

            <div className="exchange-final__input">
              <TextField
                type="text"
                name="address"
                label="Введите адрес вашего кошелька"
                color="black"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                sx={{ maxWidth: '25rem', width: '100%' }}
                required
              />
            </div>

            <FormControlLabel
              control={
                <Checkbox
                  required
                  disableRipple
                  disableTouchRipple
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
              }
              label="Согласен с AML/CTF & KYC"
            />
          </div>

          <div className="exchange-final__confirm">
            <h2>Проверьте ваши данные:</h2>

            <div className="exchange-final__currencies">
              <div>
                <span>Вы отдаете:</span>
                <div className="exchange-final__result" style={{ display: 'flex', alignItems: 'center' }}>
                  {firstCurrency && (
                    <img
                      src={`/currencies/${firstCurrency.toUpperCase()}.svg`}
                      alt={firstCurrency}
                      style={{ width: '24px', height: '24px', marginRight: '8px' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span>{trimTrailingZeros(firstAmount, 8)} {firstCurrency || "Не выбрано"}</span>
                </div>
              </div>

              <div>
                <span>Вы получаете:</span>
                <div className="exchange-final__result" style={{ display: 'flex', alignItems: 'center' }}>
                  {secondCurrency && (
                    <img
                      src={`/currencies/${secondCurrency.toUpperCase()}.svg`}
                      alt={secondCurrency}
                      style={{ width: '24px', height: '24px', marginRight: '8px' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span>{trimTrailingZeros(secondAmount, 8)} {secondCurrency || "Не выбрано"}</span>
                </div>
              </div>

              {error && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                  {error}
                </div>
              )}

              {debugInfo && (
                <div style={{ marginTop: '1rem', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <h4>Отладочная информация:</h4>
                  <pre style={{ overflow: 'auto' }}>
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}

              <Button
                className="exchange-final__btn"
                variant="contained"
                color="success"
                disableRipple
                onClick={handleSubmitOrder}
                sx={{ width: '100%', marginTop: '1rem' }}
                disabled={isSubmitting || !agreedToTerms || !email || !walletAddress || firstAmount <= 0 || secondAmount <= 0 || !firstCurrency || !secondCurrency || !firstComponentType || !secondComponentType}
              >
                {isSubmitting ? "Обработка..." : "Перейти к заказу"}
              </Button>

            </div>
          </div>

        </div>
      </Grid>

    </Grid >
  );
}