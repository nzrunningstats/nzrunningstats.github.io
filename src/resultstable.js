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


RESULTS_TABLE_SORTED_BY = ["course", -1];
RESULTS_ROWS = [null, null];


// Create a table to display results. Columns sortable
function renderResultsTable(eventwebsites, marathonresults, race = "halfmarathon"){
	

	// Get max number of participants
	var max_n_participants = 0;
	for (var i = 0; i < marathonresults.nrows;i ++){
		max_n_participants = Math.max(max_n_participants, marathonresults.n[i]);
	}


		console.log("marathonresults", marathonresults);
		$("#results_table").append(`
		
			<tr class="header-row">
			
				 <td col="course" title="Location of the half-marathon" style="text-align:center"><b class="sort-by">Half-marathon course</b></td>
				 <td col="event" id="event" title="Date of the half-marathon" style="text-align:center; width: 80px"><b class="sort-by">Event</b></td>
				 <td col="n" id="participantTD" title="Number of participants in the half-marathon" style="text-align:center; min-width: 180px; width:180px"><b class="sort-by">Number of participants</b></td>
				 <td col="female1" title="Completion time of the 1st place female participant" style="text-align:center"><b class="sort-by">1st place female</b></td>
				 <td col="male1" title="Completion time of the 1st place male participant" style="text-align:center"><b class="sort-by">1st place male</b></td>
				 <td col="femalemedian" title="Median completion time among females" style="text-align:center"><b class="sort-by">Median female</b></td>
				 <td col="malemedian" title="Median completion time among males" style="text-align:center"><b class="sort-by">Median male</b></td>
				 <td col="website" title="Course website" style="text-align:center"><b>Website</b></td>
			
			</tr>
		
		`);
		
		
		$(".sort-by").attr("onclick", "sortTable(this)");
		
		
		
		// Print the table
		
		for (var i = 0; i < eventwebsites.nrows; i++){
		
		
		
			// Find the events for this course
			var dates = [];
			var nparticipants = [];
			var femaleFirsts = [];
			var maleFirsts = [];
			var femaleMedians = [];
			var maleMedians = [];
			for (var j = 0; j < marathonresults.nrows; j++){
				if (marathonresults.course[j] == eventwebsites.course[i]) {
					dates.push(marathonresults.event[j]);
					nparticipants.push(
						`<div class="nbar" value="` +  marathonresults.n[j] + `" title="` + marathonresults.n[j] + ` participants" style="width:` + 180 * marathonresults.n[j] / max_n_participants + `px;"></div><br style="line-height:2px">`);
					
					femaleFirsts.push(marathonresults.female1[j].substr(0, 8));
					maleFirsts.push(marathonresults.male1[j].substr(0, 8));
					femaleMedians.push(marathonresults.femalemedian[j].substr(0, 8));
					maleMedians.push(marathonresults.malemedian[j].substr(0, 8));
				}
			}

			if (dates.length == 0) continue;
			
			var dates_str = dates.join("<br>");
			var nparticipants_str = nparticipants.join("<br>");
			var femaleFirsts_str = femaleFirsts.join("<br>");
			var maleFirsts_str = maleFirsts.join("<br>");
			var femaleMedians_str = femaleMedians.join("<br>");
			var maleMedians_str = maleMedians.join("<br>");
		
		
		
			// One type of row for when sorting by course
			$("#results_table").append(`
			
			
			<tr rowtype=0 class="results-row">
			
				 <td col="course" rowspan=1 style="text-align:center">` + eventwebsites.course[i]  + `</td>
				
				 <td col="event" style="text-align:center">` + dates_str + `</td>
				 
				 
				 
				<td col="n" style="text-align:left; position:relative">` + nparticipants_str + `</td>
					
					
				<td col="female1" style="text-align:center;">` + femaleFirsts_str + `</td>
				
				<td col="male1" style="text-align:center">` + maleFirsts_str + `</td>
				
				<td col="femalemedian" style="text-align:center;">` + femaleMedians_str + `</td>
				
				<td col="malemedian" style="text-align:center">` + maleMedians_str + `</td>
				 
				 
				 
				 
				 <td rowspan=1 style="text-align:center">
					<a target="_blank" style="text-decoration:none;" href="` + eventwebsites.website[i] + `" title="Visit course website">
						<span class="linkspan smallfont">
							Visit
						</span>
					</a>
				</td>
			
			</tr>
			
			
			`);
			
		
		
		
			// One type of row for when sorting by anything else
			for (var j = 0; j < dates.length; j ++){
			
				$("#results_table").append(`
				
					
					<tr rowtype=1 style="display:none" class="results-row">
					
						 <td col="course" rowspan=1 style="text-align:center">` + eventwebsites.course[i]  + `</td>
						
						 <td col="event" style="text-align:center">` + dates[j] + `</td>
						 
						 
						 
						<td col="n" style="text-align:left; position:relative">` + nparticipants[j] + `</td>
							
							
						<td col="female1" style="text-align:center;">` + femaleFirsts[j] + `</td>
						
						<td col="male1" style="text-align:center">` + maleFirsts[j] + `</td>
						
						<td col="femalemedian" style="text-align:center;">` + femaleMedians[j] + `</td>
						
						<td col="malemedian" style="text-align:center">` + maleMedians[j] + `</td>
						 
						 
						 
						 <td rowspan=1 style="text-align:center">
							<a target="_blank" style="text-decoration:none;" href="` + eventwebsites.website[i] + `" title="Visit course website">
								<span class="linkspan smallfont">
									Visit
								</span>
							</a>
						</td>
					
					</tr>
					
					
					`);
				
			}
			
		
		}
		
		
		RESULTS_ROWS = [$("#results_table .results-row[rowtype=0]"), $("#results_table .results-row[rowtype=1]")];
		sortTable($(".header-row").find('[col="course"]').find('b'));
		

	
}



