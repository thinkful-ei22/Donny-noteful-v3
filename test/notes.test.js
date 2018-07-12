'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');

const seedNotes = require('../db/seed/notes-test');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Notes API resource', function() {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Note.insertMany(seedNotes);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  //GET ALL NOTES
  describe('GET /api/notes', function () {
    //test for all notes
    it('should return all notes', function() {
      let res;
      return chai.request(app)
        .get('/api/notes')
        .then(function(_res) {

          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(1);

          return Note.find()
            .then(function(data) {
              expect(res.body).to.have.length(data.length);
            });
        });
    });
   
    //test for getting one note
    it('should return the correct note given id', function () {
      
      let data;
      
      // Call the database
      return Note.findOne()
        .then(_data => {
          data = _data;

          // Call the API w/ the ID
          return chai.request(app).get(`/api/notes/${data.id}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id','title','content', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);

        });
    });

    //test for nonsense id
    it('should return 500 given an nonsensical id or query', function() {
    
      const invalidId = 'DONKEYKONG64 FOREVER AND EVER';

      return chai.request(app)
        .get(`/api/notes/${invalidId}`)
        .catch(error => error.response)
        .then((res) =>{
          expect(res).to.have.status(500);
        });
    });


  });


  //POST TEST
  describe('POST /api/notes', ()=>{
    it('should return a new note', ()=>{
      const newNote = {
        'title': 'Big Ups to my hoes in Long Beach',
        'content': 'Doinks Big Loud Nice Day You Know'
      };
      let res;
      return chai.request(app)
        .post('/api/notes')
        .send(newNote)
        .then((_res)=>{
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id','title','content', 'createdAt', 'updatedAt');
          return Note.findById(res.body.id);
        })
        .then(data =>{
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should return 400 if sent bad/missing fields and info', function() {
    
      const badObject = {
        title: 'whatever man',
        dog: 'dogs'
      };
  
      return chai.request(app)
        .post('/api/notes/')
        .send(badObject)
        .catch(error => error.response)
        .then((res) =>{
          expect(res).to.have.status(400);
        });
    });

  });

  //UPDATE TEST
  describe('PUT /api/notes/:id', ()=>{
    it('should update a note and return it', ()=>{
      const updatedNote = {
        'title': 'Do you really like to eat cheese?',
        'content': 'Cheese and cats go together like hands and gloves!'
      };
      return Note
        .findOne()
        .then(data => {
          updatedNote.id=data.id;
          return chai.request(app)
            .put(`/api/notes/${data.id}`)
            .send(updatedNote);
        })
        .then((res) =>{
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
          return Note.findById(updatedNote.id)
            .then(data =>{
              expect(updatedNote.id).to.equal(data.id);
              expect(updatedNote.title).to.equal(data.title);
              expect(updatedNote.content).to.equal(data.content);
            });
        });
    });
  });

  //DELETE TEST
  describe('DELETE api/notes/:id', ()=>{
    it('should delete a note given the id', ()=>{
      let data;
      return Note
        .findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/notes/${data.id}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Note.findById(data.id);
        })
        .then(_data => {
          expect(_data).to.be.null;
        });
    });
 
    it('should return 500 when trying to delete nonexistant/nonsense id', function() {
 
      let nonsense;
      return Note
        .findOne()
        .then(res => {
          return chai.request(app).delete(`/api/notes/${nonsense}`);
        })
        .then(res => {
          expect(res).to.have.status(500);
        });
    });

  });
});