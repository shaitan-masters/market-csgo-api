const JOI = require("joi");
const EMITTERS = require("@emitters");
const DEFAULT_VALIDATION_SCHEMA = require("@defaultValidationSchema");

module.exports = (object, schema = DEFAULT_VALIDATION_SCHEMA, emitterName) => {
  let ERROR = JOI.validate(object, schema, { abortEarly: false });
  return ERROR && EMITTERS[emitterName](ERROR);
};
