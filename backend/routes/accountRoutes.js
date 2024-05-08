const express = require('express');
const {
    getAllAccounts,
    getAccountById,
    getTotalBalanceOfAccounts,
    createAccount,
    editAccountById,
    deleteAccount
} = require('../models/accounts');

const router = express.Router();

router.get('/', getAllAccounts);

router.get('/:account_id', getAccountById);

router.get('/total_balance', getTotalBalanceOfAccounts);

router.post('/', createAccount);

router.put('/:account_id', editAccountById);

router.delete('/:account_id', deleteAccount);

module.exports = router;
