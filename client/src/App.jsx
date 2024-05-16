
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'
import ErrorPage from './pages/error-page';
import Contact from './routes/contact';
// import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import FinancialGoals from './classes/FinancialGoals';
import Home from './pages/Home';
import './index.css'
// import { useAuth0 } from "@auth0/auth0-react";
import { AuthenticationGuard } from "./authentication-guard"
import Root from "./routes/root";

 
const router = createBrowserRouter([
  {
    path: '/', 
        element: <Home/>,
  },
 {
    path: '/login',
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: < AuthenticationGuard component={ Root } />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
      {
        path: "/dashboard/profile",
        element: < AuthenticationGuard component={ Profile } />,
      },
      {
        path: "/dashboard/goals",
        element: < AuthenticationGuard component={ FinancialGoals } />,
      }
    ],
  },
  {/* Using path="*"" means "match anything", so this route
      acts like a catch-all for URLs that we don't have explicit
      routes for. */
    path: "*", 
    element: <ErrorPage />
  }
]);

export default function App() {
    // const { isLoading } = useAuth0;
    return (
        <RouterProvider router={router} fallbackElement={<p>Initial load...</p>} />
    )
}

// const router = createBrowserRouter(
//     createRoutesFromElements(
//         <Route
//             path="/"
//             element={<Root />}
//             loader={rootLoader}
//             action={rootAction}
//             errorElement={<ErrorPage />}
//         >
//             <Route errorElement={<ErrorPage />}>
//                 <Route index element={<Index />} />
//                 <Route
//                     path="contacts/:contactId"
//                     element={<Contact />}
//                     loader={contactLoader}
//                     action={contactAction}
//                 />
//                 <Route
//                     path="contacts/:contactId/edit"
//                     element={<EditContact />}
//                     loader={contactLoader}
//                     action={editAction}
//                 />
//                 <Route
//                     path="contacts/:contactId/destroy"
//                     action={destroyAction}
//                 />
//             </Route>
//         </Route>
//     )
// );
