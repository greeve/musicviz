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

var width = window.innerWidth;
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
        title: randomPick(['Jazz', 'Non-Music', 'Folk, World, & Country', 'Funk / Soul', 'Brass & Military']),
        size: random(20, 100)
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
    .attr('fill', function (d) { return d.color; })
    .on('click', bubbleClick);

var circleText = shapes.append('text')
    .attr('dy', function (d) { return (d.size / 2) * -1 - 10})
    .style('font-size', '1.5em')
    .attr('fill-opacity', '0')
    .attr('fill', function (d) { return d3.rgb(d.color).darker(3); })
    .attr('text-anchor', 'middle')
    .text(function (d) { 
        return d.title; 
    });

circleText.transition()
    .style('fill-opacity', '1')
    .duration(2000);

var grid = d3.layout.grid()
    .width(width)
    .height(height)
    .colWidth(200)
    .rowHeight(150)
    .marginTop(75)
    .marginLeft(100)
    .sectionPadding(100)
    .data(data);

function transition () {
    svg.attr('height', grid.height());
    shapes.transition()
        .duration(750)
        .delay(function (d) { return delayScale(d.groupIndex * 150 + d.index * 1); })
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });
}

function bubbleClick(d) {
    console.log(d);
    // window.location.href = 'genre.html?' + 'genre=' + d.slug;
}

grid.groupBy('shape');
grid.sort(null, descending);
transition();
