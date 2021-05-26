const EventEmitter = require('events');
const ERROR_EMITTER = new EventEmitter();
const DICTIONARY = require('./../../json/dictionary.json');

ERROR_EMITTER.on('client_error', (message) => returnError({
    errorType: 'client', message: DICTIONARY.client_errors[message]
}));

ERROR_EMITTER.on('API_error', ({request, response, version, method, message}) => returnError({
    errorType: 'API', message: DICTIONARY.API_errors[message]
}));

ERROR_EMITTER.on('uncaught_error', (error) => returnError({
    errorType: 'uncaught', message: DICTIONARY.uncaught_error, stack: error.stack
}));

ERROR_EMITTER.prototype.processError = function (error) {
    return !['client', 'API', 'uncaught'].includes(error.errorType) ?
        ERROR_EMITTER.emit('uncaught_error', error) :
        returnError(error)
}

function returnError(errorData) {
    throw {
        ...errorData,
        service: 'CSGO Market API provider'
    };
}

module.exports = ERROR_EMITTER;

