const pool = require('../postgresConnection');

/* //////////////////////////////////

        Transactions

*//// ///////////////////////////////


const getAllTransactions = async (req, res) => {
  const client = await pool.connect();

  client.query('SELECT * FROM transactions', (err, results) => {;
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

const getTransactionsById = async (req, res) => {
  const client = await pool.connect();

  const user_id = parseInt(req.params.user_id);

  await client.query('SELECT * FROM transactions WHERE transaction_id = $1', [user_id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      client.release();
    } else { 
      res.status(200).json(results.rows[0]);
      client.release();
    }
  });
};

// const createTransaction = async (req, res) => { // without budget
//     const client = await pool.connect();

//     const { user_id, account_id, description, category_id, amount, goal_id } = req.body;
    
//     await client.query('INSERT INTO transactions(user_id, account_id, description, category_id, amount, goal_id) VALUES ($1, $2 $3, $4, $5, $6) RETURNING *',
//         [user_id, account_id, description, category_id, amount, goal_id], (err, results) => {
//              if (err) {
//                 res.status(500).send(err);
//                 client.release();
//                 } else { 
//                 res.status(200).json(results.rows[0]);
//                 client.release();
//                 }
//         })
// }

const createTransaction = async (req, res) => {
    const client = await pool.connect();

    const { user_id, account_id, description, category_id, amount, goal_id } = req.body;

    try {
      // await client.query('BEGIN'); // Start a transaction
      const queryText = `
            WITH new_transaction AS (
                INSERT INTO transactions(user_id, account_id, description, category_id, amount, goal_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            )
            UPDATE budget AS b
            SET amount = amount - (SELECT amount FROM new_transaction)
            WHERE user_id = $1 AND category_id = $4
        `;

        const { rows } = await client.query(queryText, [user_id, account_id, description, category_id, amount, goal_id]);
        res.status(200).json(rows[0]);

        // Insert the transaction into the transactions table
        // const transactionResult = await client.query(
        //     'INSERT INTO transactions(user_id, account_id, description, category_id, amount, goal_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        //     [user_id, account_id, description, category_id, amount, goal_id]
        // );

        // // Update the corresponding budget in the budget table
        // await client.query(
        //     'UPDATE budget SET amount = amount - $1 WHERE category_id = $2',
        //     [amount, category_id]
        // );

        // await client.query('COMMIT'); // Commit the transaction
        // res.status(200).json(transactionResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback the transaction if an error occurs
        console.error('Error creating transaction:', err);
        res.status(500).send(err);
    } finally {
        client.release();
    }
}


const editTransaction = async (req, res) => {
    const client = await pool.connect();

    const { user_id, account_id, description, category_id, amount, goal_id } = req.body;

    await client.query('UPDATE transactions SET account_id = $1, description = $2, category_id = $3, amount = $4, goal_id = $5 WHERE user_id = $6 RETURNING *',
        [user_id, account_id, description, category_id, amount, goal_id], (err, results) => {
            if (err) {
                res.status(500).send(err);
                client.release();
            } else { 
                res.status(200).json(results.rows[0]);
                client.release();
            }
        })
}

const deleteTransaction = async (req, res) => {
    const client = await pool.connect();

    const transaction_id = req.params.transaction_id;
    const user_id = parseInt(req.params.user_id);

    await client.query('DELETE FROM transactions WHERE transaction_id = $1 AND user_id = $2',
        [transaction_id, user_id], (err, results) => {
             if (err) {
                res.status(500).send(err);
                client.release();
             } else {
                console.log('tchau, it was deleted')
                res.status(200).end();
                client.release();
            }
    })
}


module.exports = {
    getAllTransactions, 
    getTransactionsById, 
    createTransaction,
    editTransaction,
    deleteTransaction
}