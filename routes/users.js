'use strict';

const express = require('express');
const router = express.Router();

router.post('/users', (req, res, next) => {
  const userToBeInserted = {
    id: req.body.id,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    password:
  }
  knex('users').insert(userToBeInserted, '*').then( (insertedUser) => {
    if (!insertedUser) {
      return next();
    }
    res.send(camelizeKeys(insertedUser[0]))
  }).catch((err) => {
    next(err);
  })
})

module.exports = router;
