
const mapView = new ol.View({
  center: ol.proj.fromLonLat([-73.887868, 43.185325]),
  zoom: 16
});

const BingMapStyles = [
  'RoadOnDemand',
  'Aerial',
  'AerialWithLabelsOnDemand',
  'CanvasDark',
  'OrdnanceSurvey',
];

const olMap = new ol.Map({
  target: 'mapDiv',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.BingMaps({
        key: 'AifZwUylySDsGAx5jp3QHunKxJ6Z0AkPa2-ZGFwb3-gtlIouPGBzI9H5DA-xUiPV',
        imagerySet: BingMapStyles[1],
        // use maxZoom 19 to see stretched tiles instead of the BingMaps
        // "no photos at this zoom level" tiles
        // maxZoom: 19
      })
    })
  ],
  view: mapView,
  controls: ol.control.defaults().extend([
    new ol.control.FullScreen()
  ])
});

function mapResize(evt) {
  turnLocation(true);
  mapRect = document.getElementById('mapCont').getBoundingClientRect();
  console.log("mapCont: " + JSON.stringify(mapRect) );
  $("#mapDiv").height(mapRect.height - 10);
  olMap.updateSize();
}