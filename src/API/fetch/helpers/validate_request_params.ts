

module.exports =   (method, requestParams) => require('@validateWithJoi')(method.paramsValidationSchema, requestParams, 'CLIENT_ERROR_EMITTER')
