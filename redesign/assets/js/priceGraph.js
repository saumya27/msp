;(function() {
	var chart, graphData;

	$.ajax({
	    "url": "graph_data.json",
	    "data": {
	        "mspid": PriceTable.dataPoints.mspid
	    },
	    "dataType" : "json",
	}).done(function (response) {
		var gradient;
	    
	    graphData = response;
	    
	    gradient = [
			'<linearGradient id="gradient" x1="50%" y1="0%" x2="50%" y2="100%">',
				'<stop offset="0%" style="stop-color:red;stop-opacity:1" />',
				'<stop offset="100%" style="stop-color:green;stop-opacity:1" />',
			'</linearGradient>'
		].join("");

	    chart = c3.generate({
			padding: {
				right: 20,
				top: 10
			},
			bindto: '.prc-grph__rght-chrt',
			data: {
				x: "date",
				json: getPoints(graphData, 6),
			 	keys: {
					value: ['date', 'value'],
				},
				colors: {
			 		value: 'url(#gradient)'
				},
				type: "spline",
			},
			grid: {
				y: {
					show: true
				}
			},
			point: {
				show: true,
				r: 4,
				focus: {
					expand: {
						r: 5
					}
				}
			},
			legend: {
			    show: false
			},
			axis: {
				x: {
					type: 'timeseries', 
				    tick: {
				    	count: 6,
				    	fit: true,
			            type : 'timeseries',
			            format: getXAxisTicks(graphData.length)
				    },
				},
			    y: {	
			        tick : {
			        	count : 6,
			        	fit: true,
			        	format: function (y) { 
			        		y = "Rs. " + parseInt(y, 10).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
							return y;
						}
			    	}
			    }
			},
			tooltip : {
				format: {
			        title: function(d) { 
			        	return d3.time.format("%d, %B %Y")(d) 
					},
			        name: function(name, ratio, id, index) { return "Price"; }
			    }
			},
			oninit: function() {
				this.svg[0][0].getElementsByTagName('defs')[0].innerHTML += gradient;
			}
		});

		$(document).on("click", ".prc-grph__btn", function() {
			var newGraphData = $.extend([], graphData),
				days, newGraphData, dataToPlot, ticks;
		    	
		    days = $(this).data("range") || newGraphData.length;
		    newGraphData = newGraphData.splice(newGraphData.length - days,days);
		    dataToPlot = getPoints(newGraphData, 6);
		    ticks = getXAxisTicks(days);

		    $(".js-prc-grph__btn").removeClass("btn--slctd");
		    $(this).addClass("btn--slctd");

		    chart.internal.loadConfig({
				axis: {
					x: { 
						tick: { 
							format: getXAxisTicks(days) 
						} 
					} 
				}
			});

		    chart.load({
		    	json: dataToPlot,
		    	keys: {
					value: ['date', 'value'],
				}
			});
		});
	});	

	function getXAxisTicks(days) {
		var format;

		if (days <= 30) {
			format = "%d %b";
		} else if (days <=90) {
			format = "%d %b";
		} else if (days <=365) {
			format = "%b";
		} else if (days >= 365) {
			format = "%b %y";
		}

		return format;
	}

	function getPoints(arr, pointCount) { 
	    var pointArr = [],
	    	length = arr.length,
	    	j = 0, i, inc;

	    inc = Math.floor(arr.length / pointCount); 
	    
	    for (i = 0; i < arr.length; i = i + inc) {
	        pointArr[j] = arr[i]; 
	        j++;
	    }

	    return pointArr;
	}
}());