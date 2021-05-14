const PARSER = require('papaparse');
//@ts-ignore
const errorEmitter = require('@errorEmitter');
module.exports = (responseCSV, methodParams) => {
    const PARSED = PARSER.parse(responseCSV, {
        header: true,
        trimHeader: true,
        delimiter: ';',
        encoding: 'utf8',
        skipEmptyLines: true,
    });
    return PARSED.errors != 0 ?
        PARSED.data : methodParams.returnCSV ?
        responseCSV :
        errorEmitter.emit('API_error', PARSED.errors[0]);
};
