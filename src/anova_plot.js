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


textLabelPadding = 4;

// Generates a plot of anova results
function plot_anova(svg_id, region_anova, event_anova = null){
	
	var svg = $(svg_id);
	
	if (svg == null) return "Error finding " + svg_id;
	
	
	
	svg.on("orientationchange", function( event ) {
		plot_anova(svg_id, region_anova, event_anova);
	});
	
	
	var pageWidth = screen.width;
	var maxWidth = 1200;
	var mobileMultiplierFont = pageWidth < maxWidth ? 1.9 : 1;
	var mobileMultiplierGaps = pageWidth < maxWidth ? 0.5 : 1;
	var width = 1200; // mobileMultiplierFont == 1 ? maxWidth : $(document).width();
	var pageWidthScale = width / maxWidth;
	
	
	
	
	
	console.log("width", pageWidth, mobileMultiplierFont, pageWidthScale);
	
	
	// Plot constants
	var numStandardErrors = 1;
	var axisGap_x = 260 * pageWidthScale * mobileMultiplierGaps;
	var axisGap_y = 60 * pageWidthScale * mobileMultiplierFont;
	var heightPerRow = 25 * pageWidthScale * mobileMultiplierFont;
	var errorCircleRadius = 4 * pageWidthScale * mobileMultiplierFont;
	var heightPerEventRow = 16 * pageWidthScale * mobileMultiplierFont;
	var gapBetweenRows = 11 * pageWidthScale * mobileMultiplierFont;
	var gapBetweenEventRows = 5 * pageWidthScale * mobileMultiplierFont;
	var axisPointMargin = 25 * pageWidthScale * mobileMultiplierFont;
	var tickLength = 0 * pageWidthScale * mobileMultiplierFont;
	var axisNameFontSize = 20 * pageWidthScale * mobileMultiplierFont;
	var axisValueFontSize = 15 * pageWidthScale * mobileMultiplierFont;
	var courseNameFontSize = 15 * pageWidthScale * mobileMultiplierFont;
	var eventNameFontSize = 14 * pageWidthScale * mobileMultiplierFont;
	var hoverLabelFontSize = 12 * pageWidthScale * mobileMultiplierFont;
	var axisWidth = 2 * pageWidthScale * mobileMultiplierFont;
	var axisCol = "#57595D";
	var gridCol = "rgb(87,89,93, 0.2);"
	var textCol = "black";
	var errorBarCol = "orange";
	var animationTime = 100;
	var height = (heightPerRow + gapBetweenRows) * region_anova.nrows + gapBetweenRows + 1 * axisGap_y;
	
	
	// Reset the svg
	svg.width(width);
	svg.height(height);
	svg.html("");
	

	
	//svg.height(region_anova.nrows);
	console.log("Plotting at", svg, svg.width(), svg.height());
	
	
	// xmax and xmin
	var xmin = minimumFromList(region_anova.coefficients); 
	if (event_anova != null) xmin = Math.min(xmin, minimumFromList(event_anova.coefficients));
	var xmax = maximumFromList(region_anova.coefficients);
	if (event_anova != null) xmax = Math.max(xmax, maximumFromList(event_anova.coefficients));
	var plotWidth = svg.width() - 2 * axisGap_x;
	
	
	var xResult = getNiceAxesNumbers(xmin, xmax, plotWidth);
	xmin = xResult["min"]
	xmax = xResult["max"]
	var widthScale = xResult["widthOrHeightScale"]
	var xlabPos = xResult["vals"]
	
	console.log("xmin", xmin, xmax);
	
	
	// Plot x-axis with ticks
	drawSVGobj(svg, "line", {class: "axis", x1: axisGap_x, y1: height - axisGap_y, x2: width - axisGap_x, y2: height - axisGap_y, style: "stroke:" + axisCol + " ;stroke-width:" + axisWidth});
	drawSVGobj(svg, "text", {class: "axis", x: width/2, y: height - axisGap_y + 2*axisPointMargin, text_anchor:"middle", style:"font-size: " + axisNameFontSize + "px; fill:" + textCol }, "Time adjustment coefficient &beta;");
	for (var labelID = 0; labelID < xlabPos.length; labelID++){
		var x0 = widthScale * (xlabPos[labelID] - xmin) + axisGap_x;
		
		drawSVGobj(svg, "text", {class: "axis", x: x0, y: height - axisGap_y + axisPointMargin, text_anchor:"middle", style: "text-align:center; font-size: " + axisValueFontSize + "px; fill:" + textCol}, xlabPos[labelID]);
		

		// Draw a tick on the axis
		drawSVGobj(svg, "line", {class: "axis", x1: x0, y1: height - axisGap_y + tickLength/2, x2: x0, y2:  0, style: "stroke:" + gridCol + " ;stroke-width:" + axisWidth/2});
		
		
	}
	

	
	// Draw the ANOVA coefficients
	var xCenter = widthScale * (0 - xmin) + axisGap_x;
	region_anova.eventsInRegion = [];
	for (var row = 0; row < region_anova.nrows; row ++){
		
		
		// --- Regional data --- 
		var coeff = region_anova.coefficients[row];
		var evnt = region_anova.event[row];
		var stderr = numStandardErrors * region_anova.stderr[row];
		
		
		
		// Find all the courses in this region
		var eventsInRegion = [];
		if (event_anova != null){
			for (var course_i = 0; course_i < event_anova.nrows; course_i++){
				if (event_anova.course[course_i] == region_anova.event[row]){
					eventsInRegion.push(course_i);
				}
			}
			region_anova.eventsInRegion[row] = eventsInRegion;
		}
		
		
		
		// Rectangle bar
		var y = heightPerRow * row + gapBetweenRows * (row+1);
		var w = Math.abs(widthScale * coeff);
		var x = coeff >= 0 ? xCenter : xCenter - w;
		drawSVGobj(svg, "rect", {id: "row" + row, x: x, y: y, yOrig: y, width: w, height: heightPerRow, 
								row: row, 
								region: row,
								style: "cursor:" + (eventsInRegion.length > 0 ? "pointer" : "auto"),
								class:  (eventsInRegion.length > 0 ?  "clickrow" + row + " " : "") + (row % 2 == 1 ? "anova-bar-odd" : "anova-bar-even")}, "<title>Display events</title>");
		
		
		
		// Draw a mean + error bar
		var errorBarLen =  stderr * numStandardErrors * widthScale;
		drawSVGobj(svg, "line", {
			row: row,
			region: row,
			x1: (coeff >= 0 ? x + w : x) - errorBarLen, 
			y1: y + heightPerRow/2, 
			x2: (coeff >= 0 ? x + w : x) + errorBarLen, 
			y2: y + heightPerRow/2, 
			class: "errorBar" + row + " " + (row % 2 == 1 ? "error-bar-odd" : "error-bar-even")});
			//style: "stroke:" + errorBarCol + " ;stroke-width:2"});
		drawSVGobj(svg, "circle", {
			class: "errorBar" + row + " " + (row % 2 == 1 ? "error-bar-odd" : "error-bar-even"),
			row: row, 
			region: row,
			cx: (coeff >= 0 ? x + w : x), 
			cy: y + heightPerRow/2, 
			r:errorCircleRadius*1.2}, 
			evnt);
		
		
		// Event name
		//drawSVGobj(svg, "text", {row: row, x: xCenter + (coeff >= 0 ? -gapBetweenRows : gapBetweenRows), y: y + heightPerRow/2 + 5, text_anchor: coeff >= 0 ? "end" : "start", style: "font-size: 15px; fill:" + textCol}, event);
		if (coeff >= 0){
			var eventX = Math.min(xCenter, x + w - errorBarLen) - gapBetweenRows;
			drawSVGobj(svg, "text", {class: "clickrow" + row, region: row, row: row, x: eventX, y: y + heightPerRow/2 + 5, text_anchor: "end", style: "cursor:pointer; font-size: " + courseNameFontSize + "px; fill:" + textCol}, evnt + "<title>Display events</title>");
		}
		else{
			var eventX = Math.max(xCenter, x + errorBarLen) + gapBetweenRows;
			drawSVGobj(svg, "text", {class: "clickrow" + row, region: row, row: row, x: eventX, y: y + heightPerRow/2 + 5, text_anchor: "start", style: "cursor:pointer; font-size: " + courseNameFontSize + "px; fill:" + textCol}, evnt + "<title>Display events</title>");
		}
		
		
		
		
		// --- Course data --- 
		// Set everything to hidden
		for (var k = 0; k < eventsInRegion.length; k ++){
			
			var eventIndex = eventsInRegion[k];
			
			
			var coeff_event = event_anova.coefficients[eventIndex];
			var evnt_event = event_anova.event[eventIndex];
			var stderr_event = numStandardErrors * event_anova.stderr[eventIndex];
			
			// Rectangle bar
			
			// heightPerRow * row + gapBetweenRows * (row+1);
			
			var y_event = y + (heightPerEventRow + gapBetweenEventRows) * k;
			var w_event = Math.abs(widthScale * coeff_event);
			var x_event = coeff_event >= 0 ? xCenter : xCenter - w_event;
			var errorBarLen_event =  stderr_event * widthScale;


			// Draw the thinner bar
			drawSVGobj(svg, "rect", {id: "row" + row + "_" + k, x: x_event, y: y_event, yOrig: y_event, width: w_event, height: heightPerEventRow, 
									evnt: row,
									row: row, 
									erow: k,
									style: "display:none; cursor:pointer",
									class: "clickrow" + row + " " + (row % 2 == 1 ? "anova-bar-odd" : "anova-bar-even")}, "<title>Collapse events</title>");
	
	
			// Event name
			if (coeff_event >= 0){
				var eventX = Math.min(xCenter, x_event + w_event - errorBarLen_event) - gapBetweenRows;
				drawSVGobj(svg, "text", {class: "clickrow" + row, evnt: row, row: row, erow: k, x: eventX, y: y_event + heightPerEventRow/2 + 5, text_anchor: "end", style: "display:none; cursor:pointer; font-size: " + eventNameFontSize + "px; fill:" + textCol}, evnt_event + "<title>Collapse events</title>");
			}
			else{
				var eventX = Math.max(xCenter, x_event + errorBarLen_event) + gapBetweenRows;
				drawSVGobj(svg, "text", {class: "clickrow" + row, evnt: row, row: row, erow: k, x: eventX, y: y_event + heightPerEventRow/2 + 5, text_anchor: "start", style: "display:none; cursor:pointer; font-size: " + eventNameFontSize + "px; fill:" + textCol}, evnt_event + "<title>Collapse events</title>");
			}
			
			
			
			
			// Draw a mean + error bar
			
			drawSVGobj(svg, "line", {
				row: row,
				erow: k,
				evnt: row,
				x1: (coeff_event >= 0 ? x_event + w_event : x_event) - errorBarLen_event, 
				y1: y_event + heightPerEventRow/2, 
				x2: (coeff_event >= 0 ? x_event + w_event : x_event) + errorBarLen_event, 
				y2: y_event + heightPerEventRow/2, 
				style:"display:none",
				class: "errorBar" + row + " " + (row % 2 == 1 ? "error-bar-odd" : "error-bar-even")});
				//style: "stroke:" + errorBarCol + " ;stroke-width:2"});
			drawSVGobj(svg, "circle", {
				class: "errorBar" + row + " " + (row % 2 == 1 ? "error-bar-odd" : "error-bar-even"),
				row: row, 
				erow: k,
				evnt: row,
				cx: (coeff_event >= 0 ? x_event + w_event : x_event), 
				cy: y_event + heightPerEventRow/2, 
				style:"display:none",
				r:errorCircleRadius}, 
				evnt);
			
			
			
		}
			
		

		
		svg.find("[row=" + row + "]").mouseenter(function(){
			

			var row = parseFloat($(this).attr("row"));
			var erow = parseFloat($(this).attr("erow"));
			var regionEle = svg.find("#row" + row);

			
			// Are we showing the events or showing the course?
			var showingRegions = isNaN(erow) || erow == null;
			var ele = showingRegions ? regionEle : svg.find("rect[row=" + row + "][erow=" + erow + "]");

			
			var coeff = showingRegions ? region_anova.coefficients[row] : event_anova.coefficients[region_anova.eventsInRegion[row][erow]];
			var n = showingRegions ? region_anova.n[row] :  event_anova.n[region_anova.eventsInRegion[row][erow]];
			var stderr = showingRegions ? region_anova.stderr[row] :  event_anova.stderr[region_anova.eventsInRegion[row][erow]];
			stderr = numStandardErrors * stderr;
			var gap = showingRegions ? gapBetweenRows : gapBetweenEventRows;
			var barheight = showingRegions ? heightPerRow : heightPerEventRow;
			var dy = showingRegions ? 0 : (heightPerEventRow + gapBetweenEventRows) * erow;
			
			var above = coeff >= 0;
			
			// Label in a box
			var labelX = xCenter + (parseFloat(ele.attr("width")) + gapBetweenRows + 3) * (above ? 1 : -1);
			var labelY = parseFloat(regionEle.attr("yOrig")) + barheight/2 + 5 + dy;
			
			
			// Detect if in error bar region
			var msg = "";
			if ($(this).hasClass("errorBar" + row)) msg = numStandardErrors + " S.E. = " + roundToSF(stderr);
			else if (coeff == 0) msg = "Baseline (n=" + n + ")";
			else msg = Math.abs(roundToSF(coeff)) + " " +  (above ? " above " : " below ") + " baseline (n=" + n + ")";
			
			drawSVGobj(svg, "text", {id: "barLabel", 	x: labelX,
														y: labelY,
														text_anchor: above ? "start" : "end", 
														style: "font-size: " + hoverLabelFontSize + "px; fill:" + textCol}, 
														msg, true);
			
			ele.addClass("selected");
			//ele.attr("height", heightPerRow + 2/3*gapBetweenRows);
			//ele.attr("y", parseFloat(ele.attr("y")) - gapBetweenRows/3);
			if (showingRegions) svg.find(".errorBar" + row).addClass("selected");
			else svg.find(".errorBar" + row + "[erow=" + erow + "]").addClass("selected");
			
			
			
			ele.velocity("stop");
			ele.velocity({
				height: barheight + 1/3*gap + "px",
				y: parseFloat(regionEle.attr("yOrig")) - gap/6 + dy
			}, 50);
				
				
			
			
			
			
		});
		
		svg.find("[row=" + row + "]").mouseleave(function(){
			
			var row = parseFloat($(this).attr("row"));
			var erow = parseFloat($(this).attr("erow"));
			var regionEle = svg.find("#row" + row);

			
			// Are we showing the events or showing the course?
			var showingRegions = isNaN(erow) || erow == null;
			var ele = showingRegions ? regionEle : svg.find("rect[row=" + row + "][erow=" + erow + "]");
			var barheight = showingRegions ? heightPerRow : heightPerEventRow;
			var dy = showingRegions ? 0 : (heightPerEventRow + gapBetweenEventRows) * erow;

			ele.removeClass("selected");
			//ele.attr("height", heightPerRow);
			//ele.attr("y", parseFloat(ele.attr("y")) + gap/3);
			
			

			ele.velocity({
				height: barheight + "px",
				y: parseFloat(regionEle.attr("yOrig")) + dy
			}, 50);

			
			
			$("#barLabel").remove();
			$(".barLabelBg").remove();
			$(".errorBar" + row).removeClass("selected");
			
			
		});
		
		
		
		
		
		svg.find(".clickrow" + row).click(function(){
			
			if (event_anova == null) return;

			var row = parseFloat($(this).attr("row"));
			var ele = svg.find("#row" + row);
			var above = region_anova.coefficients[row] >= 0;
			

			// Are we showing the events or showing the course?
			var hidingCourse = ele.is(":visible");
			
			
			
			// Delete labels
			$("#barLabel").remove();
			$(".barLabelBg").remove();
	
			// On click, hide this and display all its children
			
			
			// Either display the region or display the courses
			if (hidingCourse) {
				svg.find("[evnt=" + row + "]").show(animationTime);
				svg.find("[region=" + row + "]").hide(0);
			}
			else {
				svg.find("[evnt=" + row + "]").hide(0);
				svg.find("[region=" + row + "]").show(animationTime);
			}
			
			
			
			// Push everything below this down
			var distanceToMoveDownBy = region_anova.eventsInRegion[row].length * heightPerEventRow + (region_anova.eventsInRegion[row].length-1) * + gapBetweenEventRows - heightPerRow;
			if (!hidingCourse) distanceToMoveDownBy *= -1; // Move up not down
			
			
			svg.velocity({height: height + distanceToMoveDownBy + "px"}, animationTime);
			height = height + distanceToMoveDownBy;
			svg.animate({height: height}, animationTime);
			
			
			// Push the axis and axis labels down
			var axis_eles = svg.find(".axis");
			for (var axis_i = 0; axis_i < axis_eles.length; axis_i++){
				var axis_ele = $(axis_eles[axis_i]);
				
				
				// Move an axis line
				if (axis_ele.prop("tagName") == "line") {
					
					// Horizontal line -> move it all
					if (axis_ele.attr("y1") == axis_ele.attr("y2")){
						axis_ele.velocity({
							y1: parseFloat(axis_ele.attr("y1")) + distanceToMoveDownBy,
							y2: parseFloat(axis_ele.attr("y2")) + distanceToMoveDownBy}, animationTime);
					}
					
					
					// Only move one end
					else if (axis_ele.attr("y1") > axis_ele.attr("y2")){
						axis_ele.velocity({
							y1: parseFloat(axis_ele.attr("y1")) + distanceToMoveDownBy}, animationTime);
					}

				
				}
				
				// Move an axis text
				else if (axis_ele.prop("tagName") == "text") {


					axis_ele.velocity({
						y: parseFloat(axis_ele.attr("y")) + distanceToMoveDownBy}, animationTime);
				

				
				}
				
				
			}
			
			//svg.find("line.axis").velocity({y1: "+=" + distanceToMoveDownBy});
				
			
			// Push the other rows down
	
			for (var rowBelow = row+1; rowBelow < region_anova.nrows; rowBelow ++){
				var rowBelowEle = $("#row" + rowBelow);
				
				
				// Push all the events down
				for (var rowBelow_event = 0; rowBelow_event < region_anova.eventsInRegion[rowBelow].length; rowBelow_event ++){
					
					var rowBelowEle_event = $("#row" + rowBelow + "_" + rowBelow_event);
					var dy =  (heightPerEventRow + gapBetweenEventRows) * rowBelow_event;
					
					//console.log("Moving", "#row" + rowBelow + "_" + rowBelow_event, svg.find("rect[row=" + rowBelow + "][erow=" + rowBelow_event + "]"));
					
					
					
					svg.find("rect[row=" + rowBelow + "][erow=" + rowBelow_event + "]")
						.velocity({y: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy + dy}, animationTime);
					
					svg.find("line[row=" + rowBelow + "][erow=" + rowBelow_event + "]")
						.velocity({ y1: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy + heightPerEventRow/2 + dy,
									y2: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy + heightPerEventRow/2 + dy}, animationTime);
						
					svg.find("circle[row=" + rowBelow + "][erow=" + rowBelow_event + "]")
						.velocity({cy: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy + heightPerEventRow/2 + dy}, animationTime);
						
					svg.find("text[row=" + rowBelow + "][erow=" + rowBelow_event + "]")
						.velocity({y: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy +  heightPerEventRow/2 + 5  + dy}, animationTime);
						
					
				}
					
					
			
				
				
				// Push the regional bar down
				svg.find("rect[region=" + rowBelow + "]")
					.velocity({y: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy}, animationTime);
					
				svg.find("line[region=" + rowBelow + "]")
					.velocity({ y1: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy + heightPerRow/2,
								y2: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy + heightPerRow/2}, animationTime);
					
				svg.find("circle[region=" + rowBelow + "]")
					.velocity({cy: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy + heightPerRow/2}, animationTime);
					
				svg.find("text[region=" + rowBelow + "]")
					.velocity({y: parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy +  heightPerRow/2 + 5}, animationTime);

		
				svg.find("#row" + rowBelow).attr("yOrig",  parseFloat(rowBelowEle.attr("yOrig")) + distanceToMoveDownBy);
				
			}
				
			
			
			
		});
	
		
		
	}
	

	

	// Redraw y axis
	drawSVGobj(svg, "line", {class: "axis", x1: xCenter, y1: height - axisGap_y + tickLength/2, x2: xCenter, y2: 0, style: "stroke:" + axisCol + " ;stroke-width:" + axisWidth});

	
}


