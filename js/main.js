
///map and chart portion
(function () {

var attrArray;
var expressed;


var yScale = d3.scale.linear ()
        .range([0, 460])
        .domain([100, 0]);

var chartWidth = window.innerWidth * 0.45,
        chartHeight = 470,
        leftPadding = 30,
        rightPadding = 5, 
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2;
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";


window.onload = setMap();


function setMap () {
	var width = window.innerWidth * 0.5
	height = 500;

	// var siteTitle = d3.select("body")
 //        .append("text")
 //        .attr("class", "siteTitle")
 //        .html("Aurora Tweet");

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
        .defer(d3.json, "http://localhost:3000/tweets?q=ClimateChange") //load sample tweets
        .defer(d3.json, "data/usa.topojson") //load background spatial data
        .await(callback);


function callback (error, twitter_data, states) {
	var tweets = twitter_data.tweets;
	attrArray = twitter_data.header;
	expressed = attrArray[0];


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

    var colorScale = makeColorScale(tweets);
    northAmerica = joinData(northAmerica, tweets);
    setEnumerationUnits (northAmerica, map, path, colorScale);

    setChart (tweets, colorScale);
    createDropdown(tweets);

    //    dynamicScale (csvData);
};

function setGraticule (map, path) {

       var graticule = d3.geo.graticule()
            .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude
        // var background = d3.select
        // map.append("svg")
        // .attr("width", width - leftPadding - 20)
        // .attr("height", height - topBottomPadding - 10)
        // .attr("class", "background")

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



function createDropdown(tweets) {
    //add select element
    var dropdown = d3.select("body")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){
            changeAttribute(this.value, tweets)
        });
    //add initial option
    var titleOption = dropdown.append("option")
        .attr ("class", titleOption)
        .attr("disabled", "true")
        .text("Select Attribute");
    //add attribute name options

    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attrArray)
        .enter ()
        .append("option")
        .attr("value", function(d) { return d})
        .text(function (d) { return d});
};

function changeAttribute(attribute, tweets){
    //change the expressed attribute
    expressed = attribute;
    //recreate color scale
    var colorScale = makeColorScale(tweets);
    //recolor enumeration units
    var regions = d3.selectAll(".regions")
        .transition()
        .duration(1000)
        .style("fill", function (d) {
            return choropleth(d.properties, colorScale)
        });

    var bars = d3.selectAll(".bar")
    //resort bars
        .sort(function(a, b) {
        return a[expressed] - b[expressed];
        })
        .transition() // add animation
        .delay(function (d, i) {
            return i * 20
        })
        .duration(500);

        updateChart (bars, tweets.length, colorScale);
    }; 

function setEnumerationUnits (northAmerica, map, path, colorScale){
        var regions = map.selectAll(".regions")
            .data(northAmerica)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.name;
            })
            .attr("d", path)
            .style("fill", function(d){
                return choropleth(d.properties, colorScale);
            })
            .on("mouseover", function(d){
                highlight(d.properties);
            })
            .on("mouseout", function(d){
                dehighlight(d.properties);
            })
            .on("mousemove", moveLabel);

        var desc = regions.append("desc")
            .text('{"stroke": "#000", "stroke-width": "0.5px"}');

    };



function updateChart (bars, n, colorScale) {
        bars.attr("x", function(d, i){
        return i * (chartInnerWidth / n ) + leftPadding;
        })
    //resize bars
         .attr("height", function(d, i){
        return 463 - yScale(parseFloat(d[expressed]));
        })
         .attr("y", function(d, i){
        return yScale(parseFloat(d[expressed])) + topBottomPadding;
         })
    //recolor bars
         .style("fill", function(d){
        return choropleth(d, colorScale);
        });
    var chartTitle = d3.select(".chartTitle")
        .text("Number of " + expressed + " tweets from each state");


};

function choropleth (props, colorScale) {
    var val = parseFloat (props[expressed]);

    if (val && val != NaN) {
        return colorScale (val);
    } else {
        return "#CCC";
    };
};


