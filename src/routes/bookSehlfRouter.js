const express = require('express');
const debug = require('debug')('app:bookShelfRouter');
const bookShelfController = require('../controllers/bookShelfController');
const userAuthenticationController = require('../controllers/userAuthenticationControler');

function router(nav) {
  const bookShelfRouter = express.Router();
  const { getBookAvaiableList, storeSelectedBooks } = bookShelfController(nav);
  const { userAuthenticationMiddleware } = userAuthenticationController();

  bookShelfRouter.use((req, res, next) => {
    debug('from bookShelfRouter');
    userAuthenticationMiddleware(req, res, next);
  });

  bookShelfRouter.route('/')
    .get(getBookAvaiableList)
    .post(storeSelectedBooks);

  return bookShelfRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
