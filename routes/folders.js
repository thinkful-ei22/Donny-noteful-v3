'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Folder = require('../models/folder');
const Note = require('../models/note');
const { MONGODB_URI } = require('../config');
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
//   const searchTerm = req.query.searchTerm;
//   if (searchTerm) {
//     return Folder.find( {name: {$regex: searchTerm, $options: 'i'}})
//       .sort('_id');
//   }
  //if no search term, then do this:
  Folder.find().sort('_id')
      
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


/* ==== GET INDIVIDUAL FOLDER */

router.get('/:id', (req,res, next) =>{
  const id = req.params.id;
  console.log(req.params.id);
  Folder.findById(id)
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
  

/* == CREATE A NEW FOLDER :D */

router.post('/', (req,res,next) => {
  const {name} = req.body;
  const newFolder = {
    name: name
  };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!newFolder.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder.create(newFolder)
    .then( results => {
      if (results){
        res.location(`${req.originalUrl}/${res.id}`).status(201).json(results);
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

/* UPDATE FOLDER */

router.put('/:id',(req,res,next) => {
  const id = req.params.id;
  const {name} = req.body;

  console.log(id);

  const updatedFolder = {
    name:name
  };

  if (!updatedFolder.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndUpdate(id, updatedFolder, {new:true})
    .then( results => {
      if (results){
        console.log(results);
        res.json(results);
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


/* DELET FOLDER */

router.delete('/:id', (req,res,next) => {
  const {id} = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Folder.count({ _id :id}, function (err, count){ 
    console.log(count);
    if(count===0){
      console.log('missing folder');
      const err = new Error('The `id` refers to a folder that is missing');
      err.status = 404;
      return next(err);
    }
    else {
      Note.deleteMany({ folderId : id })
        .then( () => {
          return Folder.findByIdAndRemove(id);
        }) 
        .then( (result) => {
          res.json(result).status(204).end();
         
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

//http://mongoosejs.com/docs/models.html
  
    




module.exports = router;



