

var olMap = null;
var mapView = null;
const vectorLayers = [];

function mapInit() {
  mapView = new ol.View({
    center: ol.proj.fromLonLat([-73.887868, 43.185325]),
    zoom: 14,
    maxZoom: 20,
  });

  const BingMapStyles = [
    'RoadOnDemand',
    'Aerial',
    'AerialWithLabelsOnDemand',
    'CanvasDark',
    'OrdnanceSurvey',
  ];

  olMap = new ol.Map({
    target: 'mapDiv',
    layers: [new ol.layer.Tile({
      source: new ol.source.BingMaps({
        key: 'AifZwUylySDsGAx5jp3QHunKxJ6Z0AkPa2-ZGFwb3-gtlIouPGBzI9H5DA-xUiPV',
        imagerySet: BingMapStyles[1],
        // use maxZoom 19 to see stretched tiles instead of the BingMaps
        // "no photos at this zoom level" tiles
        // maxZoom: 19
      })
    })],
    view: mapView,
    controls: ol.control.defaults().extend([
      new ol.control.FullScreen()
    ])
  });

  var mapFiles = ['trails/BH-Blue.gpx', 'trails/BH-Green.gpx', 'trails/BH-Orange.gpx', 'trails/BH-Yellow.gpx', 
                'trails/GRC-Green.gpx', 'trails/House-Orange.gpx', 'trails/House-Yellow.gpx',
                'trails/BH1-Red.gpx','trails/BH2-Red.gpx','trails/BH3-Red.gpx',
                'trails/BH1-Magenta.gpx', 'trails/BH2-Magenta.gpx', 'trails/BH3-Magenta.gpx', 'trails/BH4-Magenta.gpx', 'trails/BH5-Magenta.gpx'];
  //var fs = require('fs');
  //var mapFiles = fs.readdirSync('trails/');

  mapFiles.forEach(geoFile => {
    vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: geoFile,
        format: new ol.format.GPX(),
      }),
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: geoFile.split('-')[1].split('.')[0],
          width: 3,
        })
      })
    });
    olMap.addLayer(vectorLayer);
    vectorLayers.push(vectorLayer);
  });

  olMap.on('singleclick', function (evt) { displayFeatureInfo(evt.coordinate); });

}

function mapResize(evt) {
  turnLocation(true);
  mapRect = document.getElementById('mapCont').getBoundingClientRect();
  console.log("mapCont: " + JSON.stringify(mapRect));
  $("#mapDiv").height(mapRect.height - 10);
  olMap.updateSize();
}


const displayFeatureInfo = function (coord) {

  var feature = null;
  const extent = [coord[0] - 5, coord[1] - 5, coord[0] + 5, coord[1] + 5];
  vectorLayers.every(vectorLay => {
    const boxFeatures = vectorLay.getSource()
      .getFeaturesInExtent(extent)
      .filter((feature) => feature.getGeometry().intersectsExtent(extent));
    if (boxFeatures.length > 0) {
      feature = boxFeatures[0];
      return false;
    }
    return true;
  });

  // pixel = olMap.getPixelFromCoordinate(coord);
  // const feature = olMap.forEachFeatureAtPixel(pixel, function (feature) {
  //   return feature;
  // },
  // {
  //   hitTolerance: 10,
  // });

  const info = $('#mapOverlay');
  if (feature) {
    info.html(feature.A.desc);
  } else {
    info.html("<p>Not near any trails</p>");
  }

};
