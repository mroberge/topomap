/**
 * @author Marty
 */
//Marty's UI
function update(element, pasteObject) {
    element.textContent = pasteObject;
    return element;
}

function get(id) {
    return document.getElementById(id);
}

function show(elname) {
    console.log("show: " + elname);
    var element = document.getElementById(elname);
    element.style.display = 'block';
}

function hide(elname) {
    console.log("hide: " + elname);
    var element = document.getElementById(elname);
    element.style.display = 'none';
}

function toggleshow(elname) {
    console.log("showtoggle: " + elname);
    var element = document.getElementById(elname);
    if (element.style.display == 'block') {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], width = w.innerWidth || e.clientWidth || g.clientWidth, height = w.innerHeight || e.clientHeight || g.clientHeight;

var map = null;
//var panoramioLayer = new google.maps.panoramio.PanoramioLayer(); //TODO: find panoramio replacement.
var chart = null;
//var totLen = null;
//var totArea = null;

var geocoderService = null;
var elevationService = null;
var directionsService = null;

var mousemarker = null;
var markers = [];
var polyline = null;
var polyline2 = null;
var elevations = null;
//var pathLength = null;
//use for length of latlngs: []

var SAMPLES = 256;


var examples = [{
// Lombard St
    latlngs: [
        [37.801000, -122.426499],
        [37.802051, -122.419418],
        [37.802729, -122.413989]
    ],
    mapType: google.maps.MapTypeId.TERRAIN,
    travelMode: 'direct'
},{
//Waipio, HI
    latlngs: [
        [20.117386,-155.57941],
        [20.1000,-155.58000],
        [20.200668,-155.741158]
    ],
    mapType: google.maps.MapTypeId.TERRAIN,
    travelMode: 'direct'
},{
// Mount Everest
    latlngs: [
        [27.973323, 86.908035],
        [28.020614, 86.960906]
    ],
    mapType: google.maps.MapTypeId.TERRAIN,
    travelMode: 'direct'
},{
// Challenger Deep
    latlngs: [
        [9.764009, 143.076632],
        [11.932658, 142.373507]
    ],
    mapType: google.maps.MapTypeId.SATELLITE,
    travelMode: 'direct'
},{
// Death Valley
    latlngs: [
        [37.040952, -117.300314],
        [35.896862, -116.654868],
        [35.972751, -116.270689]
    ],
    mapType: google.maps.MapTypeId.TERRAIN,
    travelMode: 'direct'
},{
// Grand Canyon
    latlngs: [
        [36.012196, -112.100348],
        [36.221866, -112.098975]
    ],
    mapType: google.maps.MapTypeId.TERRAIN,
    travelMode: 'direct'
},{
// Uluru
    latlngs: [
        [-25.34696, 131.022323],
        [-25.34060, 131.045927]
    ],
    mapType: google.maps.MapTypeId.SATELLITE,
    travelMode: 'direct'
}];

// Load the Visualization API and the columnchart package.
//google.load("visualization", "1", {packages: ["columnchart"]});
google.load("visualization", "1", {
    packages : ["scatterchart"]
});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(initialize);

function initialize() {
    var myLatlng = new google.maps.LatLng(15, 0);
    var myOptions = {
        zoom : 1,
        center : myLatlng,
        mapTypeId : google.maps.MapTypeId.TERRAIN,
        scaleControl : true
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    //chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

    geocoderService = new google.maps.Geocoder();
    elevationService = new google.maps.ElevationService();
    directionsService = new google.maps.DirectionsService();

    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, true);
    });

    google.visualization.events.addListener(chart, 'onmouseover', function(e) {
        if (mousemarker == null) {
            mousemarker = new google.maps.Marker({
                position : elevations[e.row].location,
                map : map,
                icon : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            });
        } else {
            mousemarker.setPosition(elevations[e.row].location);
        }
    });

    loadExample(0);
}

