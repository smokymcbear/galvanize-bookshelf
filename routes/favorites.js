'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')

router.get('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.send(false)
    } else {
      return knex('favorites')
      .innerJoin('books', 'books.id', 'favorites.book_id')
      .innerJoin('users', 'users.id', 'favorites.users_id')
      .then( (favorite) => {
        console.log(favorite)
        res.set('Content-Type', /json/)
        res.send(camelizeKeys(favorite))
      }).catch( (err) => {
        next();
      })
    }
  })
})

module.exports = router;
