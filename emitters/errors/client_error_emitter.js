const EVENT_EMITTER = require('events');

//Root Error emitter
const COMMON_ERROR_EMITTER = require('./common_error_emitter');
//Get dictionary string for this error
const CLIENT_ERRORS = require('./../../json/dictionary.json').client_errors;
const CLIENT_ERROR_EMITTER = new EVENT_EMITTER();

// Call root event emitter
CLIENT_ERROR_EMITTER.on('error', error => COMMON_ERROR_EMITTER.emit('error', {
    name: 'Client error',
    error: CLIENT_ERRORS[error]
}));

module.exports = CLIENT_ERROR_EMITTER;
