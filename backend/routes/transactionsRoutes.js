const express = require('express');
const { getAllTransactions, getTransactionsById, getTransactionsByUserSub,createTransaction, editTransaction, deleteTransaction} = require('../models/transactions');

const router = express.Router();

router.get('/', getAllTransactions);

router.get('/:transaction_id', getTransactionsById);

router.get('/sub/:user_sub', getTransactionsByUserSub);

router.post('/', createTransaction);

router.put('/:transaction_id', editTransaction);

router.delete('/:transaction_id', deleteTransaction);

module.exports = router;
