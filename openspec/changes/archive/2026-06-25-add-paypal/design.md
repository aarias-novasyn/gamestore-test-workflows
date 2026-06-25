# Design: PayPal Integration

## Context

Add PayPal as an alternative payment method to the existing credit card flow.

## Goals / Non-Goals

**Goals:**
- Process payments via PayPal REST API
- Handle PayPal webhook events (PAYMENT.CAPTURE.COMPLETED, etc.)
- Store PayPal payment reference ID

**Non-Goals:**
- PayPal Payouts (sending money to users)
- PayPal Credit/Venmo

## Decisions

1. **SDK**: Use `@paypal/checkout-server-sdk` (official PayPal Node.js SDK)
2. **Flow**: Server-side order creation → client-side approval → server-side capture
3. **Webhooks**: Verify PayPal webhook signatures using `verifyWebhookSignature`
4. **Storage**: Store only `paypal_order_id` and `paypal_capture_id` in orders table

## Risks / Trade-offs

- PayPal API downtime → Show error message, retry mechanism
- Webhook delivery delays → Polling fallback for order status
- Currency conversion → Use PayPal's built-in conversion

## Open Questions

- Should we support PayPal subscriptions/recurring payments?
