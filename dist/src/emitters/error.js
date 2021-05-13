const EventEmitter = require('events');
const ERROR_EMITTER = new EventEmitter();
const DICTIONARY = require('./../../json/dictionary.json');
ERROR_EMITTER.on('client_error', (error) => returnError({
    errorType: 'client', message: DICTIONARY.client_errors[error]
}));
ERROR_EMITTER.on('API_error', ({ request, response, version, method, message }) => returnError({
    errorType: 'API', message: DICTIONARY[error]
}));
ERROR_EMITTER.on('uncaught_error', (error) => returnError({
    errorType: 'uncaught', message: DICTIONARY[error]
}));
function returnError(errorData) {
    throw errorData;
}
module.exports = ERROR_EMITTER;
