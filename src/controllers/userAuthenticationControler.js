const debug = require('debug')('app:userAuthenticationController');

function userAuthenticationController() {
  function userAuthenticationMiddleware(req, res, next) {
    if (req.user) {
      debug(req.user);
      next();
    } else {
      debug('redirigio');
      res.redirect('/');
    }
  }

  return {
    userAuthenticationMiddleware,
  };
}

module.exports = userAuthenticationController;
