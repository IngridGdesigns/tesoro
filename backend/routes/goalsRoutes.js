const express = require('express');
const { getAllGoals, getGoalsById, getGoalsByUserId, getGoalsByUserSub, editGoal, createGoal, createGoalById, deleteGoal } = require('../models/financialGoals');

const router = express.Router();

router.get('/', getAllGoals);

router.get('/:goal_id', getGoalsById);

router.get('/:user_id', getGoalsByUserId);

router.get('/sub/:user_sub', getGoalsByUserSub);

router.put('/:goal_id', editGoal);

router.post('/', createGoal);

router.post('/:user_id', createGoalById);

router.delete('/:goal_id', deleteGoal);

module.exports = router;