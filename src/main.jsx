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
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
