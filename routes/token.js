'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')

router.get('/token', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.send(false)
    } else {
      res.send(true)
    }
  })
})

router.post('/token', (req, res, next) => {
  knex('users').where('email', req.body.email)
  .then( (usersArray) => {
    let foundUser = usersArray[0];
    if (foundUser === undefined) {
      res.set('Content-Type', 'text/plain')
      res.status(400).send("Bad email or password")
    } else {
      bcrypt.compare(req.body.password, foundUser.hashed_password).then( (bingo) => {

        const claim = { userId: foundUser.id }; //this is our 'session'
        const token = jwt.sign(claim, process.env.JWT_KEY, { //use this environment variable to sign the cookie
          expiresIn: '7 days'  // Adds an exp field to the payload
        });

        res.cookie('token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),  // 7 days
          secure: router.get('env') === 'production'  // Set from the NODE_ENV
        });

        const responseUser = {
          id: foundUser.id,
          firstName: foundUser.first_name,
          lastName: foundUser.last_name,
          email: foundUser.email
        };

        res.status(200).send(responseUser)
      })
      .catch((err) => {
        res.set('Content-Type', 'text/plain')
        res.status(400).send("Bad email or password")
      })
    }
  })
})

router.delete('/token', (req, res, next) => {
  res.clearCookie('token', { path: '/token'})
  res.status(200).send(true)
})

// YOUR CODE HERE

module.exports = router;