function plotElevation(results) {
    // Takes an array of ElevationResult objects, draws the path on the map
    // and plots the elevation profile on a GViz ColumnChart
    elevations = results;
    var path = [];
    for (var i = 0; i < results.length; i++) {
        path.push(elevations[i].location);
    }

    if (polyline) {
        polyline.setMap(null);
    }
    if (polyline2) {
        polyline2.setMap(null);
    }

    polyline = new google.maps.Polyline({
        path : path,
        strokeColor : "#000000",
        strokeWeight : 3,
        zIndex : 1,
        map : map
    });

    polyline2 = new google.maps.Polyline({
        path : [path[0], path[path.length - 1]], //change path to just connect the first point and the last point.
        strokeColor : "#ff6f2d",
        strokeOpacity : 0,
        zIndex : 0,
        icons : [{
            icon : {
                path : 'M 0,-0.5 0,0.5',
                strokeOpacity : 1,
                strokeWeight : 6,
                scale : 1
            },
            offset : '100%',
            repeat : '12px'
        }],
        map : map
    });
    updateText(path, elevations);

    var data = new google.visualization.DataTable();
    //data.addColumn('string', 'Sample'); //original
    data.addColumn('number', 'Distance');
    //for scatterchart
    data.addColumn('number', 'Elevation');
    var pathLength2 = google.maps.geometry.spherical.computeLength(path).toFixed(0);
    //calculating again!
    var dist = pathLength2 / SAMPLES;
    //to calculate distance along path, find path length / number of samples -1.
    var distance = 0;
    //console.log("New dist: " + dist);
    for (var i = 0; i < results.length; i++) {
        distance = dist * i;
        //data.addRow(['', elevations[i].elevation]);//original;
        data.addRow([distance, elevations[i].elevation]);
        //for scatterchart
    }

    document.getElementById('chart_div').style.display = 'block';
    var chartwidth = width * 0.7;
    chart.draw(data, {
        width : chartwidth, //Chart width 600
        height : 200,

        //pointSize: 1,
        legend : 'none',
        titleY : 'Elevation (m)',
        titleX : 'Distance (m)',
        //focusBorderColor: '#00ff00',//green, to match the moving map marker.  ?!?!this option isn't listed in the API.
        focusBorderColor : {
            'stroke' : '#00ff00',
            'strokeSize' : 10
        },
        pointSize : 4, //ignored
        lineWidth : 1 //sigh. ignored.
        //hAxis: {title: 'distance', minValue:0, maxValue: 100},//This stuff just gets ignored!!!
        //vAxis: {title: 'Elevation'}//ignored!!?!!        });
        //console.log(data);
    });
}

// Remove the green rollover marker when the mouse leaves the chart
function clearMouseMarker() {
    if (mousemarker != null) {
        mousemarker.setMap(null);
        mousemarker = null;
    }
}

// Geocode an address and add a marker for the result
function addAddress() {
    var address = document.getElementById('address').value;
    geocoderService.geocode({
        'address' : address
    }, function(results, status) {
        document.getElementById('address').value = "";
        if (status == google.maps.GeocoderStatus.OK) {
            var latlng = results[0].geometry.location;
            addMarker(latlng, true);
            if (markers.length > 1) {
                var bounds = new google.maps.LatLngBounds();
                for (var i in markers) {
                    bounds.extend(markers[i].getPosition());
                }
                map.fitBounds(bounds);
            } else {
                map.fitBounds(results[0].geometry.viewport);
            }
        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
            alert("Address not found");
        } else {
            alert("Address lookup failed");
        }

    });
}

// Add a marker and trigger recalculation of the path and elevation
function addMarker(latlng, doQuery) {
    var maxLength = 150;
    if (markers.length < maxLength) {//Do I want to limit the number of points??

        var marker = new google.maps.Marker({
            position : latlng,
            map : map,
            draggable : true
        });

        google.maps.event.addListener(marker, 'dragend', function(e) {
            updateElevation();
        });

        markers.push(marker);

        if (doQuery) {
            updateElevation();
        }

        if (markers.length == maxLength) {
            document.getElementById('address').disabled = true;
        }
    } else {
        alert("No more than " + maxLength + " points can be added");
    }
}

// Trigger the elevation query for point to point
// or submit a directions request for the path between points
function updateElevation() {
    if (markers.length > 1) {
        var travelMode = 'direct';
        if (travelMode != 'direct') {//I disabled the other travelmodes.
            calcRoute(travelMode);
        } else {
            var latlngs = [];
            for (var i in markers) {
                latlngs.push(markers[i].getPosition());
            }

            elevationService.getElevationAlongPath({
                path : latlngs,
                samples : SAMPLES
            }, plotElevation);
            //updateText(latlngs);//new plan: call from within plotElevation so that I can use the array of elevations.
        }
    }
}

