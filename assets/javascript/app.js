// Initialize Firebase
var config = {
	apiKey: 'AIzaSyCDSfVNfZX6SPPlwLjOrW4YJUzXNoKR4LI',
	authDomain: 'mapsapitest-f1b56.firebaseapp.com',
	databaseURL: 'https://mapsapitest-f1b56.firebaseio.com',
	projectId: 'mapsapitest-f1b56',
	storageBucket: 'mapsapitest-f1b56.appspot.com',
	messagingSenderId: '703244107069'
};

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();
var lat;
var long;
// Initialize and add the map
function initMap() {
  
    // The location of Toronto
    var toronto = { lat: 43.70011, lng: -79.4163 };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 10, center: toronto });
    // The marker, positioned at Toronto

    map.addListener('click', function (event) {
        //Store lat and long in local variables
        lat = event.latLng.lat()
        long = event.latLng.lng()

        //Display lat and long on html page

        //Add marker to map
        var marker = new google.maps.Marker({
            position: { lat: lat, lng: long },
            map: map,
            title: "POI"
        })

        //Store lat and long in database
        // database.ref().push({
        //     latitude: lat,
        //     longitude: long
        // })
    })

    //Setup listener for everytime a child is added to the root for the database
    database.ref().on("value", function (snapshot) {
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
		$('._AddLocForm').show().delay(500).addClass('animated flipInY').removeClass('flipInY');
		$('.action-buttons').show().delay(500).addClass('animated flipInY').removeClass('flipInY');
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
	});
});

//Rating
document.getElementById("submitLocation").addEventListener("click",function(){
    event.preventDefault();
    console.log("submit");
    var name=document.getElementById("nameInput").value;
    console.log(name);
    database.ref().push({
        nameID:name,
        latitude: lat,
        longitude: long,
    },function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    
})

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

}

function searchFucntion() {

}




