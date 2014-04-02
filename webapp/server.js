
var
// Dependencies
express = require('express'),
mongoose = require('mongoose'),

routes = require('./routes');

// Globals
app = express();

// App settings
app.set('view engine', 'jade');
app.set('views', process.cwd() + '/webapp/views');

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));

// This should always be the last middleware function (handles all errors)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke (check terminal)');
});

/* MIDDLEWARE STOPS HERE */
app.use(app.router);

app.use("/public", express.static(__dirname + '/../public'));

// Initialise routes and pass the 'app' to add requests
routes(app);

// Start the server
app.listen(3000, function () {

    console.log("Server: Server started, bitches!");
});
