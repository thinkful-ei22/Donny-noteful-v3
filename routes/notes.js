'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');
const { MONGODB_URI } = require('../config');
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {

  mongoose.connect(MONGODB_URI)
    .then(() => {
      const {searchTerm} = req.query;
      //let filter={};

      if (searchTerm) {
        return Note.find(
          {$or:
            [{title: {$regex: searchTerm}},{content: {$regex: searchTerm}}]
          })
          .sort('_id');
      }
      return Note.find({}).sort('_id');
    }) 
    .then(results => {
      console.log(results);
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });


});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      const searchId=req.params.id;
  
      return Note.findById(searchId);
    })    
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  mongoose.connect(MONGODB_URI)
    .then(() => {
      
      const {title, content} = req.body;
      const newNote = {
        title, content
      };
      
      return Note.create(newNote);
    })
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  mongoose.connect(MONGODB_URI)
    .then(() => {
    
      const searchId=req.params.id;
      const {title,content} = req.body;

      const UpdateObj = {
        title:title,
        content:content
      };

      return Note.findByIdAndUpdate(searchId,UpdateObj,{new:true});
        
    })     
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {



  
});

module.exports = router;