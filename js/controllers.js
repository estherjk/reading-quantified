angular.module('reading-quantified.controllers', [

]).
controller('DashboardCtrl', function($scope, Book, Cron, BookMetrics) {
  $scope.isLoaded = false;

  $scope.bookData = Book.get({
    'order': 'dateFinished'
  });

  var cronData = Cron.get({
    'order': '-ranAt',
    'limit': 1
  });

  cronData.$promise.then(function() {
    $scope.ranAt = cronData.results[0].ranAt;

    $scope.bookData.$promise.then(function() {
      $scope.isLoaded = true;

      var books = $scope.bookData.results;

      $scope.numberOfBooks = $scope.bookData.results.length;
      $scope.averageDaysToFinish = BookMetrics.getAverageDaysToFinish(books);

      var stats = BookMetrics.getStatsByMonth(books, $scope.ranAt);

      $scope.numberOfBooksByMonth = BookMetrics.getNumberOfBooksByMonth(stats);
      $scope.averageDaysToFinishByMonth = BookMetrics.getAverageDaysToFinishByMonth(stats);
    });
  });
}).
controller('TableCtrl', function($scope, $filter) {
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

  $scope.filterSearch = function(book) {
    var re = new RegExp($scope.searchText, 'i');
    var dateFinishedString = $filter('date')(book.dateFinished.iso, 'MMMM d yyyy', 'UTC');

    return  re.test(book.title) ||
            re.test(dateFinishedString) ||
            re.test(book.daysToFinish);
  };
});
