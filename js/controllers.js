angular.module('reading-quantified.controllers', [

]).
controller('DashboardCtrl', function($scope, Cron, Book, BookMetrics) {
  var cronData = Cron.get({
    'order': '-ranAt',
    'limit': 1
  });
  cronData.$promise.then(function() {
    $scope.ranAt = cronData.results[0].ranAt;
  });

  var bookData = Book.get();
  bookData.$promise.then(function() {
    var books = bookData.results;
    $scope.books = books;

    $scope.averageDaysToFinish = BookMetrics.getAverageDaysToFinish(books);

    var stats = BookMetrics.getStatsByMonth(books);
    $scope.numberOfBooksByMonth = BookMetrics.getNumberOfBooksByMonth(stats);
    $scope.averageDaysToFinishByMonth = BookMetrics.getAverageDaysToFinishByMonth(stats);
  });
}).
controller('TableCtrl', function($scope) {
  $scope.headings = [
    {
      'predicate': 'title',
      'label': 'Title',
      'colWidth': 'col-sm-6'
    },
    {
      'predicate': 'dateFinished',
      'label': 'Date finished',
      'colWidth': 'col-sm-3'
    },
    {
      'predicate': 'daysToFinish',
      'label': 'Days to finish',
      'colWidth': 'col-sm-3'
    }
  ];
  $scope.predicate = 'dateFinished';
  $scope.reverse = true;

  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };

  $scope.showSortAsc = function(predicate) {
    var show = false;

    if(($scope.predicate === predicate && !$scope.reverse)) {
      var show = true;
    }
    else if($scope.predicate !== predicate &&
      $scope.hover === predicate &&
      // Don't trigger hover capability on touch screens
      !('ontouchstart' in window)) {
      var show = true;
    }

    return show;
  };

  $scope.showSortDesc = function(predicate) {
    var show = false;

    if(($scope.predicate === predicate && $scope.reverse)) {
      var show = true;
    }

    return show;
  };
});
