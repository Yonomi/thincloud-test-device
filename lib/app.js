'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const expresslogger = require('./middleware/expresslogger');

//

module.exports = ({ device } = {}) => {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expresslogger(device._log));

  app.use(express.static(path.join(__dirname, 'public')));

  app
    .use((req, res, next) => {
      req.device = device;
      next();
    })
    .get('/', (req, res, next) => {
      res.status(200).render('main', { device: req.device });
    })
    .post('/', (req, res, next) => {
      try {
        const state = JSON.parse(req.body.state);
        req.log.debug({ state }, 'update state');
        req.device.state = state;
        res.status(200).render('main', { device: req.device });
      } catch (err) {
        req.log.warn({ err }, 'unable to update state');
        res.status(404).render('main', { device: req.device, err });
      }
    });

  app.use(function (req, res, next) {
    res.status(404).render('404', { url: req.originalUrl });
  });

  app.use(function (err, req, res, next) {
    req.log.warn({ err }, 'system error');
    res.status(500).render('5xx', { err }, (err, html) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.send(html);
      }
    });
  });

  return app;
};
