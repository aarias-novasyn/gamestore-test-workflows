# payments Specification

## Purpose
TBD - created by archiving change add-paypal. Update Purpose after archive.
## Requirements
### Requirement: PayPal Payment Method
Users SHALL be able to pay using PayPal during checkout.

#### Scenario: Successful PayPal payment
- GIVEN a user with items in cart
- WHEN the user completes checkout with valid PayPal payment
- THEN the order status becomes "PAID"
- AND a confirmation email is sent
- AND the cart is cleared
- AND a PayPal capture ID is stored as payment reference

#### Scenario: Failed PayPal payment
- GIVEN invalid PayPal payment details
- WHEN PayPal payment is attempted
- THEN error message "Payment failed: [razon]" is shown
- AND cart remains unchanged
- AND order status is not updated

#### Scenario: Insufficient stock during checkout
- GIVEN a product with stock = 1
- WHEN user tries to buy more than available via PayPal
- THEN payment is rejected
- AND error message "Product out of stock" is shown

