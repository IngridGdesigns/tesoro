const express = require('express');
const { getAllBudgets, getBudgetByUserSub, calcTotalForEachCategoryInBudget, getTotalSpentByBudget, createBudgetByCategory, deleteBudget, getBudgetByUserId} = require('../models/budget');

const router = express.Router();

router.get('/', getAllBudgets);

router.get('/:user_id', getBudgetByUserId),

router.get('/sub/:user_sub', getBudgetByUserSub);

router.get('/calculate/:user_id', calcTotalForEachCategoryInBudget);

router.get('/total-budget', getTotalSpentByBudget)

router.post('/', createBudgetByCategory);

router.delete('/:budget_id', deleteBudget);

module.exports = router;