/*
// Applies the velocity.js function to a list of elements since the official function does not seem to work on a list of svg elements
function velocity_vec(elements, attr, t){
	for (var i = 0; i < elements.length; i ++){
		$(elements[i]).velocity(attr, t);
	}
	
}
*/


function drawSVGobj(svg, type, attr, val = null, addBackground = false){

	//console.log("attr", attr);
	var newObj = document.createElementNS('http://www.w3.org/2000/svg', type);
	for (var a in attr){
		if (a == "text_anchor") newObj.setAttribute("text-anchor", attr[a]);
		else if (a == "alignment_baseline") newObj.setAttribute("alignment-baseline", attr[a]);
		else newObj.setAttribute(a, attr[a]);
	}
	if (val != null) newObj.innerHTML = val;
	svg.append(newObj);
	
	// Add a background box behind the label
	if (addBackground && attr.id != null) {
		
		var boundingBox = document.getElementById(attr.id).getBBox();						
		var bg = drawSVGobj(svg, "rect", {class: "barLabelBg", 	x: boundingBox.x - textLabelPadding,
													y: boundingBox.y - textLabelPadding,
													width: boundingBox.width + 2*textLabelPadding,
													height: boundingBox.height + 2*textLabelPadding,
													style: "fill:#d3d3d3"});
	
		$(bg).prev().insertAfter($(bg));

		

	
	}
	
	
	return newObj;

}	



