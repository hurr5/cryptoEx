/**
 * Service for handling payment-related API calls
 */
export default class PaymentService {
    constructor(baseUrl = 'http://localhost:8000/api') {
      this.baseUrl = baseUrl;
    }
  
    /**
     * Get payment details for a specific currency
     * @param {string} currencyCode - The currency code (e.g., "BTC", "USD")
     * @param {string} type - The type of currency ("fiat" or "crypto")
     * @returns {Promise<Object>} - Payment details object
     */
    async getPaymentDetails(currencyCode, type) {
      try {
        const response = await fetch(`${this.baseUrl}/payment-details/?currency_code=${currencyCode}&type=${type}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch payment details: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return the first matching payment detail or null if none found
        return data.length > 0 ? data[0] : null;
      } catch (error) {
        console.error("Error fetching payment details:", error);
        throw error;
      }
    }
  
    /**
     * Create a new order
     * @param {Object} orderData - Order data to be submitted
     * @returns {Promise<Object>} - Created order object
     */
    async createOrder(orderData) {
      try {
        const response = await fetch(`${this.baseUrl}/orders/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
        
        const responseText = await response.text();
        let responseData;
        
        try {
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          throw new Error("Server response is not valid JSON");
        }
  
        if (!response.ok) {
          throw new Error(responseData.message || responseData.detail || 'Failed to create order');
        }
        
        return responseData;
      } catch (error) {
        console.error("Order creation error:", error);
        throw error;
      }
    }
  
    /**
     * Get order details by ID
     * @param {string|number} orderId - The ID of the order to fetch
     * @returns {Promise<Object>} - Order details
     */
    async getOrder(orderId) {
      try {
        const response = await fetch(`${this.baseUrl}/orders/${orderId}/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
      }
    }
  }