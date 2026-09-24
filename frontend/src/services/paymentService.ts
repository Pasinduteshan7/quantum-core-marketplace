import api from './api';

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

export const paymentService = {
  /**
   * Requests a Stripe PaymentIntent from the Spring Boot backend
   * Returns the clientSecret needed by Stripe Elements to confirm the card
   */
  createPaymentIntent: async (orderId: number | string): Promise<PaymentIntentResponse> => {
    const response = await api.post<PaymentIntentResponse>('/payments/create-intent', {
      orderId: Number(orderId)
    });
    return response.data;
  },

  /**
   * Tells the backend to verify the Stripe payment status and mark the order as PROCESSING
   */
  confirmPayment: async (paymentIntentId: string): Promise<PaymentIntentResponse> => {
    const response = await api.post<PaymentIntentResponse>(`/payments/confirm/${paymentIntentId}`);
    return response.data;
  }
};
