const pool = require('../postgresConnection');

/* //////////////////////////////////

        Financial_goals

*//// ///////////////////////////////


const getAllGoals = async (req, res) => {
  const client = await pool.connect();

  client.query('SELECT * FROM financial_goals', (err, results) => {;
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


const getGoalsById = async (req, res) => {
  const client = await pool.connect();

  const goal_id = parseInt(req.params.goal_id);

  await client.query('SELECT * FROM financial_goals WHERE goal_id = $1', [goal_id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      client.release();
    } else { 
      res.status(200).json(results.rows[0]);
      client.release();
    }
  });
};

const getGoalsByUserSub = async (req, res) => { // using user sub
  const client = await pool.connect();

// let user_sub = decodeURI(req.params.user_sub);
  // console.log()
  let user_sub = decodeURIComponent(req.params.user_sub);

  await client.query('SELECT * FROM financial_goals WHERE user_sub = $1', [user_sub], (err, results) => {
    if (err) {
      console.log(err.message)
      res.status(500).send(err);
      client.release();
    } else { 
      res.status(200).json(results.rows);
      client.release();
    }
  });
};

const getGoalsByUserId = async (req, res) => { // using user sub
  const client = await pool.connect();

  const user_id = parseInt(req.params.user_id);

  await client.query('SELECT * FROM financial_goals WHERE user_id = $1 AND goal_amount - current_amount = remaining_amount', [user_id], (err, results) => {
    if (err) {
      console.log('you got an error', err.message, err.body, 'done')
      res.status(500).send(err);
      client.release();
    } else { 
      res.status(200).json(results.rows[0]);
      client.release();
    }
  });
};






const createGoal = async (req, res) => { // updated body
    const client = await pool.connect();

    // const goal_name = req.body.goal_name;
    // const target_date = req.body.target_date;
    // let user_sub = decodeURIComponent(req.body.user_sub);
    // let user_id = parseInt(req.body.user_id);
  // let goal_amount = parseFloat(req.body.goal_amount);
  const { user_id, user_sub, goal_name, goal_amount, target_date, current_amount } = req.body;
  
  await client.query('INSERT INTO financial_goals(user_id, user_sub, goal_name, goal_amount, target_date, current_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user_id, user_sub, goal_name, goal_amount, target_date, current_amount], (err, results) => {

      if (err) {
        console.log('you got an error', err.message, err.body, err, 'done')
        res.status(500).send(err);
        client.release();
      } else { 
        res.status(200).json(results.rows[0]);
        client.release();
      }
  });
};
// not active right now
const createGoalById = async (req, res) => {
    const client = await pool.connect();
    
    const goal_name = req.body.goal_name;
    const target_date = req.body.target_date;
    let user_sub = decodeURIComponent(req.body.user_sub);
    let user_id = Number(req.params.user_id);
  let goal_amount = parseFloat(req.body.amount);
  // let current_amount = parseFloat(req.body.current_amount)
  
  await client.query('INSERT INTO financial_goals(user_id, user_sub, goal_name, goal_amount, target_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, user_sub, goal_name, goal_amount, target_date, ], (err, results) => {

      if (err) {
        console.log('you got an error', err.message, err.body, err, 'done')
        res.status(500).send(err);
        client.release();
      } else { 
        res.status(200).json(results.rows[0]);
        client.release();
      }
  });
};

// const createGoal = async (req, res) => {
//     const client = await pool.connect();

//     const { goal_name, goal_amount, target_date } = req.body;
//   let user_sub = decodeURIComponent(req.params.user_sub);
  
//     try {
//         const result = await client.query('INSERT INTO financial_goals(user_sub, goal_name, goal_amount, target_date) VALUES ($1, $2, $3, $4) RETURNING *',
//             [user_sub, goal_name, goal_amount, target_date]);

//         res.status(200).json(result.rows[0]);
//     } catch (error) {
//         console.error('Error creating goal:', error);
//         res.status(500).send('Server error');
//     } finally {
//         client.release();
//     }
// }


// const createGoal = async (req, res) => {
//     const client = await pool.connect();

//     const { user_sub, user_id, goal_name, goal_amount, target_date } = req.body;
    
//     await client.query('INSERT INTO financial_goals(user_sub, user_id, goal_name, goal_amount, target_date) VALUES ($1, $2 $3, $4, $5) RETURNING *',
//         [user_sub, user_id, goal_name, goal_amount, target_date], (err, results) => {
//              if (err) {
//                 res.status(500).send(err);
//                 client.release();
//                 } else { 
//                 res.status(200).json(results.rows[0]);
//                 client.release();
//                 }
//         })
// }

const editGoal = async (req, res) => { //and update transaction by goal_id
    const client = await pool.connect();

   const { goal_name, target_date, goal_amount, amount } = req.body; // Extract parameters from req.body
    const goal_id = parseInt(req.params.goal_id);

    // Parse goal_amount and amount as numbers
    const parsedGoalAmount = parseFloat(goal_amount);
    const parsedAmount = parseFloat(amount);
  
  await client.query(`UPDATE financial_goals SET goal_name = $1, goal_amount = $2, target_date = $3, current_amount = current_amount + $4 WHERE goal_id = $5 RETURNING *;`,
        [goal_name, parsedGoalAmount, target_date, parsedAmount, goal_id], (err, results) => {
            if (err) {
                res.status(500).send(err);
                client.release();
            } else { 
                res.status(200).json(results.rows[0]);
                client.release();
            }
    })
}

const deleteGoal = async (req, res) => {
    const client = await pool.connect();

    const goal_id = Number(req.params.goal_id);

    await client.query('DELETE FROM financial_goals WHERE goal_id = $1', [goal_id], (err, results) => {
             if (err) {
                res.status(500).send(err.message, err.body, err,);
                client.release();
             } else {
                console.log('tchau, it was deleted')
                res.status(200).end();
                client.release();
            }

    })


}


module.exports = {
    getAllGoals, 
    getGoalsById,
  getGoalsByUserSub,
    createGoalById,
    getGoalsByUserId,
    createGoal,
    editGoal,
    deleteGoal
}