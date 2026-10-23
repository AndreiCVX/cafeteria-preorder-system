# Test checklist (project spec, section 21)

Record Pass/Fail and the date for each. Screenshot failures and fixes for your GitHub evidence.

## Authentication
| # | Test | Expected | Result |
|---|---|---|---|
| A1 | Login with correct credentials (each role) | Redirected to role's page | |
| A2 | Login with wrong password | "Invalid email or password." | |
| A3 | Login with empty fields | Required-field errors | |
| A4 | Logout | Session ends; back button + protected URL redirects to login | |
| A5 | Visit `/cart`, `/staff/orders`, `/admin/users` while logged out | Redirected to login | |
| A6 | Login with a deactivated account | Rejected | |

## Forms
| # | Test | Expected | Result |
|---|---|---|---|
| F1 | Register with valid data | Account created, redirected to login | |
| F2 | Register with empty fields | Errors shown | |
| F3 | Register with invalid email / short password / mismatched confirm | Specific errors | |
| F4 | Register with an existing email | "Already registered" | |
| F5 | Add to cart with quantity 0, -1, 99, "abc" | Rejected | |
| F6 | Place order with no pickup time | Error | |
| F7 | Place order with pickup in the past / outside hours | Error | |
| F8 | Place order with notes over 255 chars | Error | |
| F9 | Add menu item with empty name / price 0 / negative price / text price | Errors | |

## Database (CRUD)
| # | Test | Expected | Result |
|---|---|---|---|
| D1 | Register, then check `users` in phpMyAdmin | Row exists, `password_hash` is not plain text | |
| D2 | Place an order, restart server, check order history | Order still present | |
| D3 | Create / edit / delete a menu item | Reflected in customer menu | |
| D4 | Delete a menu item that was ordered | Friendly error, no crash | |
| D5 | Update order status through each valid step | Saved and visible to customer | |

## Access control (try every role)
| # | Test | Expected | Result |
|---|---|---|---|
| R1 | Customer opens `/staff/orders`, `/staff/menu`, `/admin/users`, `/admin/reports` by typing URL | 403 page | |
| R2 | Staff opens `/admin/users` | 403 page | |
| R3 | Customer sends POST to `/staff/orders/1/status` (e.g. Thunder Client) | 403 | |
| R4 | Customer cancels another customer's order (`POST /orders/<other id>/cancel`) | "Only your own pending orders…" | |
| R5 | Customer cancels an order that is already "preparing" | Rejected | |
| R6 | Staff sets invalid transition (completed → pending) | Rejected | |
| R7 | Admin changes own role / deactivates self | Rejected | |
| R8 | Register form cannot create admin/staff | New user is always customer | |
