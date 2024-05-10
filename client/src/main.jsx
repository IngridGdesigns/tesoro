import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard, {dashboardLoader} from './routes/Dashboard';
// import App from './App.jsx'
import './index.css'
import ErrorPage from './pages/error-page';
import Contact from './routes/contact';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import FinancialGoals from './classes/FinancialGoals';


const router = createBrowserRouter([
  {
    path: '/', 
    element: <Landing />,
  },
 {
    path: '/login',
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    loader: dashboardLoader,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
      {
        path: "/dashboard/goals",
        element: <FinancialGoals />
      }
    ],
  },
  {
    path: "*", 
    errorElement: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* // <App /> */}
  </React.StrictMode>,
)
