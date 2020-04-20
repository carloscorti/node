const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRouter');

const authRouter = express.Router();
function router() {
  authRouter.route('/signUp')
    .post((req, res) => {
      debug(req.body);
      // devuelve la respuesta en formato json
      res.json(req.body);
    });


  return authRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
