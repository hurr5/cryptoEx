import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import './order-confirmed.sass';

const OrderConfirmed = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/${orderId}/`);
        if (!response.ok) {
          throw new Error("Failed to load order data");
        }
        const data = await response.json();
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order data. Try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return <Container><div className="order-confirmed__loading">Loading...</div></Container>;
  }

  if (error) {
    return (
      <Container>
        <div className="order-confirmed__error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="order-confirmed">
      <div className="order-confirmed__box">
        <h2>Order №{orderData.client_order_id}</h2>
        <p>Your payment has been received.</p>
        <p>The exchange will process your order soon.</p>
      </div>
    </Container>
  );
};

export default OrderConfirmed;
