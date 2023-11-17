// Latitud y longitud del usuario
var latitud = 0, longitud = 0;

// Marcador de la ubicacion del usuario
var you = L.marker([latitud, longitud], {});

var routing = null;

// Layer que muestra los puntos de interes
var geojsonLayer = 0;

// API KEY
const apiKey = "AAPKe12daf4c275943c89f363ed5dc09abb89o7rOCRHjhqcfVpoNWwSbcDIqlqjgZ6WrkaDdDXRJQ0QpYv2Ofi6CE55f6LSRfqT";

// Contenedor del mapa
const map = L.map("map", {
    center: L.latLng(25.664509957849994, -100.24428119140069),
    zoom: 18
});

// Layer que muestra los graficos del mapa
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Funcion que obtiene la posicion del usuario y agrega un marcador a esa posicion
function obtenerPosicion() {
    navigator.geolocation.getCurrentPosition(function (position) {
        // Eliminamos el marcador antespuesto para que no se copie infinitamente
        you.remove();

        // Obtenemos la posicion del usuario
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;

        // Creamos el marcador
        you = L.marker([latitud, longitud], {}).addTo(map);
    }, function (error) {
        console.error("Error al obtener la posición: " + error.message);
    });
}
  
// Llamar a la función cada segundo
setInterval(obtenerPosicion, 1000);

// Funcion que obtiene los elementos que deseamos ver
function filtrar() {
    let $select = document.getElementById('filter');
    // Si ya esta una capa en la vista, eliminarla para evitar la copia infinita de capas
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }
    if ($select.value == "0") return;

    // Cargamos el json de la carpeta JSON
    fetch("../JSON/" + $select.value + ".json")
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no fue exitosa');
            }
            return response.json();
        })
        .then(data => {
            // Capa que muestra los datos obtenidos del json
            geojsonLayer = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    let routing = null;
                    return L.circleMarker(latlng, {
                        // Estilos del marcador
                        radius: 8,
                        fillColor: feature.properties["marker-color"],
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).on('click', function(e) {
                        routing = L.Routing.control({
                            waypoints: [
                                L.latLng(latitud, longitud),
                                L.latLng(e.latlng.lat, e.latlng.lng)
                            ]
                        }).addTo(map);
                    }).on('popupclose', function() {
                        if(routing) map.removeControl(routing);
                    });
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        // Popup es la ventanita que se abre cuando damos clic a un circulo
                        layer.bindPopup(feature.properties.name);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error al cargar el archivo GeoJSON:', error);
        });
}

// Funcion que centra la vista en la posicion del usuario
function centrar() {
    map.setView([latitud, longitud]);
}