angular.module('reading-quantified.controllers', [

]).
controller('DashboardCtrl', function($scope, Book) {
  var bookData = Book.get();
  bookData.$promise.then(function() {
    var books = bookData.results;
    $scope.books = books;
  });
}).
controller('AverageDaysToFinishCtrl', function($scope) {
  $scope.getAverageDaysToFinish = function(books) {
    var sum = 0.0;
    var numberOfBooks = 0;
    angular.forEach(books, function(book) {
      sum += book.daysToFinish;
      numberOfBooks += 1;
    });

    return sum / numberOfBooks;
  };
}).
controller('TableCtrl', function($scope) {
  $scope.headings = [
    {
      'predicate': 'title',
      'label': 'Title',
      'colWidth': 'col-sm-6'
    },
    {
      'predicate': 'dateStarted',
      'label': 'Date started',
      'colWidth': 'col-sm-2'
    },
    {
      'predicate': 'dateFinished',
      'label': 'Date finished',
      'colWidth': 'col-sm-2'
    },
    {
      'predicate': 'daysToFinish',
      'label': 'Days to finish',
      'colWidth': 'col-sm-2'
    }
  ];
  $scope.predicate = 'dateFinished';
  $scope.reverse = true;

  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };

  $scope.showCaretUp = function(predicate) {
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

  $scope.showCaretDown = function(predicate) {
    var show = false;

    if(($scope.predicate === predicate && $scope.reverse)) {
      var show = true;
    }

    return show;
  };
});
