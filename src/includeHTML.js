
function addHeaderHTML(selector, pagename){
	
	
	var htmlHeader = `
	
	
			<div id="header" class="header" style="width:100%;">
					<div class="maintitle"> NZ Running Stats</div>
					<div class="subtitle"> A statistical summary of marathons from across New Zealand  </div>
				</div>


		
		
				<div class="tabs-bg"  style="width:100%;">
				
					<div style="text-align:center; margin-right:0px;">
						<a id="tab_home" href="XXX"> <span class="tab">Home</span> </a>
						
						
						<span class="dropdown">
							  <span class="tab">&#9776; Races</span>
							  <div class="dropdown-content">
									<a id="tab_marathon" href="XXXmarathon/">Marathon</a>
									<a id="tab_halfmarathon" href="XXXhalf-marathon/">Half marathon</a>
									<a id="tab_10km" href="XXX10km/">10 km</a>
							  </div>
						</span>
						
						
						
						<a id="tab_blog" href="XXXblog/"> <span class="tab">Blog</span></a>
						<a id="tab_version" href="XXXversion/"> <span class="tab">Versions</span></a>
						<a id="tab_contact" href="XXXcontact/"> <span class="tab">Contact us</span></a>
					</div>
				</div>

				<br><br>

				
	`;
	
	
	if (pagename == "home") htmlHeader = htmlHeader.replace(/XXX/g, "");
	else htmlHeader= htmlHeader.replace(/XXX/g, "../");
	
	console.log(htmlHeader);
	
	
	$(selector).html(htmlHeader);
	
	
	
	$("#tab_" + pagename).find("span").addClass("selected");
	$("#tab_" + pagename).click(function(e) {
		e.preventDefault();
		//do other stuff when a click happens
	});
	
	
}

