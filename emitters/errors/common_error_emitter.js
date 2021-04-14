const EVENT_EMITTER = require('events');
const COMMON_ERROR_EMITTER = new EVENT_EMITTER();

COMMON_ERROR_EMITTER.on('error', errorData => {
    throw {
        name: errorData.name || 'Uncaught error',
        error: new Error(errorData.error || 'Uncaught error')
    }
});

