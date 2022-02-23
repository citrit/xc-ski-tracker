

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

  olMap.on('singleclick', function (evt) {
    console.log("Picked point on map: " + JSON.stringify(evt.coordinate));
    displayFeatureInfo(evt.coordinate, 10);
  });

}

function mapResize(evt) {
  turnLocation(true);
  mapRect = document.getElementById('mapCont').getBoundingClientRect();
  console.log("mapCont: " + JSON.stringify(mapRect));
  $("#mapDiv").height(mapRect.height);
  olMap.updateSize();
}

var mapFiles = [{ "name": 'BH-Blue.gpx' }, { "name": 'BH-Green.gpx' }, { "name": 'BH-Orange.gpx' }, { "name": 'BH-Yellow.gpx' },
{ "name": 'GRC-Green.gpx' }, { "name": 'House-Orange.gpx' }, { "name": 'House-Yellow.gpx' },
{ "name": 'BH1-Red.gpx' }, { "name": 'BH2-Red.gpx' }, { "name": 'BH3-Red.gpx' },
{ "name": 'BH1-Magenta.gpx' }, { "name": 'BH2-Magenta.gpx' }, { "name": 'BH3-Magenta.gpx' }, { "name": 'BH4-Magenta.gpx' }, { "name": 'BH5-Magenta.gpx' }];

function loadTracks(path) {
  console.log("Listing trails: ");
  window.resolveLocalFileSystemURL(path,
    function (fileSystem) {
      console.log("resolveLocalFileSystemURL");
      var reader = fileSystem.createReader();
      reader.readEntries(
        function (entries) {
          console.log("readEntries");
          entries.forEach(item => {
            //console.log("File: " + JSON.stringify(item));
            loadTrack(item);
          });
        },
        function (err) {
          console.log("Read Entries err: " + JSON.stringify(err));
        }
      );
    }, function (err) {
      mapFiles.forEach(geoFile => {
        loadTrack(geoFile);
      });
      console.log("FileSystem err: " + JSON.stringify(err));
    }
  );
  console.log("Loaded tracks: " + vectorLayers.length);
}

function loadTrack(fileName) {
  if (isRelease && (fileName.name.includes("House") || fileName.includes("GRC"))) {
    return;
  }
  var layURL = fileName.toURL(); //"./trails/" + fileName.name;
  var lcolor = fileName.name.split('-')[1].split('.')[0];
  //console.log("loadTrack: " +fileName);
  vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: layURL,
      format: new ol.format.GPX(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: lcolor,
        width: 3,
        lineDash: (lcolor === "White" || lcolor === "Plum" ? [7, 7] : [1]) //or other combinations
      })
    })
  });
  olMap.addLayer(vectorLayer);
  //console.log("Added to map: " + JSON.stringify(layURL));
  vectorLayers.push(vectorLayer);
}


const displayFeatureInfo = function (coord, dist = 5) {
  var feature = null;
  const extent = [coord[0] - dist, coord[1] - dist, coord[0] + dist, coord[1] + dist];
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

  const info = $('#mapOverlay');
  
  hitMsg = info.html();

  if (dist == 5) {
    if (feature) {
      hitMsg = feature.A.desc;
    }
    else {
      hitMsg = "There are no trails nearby.";
    }
  }
  else if (feature) {
    $('#JPO_Content').html(feature.A.desc);
    $('#JPO_dialog').popup('show');
    console.log("Popup should be there");
  }
  info.html(hitMsg);
};

const listMapFeatures = function () {
  console.log("Looking for features..." + vectorLayers.length);
  vectorLayers.forEach(vectorLay => {
    const boxFeatures = vectorLay.getSource().getFeatures();
    console.log("Features: " + boxFeatures.length);
  });
};
