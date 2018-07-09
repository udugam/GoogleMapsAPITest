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
    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val());
        var lat = snapshot.val().latitude;
        console.log(lat);
        var long = snapshot.val().longitude;
        searchFucntion();
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
document.getElementById("submitLocation").addEventListener("click",function(){
    event.preventDefault();
    console.log("submit");
    var name=document.getElementById("nameInput").value;
    console.log(name);
    database.ref().push({
        nameID: name,
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
    // database.ref().orderByKey().on("value",function(childSnapshot){
    //     console.log("LOLOLOLOLO")
    //     console.log(childSnapshot);
    // })

    var query = firebase.database().ref().orderByKey();
    query.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            console.log(childSnapshot)
          // key will be "ada" the first time and "alan" the second time
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
      });
    });

}




