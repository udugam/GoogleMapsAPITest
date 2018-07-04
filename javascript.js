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
        $("#lat").text("Latitude: "+event.latLng.lat());
        $("#long").text("Longitude: "+event.latLng.lng());
    })
}

