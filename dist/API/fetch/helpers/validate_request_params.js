// @ts-ignore
const validateWithJoi = require('@validateWithJoi');
module.exports = (method, requestParams) => validateWithJoi(method.paramsValidationSchema, requestParams, 'CLIENT_ERROR_EMITTER');
