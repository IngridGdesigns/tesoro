require('dotenv').config() //to use process.env
const express = require('express');
const bodyParser = require('body-parser') //parsing body
const cors = require('cors') //cors
const morgan = require('morgan');//HTTP request logger middleware, generates logs for API request
const app = express();

const PORT = process.env.PORT || 3005;

app.use(express.json())
app.set("json spaces", 2);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors()); 

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
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


// // Use all API routes
app.use('/api/users', userRoutes);
app.use('api/accounts', accountRoutes)




app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
