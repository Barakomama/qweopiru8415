var start = {
	events: function(){
		$("#signOut").on("click", start.signOut);
		$("#locationText").bind("keyup dblclick", start.populateLocation);
		$(".cityImage").on("click", start.showParkingInCity);
		$(".logout").on("click", start.signOut);
	},

	showParkingInCity: function(){ 
	 
		$.ajax({
			url: index.url + '/Location/GetList', 
			cache: false,
            data: {
                id: $(this).data("id")
            }, success: function (data) { 
            	var list = "";
            	if(data.id.length > 0){

            		for(var i = 0; i < data.id.length; i++){
            			switch(i){
	                    		case 0: color = "#fef995";
	                    			break;
	                    		case 1: color = "#fedb5b";
	                    			break;
                    			case 2: color = "#ffbc3d";
	                    			break;
	                    		case 3: color = "#ffa304";
	                    			break;
                    			case 4: color = "#ff9135";
                    				break; 
	                    	}

	                    	list += "<li class='list-group-item pad-li' style='background-color:"+color+"'>"+
	                    		data.name[i]+" in<br/>"+data.loc[i]+"</li>";
            		} 		
            	} 
            	else{
            		list = "<label>No Parking Available</label>";
            	}
            	$("#topParkingInCity").html("<ul class='list-group'>"+list+"</ul>"); 
            }
		});
	},

	populateLocation: function(){
		$("#content").html("");

		var key = $(this).val().toLowerCase();

		if(key != "" && $("#selectLocation option[value*='"+key+"']").length != 0){
			var ulAppend = "";
			for(var i = 0; i <= 5; i++){
				var value = $("#selectLocation option[value*='"+key+"']:eq("+i+")" ).html();
				
				if(i <= 4 && value != undefined){
					ulAppend += "<li>"+value+"</li>";
				}
			}
			if(ulAppend != "")
				$("#content").html("<ul data-role='listview' data-inset='true'>"+ulAppend+"</ul>");
		}
		else {
			$("#content").html("<ul data-role='listview' data-inset='true'><li><label>Location Not Found</label></li></ul>");
		}
	},

	signOut: function(){
		delete localStorage.name;
		delete localStorage.userid;

		window.location = "index.html";
	},

	load: function(){
		start.initializeMap();
	},

	initializeMap: function(){
		if(typeof Android === "undefined"){
			if (navigator.geolocation) {  
	           navigator.geolocation.getCurrentPosition(start.geolocationSuccess);
		    }
		    else{
		    	index.customModal("", "hide");
		       alert("Geolocation is not supported");
		    }
		}
		else
			Android.getPosition();
	},

	fetchCoords: function(lng, lat){
		var latlng = new google.maps.LatLng(lat, lng);
        start.getAddress(latlng);
	},

	geolocationSuccess: function(position){
		var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        start.getAddress(latlng);
	},

	getAddress: function(coord){
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'latLng': coord },
              function (results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0]) {
                      	var arrAddress = results[1].formatted_address,
                      		split = arrAddress.split(','),
                      		city = split[0],
                      		prov = split[1],
                      		country = split[2];   
                        start.showCities(city, prov, coord.lat(), coord.lng());
                      }
                      else {
                          alert('No Result.');
                      }
                  }
                  else {
                      alert(status);
                  }
              });
	},

	showCities: function(city, prov, lat, long){
		$.ajax({
            url: index.url + "/Parkowner/Nearest/", 
            cache: false,
            data: {
                city: city,
                province: prov,
                lat: lat,
                lon: long
            }, success: function (data) { 
                if (data.ok) {
                    var html = "",
                    	img;

                    for (var i = 0; i < data.id.length; i++) {
                        switch (i) {
                            case 0:
                                img = "css/images/paris.jpg";
                                break;
                            case 1:
                                img = "css/images/stairs.jpg";
                                break;
                            case 2:
                                img = "css/images/city.jpg";
                                break;
                        }

                        html += "<a href='#parkingInCity' data-transition='slide'><div data-id='"+data.id[i]+"' class='cityImage' style='background-image:url("+img+")'>"+data.name[i]+"</div></a>";

                    } 

                    if(data.near.length > 0){
                    	var list = "",
                    		dis = 0,
                    		color = "";
	                    for (var a = 0; a < data.near.length; a++) {
	                    	if(data.near[a].distance >= 1)
	                    		dis = data.near[a].distance.toFixed(2)+ " km"; 
	                    	else
	                    		dis = data.near[a].distance.toFixed(2)+" m";

	                    	switch(a){
	                    		case 0: color = "#fef995";
	                    			break;
	                    		case 1: color = "#fedb5b";
	                    			break;
                    			case 2: color = "#ffbc3d";
	                    			break;
	                    		case 3: color = "#ffa304";
	                    			break;
                    			case 4: color = "#ff9135";
                    				break; 
	                    	}

	                    	list += "<li class='list-group-item pad-li' style='background-color:"+color+"'>"+data.near[a].name+"<br/><label class='h6'>"+dis+"</label></li>";
	                    }

	                    $("#background-orange").html("<ul class='list-group'>"+list+"</ul>");
	                };
                    //index.customModal("", "hide"); 
                    $("#topCities").html(html);
                    start.events();
                    //start.showBookmarks(html);
                }

                else {
                    $("#topCities").html("");
                    alert("Can't Find Parking Nearby You"); 
                }

            }, error: function (data) {
                $("#topCities").hide().html("").fadeIn("normal");
               // start.onPageLoad();
            }
        });
	}
}

$(document).ready(function(){
	start.events();
	start.load();
	//index.events();
})