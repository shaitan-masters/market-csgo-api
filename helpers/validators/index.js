const JOI = require("joi");
const ErrorEmitter = require("@ErrorEmitter");


module.exports = (object, schema = JOI.any(), errorEvent = 'uncaught_error') => {
   const  ERROR = schema.validate(object, { abortEarly: false }).error;
  return ERROR && ErrorEmitter.emit(errorEvent, ERROR.details[0]);
};
