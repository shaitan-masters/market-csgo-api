const fs = require("fs");

module.exports = function (APIResponse, requestParams, state) {
  const FILE_PATH = state.logAPIResponse;
  const WARNINGS_ALLOWED = state.getWarnings;

  try {
    fs.readFile(FILE_PATH, (readError, data) => {
      if (readError && WARNINGS_ALLOWED) {
        return console.warn(`Error reading file ${FILE_PATH}:
            ${readError}`);
      }

      const LOG = JSON.parse(data) || [];

      if (!Array.isArray(LOG)) throw "File contains data";

      LOG.push({
        request_params: requestParams,
        response: APIResponse,
        time_now: new Date(),
      });

      fs.writeFile(FILE_PATH, JSON.stringify(LOG), function (writeError) {
        if (writeError && WARNINGS_ALLOWED) {
          return console.warn(`Error writing file ${FILE_PATH}:
                    ${writeError}`);
        }
      });
    });
  } catch (logginError) {
    WARNINGS_ALLOWED &&
      console.warn(`Error while performing logging with file ${FILE_PATH}:
        ${logginError}
        `);
  }
};
