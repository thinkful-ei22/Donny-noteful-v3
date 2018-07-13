'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');
const { MONGODB_URI } = require('../config');
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId} = req.query;
  const folderFilter = {};
  if (folderId) {
    folderFilter.folderId = folderId;
  }

  if (searchTerm) {
    Note.find(
      {$or:
            [ {title: {$regex: searchTerm, $options: 'i'}},
              {content: {$regex: searchTerm, $options: 'i'}} ]
      })
      .find(folderFilter)
      .sort('_id')
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        next(err);
      });
  } else{
    Note.find(folderFilter)
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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
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
  const {title, content, folderId} = req.body;
  const newNote = {
    title: title, 
    content: content, 
    folderId: folderId
  };

    /*validation - check if id is valid and if exists*/
  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!newNote.title || !newNote.folderId) {
    const err = new Error('Missing `title` or `folderId` in the request body');
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
  const {title, content, folderId} = req.body;
  const updatedNote = {
    title: title, 
    content: content, 
    folderId: folderId
  };

  /*validation - check if id is valid and if exists*/
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `id` or `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!updatedNote.title || !updatedNote.folderId) {
    const err = new Error('Missing `title` or `folderId` in the request body');
    err.status = 400;
    return next(err);
  }

  return Note.findByIdAndUpdate(id, updatedNote, {new:true})
    .then(result => {
      if (result){
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  const {id} = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  } 

  return Note.findByIdAndRemove(id)
    .then(()=>{
      res.status(204).end();
    })
    .catch(err => next(err));
});
module.exports = router;