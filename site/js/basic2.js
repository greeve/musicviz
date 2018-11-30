function random (start, end) {
    var range = end - start;
    return start + Math.floor(Math.random() * range);
}

function randomPick (array) {
    var length = array.length;
    var index = random(0, array.length);
    return array[index];
}

function ascending (a, b) {
    return typeof a === 'string' ?  a.localeCompare(b) : a.size - b.size;
}
function descending (a, b) {
    return typeof a === 'string' ?  b.localeCompare(a) : b.size - a.size;
}

function randomComparator (d) {
    return randomPick([-1, 0, 1]);
}

function capitalize (str) {
    return str[0].toUpperCase() + str.substr(1);
}

var width = 1024;
var height = 768;
var color = d3.scale.category20();
var sizeScale = d3.scale.quantile().domain([20, 80]).range(d3.range(20, 80, 4));
var delayScale = d3.scale.linear().domain([0, 400]).range([0, 300]);

var data = d3.range(0, 25).map(function (i) {
    return {
        index: i,
        prop1: randomPick(['a', 'b', 'c']),
        prop2: randomPick(['a', 'b', 'c', 'd', 'e']),
        x: random(width / 2 - 100, width / 2 + 100),
        y: random(height / 2 - 100, height / 2 + 100),
        color: color(i),
        shape: randomPick(['circle']),
        size: random(20, 80)
    };
});

var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

var shapes = svg.selectAll('.shape').data(data)
    .enter()
    .append('g')
    .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
    .attr('data-size', function (d) { return d.size; })
    .attr('data-shape', function (d) { return 'circle'; });

var circles = shapes.append('circle')
    .attr('r', function (d) { return d.size / 2; })
    .attr('fill', function (d) { return d.color; });

var grid = d3.layout.grid()
    .width(width)
    .height(height)
    .colWidth(100)
    .rowHeight(100)
    .marginTop(75)
    .marginLeft(50)
    .sectionPadding(100)
    .data(data);

function transition () {
    svg.attr('height', grid.height());
    shapes.transition()
        .duration(750)
        .delay(function (d) { return delayScale(d.groupIndex * 150 + d.index * 1); })
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });
}

grid.groupBy('shape');
grid.sort(null, descending);
transition();
