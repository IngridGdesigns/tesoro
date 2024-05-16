const express = require('express');
const { getAllBudgets, getBudgetByUserId, calcTotalForEachCategoryInBudget} = require('../models/budget');

const router = express.Router();

router.get('/', getAllBudgets);

router.get('/:user_sub', getBudgetByUserId);

router.get('/calculate/:user_id', calcTotalForEachCategoryInBudget);

module.exports = router;