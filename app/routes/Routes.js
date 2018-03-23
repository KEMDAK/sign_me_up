/**
* This function configures the routes of the entire application.
* @param  {express} app An instance of the express app to be configured.
* @ignore
*/

module.exports = function(app) {

    /* allowing cross origin requests */
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', "http://localhost:8000");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, User_Agent, Authorization');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        }

        next();
    });

    /*********************
    *                    *
    * Translation routes *
    *                    *
    **********************/
    require('./resources/TranslationResource')(app);
    /*====================================================================================================================================*/

    /* any other request will be treated as not found (404) */
    app.use(function(req, res, next) {
        if(!res.headersSent){
            res.status(404).json({
                status:'failed',
                message: 'The requested route was not found.'
            });
        }

        next();
    });
};
