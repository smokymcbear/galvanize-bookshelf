'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/token', (req, res, next) => {
  knex('users').then((user) => {
    res.send(!user ? true : false)
  })
})

// YOUR CODE HERE

module.exports = router;
