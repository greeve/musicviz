function genreChart() {
    var chart = function chart(selector, data, genre) {
        console.log('selector: ', selector);
        console.log('data: ', data);
        console.log('genre: ', genre);
    }

    return chart;
}

function getURLParameter(name) {
    return location.search.replace('\?genre=', '');
}

var genreParam = getURLParameter('genre');

// Start Here

var singleGenreChart = genreChart();

function display(error, data) {
    if (error) {
        console.log(error);
    }

    singleGenreChart('#viz', data, genreParam);
}

// Load Data

d3.csv('data/genre.csv', display);
