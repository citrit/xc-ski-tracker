
  
const geolocation = new ol.Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
        enableHighAccuracy: true,
    },
    projection: mapView.getProjection(),
});

// el('track').addEventListener('change', function () {
function turnLocation(onOff) {
    geolocation.setTracking(onOff);
};

// update the HTML page when the position changes.
geolocation.on('change', function () {
    infoTxt = "Acc: " + (!!geolocation.getAccuracy() ? geolocation.getAccuracy().toFixed(1) : 0) + ' [m]' +
    "   Alt: " + (!!geolocation.getAltitude() ? geolocation.getAltitude().toFixed(1) : 0) + ' [m]' +
//    "   Alt Accuracy: " + geolocation.getAltitudeAccuracy()?.toFixed(1) + ' [m]' +
    "   Dir: " + (!!geolocation.getHeading() ? geolocation.getHeading().toFixed(1) : 0) + ' [rad]' +
    "   Speed: " + (!!geolocation.getSpeed() ? geolocation.getSpeed().toFixed(1) : 0) + ' [m/s]';
    $("#infoMsg").text(infoTxt);
    
    if ($("#followme").is(':checked')) {
        olMap.getView().setCenter(geolocation.getPosition());
    }
    //if (geolocation.getHeading())
    //    olMap.getView().setRotation(geolocation.get());
    displayFeatureInfo(geolocation.getPosition());
    console.log("Position: " + JSON.stringify(geolocation.getPosition()) + " Heading: " + JSON.stringify(geolocation.getHeading()));
});

// handle geolocation error.
geolocation.on('error', function (error) {
    $('#infoMsg').text("Error: " + error.message);
});

const accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function () {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

const positionFeature = new ol.Feature();
positionFeature.setStyle(
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC',
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2,
            }),
        }),
    })
);

geolocation.on('change:position', function () {
    const coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
});

new ol.layer.Vector({
    map: olMap,
    source: new ol.source.Vector({
      features: [accuracyFeature, positionFeature],
    }),
  });
