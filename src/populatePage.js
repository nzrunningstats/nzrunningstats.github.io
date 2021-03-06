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


MONTHS = [null, "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];



// Populates the current page with plots and tables
populatePage = function(versionDirectory = "data") {
	
	
	console.log("opening", versionDirectory);
	
	// Mobile
	var is_mobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
		   			 || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));

	if (is_mobile) $("mobilegap").html("<br style='line-height:2em'>");
					 
					 
	// Internet Explorer 6-11
	var isIE = /*@cc_on!@*/false || !!document.documentMode;

	// Edge 20+
	var isEdge = !isIE && !!window.StyleMedia;
	var stylesheet = isIE || isEdge ? "IEstyles" : "styles";
	
	
	
	console.log(isIE, isEdge, is_mobile, stylesheet);
	
	if (stylesheet != "styles") {
		$('head').find("link").remove();
		$('head').append('<link rel="stylesheet" type="text/css" href="../src/' + stylesheet + '.css">');
	}
	


	halfMarathonCourseANOVA = null;
	ANOVA_course = null;

	
	// Load the anova course results .csv file
	loadCSV(versionDirectory + "/resC.csv", function(result){
		if (result.error != null) {
			alert(result.error);
			return;
		}
		halfMarathonCourseANOVA = result;
		
		// Preprocessing
		var sortedEvents = [];
		for (var i = 0; i < halfMarathonCourseANOVA.nrows; i++){
			halfMarathonCourseANOVA.coefficients[i] = parseFloat(halfMarathonCourseANOVA.coefficients[i]);
			halfMarathonCourseANOVA.stderr[i] = parseFloat(halfMarathonCourseANOVA.stderr[i]);
			halfMarathonCourseANOVA.n[i] = parseFloat(halfMarathonCourseANOVA.n[i]);
			

			if (halfMarathonCourseANOVA.event[i][0] == "*") halfMarathonCourseANOVA.event[i] = halfMarathonCourseANOVA.event[i].substr(1);


			// Capital on events
			var event_split = halfMarathonCourseANOVA.event[i].split("-");
			halfMarathonCourseANOVA.event[i] = "";
			for (var j = 0; j < event_split.length; j ++){
				halfMarathonCourseANOVA.event[i] += event_split[j][0].toUpperCase() + event_split[j].substr(1).toLowerCase();
				if (j < event_split.length - 1) halfMarathonCourseANOVA.event[i] += " ";
			}
			
			
			
			sortedEvents.push(halfMarathonCourseANOVA.event[i]);
			
			
		
		}
		
		// Add sorted list to dropdowns
		sortedEvents.sort();
		$("#userRanMarathon_dropdown").html("");
		$("#userQueryMarathon_dropdown").html("");
		for (var i = 0; i < sortedEvents.length; i ++){
			$("#userRanMarathon_dropdown").append(`<option value="` + sortedEvents[i] + `">` + sortedEvents[i] + `</option>`);
			$("#userQueryMarathon_dropdown").append(`<option value="` + sortedEvents[i] + `">` + sortedEvents[i] + `</option>`);
		}
			
			
		
		
		$("#userRanMarathon_dropdown").val("Auckland");
		//console.log("XXX", $("#userRanMarathon_dropdown").val());
		if ($("#userRanMarathon_dropdown").val() == null) $("#userRanMarathon_dropdown").val("Christchurch");
		$("#userQueryMarathon_dropdown").val("Queenstown");
		//console.log("halfMarathonCourseANOVA", halfMarathonCourseANOVA);
		queryHalfMarathon();
		
		
		
		// Load the anova course results .csv file
		loadCSV(versionDirectory + "/resG.csv", function(result){
			if (result.error != null) {
				alert(result.error);
				return;
			}
			ANOVA_course = result;
			//ANOVA_course.date = [];
			
			// Preprocessing
			for (var i = 0; i < ANOVA_course.nrows; i++){
				ANOVA_course.coefficients[i] = parseFloat(ANOVA_course.coefficients[i]);
				ANOVA_course.stderr[i] = parseFloat(ANOVA_course.stderr[i]);
				ANOVA_course.n[i] = parseFloat(ANOVA_course.n[i]);
				

				// Capital on events plus have name first and date last
				var event_split = ANOVA_course.event[i].split("-");
				if (event_split.length >= 4){
					ANOVA_course.event[i] = "";
					for (var j = 3; j < event_split.length; j ++){
						ANOVA_course.event[i] += event_split[j][0].toUpperCase() + event_split[j].substr(1).toLowerCase();
						if (j < event_split.length - 1) ANOVA_course.event[i] += " ";
					}
					
					var month = MONTHS[parseFloat(event_split[1])];
					if (month == null) month = "";
					else month += " ";
					ANOVA_course.event[i] += ", " +  month  + event_split[0]; // "/" + event_split[1]; // +  "/" + event_split[2]; // YYYY/MM/DD
					
				}
				if (ANOVA_course.event[i][0] == "*") ANOVA_course.event[i] = ANOVA_course.event[i].substr(1);
				//ANOVA_course.date[i] = event_split[0] + "/" + event_split[1] +  "/" + event_split[2];
				
				// Capital on courses
				var course_split = ANOVA_course.course[i].split("-");
				ANOVA_course.course[i] = "";
				for (var j = 0; j < course_split.length; j ++){
					ANOVA_course.course[i] += course_split[j][0].toUpperCase() + course_split[j].substr(1).toLowerCase();
					if (j < course_split.length - 1) ANOVA_course.course[i] += " ";
				}
				
				
				
			}
			console.log("ANOVA_course", ANOVA_course);
			
			
			
			
			// Load the anova course results .csv file
			
			// Plot the ANOVA results as an svg
			$("#anova_div").show(0);
			plot_anova("#anovaRegion_svg", halfMarathonCourseANOVA, ANOVA_course);
			
		});
			

	});
	
	
	
	
	// Load the histogram .csv file
	loadCSV(versionDirectory + "/histogram.csv", function(result){
		if (result.error != null) {
			alert(result.error);
			return;
		}
		hist_data = result;
		

		// Preprocessing
		var sortedEvents = [];
		for (var i = 0; i < hist_data.nrows; i++){
			
			

			
			
			// Capital on events plus have name first and date last
			var event_split = hist_data.event[i].split("-");
			if (event_split.length >= 4){
				hist_data.event[i] = "";
				for (var j = 3; j < event_split.length; j ++){
					hist_data.event[i] += event_split[j][0].toUpperCase() + event_split[j].substr(1).toLowerCase();
					if (j < event_split.length - 1) hist_data.event[i] += " ";
				}
				if (event_split[0][0] == "*") event_split[0] = event_split[0].substr(1);
				hist_data.event[i] += " " + event_split[0]; // + "/" + event_split[1] +  "/" + event_split[2]; // YYYY/MM/DD
				
			}
			else hist_data.event[i] = hist_data.event[i][0].toUpperCase() + hist_data.event[i].substr(1).toLowerCase();
			
			
			sortedEvents.push(hist_data.event[i]);
			
			
			// Split breaks into lists
			var breaks = hist_data.breaks[i].split(";");
			hist_data.breaks[i] = [];
			for (var j = 0; j < breaks.length; j ++){
				hist_data.breaks[i].push(parseFloat(breaks[j]))
			}
			
			
			// Split counts into lists
			var counts = hist_data.counts[i].split(";");
			hist_data.counts[i] = [];
			for (var j = 0; j < counts.length; j ++){
				hist_data.counts[i].push(parseFloat(counts[j]))
			}
			
			if (counts.length + 1 != breaks.length) {
				alert("ERROR: row " + (i+1) + " of histogram.csv does not have matching numbers of breaks and counts " + counts.length + " + 1 != " + breaks.length);
				return;
			
			}
			
			
		}
		
		sortedEvents.sort();
		$("#halfMarathonHistogram_dropdown").html("");
		$("#halfMarathonHistogram_dropdown").append(`<option value="Total">Total</option>`);
		for (var i = 0; i < sortedEvents.length; i ++){
			if (sortedEvents[i] != "Total") $("#halfMarathonHistogram_dropdown").append(`<option value="` + sortedEvents[i] + `">` + sortedEvents[i] + `</option>`);
		}
		
		$("#histogram_div").show(0);
		console.log("hist_data", hist_data);
		plot_histogram("halfMarathonHistogram_svg", hist_data);
		
	});
	
	
	
	// Load the marathon results
	loadCSV(versionDirectory + "/eventwebsites.csv", function(result){
		if (result.error != null) {
			alert(result.error);
			return;
		}
		var eventwebsites = result;
		console.log("eventwebsites", eventwebsites);
		
		
		for (var i = 0; i < eventwebsites.nrows;i ++){
		
			// Capital on events
			var event_split = eventwebsites.course[i].split("-");
			eventwebsites.course[i] = "";
			for (var j = 0; j < event_split.length; j ++){
				eventwebsites.course[i] += event_split[j][0].toUpperCase() + event_split[j].substr(1).toLowerCase();
				if (j < event_split.length - 1) eventwebsites.course[i] += " ";
			}
		
		}
		
		
		loadCSV(versionDirectory + "/marathonresults.csv", function(result){
			if (result.error != null) {
				alert(result.error);
				return;
			}
			var marathonresults = result;
			
			
			var max_n_participants = 0;
			for (var i = 0; i < marathonresults.nrows;i ++){
			

				if (marathonresults.course[i][0] == "*") marathonresults.course[i] = marathonresults.course[i].substr(1);


				// Capital on events
				var event_split = marathonresults.course[i].split("-");
				marathonresults.course[i] = "";
				for (var j = 0; j < event_split.length; j ++){
					marathonresults.course[i] += event_split[j][0].toUpperCase() + event_split[j].substr(1).toLowerCase();
					if (j < event_split.length - 1) marathonresults.course[i] += " ";
				}
			
				// Capital on events plus have name first and date last
				var event_split = marathonresults.event[i].split("-");
				if (event_split.length >= 3){
					marathonresults.event[i] = event_split[0] + "." + event_split[1] + "." + event_split[2]; // event_split[2] + " / " + event_split[1] +   " / " + event_split[0]; // DD / MM / YYYY	
				}
				if (marathonresults.event[i][0] == "*") marathonresults.event[i] = marathonresults.event[i].substr(1);
			}
			
			renderResultsTable(eventwebsites, marathonresults);
			$("#results_div").show();
		
		});
		
	});
	
	
	
		
	
	
	
	
	
	
	
	
	
}



