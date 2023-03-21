
var lat = 0.0;
var long = 0.0;

if ('geolocation' in navigator){
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(position => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        console.log(position);
    });
    
    getMap();
}
else {
    console.log('geolocation not available');
}

function getMap (){
    var map = L.map('map').setView([lat, long], 1);
    L.tileLayer('https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' +
            ', Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
        maxZoom: 18
    }).addTo(map);

    var marker = L.marker([lat, long]).addTo(map);
    var popup = marker.bindPopup('<b>You are here!</b><br />');
    popup.openPopup();
}
