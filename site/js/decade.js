function tableChart() {
    var chart = function chart(selector, data) {
        console.log(data);

        var table = d3.select(selector).append('div').attr('class', 'table');

        for (var i=0; i < data.length; i++) {
            var tbodyRow = table.append('a').attr('class', 'table-row fa').attr('data-audio', 'audio/nbc_chime_diy.mp3');
            tbodyRow.append('div').attr('class', 'table-cell').text(data[i].title);
            tbodyRow.append('div').attr('class', 'table-cell').text(data[i].released);
            tbodyRow.append('div').attr('class', 'table-cell').text(data[i].artists);
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

;/*SIMPLE AUDIO PLAYER*/(function() {
    // https://stackoverflow.com/a/34487069/383904
    var AUD = document.createElement("audio"),
        BTN = document.querySelectorAll("[data-audio]"),
        tot = BTN.length;

    function playPause() {
        // Get track URL from clicked element's data attribute
        var src = this.dataset.audio;
        // Are we already listening that track?
        if(AUD.src != src) AUD.src = src;
        // Toggle audio play() / pause() methods
        AUD[AUD.paused ? "play" : "pause"]();
        // Remove active class from all other buttons
        for(var j=0;j<tot;j++) if(BTN[j]!=this) BTN[j].classList.remove("on");
        // Add active class to clicked button
        this.classList.toggle("on");
        // Track ended? (Remove active class etc)
        AUD.addEventListener("ended", playPause);
    }

    for(var i=0;i<tot;i++) BTN[i].addEventListener("click", playPause);

}());
