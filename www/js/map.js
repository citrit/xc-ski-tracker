
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


const style = {
  'Point': new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: 'rgba(255,255,0,0.4)',
      }),
      radius: 5,
      stroke: new ol.style.Stroke({
        color: '#ff0',
        width: 1,
      }),
    }),
  }),
  'LineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#f00',
      width: 3,
    }),
  }),
  'MultiLineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#0f0',
      width: 3,
    }),
  }),
};

const layers = [
  new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: 'AifZwUylySDsGAx5jp3QHunKxJ6Z0AkPa2-ZGFwb3-gtlIouPGBzI9H5DA-xUiPV',
      imagerySet: BingMapStyles[1],
      // use maxZoom 19 to see stretched tiles instead of the BingMaps
      // "no photos at this zoom level" tiles
      // maxZoom: 19
    })
  })
];

['trails/BH-Blue.gpx', 'trails/BH-Green.gpx', 'trails/BH-Red.gpx', 'trails/BH-Yellow.gpx'].forEach(geoFile => {
  const vectorLayer = new ol.layer.Vector({
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
  layers.push(vectorLayer);
});


const olMap = new ol.Map({
  target: 'mapDiv',
  layers: layers,
  view: mapView,
  controls: ol.control.defaults().extend([
    new ol.control.FullScreen()
  ])
});

olMap.addLayer(vectorLayer);

function mapResize(evt) {
  turnLocation(true);
  mapRect = document.getElementById('mapCont').getBoundingClientRect();
  console.log("mapCont: " + JSON.stringify(mapRect));
  $("#mapDiv").height(mapRect.height - 10);
  olMap.updateSize();
}
