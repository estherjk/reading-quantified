angular.module("reading-quantified.directives", [

]).
directive("d3Bar", function($window) {
  return {
    restrict: "E",
    scope: {
      data: "="
    },
    link: function(scope, element, attrs) {
      var svg = d3.select(element[0])
                  .append("svg")
                  .style("width", "100%");

      // Browser onresize event
      window.onresize = function() {
        scope.$apply();
      }

      // Watch for resize event
      scope.$watch(function() {
        return angular.element($window)[0].innerWidth;
      }, function() {
        scope.render(scope.data);
      });

      // Watch for data changes and re-render
      scope.$watch("data", function(newVals, oldVals) {
        return scope.render(newVals);
      }, true);

      // d3 bar chart code
      scope.render = function(data) {
        // Remove all previous items before render
        svg.selectAll("*").remove();

        // If we don"t pass any data, return out of the element
        if(!data) return;

        var margin = {top: 0, right: 20, bottom: 0, left: 20},
            padding = {top: 0, right: 0, bottom: 0, left: 60},
            outerWidth = d3.select(element[0]).node().offsetWidth,
            outerHeight = 200,
            innerWidth = outerWidth - margin.left - margin.right,
            innerHeight = outerHeight - margin.top - margin.bottom,
            width = innerWidth - padding.left - padding.right,
            height = innerHeight - padding.top - padding.bottom;

        svg.attr("width", outerWidth)
           .attr("height", outerHeight)
          .append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
                  .range([0, width])
                  .domain([0, d3.max(data, function (d) {
                    return d.value;
                  })]);

        var y = d3.scale.ordinal()
                  .rangeRoundBands([height, 0], .1)
                  .domain(data.map(function (d) {
                    return d.label;
                  }));

        var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

        var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");

        var g = svg.append("g")
                   .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

        g.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

        g.append("g")
         .attr("class", "y axis")
         .attr("transform", "translate(" + 0 + ",0)")
         .call(yAxis);

        var bars = g.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("g");

        bars.append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", function (d) {
              return y(d.label);
            })
            .attr("height", y.rangeBand())
            .attr("width", function (d) {
              return x(d.value);
            });

        bars.append("text")
            .attr("class", "label")
            .attr("x", function (d) {
              return x(d.value) + 5;
            })
            .attr("y", function (d) {
              return y(d.label) + y.rangeBand() / 2 + 4;
            })
            .text(function (d) {
              return d.value;
            });
      };
    }
  };
});
