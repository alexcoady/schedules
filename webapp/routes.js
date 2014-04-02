// Global vars
Routes = {};

module.exports = function (app) {

    app.get('/', function(req, res){

        res.render('index');
    });

    // Return the object for future requirements
    return Routes;
};
