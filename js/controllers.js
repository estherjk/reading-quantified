angular.module('reading-quantified.controllers', [

]).
controller('DashboardCtrl', function($scope, Book) {
  var bookData = Book.get();
  bookData.$promise.then(function() {
    var books = bookData.results;
    $scope.books = books;

    var numberOfBooks = books.length;
    $scope.numberOfBooks = numberOfBooks;

    $scope.getAverageDaysToFinish = function() {
      var sum = 0.0;
      angular.forEach(books, function(book) {
        sum += book.daysToFinish;
      });

      return sum / numberOfBooks;
    };
  });
}).
controller('TableCtrl', function($scope) {
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
    else if($scope.predicate !== predicate && $scope.hover === predicate) {
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