function sortTable(colElement){
	
	var colID = $(colElement).parent().attr("col");
	console.log(colID);
	
	if (RESULTS_TABLE_SORTED_BY[0] == colID) RESULTS_TABLE_SORTED_BY[1] = -RESULTS_TABLE_SORTED_BY[1];
	else RESULTS_TABLE_SORTED_BY = [colID, 1];
	
	var rowtype = colID == "course" ? 0 : 1;
	console.log(RESULTS_TABLE_SORTED_BY);
	RESULTS_ROWS[1-rowtype].hide(0);
	RESULTS_ROWS[rowtype].show(0);
	
	
	
	var sort_fn = function(a, b){
		//console.log($(a).find('[col="' + colID + '"]').html(), $(a).find('[col="' + colID + '"]').children().attr("value"));
		
		if (colID == "n") return parseFloat(($(b).find('[col="' + colID + '"]').children().attr("value"))) < parseFloat(($(a).find('[col="' + colID + '"]').children().attr("value"))) ? RESULTS_TABLE_SORTED_BY[1] : -RESULTS_TABLE_SORTED_BY[1]; 
		return ($(b).find('[col="' + colID + '"]').html()) < ($(a).find('[col="' + colID + '"]').html()) ? RESULTS_TABLE_SORTED_BY[1] : -RESULTS_TABLE_SORTED_BY[1]; 
		
	}
	
	
	$("#results_table .results-row[rowtype=" +  rowtype + "]").sort(sort_fn).appendTo("#results_table");
	
	
	
	
}






// Convert time (in minutes) to HH:MM:SS format
function formatMinutes(mins){
	var measuredTime = new Date(null);
	measuredTime.setSeconds(mins * 60); 
	var timeFormatted = measuredTime.toISOString().substr(11, 8);
	if (timeFormatted[0] == "0") return timeFormatted.substr(1);
	return timeFormatted;
}



// Convert time (in minutes) to MM:SS format
function formatMinutes_MMSS(mins){
	
	var timeFormatted = Math.floor(mins) + ":";
	var seconds = Math.floor((mins - Math.floor(mins)) * 60)
	if ((seconds + "").length == 0) seconds = "00";
	else if ((seconds + "").length == 1) seconds = "0" + seconds;

	timeFormatted += seconds
	return timeFormatted;
}














