require('dotenv').config() //to use process.env
const express = require('express');
const bodyParser = require('body-parser') //parsing body
const cors = require('cors') //cors
const morgan = require('morgan');//HTTP request logger middleware, generates logs for API request
const app = express();
const { validateAccessToken } = require('./middleware/auth0.middleware');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer'); // auth0

const {
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_DOMAIN } = process.env

if (!AUTH0_AUDIENCE || !AUTH0_DOMAIN || !AUTH0_CLIENT_SECRET) {
  throw new Error('Environment variables are missing!');
}

const jwtCheck = auth({
  audience: `${AUTH0_AUDIENCE}`,
  issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

const PORT = process.env.PORT || 3005;

app.use(express.json())
app.set("json spaces", 2);
// app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true}))

// enable to run tests - current bug <-- needs refactoring
// if (process.env.NODE_ENV !== 'test') {
//   const cors = require('cors') //cors
//     app.use(cors()); 

//     app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//     res.send({ "msg": "This has CORS enabled 🎈!!" });
//     // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
//     next();
//   });
// }

  app.use(cors()); 

  app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); /// 'http://localhost:5173'
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    // res.setHeader("Access-Control-Allow-Headers", "X-Token");
  // res.send({ "msg": "This has CORS enabled 🎈!!" });
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  console.log('welcome home');
  res.json('hello and welcome to home for now')
});

app.get('/hello', validateAccessToken, (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/admin', validateAccessToken, (req, res) => {
  const message =  { text: "This is an admin message." };

  res.status(200).json(message);
});

// Import - Set up all API routes
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const goalRoutes = require('./routes/goalsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionsRoutes');

// // Use all API routes
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/authorized', jwtCheck, function (req, res) {
    res.send('Secured Resource');
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

module.exports = app;