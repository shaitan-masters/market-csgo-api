const EventEmitter = require('events');

//Root Error emitter
const COMMON_ERROR_EMITTER = require('./common_error_emitter');
//Get dictionary string for this error
//const CLIENT_ERRORS = require('./../../json/dictionary.json').client_errors;
const CRASH_EMITTER = new EventEmitter();

// Call root event emitter
CRASH_EMITTER.on('error', error => COMMON_ERROR_EMITTER.emit('error', {
    name: 'App crash error',
    error: 'NPM module crashed. If this repeats please open an issue on Github. We are sorry'
}));

module.exports = CRASH_EMITTER;
