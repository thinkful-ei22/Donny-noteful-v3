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


router.get('/:id', (req,res, next) => {
  const {id} = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById(id)
    .then(result => {
      if(result){
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});


//Tag - The Creation!

router.post('/', (req, res, next) => {
  const {name} = req.body;
  const newTag = { name };
  
  if (!newTag.name) {
    const err = new Error('Missing `name` in the request body');
    err.status = 400;
    return next(err);
  }

  Tag.create(newTag)
    .then (result => {
      if (result){
        res.location(`${req.originalUrl}/${res.id}`).status(201).json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });

});


module.exports = router;