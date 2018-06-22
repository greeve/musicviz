function tableChart() {
    var chart = function chart(selector, data) {
        console.log(data);

        var table = d3.select(selector).append('table');
        var thead = table.append('thead');
        var theadRow = thead.append('tr');
        theadRow.append('th').text('Title');
        theadRow.append('th').text('Year Released');
        theadRow.append('th').text('Artists');
        var tbody = table.append('tbody');

        for (var i=0; i < data.length; i++) {
            var tbodyRow = tbody.append('tr');
            tbodyRow.append('td').text(data[i].title);
            tbodyRow.append('td').text(data[i].released);
            tbodyRow.append('td').text(data[i].artists);
        }

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

var albumChart = tableChart();

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

    albumChart('#viz', Object.values(data[genreParam].styles[styleParam].decades[decadeParam].albums));
}

// Load Data

d3.json('data/musicviz.json', display);
