/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////
	
function RadarChart(id, data, options) {
	var cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 0, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 4,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 10, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scale.category10()	//Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(d,i){return d.value;}) );
	//var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		//total = allAxis.length,					//The number of different axes
		total = 16,
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([50, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top/6) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#00d1c1")
		.style("stroke", "rgb(215,248,246)")
		.style("fill-opacity", function(d, i){return 1/(d*d);})
		/*.style("filter" , "url(#glow)");*/

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels)))
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", function(d){return d*radius/(cfg.levels-1);})
	   .attr("y", 0)
	   .attr("dy", "-0.6em")
	   .attr("dx", "-0.5em")
	   .style("font-size", "10px")
	   .attr("fill", "#33CCCC")
	   .text(function(d,i) { return Format(maxValue*2*(5-d)/(cfg.levels-1)); }); 

	//Append the circles
	var blob = g.selectAll(".radarCircle")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircle");

		blob.append("rect")
		.attr("class", "radarCircle")
		.attr("width", 60)
		.attr("height",30)
		.attr("rx",2)
		.attr("ry",2)
		.style("fill",  "#fff" )
		.style("stroke","#33CCCC")
		.style("fill-opacity", 0.9)
		.attr("x",-30)
		.attr("y",-15)

		.transition()
		.duration(function(d,i){return 18*rScale(d.value);})
		.ease("elastic")
		.attr("x", function(d,i){ return rScale(maxValue-d.value) * Math.cos(angleSlice*i - Math.PI/2)-30; })
		.attr("y", function(d,i){ return rScale(maxValue-d.value) * Math.sin(angleSlice*i - Math.PI/2)-15; });
		
		
		
		blob.append("text")
		.text(function(d,i){return d.tag;})
		.attr("dy", "1.5em")
		.attr("dx", "2.2em")
		.style("fill","#999")
      	.style("text-anchor", "middle")
      	.attr("x",-30)
		.attr("y",-15)
		.transition()
		.ease("elastic")
		.duration(function(d,i){return 18*rScale(d.value);})
      	.attr("x", function(d,i){ return rScale(maxValue-d.value) * Math.cos(angleSlice*i - Math.PI/2)-30; })
		.attr("y", function(d,i){ return rScale(maxValue-d.value) * Math.sin(angleSlice*i - Math.PI/2)-15; });

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}//RadarChart
