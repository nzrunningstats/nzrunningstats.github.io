

VERSIONS = ["1.0", "1.1", "1.2", "1.3", "1.4"];


function renderVersionHistory(){
	
	
	// The current version will default to the latest one (the list will be sorted in order of newness)
	VERSIONS.sort();
	VERSIONS.reverse();
	
	
	for (var i = 0; i < VERSIONS.length; i ++){
		var v = VERSIONS[i];
		$("#versionSelector").append(`<option value="` + v + `">Version ` + v + `</option>`);
	}
	
	var currentVersionDirectory = "data";
	return currentVersionDirectory;
	
	
	
}



function selectVersion(){
	
	var currentVersion = $("#versionSelector").val();
	
	console.log("currentVersion", currentVersion);
	
	
	// If using the latest version, refer to the data folder. Otherwise use the folder name v<version-number> eg. v1.2/
	var currentVersionDirectory = "";
	if (currentVersion == VERSIONS[0]) currentVersionDirectory = "data";
	else currentVersionDirectory = "v" + currentVersion;
	
	
	populatePage(currentVersionDirectory);
	
}