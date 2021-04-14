const FETCH_STUFF = require('got');
const BUILD_URL = require('./helpers/build_url');
const BUILD_GOT_OPTIONS = require('./helpers/build_got_options');
const CONFIG = require('config');
const {  CRASH_EMITTER } = require('@emitters');

module.exports = function(methodName, method, methodParams, state)  {
    const URL = BUILD_URL({
        ...state.APIParams,
        ...CONFIG.get('APIConfig'),
        ...method
    });
    const  GOT_OPTIONS = BUILD_GOT_OPTIONS({
        ...methodParams,
        ...method
    })

    try {
        return FETCH_STUFF(URL, GOT_OPTIONS)
            .then(({body}) => )
    } catch (fetchError) {
        CRASH_EMITTER.emit('error', fetchError)
    }
}