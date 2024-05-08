const express = require('express');
const { getAllUsers, getUserById, createUser, editUserById, editUserRole, deleteUser } = require('../models/users');

const router = express.Router();

// GET all users
router.get('/', getAllUsers);

router.get('/:user_id', getUserById);

router.post('/', createUser);

router.put('/:user_id', editUserById);

router.put('./user_id', editUserRole);

router.delete('/:user_id', deleteUser);

module.exports = router;
