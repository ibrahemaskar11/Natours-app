/* eslint-disable */
const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaWJyYWhpbWFza2FyLTExIiwiYSI6ImNsZG8ycm9nMzA1eTgzcXJzb3QxdzZvYnYifQ.ckorA7c_SujyqnkGZAwpFg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ibrahimaskar-11/cldo34dua000d01pgvvf80ac5',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};

const mapBox = document.getElementById('map');
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
