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
});
