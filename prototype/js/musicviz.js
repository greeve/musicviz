function bubbleChart() {
    var width = 940;
    var height = 700;

    var center = { x: width / 2, y: height / 2 };

    var forceStrength = 0.03;

    var svg = null;
    var node = null;
    var nodes = [];

    function charge(d) {
        return -Math.pow(d.radius, 2.2) * forceStrength;
    }

    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

    simulation.stop();

    var fillColor = d3.scaleOrdinal(d3.schemeCategory20);

    function createNodes(data) {
        var maxAmount = d3.max(data, function (d) { return +d.count; });

        var radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([20, 85])
            .domain([0, maxAmount]);

        var myNodes = data.map(function (d, index) {
            return {
                id: index + 1,
                name: d.name,
                radius: radiusScale(+d.count),
                value: +d.count,
                x: Math.random() * 900,
                y: Math.random() * 800
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

        node.append('text')
            .attr('dx', function (d) { return -10; })
            .attr('dy', '0.5em')
            .text(function (d) { return d.name; });

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
    console.log(d);
    window.location.href = 'genre.html?' + 'genre=' + slugify(d.name);
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// Start Here

var genreBubbleChart = bubbleChart();

function display(error, data) {
    if (error) {
        console.log(error);
    }

    genreBubbleChart('#viz', data);
}

// Load Data

d3.tsv('data/musicviz.tsv', display);