// Loads a csv file and returns as an object
function loadCSV(url, resolve = function(result) { }){
    
    console.log("Trying to open", url);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          
            if (xhttp == null || xhttp.responseXML == "") return resolve( {error: "Error: cannot open " + url});

            //console.log("xhttp.responseText", xhttp.responseText);
            var csvString = xhttp.responseText.split("\n");
			if (csvString.length == 0)  return resolve( {error: "Error: empty csv file detected at " + url} );
			
			
			var CSV_obj = {};
			var column_names = [];
			
			
			// Parse the file
			var haveParsedHeader = false;
			var nrows = 0;
			for (var i = 0; i < csvString.length; i ++){
				var line = csvString[i].trim();
				if (line == "") continue;
				
				var splitLine = line.split(",");
				
				
				
				
				var rowIsHeader = false;
				for (var j = 0; j < splitLine.length; j ++){
				
					// Parse the header
					if (!haveParsedHeader){
						rowIsHeader = true;
						
						column_names.push(splitLine[j]);
						CSV_obj[splitLine[j]] = [];
						
						

					
					} else {
					
						var value = splitLine[j];
						var colName = column_names[j];
						if (colName == null)  return resolve( {error: "Error: too many columns in row " + i + " of file " + url} );
						
						CSV_obj[colName].push(value);
						
						
					
					}
					
				}
				
				if (rowIsHeader) haveParsedHeader = true;
				else nrows ++;
			
			
			}
            

			CSV_obj.nrows = nrows;
			return resolve(CSV_obj);

           
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
    
    
}




