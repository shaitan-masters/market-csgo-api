const JOI = require('joi');
const LANGUAGES_ENUM = require('./../languages');

//Check init options
module.exports = Object.freeze(JOI.object({
    APIKey: JOI.string().alphanum(),
    getWarnings: JOI.boolean(),
    APIErrorsToJSON: JOI.boolean(),
    APIParams: JOI.object()
}));
