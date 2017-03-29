angular.module("reading-quantified.filters", [

]).
filter('filterBooksByYear', function($filter) {
  return function(books, year) {
    var filtered = [];

    angular.forEach(books, function(book) {
      if($filter('date')(book.dateFinished.iso, 'yyyy', 'UTC') == year ) {
        filtered.push(book);
      }
    });

    return filtered;
  };
});
