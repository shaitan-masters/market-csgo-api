const JOI = require('joi');
const validateWithJoi = require('@validateWithJoi');
module.exports = (requestParams, validationSchema) => validateWithJoi(requestParams, validationSchema, 'client_error');
