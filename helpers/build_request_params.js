module.exports = ({clientRequestParams, state}) => Object.freeze({
    ...clientRequestParams,
    ...state
});