function updateText(path, elevs) {
    var textDiv = document.getElementById('text_div');
    textDiv.style.display = 'block';

    //console.log(elevs);

    var pathLength = google.maps.geometry.spherical.computeLength(path);
    var directLength = google.maps.geometry.spherical.computeDistanceBetween(path[0], path[path.length - 1]);
    var closedLength = +pathLength + +directLength;
    //convert to number
    var pathAreaMeters = google.maps.geometry.spherical.computeArea(path)/1000000;
    var startElev = elevs[0].elevation;
    var endElev = elevs[elevs.length - 1].elevation;
    var minElev = null;
    var maxElev = null;
    for (var i = 0, len = elevs.length; i < len; ++i)
    {
        var elem = elevs[i].elevation;
        if (minElev === null || minElev > elem) minElev = elem;
        if (maxElev === null || maxElev < elem) maxElev = elem;
    }
    var relief = maxElev - minElev;
    var pathSlope = relief / pathLength;
    var directSlope = relief / directLength;
    var sinuosity = pathLength / directLength;

    //var longString = //This would be easier with Handlebars or such...
    //"<h3>Path Information</h3><p>" + "<abbr title='the distance along the black line'>Path length</abbr>: " + pathLength + " meters<br>" + "<abbr title='the distance along the dotted orange line'>Direct length</abbr>: " + directLength + " meters<br>" + "<abbr title='the distance along the perimeter of the enclosed area'>Closed path length</abbr>: " + closedLength + " m<br><br>" + "<abbr title='the area inside the black and orange lines.'>Area</abbr>: " + pathAreaMeters + " sq. meters<br><br>" + "<abbr title='the height above sea level for the first point'>Start elevation</abbr>: " + startElev + " meters A.M.S.L<br>" + "<abbr title='the height above sea level for the last point'>End elevation</abbr>: " + endElev + " meters A.M.S.L<br>" + "<abbr title='the difference in height between the first point and the last point'>Relief</abbr>: " + relief + " meters<br><br>" + "<abbr title='the difference in height between the first point and the last point, divided by the length of the black line'>Path slope</abbr>: " + pathSlope.toFixed(4) + "<br>" + "<abbr title='the difference in height between the first point and the last point, divided by the length of the dotted orange line'>Direct slope</abbr>: " + directSlope.toFixed(4) + "<br><br>" + "<abbr title='the length of the black line divided by the length of the dotted orange line'>Sinuosity</abbr>: " + sinuosity.toFixed(2) + "</p>";
    update(get("pathLength"), pathLength.toFixed(0));
    update(get("directLength"), directLength.toFixed(0));
    update(get("closedLength"), closedLength.toFixed(0));
    update(get("pathArea"), pathAreaMeters.toFixed(1));
    update(get("startElev"), startElev.toFixed(0));
    update(get("endElev"), endElev.toFixed(0));
    update(get("maxElev"), maxElev.toFixed(0));
    update(get("minElev"), minElev.toFixed(0));
    update(get("relief"), relief.toFixed(0));
    update(get("pathSlope"), pathSlope.toFixed(4));
    update(get("directSlope"), directSlope.toFixed(4));
    update(get("sinuosity"), sinuosity.toFixed(2));


    //textDiv.innerHTML = longString;
}

// Submit a directions request for the path between points and an
// elevation request for the path once returned
function calcRoute(travelMode) {
    var origin = markers[0].getPosition();
    var destination = markers[markers.length - 1].getPosition();

    var waypoints = [];
    for (var i = 1; i < markers.length - 1; i++) {
        waypoints.push({
            location : markers[i].getPosition(),
            stopover : true
        });
    }

    var request = {
        origin : origin,
        destination : destination,
        waypoints : waypoints
    };

    switch (travelMode) {
        case "bicycling":
            request.travelMode = google.maps.DirectionsTravelMode.BICYCLING;
            break;
        case "driving":
            request.travelMode = google.maps.DirectionsTravelMode.DRIVING;
            break;
        case "walking":
            request.travelMode = google.maps.DirectionsTravelMode.WALKING;
            break;
    }

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            elevationService.getElevationAlongPath({
                path : response.routes[0].overview_path,
                samples : SAMPLES
            }, plotElevation);
        } else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
            alert("Could not find a route between these points");
        } else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            alert("This webpage has reached is query limit. Too many elevation requests have been made today.");
        } else {
            alert("Directions request failed");
        }

    });
}

// Trigger a geocode request when the Return key is
// pressed in the address field
function addressKeyHandler(e) {
    var keycode;
    if (window.event) {
        keycode = window.event.keyCode;
    } else if (e) {
        keycode = e.which;
    } else {
        return true;
    }


    if (keycode == 13) {
        addAddress();
        return false;
    } else {
        return true;
    }
}

function loadExample(n) {
    reset();
    map.setMapTypeId(examples[n].mapType);
    //document.getElementById('mode').value = examples[n].travelMode;
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < examples[n].latlngs.length; i++) {
        var latlng = new google.maps.LatLng(examples[n].latlngs[i][0], examples[n].latlngs[i][1]);
        addMarker(latlng, false);
        bounds.extend(latlng);
    }
    map.fitBounds(bounds);
    updateElevation();
}

// Clear all overlays, reset the array of points, and hide the chart
function reset() {
    if (polyline) {
        polyline.setMap(null);
    }

    if (polyline2) {
        polyline2.setMap(null);
    }

    for (var i in markers) {
        markers[i].setMap(null);
    }

    markers = [];

    document.getElementById('chart_div').style.display = 'none';
    document.getElementById('text_div').style.display = 'none';
}


