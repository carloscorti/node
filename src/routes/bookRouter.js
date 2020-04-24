const express = require('express');
const debug = require('debug')('app:bookRouter');
// importo bookController
const bookController = require('../controllers/bookController');
// importo userAuthenticationController
const userAuthenticationController = require('../controllers/userAuthenticationControler');

function router(nav) {
  const bookRouter = express.Router();
  // tengo que ejecutar bookController(nav) para que me devuelva el objeto con las funciones
  // extraigo las funciones del objeto que devuelve las fucnrion bookController
  const { getBookList, getBookById } = bookController(nav);
  const { userAuthenticationMiddleware } = userAuthenticationController();

  bookRouter.use((req, res, next) => {
    // utilizo userAuthenticationMiddleware de userAuthenticationController
    // como middleware para autorizacion de rutas
    debug('from bookRouter');
    userAuthenticationMiddleware(req, res, next);
  });

  bookRouter.route('/')
    // utilizo getBookList de bookController
    // idem a .get((req, res) => getBookList(req, res));
    .get(getBookList);

  bookRouter.route('/:id')
    // utilizo getBookList de bookController
    // idem a .get((req, res) => getBookById(req, res));
    .get(getBookById);

  return bookRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
