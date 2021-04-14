const JOI = require('joi');
const LANGUAGES_ENUM = require('./../languages');


//Check init options
module.exports = Object.freeze(JOI.object({
    apiKey: JOI.string().alphanum(),
    language: JOI.string().valid(...LANGUAGES_ENUM),
    logAPIResponse: JOI.string(),
    getWarnings: JOI.boolean(),
    APIErrorsToJSON: JOI.boolean()

}));
