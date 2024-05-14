const pool = require('../postgresConnection');

/* //////////////////////////////////

        Users

*//// ///////////////////////////////

// Gets all users table
const getAllUsers = async (req, res) => {
  const client = await pool.connect();

  client.query('SELECT * FROM users', (err, results) => {
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

// get user by id
const getUserById = async (req, res) => {
  const client = await pool.connect();

  const user_id = parseInt(req.params.user_id);

  await client.query('SELECT * FROM users WHERE user_id = $1 AND user_sub = $2', [user_id, user_sub], (err, results) => {
    if (err) {
      res.status(500).send(err);
      client.release();
    } else { // res.json(dbitems.rows[0] )
      res.status(200).json(results.rows[0]);
      client.release();
    }
  });
};


const createUser = async (req, res) => {
  const client = await pool.connect();
  const { name, username, email, password, user_sub } = req.body;

  await client.query('INSERT INTO users(name, username, email, password, user_sub) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING *', 
    [name, username, email, password, user_sub], (err, results) => {
      if (err) {
        if (err.code === '23505') { // Unique constraint violation
          res.status(204).send('Email or username already exists');
          client.release();
        } else {
          res.status(500).send('Server error');
        }
        client.release();
      } else {
          console.log('201, user was created', username, email)
          res.status(200).json(results.rows[0]);
          client.release()
        }
    })
}

// /* Retrieve user profile from db */
// const getUserFromDB = async (req, res) => {
//   // const email = [ "%" + req.query.email + "%"]
//   const email = String(req.query.email)
//   pool.query("SELECT * FROM users WHERE email = $1", [ email ], (err, results) => {
//     res.json(results.rows)
//   });
// });


const editUserById = async (req, res) => {
  const client = await pool.connect();

  const { username, name, email, password, user_id, user_sub } = req.body;

  await client.query(`SET 
    username = CASE 
                    WHEN $1 != '' THEN $1 
                    ELSE username 
                END,
    name = CASE
               WHEN $2 != '' THEN $2 
               ELSE name 
           END,
    email = CASE 
                WHEN $3 != '' THEN $3 
                ELSE email 
            END,
    password = CASE 
                   WHEN $4 != '' THEN $4 
                   ELSE password 
               END
    WHERE user_id = $5 AND user_sub = $6 RETURNING *`, [username, name, email, password, user_id, user_sub], (err, results) => {
    if (err) {
      console.log('Oh noes you have an error!!')
      res.status(500).send('There is a server error')
      client.release()
    }
    else {
      res.status(200).json(results.rows[0], 'User updated!')
      client.release()
    }
  });
}


const editUserRole = async (req, res) => {
  const client = await pool.connect();

  const { user_id, role} = req.body;

  await client.query(`UPDATE users SET role = $1 
  WHERE user_id = $2 AND user_sub = $1`, [role[0], user_id, user_sub], (err, results) => {
    if (err) {
      console.log('Oh noes you have an error!!')
      res.status(500).send('There is a server error')
      client.release()
    }
    else {
      res.status(200).json(results.rows[0], 'User updated!')
      client.release()
    }
  });
}


const deleteUser = async (req, res) => {
  const client = pool.connect();
  const user_id = req.params.user_id;

  (await client).query('DELETE FROM users WHERE user_id = $1 AND user_sub = $2', [user_id, user_sub], (err, results) => {
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
  getAllUsers,
  getUserById, 
  createUser,
  editUserById,
  editUserRole,
  deleteUser
}