// User queries their run time at a marathon and the predicted time at another marathon is computed
function queryHalfMarathon(){

	// Read the input values
	var course_ran = $("#userRanMarathon_dropdown").val();
	var course_query = $("#userQueryMarathon_dropdown").val();
	var time = $("#userRanMarathon_time").val();
	var time_split = time.split(":");
	if (halfMarathonCourseANOVA == null || course_ran == null || course_query == null || time == null || !time.match($("#userRanMarathon_time").attr("pattern")) || time_split.length != 3) return;
	
	// Convert time to minutes
	
	var minutes = parseFloat(time_split[0])*60 + parseFloat(time_split[1]) + parseFloat(time_split[2])/60;
	var coeff_ran = 0;
	var coeff_query = 0;
	var stderr_ran = 0;
	var stderr_query = 0;
	for (var i = 0; i < halfMarathonCourseANOVA["event"].length; i ++){
		if (halfMarathonCourseANOVA["event"][i] == course_ran) {
			coeff_ran = halfMarathonCourseANOVA.coefficients[i];
			stderr_ran = halfMarathonCourseANOVA.stderr[i];
		}
		if (halfMarathonCourseANOVA["event"][i] == course_query) {
			coeff_query = halfMarathonCourseANOVA.coefficients[i];
			stderr_query = halfMarathonCourseANOVA.stderr[i];
		}
	}
	
	var dcoeff = coeff_query - coeff_ran;
	var dstderr = Math.exp(1.96 * Math.sqrt(stderr_ran*stderr_ran + stderr_query*stderr_query));
	var expectedTime = minutes * Math.exp(dcoeff);
	
	//console.log(stderr_ran, stderr_query, dstderr);
	
	
	$("#userResponseMarathon").html("Your estimated time is " + formatMinutes(expectedTime) + ". The 95% confidence interval is (" + 
				formatMinutes(expectedTime / dstderr) + ", " + formatMinutes(expectedTime * dstderr) + ").");
	


		

}





