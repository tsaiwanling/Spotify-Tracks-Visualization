function ArtistOutput(data, artistList){
    // title
    d3.select("#analysis").style("opacity", 0);
    var artistTitle =titleContainer
    .append("div")
    .attr("class", "list-title");

    artistTitle.append("div")
        .text("#")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "3vw");

        artistTitle.append("div")
        .text("Artist")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "16vw");

    // artist list
    var artistItems = songContainer.selectAll("div")
        .data(artistList)
        .enter()
        .append("div")
        .attr("class", "artist-item")
        .attr("name", "song-name")
        .style("align-items", "center")
        .style("margin", "5px")
        .style("width", "auto")
        .style("opacity", 0.7);
    
    artistItems.append("div")
        .text(function(d, i) { return i+1;})
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "3vw")
        .style("height", "auto");

    artistItems.append("div")
        .text(function(d) { return d; })
        .attr("class", "artist_name")
        .style("display", "inline-block")
        .style("padding", "5px")
        .style("width", "40vw")
        .on("mousemove", function(event,d) {
            divTooltip.transition()
                .duration(200)
                .style("opacity", .9);

            var d_song = d3.filter(data, function(dd){return dd.artists.split(";").includes(d)});

            divTooltip.html(d+"'s songs <hr>"+ "1." + d_song[0].track_name
            + "</br>2. " + d_song[2].track_name)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
            })
        .on("click", function(event, d){
            var d_song = d3.filter(data, function(dd){return dd.artists.split(";").includes(d)});
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
        })
        .on("mouseout", function(event, d) {
            divTooltip.transition()
            .duration(500)
            .style("opacity", 0);
            });;
}