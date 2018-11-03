/* 
	--------------------------------------------------------------------
	--------------------------------------------------------------------
	This file is part of NZ Running Stats.

    NZ Running Stats is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    NZ Running Stats is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with NZ Running Stats.  If not, see <http://www.gnu.org/licenses/>. 
    --------------------------------------------------------------------
    --------------------------------------------------------------------
-*/


// Generates a plot of anova results
function plot_histogram(svg_id, hist_obj, course = "Total"){
	
	var svg = $("#" + svg_id);
	
	
	if (svg == null) return "Error finding " + svg_id;
	
	
	svg.on( "orientationchange", function( event ) {
		plot_histogram(svg_id, hist_obj, course);
	});
	
	
	var pageWidth = screen.width;
	var maxWidth = 1200;
	var mobileMultiplier = pageWidth < maxWidth ? 1.6 : 1;
	var width = mobileMultiplier == 1 ? maxWidth : $(document).width();
	var pageWidthScale = width / maxWidth;
	var height = 600;
	
	
	
	
	console.log("width", pageWidth, mobileMultiplier, pageWidthScale);
	
	
	// Plot constants
	var axisGap_x = 150 * pageWidthScale;
	var axisGap_y = 60 * pageWidthScale;
	var gapBetweenBars = 5 * pageWidthScale;
	var axisPointMargin = 25 * pageWidthScale;
	var tickLength = 10 * pageWidthScale * mobileMultiplier;
	var axisLabelSize = 25 * pageWidthScale * mobileMultiplier;
	var axisValFontSize = 12 * pageWidthScale * mobileMultiplier;
	var axisStrokeWidth = 2 * pageWidthScale * mobileMultiplier;
	var hoverLabelFontSize = 16 * pageWidthScale * mobileMultiplier;
	var summaryStatFontSize = 16 * pageWidthScale * mobileMultiplier;
	var axisCol = "#57595D";
	var gridCol = "rgb(87,89,93, 0.2);"
	var textCol = "black";
	var errorBarCol = "orange";
	textLabelPadding = 4 * pageWidthScale;
	
	
	// Reset the svg
	svg.width(width);
	svg.height(height);
	svg.html("");
	
	// Get the right row
	var hist_obj_counts = null;
	var hist_obj_breaks = null;
	var hist_row_num = 0;
	for (hist_row_num = 0; hist_row_num < hist_obj.nrows; hist_row_num ++){
		
		if (hist_obj.event[hist_row_num] == course){
				hist_obj_counts = hist_obj.counts[hist_row_num];
				hist_obj_breaks = hist_obj.breaks[hist_row_num];
				break;
		}
		
	}
	
	if (hist_obj_counts == null) return alert("ERROR: cannot find " + course + " in histogram data");
	
	
	var xmin = hist_obj_breaks[0];
	var xmax = hist_obj_breaks[hist_obj_breaks.length-1];
	//var widthScale = (width - 2 *  axisGap_x) / (xmax - xmin);
	var barWidth = (width - 2 *  axisGap_x - (hist_obj_breaks.length+1)*gapBetweenBars) / (hist_obj_breaks.length);
	
	
	
	
	var yResult = getNiceAxesNumbers(0, maximumFromList(hist_obj_counts), height - 2*axisGap_y);
	var ymin = yResult["min"]
	var ymax = yResult["max"]
	var heightScale = yResult["widthOrHeightScale"]
	var ylabPos = yResult["vals"]
	
	console.log("ylabPos", ylabPos);
	

	
	
	//svg.height(anova_obj.nrows);
	//console.log("Plotting at", svg, svg.width(), svg.height());
	
	
	
	
	// Bars
	for (var i = 0; i < hist_obj_counts.length; i ++){
		
		//var x = widthScale * (hist_obj_breaks[i] - xmin) + axisGap_x + ;
		var x = (i * barWidth) + (i+1) * gapBetweenBars + axisGap_x;
		var y = height - axisGap_y - (hist_obj_counts[i] - ymin) * heightScale;
		var w = barWidth;
		var h = height - axisGap_y - y;
		
		drawSVGobj(svg, "rect", {id: "row" + i, x: x, y: y, width: w, height: h, row: i, class: (i % 2 == 1 ? "anova-bar-odd" : "anova-bar-even")});
		
	}
	
	
	// x-axis
	drawSVGobj(svg, "line", {x1: axisGap_x - 1, y1: height - axisGap_y, x2: width - axisGap_x, y2: height - axisGap_y, style: "stroke:" + axisCol + " ;stroke-width:" + axisStrokeWidth});
	drawSVGobj(svg, "text", {x: width/2, y: height - axisGap_y + 2*axisPointMargin, text_anchor:"middle", style:"font-size:" + axisLabelSize + "px; fill:" + textCol }, "Completion time (hours)");
	
	// Dont print all the x labels if there are too many
	var printEvery = Math.ceil(hist_obj_breaks.length / (18 / mobileMultiplier)); //hist_obj_breaks.length 
	console.log("printEvery", printEvery, hist_obj_breaks.length);
	
	// x-ticks
	for (var i = 0; i < hist_obj_breaks.length; i ++){
		
		//var x = widthScale * (hist_obj_breaks[i] - xmin) + axisGap_x + ;
		var x = (i * barWidth) + (i+1) * gapBetweenBars + axisGap_x;
		var strokewidth =  i % printEvery == 0 ? axisStrokeWidth : 0;
		drawSVGobj(svg, "line", {x1: x, y1: height - axisGap_y - tickLength/2, x2: x, y2: height - axisGap_y + tickLength/2, style: "stroke:" + axisCol + ";stroke-width:" + strokewidth});
		if (i % printEvery == 0) drawSVGobj(svg, "text", {x: x, y: height -  axisGap_y + 0.75* axisPointMargin, text_anchor:"middle", style:"font-size:" + axisValFontSize + "; fill:" + textCol }, formatMinutes(roundToSF(hist_obj_breaks[i], 3)));
	
	}
	
	// Y axis
	drawSVGobj(svg, "line", {x1: axisGap_x, y1: height - axisGap_y, x2: axisGap_x, y2: axisGap_y, style: "stroke:" + axisCol + " ;stroke-width:" + axisStrokeWidth});
	drawSVGobj(svg, "text", {x: axisGap_x - 2*axisPointMargin , y: height/2, text_anchor:"middle", 
			style:"font-size: " + axisLabelSize + "px; fill:" + textCol, 
			transform: "rotate(-90," + (axisGap_x - 2*axisPointMargin) + "," + (height/2) + ")" }, "Frequency");
	
	// y-ticks
	
	
	// Plot y-axis with ticks
	for (var labelID = 0; labelID < ylabPos.length; labelID++){
		var y0 = height - heightScale * (ylabPos[labelID] - ymin) - axisGap_y;
		
		
		drawSVGobj(svg, "text", {class: "axis", x: axisGap_x - axisPointMargin/3, y: y0, text_anchor:"end", dy:"0.3em", style: "font-size: " + axisValFontSize + "px; fill:" + textCol}, ylabPos[labelID]);
		

		// Draw a tick on the axis
		var strokeWidth = axisStrokeWidth / 2;
		drawSVGobj(svg, "line", {class: "axis", x1: axisGap_x-tickLength/2, y1: y0, x2: axisGap_x+tickLength/2, y2:  y0, style: "stroke:" + axisCol + " ;stroke-width:" + strokeWidth});
		
		
	}
	
	
	/*
	for (var i = 0; i < hist_obj_counts.length; i ++){
		
		//var x = widthScale * (hist_obj_breaks[i] - xmin) + axisGap_x + ;
		var x = (i * barWidth) + (i+1) * gapBetweenBars + axisGap_x;
		drawSVGobj(svg, "line", {x1: x, y1: height - axisGap_y - tickLength/2, x2: x, y2: height - axisGap_y + tickLength/2, style: "stroke:" + axisCol + " ;stroke-width:1"});
		drawSVGobj(svg, "text", {x: x, y: height -  axisGap_y + axisPointMargin, text_anchor:"middle", style:"font-size: 15px; fill:" + textCol }, roundToSF(hist_obj_breaks[i], 3));
	
	}
	*/
	
	// Print summaries at the top
	drawSVGobj(svg, "text", {x:  axisGap_x, y: axisGap_y - axisPointMargin, text_anchor: "start", style:"font-size: " + summaryStatFontSize + "px; fill:" + textCol }, "n = " +  hist_obj.n[hist_row_num]);
	drawSVGobj(svg, "text", {x:  width - axisGap_x, y: axisGap_y - axisPointMargin, text_anchor: "end", style:"font-size: " + summaryStatFontSize + "px; fill:" + textCol }, "Median time: " +  formatMinutes(roundToSF(hist_obj.median[hist_row_num], 3)));
	drawSVGobj(svg, "text", {x:  width / 2, y: axisGap_y - axisPointMargin, text_anchor: "middle", style:"font-size: " + summaryStatFontSize + "px; fill:" + textCol }, "Mean time: " +  formatMinutes(roundToSF(hist_obj.mean[hist_row_num], 3)));

	
	// Hover events
	//var svg_rect = document.getElementById(svg_id).getBoundingClientRect();
	
	svg[0].onmousemove = function(event){
		
		var svg_rect = this.getBoundingClientRect();
		
		//console.log("XXX", event.clientX - rect.x, event.clientY - rect.y);
		var mouseX = event.clientX - svg_rect.x;
		var mouseY = event.clientY - svg_rect.y;
		//console.log(mouseY, height - axisGap_y);
		//if (mouseY > height - axisGap_y) return;
		
		for (var i = 0; i < hist_obj_counts.length; i ++){
		
			//var x = widthScale * (hist_obj_breaks[i] - xmin) + axisGap_x + ;
			var x = (i * barWidth) + (i+1) * gapBetweenBars + axisGap_x;
			var w = barWidth;
			var y = height - axisGap_y - (hist_obj_counts[i] - ymin) * heightScale;
			var h = height - axisGap_y - y;
			var ele = svg.find("#row" + i);
			
			if (mouseX >= x - gapBetweenBars/2 && mouseX <= x + w + gapBetweenBars/2) {
				
				ele.addClass("selected");
				
				ele.velocity("stop");
				ele.velocity({
					width: w + 1/2*gapBetweenBars + "px",
					x: x - gapBetweenBars/4
				}, 50);
				
				
				
				// Label in a box
				// We don't want the text to go above or below the axis. The y-val of the textbox with respect to the cursor has a smooth rate of change.
				var dy = -10;
				var dx = w/2 + textLabelPadding;
				svg.find("#barLabel").remove();
				svg.find(".barLabelBg").remove();
				var msg = roundToSF(hist_obj_counts[i]/hist_obj.n[hist_row_num]  * 100) + "% of participants." 
					//+ formatMinutes(roundToSF(hist_obj_breaks[i], 3)) + " and " + formatMinutes(roundToSF(hist_obj_breaks[i+1], 3));
				
				drawSVGobj(svg, "text", {id: "barLabel", 	x: x + dx, //mouseX + dx,
															y: y + dy, //mouseY + dy,
															text_anchor: "start", 
															style: "font-size: " + hoverLabelFontSize + "px; fill:" + textCol}, 
															msg, true);
				
				
				
			}else{
				ele.removeClass("selected");
				
				
				ele.velocity("stop");
				ele.velocity({
					width: w + "px",
					x: x
				}, 50);
				
				

				
			}
			
		}
	
		
		
		
	};
	
	
	svg.mouseleave(function(event){
		
		
		svg.find("#barLabel").remove();
		svg.find(".barLabelBg").remove();
		
		
		
	});
	
	
	
	
	
	
}






