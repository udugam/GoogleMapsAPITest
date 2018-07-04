// Initialize Firebase
var config = {
    apiKey: "AIzaSyCDSfVNfZX6SPPlwLjOrW4YJUzXNoKR4LI",
    authDomain: "mapsapitest-f1b56.firebaseapp.com",
    databaseURL: "https://mapsapitest-f1b56.firebaseio.com",
    projectId: "mapsapitest-f1b56",
    storageBucket: "mapsapitest-f1b56.appspot.com",
    messagingSenderId: "703244107069"
};

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();


// Initialize and add the map
function initMap() {
    // The location of Toronto
    var toronto = {lat: 43.70011, lng: -79.4163};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 10, center: toronto});
    // The marker, positioned at Toronto
    // var marker = new google.maps.Marker({position: toronto, map: map});

    map.addListener('click', function(event) {
        //Store lat and long in local variables
        var lat = event.latLng.lat()
        var long = event.latLng.lng()

        //Display lat and long on html page
        $("#lat").text("Latitude: "+lat);
        $("#long").text("Longitude: "+long);

        //Add marker to map
        var marker = new google.maps.Marker( {
            position: {lat: lat, lng: long},
            map: map,
            title: "POI"
        })

        //Store lat and long in database
        database.ref().push({
            latitude: lat,
            longitude: long
        })
    })
}





