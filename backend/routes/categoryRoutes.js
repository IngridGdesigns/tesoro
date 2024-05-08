const express = require('express');
const { getAllCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    editCategory
} = require('../models/categories');

const router = express.Router();

router.get('/', getAllCategories);

router.get('/:category_id', getCategoryById);

router.get('/:category_name', getCategoryByName);

router.post('/', createCategory);

router.put('/category_id', editCategory);

// wont delete category for now

module.exports = router;