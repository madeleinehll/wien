/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup(),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup(),
  zones: L.featureGroup(),
  hotels: L.featureGroup(),
}
// Hintergrundlayer, über control automatisch positioniert
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT Cycle": L.tileLayer.provider("CyclOSM"),
  },{
    "Sehenswürdigkeiten": themaLayer.sights,
    "Vienna Liniennetz": themaLayer.lines,
    "Vienna Haltestellen": themaLayer.stops,
    "Vienna Fußgängerzonen": themaLayer.zones,
    "Vienna Hotels": themaLayer.hotels,
  })
  .addTo(map);

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

//Fullscreen
map.addControl(new L.Control.Fullscreen());
//Bernds Version
//L.control
//.fullscreen ()
//.addTo(map);

//* für Schmuckbild
//target = öffnen in neuem Tab
async function loadSights(url) {
  console.log("Loading", url);
  let response = await fetch (url);
  let geojson = await response.json();
  L.geoJSON(geojson,{
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(`${feature.properties.NAME}`);
      layer.bindPopup(`
      <img src="${feature.properties.THUMBNAIL}" alt="*">
      <h4> <a href="${feature.properties.WEITERE_INF}"
      target="wien">${feature.properties.NAME}</a></h4>
      <adress>${feature.properties.ADRESSE} </adress>
      `);
    }
  }).addTo(themaLayer.sights);
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")

async function loadLines(url) {
  console.log("Loading", url);
  let response = await fetch (url);
  let geojson = await response.json();
  L.geoJSON(geojson,{
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(`${feature.properties.LINE_NAME}`);
      layer.bindPopup(`
      <p><i class="fa-solid fa-bus"> ${feature.properties.LINE_NAME}</i></p>
      <i class="fa-regular fa-circle-stop"></i> ${feature.properties.FROM_NAME}<br>
      <i class="fa-solid fa-arrow-down"></i><br>
      <i class="fa-regular fa-circle-stop"></i> ${feature.properties.TO_NAME}
      `);
    }
  }).addTo(themaLayer.lines);
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")


async function loadStops(url) {
  console.log("Loading", url);
  let response = await fetch (url);
  let geojson = await response.json();
  L.geoJSON(geojson,{
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(`${feature.properties.STAT_NAME}`);
      layer.bindPopup(`
      <i class="fa-solid fa-bus"> ${feature.properties.LINE_NAME}</i>

      `);
    }
  }).addTo(themaLayer.stops);
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")



async function loadZones(url) {
  console.log("Loading", url);
  let response = await fetch (url);
  let geojson = await response.json();
  L.geoJSON(geojson,{
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(`${feature.properties.ADRESSE}`);
      layer.bindPopup(`
     
      `);
    }
  }).addTo(themaLayer.zones);
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")

async function loadHotels(url) {
  console.log("Loading", url);
  let response = await fetch (url);
  let geojson = await response.json();
  L.geoJSON(geojson,{
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(`${feature.properties.BETRIEB}`);
      layer.bindPopup(`
      <adress>${feature.properties.ADRESSE} </adress>
      `);
    }
  }).addTo(themaLayer.hotels);
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")

