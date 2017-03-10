'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12).then( (hashPass) => {
    const userToBeInserted = {
      id: req.body.id,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      hashed_password: hashPass,
    }
    return knex('users').insert(userToBeInserted, '*').then( (users) => {
      const user = users[0];
      delete user.hashed_password;
      res.send(camelizeKeys(user))
    }).catch( (err) => {
      next(err);
    })
  })
})

module.exports = router;
