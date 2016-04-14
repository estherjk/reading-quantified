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

  factory.getStatsByMonth = function(books, ranAt) {
    var stats = {};
    angular.forEach(books, function(book) {
      var date = $filter('date')(book.dateFinished.iso, 'MMM yyyy', 'UTC');

      stats[date] = {
        'numberOfBooks': stats[date] ? stats[date]['numberOfBooks'] + 1 : 1,
        'sum': stats[date] ? book.daysToFinish + stats[date]['sum'] : book.daysToFinish
      };
    });

    // If current month is not in stats, add it with 0 values
    var ranAtIso = $filter('date')(ranAt.iso, 'MMM yyyy', 'UTC');
    if(!(ranAtIso in stats)) {
      stats[ranAtIso] = {
        'numberOfBooks': 0,
        'sum': 0
      };
    }

    return stats;
  };

  factory.getNumberOfBooksByMonth = function(stats) {
    var statsArray = [];
    angular.forEach(stats, function(value, key) {
      statsArray.push({
        'date': key,
        'value': value.numberOfBooks
      });
    });

    return statsArray;
  };

  factory.getAverageDaysToFinishByMonth = function(stats) {
    var statsArray = [];
    angular.forEach(stats, function(value, key) {
      var result = value.numberOfBooks == 0 ? 0 : (value.sum / value.numberOfBooks).toFixed(1);

      statsArray.push({
        'date': key,
        'value': result
      });
    });

    return statsArray;
  };

  return factory;
});
