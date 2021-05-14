// @ts-ignore
const JOI = require('joi');
// @ts-ignore
const validateWithJoi = require('@validateWithJoi');
module.exports = (requestParams, validationSchema) => validateWithJoi(requestParams, validationSchema, 'client_error');
