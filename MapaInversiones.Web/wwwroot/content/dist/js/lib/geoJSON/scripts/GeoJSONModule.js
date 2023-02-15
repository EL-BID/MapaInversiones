/****************************************************************************
* Author: Brian Norman (Earthware Ltd)
* Website: http://www.earthware.co.uk
* Date:May 23th, 2012
* 
* Description:
* This module allows you to import GeoJSON files into Bing Maps. A GeoJSON feed will be downloaded 
* and parsed into an EntityCollection which can then be added to the map. Additional properties are 
* captured and stored in a Metadata tag on each shape making it easy to relate shapes to their metadata.
*
* Currently supports:
* GeoJSON Spec 1.0 http://www.geojson.org/geojson-spec.html
*   - Point
*   - MultiPoint
*   - LineString
*   - MultiLineString
*   - Polygon
*   - MultiPolygon
*   - Geometry Collection
*   - Feature
*   - Feature Collection
*
*
* Currently no support for complex polygons.
****************************************************************************/

//Define custom Metadata property for the shape classes.
Microsoft.Maps.Pushpin.prototype.Metadata = null;
Microsoft.Maps.Polyline.prototype.Metadata = null;
Microsoft.Maps.Polygon.prototype.Metadata = null;
Microsoft.Maps.EntityCollection.prototype.Metadata = null;

