const PARSER = require('papaparse');
const {API_ERRORS_EMITTER} = require('@emitters');

module.exports = (responseCSV, methodParams) => {
    const PARSED = PARSER.parse(responseCSV, {
        header: true,
        trimHeader: true,
        delimiter: ';',
        encoding: 'utf8',
        skipEmptyLines: true,
    })

    return PARSED.errors != 0 ?
        PARSED.data : methodParams.returnCSV ?
            responseCSV :
            API_ERRORS_EMITTER.emit('error', errors[0])
    }

    return parsed.data;
}