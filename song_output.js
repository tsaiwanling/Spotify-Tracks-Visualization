function SongOutput(data, songList){   
    // title
    var songTitle =titleContainer
    .append("div")
    .attr("class", "list-title");

    songTitle.append("div")
        .text("#")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "2vw");

    songTitle.append("div")
        .text("title")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "16vw");

    songTitle.append("div")
        .text("Artist")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "15vw");
    
    songTitle.append("div")
        .text("Album")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "15vw");
    
    songTitle.append("div")
        .text("Time")
        .style("padding-left", "auto")
        .style("display", "inline-block")
        .style("width", "8vw")
        .style("text-align", "right");

    // song list
    var songItems = songContainer.selectAll("div")
    .data(songList)
    .enter()
    .append("div")
    .attr("class", "song-item")
    .attr("name", "song-name")
    .style("display", "inline-flex")
    .style("align-items", "center")
    .style("margin", "5px")
    .style("width", "auto")
    .style("opacity", 0.7);

    songItems.append("div")
        .text(function(d, i) { return i+1;})
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "2vw")
        .style("height", "auto");

    songItems.append("div")
        .style("background-color", function(d) {if(d.explicit == "True"){return "red"}else{return "green"}})
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "0.3vw")
        .style("height", "0.3vw")
        .style("border-radius", "1vw")
        .on("mousemove", function(event,d) {
            divTooltip.transition()
                .duration(200)
                .style("opacity", .9);
            if(d.explicit == 'True'){
                divTooltip.html('explicit')
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            }
            else{
                divTooltip.html('no explicit')
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            }
            })
        .on("mouseout", function(event, d) {
            divTooltip.transition()
            .duration(500)
            .style("opacity", 0);
            });;;

    songItems.append("div")
        .text(function(d) { return d.track_name; })
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "15vw");

    songItems.append("div")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "15vw")
        .selectAll("text").data(function(d) { return d.artists.split(";")})
        .enter().append("p")
        .attr("class", "artist_name")
        .style("display", "inline-block")
        .style("padding-left", '5px')
        .text(function(d) { return d+';'; })   
        .on("click", function(event, d){
            let buttonList = container.querySelectorAll("button");
            buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 1; })
            document.getElementById("genre-menu").style.opacity = 1;

            var d_song = d3.filter(data, function(dd){return dd.artists.split(";").includes(d);});
            d_song = removeDuplicateRows([...d_song], 'track_id')
            titleContainer.selectAll("div").remove();
            songContainer.selectAll("div").remove();
            analysisContainer.selectAll("div").remove();
            titleContainer.append("div")
            .style("text-align", "center")
            .text(d)
            .style("font", "20px sans-serif")
            .style("font-weight", "bold");
            SongOutput(data, d_song);
            divTooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

    songItems.append("div")
        .attr("class", "artist_name")
        .text(function(d) { return d.album_name; })
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "15vw")
        .on("click", function(event, d){
            let buttonList = container.querySelectorAll("button");
            buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 1; })
            document.getElementById("genre-menu").style.opacity = 1;
            var d_song = d3.filter(data, function(dd){return dd.album_name.includes(d.album_name);});
            d_song = removeDuplicateRows([...d_song], 'track_id')
            titleContainer.selectAll("div").remove();
            songContainer.selectAll("div").remove();
            analysisContainer.selectAll("div").remove();
            titleContainer.append("div")
            .style("text-align", "center")
            .text(d.album_name)
            .style("font", "20px sans-serif")
            .style("font-weight", "bold");
            SongOutput(data, d_song);
            divTooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });;

    songItems.append("div")
        .text(function(d) { return Math.floor(d.duration_ms/1000/60) + ":" + Math.floor((d.duration_ms/1000) % 60).toFixed(0).padStart(2, '0'); })
        .style("padding-left", "auto")
        .style("padding-right", "5px")
        .style("display", "inline-block")
        .style("width", "8vw")
        .style("text-align", "right");
    
    // Mode
    d3.select("#analysis").style("opacity", 1);
    d3.select("#analysis").append("div").text("Song's Information");
    var Song = d3.map(songList, function(d){return d.mode});
    var Svg = d3.select("#analysis")
                    .append("div")
                    .attr("class", "mode")
                    .text("Mode")
                    .append("svg");
    mode(Svg, Song)
    //Time Signature
    var Song = countOccurrences(d3.map(songList, function(d){return +d.time_signature}));
    var Svg = d3.select("#analysis")
                    .append("div")
                    .attr("class", "timeSign")
                    .text("Time Signature")
                    .append("svg");
                    
    var result = Object.keys(Song).map(function(key) {
        return {"name": key, "percent":(Song[key]/songList.length*100).toFixed(2)};
    });
    PieChart(Svg, result);
    // Energy
    var Song = d3.map(songList, function(d){return +d.energy});
    var Svg = d3.select("#analysis")
                    .append("div")
                    .attr("class", "distribution")
                    .text("Energy")
                    .append("svg");
    dist1(Svg, Song)
    // Loudness
    var Song = d3.map(songList, function(d){return +d.loudness});
    var Svg = d3.select("#analysis")
                    .append("div")
                    .attr("class", "distribution")
                    .text("Loudness")
                    .append("svg");
    var Svg, [w, h] = dist2(Svg, Song)
    Svg.append("text")
        .attr("x", w*2/3*1.27)
        .attr("y", h*2/3*1.3)
        .text("dB")
        .attr("fill", "white");
    // Valence
    var Song = d3.map(songList, function(d){return +d.valence});
    var Svg = d3.select("#analysis")
                    .append("div")
                    .attr("class", "distribution")
                    .text("Valence")
                    .append("svg");
    var Svg, [w, h] = dist1(Svg, Song);
    Svg.append("text")
            .attr("x", w/6)
            .attr("y", h*0.98)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "normal")
            .text("Sadness");
    Svg.append("text")
            .attr("x", w/6 + w*2/3)
            .attr("y", h*0.98)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "normal")
            .text("Happiness");


    // Instrumentalness
    var Song = d3.map(songList, function(d){return +d.instrumentalness});
    var Svg = d3.select("#analysis")
                    .append("div")
                    .attr("class", "distribution")
                    .text("Instrumentalness")
                    .append("svg");
    var Svg, [w, h] = dist1(Svg, Song);
    Svg.append("text")
            .attr("x", w/6)
            .attr("y", h*0.98)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "normal")
            .text("Vocal");
    Svg.append("text")
            .attr("x", w/6 + w*2/3)
            .attr("y", h*0.98)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "normal")
            .text("No Vocal");

    // Tempo
    var Song = d3.map(songList, function(d){return +d.tempo});
    var Svg = d3.select("#analysis")
                    .append("div")
                    .attr("class", "distribution")
                    .text("Tempo")
                    .append("svg");
    var Svg, [w, h] = dist2(Svg, Song);
    Svg.append("text")
            .attr("x", w/6)
            .attr("y", h*0.98)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "normal")
            .text("Low");
    Svg.append("text")
            .attr("x", w/6 + w*2/3)
            .attr("y", h*0.98)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "normal")
            .text("High");
}