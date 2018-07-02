import * as d3 from 'd3'
export	function  lineChart (lineChartInputObject = {}) {

	var inputTable = lineChartInputObject.inputTable ||  [
		['Freq', 'Insertion Loss', 'Return Loss', 'Noise Figure', 'IP3'],
		[ 8 * 1e9,  22,  40, 55, 60],
		[12 * 1e9,  80,  90, 60, 65],
		[16 * 1e9, 100, 105, 65, 70],
		[20 * 1e9, 120, 130, 70, 75]
	];

	var freqUnits = lineChartInputObject.freqUnits || 'GHz';
	var canvasID = lineChartInputObject.canvasID || '#canvas' ;
	var xAxisTitle = lineChartInputObject.xAxisTitle || 'Frequency';
	var yAxisTitle = lineChartInputObject.yAxisTitle || 'dB';
	var xAxisTitleOffset = lineChartInputObject.xAxisTitleOffset || 48;
	var yAxisTitleOffset = lineChartInputObject.yAxisTitleOffset || 40;

	var k = 0;
	var p = 0;

	var divisor = 1;
	if (freqUnits === 'Hz') {divisor = 1;};
	if (freqUnits === 'KHz') {divisor = 1e3;};
	if (freqUnits === 'MHz') {divisor = 1e6;};
	if (freqUnits === 'GHz') {divisor = 1e9;};
	var inputTableFrequencyAdjusted = [];
	inputTableFrequencyAdjusted = inputTable;
	for (k = 1; k < inputTable.length; k++) {
		inputTableFrequencyAdjusted[k][0] = inputTable[k][0]/divisor
	};

	var tsv = '';
	inputTableFrequencyAdjusted.forEach( (element) => {
		tsv += element.join('\t') + '\n';
	});

	//use d3 to turn tsv data into d3 data
	var data = d3.tsvParse(tsv);

	//change data type from string to float, for arbitrary sized/named table
	data.forEach( d => {
		for (k = 0; k < data.columns.length; k++){
			d[data.columns[k]] = +d[data.columns[k]]
		};
	});

	//change the data to nestedData
	var nestedData = data.columns.slice(1).map(function(yName) {// this will return an array of objects
		return {
			yName: yName,                       // this is the rf dB plot
			yValues: data.map(function(d) {     // this will return an inner Array of objects
				return {xValue: d[data.columns[0]], // this is the rf frequency
					yValue: d[yName]};          // this is the dB value
			})
		};
	});

	var xExtent = (function () {//creates a one dimensional array
		var temp = []
		for (k = 0; k < data.length; k++) {
			temp.push(nestedData[0].yValues[k].xValue);
		}
		return temp;
	})();

	var yExtent = (function () {//creates a one dimensional array
		var temp = []
		for (k = 0; k < nestedData.length; k++){
			for (p = 0; p < data.length; p++) {
				temp.push(nestedData[k].yValues[p].yValue);
			}
		}
		return temp;
	})()

	//set up the plot area
	var canvasRect = d3.select(canvasID).node().getBoundingClientRect();
	var outerWidth = canvasRect.width
	var outerHeight = canvasRect.height
	var margin = { left: 70, top: 20, right: 20, bottom: 60 };

	var innerWidth  = outerWidth  - margin.left - margin.right;
	var innerHeight = outerHeight - margin.top  - margin.bottom;

	var x = d3.scaleLinear().domain(d3.extent(xExtent)).range([0, innerWidth]);
	var y = d3.scaleLinear().domain(d3.extent(yExtent)).range([innerHeight, 0]);

	var svg = d3.select(canvasID)
		.attr("width", outerWidth)
		.attr("height", outerHeight)
		.attr("class", 'lineChart');
	var rect = svg.append('rect')
		.attr("width", outerWidth)
		.attr("height", outerHeight)
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', '1px');

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	//append the x axis onto g
	g.append('g')
		.attr('class', 'xAxis')
		.style('font-size', '12')
		.attr('transform', 'translate(0,' + innerHeight + ')')
		.call(d3.axisBottom(x))
		.append('text')
		.attr("fill", "#000")
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisTitleOffset + ")")
		.style('font-size', '20')
		.text(xAxisTitle);						
	//append the x axis grid onto g
	g.append('g')
		.attr("class", "xGrid")
		.attr('transform', 'translate(0,' + innerHeight + ')')
		.call(d3.axisBottom(x).tickSize(-innerHeight).tickFormat("")).attr('stroke', 'gray').attr('stroke-dasharray', '3, 3');	  
	//append the y axis onto g
	g.append('g')
		.attr('class', 'yAxis')
		.style('font-size', '12')
		.call(d3.axisLeft(y))
		.append('text')
		.attr("fill", "#000")
		.style("text-anchor", "middle")
		.attr("transform", "translate(-" + yAxisTitleOffset + "," + (innerHeight / 2) + ") rotate(-90)")
		.style('font-size', '20')
		.text(yAxisTitle);						
	//append the y axis grid onto g
	g.append('g')
		.attr("class", "yGrid")
		.call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat("")).attr('stroke', 'gray').attr('stroke-dasharray', '3, 3');

	function plotColor (label) {return d3.schemeCategory10[data.columns.slice(1).indexOf(label)];};

	var plotGroups = g.selectAll('g.newPlot')
		.data(nestedData)
		.enter()
		.append('g')
		.attr('class', 'newPlot')
		.each( function (d) {
			d3.select(this).selectAll('circle')
				.data(d => d.yValues)
				.enter()
				.append('circle')
				.attr('cx', d => x(d.xValue))
				.attr('cy', d => y(d.yValue))
				.attr('r', 2)
				.style("stroke", plotColor(d.yName)).style('fill', plotColor(d.yName)).style('stroke-width','2')

			var line = d3.line()
				.x(d => x(d.xValue))
				.y(d => y(d.yValue));

			d3.select(this).append("path")
				.attr('d', d => line(d.yValues))
				.style("stroke", plotColor(d.yName)).style('fill', 'none')

			d3.select(this).append("text")
				.attr("transform", function(d) { return "translate(" + x(d.yValues[d.yValues.length-2].xValue) + "," + y(d.yValues[d.yValues.length-2].yValue)  + ")"; })
				.attr("x", 3)
				.attr("dy", "0.35em")
				.style("font", "10px sans-serif")
				.text(function(d) { return d.yName; });
		})//end each 

};
