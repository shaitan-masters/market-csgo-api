const VALIDATE_WITH_JOI = require('@validateWithJoi');
const JOI = require('joi');
module.exports = responseBody => VALIDATE_WITH_JOI(responseBody, JOI.any());
