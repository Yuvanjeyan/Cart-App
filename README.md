# Client README

React frontend for the Shopping Cart Application.

## Live App

- Frontend: `https://cartapplicationproj3.netlify.app/`
- Backend API: `https://shoppingcart-be.onrender.com/`

## What This Client Includes

- Product listing and search
- Category and price filtering
- Product details and reviews
- Wishlist for signed-in users
- Cart and checkout flow
- Razorpay payment handoff
- User dashboard for profile, orders, and wishlist
- Admin dashboard for product and order management

## Stack

- React 18
- React Router
- Axios
- Ant Design
- React Hot Toast
- React Icons
- Moment.js

## Project Structure

```text
src/
  components/   reusable UI pieces
  context/      auth and cart state
  hooks/        custom hooks
  pages/        route-level screens
  utils/        API and helper functions
```

## Environment Variables

Create `client/.env`:

```env
REACT_APP_API=https://shoppingcart-be.onrender.com/
GENERATE_SOURCEMAP=false
```

## Run Locally

```bash
cd client
npm install
npm start
```

The app runs on `http://localhost:3000`.

## Production Build

```bash
cd client
npm run build
```

## Important Frontend Flows

- Browse products from `/shop`
- Add to cart or wishlist
- Complete checkout from `/checkout`
- View orders in `/dashboard/user/orders`
- Admin manages products from `/dashboard/admin/products`
- Admin manages orders from `/dashboard/admin/orders`

## Notes

- API requests use `REACT_APP_API` as the backend root.
- Product reviews are allowed only after a delivered purchase.
- Wishlist is available from the top navigation for signed-in users.
