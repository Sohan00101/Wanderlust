mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(createPopupContent()))
.addTo(map);

function createPopupContent() {
const content = document.createElement("div");
const title = document.createElement("h4");
const description = document.createElement("p");

title.textContent = listing.title;
description.textContent = "Exact Location will be provided after bookings";
content.append(title, description);

return content;
}
