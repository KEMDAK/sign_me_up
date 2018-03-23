/**
* This function configures the authentication routes of the application.
* @param  {express} app An instance of the express app to be configured.
*/

module.exports = function(app) {
    
    const TranslationController = require('../../controllers/TranslationController');

    /**
    * A POST route responsible for translating from English text to American sign language
    * @var /api/translate POST
    * @name /api/translate POST
    * @example The route expects a form Object in the following format
    * {
    *   file: File [required]
    * }
    * @example The route responds with an object having the following format
    * {
    * 	status: succeeded/failed,
    * 	message: String showing a descriptive text,
    * 	translationURL: ,//TODO
    * 	errors:
    * 	[
    * 	  {
    * 	     param: the field that caused the error,
    * 	     value: the value that was provided for that field,
    * 	     type: the type of error that was caused ['required']
    * 	  }, {...}, ...
    * 	]
    *   }
    */
    app.post('/api/translate', TranslationController.translate);
};