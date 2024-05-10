require('dotenv').config() //to use process.env
const express = require('express');
const bodyParser = require('body-parser') //parsing body
const cors = require('cors') //cors
const morgan = require('morgan');//HTTP request logger middleware, generates logs for API request
const app = express();

// const jwtCheck = auth({
//   audience: 'https://tesoroAPI',
//   issuerBaseURL: 'https://createmagic.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

const PORT = process.env.PORT || 3005;

app.use(express.json())
app.set("json spaces", 2);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors()); 
// app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // res.send({ "msg": "This has CORS enabled 🎈" });
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

// // // Read all library staff members
app.get('/', (req, res) => {
  console.log('welcome home');
  res.json('hello and welcome to home for now')
});

app.get('/hello', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API, dont know if it will work' })
})

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

// app.get('/authorized', jwtCheck, function (req, res) {
//     res.send('Secured Resource');
// });

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});


// exports.onExecutePostLogin = async (event, api) => {
//   // Check if the user has a role assigned
//   if (event.authorization && event.authorization.roles && event.authorization.roles.length > 0) {
//     return;
//   }



//   make every user a user
//   // Create management API client instance
//   const ManagementClient = require("auth0").ManagementClient;

//   const management = new ManagementClient({
//     domain: event.secrets.DOMAIN,
//     clientId: event.secrets.CLIENT_ID,
//     clientSecret: event.secrets.CLIENT_SECRET,
//     audience: event.secrets.AUDIENCE,
//   });
  
//   const params =  { id : event.user.user_id };
//   const data = { "roles" : ['rol_D8qPmzK7DTR9OKPS'] };

//   try {
//     await management.users.assignRoles(params, data);
//   } catch (e) {
//     console.log(e);
//   }
// };