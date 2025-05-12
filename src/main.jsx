import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './pages/homepage.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import HomeLogin from './pages/homeLogin.jsx';
import UserDetail from './pages/userDetail.jsx';
import AppointmentPage from './pages/appointmentPage.jsx';
import ReceptionistDashboard from './pages/receptionistDashboard.jsx';
import DoctorDashboard from './pages/doctorDashboard.jsx';
import BlogPage from './pages/blogPage.jsx';
import BlogDetailPage from './pages/blogDetailPage.jsx';
import AdminDashboard from './pages/adminDashboard.jsx';
import ShopPage from './pages/shop';
import ProductDetail from './pages/productDetail.jsx';
import CheckoutPage from './pages/checkout.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/homepage",
    element: <HomePage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/homeLogin",
    element: <HomeLogin />
  },
  {
    path: "/userDetail",
    element: <UserDetail />
  },
  {
    path: "/appointment",
    element: <AppointmentPage />
  },
  {
    path: "/receptionist-dashboard",
    element: <ReceptionistDashboard />
  },
  {
    path: "/doctor-dashboard",
    element: <DoctorDashboard />
  },
  {
    path: "/blog",
    element: <BlogPage />
  },
  {
    path: "/blog/detail/:id",
    element: <BlogDetailPage />
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />
  },
  {
    path: '/shop',
    element: <ShopPage />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
