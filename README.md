# tesoro

## A Financial Management System

A personal finance management that will allows users to track their income, expenses, savings, providing insights into their financial health, and helping them make informed financial decisions.


## Tools and Technologies

Database: [Postgresql (postgesql app)](https://postgresapp.com/),
Authorization/authentication: [Auth0](https://auth0.com/?utm_content=usbranded-auth0-auth0homepage&utm_source=google&utm_campaign=amer_namer_can_all_ciam-all_dg-ao_auth0_display_google_static-image_retarget_SitewideRemarketing_utm2&utm_medium=cpc&utm_id=aNK4z000000UCTUGA4&gad_source=1&gclid=EAIaIQobChMI6su00OWChgMVARitBh3Oewg1EAAYASAAEgIWafD_BwE)
Backend: [ExpressJS](https://expressjs.com/en/starter/installing.html),
Frontend: [Vite+React](https://vitejs.dev/guide/), [React Hook Form](https://react-hook-form.com/get-started)
UI components: [Joy UI](https://mui.com/joy-ui/getting-started/installation/)

https://www.kirupa.com/html5/emoji.htm

## Configure Vite config to talk to server

Make sure you add your server url: 

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': "http://localhost:3005",
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '/api'),,
    }
  }
})
```

you will use '/api' as your url to fetch your data, example:

```javascript
 const response = await fetch(`/api/goals`); <-- make sure it matches your server route
 ```





UPDATE accounts
SET balance = balance - (SELECT amount FROM transactions WHERE transaction_id = $1)
WHERE account_id = (SELECT account_id FROM transactions WHERE transaction_id = $1)
  AND user_id = (SELECT user_id FROM transactions WHERE transaction_id = $1);
