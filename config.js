'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://dev:dev123@ds133601.mlab.com:33601/noteful-donny',
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://localhost/noteful-test'
};