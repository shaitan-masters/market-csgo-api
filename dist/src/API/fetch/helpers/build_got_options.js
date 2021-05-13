module.exports = ({ responseType = 'json', method, body, APIKey, searchParams = {} }) => ({
    body,
    searchParams: {
        ...searchParams,
        key: APIKey
    },
    method: method || 'GET',
    responseType
});
