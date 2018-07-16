var config = {
    apiKey: 'AIzaSyCDSfVNfZX6SPPlwLjOrW4YJUzXNoKR4LI',
    authDomain: 'mapsapitest-f1b56.firebaseapp.com',
    databaseURL: 'https://mapsapitest-f1b56.firebaseio.com',
    projectId: 'mapsapitest-f1b56',
    storageBucket: 'mapsapitest-f1b56.appspot.com',
    messagingSenderId: '703244107069'
};

var API_KEY2 = 'AIzaSyDjQn6mu7DMp57MahmCyoS334lFoNXlzmE'
var WEATHERAPI_KEY = '137816d9575527268f67de5df6431d29'

firebase.initializeApp(config);


var database = firebase.database();
var lat;
var long;
var city;
var map;
var temperature;


function initMap() {

    // The location of Toronto
    var toronto = { lat: 43.70011, lng: -79.4163 };
    // The map, centered at Uluru
    map = new google.maps.Map(
        document.getElementById('map'), { zoom: 10, center: toronto });
    // The marker, positioned at Toronto

    getLocation();


    //Setup listener for everytime a child is added to the root for the database
    // database.ref("/City/" + city).on("child_added", function (snapshot) {
    //     console.log(snapshot.val());
    //     var lat = snapshot.val().latitude;
    //     var long = snapshot.val().longitude;


    //     var marker = new google.maps.Marker({
    //         position: { lat: lat, lng: long },
    //         map: map,
    //         title: "POI"
    //     })

    // }, function (errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    // });

}
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
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

        this.addClass('animated ' + animationName).one(animationEnd, function () {
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
        $('._header').animateCss('bounceOutUp', function () {
            $('._header').removeClass('bounceOutUp').hide();
        });
        $('._action-buttons').animateCss('bounceOutUp', function () {
            $('._action-buttons').removeClass('bounceOutUp').hide();
        });
        $('#map').animate({
            height: "80vh"
        }, 2000, function () {
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
        }, 2000, function () {

        });
        $('._AddLocForm').addClass('animated slideInUp').delay(500).hide('slow').removeClass('slideInUp');
        $('.action-buttons').addClass('animated slideInUp').delay(500).hide('slow').removeClass('slideInUp');
        $('._searchResults').hide();
    });
});


document.getElementById("submitLocation").addEventListener("click", function () {
    event.preventDefault();
    console.log("submit");
    var name = document.getElementById("nameInput").value.trim();
    console.log(name);
    var description = document.getElementById("addLocDesc").value.trim();
    console.log(description);
    if (validation(name, description, lat, long) === "condition_pass") {
        city = city.toLowerCase();
        database.ref("/City/" + city).push({
            nameID: name,
            latitude: lat,
            longitude: long,
            desc: description,
            descSearch: description.toLowerCase()
        });
    }
    else if (validation(name, description, lat, long) === "condition_no_lat&long") {
        alert("Plz Get Lat and Long");
    }
    else if (validation(name, description, lat, long) === "condition_no_name") {
        alert("plz Name");
    }
    else if (validation(name, description, lat, long) === "condition_no_description") {
        alert("plz desc");
    }
    else if (validation(name, description, lat, long) === "YOUSHALLNOTPASS") {
        alert("Plz type in something");
    }
});

document.getElementById("findPlace").addEventListener("click", function () {

    searchItem();
});

// $('._addPlace').on("click", function () {
//     getLocation();
// })

function updateDescription() {
    var descritpion = document.getElementById("addLocDesc").value;
    return descritpion;
}
//Check if there is anything in the add your location
function validation(name, description, lat, long) {
    if (name == "" || description == "" || typeof lat == "undefined" && typeof long == "undefined") {
        console.log("Nothing");
        if (name != "" && description != "" && typeof lat == "undefined" && typeof long == "undefined") {
            console.log("Type In long lat");
            return "condition_no_lat&long";
        }
        else if (name != "" && description == "") {
            console.log("Type in description");
            return "condition_no_description";
        }
        else if (name == "" && description != "") {
            console.log("Type In Name");
            return "condition_no_name";
        }

        return "YOUSHALLNOTPASS";
    }
    else
        return "condition_pass";
}

// function searchItem(searchName) {
//     var foundLocations = [];
//     var foundCity=[];
//     city=city.toLowerCase();
//     database.ref("/City/"+city).orderByChild("descSearch").equalTo(searchName).on("child_added", function (snapshot) {
//         var item = snapshot.val().descSearch;

//         console.log(item);
//         foundLocations.push(item);
//     });
//     if (foundLocations.length > 0) {
//         jQuery('#findPlaceModal').modal('hide');
//         renderResults(foundLocations);
//     } else {
//         alert('No locations found. Please try again.');
//     }
// }


// render table with results
function renderResults(resultsArray) {
    $("#searchResultsTable").empty();
    for (var i = 0; i < resultsArray.length; i++) {
        $("#searchResultsTable").append("<tr><td>" + city + "</td><td>" + resultsArray[i] + "</td>")
    };
    $('._searchResults').show('slow');
}

function searchItem(radius) {
    radius = 10;
    city = city.toLowerCase();
    var foundLocations = [];
    database.ref("/City/" + city).on("child_added", function (snapshot) {
        console.log(distance(lat, long, snapshot.val().latitude, snapshot.val().longitude, "N"));
        if (distance(lat, long, snapshot.val().latitude, snapshot.val().longitude, "N") <= radius) {
            var description = snapshot.val().desc;  
            console.log(description);
            foundLocations.push(description);
            var marker = new google.maps.Marker({
                position: { lat: snapshot.val().latitude, lng: snapshot.val().longitude},
                map: map,
                title: "POI"
            })
        }
    });
    if (foundLocations.length > 0) {
        //jQuery('#findPlaceModal').modal('hide');
        renderResults(foundLocations);
    } else {
        alert('No locations found. Please try again.');
    }

}



//Function for Search button
// document.getElementById("submitSearch").addEventListener("click", function () {
//     var searchName = document.getElementById("addDescription").value.toLowerCase();
//     console.log(searchName);
//     searchItem(searchName);

// });

function getLocation() {
    //These statements 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            getCity(lat, long);
            getTemperature(lat, long);

            var center = { lat: lat, lng: long }
            map.setOptions({ zoom: 13, center: center });


            var marker = new google.maps.Marker({
                position: { lat: lat, lng: long },
                map: map,
                title: "myLocation",
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            })

        }, function () {
            //handleLocationError(true, infoWindow, map.getCenter());
        });
    }
}

//This function accepts two coordinate objects and returns the distance between them
function distance(lat1, lon1, lat2, lon2, unit) {

    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
}

//This function return the city of a given lat, and long
function getCity(lat, long) {
    var queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&result_type=locality&key=" + API_KEY2
    var regionResponse;

    $.ajax({ url: queryUrl, method: "GET" }).then(function (response) {
        regionResponse = response.results[0].formatted_address

        city = regionResponse.slice(0, regionResponse.indexOf(','))
    })
}

function getTemperature(lat, long) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + WEATHERAPI_KEY;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var tempK = response.main.temp;
        var tempC = Math.round(tempK - 273.15);
        $("#weatherDisplay").html("<h2>" + tempC + "&#8451</h2>")
    });
}
