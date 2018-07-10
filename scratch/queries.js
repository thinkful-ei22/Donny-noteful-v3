'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchTerm = 'Lady Gaga';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm};
//     }

//     return Note.find(filter).sort({ updatedAt: 'desc' });
//   })    
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//FIND NOTE BY ID
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchId='000000000000000000000004';
  
//     return Note.findById(searchId);
//   })    
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


//Create a new note using Note.create

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.create({
//       title:  'This is a TEST CAT 2',
//       content: 'TEST CAT CONTENT 2'
//     });
    
//   })    
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//Update a note by id using Note.findByIdAndUpdate

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const UpdateObj={
//       title:'Updated Title',
//       content:'Updated Content'

//     };

//     const searchId='000000000000000000000004';

//     return Note.findByIdAndUpdate(searchId,{$set: UpdateObj},{new:true});
        
//   })     
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


//DELETE

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchId='000000000000000000000001';
//     //Note.findByIdAndRemove(searchId);

//     return Note.findByIdAndRemove(searchId);
        
//   })     
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });
