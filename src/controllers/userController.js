// const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:userController');
// para autenticar los datos de signin
const passport = require('passport');

function userController() {
  function userSignUp(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async function addUser() {
      const { username, password } = req.body;
      const user = { username, password };
      debug(user);
      if (user.username) {
        let client;
        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          debug('Server connected');

          const db = client.db(dbName);

          const col = db.collection('users');

          const existsUser = await col.find({ username: user.username }).toArray();
          debug(existsUser);

          if (existsUser[0]) {
            debug('User already exists');
            res.redirect('/auth/signIn');
          } else {
            const response = await col.insertOne(user);

            req.login(response.ops[0], () => {
              res.redirect('/auth/profile');
            });
          }
        } catch (err) {
          debug(err.stack);
        } finally {
          await client.close();
          debug('Connection closed');
        }
      } else {
        res.redirect('/');
      }
    }());
  }

  function userSignIn() {

  }
  return {
    userSignUp,
    userSignIn
  };
}

module.exports = userController;
