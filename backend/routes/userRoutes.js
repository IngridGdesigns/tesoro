const express = require('express');
const { getAllUsers, getUserById, getUserBySub, createUser, editUserById, editUserRole, deleteUser } = require('../models/users');

const router = express.Router();

// GET all users
router.get('/', getAllUsers);

router.get('/:user_id', getUserById);

router.get('/sub/:user_sub', getUserBySub); // `/api/users/${usersub}`,

router.post('/', createUser); /// evaluate the rest

router.put('/:user_id', editUserById);

router.put('./user_id', editUserRole);

router.delete('/:user_id', deleteUser);

module.exports = router;
