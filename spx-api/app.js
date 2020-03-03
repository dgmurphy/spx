var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/test-api');
var testPyRouter = require('./routes/test-py');
var testDisplayRouter = require('./routes/test-display');
var testDisplayEntRouter = require('./routes/test-display-ent');
var testNounChunkRouter = require('./routes/test-noun-chunks');
var testParseTreeARouter = require('./routes/test-parse-tree-a');
var testParseTreeBRouter = require('./routes/test-parse-tree-b');
var testPOSRouter = require('./routes/test-pos');


var app = express();

// Probably will forget this
console.log("**** Remember to ACTIVATE the needed Python Virtual Environment! ****")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.text());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/test-api", testAPIRouter);
app.use("/test-py", testPyRouter);
app.use("/test-display", testDisplayRouter);
app.use("/test-display-ent", testDisplayEntRouter);
app.use("/test-noun-chunks", testNounChunkRouter);
app.use("/test-parse-tree-a", testParseTreeARouter);
app.use("/test-parse-tree-b", testParseTreeBRouter);
app.use("/test-pos", testPOSRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
