/* loading the environment variables */
require('dotenv').config({silent: true});

const express          = require('express');
const app              = express();
const bodyParser       = require('body-parser');
const methodOverride   = require('method-override');
const fileUpload       = require('express-fileupload');

/* serving static files */
app.use('/', express.static(__dirname + '/public'));

/* setting up the file uploader */
app.use(fileUpload({ safeFileNames: true, preserveExtension: true, abortOnLimit: true }));

/* setting up the app to accept (DELETE, PUT...etc requests) */
app.use(methodOverride());

/* initializing routes */
require('./app/routes/Routes.js')(app);

/* listening to requests */
const port = (process.env.ENV === 'prod')? 80 : process.env.PORT;
app.listen(port, function() {
    console.log('Listening on port ' + port + '...');
});