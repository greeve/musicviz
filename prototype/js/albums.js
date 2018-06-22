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

    var genreURL = 'genre.html?' + 'genre=' + genreParam;
    var styleURL = 'style.html?' + 'genre=' + genreParam + '&' + 'style=' + styleParam;

    var breadcrumbs = d3.select('header').append('ul').attr('class', 'breadcrumbs')
    breadcrumbs.append('li').html('<a href="/">Genres</a>');
    breadcrumbs.append('li').html('<a href="' + genreURL + '">' + data[genreParam].name + '</a>');
    breadcrumbs.append('li').html('<a href="' + styleURL + '">' + data[genreParam].styles[styleParam].name + '</a>');
    breadcrumbs.append('li').html('<a href="' + window.location.href + '">' + decadeParam + '</a>');

    singleGenreChart('#viz', Object.values(data[genreParam].styles[styleParam].decades[decadeParam].albums));
}

// Load Data

d3.json('data/musicviz.json', display);
