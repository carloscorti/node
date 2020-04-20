const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRouter');

const authRouter = express.Router();
function router() {
  authRouter.route('/signUp')
    .post((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function addUser() {
        const { username, password } = req.body;
        const user = { username, password };
        let client;
        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          debug('Server connected');

          const db = client.db(dbName);

          const response = await db.collection('users').insertOne(user);

          req.login(response.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err.stack);
        } finally {
          await client.close();
          debug('Connection closed');
        }
      }());
    });

  authRouter.route('/profile')
    .get((req, res) => {
      // req es response.ops[0]
      res.json(req.user);
    });


  return authRouter;
}

module.exports = router;
