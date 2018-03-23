/**
* @module Translation Controller
* @description The controller that is responsible of handling requests that deals with translation requests.
*/

const fs = require('fs');

const dataset = [];
const dataset_dir = __dirname + '/../../dataset/';

fs.readdirSync(dataset_dir).forEach(file => {
    dataset.push(file);
});
dataset.sort();

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
    var filename = __dirname + '/../../temporaryFiles/' + process.pid + '.mp3';
    file.mv(filename, function(err) {
        if (err) {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error.'
            });
        }
        
        var exec = require('child_process').exec;
        exec('python ./scripts/transcribe.py ' + filename + ' ' + process.env.COUNTER, function (err, stdout, stderr) {
            if (err) {
                return res.status(500).json({
                    status: 'failed',
                    message: 'Internal server error.'
                });
            }
            
            var json = JSON.parse(stdout);
            var text = json.text;
            
            //TODO translate the text
        });
    });
};
