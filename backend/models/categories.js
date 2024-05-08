const pool = require('../postgresConnection');

/* //////////////////////////////////

        Categories

*//// ///////////////////////////////

const getAllCategories = async (req, res) => {
  const client = await pool.connect();

  client.query('SELECT * FROM categories', (err, results) => {;
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


const getCategoryById = async (req, res) => {
  const client = await pool.connect();

  const category_id = parseInt(req.params.category_id);

  await client.query('SELECT * FROM categories WHERE category_id = $1', [category_id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      client.release();
    } else { 
      res.status(200).json(results.rows[0]);
      client.release();
    }
  });
};

const getCategoryByName = async (req, res) => {
  const client = await pool.connect();

  await client.query('SELECT category_name FROM categories ', (err, results) => {
    if (err) {
      res.status(500).send(err);
      client.release();
    } else { 
      res.status(200).json(results.rows[0]);
      client.release();
    }
  });
};

const createCategory = async (req, res) => {
    const client = await pool.connect();

    const { category_id, category_name, description } = req.body;
    
    await client.query('INSERT INTO categories(category_id, category_name, description) VALUES ($1, $2 $3) RETURNING *',
        [category_id, category_name, description], (err, results) => {
             if (err) {
                res.status(500).send(err);
                client.release();
                } else { 
                res.status(200).json(results.rows[0]);
                client.release();
                }
        })
}

const editCategory = async (req, res) => {
    const client = await pool.connect();

    const { category_id, category_name, description } = req.body;
    
    await client.query('UPDATE categories SET category_name, description WHERE category_id = $4 RETURNING *',
        [ category_id, category_name, description ], (err, results) => {
            if (err) {
                res.status(500).send(err);
                client.release();
            } else { 
                res.status(200).json(results.rows[0]);
                client.release();
            }
        })
}

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    editCategory
}