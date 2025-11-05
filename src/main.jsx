import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.jsx'
import Signup from './pages/signUp.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import ProviderDetails from './pages/ProviderDetails.jsx';
import Bookings from './pages/Bookings.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/edit.jsx';
import HelpSupport from './pages/HelpSupport.jsx';

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [
    { index: true, element: <Home /> },
    { path: "provider/:id", element: <ProviderDetails /> },
    { path: "bookings", element: <Bookings /> },
    { path: "Help", element: <HelpSupport /> },
    { path: "edit", element: <EditProfile /> },
    { path: "profile", element: <Profile /> },
    { path: "signup", element: <Signup /> },
    { path: "login", element: <Login /> }
  ]
}])
createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)
