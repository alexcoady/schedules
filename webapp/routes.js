var account = require('./account');

// Global vars
Routes = {};

module.exports = function (app) {

    app.get('/', function(req, res){

        res.render('index', {

            accounts: account.getDebug(),
            days: account.getDays(),
            months: account.getMonths(),
            getDerPayments: account.getDerPayments

        });
    });

    app.get('/add-payment', function(req, res){

        res.render('add-payment');
    });

    // Return the object for future requirements
    return Routes;
};
