'use strict';


//Create SCHEMA
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {Type:String, required: true, uniqye: true }
});

// Add `createdAt` and `updatedAt` fields
tagSchema.set('timestamps', true);

tagSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) =>{
    delete ret._id;
  }
});

module.exports = mongoose.model('Tag', tagSchema);