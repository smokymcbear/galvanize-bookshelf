'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    email: Joi.string(),
    password: Joi.string()
  }
};
