import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Menu from "./components/nav/Menu";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCategory from "./pages/admin/Category";
import AdminProduct from "./pages/admin/Product";
import AdminProducts from "./pages/admin/Products";
import AdminProductUpdate from "./pages/admin/ProductUpdate";
import UserOrders from "./pages/user/Orders";
import UserWishlist from "./pages/user/Wishlist";
import UserProfile from "./pages/user/Profile";
import Shop from "./pages/Shop";
import Search from "./pages/Search";
import ProductView from "./pages/ProductView";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import CategoriesList from "./pages/CategoriesList";
import CategoryView from "./pages/CategoryView";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import AdminOrders from "./pages/admin/Orders";

const PageNotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      404 | Page not found
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/category/:slug" element={<CategoryView />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:slug" element={<ProductView />} />
        <Route path="/checkout" element={<PrivateRoute />}>
          <Route index element={<Checkout />} />
        </Route>
        <Route path="/checkout/success/:orderId" element={<PrivateRoute />}>
          <Route index element={<CheckoutSuccess />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<UserProfile />} />
          <Route path="user/orders" element={<UserOrders />} />
          <Route path="user/wishlist" element={<UserWishlist />} />
        </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/category" element={<AdminCategory />} />
          <Route path="admin/product" element={<AdminProduct />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route
            path="admin/product/update/:slug"
            element={<AdminProductUpdate />}
          />
          <Route path="admin/orders" element={<AdminOrders />} />
        </Route>
        <Route path="*" element={<PageNotFound />} replace />
      </Routes>
    </BrowserRouter>
  );
}
