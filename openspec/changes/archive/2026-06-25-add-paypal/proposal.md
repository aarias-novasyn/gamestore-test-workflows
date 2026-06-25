# Add PayPal Payment Method

## Why

Users currently can only pay via credit card. Adding PayPal expands payment options and increases conversion.

## What Changes

- Integrate PayPal REST SDK for payment processing
- Add PayPal as a payment option during checkout
- Handle PayPal webhooks for payment confirmation
- Add PayPal payment reference ID to orders

## Capabilities

### New Capabilities
- `payments` - PayPal payment method

### Modified Capabilities
- `payments` - Existing payments spec needs new requirement for PayPal

## Impact

- Payments module: new PayPal integration service
- Backend: new webhook endpoint for PayPal IPN
- Frontend: PayPal button component on checkout page
- Environment: PayPal API credentials (client ID, secret)
