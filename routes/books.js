'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/books', (req, res, next) => {
  knex('books').orderBy('title').then( (allBooks) => {
    let camelizedBooks = camelizeKeys(allBooks)
    res.send(camelizedBooks);
  }).catch( (err) => {
    next(err);
  });
});

router.get('/books/:id', (req, res, next) => {
  knex('books').where('id', req.params.id).first().then( (book) => {
    if (!book) {
      return next();
    }
    let camelizedBook = camelizeKeys(book)
    res.send(camelizedBook);
  }).catch( (err) => {
    next(err)
  })
})

router.post('/books', (req, res, next) => {
  const bookToBeInserted = {
    id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl,
  }
  knex('books').insert(bookToBeInserted, '*').then( (insertedBook) => {
    if (!insertedBook) {
      return next();
    }
    res.send(camelizeKeys(insertedBook[0]))
  }).catch( (err) => {
    next(err);
  })
})

router.patch('/books/:id', (req, res, next) => {
  knex('books').where('id', req.params.id).first().then( (book) => {
    if (!book) {
      return next();
    }
    return knex('books').update({
      id: req.params.id,
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl,
      created_at: req.body.createdAt,
      updated_at: req.body.updatedAt,
    }, '*').where('id', req.params.id)
  }).then( (book) => {
    let camelizedBook = camelizeKeys(book[0])
    res.send(camelizedBook)
  }).catch((err) => {
    next(err)
  })
})

router.delete('/books/:id', (req, res, next) => {
  let book;
  knex('books').where('id', req.params.id).first().then( (row) => {
    if (!row) {
      return next();
    }
    book = row;
    return knex('books').del().where('id', req.params.id);
  }).then( () => {
    delete book.id;
    let camelizedBook = camelizeKeys(book)
    res.send(camelizedBook);
  }).catch( (err) => {
    next(err);
  });
});

module.exports = router;
