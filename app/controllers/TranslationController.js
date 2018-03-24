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

var jobMap = {};

/**
* This function handles translation requests
* @param  {HTTP}   req The request Object
* @param  {HTTP}   res The response Object
* @param  {Function} next Callback function that is called once done with handling the request
*/
module.exports.translate = function (req, res, next) {
    console.log("entered translate.");
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
    const fileNumber = generateRandomNumber(10);
    
    // Use the mv() method to place the file somewhere on your server
    var filename = __dirname + '/../../temporaryFiles/' + process.pid + '.mp3';
    file.mv(filename, function(err) {
        if (err) {
            jobMap[fileNumber].status = false;
            return;
        }
        
        res.status(200).json({
            status: 'succeeded',
            message: 'Translation succeeded.',
            jobID: fileNumber
        });
        
        jobMap[fileNumber] = {};
        jobMap[fileNumber].status = null;
        
        console.log('sound uploaded.');
        var exec = require('child_process').exec;
        exec('python ./scripts/transcribe.py ' + filename + ' ' + fileNumber, function (err, stdout, stderr) {
            if (err) {
                jobMap[fileNumber].status = false;
                return;
            }
        
            var json = JSON.parse(stdout);
            var text = json.results.transcripts[0].transcript.toLowerCase();
            jobMap[fileNumber].text = text;
            text = text.substring(0, text.length - 1);
        
            console.log('sound transcribed: ' + text);
            
            text = 'fourth of july';
            text = text.split(/\s/);
            console.log("text: " + text);
            var translation = [];
            //TODO translate the text
            for (var i = 0; i < text.length; ++i) {
                for (var j = text.length - 1; j >= i; --j) {
                    var segment = text.slice(i, j + 1).join('-') + '.gif';
                    console.log(text.slice(i, j + 1));
                    console.log(segment);
                    console.log(binarySearch(dataset, segment));
                    if(binarySearch(dataset, segment) > -1) {
                        translation.push(__dirname + '/../../dataset/' + segment);
                        i = j;
                    }
                }
            }
            
            if (translation.length == 0) {
                jobMap[fileNumber].status = false;
                return;
            }
            
            console.log('translation completed: ' + translation);
            
            var filename = __dirname + '/../../public/' + fileNumber + '.gif';
            
            exec('python ./scripts/compactGifs.py -il ' + translation.join(',') + ' -of ' + filename, function (err, stdout, stderr) {
                if (err) {
                    jobMap[fileNumber].status = false;
                    return;
                }
                
                console.log('gif generated.');
                jobMap[fileNumber].status = true;
            });
        });
    });
};

/**
* This function handles polling requests
* @param  {HTTP}   req The request Object
* @param  {HTTP}   res The response Object
* @param  {Function} next Callback function that is called once done with handling the request
*/
module.exports.isDone = function (req, res, next) {
    var id = req.params.id;
    res.status(200).json({
        status: 'succeeded',
        isDone: jobMap[id].status,
        jobID: jobMap[id].status? id : undefined,
        gifURL: jobMap[id].status? 'http://' + process.env.DOMAIN + ':' + process.env.PORT + '/' + id + '.gif' : undefined,
        text: jobMap[id].status? jobMap[id].text : undefined
    });
};

var binarySearch = function (arr, val) {
    var ans = -1;
    var l = 0;
    var h = arr.length - 1;
    
    while(l <= h) {
        const mid = (l + h) / 2;
        const compare = val.localeCompare(arr[mid]);
        
        if(compare == 1) {
            l = mid + 1;
        }
        else if(compare == -1) {
            h = mid - 1;
        }
        else {
            ans = mid;
            break;
        }
    }
    
    return ans;
};

var generateRandomNumber = function (l) {
    var res = '';
    for (var i = 0; i < l; i++) {
        var cur = Math.floor(Math.random() * 10);
        res += cur;
    }
    
    return res;
};
