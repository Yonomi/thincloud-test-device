'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const expresslogger = require('./middleware/expresslogger');

//

class WebApp {
  constructor(deviceManager){
    this.deviceManager = deviceManager;
    this.app = express();
    this.setConfig();
    this.initRoutes();
  }

  start(){
    this.app.listen(8082, console.log("app running on 8082"))
  }

  initRoutes(){
    let _this = this;
    this.app.get('/', function(req,res){
      res.redirect('/public/main.html')
    });

    this.app.get('/v1/device', function(req, res){
     res.send(_this.deviceManager.device)
    });

  }

  setConfig(){
    this.app.use(express.static(__dirname + '/public'));

    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // this.app.use(expresslogger(device._opts.logger));

    this.app.use(express.static(path.join(__dirname, 'public')));
  }
}

module.exports = WebApp;
