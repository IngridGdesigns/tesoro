// import React, { createRoot } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
// import { useRedirectCallback } from "./Auth0ProviderWithNavigate"

const domain = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.Location.origin || redirectUri,
    }}
  >
    <App/>
  </Auth0Provider>
);


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     {/* <RouterProvider router={router} /> */}
//     <BrowserRouter>
//     <Auth0ProviderWithNavigate>
//       <App />
//       </Auth0ProviderWithNavigate>
//     </BrowserRouter>
//   </React.StrictMode>,
// )
