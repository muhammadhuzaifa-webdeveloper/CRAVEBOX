# CraveBox

Food ordering + billing (POS) app. **React + Vite** frontend, **Express + MongoDB** backend, JWT login, two roles: **admin** and **client**.

## Flow

1. `/` Landing page
2. `/dashboard` Dashboard (anyone can browse the menu and fill a cart)
3. `/login` / `/signup` (required when a client places an order, and for admin tools)

Login has an **Admin / Client** option. Signup always creates a client. The admin account is created automatically on first server start.

## Roles

| | Guest | Client | Admin |
|---|---|---|---|
| Dashboard, Home, Menu, Cart | yes | yes | yes |
| Add to cart (+ icon) | yes | yes | yes (POS billing) |
| Place order / checkout | login required | yes | yes (POS bill, discount, print) |
| My Orders / Orders | - | own orders | all orders, change status, delete |
| Delete menu item (trash icon), Add Item | - | - | yes |
| Customers, Report | - | - | yes |
| Setting (profile, password) | - | yes | yes |

## Run locally

Requirements: Node 18+ and MongoDB (local or Atlas).

```bash
npm run setup                 # installs frontend + server dependencies
cp server/.env.example server/.env   # set MONGO_URI and JWT_SECRET
npm run dev:all               # frontend http://localhost:5173 + API http://localhost:5000
```

The Vite dev server proxies `/api` to the backend, so no CORS or port settings are needed.

On first start the server creates:
- Admin: `admin@cravebox.com` / `Admin@12345` (change in `server/.env` before first run, or in Setting afterwards)
- The default menu items

## Deploy

Set `VITE_API_URL` to your API URL (for example `https://api.example.com/api`) when building the frontend, and set `CLIENT_URL` in `server/.env` to your site URL.

## API

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | public (login accepts `role`) |
| GET / PUT | `/api/auth/me`, `/api/auth/profile` | logged in |
| GET | `/api/products`, `/api/products/:id` | public |
| POST / PUT / DELETE | `/api/products` | admin |
| POST | `/api/orders` | client (online order) or admin (POS bill) |
| GET | `/api/orders/mine` | logged in |
| GET / PATCH / DELETE | `/api/orders`, `/api/orders/:id/status` | admin |
| GET / POST / PUT | `/api/customers` | admin |
