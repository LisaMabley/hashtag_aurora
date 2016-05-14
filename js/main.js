
///map and chart portion
(function () {

var attrArray = ["#ClimateAction", "#FossilFuels", "#GlobalWarming", "#Energy"];
var expressed = attrArray[0];


var yScale = d3.scale.linear ()
        .range([0, 460])
        .domain([100000, 0]);

var chartWidth = window.innerWidth * 0.5,
        chartHeight = 473,
        leftPadding = 25,
        rightPadding = 2, 
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2;

window.onload = setMap();


function setMap () {
	var width = window.innerWidth * 0.6
	height = 500;

	var siteTitle = d3.select("body")
        .append("text")
        .attr("class", "siteTitle")
        .html("Aurora Tweet");

    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geo.albersUsa()
        .scale(900)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    // svg.append("path")
    // .datum(usa)
    // .attr("d", path);

    var q = d3_queue.queue();
	//queue
    //use queue.js to parallelize asynchronous data loading
    q
        .defer(d3.json, "data/tweets.json") //load sample tweets
        .defer(d3.json, "data/usa.topojson") //load background spatial data
        .await(callback);


function callback (error, states) {
	  setGraticule(map, path);
	 var northAmerica = topojson.feature(states, states.objects.usa).features;

	 var regions = map.selectAll(".regions")
	 	.data(northAmerica)
	 	.enter()
	 	.append("path")
	 	.attr("d", path);
	 // var regions = map.selectAll(".regions")
  //           .data(northAmerica)
  //           .enter()
  //           .append("path")
  //           .attr("d," path);

    // northAmerica = joinData(northAmerica, csvData);
    //    //set up color scale
    //    var colorScale = makeColorScale(csvData);
    //    //add enumeration units
    //    setEnumerationUnits (northAmerica, map, path, colorScale);

       setChart ();

    //    createDropdown (csvData);

    //    dynamicScale (csvData);
};

function setGraticule (map, path) {

       var graticule = d3.geo.graticule()
            .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude

       var gratBackground = map.append("path")
            .datum(graticule.outline()) //bind graticule background
            .attr("class", "gratBackground") //assign class for styling
            .attr("d", path) //project graticule

       var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
            .data(graticule.lines()) //bind graticule lines to each element to be created
            .enter() //create an element for each datum
            .append("path") //append each element to the svg as a path element
            .attr("class", "gratLines") //assign class for styling
            .attr("d", path); //project graticule lines
 };

 //end of set map

};


function setChart() {
//     // create second svg element to hold bar chart

    var chart = d3.select("body")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart")

    var chartFrame = chart.append("rect")
        .attr("class", "chartFrame")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);

    var chartBackground = chart.append("rect")
        .attr("class", "chartBackground")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);
};

// function makeColorScale(data) {
//     var colorClasses = [
//         "#ccf2ff",
//         "#66d9ff",
//         "#00bfff",
//         "#007399",
//         "#002633"
//     ];
//     //create color sequence generator
//     var colorScale = d3.scale.quantile ()
//         .range(colorClasses);
//     //build array of all values of the expressed attributes
//     var domainArray = [];
//     for (var i=0; i<data.length; i++){
//         var val = parseFloat(data[i][expressed]);
//         domainArray.push(val);
//     };
//     //assign array of expressed values as scale domain
//     colorScale.domain(domainArray);
//     return colorScale;

// };

})();

//attribute
//expressed
//make color scale
//play through months
//on click functions
//chart
//chart styling
//contextual information
//highlighting
//hovers and popups


