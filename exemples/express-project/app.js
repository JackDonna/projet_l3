const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const sqlRouter = require('./routes/sql');
const neo4jRouter = require('./routes/neo4j');
const nodeRouter = require('./routes/node');
const connectRouter = require('./routes/connexion');
const mailRouter = require('./routes/mail');
const compression = require('compression');

const CLASSES = require('./controllers/cruds/crud_classes');
const insertClasses = false;

const EVENTS = require('./controllers/cruds/crud_event');
const insertEvent = false;
// Import the functions you need from the SDKs you need

if (insertClasses) {
	CLASSES.insertClassesFiles();
}

if (insertEvent) {
	EVENTS.insertTimetablesFiles();
}

const app = express();

app.use(
	session({
		secret: 'maxi tosma',
		resave: false,
		saveUninitialized: true,
		expires: 600000,
	})
);
app.use(compression());

var FCM = require('fcm-node');
var serverKey = require(__dirname + '/rdp-app-3a69f-firebase-adminsdk-3lvvx-551e1594dd.json'); //put the generated private key path here
var fcm = new FCM(serverKey);
console.log(fcm);
let message = {
	to: 'cSm0N-1-IN4rd-paxf9lhf:APA91bFwT3Z6rXc8Uq7h86TEqkmmGdSKUxjDLxZkIXH7Luv5e81pb0xBMqeMeQZfn-6WHVc3wUKgYSdywuUnPuQoMQ1M31KpiXBWYtghdtkesIZ-n5xvNJ-oVuSnWtZVE_it7lOBqIG4',
	notification: {
		title: 'test',
	},
};

fcm.send(message, function (err, response) {
	if (err) {
		console.error('Something has gone wrong!', err);
	} else {
		console.log('Successfully sent with response: ', response);
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', true);

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/sql', sqlRouter);
app.use('/neo4j', neo4jRouter);
app.use('/node', nodeRouter);
app.use('/connexion', connectRouter);
app.use('/mail', mailRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
