function SearchForm(){
    aAuxData = aAllData;
	aSearchData = [];
	aFilteredData = [];
	var string = document.getElementById('inputSearch').value.toLowerCase();
	for (var i in aAuxData){
		var crit = aAuxData[i].title.toLowerCase();
		if(crit.indexOf(string)!=-1){
			aSearchData.push(aAuxData[i]);
			searching=true;
		}
	}
	aFilteredData = aSearchData;
	resetFilters();
	LoadFilters(aEntities);
	ShowData();
	history.pushState('', document.title, window.location.pathname+window.location.search);
	return false;
}
function CheckText(e){
	var key = e.keyCode || e.which;
	tecla = String.fromCharCode(key).toLowerCase();
	if ( (key==42) || (key==47) || (key==92) || (key==36) ){
		e.keyCode = 0;
		return false;
	}
	if(key==13){
		SearchForm();
	}
}
function SaveSearch(){
	var string = document.getElementById('inputSearch').value;
	var item = {"url": "/#/"+string , "label": string};
	aEntities.saved.push(item);
	resetFilters();
	LoadFilters(aEntities);
	document.getElementById('inputSearch').value="";
}
function LoadSearch(string){
	document.getElementById('inputSearch').value = string;
	SearchForm();
}
function resetFilters(){
	aFilters[1] = [false, "", "category"];
	aFilters[2] = [false, "", "language"];
	aFilters[3] = [false, "", "edition"];
	aFilters[4] = [false, "", "datepub"];
	filter = "";
	index = "";
	page = 0;
}