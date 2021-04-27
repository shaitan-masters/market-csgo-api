const JOI = require("joi");
const Emitters = require("./../../emitters");


module.exports = (object, schema = JOI.any(), emitterName = 'CRASH_EMITTER') => {

  const  ERROR = schema.validate(object, { abortEarly: false }).error;
  return ERROR && Emitters[emitterName].emit('error', ERROR);
};
