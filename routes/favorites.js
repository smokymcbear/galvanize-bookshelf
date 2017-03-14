'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

router.get('/favorites', (req, res, next) => {
  // verify the token first
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.setHeader('Content-Type', 'text/plain')
      res.status(401).send('Unauthorized')
    } else {
      knex('favorites').innerJoin('books', 'favorites.book_id', 'books.id') // one table join
      .then( (favorite) => {
        res.setHeader('Content-Type', 'application/json')
        res.json(camelizeKeys(favorite))
      }).catch( (err) => {
        next(err);
      })
    }
  })
})

router.get('/favorites/check', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.setHeader('Content-Type', 'text/plain')
      res.status(401).send('Unauthorized')
    } else {
      knex('favorites').innerJoin('books', 'favorites.book_id', 'books.id').where('book_id', req.query.bookId)
      .then( (bookID) => {
        res.send(bookID.length !== 0)
      }).catch( (err) => {
        next(err);
      })
    }
  })
})

router.post('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.setHeader('Content-Type', 'text/plain')
      res.status(401).send('Unauthorized')
    } else {
      const addedFavorite = {
        id: req.body.id,
        book_id: req.body.bookId,
        user_id: payload.userId, // assuming the user ID is 1
      }
      console.log('hello')
      return knex('favorites').insert(addedFavorite, '*')
      .then( (result) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(camelizeKeys(result[0]))
      }).catch((err) => {
        next(err)
      })
      next()
    }
  })
})

router.delete('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.setHeader('Content-Type', 'text/plain')
      res.status(401).send('Unauthorized')
    } else {
      knex('favorites').then( (result) => {
        res.setHeader('Content-Type', 'application/json');
        delete result[0].id;
        res.send(camelizeKeys(result[0]))
      })
    }
  })
})

module.exports = router;
