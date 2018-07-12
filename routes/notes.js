'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');
const { MONGODB_URI } = require('../config');
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm} = req.query;
  if (searchTerm) {
    Note.find(
      {$or:
            [
              {title: {$regex: searchTerm, $options: 'i'}},
              {content: {$regex: searchTerm, $options: 'i'}}
            ]
      })
      .sort('_id')
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
      });
  } else{
    Note.find()
      .sort('_id')
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
      });
  }

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
 
  const {id} = req.params;
  return Note.findById(id)

    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content} = req.body;
  const newNote = {
    title: title, 
    content: content, 
  };
  if (!newNote.title || !newNote.content) {
    const err = new Error('Missing `title` or `content` in request body');
    err.status = 400;
    return next(err);
  }
  return Note.create(newNote)
    .then(results => {
      if (results){
        res.location(`${req.originalUrl}/${res.id}`).status(201).json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {title, content} = req.body;
  const updatedNote = {
    title: title, 
    content: content, 
  };
  if (!updatedNote.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  return Note.findByIdAndUpdate(id, updatedNote, {new:true})
    .then(results => {
      if (results){
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  const {id} = req.params;
  return Note.findByIdAndRemove(id)
    .then(()=>{
      res.status(204).end();
    })
    .catch(err => next(err));
});
module.exports = router;