const pj = require('../../package.json');

module.exports = function versioning(registeredRoutes) {
  return function checkVersion(req, res, next) {
    if (req.path.indexOf('v.') < 0) {
      let apiPath = '/v.' + pj.apiversion + req.path;
      if (registeredRoutes.indexOf(apiPath) > -1) {
        apiPath += (req._parsedUrl.query) ? '?' + req._parsedUrl.query : '';
        res.redirect(apiPath);
      }
    }

    return next();
  };
};
