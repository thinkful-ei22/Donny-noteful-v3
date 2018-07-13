'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');
const Tag = require('../models/tag');
const { MONGODB_URI } = require('../config');
const router = express.Router();


/*Get Me Tags Boi*/

router.get('/', (req, res, next) => {
  Tag.find()
    .sort('name')
    .then(results => {
      if(results){
        res.json(results);
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});



/*Get me Tag Boi*/


router.get('/:id')

module.exports = router;