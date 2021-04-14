module.exports = ({responseType, method, body}) => ({
        body,
        searchParams,
        method: method || 'GET',
        responseType
    })

