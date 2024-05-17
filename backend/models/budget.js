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
const getBudgetByUserSub = async (req, res) => {
  const client = await pool.connect();

  const user_sub = req.params.user_sub; // not an umber

  
  await client.query(`SELECT b.budget_id, b.user_id, b.amount, b.description AS budget_description,
                          b.start_date, b.updated_at, c.category_id, c.category_name, c.description AS category_description
                      FROM budget b
                      LEFT JOIN categories c ON b.category_id = c.category_id
                      WHERE user_sub = $1`, [user_sub], (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).json({ err: 'internal error done'});
          client.release();
        } else { 
          res.status(200).json(result.rows);
          client.release();
        }
  });
};

const getBudgetByUserId = async (req, res) => {
  const client = await pool.connect();

  const user_id = Number(req.params.user_id);
  

  await client.query(`SELECT b.budget_id, b.user_id, b.amount, b.description AS budget_description,
       b.start_date, b.updated_at, c.category_id, c.category_name, c.description AS category_description
  FROM budget b
  LEFT JOIN categories c ON b.category_id = c.category_id
  WHERE user_id = $1`, [user_id], (err, result) => {
    if (err) {
      res.status(500).send(err.message, err.body, err, 'done');
      client.release();
    } else { 
      res.status(200).json(result.rows);
      client.release();
    }
  })
}

// seperate categories to see total amount spent on such category...
const calcTotalForEachCategoryInBudget = async (req, res) => {
  const client = await pool.connnect();
  const user_id = req.body;

  await client.query(`
                SELECT 
                    c.category_id, c.category_name, c.description AS category_description,
                    SUM(b.amount) AS total_amount,
                    ARRAY_AGG(b.budget_id) AS budget_ids,
                    ARRAY_AGG(b.description) AS budget_descriptions,
                    ARRAY_AGG(b.start_date) AS budget_start_dates,
                    ARRAY_AGG(b.updated_at) AS budget_updated_dates,
                    ARRAY_AGG(b.user_sub) AS budget_user_subs
              FROM categories c
              LEFT JOIN budget b ON b.category_id = c.category_id
              WHERE b.user_id = 135
              GROUP BY c.category_id, c.category_name, c.description`, [user_id], (err, results) => {
    if (err) {
      res.status(500).send('Server error', err.message, err.body, err, 'done');
      client.release();
    } else {
      res.status(200).json(results.rows[0]);
      client.release();
    }
})
}

const getTotalSpentByBudget = async (req, res) => {
  const client = await pool.connect();
  const { user_id, category_id }  = req.body

      await client.query(`SELECT 
                              b.budget_id,
                              b.amount AS budget_amount,
                              COALESCE(SUM(t.amount), 0) AS total_spent
                          FROM 
                              budget b
                          LEFT JOIN 
                              transactions t ON b.category_id = t.category_id
                          WHERE 
                              b.user_id = $1
                              AND b.category_id = $2
                          GROUP BY 
                              b.budget_id, b.amount`,
        [user_id, category_id], (err, results) => {
                      if (err) {
                            res.status(500).send('Server error', err)
                            client.release()
                        } else {
                            res.status(200).json(results.rows[0]);
                            client.release()
                          }
                      })

}

// const getTotalBalanceOfBudget = async (req, res) => { //FOR USERS with more than 1 account
//     const client = await pool.connect();
//     const user_id = parseInt(req.params.user_id);

//    await client.query(`SELECT account_name_info, SUM(balance) AS total_balance
//     FROM accounts
//     WHERE user_id = $1
//     GROUP BY account_name_info RETURNING *`, [user_id], (err, results) => {
//        if (err) {
//           res.status(500).send('Server error', err)
//           client.release()
//       } else {
//           res.status(200).json(results.rows[0]);
//           client.release()
//         }
//     })
// }


const createBudgetByCategory = async (req, res) => {
  const client = await pool.connect();

  const { user_id, category_id, amount, description, start_date, user_sub } = req.body;

  await client.query('INSERT INTO budget(user_id, category_id, amount, description, start_date, user_sub) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
    [user_id, category_id, amount, description, start_date, user_sub], (err, results) => {
      if (err) {
          res.status(500).send('Server error')
          client.release()
      } else {
          res.status(200).json(results.rows[0]);
          client.release()
        }
    })
}


// const editAccountById = async (req, res) => {
//   const client = await pool.connect();

//   const { user_id, account_id, account_name, balance } = req.body;

//     await client.query(`UPDATE accounts SET account_id = $1, account_name = $2, balance = $3 WHERE user_id = $5 RETURNING *`,
//         [account_id, account_name, balance, user_id], (err, results) => {
//     if (err) {
//       console.log('Oh noes you have an error!!')
//       res.status(500).send('There is a server error')
//       client.release()
//     }
//     else {
//       res.status(200).json(results.rows, 'User updated!')
//       client.release()
//     }
//   });
// }

const deleteBudget = async (req, res) => {
  const client = await pool.connect();
  const budget_id = Number(req.params.budget_id);

  await client.query('DELETE FROM budget WHERE budget_id = $1',[budget_id], (err, results) => {
    if (err) {
      res.status(500).send('Server error', err.message, err.body, err, 'done')
      client.release()
    }
    else {
        console.log('tchau, it was deleted')
        res.status(200).end();
        client.release();
      }

    })
}

module.exports = {
  getAllBudgets,
  getBudgetByUserId,
    getBudgetByUserSub,
    calcTotalForEachCategoryInBudget,
    getTotalSpentByBudget, 
    createBudgetByCategory, 
    deleteBudget
    // getTotalBalanceOfAccounts,
    // createAccount,
    // editAccountById,
    // deleteAccount
};