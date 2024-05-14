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

- Next step is to head over to Auth0

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

- https://www.kirupa.com/html5/emoji.htm


UPDATE accounts
SET balance = balance - (SELECT amount FROM transactions WHERE transaction_id = $1)
WHERE account_id = (SELECT account_id FROM transactions WHERE transaction_id = $1)
  AND user_id = (SELECT user_id FROM transactions WHERE transaction_id = $1);
