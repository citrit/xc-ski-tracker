
const mapView = new ol.View({
  center: ol.proj.fromLonLat([-73.887868, 43.185325]),
  zoom: 14
});

const BingMapStyles = [
  'RoadOnDemand',
  'Aerial',
  'AerialWithLabelsOnDemand',
  'CanvasDark',
  'OrdnanceSurvey',
];

const vectorLayers = [
  
];

const olMap = new ol.Map({
  target: 'mapDiv',
  layers: [ new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: 'AifZwUylySDsGAx5jp3QHunKxJ6Z0AkPa2-ZGFwb3-gtlIouPGBzI9H5DA-xUiPV',
      imagerySet: BingMapStyles[1],
      // use maxZoom 19 to see stretched tiles instead of the BingMaps
      // "no photos at this zoom level" tiles
      // maxZoom: 19
    })
  }) ],
  view: mapView,
  controls: ol.control.defaults().extend([
    new ol.control.FullScreen()
  ])
});

['trails/BH-Blue.gpx', 'trails/BH-Green.gpx', 'trails/BH-Red.gpx', 'trails/BH-Yellow.gpx', 'trails/GRC-Green.gpx'].forEach(geoFile => {
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

function mapResize(evt) {
  turnLocation(true);
  mapRect = document.getElementById('mapCont').getBoundingClientRect();
  console.log("mapCont: " + JSON.stringify(mapRect));
  $("#mapDiv").height(mapRect.height - 10);
  olMap.updateSize();
}

olMap.on('singleclick', function(evt){displayFeatureInfo(evt.coordinate);});

const displayFeatureInfo = function (coord) {

  const feature = null;
  const extent = new ol.extent.Extent()
  vectorLayers.forEach(vectorSource => {
    const boxFeatures = vectorSource
      .getFeaturesInExtent(extent)
      .filter((feature) => feature.getGeometry().intersectsExtent(extent));
    if (boxFeatures)
      feature = boxFeatures[0];
  }

  pixel = olMap.getPixelFromCoordinate(coord);
  const feature = olMap.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  },
  {
    hitTolerance: 10,
  });

  const info = $('#mapOverlay');
  if (feature) {
    info.html(`<p> Desc: ${feature.A.desc}</p>
    <p>Length: </p>`);
  } else {
    info.html("<p>Not near any trails</p>");
  }

  // if (feature !== highlight) {
  //   if (highlight) {
  //     featureOverlay.getSource().removeFeature(highlight);
  //   }
  //   if (feature) {
  //     featureOverlay.getSource().addFeature(feature);
  //   }
  //   highlight = feature;
  // }
};
