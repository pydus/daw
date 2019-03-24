'use strict';
const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const webpackConfig = require('./webpack.config');
const host = webpackConfig.devServer.host || '127.0.0.1';
const publicPath = webpackConfig.output.publicPath;

//const api = require('./api/api');
//const auth = require('./auth/routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/api', api);
//app.use('/auth', auth);

app.use('*', (req, res) => {
  res.render('index', {
    cdn: `${app.get('env') === 'development' ? `http://${host}:8080` : ''}${publicPath}`
  });
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({status: err.status, message: err.message});
});

module.exports = app;
