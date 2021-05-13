const INIT_OPTIONS_SCHEMA = require('./../../enums/valdation_schemas/init_options_validation_schema');
const VALIDATE_WITH_JOI = require('@validateWithJoi');
module.exports = initOptions => VALIDATE_WITH_JOI(initOptions, INIT_OPTIONS_SCHEMA, 'client_error');
