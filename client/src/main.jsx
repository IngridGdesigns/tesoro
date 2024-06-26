// eslint-disable-next-line no-unused-vars
import React, { createRoot } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';



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


