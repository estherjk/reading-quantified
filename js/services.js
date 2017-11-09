angular.module('reading-quantified.services', [
  'ngResource'
]).
factory('Book', function($resource, config) {
  return $resource('https://drejkim-reading-quantified.herokuapp.com/parse/classes/Book', null, {
    'get': {
      method: 'GET',
      headers: {
        'X-Parse-Application-Id': config.PARSE_APP_ID,
        'X-Parse-REST-API-Key': config.PARSE_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  });
}).
factory('Cron', function($resource, config) {
  return $resource('https://drejkim-reading-quantified.herokuapp.com/parse/classes/Cron', null, {
    'get': {
      method: 'GET',
      headers: {
        'X-Parse-Application-Id': config.PARSE_APP_ID,
        'X-Parse-REST-API-Key': config.PARSE_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  });
}).
factory('Labels', function($resource, config) {
  return $resource('https://api.trello.com/1/boards/564d07a87721d8698ff010d3/labels', null, {
    'get': {
      method: 'GET',
      isArray: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  });
}).
factory('ReadingList', function($resource, config) {
  return $resource('https://api.trello.com/1/lists/564d07a87721d8698ff010d6/cards', null, {
    'get': {
      method: 'GET',
      isArray: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  });
}).
factory('BookMetrics', function($filter) {
  var factory = {};

  factory.getAverageDaysToFinish = function(books) {
    var sum = 0.0;
    var numberOfBooks = 0;
    angular.forEach(books, function(book) {
      sum += book.daysToFinish;
      numberOfBooks += 1;
    });

    return sum / numberOfBooks;
  };

  factory.getNumberOfBooksFinishedPerYear = function(books) {
    var stats = {};
    angular.forEach(books, function(book) {
      var date = $filter('date')(book.dateFinished.iso, 'yyyy', 'UTC');
      stats[date] = {
        'numberOfBooks': stats[date] ? stats[date]['numberOfBooks'] + 1 : 1
      };
    });

    var statsArray = [];
    angular.forEach(stats, function(value, key) {
      statsArray.push({
        'label': key,
        'value': value.numberOfBooks
      });
    });

    return statsArray;
  };

  return factory;
});
