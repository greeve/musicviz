function createBubbleChart(onBubbleClick, data, level) {
    console.log(data);
    var bleed = 50,
        width = 1024,
        height = 768;

    var pack = d3.layout.pack()
        .sort(null)
        .size([width, height + bleed * 2])
        .padding(2);

    var svg = d3.select("#viz").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(0," + -bleed + ")");

    var node = svg.selectAll(".node")
        .data(pack.nodes(data).filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click", onBubbleClick);

    node.append("circle")
      .attr("r", function(d) { return d.r; })
      .attr("class", level);

    node.append("text")
      .text(function(d) { return d.name; })
      .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
      .attr("dy", ".35em");
}

function bubbleClick(d) {
    switch (d.level) {
        case "genre":
            // Create a link going to the style level
            window.location.href = constants.HTML_ROOT + "?" + "genre=" + d.slug;
            break;
        case "style":
            // Create a link going to the decade level
            window.location.href = constants.HTML_ROOT + "?" + "genre=" + genreParam + "&" + "style=" + d.slug;
            break;
        case "decade":
            // Create a link going to the album level
            window.location.href = constants.HTML_ROOT + "?" + "genre=" + genreParam + "&" + "style=" + styleParam + "&" + "decade=" + d.name;
            break;
        default:
            console.log("uncaught case")
    }
}

function reformatForPack(data, genre, style, decade) {
    packData = []
    if (genre !== undefined) {
        if (style !== undefined) {
            decadeData = data[genre]["styles"][style]["decades"]
            for (var key in decadeData) {
                if (decadeData.hasOwnProperty(key)) {
                    value = decadeData[key]
                    packData.push({name: value.name, value: value.count, slug: key, level: "decade"});
                }
            }
        } else {
            styleData = data[genre]["styles"]
            for (var key in styleData) {
                if (styleData.hasOwnProperty(key)) {
                    value = styleData[key]
                    packData.push({name: value.name, value: value.count, slug: key, level: "style"});
                }
            }
        }
    } else {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                value = data[key]
                packData.push({name: value.name, value: value.count, slug: key, level: "genre"});
            }
        }
    }

    return {children: packData};
}

function reformatForTable(data, genre, style, decade) {
    return data[genre]["styles"][style]["decades"][decade]["albums"];
}

function reformatForSong(data, genre, style, decade, song) {
    albums = data[genre]["styles"][style]["decades"][decade]["albums"];
    for (var i in albums) {
        if (albums[i].catalog_id === song) {
            return albums[i];
        }
    }
}

function createTableChart(data) {
    console.log(data);

    data.sort(firstBy("released").thenBy("artists"));

    var table = d3.select("#viz").append("div").attr("class", "table");

    for (var i=0; i < data.length; i++) {
        if (data[i].audio_filepath) {
            var tbodyRow = table.append("a");
            var songURL = constants.HTML_ROOT + "?" + "genre=" + genreParam + "&" + "style=" + styleParam + "&" + "decade=" + decadeParam + "&" + "song=" + data[i].catalog_id;
            tbodyRow.attr("class", "table-row fa").attr("data-audio", "audio/" + data[i].audio_filepath).attr("href", songURL);
        } else {
            // var tbodyRow = table.append("span");
            // tbodyRow.attr("class", "table-row fa no-audio");

            var tbodyRow = table.append("a");
            if (constants.KIOSK === true) {
                tbodyRow.attr("class", "table-row fa no-audio");
            } else {
                tbodyRow.attr("class", "table-row fa no-audio").attr("href", "https://search.lib.byu.edu/byu/record/lee." + data[i].catalog_id).attr("target", "_blank");
            }
        }
        tbodyRow.append("div").attr("class", "table-cell").text(data[i].title);
        tbodyRow.append("div").attr("class", "table-cell").text(data[i].released);
        tbodyRow.append("div").attr("class", "table-cell").text(data[i].artists);
    }
}

function createMusicPlayer(data) {
    console.log(data);

    var playerContainer = d3.select("#viz").append("div").attr("class", "player");

    var title = playerContainer.append("h2").html(data.title);
    var artists = playerContainer.append("h1").html(data.artists);
    var released = playerContainer.append("h3").html(data.released);

    var audio = playerContainer.append("audio");
    audio.attr("controls", "");
    audio.attr("autoplay", "");
    var source = audio.append("source");
    source.attr("src", "audio/" + data.audio_filepath).attr("type", "audio/mpeg");
}

function getURLParameter(name) {
    var url = new URL(location);
    return url.searchParams.get(name);
}

// Start Here

var genreParam = getURLParameter("genre");
var styleParam = getURLParameter("style");
var decadeParam = getURLParameter("decade");
var songParam = getURLParameter("song");

var level;
var data;

var genreURL = constants.HTML_ROOT;
var styleURL =  genreURL + "?genre=" + genreParam;
var decadeURL = styleURL + "&style=" + styleParam;
var songURL = decadeURL + "&song=" + songParam;

var nav = d3.select("nav");
nav.append("a").attr("href", genreURL).append("span").attr("class", "genre").html("Genres");

if (genreParam) {
    nav.append("a").attr("href", styleURL).append("span").attr("class", "style").html(musicviz[genreParam].name);
}

if (genreParam && styleParam) {
    nav.append("a").attr("href", decadeURL).append("span").attr("class", "decade").html(musicviz[genreParam].styles[styleParam].name);
}

if (decadeParam) {
    var decadeURL;

    if (songParam) {
        var url = new URL(window.location);
        var params = new URLSearchParams(url.search);
        params.delete("song");
        decadeURL = url.origin + url.pathname + "?" + params.toString();
    } else {
        decadeURL = window.location.href;

    }
    nav.append("a").attr("href", decadeURL).append("span").attr("class", "album").html(decadeParam);
}

if (songParam) {
    //nav.append("a").attr("href", window.location.href).append("span").attr("class", "song").html(songParam);
}

if (songParam === null && decadeParam === null && styleParam === null && genreParam === null) {
    level = "genre";
    data = reformatForPack(musicviz);
} else if (songParam === null && decadeParam === null && styleParam === null && genreParam !== null) {
    level = "style";
    data = reformatForPack(musicviz, genreParam);
} else if (songParam === null && decadeParam === null && styleParam !== null && genreParam !== null) {
    level = "decade";
    data = reformatForPack(musicviz, genreParam, styleParam);
} else if (songParam === null && decadeParam !== null && styleParam !== null && genreParam !== null) {
    level = "album";
    data = reformatForTable(musicviz, genreParam, styleParam, decadeParam);
} else if (songParam !== null && decadeParam !== null && styleParam !== null && genreParam !== null) {
    level = "song";
    data = reformatForSong(musicviz, genreParam, styleParam, decadeParam, songParam);
}

if (level === "genre" || level === "style" || level === "decade") {
    createBubbleChart(bubbleClick, data, level);
} else if (level === "album") {
    createTableChart(data);
} else if (level === "song") {
    createMusicPlayer(data);
}
