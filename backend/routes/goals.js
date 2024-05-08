const express = require('express');
const { getAllGoals, getGoalsById, getGoalsByUserId, editGoal, createGoal, deleteGoal } = require('../models/financialGoals');

const router = express.Router();

router.get('/', getAllGoals);

router.get('/:goal_id', getGoalsById);

router.get('/:user_id', getGoalsByUserId);

router.put('/:goal_id', editGoal);

router.post('/', createGoal);

router.delete('/:goal_id', deleteGoal);

module.exports = router;