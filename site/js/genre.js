function bubbleChart() {
    var width = constants.CHART_WIDTH;
    var height = constants.CHART_HEIGHT;

    var center = { x: width / 2, y: height / 2 };

    var forceStrength = 0.03;

    var svg = null;
    var node = null;
    var nodes = [];

    function charge(d) {
        return -Math.pow(d.radius, constants.CHARGE) * forceStrength;
    }

    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

    simulation.stop();

    var fillColor = d3.scaleOrdinal(d3.schemePaired);

    function createNodes(data) {
        var maxAmount = d3.max(data, function (d) { return +d.count; });

        var radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([constants.RADIUS_SCALE_MIN, constants.RADIUS_SCALE_MAX])
            .domain([0, maxAmount]);

        var myNodes = data.map(function (d, index) {
            return {
                id: index + 1,
                name: d.name,
                slug: d.slug,
                radius: radiusScale(+d.count),
                value: +d.count,
                x: Math.random() * constants.CHART_WIDTH,
                y: Math.random() * constants.CHART_HEIGHT
            };
        });

        myNodes.sort(function (a, b) { return b.count - a.count; });

        return myNodes;
    }

    var chart = function chart(selector, data) {
        nodes = createNodes(data);

        svg = d3.select(selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        node = svg.selectAll('circle')
            .data(nodes, function (d) { return d.id; })
            .enter().append('g')
            .on('click', bubbleClick);

        var circle = node.append('circle')
            .attr('class', 'bubble')
            .attr('r', 0)
            .attr('fill', function (d) { return fillColor(d.name); });

        var circleText = node.append('text')
            .attr('dy', '0.35em')
            .style('font-size', '1.75em')
            .attr('fill-opacity', '0')
            .attr('fill', function (d) { return d3.rgb(fillColor(d.name)).darker(3); })
            .attr('text-anchor', 'middle')
            .text(function (d) { return d.name; });

        circleText.transition()
            .style('fill-opacity', '1')
            .duration(2000);

        circle.transition()
            .duration(2000)
            .attr('r', function (d) { return d.radius; });

        simulation.nodes(nodes);

        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

        simulation.alpha(1).restart();
    }

    function ticked() {
        node.attr('transform', function (d) {
            var k = 'translate(' + d.x + ',' + d.y + ')';
            return k;
        })
    }

    return chart;
}

function bubbleClick(d) {
    window.location.href = 'style.html?' + 'genre=' + genreParam + '&' + 'style=' + d.slug;
}

function getURLParameter(name) {
    return location.search.replace('\?genre=', '');
}

var genreParam = getURLParameter('genre');

// Start Here

var singleGenreChart = bubbleChart();

var data = musicviz;

var nav = d3.select('nav');
console.log(nav);
nav.append('a').attr('href', 'index.html').append('span').html('Genres');
nav.append('a').attr('href', window.location.href).append('span').html(data[genreParam].name);

singleGenreChart('#viz', Object.values(data[genreParam].styles));