var GeoJSONModule = function () {
    var _callback = null,
        _allCoords = [],
        _options = {
            pushpinOptions: null,
            polylineOptions: null,
            polygonOptions: null
    ***REMOVED***;

    /*****************
    * Private Methods
    ******************/
    function parseGeoJSON(json) {
        if (_callback != null) {
            var result = parseGeoJSONItem(json);
            var bounds;

            if (_allCoords != null && _allCoords.length > 0) {
                bounds = Microsoft.Maps.LocationRect.fromLocations(_allCoords);
        ***REMOVED*** else {
                bounds = new Microsoft.Maps.LocationRect(new Microsoft.Maps.Location(0, 0), 360, 180);
        ***REMOVED***

            _callback(result, bounds);
    ***REMOVED***
***REMOVED***

    function parseGeoJSONItem(i) {
        var shape = null;

        switch (i.type) {
            case "FeatureCollection":
                shape = parseFeatureCollection(i);
                break;
            case "Feature":
                shape = parseFeature(i);
                break;
            case "Point":
                var point = parsePoint(i);
                shape = createPushpin(point);
                if (i.properties) shape.Metadata = i.properties;
                break;
            case "LineString":
                shape = parseLineString(i);
                break;
            case "Polygon":
                shape = parsePolygon(i);
                break;
            case "MultiPoint":
                shape = new Microsoft.Maps.EntityCollection();
                $(parseMultiPoint(i)).each(function (i, v) {
                    shape.push(createPushpin(v));
            ***REMOVED***);
                break;
            case "MultiLineString":
                shape = new Microsoft.Maps.EntityCollection();
                $(parseMultiLineString(i)).each(function (i, v) {
                    shape.push(v);
            ***REMOVED***);
                break;
            case "MultiPolygon":
                shape = new Microsoft.Maps.EntityCollection();
                $(parseMultiPolygon(i)).each(function (i, v) {
                    shape.push(v);
            ***REMOVED***);
                break;
            case "GeometryCollection":
                shape = parseGeometryCollection(i);
                break;
            default:
                // do nothing with it not a supported element
    ***REMOVED***
        return shape;
***REMOVED***
    /* methods for parsing GeoJSON*/

    function parsePoint(p) {
        var loc = new Microsoft.Maps.Location(p.coordinates[1], p.coordinates[0]);
        _allCoords.push(loc);
        return loc;
***REMOVED***

    function parseLineString(ls) {
        var result = new Microsoft.Maps.Polyline(parseMultiPoint(ls), _options.polylineOptions);
        if (ls.properties) result.Metadata = ls.properties;
        return result;
***REMOVED***

    function parsePolygon(po) {
        var rings = [];
        $(po.coordinates).each(function (i, v) {
            rings.push(parseMultiPoint({ coordinates: v ***REMOVED***));
    ***REMOVED***);
        var result = new Microsoft.Maps.Polygon(rings, _options.polygonOptions);
        if (po.properties) result.Metadata = po.properties;
        return result;
***REMOVED***

    function parseMultiPoint(mp) {
        var locs = [];
        $(mp.coordinates).each(function (i, v) {
            locs.push(parsePoint({ coordinates: v ***REMOVED***));
    ***REMOVED***);
        if (mp.properties) locs.Metadata = mp.properties;
        return locs;
***REMOVED***

    function parseMultiLineString(mls) {
        var ls = [];
        $(mls.coordinates).each(function (i, v) {
            ls.push(parseLineString({ coordinates: v ***REMOVED***));
    ***REMOVED***);
        if (mls.properties) ls.Metadata = mls.properties;
        return ls;
***REMOVED***

    function parseMultiPolygon(mpo) {
        var pos = [];
        $(mpo.coordinates).each(function (i, v) {
            $(v).each(function (ii, vv) {
                pos.push(parsePolygon({ coordinates: vv ***REMOVED***));
        ***REMOVED***);
    ***REMOVED***);
        if (mpo.properties) pos.Metadata = mpo.properties;
        return pos;
***REMOVED***

    function parseGeometryCollection(gc) {
        var entityCollection = new Microsoft.Maps.EntityCollection();
        $(gc.geometries).each(function (i, v) {
            var entity = parseFeature({ geometry: v ***REMOVED***);

            if (entity) entityCollection.push(entity);
    ***REMOVED***);
        if (gc.properties) entityCollection.Metadata = gc.properties;
        return entityCollection;
***REMOVED***

    function parseFeature(fe) {
        var entity;
        var i = fe.geometry;
        switch (i.type) {
            case "Point":
                var point = parsePoint(i);
                entity = createPushpin(point);
                if (i.properties) entity.Metadata = i.properties;
                break;
            case "LineString":
                entity = parseLineString(i);
                break;
            case "Polygon":
                entity = parsePolygon(i);
                break;
            case "MultiPoint":
                entity = new Microsoft.Maps.EntityCollection();
                $(parseMultiPoint(i)).each(function (i, v) {
                    entity.push(createPushpin(v));
            ***REMOVED***);
                break;
            case "MultiLineString":
                entity = new Microsoft.Maps.EntityCollection();
                $(parseMultiLineString(i)).each(function (i, v) {
                    entity.push(v);
            ***REMOVED***);
                break;
            case "MultiPolygon":
                entity = new Microsoft.Maps.EntityCollection();
                $(parseMultiPolygon(i)).each(function (i, v) {
                    entity.push(v);
            ***REMOVED***);
                break;
            default:
                // do nothing with it not a supported element
    ***REMOVED***

        if (fe.properties) entity.Metadata = fe.properties;

        return entity;
***REMOVED***

    function parseFeatureCollection(fc) {
        var entityCollection = new Microsoft.Maps.EntityCollection();
        $(fc.features).each(function (i, v) {
            entityCollection.push(parseFeature(v));
    ***REMOVED***);
        return entityCollection;
***REMOVED***

    /* methods for creating Bing Maps entities including passed in options */
    function createPushpin(point) {
        return new Microsoft.Maps.Pushpin(point, _options.pushpinOptions);
***REMOVED***

    /****************
    * Public Methods
    ****************/

    /*
    * Takes in a URL to a GeoRSS file, loads and parses it into an Entity Collection. Data is then sent back to a callback function.
    */
    this.ImportGeoJSON = function (link, callback, options) {
        _callback = callback;

        if (options != null) {
            for (attrname in options) {
                _options[attrname] = options[attrname];
        ***REMOVED***
    ***REMOVED***

        $.getJSON(link, function (json) {
            parseGeoJSON(json);
    ***REMOVED***);
***REMOVED***;
***REMOVED***;

(function () {
    //Load complex polygon module is not already loaded
    var p = new Microsoft.Maps.Polygon();
    if (!p.getRings) {
        Microsoft.Maps.loadModule('Microsoft.Maps.AdvancedShapes', { callback: function () {
            // Call the Module Loaded method
            Microsoft.Maps.moduleLoaded('GeoJSONModule');
    ***REMOVED***
    ***REMOVED***);
***REMOVED*** else {
        // Call the Module Loaded method
        Microsoft.Maps.moduleLoaded('GeoJSONModule');
***REMOVED***
***REMOVED***)();