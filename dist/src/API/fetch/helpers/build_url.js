const URL_CONCAT_OPTIONS = require('./../enums/URL_concat_options');
module.exports = ({ protocol, version, subdomain, host, route, noAPI }) => {
    const URL_VERSION = URL_CONCAT_OPTIONS.versions[version];
    const API_PATH = noAPI ? '' : URL_CONCAT_OPTIONS.apiPath;
    const SUBDOMAIN_CONCAT = subdomain ? `${subdomain}.` : '';
    const ROUTE_CONCAT = `/${route}`;
    return `${protocol}://${SUBDOMAIN_CONCAT}${host}${API_PATH}${URL_VERSION}${ROUTE_CONCAT}`;
};
