'use strict';

//CREATE SCHEMAS

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  createdAt: Date,
  updatedAt: Date,

});

// Add `createdAt` and `updatedAt` fields
noteSchema.set('timestamps', true);

module.exports = mongoose.model('Note', noteSchema);