/*
  constants and global functions
*/

var JSON_FILE = '/books-schema.json';
var aAllData=[];
var aFilteredData=[];
var aSearchData=[];
var aAuxData=[];
var aEntities=[];
var aPubDate=[];
var searching=false;
var index="";
var filter = "";
var aFilters = [];
var page = 0;
var regIni = 0;
var regFin = 0;
var regsPerPage = 9;
var maxPages = 5;
/*
 @method loadJSON
 source: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
	var loadJSON = function(url, callback){
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open("GET", url, true);
		xobj.onreadystatechange = function(responseText){
			if(xobj.readyState == 4 && xobj.status == "200"){
				var content = JSON.parse(xobj.responseText);
				callback.call(this, content);
			}
		};
		xobj.send(null);
	};
*/
function LoadPage(){									// # FUNCION 1 - CARGAR GENERAL
	aFilters[1] = [false, "", "category"];
	aFilters[2] = [false, "", "language"];
	aFilters[3] = [false, "", "edition"];
	aFilters[4] = [false, "", "datepub"];
	
	aPubDate[1] = [1, "Hoy"];
	aPubDate[2] = [2, "Hace una semana"];
	aPubDate[3] = [3, "Hace un mes"];
	aPubDate[4] = [4, "Hace un año"];
	
	var response=[];
	if(window.XMLHttpRequest) {
		requestHttp = new XMLHttpRequest();
	}else if(window.ActiveXObject) {
		requestHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	requestHttp.onreadystatechange = LoadDataAll;
	requestHttp.open('GET', JSON_FILE, true);
	requestHttp.send(null);
	
	function LoadDataAll() {
		if(requestHttp.readyState == 4) {
			if(requestHttp.status == 200) {
				var content = JSON.parse(requestHttp.responseText);
				aAllData = content['data'];
				aEntities = content['entities'];
				FilterData('','');						// # FILTRAR LA DATA (FUNCION 3)
			}
		}
	};
}
function LoadFilters(vEntities){						// # FUNCION 2 - CARGAR LOS FILTROS
	// SAVED
	var itemSav="";
	var listSaved = document.getElementById('savedList');
	for(var i in vEntities['saved']) {
		var labelSaved = vEntities.saved[i].label;
		var idSaved = vEntities.saved[i].url;
		if(index==i){
			itemSav += '<li>'+labelSaved+'</li>';
		}else{
			itemSav += '<li><a href="#'+idSaved+'" onclick="LoadSearch(\''+labelSaved+'\');" >'+labelSaved+'</a></li>';
		}
	}
	// CATEGORIES
	var itemCat="";
	var listCategories = document.getElementById('categoryList');
	if(aFilters[1][1]==""){
		itemCat = '<li>Todos</li>';
	}else{
		itemCat = '<li><a href="#" onclick="FilterData(\'category\',\'\');" >Todos</a></li>';
	}
	for(var i in vEntities['categories'][0]) {
		var labelCategory = vEntities.categories[0][i].label;
		var idCategory = vEntities.categories[0][i].id;
		if(aFilters[1][1]==i){
			itemCat += '<li>'+labelCategory+'</li>';
		}else{
			itemCat += '<li><a href="#'+i+'" onclick="FilterData(\'category\',\''+i+'\');" >'+labelCategory+'</a></li>';
		}
	}
	// LANGUAGE
	var itemLang="";
	var listLang = document.getElementById('languageList');
	if(aFilters[2][1]!=""){
		itemLang = '<li><a href="#" onclick="FilterData(\'language\',\'\');" >Todos</a></li>';
	}else{
		itemLang = '<li>Todos</li>';
	}
	for(var i in vEntities.lang[0]) {
	//	console.log(vEntities.lang[0][i].label);
		var labelLang = vEntities.lang[0][i].label;
		var idLang = vEntities.lang[0][i].id;
		if(aFilters[2][1]==idLang){
			itemLang += '<li>'+labelLang+'</li>';
		}else{
			itemLang += '<li><a href="#" onclick="FilterData(\'language\',\''+idLang+'\');" >'+labelLang+'</a></li>';
		}
	}
	// PUBLICACION
	var itemPub="";
	var listPublics = document.getElementById('datePubList');
	if(aFilters[4][1]==""){
		itemPub = '<li>Todos</li>';
	}else{
		itemPub = '<li><a href="#" onclick="FilterData(\'datepub\',\'\');" >Todos</a></li>';
	}
	for(var i in aPubDate) {
		var labelPublic = aPubDate[i][1];
		var idPublic = aPubDate[i][0];
		if(aFilters[4][1]==i){
			itemPub += '<li>'+labelPublic+'</li>';
		}else{
			itemPub += '<li><a href="#" onclick="FilterData(\'datepub\',\''+idPublic+'\');" >'+labelPublic+'</a></li>';
		}
	}
	// EDITION
	var itemEdit="";
	var listEdition = document.getElementById('editionList');
	if(aFilters[3][1]==""){
		itemEdit = '<li>Todos</li>';
	}else{
		itemEdit = '<li><a href="#" onclick="FilterData(\'edition\',\'\');" >Todos</a></li>';
	}
	
	for(var i in vEntities.edition[0]) {
	//	console.log(vEntities.edition[0][i].label);
		var labelEdition = vEntities.edition[0][i].label;
		var idEdition = vEntities.edition[0][i].id;
		if(index==idEdition){
			itemEdit += '<li>'+labelEdition+'</li>';
		}else{
			itemEdit += '<li><a href="#" onclick="FilterData(\'edition\',\''+idEdition+'\');" >'+labelEdition+'</a></li>';
		}
	}
	switch(filter){
		case "category":
			listCategories.innerHTML = itemCat;
			break;
		case "language":
			listLang.innerHTML = itemLang;
			break;
		case "datepub":
			listPublics.innerHTML = itemPub;
			break;
		case "edition":
			listEdition.innerHTML = itemEdit;
			break;
		default:
			listSaved.innerHTML = itemSav;
			listCategories.innerHTML = itemCat;
			listLang.innerHTML = itemLang;
			listEdition.innerHTML = itemEdit;
			listPublics.innerHTML = itemPub;
	}
}
function FilterData(vFilter, vIndex){					// # FUNCION 3 - FILTRAR LA DATA
	filter = vFilter;
	index = vIndex;
	page = 0;
	var flagShowAll=true;
	//alert(vFilter+"-> "+vIndex)
	if(vFilter=="category") {aFilters[1][0] = true; aFilters[1][1] = vIndex;}
	if(vFilter=="language") {aFilters[2][0] = true; aFilters[2][1] = vIndex;}
	if(vFilter=="edition") {aFilters[3][0] = true; aFilters[3][1] = vIndex;}
	if(vFilter=="datepub") {aFilters[4][0] = true; aFilters[4][1] = vIndex;}
	aFilteredData = (searching===false) ? aAllData : aSearchData;
	aAuxData = [];
	for(i=1; i<aFilters.length; i++){
	//	alert(aFilters[i][0]);
		if(aFilters[i][0]){
			//alert("Filtro "+ i + " activo!!");
			FixFilter(i);								// # APLICAR LOS FILTROS EN CONJUNTO (FUNCION 6)
			flagShowAll=false;
		}
	}
	aFilteredData = (flagShowAll) ? aAllData : aFilteredData;
	//alert("Datos filtrados fuera: "+aFilteredData.length);
	ShowData();											// # MOSTRAR LA DATA FILTRADA (FUNCION 4)
	LoadFilters(aEntities);								// # CARGAR LOS FILTROS (FUNCION 2)
	
}
function ShowData(){									// # FUNCION 4 - MOSTRAR LA DATA FILTRADA
	totalRegs=aFilteredData.length;
	//alert("PAGINANDO; "+totalRegs)
	regIni = regsPerPage * page;
	regFin = regIni + regsPerPage;
	var regFrom = regIni+1;
	var regTo = regIni + regsPerPage;
	var regTo = (regTo>totalRegs) ? totalRegs : regTo;
	var listData = document.getElementById('resultContent');
	listData.innerHTML = "";
	regFin = (regFin>totalRegs) ? totalRegs: regFin;
	for(i=regIni; i<regFin; i++) {
		var textData = '<div class="list-item">'+
					'	<div class="item-image">'+
					'		<img src="'+aFilteredData[i].image+'" >'+
					'	</div>'+
					'	<div><h3>'+aFilteredData[i].title+'</h3></div>'+
					'	<div><p>'+aFilteredData[i].teaser+'</p></div>'+
					'</div>';
		listData.innerHTML = listData.innerHTML + textData;
	}
	var xPages = totalRegs/regsPerPage;
	var xPages = Math.round(xPages);
	var xRest = totalRegs%regsPerPage;
	var xPages = ((xPages*regsPerPage)>totalRegs) ? (xPages-1) : xPages;
	//alert("TOTAL:"+totalRegs+", Páginas:"+xPages+", Sobran:"+ xRest)
	pageIni = page -2;
	pageIni = (pageIni>-1) ? (pageIni) : 0;
	pageFin = pageIni + maxPages-1;
	pageFin = (pageFin>xPages) ? xPages : pageFin;
	var textPage = (page==0) ? '<div class="btn-paginate btn-paginate-off" > << </div>' : '<div onclick="IrPagina(0)" class="btn-paginate" > << </div>';
	pageIni = ((pageFin-pageIni) < 4) ? (pageFin-4) : pageIni;
	for(p=pageIni; p<=pageFin; p++){
		pgId = p+1;
		if(p==page){
			textPage += '<div class="btn-paginate btn-paginate-off active" >'+pgId+'</div>';
		}else{
			textPage += '<div onclick="IrPagina('+p+')" class="btn-paginate" >'+pgId+'</div>';
		}
	}
	regFrom = (regTo==0) ? 0 : regFrom;
	textPage += (page<xPages) ? '<div onclick="IrPagina('+xPages+')" class="btn-paginate" > >></div>' : '<div class="btn-paginate btn-paginate-off" > >></div>';
		var msg = '<div class="paginate-block paginate-block-left" >Mostrando del '+regFrom+' al '+regTo+' de un total de '+totalRegs+ '</div>';
		var pag = '<div class="paginate-block paginate-block-right" >'+textPage+'</div>';
		listData.innerHTML = listData.innerHTML + '<div class="paginate" >' + msg + pag + '</div>';
}
function IrPagina(pageid){								// # FUNCION 5 - IR A PÁGINA CLICKEADA
	page = pageid;
	ShowData();
}
function FixFilter(filterId){							// # FUNCION 6 - APLICAR LOS FILTROS EN CONJUNTO
	//alert(aFilters[filterId][0] +"-> "+ aFilters[filterId][2] +": "+ aFilters[filterId][1]);
	if(aFilters[filterId][0]){
		aAuxData = aFilteredData;
		aFilteredData=[];
		//alert(aFilters[filterId][0] +"-> "+ aFilters[filterId][2] +": "+ aFilters[filterId][1]);
		switch(aFilters[filterId][2]){
			case "category":
				if(aFilters[filterId][1]!=""){
					for(var i in aAuxData) {
						if(aAuxData[i].categories==aFilters[filterId][1]){
							aFilteredData.push(aAuxData[i]);
						}
					}
				}else{
					aFilteredData = aAuxData;
					aFilters[filterId][0]=false;
					aFilters[filterId][1]="";
				}
				break;
			case "language":
				if(aFilters[filterId][1]!=""){
					for(var i in aAuxData){
						for(var p in aAuxData[i].lang){
							if(aAuxData[i].lang[p]==aFilters[filterId][1]){
								aFilteredData.push(aAuxData[i]);
							}
						}
					}
				}else{
					aFilteredData = aAuxData;
					aFilters[filterId][0]=false;
					aFilters[filterId][1]="";
				}
				history.pushState('', document.title, window.location.pathname+window.location.search);
				break;
			case "edition":
				if(aFilters[filterId][1]!=""){
					for(var i in aAuxData){
						for(var p in aAuxData[i].mode){
							if(aAuxData[i].mode[p]==aFilters[filterId][1]){
								aFilteredData.push(aAuxData[i]);
							}
						}
					}
				}else{
					aFilteredData = aAuxData;
					aFilters[filterId][0]=false;
					aFilters[filterId][1]="";
				}
				history.pushState('', document.title, window.location.pathname+window.location.search);
				break;
			case "datepub":
				if(aFilters[filterId][1]!=""){
					for(var i in aAuxData) {
						var resultCompareDates = CompareDate(aAuxData[i].date_pub, aFilters[filterId][1]);
						if(resultCompareDates){
							aFilteredData.push(aAuxData[i]);
						}
					}
				}else{
					aFilteredData = aAuxData;
					aFilters[filterId][0]=false;
					aFilters[filterId][1]="";
				}
				break;
			default:
				alert("NADA");
		}
	}
}

function CompareDate(vDate, vFunc){						// # FUNCION 7 - COMPARAR FECHAS SEGÚN FILTRO
	switch(vFunc){
		case "1":
			var today = new Date();
				today = formatDate(today,0);
			if((Date.parse(today)) == (Date.parse(vDate))){
				return true;
			}
			break;
		case "2":
			var week = new Date();
				week = formatDate(week,-7,"d");
			if((Date.parse(week)) <= (Date.parse(vDate))){
				return true;
			}
			break;
		case "3":
			var month = new Date();
				month = formatDate(month,-1,"m");
			if((Date.parse(month)) <= (Date.parse(vDate))){
				return true;
			}
			break;
		case "4":
			var year = new Date();
				year = formatDate(year,-1,"y");
			if((Date.parse(year)) <= (Date.parse(vDate))){
				return true;
			}
			break;
		default:
			return false;
	}
}
function formatDate(vDate, added, vCase) {				// # FUNCION 8 - FORMATEAR FECHAS SEGÚN LO REQUERIDO
	switch(vCase){
		case "d":
			vDate.setDate(vDate.getDate() + added);
			break;
		case "m":
			vDate.setMonth(vDate.getMonth() + added);
			break;
		case "y":
			vDate.setYear(vDate.getFullYear() + added);
			break;
		default:
			return false;
	}
	return vDate.getMonth()+1 + "/" + vDate.getDate() + "/" + vDate.getFullYear();
}
window.onload = LoadPage();