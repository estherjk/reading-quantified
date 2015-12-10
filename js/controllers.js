angular.module('reading-quantified.controllers', [

]).
controller('DashboardCtrl', function($scope, Book) {
  $scope.bookData = Book.get();
}).
controller('DateCtrl', function($scope, Cron) {
  var cronData = Cron.get({
    'order': '-ranAt',
    'limit': 1
  });

  cronData.$promise.then(function() {
    $scope.ranAt = cronData.results[0].ranAt;
  });
}).
controller('KPIsCtrl', function($scope, BookMetrics) {
  $scope.bookData.$promise.then(function() {
    var books = $scope.bookData.results;

    $scope.numberOfBooks = $scope.bookData.results.length;
    $scope.averageDaysToFinish = BookMetrics.getAverageDaysToFinish(books);

    var stats = BookMetrics.getStatsByMonth(books);
    $scope.numberOfBooksByMonth = BookMetrics.getNumberOfBooksByMonth(stats);
    $scope.averageDaysToFinishByMonth = BookMetrics.getAverageDaysToFinishByMonth(stats);
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

  $scope.filterSearch = function(book) {
    var re = new RegExp($scope.searchText, 'i');
    var dateFinishedString = $filter('date')(book.dateFinished.iso, 'MMMM d yyyy', 'UTC');

    return  re.test(book.title) ||
            re.test(dateFinishedString) ||
            re.test(book.daysToFinish);
  };
});
