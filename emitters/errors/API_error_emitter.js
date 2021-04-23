const EVENT_EMITTER = require('events');

//Root Error emitter
const COMMON_ERROR_EMITTER = require('./common_error_emitter');

 const API_ERROR_EMITTER = new EVENT_EMITTER();

// Call root event emitter
API_ERROR_EMITTER.on('error', error => COMMON_ERROR_EMITTER.emit('error', {
    name: 'Client error',
    error: CLIENT_ERRORS[error]
}));

module.exports = API_ERROR_EMITTER;
