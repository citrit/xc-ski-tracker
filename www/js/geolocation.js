

var geolocation = null;
var trackFeature = null;

const geoLocationInit = function () {
    geolocation = new ol.Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
            enableHighAccuracy: true, tracking: true
        },
        projection: mapView.getProjection()
    });

    // update the HTML page when the position changes.
    geolocation.on('change', function () {
        infoTxt = "Acc: " + (!!geolocation.getAccuracy() ? geolocation.getAccuracy().toFixed(1) : 0) + ' [m]' +
            "   Alt: " + (!!geolocation.getAltitude() ? geolocation.getAltitude().toFixed(1) : 0) + ' [m]' +
            //    "   Alt Accuracy: " + geolocation.getAltitudeAccuracy()?.toFixed(1) + ' [m]' +
            "   Dir: " + (!!geolocation.getHeading() ? geolocation.getHeading().toFixed(1) : 0) + ' [rad]' +
            "   Speed: " + (!!geolocation.getSpeed() ? geolocation.getSpeed().toFixed(1) : 0) + ' [m/s]';
        $("#infoMsg").text(infoTxt);

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
        //if (geolocation.getHeading())
        //    olMap.getView().setRotation(geolocation.get());
        const coordinate = geolocation.getPosition();
        displayFeatureInfo(coordinate);
        positionFeature.setGeometry(coordinate ? new ol.geom.Point(coordinate) : null);
        
        if ($("#followme").is(':checked')) {
            olMap.getView().setCenter(coordinate);
        }
        
        if ($("#trackMe").is(':checked')) {
            console.log("Track pos: " + JSON.stringify(coordinate));
            trackFeature.getGeometry().appendCoordinate(coordinate);
        }
        else {
            trackLayer.getSource().clear();
            trackFeature = new ol.Feature({
                geometry: new ol.geom.LineString([])
            });
            trackLayer.getSource().addFeature(trackFeature);
        }
    });

    var trackLayer = new ol.layer.Vector({
        map: olMap,
        source: new ol.source.Vector({
            features: [accuracyFeature, positionFeature],
        }),
    });

    var trackStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0,0,255,1.0)',
            width: 3,
            lineCap: 'round'
        })
    });
    // use a single feature with a linestring geometry to display our track
    trackFeature = new ol.Feature({
        geometry: new ol.geom.LineString([])
    });
    // we'll need a vector layer to render it
    var trackLayer = new ol.layer.Vector({
        map: olMap,
        source: new ol.source.Vector({
            features: [trackFeature]
        }),
        style: trackStyle
    });
}


// el('track').addEventListener('change', function () {
function turnLocation(onOff) {
    geolocation.setTracking(onOff);
};