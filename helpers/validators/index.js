const JOI = require('joi');
const EMITTERS = require('./../emitters');

module.exports = (object, schema, emitterName) => {
    let ERROR = JOI.validate(object, schema, {abortEarly: false});
    return ERROR && EMITTERS[emitterName](ERROR);
}