module.exports = ({ clientRequestParams, state }) =>
  Object.freeze({
    ...clientRequestParams,
    logAPIResponse:
      clientRequestParams.logAPIResponse ||
      (state.logAPIResponse && clientRequestParams.logAPIResponse !== false),
    APIErrorsToJSON:
      clientRequestParams.APIErrorsToJSON ||
      (state.APIErrorsToJSON && clientRequestParams.APIErrorsToJSON !== false),
  });
