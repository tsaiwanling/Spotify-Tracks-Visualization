function mode(svg, list){
    containerWidth = d3.select(".mode").node().getBoundingClientRect().width;
    containerHeight = d3.select(".mode").node().getBoundingClientRect().height * 0.5;
    
    svg.attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    svg1 = svg.append("g");
    w = (9 / 10) * containerWidth;
    padding = (containerWidth-w)/2


    var mode0 = d3.filter(list, function(d){return d==0}).length;
    var mode1 = d3.filter(list, function(d){return d==1}).length;
    svg1.append("rect")
        .attr("x", padding)
        .attr("y", containerHeight/4)
        .attr("width", w * mode0 /(mode0 + mode1))
        .attr("height", containerHeight/3)
        .attr("fill", "lightblue")
        .on("mousemove", function(event,d) {
            divTooltip.transition()
                .duration(200)
                .style("opacity", .9);
            divTooltip.html((mode0 /(mode0 + mode1) * 100).toFixed(2) + "%")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
            })
        .on("mouseout", function(event, d) {
            divTooltip.transition()
            .duration(500)
            .style("opacity", 0);
            });
    svg1.append("rect")
        .attr("x", (w * mode0 /(mode0 + mode1)+ padding))
        .attr("y", containerHeight/4)
        .attr("width", (w - w * mode0 /(mode0 + mode1)))
        .attr("height", containerHeight/3)
        .attr("fill", "pink")
        .on("mousemove", function(event,d) {
            divTooltip.transition()
                .duration(200)
                .style("opacity", .9);
            divTooltip.html(((1 - mode0 /(mode0 + mode1)) * 100).toFixed(2) + "%")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
            })
        .on("mouseout", function(event, d) {
            divTooltip.transition()
            .duration(500)
            .style("opacity", 0);
            });
    svg1.append("text")
        .attr("x", 0)
        .attr("y", containerHeight/2)
        .attr("fill", "white")
        .text("0");
    svg1.append("text")
        .attr("x", containerWidth - padding/2)
        .attr("y", containerHeight/2)
        .attr("fill", "white")
        .text("1");
    svg.append("text")
        .attr("x", containerWidth/2)
        .attr("y", containerHeight - 10)
        .attr("fill", "white")
        .attr("textLength", "100%")
        .attr("font-weight", "normal")
        .attr("text-anchor", "middle")
        .text("Mode 0: Minor Mode | Mode 1: Major Mode");
}

function dist1(svg, list){
    containerWidth = d3.select(".distribution").node().getBoundingClientRect().width;
    containerHeight = d3.select(".distribution").node().getBoundingClientRect().height;

    width = containerWidth * 2 / 3;
    height = containerHeight * 2 /3;

    svg.attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    svg = svg.append("g")
              .attr("transform",`translate(${(containerWidth - width)/2}, ${(containerHeight - height)/2})`);

    var x = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width]);

    var histogram = d3.histogram()
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(50)); // then the numbers of bins
    var bins = histogram(list);
    var y_max = d3.max(bins, function(d){return d.length;});
    // add the y Axis
    var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, y_max]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
                .tickValues(x.ticks().filter(function(d, i){return i % 2 === 0;})));
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", -containerHeight/2)
        .attr("y", -30)
        .text("Count")
        .attr("fill", "white")
        .attr("transform", "rotate(-90)");

    svg.append("g")
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", `hsl(${Math.random() * 360}, 100%, 75%)`);
    return svg, [containerWidth, containerHeight]
}

function dist2(svg, list){
    containerWidth = d3.select(".distribution").node().getBoundingClientRect().width;
    containerHeight = d3.select(".distribution").node().getBoundingClientRect().height;

    width = containerWidth * 2 / 3;
    height = containerHeight * 2 / 3;

    svg.attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    svg = svg.append("g")
              .attr("transform",`translate(${(containerWidth - width)/2}, ${(containerHeight - height)/2})`);    

    var x = d3.scaleLinear()
            .domain([d3.min(list), d3.max(list)])
            .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var histogram = d3.histogram()
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(40)); // then the numbers of bins
    var bins = histogram(list);
    var y_max = d3.max(bins, function(d){return d.length;});
    // add the y Axis
    var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, y_max]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", -containerHeight/2)
        .attr("y", -30)
        .text("Count")
        .attr("fill", "white")
        .attr("transform", "rotate(-90)");

    svg.append("g")
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", `hsl(${Math.random() * 360}, 100%, 75%)`);
    return svg, [containerWidth, containerHeight]
}

function PieChart(svg, list){
    containerWidth = d3.select(".timeSign").node().getBoundingClientRect().width;
    containerHeight = d3.select(".timeSign").node().getBoundingClientRect().height;
    w = containerWidth * 0.8; h = containerHeight * 0.8;
    // 设置 SVG 的视图框和宽高
    svg.attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    

    svg1 = svg.append("g")
        .attr("transform",`translate(${containerWidth/2} ${containerHeight/2})`);


    const pie = d3.pie()
        .value(function(d){return d.percent})
        .sort(null)
        .padAngle(.03);;
    const arc = d3.arc()
                .innerRadius(Math.min(w,h)/3)
                .outerRadius(Math.min(w,h)/2);
    var color = d3.scaleOrdinal()
                .domain(list)
                .range(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
    //Generate groups
    var arcs = svg1.selectAll("arc")
                .data(pie(list))
                .enter()
                .append("g")
                .attr("class", "arc")

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(d.data.name);
        })
        .attr("d", arc);

    svg1.append('g')
       .attr('class', '.legend')
    svg1.selectAll('text')
        .data(pie(list))
        .enter()
            .append("text")
            .attr("dx", 10)
            .attr("dy", function(d, i){return (i-1.5)*15})
            .attr("text-anchor", "middle")
            .text(function(d){
                return d.data.percent+"%";
            })
            .style('fill','#ffffff')
            .style('font-size','10px');
    svg1.selectAll("dots")
        .data(pie(list))
        .enter()
            .append("circle")
            .attr("cx", -20)
            .attr("cy", function(d, i){return (i-1.5)*15 - 3.5})
            .attr("r", 7)
            .style("fill", function(d, i){return color(d.data.name)})
    svg1.selectAll("mylabel")
        .data(pie(list))
        .enter()
            .append("text")
            .attr("dx", -20)
            .attr("dy", function(d, i){return (i-1.5)*15})
            .attr("text-anchor", "middle")
            .text(function(d){
                return d.data.name;
            })
            .style('fill','#ffffff')
            .style('font-size','10px')
            .style('font-weight', 'bold');
    svg.append("text")
        .attr("x", containerWidth/2)
        .attr("y", containerHeight)
        .text("'i' represent as i/4 beats are in each bar.")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-weight", "normal")
        .attr("font-size", "12px")
}