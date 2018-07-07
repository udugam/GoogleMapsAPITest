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
    var toronto = { lat: 43.70011, lng: -79.4163 };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 10, center: toronto });
    // The marker, positioned at Toronto

    map.addListener('click', function (event) {
        //Store lat and long in local variables
        var lat = event.latLng.lat()
        var long = event.latLng.lng()

        //Display lat and long on html page
        $("#lat").text("Latitude: " + lat);
        $("#long").text("Longitude: " + long);

        //Add marker to map
        var marker = new google.maps.Marker({
            position: { lat: lat, lng: long },
            map: map,
            title: "POI"
        })

        //Store lat and long in database
        database.ref().push({
            latitude: lat,
            longitude: long
        })
    })

    //Setup listener for everytime a child is added to the root for the database
    database.ref().on("child_added", function (snapshot) {
        var lat = snapshot.val().latitude
        var long = snapshot.val().longitude

        var marker = new google.maps.Marker({
            position: { lat: lat, lng: long },
            map: map,
            title: "POI"
        })

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}
//Rating

document.getElementById("like_Button").addEventListener("click", function () {
    console.log("clicked");
    var currentLike =parseInt(document.getElementById("like").innerHTML);
    console.log("currentlike"+currentLike);
    if (currentLike === 0) {
        currentLike++;
    }
    else {
        currentLike = currentLike + 1;
    }
    console.log(currentLike);
    document.getElementById("like").innerHTML = currentLike;
});


function updateDescription() {

}

function searchFucntion() {

}




