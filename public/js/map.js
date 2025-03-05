
mapboxgl.accessToken = mapToken;
//mapboxgl.coordinates = JSON.parse(coordinates);

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 8// starting zoom
    });
//console.log(coordinates);

const marker = new mapboxgl.Marker({color: "#fe424d"})
    .setLngLat(listing.geometry.coordinates)     //listing coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.title}</h4><p>Exact Location is will be provided after booking</p>`))
    .addTo(map);


