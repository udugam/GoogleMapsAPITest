// Initialize Firebase
var config = {
	apiKey: 'AIzaSyCDSfVNfZX6SPPlwLjOrW4YJUzXNoKR4LI',
	authDomain: 'mapsapitest-f1b56.firebaseapp.com',
	databaseURL: 'https://mapsapitest-f1b56.firebaseio.com',
	projectId: 'mapsapitest-f1b56',
	storageBucket: 'mapsapitest-f1b56.appspot.com',
	messagingSenderId: '703244107069'
};

var API_KEY2 = 'AIzaSyDjQn6mu7DMp57MahmCyoS334lFoNXlzmE'

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();
var lat;
var long;
var city;
var map;
// Initialize and add the map
function initMap() {
  
    // The location of Toronto
    var toronto = { lat: 43.70011, lng: -79.4163 };
    // The map, centered at Uluru
    map = new google.maps.Map(
        document.getElementById('map'), { zoom: 10, center: toronto });
    // The marker, positioned at Toronto

    //Setup listener for everytime a child is added to the root for the database
    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val());
        var lat = snapshot.val().latitude;
        var long = snapshot.val().longitude;

        var marker = new google.maps.Marker({
            position: { lat: lat, lng: long },
            map: map,
            title: "POI"
        })

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
	});
	
}
$.fn.extend({
	animateCss: function(animationName, callback) {
		var animationEnd = (function(el) {
			var animations = {
				animation: 'animationend',
				OAnimation: 'oAnimationEnd',
				MozAnimation: 'mozAnimationEnd',
				WebkitAnimation: 'webkitAnimationEnd',
			};

			for (var t in animations) {
				if (el.style[t] !== undefined) {
					return animations[t];
				}
			}
		})(document.createElement('div'));

		this.addClass('animated ' + animationName).one(animationEnd, function() {
			$(this).removeClass('animated ' + animationName);

			if (typeof callback === 'function') callback();
		});

		return this;
	},
});

$(document).ready(function () {
	$('._AddLocForm').hide();
    $('#_alertMessage').hide();
	$('._searchResults').hide();
    $('.action-buttons').hide();
	$('._addPlace').on('click', function () {
		$('._header').animateCss('bounceOutUp', function() {
			$('._header').removeClass('bounceOutUp').hide();
		});
		$('._action-buttons').animateCss('bounceOutUp', function() {
			$('._action-buttons').removeClass('bounceOutUp').hide();
		});
		$('#map').animate({
			height: "80vh"
		}, 2000, function() {
			// Animation complete.
		});
        $('#_locForm').show();
        $('#_alertMessage').hide();
		$('._AddLocForm').show().delay(500).addClass('animated flipInY').removeClass('flipInY');
		$('.action-buttons').show().delay(500).addClass('animated flipInY').removeClass('flipInY');
        $('._searchResults').hide();
	});

	$('#cancelLocation').on('click', function () {
		$('._header').show().delay(500).addClass('animated bounceInDown').removeClass('bounceInDown');
		$('._action-buttons').show().delay(500).addClass('animated bounceInDown').removeClass('bounceInDown');
		$('#map').animate({
			height: "60vh"
		}, 2000, function() {
			// Animation complete.
		});
		$('._AddLocForm').addClass('animated slideInUp').delay(500).hide('slow').removeClass('slideInUp');
		$('.action-buttons').addClass('animated slideInUp').delay(500).hide('slow').removeClass('slideInUp');
        $('._searchResults').hide();
	});
});

//Rating
document.getElementById("submitLocation").addEventListener("click",function(){
    event.preventDefault();
    console.log("submit");
    var name=document.getElementById("nameInput").value.trim();
    console.log(name);
    var description=document.getElementById("addLocDesc").value.trim();
    console.log(description);
    if(name && description) {
		database.ref().push({
			nameID: name,
			latitude: lat,
			longitude: long,
			city: city,
			desc: description,
			descSearch: description.toLowerCase()
		});
        $('#_alertMessage').show();
        $('#_locForm').hide().reset();
    } else {
    	alert('Please enter the location name and description.');
	}
    
});

$('._addPlace').on("click", function() {
	getLocation();
});

// document.getElementById("like").addEventListener("click", function () {
//     console.log("clicked");
//     var currentLike =parseInt(document.getElementById("like").innerHTML);
//     console.log("currentlike"+currentLike);
//     if (currentLike === 0) {
//         currentLike++;
//     }
//     else {
//         currentLike = currentLike + 1;
//     }
//     console.log(currentLike);
//     document.getElementById("like").innerHTML = currentLike;
// });
    

function updateDescription() {
    var descritpion=document.getElementById("addLocDesc").value;
    return descritpion;
}

//Search Function
function searchItem(searchName){
	var foundLocations = [];
    database.ref().orderByChild("descSearch").startAt(searchName).endAt(searchName+"\u{F8FF}").on("child_added",function(snapshot){
       var item=snapshot.val();
       foundLocations.push(item);
    });
    if(foundLocations.length > 0) {
        jQuery('#findPlaceModal').modal('hide');
        renderResults(foundLocations);
    } else {
    	alert('No locations found. Please try again.');
	}
}


// render table with results
function renderResults(resultsArray) {
    $("#searchResultsTable").empty();
    resultsArray.forEach(function (element, index) {
        $("#searchResultsTable").append("<tr><td>" + element.city + "</td><td>" + element.desc + "</td>")
    });
    $('._searchResults').show('slow');
}



//Function for Search button
document.getElementById("submitSearch").addEventListener("click",function(){
    var searchName=document.getElementById("addDescription").value.toLowerCase();
    console.log(searchName);
    searchItem(searchName);

});

function getLocation() {
	//These statements 
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			lat= position.coords.latitude;
			long= position.coords.longitude;
			getCity(lat,long);

			var center = {lat: lat, lng:long}
			map.setOptions({ zoom: 13, center: center });
			

			var marker = new google.maps.Marker({
				position: { lat: lat, lng: long },
				map: map,
				title: "myLocation",
				icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
			})
			
		}, function() {
			//handleLocationError(true, infoWindow, map.getCenter());
		});
	}
}

//This function accepts two coordinate objects and returns the distance between them
function distance(lat1, lon1, lat2, lon2, unit) {

	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

//This function return the city of a given lat, and long
function getCity(lat, long) {
    var queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&result_type=locality&key="+API_KEY2
	var regionResponse;

	$.ajax({url:queryUrl,method:"GET"}).then(function(response) {
		regionResponse = response.results[0].formatted_address
		
		city = regionResponse.slice(0,regionResponse.indexOf(','))
    })
}


