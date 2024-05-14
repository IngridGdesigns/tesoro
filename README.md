# tesoro

## A Financial Management System

A personal finance management that will allows users to track their income, expenses, savings, providing insights into their financial health, and helping them make informed financial decisions.

Features:
- Add goals


## Tools and Technologies

- Database: [Postgresql (postgesql app)](https://postgresapp.com/),
- Authorization/authentication: [Auth0](https://auth0.com/?utm_content=usbranded-auth0-auth0homepage&utm_source=google&utm_campaign=amer_namer_can_all_ciam-all_dg-ao_auth0_display_google_static-image_retarget_SitewideRemarketing_utm2&utm_medium=cpc&utm_id=aNK4z000000UCTUGA4&gad_source=1&gclid=EAIaIQobChMI6su00OWChgMVARitBh3Oewg1EAAYASAAEgIWafD_BwE)
- Backend: [ExpressJS](https://expressjs.com/en/starter/installing.html),
- Frontend: [Vite+React](https://vitejs.dev/guide/), [React Hook Form](https://react-hook-form.com/get-started), [React Router](https://reactrouter.com/en/main/start/overview)
- UI components: [Joy UI](https://mui.com/joy-ui/getting-started/installation/)

## Getting Started

Please read the whole doc before getting started, there is more Auth0 info at the end of the doc, happy coding!

![instructions/catCode.gif](https://github.com/IngridGdesigns/tesoro/blob/main/instructions/catCode.gif)


## Installation

- Clone project

![instructions/clone.gif](https://github.com/IngridGdesigns/tesoro/blob/main/instructions/clone.gif)

- Make sure you update your node and npm, node to version lts/iron
- Run ```nvm use```, to run the right version of node
- Go to the backend folder and run ```npm install``
- Then run ```npm start```, make sure you can access route ('http://localhost:3005') which will display a welcome message: 'hello and welcome to home for now'. You may change port number to whatever you like. 

### Postgres

- Download and install postgres

![instructions/postgres.gif](https://github.com/IngridGdesigns/tesoro/blob/main/instructions/postgres.gif) 

- Open postges app and open a database by double clicking on one 'template', it will open a terminal window.
- Type the following command: 
```CREATE DATABASE yourDatabase;```, a database will be created.
- Type command ```\c yourDatabase``` to head over to your new database.
- Use the following command to import tables into your database,  

- Next step is to head over to Auth0...but before that, quick notes on using Auth0 with classes: const { getAccessTokenSilently} = this.props.auth0;

1. If planning to use [class components in React visit](https://github.com/auth0/auth0-react/blob/main/EXAMPLES.md#use-with-a-class-component), essentially you need to wrap your class component with the withAuth0 higher order component to add the auth0 property to Class components:

```javascript

import React, { Component } from 'react';
import { withAuth0 } from '@auth0/auth0-react';

class Profile extends Component {
  render() {
    // `this.props.auth0` has all the same properties as the `useAuth0` hook
    const { user, getAccessTokenSilently } = this.props.auth0; <-- getAccessTokenSilently is Auth0s way to request token to perform CRUD and get data, fyi >

    return <div>Hello {user.name}</div>;
  }
}

export default withAuth0(Profile);

```

1. You might get errors if trying to use Router Dom Loader hooks, so make sure you wrap them or use another workaround (cool feature but not to use with class components at the moment, 😿), But hey, cheer up, your app will be awesome!


### Auth0

- Sign up for an account on https://auth0.com/
- Create a new application (select Single Page Application, Technology Javascript/React Router 6)
- Select "Applications" and then select your application. Obtain your Auth0 domain and clientID from the created application. 

![instructions/createAppOnAuth0.gif](https://github.com/IngridGdesigns/tesoro/blob/main/instructions/createAppOnAuth0.gif)

- Create a .env file and add to .gitignore and commit the change, then store those secrets in variables in an .env file see /backend/.env.example
- Also store your postgresql database secrets here too

```.env

AUTH0_CLIENT_ID=123
AUTH0_CLIENT_SECRET=456
AUTH0_DOMAIN=yourDomain.auth0.com
AUTH0_CLIENT_ORIGIN_URL="http://localhost:5137"
AUTH0_CALLBACKURL="http://localhost:3005"
AUTH0_AUDIENCE="https://yourAwesomeAPIyouCreateInAuth0"


DB_USER=you
DB_HOST=localhost
DB_DATABASE=awesomeDatabaseName
DB_PASSWORD=890
DB_PORT=5433

```

- Make sure to set allowed callback URL, logout Urls and Allowed Web Origins in the Auth0 app settings to ```http://localhost:5173/ ``` This will help you navigate to your pages, also add your domain to Allowed Web Origins: https://YOUR_DOMAIN_NAME.auth0.com
- Save your changes
- To protect your API, you must register an API using the [Auth0 Dashboard](https://auth0.com/docs/get-started/auth0-overview/set-up-apis)

![instructions/creatingNewApi.gif](https://github.com/IngridGdesigns/tesoro/blob/main/instructions/creatingNewApi.gif)

will include more Auth0 resources at the end of the file.. 


### Env file in client side

To define environment variables, you can create a .env file at the root of your Vite project. The variables in this file can then be accessed in your application code.
- Name your variables starting with ```VITE_API_URL=https://myawesomeapi.com```
- In your application you can access this variable ```import.meta.env.VITE_API_URL```

* Add callback URL to your .env file and the rest of your variables

```.env

VITE_REACT_APP_AUTH0_DOMAIN=yourDomain.auth0.com
VITE_REACT_APP_AUTH0_CLIENT_ID=yourClientId
VITE_REACT_APP_AUTH0_CALLBACK_URL=http://localhost:5173/ 
VITE_REACT_APP_AUTH0_AUDIENCE=http://yourAPI
VITE_REACT_APP_API_SERVER_URL=http://localhost:YourServerURL

```

### Configure Vite config to talk to server

- Open the vite.config.js file and add your server url (your Express API PORT), any request that starts with /api on your development server will be forwarded to http://localhost:3005.

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': "http://localhost:3005",
    }
  }
})
```

you will use '/api' as your url to fetch your data, example:

```javascript
 const response = await fetch(`/api/goals`); <-- make sure it matches your server route
 ```

- After frontend setup, go to the backend folder and run ```npm start``` and then go to client folder and run ```npm run dev```, you should see the landing page and button to login, Auth0 will take you to their log-in or registration page. 
- After that you will encounter the user Dashboard

## Auth0 Resources WIP

Small guide, but would suggest following the [spa-starter project](https://developer.auth0.com/resources/code-samples/full-stack/hello-world/basic-role-based-access-control/spa/react-javascript/express-javascript) that includes Role based access control/React information, some things differe because I used Vite+React instead. Clone the project from github and get started from there following set up, then dive into the rest below. Otherwise it could get confusing because they have deprecated information, some is marked as deprecated, other's aren't. 

1. If planning to use [class components in React visit](https://github.com/auth0/auth0-react/blob/main/EXAMPLES.md#use-with-a-class-component)
1. To distiguish between a user and admin, use [claims check](https://github.com/auth0/auth0-react/blob/main/EXAMPLES.md#protecting-a-route-with-a-claims-check)
1. [Auth API Explorer](https://auth0.com/docs/api/authentication?javascript#get-user-info)
1. [How to make API calls to the Auth0 Management API.](https://auth0.com/docs/quickstart/spa/react/02-calling-an-api)
1. [Getting Started with Auth0 series](https://auth0.com/docs/videos/get-started-series)
1. Highlights:

   1. [Configuring Scopes](https://auth0.com/docs/get-started/architecture-scenarios/spa-api/part-2#configure-the-authorization-extension)
   1. [Rules](https://auth0.com/docs/rules)
   1. [Customizaing error pages](https://auth0.com/docs/videos/get-started-series/brand-emails-and-error-pages)
   1. [Adding permission to users (assigning roles)](https://community.auth0.com/t/how-do-i-assign-permissions-to-users/72278)
   
   1. [Management API tutorial -](https://www.youtube.com/watch?v=VNgKNXgs7fQ)
   - Define your roles, Admin and Users and add permissions to each role
   - Go to Actions and create a [new action to automatically assign role to users](https://auth0.com/blog/assign-default-role-on-sign-up-with-actions/)
    

```javascript

    exports.onExecutePostLogin = async (event, api) => {


   // Check if the user has a role assigned 
  if (event.authorization && event.authorization.roles && event.authorization.roles.length > 0) {
    return;
  }

  // Create management API client instance 
  const ManagementClient = require("auth0").ManagementClient;

  const management = new ManagementClient({
    domain: event.secrets.DOMAIN,
    clientId: event.secrets.CLIENT_ID,
    clientSecret: event.secrets.CLIENT_SECRET,
    audience: event.secrets.AUDIENCE,
  });
  
  const params =  { id : event.user.user_id };
  const data = { "roles" : ['YOUR ROLE ID FOR ROLE YOU CREATED'] };

  try {
    await management.users.assignRoles(params, data);
  } catch (e) {
    console.log(e);
  }
  ```

# Using Claims check

```javascript 

   exports.onExecutePostLogin = async (event, api) => {
   const namespace = `roleType`
   if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}`, event.authorization.roles);

    }}

```
  
 - Yow will be able to view, for example admin or users just make sure you define the roles before to view your users roles.
 - You can curl to see your user or console.log user in Profile page to see information






- https://www.kirupa.com/html5/emoji.htm


UPDATE accounts
SET balance = balance - (SELECT amount FROM transactions WHERE transaction_id = $1)
WHERE account_id = (SELECT account_id FROM transactions WHERE transaction_id = $1)
  AND user_id = (SELECT user_id FROM transactions WHERE transaction_id = $1);
