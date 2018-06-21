function bubbleChart() {
    var chart = function chart(selector, data) {
        console.log(data);
    }

    return chart;
}

function getURLParameter(name) {
    var url = new URL(location);
    return url.searchParams.get(name);
}

var genreParam = getURLParameter('genre');
var styleParam = getURLParameter('style');
var decadeParam = getURLParameter('decade');

// Start Here

var singleGenreChart = bubbleChart();

function display(error, data) {
    if (error) {
        console.log(error);
    }

    singleGenreChart('#viz', Object.values(data[genreParam].styles[styleParam].decades[decadeParam].albums));
}

// Load Data

d3.json('data/musicviz.json', display);
