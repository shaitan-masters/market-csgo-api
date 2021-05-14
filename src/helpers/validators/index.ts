// @ts-ignore
const JOI = require("joi");
// @ts-ignore
const errorEmitter = require("@errorEmitter");


module.exports = (object, schema = JOI.any(), errorEvent = 'uncaught_error') => {
   const  ERROR = schema.validate(object, { abortEarly: false }).error;
  return ERROR && errorEmitter.emit(errorEvent, ERROR.details[0]);
};