function getNiceAxesNumbers(min, max, plotWidthOrHeight, minAtZero = min == 0, zeroLabel = true, axisGap = 45, niceBinSizes = [1, 2, 5]){

	if (min > max) max = min+1;

	var maxNumLabels = 8;
	var nLabels = maxNumLabels;

	var niceBinSizeID = niceBinSizes.length - 1;
	var basePower = Math.floor(log(max, base = 10));
	
	var binSize = niceBinSizes[niceBinSizeID] * Math.pow(10, basePower);


	if (minAtZero) min = 0;

	var numLoops = 0;	
	if (min != max) {
		while(true){


			if (numLoops > 50 || (max - min) / binSize - nLabels > 0) break;
			niceBinSizeID --;
			if (niceBinSizeID < 0) {
				niceBinSizeID = niceBinSizes.length - 1;
				basePower --;
			}
			binSize = niceBinSizes[niceBinSizeID] * Math.pow(10, basePower);
			numLoops++;

		}



		if (!minAtZero){
			if (min > 0) min = min - min % binSize;
			else		 min = min - (binSize + min % binSize);
		}

		if (max > 0) max = max + binSize - max % binSize;
		else		 max = max + binSize - (binSize + max % binSize);


		nLabels = Math.ceil((max - min) / binSize);

		


	}else{
		binSize = 1;
		if (!minAtZero) min--;
		max++;
		nLabels = Math.ceil((max - min) / binSize);
	}
	

	var widthOrHeightScale = (plotWidthOrHeight / (max - min));


	var vals = [];
	var tooBigByFactorOf =  Math.max(Math.ceil(nLabels / maxNumLabels), 1)
	for(var labelID = 0; labelID < nLabels; labelID ++){
		if (labelID == 0 && !zeroLabel) continue;
		if (labelID % tooBigByFactorOf == 0 && labelID * binSize / (max - min) < 0.95) vals.push(roundToSF(labelID * binSize + min));
	}




	return {min: min, max: max, vals: vals, widthOrHeightScale: widthOrHeightScale};
	


}





