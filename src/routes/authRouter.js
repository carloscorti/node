const express = require('express');
const debug = require('debug')('app:authRouter');
const passport = require('passport');

const userController = require('../controllers/userController');

// importo userAuthenticationController
const userAuthenticationController = require('../controllers/userAuthenticationControler');

const authRouter = express.Router();
function router(nav) {
  const { userSignUp } = userController();
  const { userAuthenticationMiddleware } = userAuthenticationController();

  authRouter.route('/signUp')
    .get((req, res) => { res.redirect('/'); })
    .post(userSignUp);

  authRouter.route('/signIn')
    // si un usuario se registro local strategy agrego user a req
    // si es asi no muestra la pagina signin signup
    .get((req, res) => {
      if (req.user) {
        res.redirect(nav[0].link);
      } else {
        res.render(
          'signin',
          {
            nav,
            title: 'Sign In',
          }
        );
      }
    })

    .post(passport.authenticate('local',
      {
        successRedirect: '/auth/profile',
        failureRedirect: '/',
      }));

  authRouter.route('/profile')

    .all((req, res, next) => {
      debug('from authRouter profile');
      userAuthenticationMiddleware(req, res, next);
    })

    .get((req, res) => {
      // req.user es response.ops[0]
      // y cuando redirije successRedirect: '/auth/profile', es userToCkeck
      res.render(
        'profile',
        {
          nav,
          title: nav[1].title,
          user: req.user,
        }
      );
    });

  authRouter.route('/logout')
    .all((req, res, next) => {
      debug('from authRouter logout');
      userAuthenticationMiddleware(req, res, next);
    })

    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });


  return authRouter;
}

module.exports = router;
