const INIT_OPTIONS_SCHEMA = require('./../../enums/valdation_schemas/init_options_validation_schema');
// @ts-ignore
const validateWithJoi = require('@validateWithJoi');
module.exports = initOptions => validateWithJoi(initOptions, INIT_OPTIONS_SCHEMA, 'client_error');
