import { Button, ButtonGroup, Container, Grid2 as Grid } from "@mui/material";
import './order.sass';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 
import SwapIcon from "../common/SwapIcon";


const Order = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleCancel = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}/cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      navigate('/');
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("Starting order loading with ID:", orderId);
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8000/api/orders/${orderId}/`);
        console.log("Received response, status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Error loading order: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Retrieved data:", data);
        
        setOrderData(data);
      } catch (error) {
        console.error("Request error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    const date = new Date();
    const formattedDate = date.toLocaleString("ru-RU", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setCurrentDate(formattedDate);
  }, [orderId]);

  if (isLoading) {
    return <div>Loading order data...</div>;
  }

  if (error) {
    return (
      <Container>
        <div className="order__error">
          <h2>Error loading order</h2>
          <p>{error}</p>
          <p>Please check your API connection or try again later</p>
        </div>
      </Container>
    );
  }

  if (!orderData) {
    return (
      <Container>
        <div className="order__error">
          <h2>Order not found</h2>
          <p>Order data was not received</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item size={12} className="order__window order__window_info">
          <div className="order__date">
            <h2>Order №{orderData.client_order_id}</h2>
            <span>{currentDate}</span>
          </div>
          <div className="order__info">
            <h3>Currency order rate:</h3>
            <span>{orderData.rate} {orderData.from_currency} = {orderData.total} {orderData.to_currency}</span>
            <p style={{ marginTop: '0.5rem', color: '#777' }}>Fixed order rate</p>
          </div>
        </Grid>

        <Grid item size={12} className="order__window" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="order__amount" style={{ textAlign: 'center' }}>
            <div className="order__currency">{orderData.from_currency}</div>
            <span className="order__total">{orderData.amount}</span>
          </div>

          <SwapIcon isClickable={false} />

          <div className="order__amount" style={{ textAlign: 'center' }}>
            <div className="order__currency">{orderData.to_currency}</div>
            <span className="order__total">{orderData.total}</span>
          </div>
        </Grid>

        <Grid item size={6} md={6} className="order__transfer_info">
          <h3>Amount to be paid:</h3>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {orderData.amount} {orderData.from_currency}
          </span>

          <h3 style={{ marginTop: '1.5rem' }}>Send payment to:</h3>
          <div style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '8px',
            wordBreak: 'break-word',
            fontWeight: '500',
            fontSize: '1rem'
          }}>
            {orderData.payment_address ? orderData.payment_address : 'Payment address not specified'}
          </div>

          <h4 style={{ marginTop: '1rem' }}>MEMO / TAG (if required):</h4>
          <span>1239875764</span>
        </Grid>

        <Grid item size={6} md={6} className="order__address">
          <h2>Receiving address:</h2>
          <div style={{
            background: '#fafafa',
            padding: '1rem',
            borderRadius: '8px',
            wordBreak: 'break-word',
            fontSize: '1rem'
          }}>
            {orderData.wallet_address ? orderData.wallet_address : 'Payment details not specified'}
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#777' }}>
            (This is the wallet address you provided for receiving funds.)
          </p>
        </Grid>
      </Grid>

      <ButtonGroup disableRipple sx={{
        display: 'flex',
        margin: '50px auto',
        width: '500px',
        height: '60px'
      }}>
        <Button color="error" sx={{ width: '50%', borderRadius: '30px' }} onClick={handleCancel}>
          Cancel
        </Button>
        <Button
        variant="contained"
        sx={{ bgcolor: '#21ba72b3', color: '#fff', width: '50%', borderRadius: '30px' }}
        onClick={() => navigate(`/order-confirmed/${orderId}`)}
      >
        I paid order
      </Button>
      </ButtonGroup>
    </Container>
  );
};

export default Order;