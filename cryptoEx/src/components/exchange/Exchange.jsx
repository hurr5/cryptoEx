import { Grid2 as Grid, Checkbox, FormControlLabel, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SwapIcon from "../common/SwapIcon";
import BlockBuy from "./BlockBuy";
import BlockSell from "./BlockSell";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);

  const handleFirstAmountChange = (amount, currency, selectedValue) => {
    setFirstAmount(amount);
    setFirstCurrency(selectedValue);
  };

  const handleSecondAmountChange = (amount, currency, selectedValue) => {
    setSecondAmount(amount);
    setSecondCurrency(selectedValue);
  };

  const handleFirstComponentChange = (type) => {
    setFirstComponentType(type);
    setSecondComponentType(type === 'fiat' ? 'crypto' : 'fiat');
  };

  const handleSecondComponentChange = (type) => {
    setSecondComponentType(type);
    setFirstComponentType(type === 'fiat' ? 'crypto' : 'fiat');
  };

  const handleSubmitOrder = async () => {
    if (!email || !walletAddress || !firstCurrency || !secondCurrency || !firstAmount || !secondAmount) {
      setError("Please fill in all fields before proceeding.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setDebugInfo(null);

      const paymentDetailsResponse = await fetch(`http://localhost:8000/api/payment-details/?currency_code=${firstCurrency}&type=${firstComponentType}`);
      if (!paymentDetailsResponse.ok) {
        throw new Error(`Failed to fetch payment details: ${paymentDetailsResponse.status}`);
      }
      
      const paymentDetailsData = await paymentDetailsResponse.json();
      
      if (!paymentDetailsData || paymentDetailsData.length === 0) {
        throw new Error(`Payment details for ${firstCurrency} are not available`);
      }

      const paymentDetails = paymentDetailsData[0];

      const orderData = {
        email,
        wallet_address: walletAddress,
        from_currency: firstCurrency,
        to_currency: secondCurrency,
        amount: firstAmount,
        rate: parseFloat((secondAmount / firstAmount).toFixed(8)),
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
        throw new Error(errorText || "Failed to create order");
      }
      
      const responseData = await response.json();
      console.log("Order created successfully with ID:", responseData.id);
      navigate(`/order/${responseData.id}`);
    } catch (err) {
      console.error("Order submission error:", err);
      setError(err.message || "Unknown error occurred");
      setDebugInfo({
        error: err.toString(),
        message: err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid className="exchange" container>

      <BlockSell
        fetchURL='http://localhost:3001'
        title="You receive"
        linkedComponent={firstComponentType}
        onCurrencyTypeChange={handleSecondComponentChange}
        onAmountChange={handleSecondAmountChange}
        otherComponentAmount={firstAmount}
        otherComponentCurrency={firstCurrency}
        isFirstComponent={false}
      />

      <SwapIcon
        isClickable={true}
        onClick={() => {
          const temp = firstComponentType;
          handleFirstComponentChange(secondComponentType);
          handleSecondComponentChange(temp);
        }}
      />

      <BlockBuy
        fetchURL='http://localhost:3001'
        title="You give"
        linkedComponent={secondComponentType}
        onCurrencyTypeChange={handleFirstComponentChange}
        onAmountChange={handleFirstAmountChange}
        otherComponentAmount={secondAmount}
        otherComponentCurrency={secondCurrency}
        isFirstComponent={true}
      />

      <Grid className="exchange-final" lg={12} xs={12}>
        <h2>Confirm order</h2>

        <div className="exchange-final__container">

          <div className="exchange-final__inputs">
            <div className="exchange-final__input">
              <TextField
                type="email"
                name="email"
                label="Enter your email"
                color="black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ maxWidth: '25rem', width: '100%' }}
              />
            </div>

            <div className="exchange-final__input">
              <TextField
                type="text"
                name="address"
                label="Enter your wallet address"
                color="black"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                sx={{ maxWidth: '25rem', width: '100%' }}
              />
            </div>

            <FormControlLabel
              control={<Checkbox required disableRipple disableTouchRipple />}
              label="Agree with AML/CTF & KYC"
            />
          </div>

          <div className="exchange-final__confirm">
            <h2>Check your data:</h2>

            <div className="exchange-final__currencies">
              <div>
                <span>You give:</span>
                <div className="exchange-final__result">
                  <span>{firstCurrency || "Not selected"}</span>
                </div>
              </div>

              <div>
                <span>You receive:</span>
                <div className="exchange-final__result">
                  <span>{secondCurrency || "Not selected"}</span>
                </div>
              </div>

              {error && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                  {error}
                </div>
              )}
              
              {debugInfo && (
                <div style={{ marginTop: '1rem', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <h4>Debug Information:</h4>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Proceed to order"}
              </Button>

            </div>
          </div>

        </div>
      </Grid>

    </Grid>
  );
}