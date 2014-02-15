d3.xml("maxiv-machine.svg", "image/svg+xml", function(xml) {

    var importedNode = document.importNode(xml.documentElement, true),
        container = document.getElementById("view"),
        overview_container = document.getElementById("overview-container");

    // callback for when the user zooms or pans the view.
    function zoomed () {
        // update the zoom level and offset on the main view
        svg.select("g").attr("transform", 
                             "translate(" + d3.event.translate + ")" +
                             "scale(" + d3.event.scale + ")");

        // ...and update the position and size of the view rectangle in the overview.
        var scale = svg_small_scale / d3.event.scale;
        d3.select("#overview-container").selectAll(".view-rect")
            .data([{left: -d3.event.translate[0], 
                    top: -d3.event.translate[1], 
                    width: container.offsetWidth,
                    height: container.offsetHeight}])
            .style("left", function (d) {return d.left * scale;})
            .style("top", function (d) {return d.top * scale;})
            .style("width", function (d) {return d.width * scale;})
            .style("height", function (d) {return d.height * scale;})
            .enter().append("div")
            .attr("class", "view-rect")
        // nice bit of repetition here...
            .style("left", function (d) {return d.left * scale;})
            .style("top", function (d) {return d.top * scale;})
            .style("width", function (d) {return d.width * scale;})
            .style("height", function (d) {return d.height * scale;});
    }

    // A D3 zoom "behavior" to attach to the SVG, allowing panning and zooming
    // using the mouse
    var zoom = d3.behavior.zoom();
    zoom.on("zoom", zoomed)
        .scaleExtent([1, 10])
        .scale(container.offsetWidth / importedNode.getAttribute("width"))
        .size([container.offsetWidth, container.offsetHeight]);

    // insert the main view SVG into the page
    var svg = d3.select(importedNode)
            .attr("id", "main-svg")
            .call(zoom);
    d3.select("#view").node()
        .appendChild(importedNode);

    // create the small thumbnail overview
    var svg_tmp = importedNode.cloneNode(true), 
        svg_small_scale = overview_container.offsetWidth / importedNode.getAttribute("width"),
        svg_small = d3.select(svg_tmp)
            .attr("transform", "scale(" + svg_small_scale + ")")
            .attr("id", "svg-small");
    overview_container.style.height = (overview_container.offsetWidth * 
                                       importedNode.getAttribute("height") / importedNode.getAttribute("width"));
    overview_container.appendChild(svg_tmp);

    // svg.selectAll("rect")
    //     .style("fill", "red")
    //     .style("stroke", "blue");

    zoom.event(svg);
    Tango.register(importedNode);
    
});