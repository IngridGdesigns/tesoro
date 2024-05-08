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

const getGoalsByUserId = async (req, res) => {
  const client = await pool.connect();

  const user_id = parseInt(req.params.user_id);

  await client.query('SELECT * FROM financial_goals WHERE user_id = $1', [user_id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      client.release();
    } else { 
      res.status(200).json(results.rows[0]);
      client.release();
    }
  });
};

const createGoal = async (req, res) => {
    const client = await pool.connect();

    const { user_id, goal_name, goal_amount, target_date } = req.body;
    
    await client.query('INSERT INTO financial_goals(user_id, goal_name, goal_amount, target_date) VALUES ($1, $2 $3, $4) RETURNING *',
        [user_id, goal_name, goal_amount, target_date], (err, results) => {
             if (err) {
                res.status(500).send(err);
                client.release();
                } else { 
                res.status(200).json(results.rows[0]);
                client.release();
                }
        })
}

const editGoal = async (req, res) => {
    const client = await pool.connect();

    const { user_id, goal_name, goal_amount, target_date } = req.body;
    
    await client.query('UPDATE financial_goals SET goal_name = $1, goal_amount = $2, target_date = $3 WHERE user_id = $4 RETURNING *',
        [user_id, goal_name, goal_amount, target_date], (err, results) => {
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

    const goal_id = req.params.goal_id;
    const user_id = parseInt(req.params.user_id);

    await client.query('DELETE FROM financial_goals WHERE goal_id = $1 AND user_id = $2',
        [goal_id, user_id], (err, results) => {
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
    getAllGoals, 
    getGoalsById, 
    createGoal,
    editGoal,
    deleteGoal
}