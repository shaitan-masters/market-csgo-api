const JOI = require('joi')
const  VALIDATE_WITH_JOI = require('@validateWithJoi');

module.exports = requestParams => VALIDATE_WITH_JOI(requestParams, JOI.any())