const pool = require('../postgresConnection');

/* //////////////////////////////////

        Budgets

*//// ///////////////////////////////

// Gets all budgets table
const getAllBudgets = async (req, res) => {
  const client = await pool.connect();

  client.query('SELECT * FROM budget', (err, results) => {
    if (err) {
      console.log('error oh noes!!', err);
      res.status(500).send('Server error');
      client.release();
    } else {
      console.log('data fetched successfully');
      res.status(200).json(results.rows);
      client.release();
    }
  });
};

// get account by id
const getAccountById = async (req, res) => {
  const client = await pool.connect();

  const account_id = parseInt(req.params.account_id);

  await client.query('SELECT * FROM budget WHERE account_id = $1', [account_id], (err, result) => {
    if (err) {
      res.status(500).send(err);
      client.release();
    } else { 
      res.status(200).json(result.rows[0]);
      client.release();
    }
  });
};

const getTotalBalanceOfBudget = async (req, res) => { //FOR USERS with more than 1 account
    const client = await pool.connect();
    const user_id = req.params.user_id;

   await client.query(`SELECT account_name_info, SUM(balance) AS total_balance
    FROM accounts
    WHERE user_id = $1
    GROUP BY account_name_info RETURNING *`, [user_id], (err, results) => {
       if (err) {
          res.status(500).send('Server error')
          client.release()
      } else {
          res.status(200).json(results.rows[0]);
          client.release()
        }
    })
}


const createAccount = async (req, res) => {
  const client = await pool.connect();
// curl --data "name=Uriel&username=cloudyday&laguna12@hotmail.com&password=12345" https://localhost:3005/api/accounts
  const { user_id, account_name, balance } = req.body;

  await client.query('INSERT INTO accounts(user_id, account_name, balance) VALUES ($1, $2, $3) RETURNING *', 
    [user_id, account_name, balance], (err, results) => {
      if (err) {
          res.status(500).send('Server error')
          client.release()
      } else {
          res.status(200).json(results.rows[0]);
          client.release()
        }
    })
}


const editAccountById = async (req, res) => {
  const client = await pool.connect();

  const { user_id, account_id, account_name, balance } = req.body;

    await client.query(`UPDATE accounts SET account_id = $1, account_name = $2, balance = $3 WHERE user_id = $5 RETURNING *`,
        [account_id, account_name, balance, user_id], (err, results) => {
    if (err) {
      console.log('Oh noes you have an error!!')
      res.status(500).send('There is a server error')
      client.release()
    }
    else {
      res.status(200).json(results.rows, 'User updated!')
      client.release()
    }
  });
}

const deleteAccount = async (req, res) => {
  const client = pool.connect();
  const user_id = req.params.user_id;

  (await client).query('DELETE FROM accounts WHERE user_id = $1', [user_id], (err, results) => {
    if (err) {
      res.status(500).send(`Oh noes a Servor error: ${err}!`)
      client.release()
    } else {
      res.status(200).end();
      client.release()
      }
  })
}

module.exports = {
    getAllAccounts,
    getAccountById,
    getTotalBalanceOfAccounts,
    createAccount,
    editAccountById,
    deleteAccount
};