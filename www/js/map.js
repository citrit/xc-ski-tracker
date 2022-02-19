

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
  //var fs = require('fs');
  //var mapFiles = fs.readdirSync('trails/');

  // mapFiles.forEach(geoFile => {
  //   vectorLayer = new ol.layer.Vector({
  //     source: new ol.source.Vector({
  //       url: geoFile,
  //       format: new ol.format.GPX(),
  //     }),
  //     style: new ol.style.Style({
  //       stroke: new ol.style.Stroke({
  //         color: geoFile.split('-')[1].split('.')[0],
  //         width: 3,
  //       })
  //     })
  //   });
  //   olMap.addLayer(vectorLayer);
  //   vectorLayers.push(vectorLayer);
  // });

  olMap.on('singleclick', function (evt) { displayFeatureInfo(evt.coordinate, 10); });

}

function mapResize(evt) {
  turnLocation(true);
  mapRect = document.getElementById('mapCont').getBoundingClientRect();
  console.log("mapCont: " + JSON.stringify(mapRect));
  $("#mapDiv").height(mapRect.height);
  olMap.updateSize();
}

var mapFiles = ['BH-Blue.gpx', 'BH-Green.gpx', 'BH-Orange.gpx', 'BH-Yellow.gpx',
    'GRC-Green.gpx', 'House-Orange.gpx', 'House-Yellow.gpx',
    'BH1-Red.gpx', 'BH2-Red.gpx', 'BH3-Red.gpx',
    'BH1-Magenta.gpx', 'BH2-Magenta.gpx', 'BH3-Magenta.gpx', 'BH4-Magenta.gpx', 'BH5-Magenta.gpx'];

function loadTracks(path) {
  console.log("Listing trails: ");
  window.resolveLocalFileSystemURL(path,
    function (fileSystem) {
      var reader = fileSystem.createReader();
      reader.readEntries(
        function (entries) {
          entries.forEach(item => {
            loadTrack(item.name);
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
      //console.log("FileSystem err: " + JSON.stringify(err));
    }
  );

  function loadTrack(fileName) {
    if (isRelease && (fileName.includes("House") || fileName.includes("GRC"))) {
      return;
    }
    var lcolor = fileName.split('-')[1].split('.')[0];
    //console.log("Files: " + fileName);
    vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: "trails/" + fileName,
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
    vectorLayers.push(vectorLayer);
  }
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
    info.html("No trail near by.");
  }

};
