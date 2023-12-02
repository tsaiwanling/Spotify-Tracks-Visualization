"use strict";
const dataPath = "dataset.csv"

var container = document.querySelector('.left-menu');
var sortBy = document.querySelector('.sort-menu');
var titleContainer = d3.select("#Title")
    .append("div")
    .attr("class", "listTitle");

var songContainer = d3.select("#my_dataviz")
    .append("div")
    .attr("class", "songList");

var genreContainer = d3.select("#genre-menu");
var analysisContainer = d3.select("#analysis");


var divTooltip = d3.select("body").append("div")
        .attr("class", "tooltipSmall")
        .style("opacity", 0);

const data = d3.csv(dataPath).then(function(data){
    var sorted_data = [...data] // copy origin data
    sorted_data.sort((a, b) => b["popularity"] -  a["popularity"]);
    var songList = removeDuplicateRows([...sorted_data], 'track_id')
    var top_genre = Array.from(new Set(d3.map(songList.slice(0, 500), function(d){return d.track_genre})));
    genreContainer.selectAll("div")
        .data(top_genre)
        .enter()
        .append("button")
        .attr("class", "genre-item")
        .attr("value", function(d){return d})
        .text(function(d){return d});
    major_rank(data, "Home");    // initial page - home
    let buttonList = container.querySelectorAll("button");
    var temp_order = '';
    buttonList.forEach(function(i){
        i.addEventListener("click", function(e){
            document.getElementById("myInput").value= "";
            var order = e.target.getAttribute("value");
            if(order == "" || order == temp_order){  // double click will refresh to the front page
                document.getElementById("homeOnly").style.display = "";
                analysisContainer.selectAll("div").remove();
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 1; })
                document.getElementById("genre-menu").style.opacity = 1;
                major_rank(data, "Home");
                temp_order = '';
            }else if(order == "speechiness" || order == "liveness" || order == "danceability"){
                document.getElementById("homeOnly").style.display = "none";
                analysisContainer.selectAll("div").remove();
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 0.5; })
                document.getElementById("genre-menu").style.opacity = 0.5;
                buttonList[0].style.opacity = 1;
                e.target.style.opacity = 1;
                e.target.style.font = '16px sans-serif';
                e.target.style.fontWeight = 'bold';
                type_rank(data, order);
                temp_order = order;
            }
            else{
                document.getElementById("homeOnly").style.display = "none";
                analysisContainer.selectAll("div").remove();
                buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 0.5; })
                document.getElementById("genre-menu").style.opacity = 1;
                buttonList[0].style.opacity = 1;
                e.target.style.opacity = 1;
                e.target.style.font = '16px sans-serif';
                e.target.style.fontWeight = 'bold';
                genre_rank(data, order);
                temp_order = order;
            }
        })
    })
    let sortList = sortBy.querySelectorAll("li");
    sortList.forEach(function(i){
        i.addEventListener("click", function(e){
            var sort = e.target.getAttribute("value");
            if(sort == "Popularity"){
                analysisContainer.selectAll("div").remove();
                major_rank(data, "Home")
            }
            else{
                analysisContainer.selectAll("div").remove();
                major_rank(data, sort)
            }
        })
    })
    
    return sorted_data;
})


function removeDuplicateRows(data, columnName) {
    const uniqueValues = new Set();
    return data.filter(row => !uniqueValues.has(row[columnName]) && uniqueValues.add(row[columnName]));
}

function type_rank(data, order){
    var type_songs = d3.filter(data, function(d){return d[order] >0.8;});
    type_songs.sort((a, b) => b[order] - a[order]);
    titleContainer.selectAll("div").remove();
    songContainer.selectAll("div").remove();
    SongOutput(data, type_songs.slice(0, 500));
}


function genre_rank(data, order){
    var genre_songs = d3.filter(data, function(d){return d.track_genre == order;});
    genre_songs.sort((a, b) => b["popularity"] - a["popularity"]);
    titleContainer.selectAll("div").remove();
    songContainer.selectAll("div").remove();
    SongOutput(data, genre_songs);
}


function major_rank(data, order){
    titleContainer.selectAll("div").remove();
    songContainer.selectAll("div").remove();
    var sorted_data = [...data] // copy origin data
    sorted_data.sort((a, b) => b["popularity"] - a["popularity"]);
    var songList = removeDuplicateRows([...sorted_data], 'track_id')
    if(order == "Home"){
        titleContainer.append("div")
                    .style("text-align", "center")
                    .text("Top 500")
                    .style("color", "white")
                    .style("font", "20px sans-serif")
                    .style("font-weight", "bold");
        SongOutput(sorted_data, songList.slice(0, 500));
    }
    else if(order == "Artist"){        
        var temp = d3.map(songList.slice(0, 1000), function(d){return d.artists.split(";")});
        var artist_arr =[].concat.apply([], temp);
        var result = sortDict(countOccurrences(artist_arr));
        var artistList = d3.map(result, function(d){return d[0]});
        ArtistOutput(songList, artistList);
    }
    else{
        var i = order.slice(-1);
        var order = order.slice(0, -1);
        order = order.toLowerCase();
        if(i==1){
            if(order == "valence"){
                titleContainer.append("div")
                .style("text-align", "center")
                .text("Valence Optimism")
                .style("color", "white")
                .style("font", "20px sans-serif")
                .style("font-weight", "bold");
            }
            else{
                titleContainer.append("div")
                    .style("text-align", "center")
                    .text("Instrumental(No Vocal)")
                    .style("color", "white")
                    .style("font", "20px sans-serif")
                    .style("font-weight", "bold");
            }
            sorted_data.sort((a, b) => b[order] - a[order]);
        }
        if(i==2){
            if(order == "valence"){
                titleContainer.append("div")
                .style("text-align", "center")
                .text("Valence Inactive")
                .style("color", "white")
                .style("font", "20px sans-serif")
                .style("font-weight", "bold");
            }
            else{
                titleContainer.append("div")
                    .style("text-align", "center")
                    .text("Vocal")
                    .style("color", "white")
                    .style("font", "20px sans-serif")
                    .style("font-weight", "bold");
            }
            sorted_data.sort((a, b) => a[order] - b[order]);
        }
        var songList = removeDuplicateRows([...sorted_data], 'track_id')
        SongOutput(sorted_data, songList.slice(0, 500));
    }
}

function countOccurrences(arr) {
    return arr.reduce((acc, currentValue) => {
    acc[currentValue] = (acc[currentValue] || 0) + 1;
    return acc;
    }, {});
}

function sortDict(Dict){
    var result = Object.keys(Dict).map(function(key) {
        return [key, Dict[key]];
    });
    result = result.sort((a, b) => b[1]-a[1])
    return result;
}   