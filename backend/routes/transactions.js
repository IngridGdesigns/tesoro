const express = require('express');
const { getAllTransactions, getTransactionsById, createTransaction, editTransaction, deleteTransaction} = require('../models/transactions');

const router = express.Router();

router.get('/', getAllTransactions);

router.get('/:transaction_id', getTransactionsById);

router.post('/', createTransaction);

router.put('/:transaction_id', editTransaction);

router.put('/:transaction_id', deleteTransaction);