function roundToSF(val, sf=2, ceilOrFloor = "none"){
	
	var magnitude = Math.floor(log(val, 10));

	if (val < 0 && ceilOrFloor == "ceil") ceilOrFloor = "floor";
	else if (val < 0 && ceilOrFloor == "floor") ceilOrFloor = "ceil";

	var num = val * Math.pow(10, sf-magnitude);
	if (ceilOrFloor == "ceil") num = Math.ceil(num)
	else if (ceilOrFloor == "floor") num = Math.floor(num)
	else num = Math.round(num);

	num = num * Math.pow(10, magnitude-sf);
	
	// Sometimes this picks up a trailing .00000000001 which we want to remove

	var expectedStringLength = 0;
	if (magnitude >= 0) expectedStringLength = magnitude >= sf ? magnitude+1 : sf+2; // Add 1 for the decimal point
	else expectedStringLength = 2 -magnitude + sf;
	if (num < 0) expectedStringLength++; // Also need the negative symbol



	num = parseFloat(num.toString().substring(0, expectedStringLength+1));
	
	return num;
		
}




function minimumFromList(list){

	var min = 1e20;
	for (var i = 0; i < list.length; i ++){
		min = Math.min(min, list[i]);
	}
	if (min == 1e20) return null;
	return min;

}


function maximumFromList(list){

	var max = -1e20;
	for (var i = 0; i < list.length; i ++){
		max = Math.max(max, list[i]);
	}
	if (max == -1e20) return null;
	return max;

}


function log(num, base = null){
	
	if (num == 0) return 0;
	if (base == null) return Math.log(Math.abs(num));
	return Math.log(Math.abs(num)) / Math.log(base);
	
	
}




