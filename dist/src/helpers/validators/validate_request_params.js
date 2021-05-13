const JOI = require('joi');
const VALIDATE_WITH_JOI = require('@validateWithJoi');
module.exports = (requestParams, validationSchema) => VALIDATE_WITH_JOI(requestParams, validationSchema, 'client_error');
