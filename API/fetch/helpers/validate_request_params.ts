const VALIDATE_WITH_JOI = require('@validateWithJoi');

module.exports = function (method, requestParams) => VALIDATE_WITH_JOI(method.paramsValidationSchema, requestParams, 'CLIENT_ERROR_EMITTER')