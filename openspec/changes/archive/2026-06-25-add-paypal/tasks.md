## 1. Backend Integration

- [ ] 1.1 Install @paypal/checkout-server-sdk dependency
- [ ] 1.2 Create PayPal service (create order, capture order)
- [ ] 1.3 Create POST /payments/paypal/create-order endpoint
- [ ] 1.4 Create POST /payments/paypal/capture-order endpoint

## 2. Webhooks

- [ ] 2.1 Create webhook endpoint POST /payments/paypal/webhook
- [ ] 2.2 Implement signature verification
- [ ] 2.3 Handle PAYMENT.CAPTURE.COMPLETED event

## 3. Frontend

- [ ] 3.1 Add PayPal button component to checkout
- [ ] 3.2 Implement client-side approval flow

## 4. PCI Compliance

- [ ] 4.1 Verify no card details are logged
- [ ] 4.2 Verify webhook signature verification
- [ ] 4.3 Verify only payment reference ID stored

## 5. Tests

- [ ] 5.1 Test PayPal order creation
- [ ] 5.2 Test PayPal capture flow
- [ ] 5.3 Test webhook signature verification
- [ ] 5.4 Test failed payment scenarios
