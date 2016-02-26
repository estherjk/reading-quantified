angular.module('reading-quantified.directives', [

]).
directive('d3Line', function($window) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function(scope, element, attrs) {
      var svg = d3.select(element[0])
                  .append('svg')
                  .style('width', '100%');

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
      scope.$watch('data', function(newVals, oldVals) {
        return scope.render(newVals);
      }, true);

      // d3 line chart code
      scope.render = function(data) {
        // Remove all previous items before render
        svg.selectAll('*').remove();

        // If we don't pass any data, return out of the element
        if(!data) return;

        var margin = {
          top: 0,
          bottom: 20,
          left: 0,
          right: 0
        };
        var padding = 22;
        var width = d3.select(element[0]).node().offsetWidth - margin.left - margin.right;
        var height = 200 - margin.top - margin.bottom;
        var circleSize = 3;
        var circleSizeLarge = 5;

        var parseDate = d3.time.format('%b %Y').parse;

        var x = d3.time.scale()
                  .range([padding, width - padding]);

        var y = d3.scale.linear()
                  .range([height - padding, padding]);

        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient('bottom')
                      .ticks(d3.time.months)
                      .tickSize(3)
                      .tickFormat(d3.time.format('%b'));

        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient('left')
                      .ticks(5)
                      .innerTickSize(-width + 2*padding)
                      .outerTickSize(0)
                      .tickPadding(10);

        var line = d3.svg.line()
                     .x(function(d) { return x(parseDate(d.date)); })
                     .y(function(d) { return y(d.value); });

        x.domain(d3.extent(data, function(d) { return parseDate(d.date); }));
        y.domain([0, d3.max(data, function(d) { return parseFloat(d.value) })]);

        svg.attr('width', width + margin.left + margin.right);
        svg.attr('height', height + margin.top + margin.bottom);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (height - padding) + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .attr("transform", "translate(" + padding + ", 0)")
            .call(yAxis);

        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line);

        // Tool tip
        var tip = d3.tip()
                    .attr('class', 'd3-tip').html(function(d) {
                      return '<span>' + d.date + ': ' + d.value + '</span>';
                    })
                    .direction('n')
                    .offset([-10, 0]);
        svg.call(tip);

        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('cx', function (d) { return x(parseDate(d.date)); })
            .attr('cy', function(d) { return y(d.value); })
            .attr('r', circleSize)
            .on('mouseover', function(d) {
              tip.show(d);
              d3.select(this).attr('r', circleSizeLarge);
            })
            .on('mouseout', function(d) {
              tip.hide(d);
              d3.select(this).attr('r', circleSize);
            });
      };
    }
  };
});
