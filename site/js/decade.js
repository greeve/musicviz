function tableChart() {
    var chart = function chart(selector, data) {
        console.log(data);

        var table = d3.select(selector).append('table');
        var thead = table.append('thead');
        var theadRow = thead.append('tr');
        theadRow.append('th').text('audio');
        theadRow.append('th').text('title');
        theadRow.append('th').text('year released');
        theadRow.append('th').text('artists');
        var tbody = table.append('tbody');

        for (var i=0; i < data.length; i++) {
            var tbodyRow = tbody.append('tr');
            //tbodyRow.append('td').html('<a href="audio/nbc_chime_diy.mp3">🎶</a>');
            tbodyRow.append('td').html('<audio controls preload="none" src="audio/nbc_chime_diy.mp3" type="audio/mp3"></audio>');
            tbodyRow.append('td').html('<a href="https://search.lib.byu.edu/byu/record/lee.' + data[i].catalog_id + '">' + data[i].title + '</a>');
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

var data = musicviz;

var genreURL = 'genre.html?' + 'genre=' + genreParam;
var styleURL = 'style.html?' + 'genre=' + genreParam + '&' + 'style=' + styleParam;

var nav = d3.select('nav');
nav.append('a').attr('href', 'index.html').append('span').html('Genres');
nav.append('a').attr('href', genreURL).append('span').html(data[genreParam].name);
nav.append('a').attr('href', styleURL).append('span').html(data[genreParam].styles[styleParam].name);
nav.append('a').attr('href', window.location.href).append('span').html(decadeParam);

albumChart('#viz', Object.values(data[genreParam].styles[styleParam].decades[decadeParam].albums));
