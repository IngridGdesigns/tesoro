const express = require('express');
const { getAllBudgets, getBudgetByUserId, calcTotalForEachCategoryInBudget} = require('../models/budget');

const router = express.Router();

router.get('/', getAllBudgets);

router.get('/:user_id', getBudgetByUserId);

router.get('/:user_id', calcTotalForEachCategoryInBudget);

module.exports = router;