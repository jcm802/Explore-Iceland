mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: thingstodo.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
});

new mapboxgl.Marker()
    // .setLngLat([-74.5, 40])
    .setLngLat(thingstodo.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3 style="color:black;text-shadow:none;">${thingstodo.title}</h3><p style="color:gray;text-shadow:none;">${thingstodo.location}</p>`
        )
    )
    .addTo(map)

const nav = new mapboxgl.NavigationControl({
    visualizePitch: true
    });
    map.addControl(nav, 'top-right');
    