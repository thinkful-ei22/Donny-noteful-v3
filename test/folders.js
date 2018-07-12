'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');

const seedNotes = require('../db/seed/notes-test');
const seedFolders = require('../db/seed/folders');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Folders API resource', function() {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });
  
  beforeEach(function () {
    return Folder.insertMany(seedFolders);
  });
  
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
  
  after(function () {
    return mongoose.disconnect();
  });


  /*GET ENDPOINT TEST*/

  describe('GET /api/folders', function () {

    it('should return all folders', function() {
      let res;
      return chai.request(app)
        .get('/api/folders')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.of.at.least(1);
  
          return Folder.find()
            .then(function(data) {
              expect(res.body).to.have.length(data.length);
            });
        });
    });


    it('should return the correct folder given id', function () {
      
      let data;
    
      // Call the database
      return Folder.findOne()
        .then(_data => {
          data = _data;
          //console.log(data.folderId);

          // Call the API w/ the ID
          return chai.request(app).get(`/api/folders/${data.id}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id','name', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);

        });
    });
  }); //end get folder test



}); //END