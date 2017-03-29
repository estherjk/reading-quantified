angular.module('reading-quantified.controllers', [

]).
controller('DashboardCtrl', function($scope, $filter, Book, Cron, BookMetrics) {
  $scope.isLoaded = false;

  $scope.bookData = Book.get({
    'order': 'dateFinished'
  });

  var books;
  var cronData = Cron.get({
    'order': '-ranAt',
    'limit': 1
  });

  cronData.$promise.then(function() {
    $scope.ranAt = cronData.results[0].ranAt;

    $scope.bookData.$promise.then(function() {
      $scope.isLoaded = true;

      books = $scope.bookData.results;
      $scope.numberOfBooksFinishedPerYear = BookMetrics.getNumberOfBooksFinishedPerYear(books);
      
      computeStatsByYear($scope.year);
    });
  });

  $scope.year = "2017";
  $scope.$watch("year", function(newValue, oldValue) {
    if(newValue != oldValue) {
      computeStatsByYear(newValue);
    }
  });

  $scope.headings = [
    {
      'predicate': 'title',
      'label': 'Title',
      'colWidth': 'col-sm-6'
    },
    {
      'predicate': 'dateStarted.iso',
      'label': 'Date started',
      'colWidth': 'col-sm-2'
    },
    {
      'predicate': 'dateFinished.iso',
      'label': 'Date finished',
      'colWidth': 'col-sm-2'
    },
    {
      'predicate': 'daysToFinish',
      'label': 'Days to finish',
      'colWidth': 'col-sm-2'
    }
  ];
  $scope.predicate = 'dateFinished.iso';
  $scope.reverse = true;

  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };

  $scope.showSortAsc = function(predicate) {
    return $scope.predicate === predicate && !$scope.reverse ? true : false;
  };

  $scope.showSortDesc = function(predicate) {
    return $scope.predicate === predicate && $scope.reverse ? true : false;
  };

  function computeStatsByYear(year) {
    var booksByYear = $filter('filterBooksByYear')(books, year);

    $scope.numberOfBooks = booksByYear.length;
    $scope.averageDaysToFinish = BookMetrics.getAverageDaysToFinish(booksByYear);
  }
});
