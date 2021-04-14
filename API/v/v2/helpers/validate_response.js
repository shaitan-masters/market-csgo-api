const INIT_OPTIONS_VALIDATION_SCHEMA = require('./../enums/valdation_schemas/init_options_validation_schema')
const VALIDATE_WITH_JOI = require('@validateWithJoi');

module.exports = response => VALIDATE_WITH_JOI(response, INIT_OPTIONS_VALIDATION_SCHEMA, 'clientErrorsEmitter');