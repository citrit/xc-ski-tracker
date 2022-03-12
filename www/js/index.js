/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

let isRelease = false;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    //document.getElementById('deviceready').classList.add('ready');

    cordova.plugins.IsDebug.getIsDebug(function(isDebug) {
        isRelease = ! isDebug;
        console.log("Debug mode: " + isDebug + " Relase: " + isRelease);
    }, function(err) {
        console.error("Not debug mode");
        isRelease = true;
    });
    console.log("Setting screen orientation");
    screen.orientation.lock('portrait');
    // screen.orientation.onchange = function () {
    //     if (screen.orientation.type === "portrait-primary") {
    //         $("#header").show();
    //         $("#mapCont").css({ top: '85px' });
    //     }
    //     else {
    //         $("#header").hide();
    //         $("#mapCont").css({ top: '30px' });
    //     }
    //     console.log("Screen: " + screen.orientation.type); // e.g. portrait
    //     //mapResize();
    // };

    console.log("MapIniting.");
    mapInit();

    console.log("Loading trails: " + cordova.file.applicationDirectory + "www/trails/");
    //console.log(cordova.file.applicationDirectory + "www/trails/");
    loadTracks(cordova.file.applicationDirectory + "www/trails/");

    geoLocationInit();
    console.log("geoLocationInit.");
    
    mapResize();
    console.log("Initial mapResize.");

    // Set default `pagecontainer` for all popups (optional, but recommended for screen readers and iOS*)
    $('#JPO_dialog').popup({
        pagecontainer: '#mapCont',
        escape: false
      });
    $(".JPO_close").click(function() {
        $('#JPO_dialog').popup('hide');
    });

    createMeasureTooltip();
    cordova.getAppVersion.getVersionNumber(function(versionNumber){
        // 1.0.0
        console.log("version number", versionNumber);
        $("#versionInfo").text("v" + versionNumber);
    });
}

function toggleRecording() {
    if ($("#trackMe").text() === "Track Me") {
        $("#trackMe").text("Stop tracking")
    }
    else {
        $("#trackMe").text("Track Me")
    }
}

const debugStuff = function () {
    listMapFeatures();
}

window.addEventListener("resize", function() { mapResize();}, false);
//document.body.addEventListener("onresize", mapResize);