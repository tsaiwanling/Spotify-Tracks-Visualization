const mySearch = async () => {
    let buttonList = container.querySelectorAll("button");
    buttonList.forEach(function(j){ j.style.font = '15px sans-serif'; j.style.fontWeight = 'bold'; j.style.opacity = 1; })
    var input, filter;
    const new_data = await data
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    if(filter.length <2){
        return; // length too short cannot search
    }else if(filter.includes(" ")){
        var d_song = d3.filter(new_data, function(dd){
            return dd.track_name.toUpperCase().includes(filter) || dd.artists.toUpperCase().includes(filter) || dd.album_name.toUpperCase().includes(filter)
        });
        titleContainer.selectAll("div").remove();
        songContainer.selectAll("div").remove();
        analysisContainer.selectAll("div").remove();
        var d_song = removeDuplicateRows([...d_song], 'track_id')
        SongOutput(new_data, d_song);
    }else{
        var d_song = d3.filter(new_data, function(dd){
            return dd.track_name.toUpperCase().split(" ").includes(filter) || dd.artists.toUpperCase().split(";").includes(filter) || dd.album_name.toUpperCase().split(" ").includes(filter)
        });
        titleContainer.selectAll("div").remove();
        songContainer.selectAll("div").remove();
        analysisContainer.selectAll("div").remove();
        var d_song = removeDuplicateRows([...d_song], 'track_id')
        SongOutput(new_data, d_song);
    }
}