angular.module('reading-quantified.services', [
  'ngResource'
]).
factory('Book', function($resource, config) {
  return $resource('https://api.parse.com/1/classes/Book', null, {
    'get': {
      method: 'GET',
      headers: {
        'X-Parse-Application-Id': config.PARSE_APP_ID,
        'X-Parse-REST-API-Key': config.PARSE_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  });
});
