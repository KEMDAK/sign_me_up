/**
* @module Translation Controller
* @description The controller that is responsible of handling requests that deals with translation requests.
*/

/**
* This function handles translation requests
* @param  {HTTP}   req The request Object
* @param  {HTTP}   res The response Object
* @param  {Function} next Callback function that is called once done with handling the request
*/
module.exports.translate = function (req, res, next) {
    var errors = [];
    
    if (!req.files) {
        errors.push({
            param: 'file',
            type: 'required'
        });
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'failed',
            errors: errors
        });
    }
    
    let file = req.files.file;
    
    // Use the mv() method to place the file somewhere on your server
    file.mv(__dirname + '/../../temporaryFiles/' + process.pid + '.mp3', function(err) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error.'
            });
        }
        
        res.send('File uploaded!');
    });
};