function highlight(props){
    //change stroke
    var selected = d3.selectAll ("." + props.name)
        .style({
            "stroke": "#C58162",
            "stroke-width": "2.5"
        });
    setLabel(props);
};


function dehighlight(props){
    var selected = d3.selectAll ("." + props.name) // deleted "." and removed null nodes? 
        .style({
            "stroke": function() {
                return getStyle (this, "stroke")
            },
            "stroke-width": function(){
                return getStyle(this, "stroke-width")
            }
        });
    function getStyle (element, styleName) {
        var styleText = d3.select(element)
        .select("desc")
        .text();
        var styleObject = JSON.parse(styleText);

    return styleObject[styleName];
        };
    d3.select(".infolabel")
        .remove();
};


function setChart(tweets, colorScale) {
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

    var bars = chart.selectAll (".bar")
        .data(tweets)
        .enter()
        .append("rect")
        .sort(function(a, b) {
            return a[expressed] - b[expressed]
        })
        .attr("class", function(d) {
            return "bar "+ d.name;
        })
        .attr("width", chartWidth / tweets.length - 2) 
        .on("mouseover", highlight)
        .on("mouseout", dehighlight)
        .on("mousemove", moveLabel);

    var desc = bars.append("desc")
            .text('{"stroke": "none", "stroke-width": "0px"}');

    //create a text element for the chart title
    var chartTitle = chart.append("text")
        .attr("x", 40)
        .attr("y", 20)
        .attr("class", "chartTitle");

    //create vertical axis generator
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    //place axis
    var axis = chart.append("g")
        .attr("class", "axis")
        .attr("transform", translate)
        .call(yAxis);

    updateChart(bars, tweets.length, colorScale);


};

function joinData (northAmerica, tweets) {
    for (var i=0; i<tweets.length; i++) {
        var csvRegion = tweets[i];
        var csvKey = csvRegion.name; // the csv primary key
    for (var a=0; a<northAmerica.length; a++) {
        var geojsonProps = northAmerica[a].properties; //the current region geojson properties
                var geojsonKey = geojsonProps.name; // geojson primary key 
            //where primary keys match, transfer csv data to geojson prop object
            if (geojsonKey == csvKey){
                //assign all attributes and values
                attrArray.forEach(function(attr){
                    var val = parseFloat(csvRegion[attr]); //get csv attr value
                    geojsonProps[attr] = val; //assign attribute

               });
            };
        };
    };

    return northAmerica;
};

function makeColorScale(data) {
    var colorClasses = [
        "#f7f7f7",
        "#cccccc",
        "#969696",
        "#636363",
        "#252525"
    ];
    //create color sequence generator
    var colorScale = d3.scale.quantile ()
        .range(colorClasses);
    //build array of all values of the expressed attributes
    var domainArray = [];
    for (var i=0; i<data.length; i++){
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };
    //assign array of expressed values as scale domain
    colorScale.domain(domainArray);
    return colorScale;

};

function setLabel (props){
    //label content
    var labelAttribute = "<h1>" + props[expressed] +
        "</h1><b>" + expressed + "</b>";
    //create info label div
    var infolabel = d3.select("body")
        .append("div")
        .attr({
            "class": "infolabel",
            "id": props.name + "_label"
        })
        .html(labelAttribute);
    var regionName = infolabel.append("div")
        .attr("class", "labelname")
        .html(props.name);
};


function moveLabel () {

    // //get width of label
    var labelWidth = d3.select(".infolabel")
        .node ()
        .getBoundingClientRect()
        .width;

    //use coordinates of mousemove to set coordinates of label
    var x1 = d3.event.clientX + 10,
        y1 = d3.event.clientY - 75,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY + 25;
    //horizontal label coordinate; test for overflow
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1;
    //vertical label coordinate; test for overflow
    var y = d3.event.clientY < 75 ? y2 : y1;

    d3.select(".infolabel")
        .style ({
            "left": x + "px",
            "top": y + "px"
        });
};


})();

// dynamic y scale

