/**
 * @license r.js 2.1.2 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*
 * This is a bootstrap script to allow running RequireJS in the command line
 * in either a Java/Rhino or Node environment. It is modified by the top-level
 * dist.js file to inject other files to completely enable this file. It is
 * the shell of the r.js file.
 */

/*jslint evil: true, nomen: true, sloppy: true */
/*global readFile: true, process: false, Packages: false, print: false,
console: false, java: false, module: false, requirejsVars, navigator,
document, importScripts, self, location */

var requirejs, require, define;
(function (console, args, readFileFunc) {

    var fileName, env, fs, vm, path, exec, rhinoContext, dir, nodeRequire,
        nodeDefine, exists, reqMain, loadedOptimizedLib, existsForNode,
        version = '2.1.2',
        jsSuffixRegExp = /\.js$/,
        commandOption = '',
        useLibLoaded = {***REMOVED***,
        //Used by jslib/rhino/args.js
        rhinoArgs = args,
        readFile = typeof readFileFunc !== 'undefined' ? readFileFunc : null;

    function showHelp() {
        console.log('See https://github.com/jrburke/r.js for usage.');
***REMOVED***

    if ((typeof navigator !== 'undefined' && typeof document !== 'undefined') ||
            (typeof importScripts !== 'undefined' && typeof self !== 'undefined')) {
        env = 'browser';

        readFile = function (path) {
            return fs.readFileSync(path, 'utf8');
    ***REMOVED***;

        exec = function (string, name) {
            return eval(string);
    ***REMOVED***;

        exists = function (fileName) {
            console.log('x.js exists not applicable in browser env');
            return false;
    ***REMOVED***;

***REMOVED*** else if (typeof Packages !== 'undefined') {
        env = 'rhino';

        fileName = args[0];

        if (fileName && fileName.indexOf('-') === 0) {
            commandOption = fileName.substring(1);
            fileName = args[1];
    ***REMOVED***

        //Set up execution context.
        rhinoContext = Packages.org.mozilla.javascript.ContextFactory.getGlobal().enterContext();

        exec = function (string, name) {
            return rhinoContext.evaluateString(this, string, name, 0, null);
    ***REMOVED***;

        exists = function (fileName) {
            return (new java.io.File(fileName)).exists();
    ***REMOVED***;

        //Define a console.log for easier logging. Don't
        //get fancy though.
        if (typeof console === 'undefined') {
            console = {
                log: function () {
                    print.apply(undefined, arguments);
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
***REMOVED*** else if (typeof process !== 'undefined') {
        env = 'node';

        //Get the fs module via Node's require before it
        //gets replaced. Used in require/node.js
        fs = require('fs');
        vm = require('vm');
        path = require('path');
        //In Node 0.7+ existsSync is on fs.
        existsForNode = fs.existsSync || path.existsSync;

        nodeRequire = require;
        nodeDefine = define;
        reqMain = require.main;

        //Temporarily hide require and define to allow require.js to define
        //them.
        require = undefined;
        define = undefined;

        readFile = function (path) {
            return fs.readFileSync(path, 'utf8');
    ***REMOVED***;

        exec = function (string, name) {
            return vm.runInThisContext(this.requirejsVars.require.makeNodeWrapper(string),
                                       name ? fs.realpathSync(name) : '');
    ***REMOVED***;

        exists = function (fileName) {
            return existsForNode(fileName);
    ***REMOVED***;


        fileName = process.argv[2];

        if (fileName && fileName.indexOf('-') === 0) {
            commandOption = fileName.substring(1);
            fileName = process.argv[3];
    ***REMOVED***
***REMOVED***

    /** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.2 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, jQuery, setTimeout, opera */


(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.2',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        aps = ap.slice,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && navigator && document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {***REMOVED***,
        cfg = {***REMOVED***,
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
***REMOVED***

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
***REMOVED***

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
***REMOVED***

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
***REMOVED***

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value !== 'string') {
                        if (!target[prop]) {
                            target[prop] = {***REMOVED***;
                    ***REMOVED***
                        mixin(target[prop], value, force, deepStringMixin);
                ***REMOVED*** else {
                        target[prop] = value;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
        return target;
***REMOVED***

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
    ***REMOVED***;
***REMOVED***

    function scripts() {
        return document.getElementsByTagName('script');
***REMOVED***

    //Allow getting a global that expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
    ***REMOVED***
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
    ***REMOVED***);
        return g;
***REMOVED***

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String***REMOVED*** id the error ID that maps to an ID on a web page.
     * @param {String***REMOVED*** message human readable error.
     * @param {Error***REMOVED*** [err] the original error, if there is one.
     *
     * @returns {Error***REMOVED***
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
    ***REMOVED***
        return e;
***REMOVED***

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
***REMOVED***

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite and existing requirejs instance.
            return;
    ***REMOVED***
        cfg = requirejs;
        requirejs = undefined;
***REMOVED***

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
***REMOVED***

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                waitSeconds: 7,
                baseUrl: './',
                paths: {***REMOVED***,
                pkgs: {***REMOVED***,
                shim: {***REMOVED***,
                map: {***REMOVED***,
                config: {***REMOVED***
          ***REMOVED***
            registry = {***REMOVED***,
            undefEvents = {***REMOVED***,
            defQueue = [],
            defined = {***REMOVED***,
            urlFetched = {***REMOVED***,
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array***REMOVED*** ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; ary[i]; i += 1) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
            ***REMOVED*** else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                ***REMOVED*** else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String***REMOVED*** name the relative name
         * @param {String***REMOVED*** baseName a real name that the name arg is relative
         * to.
         * @param {Boolean***REMOVED*** applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String***REMOVED*** normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name && name.charAt(0) === '.') {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    if (getOwn(config.pkgs, baseName)) {
                        //If the baseName is a package name, then just treat it as one
                        //name to concat the name with.
                        normalizedBaseParts = baseParts = [baseName];
                ***REMOVED*** else {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that 'directory' and not name of the baseName's
                        //module. For instance, baseName of 'one/two/three', maps to
                        //'one/two/three.js', but we want the directory, 'one/two' for
                        //this normalization.
                        normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                ***REMOVED***

                    name = normalizedBaseParts.concat(name.split('/'));
                    trimDots(name);

                    //Some use of packages may use a . path to reference the
                    //'main' module name, so normalize for that.
                    pkgConfig = getOwn(config.pkgs, (pkgName = name[0]));
                    name = name.join('/');
                    if (pkgConfig && name === pkgName + '/' + pkgConfig.main) {
                        name = pkgName;
                ***REMOVED***
            ***REMOVED*** else if (name.indexOf('./') === 0) {
                    // No baseName, so this is ID is resolved relative
                    // to baseUrl, pull off the leading dot.
                    name = name.substring(2);
            ***REMOVED***
        ***REMOVED***

            //Apply map config if available.
            if (applyMap && (baseParts || starMap) && map) {
                nameParts = name.split('/');

                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***

                    if (foundMap) {
                        break;
                ***REMOVED***

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                ***REMOVED***
            ***REMOVED***

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
            ***REMOVED***

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
            ***REMOVED***
        ***REMOVED***

            return name;
    ***REMOVED***

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                removeScript(id);
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);
                context.require([id]);
                return true;
        ***REMOVED***
    ***REMOVED***

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
        ***REMOVED***
            return [prefix, name];
    ***REMOVED***

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String***REMOVED*** name the module name
         * @param {String***REMOVED*** [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean***REMOVED*** isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean***REMOVED*** applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object***REMOVED***
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
        ***REMOVED***

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
        ***REMOVED***

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                    ***REMOVED***);
                ***REMOVED*** else {
                        normalizedName = normalize(name, parentName, applyMap);
                ***REMOVED***
            ***REMOVED*** else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
            ***REMOVED***
        ***REMOVED***

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
        ***REMOVED***;
    ***REMOVED***

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
        ***REMOVED***

            return mod;
    ***REMOVED***

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
            ***REMOVED***
        ***REMOVED*** else {
                getModule(depMap).on(name, fn);
        ***REMOVED***
    ***REMOVED***

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
        ***REMOVED*** else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);

                if (!notified) {
                    req.onError(err);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length - 1, 0].concat(globalDefQueue));
                globalDefQueue = [];
        ***REMOVED***
    ***REMOVED***

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
            ***REMOVED*** else {
                    return (mod.require = context.makeRequire(mod.map));
            ***REMOVED***
          ***REMOVED***
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return mod.exports;
                ***REMOVED*** else {
                        return (mod.exports = defined[mod.map.id] = {***REMOVED***);
                ***REMOVED***
            ***REMOVED***
          ***REMOVED***
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
            ***REMOVED*** else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return (config.config && getOwn(config.config, mod.map.id)) || {***REMOVED***;
                      ***REMOVED***
                        exports: defined[mod.map.id]
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
    ***REMOVED***

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
        ***REMOVED*** else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                    ***REMOVED*** else {
                            breakCycle(dep, traced, processed);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
                processed[id] = true;
        ***REMOVED***
    ***REMOVED***

        function checkLoaded() {
            var map, modId, err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
        ***REMOVED***

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(registry, function (mod) {
                map = mod.map;
                modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
            ***REMOVED***

                if (!map.isDefine) {
                    reqCalls.push(mod);
            ***REMOVED***

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                    ***REMOVED*** else {
                            noLoads.push(modId);
                            removeScript(modId);
                    ***REMOVED***
                ***REMOVED*** else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
        ***REMOVED***

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {***REMOVED***, {***REMOVED***);
            ***REMOVED***);
        ***REMOVED***

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                  ***REMOVED*** 50);
            ***REMOVED***
        ***REMOVED***

            inCheckLoaded = false;
    ***REMOVED***

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {***REMOVED***;
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {***REMOVED***;
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
    ***REMOVED***;

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {***REMOVED***;

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
            ***REMOVED***

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
            ***REMOVED*** else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                ***REMOVED***);
            ***REMOVED***

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
            ***REMOVED*** else {
                    this.check();
            ***REMOVED***
          ***REMOVED***

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
            ***REMOVED***
          ***REMOVED***

            fetch: function () {
                if (this.fetched) {
                    return;
            ***REMOVED***
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                ***REMOVED***)(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                ***REMOVED***));
            ***REMOVED*** else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
            ***REMOVED***
          ***REMOVED***

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
            ***REMOVED***
          ***REMOVED***

            /**
             * Checks is the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
            ***REMOVED***

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
            ***REMOVED*** else if (this.error) {
                    this.emit('error', this.error);
            ***REMOVED*** else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error.
                            if (this.events.error) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                            ***REMOVED*** catch (e) {
                                    err = e;
                            ***REMOVED***
                        ***REMOVED*** else {
                                exports = context.execCb(id, factory, depExports, exports);
                        ***REMOVED***

                            if (this.map.isDefine) {
                                //If setting exports via 'module' is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                cjsModule = this.module;
                                if (cjsModule &&
                                        cjsModule.exports !== undefined &&
                                        //Make sure it is not already the exports value
                                        cjsModule.exports !== this.exports) {
                                    exports = cjsModule.exports;
                            ***REMOVED*** else if (exports === undefined && this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                            ***REMOVED***
                        ***REMOVED***

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = [this.map.id];
                                err.requireType = 'define';
                                return onError((this.error = err));
                        ***REMOVED***

                    ***REMOVED*** else {
                            //Just a literal value
                            exports = factory;
                    ***REMOVED***

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                        ***REMOVED***
                    ***REMOVED***

                        //Clean up
                        delete registry[id];

                        this.defined = true;
                ***REMOVED***

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                ***REMOVED***

            ***REMOVED***
          ***REMOVED***

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true,
                            skipMap: true
                    ***REMOVED***);

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                        ***REMOVED***) || '';
                    ***REMOVED***

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; ***REMOVED***, null, {
                                    enabled: true,
                                    ignore: true
                            ***REMOVED***);
                        ***REMOVED***));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                            ***REMOVED***));
                        ***REMOVED***
                            normalizedMod.enable();
                    ***REMOVED***

                        return;
                ***REMOVED***

                    load = bind(this, function (value) {
                        this.init([], function () { return value; ***REMOVED***, null, {
                            enabled: true
                    ***REMOVED***);
                ***REMOVED***);

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                        ***REMOVED***
                    ***REMOVED***);

                        onError(err);
                ***REMOVED***);

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                    ***REMOVED***

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                    ***REMOVED***

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                    ***REMOVED***

                        try {
                            req.exec(text);
                    ***REMOVED*** catch (e) {
                            throw new Error('fromText eval for ' + moduleName +
                                            ' failed: ' + e);
                    ***REMOVED***

                        if (hasInteractive) {
                            useInteractive = true;
                    ***REMOVED***

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                ***REMOVED***);

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
            ***REMOVED***));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
          ***REMOVED***

            enable: function () {
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                    ***REMOVED***

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                    ***REMOVED***));

                        if (this.errback) {
                            on(depMap, 'error', this.errback);
                    ***REMOVED***
                ***REMOVED***

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                ***REMOVED***
            ***REMOVED***));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                ***REMOVED***
            ***REMOVED***));

                this.enabling = false;

                this.check();
          ***REMOVED***

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
            ***REMOVED***
                cbs.push(cb);
          ***REMOVED***

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
            ***REMOVED***);
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
        ***REMOVED***
    ***REMOVED***

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
            ***REMOVED***
        ***REMOVED*** else {
                node.removeEventListener(name, func, false);
        ***REMOVED***
    ***REMOVED***

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event***REMOVED*** evt
         * @returns {Object***REMOVED***
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
        ***REMOVED***;
    ***REMOVED***

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
            ***REMOVED*** else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,

            /**
             * Set a configuration for the context.
             * @param {Object***REMOVED*** cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                ***REMOVED***
            ***REMOVED***

                //Save off the paths and packages since they require special processing,
                //they are additive.
                var pkgs = config.pkgs,
                    shim = config.shim,
                    objs = {
                        paths: true,
                        config: true,
                        map: true
                ***REMOVED***;

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (prop === 'map') {
                            mixin(config[prop], value, true, true);
                    ***REMOVED*** else {
                            mixin(config[prop], value, true);
                    ***REMOVED***
                ***REMOVED*** else {
                        config[prop] = value;
                ***REMOVED***
            ***REMOVED***);

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                        ***REMOVED***;
                    ***REMOVED***
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                    ***REMOVED***
                        shim[id] = value;
                ***REMOVED***);
                    config.shim = shim;
            ***REMOVED***

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj ***REMOVED*** : pkgObj;
                        location = pkgObj.location;

                        //Create a brand new object on pkgs, since currentPackages can
                        //be passed in again, and config.pkgs is the internal transformed
                        //state for all package configs.
                        pkgs[pkgObj.name] = {
                            name: pkgObj.name,
                            location: location || pkgObj.name,
                            //Remove leading dot in main, so main paths are normalized,
                            //and remove any trailing .js, since different package
                            //envs have different conventions: some use a module name,
                            //some use a file name.
                            main: (pkgObj.main || 'main')
                                  .replace(currDirRegExp, '')
                                  .replace(jsSuffixRegExp, '')
                    ***REMOVED***;
                ***REMOVED***);

                    //Done with modifications, assing packages back to context config
                    config.pkgs = pkgs;
            ***REMOVED***

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                ***REMOVED***
            ***REMOVED***);

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
            ***REMOVED***
          ***REMOVED***

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                ***REMOVED***
                    return ret || (value.exports && getGlobal(value.exports));
            ***REMOVED***
                return fn;
          ***REMOVED***

            makeRequire: function (relMap, options) {
                options = options || {***REMOVED***;

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                ***REMOVED***

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                    ***REMOVED***

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                    ***REMOVED***

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap);
                    ***REMOVED***

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                    ***REMOVED***
                        return defined[id];
                ***REMOVED***

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                    ***REMOVED***);

                        checkLoaded();
                ***REMOVED***);

                    return localRequire;
            ***REMOVED***

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var index = moduleNamePlusExt.lastIndexOf('.'),
                            ext = null;

                        if (index !== -1) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                    ***REMOVED***

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext);
                  ***REMOVED***

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                  ***REMOVED***

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                ***REMOVED***
            ***REMOVED***);

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                        ***REMOVED***

                            cleanRegistry(id);
                    ***REMOVED***
                ***REMOVED***;
            ***REMOVED***

                return localRequire;
          ***REMOVED***

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. parent module is passed in for context,
             * used by the optimizer.
             */
            enable: function (depMap, parent) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
            ***REMOVED***
          ***REMOVED***

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String***REMOVED*** moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {***REMOVED***,
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                    ***REMOVED***
                        found = true;
                ***REMOVED*** else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                ***REMOVED***

                    callGetModule(args);
            ***REMOVED***

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                    ***REMOVED*** else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                    ***REMOVED***
                ***REMOVED*** else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                ***REMOVED***
            ***REMOVED***

                checkLoaded();
          ***REMOVED***

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext) {
                var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url,
                    parentPath;

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
            ***REMOVED*** else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;
                    pkgs = config.pkgs;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        pkg = getOwn(pkgs, parentModule);
                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                        ***REMOVED***
                            syms.splice(0, i, parentPath);
                            break;
                    ***REMOVED*** else if (pkg) {
                            //If module name is just the package name, then looking
                            //for the main module.
                            if (moduleName === pkg.name) {
                                pkgPath = pkg.location + '/' + pkg.main;
                        ***REMOVED*** else {
                                pkgPath = pkg.location;
                        ***REMOVED***
                            syms.splice(0, i, pkgPath);
                            break;
                    ***REMOVED***
                ***REMOVED***

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/\?/.test(url) ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
            ***REMOVED***

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
          ***REMOVED***

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
          ***REMOVED***

            /**
             * Executes a module callack function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
          ***REMOVED***

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event***REMOVED*** evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
            ***REMOVED***
          ***REMOVED***

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error', evt, [data.id]));
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        context.require = context.makeRequire();
        return context;
***REMOVED***

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
        ***REMOVED*** else {
                deps = [];
        ***REMOVED***
    ***REMOVED***

        if (config && config.context) {
            contextName = config.context;
    ***REMOVED***

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
    ***REMOVED***

        if (config) {
            context.configure(config);
    ***REMOVED***

        return context.require(deps, callback, errback);
***REMOVED***;

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
***REMOVED***;

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function***REMOVED*** fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
***REMOVED*** : function (fn) { fn(); ***REMOVED***;

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
***REMOVED***

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
***REMOVED***;

    //Create default context.
    req({***REMOVED***);

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
    ***REMOVED***;
***REMOVED***);

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
    ***REMOVED***
***REMOVED***

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error***REMOVED*** err the error object.
     */
    req.onError = function (err) {
        throw err;
***REMOVED***;

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object***REMOVED*** context the require context to find state.
     * @param {String***REMOVED*** moduleName the name of the module.
     * @param {Object***REMOVED*** url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {***REMOVED***,
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = config.xhtml ?
                    document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                    document.createElement('script');
            node.type = config.scriptType || 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEvenListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
        ***REMOVED*** else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
        ***REMOVED***
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
        ***REMOVED*** else {
                head.appendChild(node);
        ***REMOVED***
            currentlyAddingScript = null;

            return node;
    ***REMOVED*** else if (isWebWorker) {
            //In a web worker, use importScripts. This is not a very
            //efficient use of importScripts, importScripts will block until
            //its script is downloaded and evaluated. However, if web workers
            //are in play, the expectation that a build has been done so that
            //only one script needs to be loaded anyway. This may need to be
            //reevaluated if other use cases become common.
            importScripts(url);

            //Account for anonymous modules
            context.completeLoad(moduleName);
    ***REMOVED***
***REMOVED***;

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
    ***REMOVED***

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
        ***REMOVED***
    ***REMOVED***);
        return interactiveScript;
***REMOVED***

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
        ***REMOVED***

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = dataMain.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                    dataMain = mainScript;
            ***REMOVED***

                //Strip off any trailing .js since dataMain is now
                //like a module name.
                dataMain = dataMain.replace(jsSuffixRegExp, '');

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(dataMain) : [dataMain];

                return true;
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
    ***REMOVED***

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = [];
    ***REMOVED***

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps.length && isFunction(callback)) {
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                ***REMOVED***);

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
        ***REMOVED***
    ***REMOVED***

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
            ***REMOVED***
                context = contexts[node.getAttribute('data-requirecontext')];
        ***REMOVED***
    ***REMOVED***

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
***REMOVED***;

    define.amd = {
        jQuery: true
***REMOVED***;


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String***REMOVED*** text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
***REMOVED***;

    //Set up with config info.
    req(cfg);
***REMOVED***(this));


    if (env === 'browser') {
        /**
 * @license RequireJS rhino Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

//sloppy since eval enclosed with use strict causes problems if the source
//text is not strict-compliant.
/*jslint sloppy: true, evil: true */
/*global require, XMLHttpRequest */

(function () {
    require.load = function (context, moduleName, url) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                eval(xhr.responseText);

                //Support anonymous modules.
                context.completeLoad(moduleName);
        ***REMOVED***
    ***REMOVED***;
***REMOVED***;
***REMOVED***());
***REMOVED*** else if (env === 'rhino') {
        /**
 * @license RequireJS rhino Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint */
/*global require: false, java: false, load: false */

(function () {
    'use strict';
    require.load = function (context, moduleName, url) {

        load(url);

        //Support anonymous modules.
        context.completeLoad(moduleName);
***REMOVED***;

***REMOVED***());
***REMOVED*** else if (env === 'node') {
        this.requirejsVars = {
            require: require,
            requirejs: require,
            define: define,
            nodeRequire: nodeRequire
    ***REMOVED***;
        require.nodeRequire = nodeRequire;

        /**
 * @license RequireJS node Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint regexp: false */
/*global require: false, define: false, requirejsVars: false, process: false */

/**
 * This adapter assumes that x.js has loaded it and set up
 * some variables. This adapter just allows limited RequireJS
 * usage from within the requirejs directory. The general
 * node adapater is r.js.
 */

(function () {
    'use strict';

    var nodeReq = requirejsVars.nodeRequire,
        req = requirejsVars.require,
        def = requirejsVars.define,
        fs = nodeReq('fs'),
        path = nodeReq('path'),
        vm = nodeReq('vm'),
        //In Node 0.7+ existsSync is on fs.
        exists = fs.existsSync || path.existsSync,
        hasOwn = Object.prototype.hasOwnProperty;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
***REMOVED***

    function syncTick(fn) {
        fn();
***REMOVED***

    //Supply an implementation that allows synchronous get of a module.
    req.get = function (context, moduleName, relModuleMap) {
        if (moduleName === "require" || moduleName === "exports" || moduleName === "module") {
            req.onError(new Error("Explicit require of " + moduleName + " is not allowed."));
    ***REMOVED***

        var ret, oldTick,
            moduleMap = context.makeModuleMap(moduleName, relModuleMap);

        //Normalize module name, if it contains . or ..
        moduleName = moduleMap.id;

        if (hasProp(context.defined, moduleName)) {
            ret = context.defined[moduleName];
    ***REMOVED*** else {
            if (ret === undefined) {
                //Make sure nextTick for this type of call is sync-based.
                oldTick = context.nextTick;
                context.nextTick = syncTick;
                try {
                    if (moduleMap.prefix) {
                        //A plugin, call requirejs to handle it. Now that
                        //nextTick is syncTick, the require will complete
                        //synchronously.
                        context.require([moduleMap.originalName]);

                        //Now that plugin is loaded, can regenerate the moduleMap
                        //to get the final, normalized ID.
                        moduleMap = context.makeModuleMap(moduleMap.originalName, relModuleMap);

                        //The above calls are sync, so can do the next thing safely.
                        ret = context.defined[moduleMap.id];
                ***REMOVED*** else {
                        //Try to dynamically fetch it.
                        req.load(context, moduleName, moduleMap.url);

                        //Enable the module
                        context.enable(moduleMap, relModuleMap);

                        //The above calls are sync, so can do the next thing safely.
                        ret = context.defined[moduleName];
                ***REMOVED***
            ***REMOVED*** finally {
                    context.nextTick = oldTick;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        return ret;
***REMOVED***;

    req.nextTick = function (fn) {
        process.nextTick(fn);
***REMOVED***;

    //Add wrapper around the code so that it gets the requirejs
    //API instead of the Node API, and it is done lexically so
    //that it survives later execution.
    req.makeNodeWrapper = function (contents) {
        return '(function (require, requirejs, define) { ' +
                contents +
                '\n***REMOVED***(requirejsVars.require, requirejsVars.requirejs, requirejsVars.define));';
***REMOVED***;

    req.load = function (context, moduleName, url) {
        var contents, err;

        if (exists(url)) {
            contents = fs.readFileSync(url, 'utf8');

            contents = req.makeNodeWrapper(contents);
            try {
                vm.runInThisContext(contents, fs.realpathSync(url));
        ***REMOVED*** catch (e) {
                err = new Error('Evaluating ' + url + ' as module "' +
                                moduleName + '" failed with error: ' + e);
                err.originalError = e;
                err.moduleName = moduleName;
                err.fileName = url;
                return req.onError(err);
        ***REMOVED***
    ***REMOVED*** else {
            def(moduleName, function () {
                //Get the original name, since relative requires may be
                //resolved differently in node (issue #202)
                var originalName = hasProp(context.registry, moduleName) &&
                            context.registry[moduleName].map.originalName;

                try {
                    return (context.config.nodeRequire || req.nodeRequire)(originalName);
            ***REMOVED*** catch (e) {
                    err = new Error('Calling node\'s require("' +
                                        originalName + '") failed with error: ' + e);
                    err.originalError = e;
                    err.moduleName = originalName;
                    return req.onError(err);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

        //Support anonymous modules.
        context.completeLoad(moduleName);
***REMOVED***;

    //Override to provide the function wrapper for define/require.
    req.exec = function (text) {
        /*jslint evil: true */
        text = req.makeNodeWrapper(text);
        return eval(text);
***REMOVED***;
***REMOVED***());

***REMOVED***

    //Support a default file name to execute. Useful for hosted envs
    //like Joyent where it defaults to a server.js as the only executed
    //script. But only do it if this is not an optimization run.
    if (commandOption !== 'o' && (!fileName || !jsSuffixRegExp.test(fileName))) {
        fileName = 'main.js';
***REMOVED***

    /**
     * Loads the library files that can be used for the optimizer, or for other
     * tasks.
     */
    function loadLib() {
        /**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global Packages: false, process: false, window: false, navigator: false,
  document: false, define: false */

/**
 * A plugin that modifies any /env/ path to be the right path based on
 * the host environment. Right now only works for Node, Rhino and browser.
 */
(function () {
    var pathRegExp = /(\/|^)env\/|\{env\***REMOVED***/,
        env = 'unknown';

    if (typeof Packages !== 'undefined') {
        env = 'rhino';
***REMOVED*** else if (typeof process !== 'undefined') {
        env = 'node';
***REMOVED*** else if ((typeof navigator !== 'undefined' && typeof document !== 'undefined') ||
            (typeof importScripts !== 'undefined' && typeof self !== 'undefined')) {
        env = 'browser';
***REMOVED***

    define('env', {
        load: function (name, req, load, config) {
            //Allow override in the config.
            if (config.env) {
                env = config.env;
        ***REMOVED***

            name = name.replace(pathRegExp, function (match, prefix) {
                if (match.indexOf('{') === -1) {
                    return prefix + env + '/';
            ***REMOVED*** else {
                    return env;
            ***REMOVED***
        ***REMOVED***);

            req([name], function (mod) {
                load(mod);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
***REMOVED***());/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint plusplus: true */
/*global define */

define('lang', function () {
    'use strict';

    var lang,
        hasOwn = Object.prototype.hasOwnProperty;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
***REMOVED***

    lang = {
        backSlashRegExp: /\\/g,
        ostring: Object.prototype.toString,

        isArray: Array.isArray || function (it) {
            return lang.ostring.call(it) === "[object Array]";
      ***REMOVED***

        isFunction: function(it) {
            return lang.ostring.call(it) === "[object Function]";
      ***REMOVED***

        isRegExp: function(it) {
            return it && it instanceof RegExp;
      ***REMOVED***

        hasProp: hasProp,

        //returns true if the object does not have an own property prop,
        //or if it does, it is a falsy value.
        falseProp: function (obj, prop) {
            return !hasProp(obj, prop) || !obj[prop];
      ***REMOVED***

        //gets own property value for given prop on object
        getOwn: function (obj, prop) {
            return hasProp(obj, prop) && obj[prop];
      ***REMOVED***

        _mixin: function(dest, source, override){
            var name;
            for (name in source) {
                if(source.hasOwnProperty(name)
                    && (override || !dest.hasOwnProperty(name))) {
                    dest[name] = source[name];
            ***REMOVED***
        ***REMOVED***

            return dest; // Object
      ***REMOVED***

        /**
         * mixin({***REMOVED***, obj1, obj2) is allowed. If the last argument is a boolean,
         * then the source objects properties are force copied over to dest.
         */
        mixin: function(dest){
            var parameters = Array.prototype.slice.call(arguments),
                override, i, l;

            if (!dest) { dest = {***REMOVED***; ***REMOVED***

            if (parameters.length > 2 && typeof arguments[parameters.length-1] === 'boolean') {
                override = parameters.pop();
        ***REMOVED***

            for (i = 1, l = parameters.length; i < l; i++) {
                lang._mixin(dest, parameters[i], override);
        ***REMOVED***
            return dest; // Object
      ***REMOVED***

        delegate: (function () {
            // boodman/crockford delegation w/ cornford optimization
            function TMP() {***REMOVED***
            return function (obj, props) {
                TMP.prototype = obj;
                var tmp = new TMP();
                TMP.prototype = null;
                if (props) {
                    lang.mixin(tmp, props);
            ***REMOVED***
                return tmp; // Object
        ***REMOVED***;
    ***REMOVED***()),

        /**
         * Helper function for iterating over an array. If the func returns
         * a true value, it will break out of the loop.
         */
        each: function each(ary, func) {
            if (ary) {
                var i;
                for (i = 0; i < ary.length; i += 1) {
                    if (func(ary[i], i, ary)) {
                        break;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
      ***REMOVED***

        /**
         * Cycles over properties in an object and calls a function for each
         * property value. If the function returns a truthy value, then the
         * iteration is stopped.
         */
        eachProp: function eachProp(obj, func) {
            var prop;
            for (prop in obj) {
                if (hasProp(obj, prop)) {
                    if (func(obj[prop], prop)) {
                        break;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
      ***REMOVED***

        //Similar to Function.prototype.bind, but the "this" object is specified
        //first, since it is easier to read/figure out what "this" will be.
        bind: function bind(obj, fn) {
            return function () {
                return fn.apply(obj, arguments);
        ***REMOVED***;
      ***REMOVED***

        //Escapes a content string to be be a string that has characters escaped
        //for inclusion as part of a JS string.
        jsEscape: function (content) {
            return content.replace(/(["'\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r");
    ***REMOVED***
***REMOVED***;
    return lang;
***REMOVED***);

/**
 * prim 0.0.0 Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/prim for details
 */

/*global process, setTimeout, define, module */

//Set prime.hideResolutionConflict = true to allow "resolution-races"
//in promise-tests to pass.
//Since the goal of prim is to be a small impl for trusted code, it is
//more important to normally throw in this case so that we can find
//logic errors quicker.

var prim;
(function () {
    'use strict';
    var op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
***REMOVED***

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i]) {
                    func(ary[i], i, ary);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    function check(p) {
        if (hasProp(p, 'e') || hasProp(p, 'v')) {
            if (!prim.hideResolutionConflict) {
                throw new Error('nope');
        ***REMOVED***
            return false;
    ***REMOVED***
        return true;
***REMOVED***

    function notify(ary, value) {
        prim.nextTick(function () {
            each(ary, function (item) {
                item(value);
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***

    prim = function prim() {
        var p,
            ok = [],
            fail = [];

        return (p = {
            callback: function (yes, no) {
                if (no) {
                    p.errback(no);
            ***REMOVED***

                if (hasProp(p, 'v')) {
                    prim.nextTick(function () {
                        yes(p.v);
                ***REMOVED***);
            ***REMOVED*** else {
                    ok.push(yes);
            ***REMOVED***
          ***REMOVED***

            errback: function (no) {
                if (hasProp(p, 'e')) {
                    prim.nextTick(function () {
                        no(p.e);
                ***REMOVED***);
            ***REMOVED*** else {
                    fail.push(no);
            ***REMOVED***
          ***REMOVED***

            resolve: function (v) {
                if (check(p)) {
                    p.v = v;
                    notify(ok, v);
            ***REMOVED***
                return p;
          ***REMOVED***
            reject: function (e) {
                if (check(p)) {
                    p.e = e;
                    notify(fail, e);
            ***REMOVED***
                return p;
          ***REMOVED***

            start: function (fn) {
                p.resolve();
                return p.promise.then(fn);
          ***REMOVED***

            promise: {
                then: function (yes, no) {
                    var next = prim();

                    p.callback(function (v) {
                        try {
                            v = yes ? yes(v) : v;

                            if (v && v.then) {
                                v.then(next.resolve, next.reject);
                        ***REMOVED*** else {
                                next.resolve(v);
                        ***REMOVED***
                    ***REMOVED*** catch (e) {
                            next.reject(e);
                    ***REMOVED***
                  ***REMOVED*** function (e) {
                        var err;

                        try {
                            if (!no) {
                                next.reject(e);
                        ***REMOVED*** else {
                                err = no(e);

                                if (err instanceof Error) {
                                    next.reject(err);
                            ***REMOVED*** else {
                                    if (err && err.then) {
                                        err.then(next.resolve, next.reject);
                                ***REMOVED*** else {
                                        next.resolve(err);
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED*** catch (e2) {
                            next.reject(e2);
                    ***REMOVED***
                ***REMOVED***);

                    return next.promise;
              ***REMOVED***

                fail: function (no) {
                    return p.promise.then(null, no);
              ***REMOVED***

                end: function () {
                    p.errback(function (e) {
                        throw e;
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;

    prim.serial = function (ary) {
        var result = prim().resolve().promise;
        each(ary, function (item) {
            result = result.then(function () {
                return item();
        ***REMOVED***);
    ***REMOVED***);
        return result;
***REMOVED***;

    prim.nextTick = typeof process !== 'undefined' && process.nextTick ?
            process.nextTick : (typeof setTimeout !== 'undefined' ?
                function (fn) {
                setTimeout(fn, 0);
        ***REMOVED*** : function (fn) {
        fn();
***REMOVED***);

    if (typeof define === 'function' && define.amd) {
        define('prim', function () { return prim; ***REMOVED***);
***REMOVED*** else if (typeof module !== 'undefined' && module.exports) {
        module.exports = prim;
***REMOVED***
***REMOVED***());

if(env === 'browser') {
/**
 * @license RequireJS Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, load: false */

//Just a stub for use with uglify's consolidator.js
define('browser/assert', function () {
    return {***REMOVED***;
***REMOVED***);

***REMOVED***

if(env === 'node') {
/**
 * @license RequireJS Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, load: false */

//Needed so that rhino/assert can return a stub for uglify's consolidator.js
define('node/assert', ['assert'], function (assert) {
    return assert;
***REMOVED***);

***REMOVED***

if(env === 'rhino') {
/**
 * @license RequireJS Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, load: false */

//Just a stub for use with uglify's consolidator.js
define('rhino/assert', function () {
    return {***REMOVED***;
***REMOVED***);

***REMOVED***

if(env === 'browser') {
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, process: false */

define('browser/args', function () {
    //Always expect config via an API call
    return [];
***REMOVED***);

***REMOVED***

if(env === 'node') {
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, process: false */

define('node/args', function () {
    //Do not return the "node" or "r.js" arguments
    var args = process.argv.slice(2);

    //Ignore any command option used for rq.js
    if (args[0] && args[0].indexOf('-' === 0)) {
        args = args.slice(1);
***REMOVED***

    return args;
***REMOVED***);

***REMOVED***

if(env === 'rhino') {
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, process: false */

var jsLibRhinoArgs = (typeof rhinoArgs !== 'undefined' && rhinoArgs) || [].concat(Array.prototype.slice.call(arguments, 0));

define('rhino/args', function () {
    var args = jsLibRhinoArgs;

    //Ignore any command option used for rq.js
    if (args[0] && args[0].indexOf('-' === 0)) {
        args = args.slice(1);
***REMOVED***

    return args;
***REMOVED***);

***REMOVED***

if(env === 'browser') {
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, console: false */

define('browser/load', ['./file'], function (file) {
    function load(fileName) {
        eval(file.readFile(fileName));
***REMOVED***

    return load;
***REMOVED***);

***REMOVED***

if(env === 'node') {
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, console: false */

define('node/load', ['fs'], function (fs) {
    function load(fileName) {
        var contents = fs.readFileSync(fileName, 'utf8');
        process.compile(contents, fileName);
***REMOVED***

    return load;
***REMOVED***);

***REMOVED***

if(env === 'rhino') {
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, load: false */

define('rhino/load', function () {
    return load;
***REMOVED***);

***REMOVED***

if(env === 'browser') {
/**
 * @license Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint sloppy: true, nomen: true */
/*global require, define, console, XMLHttpRequest, requirejs */

define('browser/file', ['prim'], function (prim) {

    var file;

    function frontSlash(path) {
        return path.replace(/\\/g, '/');
***REMOVED***

    function exists(path) {
        var status, xhr = new XMLHttpRequest();

        //Oh yeah, that is right SYNC IO. Behold its glory
        //and horrible blocking behavior.
        xhr.open('HEAD', path, false);
        xhr.send();
        status = xhr.status;

        return status === 200 || status === 304;
***REMOVED***

    function mkDir(dir) {
        console.log('mkDir is no-op in browser');
***REMOVED***

    function mkFullDir(dir) {
        console.log('mkFullDir is no-op in browser');
***REMOVED***

    file = {
        backSlashRegExp: /\\/g,
        exclusionRegExp: /^\./,
        getLineSeparator: function () {
            return '/';
      ***REMOVED***

        exists: function (fileName) {
            return exists(fileName);
      ***REMOVED***

        parent: function (fileName) {
            var parts = fileName.split('/');
            parts.pop();
            return parts.join('/');
      ***REMOVED***

        /**
         * Gets the absolute file path as a string, normalized
         * to using front slashes for path separators.
         * @param {String***REMOVED*** fileName
         */
        absPath: function (fileName) {
            return fileName;
      ***REMOVED***

        normalize: function (fileName) {
            return fileName;
      ***REMOVED***

        isFile: function (path) {
            return true;
      ***REMOVED***

        isDirectory: function (path) {
            return false;
      ***REMOVED***

        getFilteredFileList: function (startDir, regExpFilters, makeUnixPaths) {
            console.log('file.getFilteredFileList is no-op in browser');
      ***REMOVED***

        copyDir: function (srcDir, destDir, regExpFilter, onlyCopyNew) {
            console.log('file.copyDir is no-op in browser');

      ***REMOVED***

        copyFile: function (srcFileName, destFileName, onlyCopyNew) {
            console.log('file.copyFile is no-op in browser');
      ***REMOVED***

        /**
         * Renames a file. May fail if "to" already exists or is on another drive.
         */
        renameFile: function (from, to) {
            console.log('file.renameFile is no-op in browser');
      ***REMOVED***

        /**
         * Reads a *text* file.
         */
        readFile: function (path, encoding) {
            var xhr = new XMLHttpRequest();

            //Oh yeah, that is right SYNC IO. Behold its glory
            //and horrible blocking behavior.
            xhr.open('GET', path, false);
            xhr.send();

            return xhr.responseText;
      ***REMOVED***

        readFileAsync: function (path, encoding) {
            var xhr = new XMLHttpRequest(),
                d = prim();

            xhr.open('GET', path, true);
            xhr.send();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status > 400) {
                        d.reject(new Error('Status: ' + xhr.status + ': ' + xhr.statusText));
                ***REMOVED*** else {
                        d.resolve(xhr.responseText);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;

            return d.promise;
      ***REMOVED***

        saveUtf8File: function (fileName, fileContents) {
            //summary: saves a *text* file using UTF-8 encoding.
            file.saveFile(fileName, fileContents, "utf8");
      ***REMOVED***

        saveFile: function (fileName, fileContents, encoding) {
            requirejs.browser.saveFile(fileName, fileContents, encoding);
      ***REMOVED***

        deleteFile: function (fileName) {
            console.log('file.deleteFile is no-op in browser');
      ***REMOVED***

        /**
         * Deletes any empty directories under the given directory.
         */
        deleteEmptyDirs: function (startDir) {
            console.log('file.deleteEmptyDirs is no-op in browser');
    ***REMOVED***
***REMOVED***;

    return file;

***REMOVED***);

***REMOVED***

if(env === 'node') {
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint plusplus: false, octal:false, strict: false */
/*global define: false, process: false */

define('node/file', ['fs', 'path', 'prim'], function (fs, path, prim) {

    var isWindows = process.platform === 'win32',
        windowsDriveRegExp = /^[a-zA-Z]\:\/$/,
        file;

    function frontSlash(path) {
        return path.replace(/\\/g, '/');
***REMOVED***

    function exists(path) {
        if (isWindows && path.charAt(path.length - 1) === '/' &&
            path.charAt(path.length - 2) !== ':') {
            path = path.substring(0, path.length - 1);
    ***REMOVED***

        try {
            fs.statSync(path);
            return true;
    ***REMOVED*** catch (e) {
            return false;
    ***REMOVED***
***REMOVED***

    function mkDir(dir) {
        if (!exists(dir) && (!isWindows || !windowsDriveRegExp.test(dir))) {
            fs.mkdirSync(dir, 511);
    ***REMOVED***
***REMOVED***

    function mkFullDir(dir) {
        var parts = dir.split('/'),
            currDir = '',
            first = true;

        parts.forEach(function (part) {
            //First part may be empty string if path starts with a slash.
            currDir += part + '/';
            first = false;

            if (part) {
                mkDir(currDir);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

    file = {
        backSlashRegExp: /\\/g,
        exclusionRegExp: /^\./,
        getLineSeparator: function () {
            return '/';
      ***REMOVED***

        exists: function (fileName) {
            return exists(fileName);
      ***REMOVED***

        parent: function (fileName) {
            var parts = fileName.split('/');
            parts.pop();
            return parts.join('/');
      ***REMOVED***

        /**
         * Gets the absolute file path as a string, normalized
         * to using front slashes for path separators.
         * @param {String***REMOVED*** fileName
         */
        absPath: function (fileName) {
            return frontSlash(path.normalize(frontSlash(fs.realpathSync(fileName))));
      ***REMOVED***

        normalize: function (fileName) {
            return frontSlash(path.normalize(fileName));
      ***REMOVED***

        isFile: function (path) {
            return fs.statSync(path).isFile();
      ***REMOVED***

        isDirectory: function (path) {
            return fs.statSync(path).isDirectory();
      ***REMOVED***

        getFilteredFileList: function (/*String*/startDir, /*RegExp*/regExpFilters, /*boolean?*/makeUnixPaths) {
            //summary: Recurses startDir and finds matches to the files that match regExpFilters.include
            //and do not match regExpFilters.exclude. Or just one regexp can be passed in for regExpFilters,
            //and it will be treated as the "include" case.
            //Ignores files/directories that start with a period (.) unless exclusionRegExp
            //is set to another value.
            var files = [], topDir, regExpInclude, regExpExclude, dirFileArray,
                i, stat, filePath, ok, dirFiles, fileName;

            topDir = startDir;

            regExpInclude = regExpFilters.include || regExpFilters;
            regExpExclude = regExpFilters.exclude || null;

            if (file.exists(topDir)) {
                dirFileArray = fs.readdirSync(topDir);
                for (i = 0; i < dirFileArray.length; i++) {
                    fileName = dirFileArray[i];
                    filePath = path.join(topDir, fileName);
                    stat = fs.statSync(filePath);
                    if (stat.isFile()) {
                        if (makeUnixPaths) {
                            //Make sure we have a JS string.
                            if (filePath.indexOf("/") === -1) {
                                filePath = frontSlash(filePath);
                        ***REMOVED***
                    ***REMOVED***

                        ok = true;
                        if (regExpInclude) {
                            ok = filePath.match(regExpInclude);
                    ***REMOVED***
                        if (ok && regExpExclude) {
                            ok = !filePath.match(regExpExclude);
                    ***REMOVED***

                        if (ok && (!file.exclusionRegExp ||
                            !file.exclusionRegExp.test(fileName))) {
                            files.push(filePath);
                    ***REMOVED***
                ***REMOVED*** else if (stat.isDirectory() &&
                              (!file.exclusionRegExp || !file.exclusionRegExp.test(fileName))) {
                        dirFiles = this.getFilteredFileList(filePath, regExpFilters, makeUnixPaths);
                        files.push.apply(files, dirFiles);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

            return files; //Array
      ***REMOVED***

        copyDir: function (/*String*/srcDir, /*String*/destDir, /*RegExp?*/regExpFilter, /*boolean?*/onlyCopyNew) {
            //summary: copies files from srcDir to destDir using the regExpFilter to determine if the
            //file should be copied. Returns a list file name strings of the destinations that were copied.
            regExpFilter = regExpFilter || /\w/;

            //Normalize th directory names, but keep front slashes.
            //path module on windows now returns backslashed paths.
            srcDir = frontSlash(path.normalize(srcDir));
            destDir = frontSlash(path.normalize(destDir));

            var fileNames = file.getFilteredFileList(srcDir, regExpFilter, true),
            copiedFiles = [], i, srcFileName, destFileName;

            for (i = 0; i < fileNames.length; i++) {
                srcFileName = fileNames[i];
                destFileName = srcFileName.replace(srcDir, destDir);

                if (file.copyFile(srcFileName, destFileName, onlyCopyNew)) {
                    copiedFiles.push(destFileName);
            ***REMOVED***
        ***REMOVED***

            return copiedFiles.length ? copiedFiles : null; //Array or null
      ***REMOVED***

        copyFile: function (/*String*/srcFileName, /*String*/destFileName, /*boolean?*/onlyCopyNew) {
            //summary: copies srcFileName to destFileName. If onlyCopyNew is set, it only copies the file if
            //srcFileName is newer than destFileName. Returns a boolean indicating if the copy occurred.
            var parentDir;

            //logger.trace("Src filename: " + srcFileName);
            //logger.trace("Dest filename: " + destFileName);

            //If onlyCopyNew is true, then compare dates and only copy if the src is newer
            //than dest.
            if (onlyCopyNew) {
                if (file.exists(destFileName) && fs.statSync(destFileName).mtime.getTime() >= fs.statSync(srcFileName).mtime.getTime()) {
                    return false; //Boolean
            ***REMOVED***
        ***REMOVED***

            //Make sure destination dir exists.
            parentDir = path.dirname(destFileName);
            if (!file.exists(parentDir)) {
                mkFullDir(parentDir);
        ***REMOVED***

            fs.writeFileSync(destFileName, fs.readFileSync(srcFileName, 'binary'), 'binary');

            return true; //Boolean
      ***REMOVED***

        /**
         * Renames a file. May fail if "to" already exists or is on another drive.
         */
        renameFile: function (from, to) {
            return fs.renameSync(from, to);
      ***REMOVED***

        /**
         * Reads a *text* file.
         */
        readFile: function (/*String*/path, /*String?*/encoding) {
            if (encoding === 'utf-8') {
                encoding = 'utf8';
        ***REMOVED***
            if (!encoding) {
                encoding = 'utf8';
        ***REMOVED***

            var text = fs.readFileSync(path, encoding);

            //Hmm, would not expect to get A BOM, but it seems to happen,
            //remove it just in case.
            if (text.indexOf('\uFEFF') === 0) {
                text = text.substring(1, text.length);
        ***REMOVED***

            return text;
      ***REMOVED***

        readFileAsync: function (path, encoding) {
            var d = prim();
            try {
                d.resolve(file.readFile(path, encoding));
        ***REMOVED*** catch (e) {
                d.reject(e);
        ***REMOVED***
            return d.promise;
      ***REMOVED***

        saveUtf8File: function (/*String*/fileName, /*String*/fileContents) {
            //summary: saves a *text* file using UTF-8 encoding.
            file.saveFile(fileName, fileContents, "utf8");
      ***REMOVED***

        saveFile: function (/*String*/fileName, /*String*/fileContents, /*String?*/encoding) {
            //summary: saves a *text* file.
            var parentDir;

            if (encoding === 'utf-8') {
                encoding = 'utf8';
        ***REMOVED***
            if (!encoding) {
                encoding = 'utf8';
        ***REMOVED***

            //Make sure destination directories exist.
            parentDir = path.dirname(fileName);
            if (!file.exists(parentDir)) {
                mkFullDir(parentDir);
        ***REMOVED***

            fs.writeFileSync(fileName, fileContents, encoding);
      ***REMOVED***

        deleteFile: function (/*String*/fileName) {
            //summary: deletes a file or directory if it exists.
            var files, i, stat;
            if (file.exists(fileName)) {
                stat = fs.statSync(fileName);
                if (stat.isDirectory()) {
                    files = fs.readdirSync(fileName);
                    for (i = 0; i < files.length; i++) {
                        this.deleteFile(path.join(fileName, files[i]));
                ***REMOVED***
                    fs.rmdirSync(fileName);
            ***REMOVED*** else {
                    fs.unlinkSync(fileName);
            ***REMOVED***
        ***REMOVED***
      ***REMOVED***


        /**
         * Deletes any empty directories under the given directory.
         */
        deleteEmptyDirs: function (startDir) {
            var dirFileArray, i, fileName, filePath, stat;

            if (file.exists(startDir)) {
                dirFileArray = fs.readdirSync(startDir);
                for (i = 0; i < dirFileArray.length; i++) {
                    fileName = dirFileArray[i];
                    filePath = path.join(startDir, fileName);
                    stat = fs.statSync(filePath);
                    if (stat.isDirectory()) {
                        file.deleteEmptyDirs(filePath);
                ***REMOVED***
            ***REMOVED***

                //If directory is now empty, remove it.
                if (fs.readdirSync(startDir).length ===  0) {
                    file.deleteFile(startDir);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    return file;

***REMOVED***);

***REMOVED***

if(env === 'rhino') {
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Helper functions to deal with file I/O.

/*jslint plusplus: false */
/*global java: false, define: false */

define('rhino/file', ['prim'], function (prim) {
    var file = {
        backSlashRegExp: /\\/g,

        exclusionRegExp: /^\./,

        getLineSeparator: function () {
            return file.lineSeparator;
      ***REMOVED***

        lineSeparator: java.lang.System.getProperty("line.separator"), //Java String

        exists: function (fileName) {
            return (new java.io.File(fileName)).exists();
      ***REMOVED***

        parent: function (fileName) {
            return file.absPath((new java.io.File(fileName)).getParentFile());
      ***REMOVED***

        normalize: function (fileName) {
            return file.absPath(fileName);
      ***REMOVED***

        isFile: function (path) {
            return (new java.io.File(path)).isFile();
      ***REMOVED***

        isDirectory: function (path) {
            return (new java.io.File(path)).isDirectory();
      ***REMOVED***

        /**
         * Gets the absolute file path as a string, normalized
         * to using front slashes for path separators.
         * @param {java.io.File||String***REMOVED*** file
         */
        absPath: function (fileObj) {
            if (typeof fileObj === "string") {
                fileObj = new java.io.File(fileObj);
        ***REMOVED***
            return (fileObj.getCanonicalPath() + "").replace(file.backSlashRegExp, "/");
      ***REMOVED***

        getFilteredFileList: function (/*String*/startDir, /*RegExp*/regExpFilters, /*boolean?*/makeUnixPaths, /*boolean?*/startDirIsJavaObject) {
            //summary: Recurses startDir and finds matches to the files that match regExpFilters.include
            //and do not match regExpFilters.exclude. Or just one regexp can be passed in for regExpFilters,
            //and it will be treated as the "include" case.
            //Ignores files/directories that start with a period (.) unless exclusionRegExp
            //is set to another value.
            var files = [], topDir, regExpInclude, regExpExclude, dirFileArray,
                i, fileObj, filePath, ok, dirFiles;

            topDir = startDir;
            if (!startDirIsJavaObject) {
                topDir = new java.io.File(startDir);
        ***REMOVED***

            regExpInclude = regExpFilters.include || regExpFilters;
            regExpExclude = regExpFilters.exclude || null;

            if (topDir.exists()) {
                dirFileArray = topDir.listFiles();
                for (i = 0; i < dirFileArray.length; i++) {
                    fileObj = dirFileArray[i];
                    if (fileObj.isFile()) {
                        filePath = fileObj.getPath();
                        if (makeUnixPaths) {
                            //Make sure we have a JS string.
                            filePath = String(filePath);
                            if (filePath.indexOf("/") === -1) {
                                filePath = filePath.replace(/\\/g, "/");
                        ***REMOVED***
                    ***REMOVED***

                        ok = true;
                        if (regExpInclude) {
                            ok = filePath.match(regExpInclude);
                    ***REMOVED***
                        if (ok && regExpExclude) {
                            ok = !filePath.match(regExpExclude);
                    ***REMOVED***

                        if (ok && (!file.exclusionRegExp ||
                            !file.exclusionRegExp.test(fileObj.getName()))) {
                            files.push(filePath);
                    ***REMOVED***
                ***REMOVED*** else if (fileObj.isDirectory() &&
                              (!file.exclusionRegExp || !file.exclusionRegExp.test(fileObj.getName()))) {
                        dirFiles = this.getFilteredFileList(fileObj, regExpFilters, makeUnixPaths, true);
                        files.push.apply(files, dirFiles);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

            return files; //Array
      ***REMOVED***

        copyDir: function (/*String*/srcDir, /*String*/destDir, /*RegExp?*/regExpFilter, /*boolean?*/onlyCopyNew) {
            //summary: copies files from srcDir to destDir using the regExpFilter to determine if the
            //file should be copied. Returns a list file name strings of the destinations that were copied.
            regExpFilter = regExpFilter || /\w/;

            var fileNames = file.getFilteredFileList(srcDir, regExpFilter, true),
            copiedFiles = [], i, srcFileName, destFileName;

            for (i = 0; i < fileNames.length; i++) {
                srcFileName = fileNames[i];
                destFileName = srcFileName.replace(srcDir, destDir);

                if (file.copyFile(srcFileName, destFileName, onlyCopyNew)) {
                    copiedFiles.push(destFileName);
            ***REMOVED***
        ***REMOVED***

            return copiedFiles.length ? copiedFiles : null; //Array or null
      ***REMOVED***

        copyFile: function (/*String*/srcFileName, /*String*/destFileName, /*boolean?*/onlyCopyNew) {
            //summary: copies srcFileName to destFileName. If onlyCopyNew is set, it only copies the file if
            //srcFileName is newer than destFileName. Returns a boolean indicating if the copy occurred.
            var destFile = new java.io.File(destFileName), srcFile, parentDir,
            srcChannel, destChannel;

            //logger.trace("Src filename: " + srcFileName);
            //logger.trace("Dest filename: " + destFileName);

            //If onlyCopyNew is true, then compare dates and only copy if the src is newer
            //than dest.
            if (onlyCopyNew) {
                srcFile = new java.io.File(srcFileName);
                if (destFile.exists() && destFile.lastModified() >= srcFile.lastModified()) {
                    return false; //Boolean
            ***REMOVED***
        ***REMOVED***

            //Make sure destination dir exists.
            parentDir = destFile.getParentFile();
            if (!parentDir.exists()) {
                if (!parentDir.mkdirs()) {
                    throw "Could not create directory: " + parentDir.getCanonicalPath();
            ***REMOVED***
        ***REMOVED***

            //Java's version of copy file.
            srcChannel = new java.io.FileInputStream(srcFileName).getChannel();
            destChannel = new java.io.FileOutputStream(destFileName).getChannel();
            destChannel.transferFrom(srcChannel, 0, srcChannel.size());
            srcChannel.close();
            destChannel.close();

            return true; //Boolean
      ***REMOVED***

        /**
         * Renames a file. May fail if "to" already exists or is on another drive.
         */
        renameFile: function (from, to) {
            return (new java.io.File(from)).renameTo((new java.io.File(to)));
      ***REMOVED***

        readFile: function (/*String*/path, /*String?*/encoding) {
            //A file read function that can deal with BOMs
            encoding = encoding || "utf-8";
            var fileObj = new java.io.File(path),
                    input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(fileObj), encoding)),
                    stringBuffer, line;
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
            ***REMOVED***
                while (line !== null) {
                    stringBuffer.append(line);
                    stringBuffer.append(file.lineSeparator);
                    line = input.readLine();
            ***REMOVED***
                //Make sure we return a JavaScript string and not a Java string.
                return String(stringBuffer.toString()); //String
        ***REMOVED*** finally {
                input.close();
        ***REMOVED***
      ***REMOVED***

        readFileAsync: function (path, encoding) {
            var d = prim();
            try {
                d.resolve(file.readFile(path, encoding));
        ***REMOVED*** catch (e) {
                d.reject(e);
        ***REMOVED***
            return d.promise;
      ***REMOVED***

        saveUtf8File: function (/*String*/fileName, /*String*/fileContents) {
            //summary: saves a file using UTF-8 encoding.
            file.saveFile(fileName, fileContents, "utf-8");
      ***REMOVED***

        saveFile: function (/*String*/fileName, /*String*/fileContents, /*String?*/encoding) {
            //summary: saves a file.
            var outFile = new java.io.File(fileName), outWriter, parentDir, os;

            parentDir = outFile.getAbsoluteFile().getParentFile();
            if (!parentDir.exists()) {
                if (!parentDir.mkdirs()) {
                    throw "Could not create directory: " + parentDir.getAbsolutePath();
            ***REMOVED***
        ***REMOVED***

            if (encoding) {
                outWriter = new java.io.OutputStreamWriter(new java.io.FileOutputStream(outFile), encoding);
        ***REMOVED*** else {
                outWriter = new java.io.OutputStreamWriter(new java.io.FileOutputStream(outFile));
        ***REMOVED***

            os = new java.io.BufferedWriter(outWriter);
            try {
                os.write(fileContents);
        ***REMOVED*** finally {
                os.close();
        ***REMOVED***
      ***REMOVED***

        deleteFile: function (/*String*/fileName) {
            //summary: deletes a file or directory if it exists.
            var fileObj = new java.io.File(fileName), files, i;
            if (fileObj.exists()) {
                if (fileObj.isDirectory()) {
                    files = fileObj.listFiles();
                    for (i = 0; i < files.length; i++) {
                        this.deleteFile(files[i]);
                ***REMOVED***
            ***REMOVED***
                fileObj["delete"]();
        ***REMOVED***
      ***REMOVED***

        /**
         * Deletes any empty directories under the given directory.
         * The startDirIsJavaObject is private to this implementation's
         * recursion needs.
         */
        deleteEmptyDirs: function (startDir, startDirIsJavaObject) {
            var topDir = startDir,
                dirFileArray, i, fileObj;

            if (!startDirIsJavaObject) {
                topDir = new java.io.File(startDir);
        ***REMOVED***

            if (topDir.exists()) {
                dirFileArray = topDir.listFiles();
                for (i = 0; i < dirFileArray.length; i++) {
                    fileObj = dirFileArray[i];
                    if (fileObj.isDirectory()) {
                        file.deleteEmptyDirs(fileObj, true);
                ***REMOVED***
            ***REMOVED***

                //If the directory is empty now, delete it.
                if (topDir.listFiles().length === 0) {
                    file.deleteFile(String(topDir.getPath()));
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    return file;
***REMOVED***);

***REMOVED***

if(env === 'browser') {
/*global process */
define('browser/quit', function () {
    'use strict';
    return function (code) {
***REMOVED***;
***REMOVED***);
***REMOVED***

if(env === 'node') {
/*global process */
define('node/quit', function () {
    'use strict';
    return function (code) {
        return process.exit(code);
***REMOVED***;
***REMOVED***);
***REMOVED***

if(env === 'rhino') {
/*global quit */
define('rhino/quit', function () {
    'use strict';
    return function (code) {
        return quit(code);
***REMOVED***;
***REMOVED***);

***REMOVED***

if(env === 'browser') {
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, console: false */

define('browser/print', function () {
    function print(msg) {
        console.log(msg);
***REMOVED***

    return print;
***REMOVED***);

***REMOVED***

if(env === 'node') {
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, console: false */

define('node/print', function () {
    function print(msg) {
        console.log(msg);
***REMOVED***

    return print;
***REMOVED***);

***REMOVED***

if(env === 'rhino') {
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false, print: false */

define('rhino/print', function () {
    return print;
***REMOVED***);

***REMOVED***
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint nomen: false, strict: false */
/*global define: false */

define('logger', ['env!env/print'], function (print) {
    var logger = {
        TRACE: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        SILENT: 4,
        level: 0,
        logPrefix: "",

        logLevel: function( level ) {
            this.level = level;
      ***REMOVED***

        trace: function (message) {
            if (this.level <= this.TRACE) {
                this._print(message);
        ***REMOVED***
      ***REMOVED***

        info: function (message) {
            if (this.level <= this.INFO) {
                this._print(message);
        ***REMOVED***
      ***REMOVED***

        warn: function (message) {
            if (this.level <= this.WARN) {
                this._print(message);
        ***REMOVED***
      ***REMOVED***

        error: function (message) {
            if (this.level <= this.ERROR) {
                this._print(message);
        ***REMOVED***
      ***REMOVED***

        _print: function (message) {
            this._sysPrint((this.logPrefix ? (this.logPrefix + " ") : "") + message);
      ***REMOVED***

        _sysPrint: function (message) {
            print(message);
    ***REMOVED***
***REMOVED***;

    return logger;
***REMOVED***);
//Just a blank file to use when building the optimizer with the optimizer,
//so that the build does not attempt to inline some env modules,
//like Node's fs and path.

//Commit 465a4eae86c7bae191b1ee427571543ace777117 on July 19, 2012
define('esprima', ['exports'], function(exports) {
/*
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jslint bitwise:true plusplus:true */
/*global esprima:true, exports:true,
throwError: true, createLiteral: true, generateStatement: true,
parseAssignmentExpression: true, parseBlock: true, parseExpression: true,
parseFunctionDeclaration: true, parseFunctionExpression: true,
parseFunctionSourceElements: true, parseVariableIdentifier: true,
parseLeftHandSideExpression: true,
parseStatement: true, parseSourceElement: true */

(function (exports) {
    'use strict';

    var Token,
        TokenName,
        Syntax,
        PropertyKind,
        Messages,
        Regex,
        source,
        strict,
        index,
        lineNumber,
        lineStart,
        length,
        buffer,
        state,
        extra;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8
***REMOVED***;

    TokenName = {***REMOVED***;
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement'
***REMOVED***;

    PropertyKind = {
        Data: 1,
        Get: 2,
        Set: 4
***REMOVED***;

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken:  'Unexpected token %0',
        UnexpectedNumber:  'Unexpected number',
        UnexpectedString:  'Unexpected string',
        UnexpectedIdentifier:  'Unexpected identifier',
        UnexpectedReserved:  'Unexpected reserved word',
        UnexpectedEOS:  'Unexpected end of input',
        NewlineAfterThrow:  'Illegal newline after throw',
        InvalidRegExp: 'Invalid regular expression',
        UnterminatedRegExp:  'Invalid regular expression: missing /',
        InvalidLHSInAssignment:  'Invalid left-hand side in assignment',
        InvalidLHSInForIn:  'Invalid left-hand side in for-in',
        NoCatchOrFinally:  'Missing catch or finally after try',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared',
        IllegalContinue: 'Illegal continue statement',
        IllegalBreak: 'Illegal break statement',
        IllegalReturn: 'Illegal return statement',
        StrictModeWith:  'Strict mode code may not include a with statement',
        StrictCatchVariable:  'Catch variable may not be eval or arguments in strict mode',
        StrictVarName:  'Variable name may not be eval or arguments in strict mode',
        StrictParamName:  'Parameter name eval or arguments is not allowed in strict mode',
        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
        StrictFunctionName:  'Function name may not be eval or arguments in strict mode',
        StrictOctalLiteral:  'Octal literals are not allowed in strict mode.',
        StrictDelete:  'Delete of an unqualified identifier in strict mode.',
        StrictDuplicateProperty:  'Duplicate data property in object literal not allowed in strict mode',
        AccessorDataProperty:  'Object literal may not have data and accessor property with the same name',
        AccessorGetSet:  'Object literal may not have multiple get/set accessors with the same name',
        StrictLHSAssignment:  'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix:  'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix:  'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictReservedWord:  'Use of future reserved word in strict mode'
***REMOVED***;

    // See also tools/generate-unicode-regex.py.
    Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]'),
        NonAsciiIdentifierPart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0\u08a2-\u08ac\u08e4-\u08fe\u0900-\u0963\u0966-\u096f\u0971-\u0977\u0979-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1d00-\u1de6\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c\u200d\u203f\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua697\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a\uaa7b\uaa80-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabea\uabec\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]')
***REMOVED***;

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        if (!condition) {
            throw new Error('ASSERT: ' + message);
    ***REMOVED***
***REMOVED***

    function sliceSource(from, to) {
        return source.slice(from, to);
***REMOVED***

    if (typeof 'esprima'[0] === 'undefined') {
        sliceSource = function sliceArraySource(from, to) {
            return source.slice(from, to).join('');
    ***REMOVED***;
***REMOVED***

    function isDecimalDigit(ch) {
        return '0123456789'.indexOf(ch) >= 0;
***REMOVED***

    function isHexDigit(ch) {
        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
***REMOVED***

    function isOctalDigit(ch) {
        return '01234567'.indexOf(ch) >= 0;
***REMOVED***


    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === ' ') || (ch === '\u0009') || (ch === '\u000B') ||
            (ch === '\u000C') || (ch === '\u00A0') ||
            (ch.charCodeAt(0) >= 0x1680 &&
             '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFF'.indexOf(ch) >= 0);
***REMOVED***

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === '\n' || ch === '\r' || ch === '\u2028' || ch === '\u2029');
***REMOVED***

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch === '$') || (ch === '_') || (ch === '\\') ||
            (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ||
            ((ch.charCodeAt(0) >= 0x80) && Regex.NonAsciiIdentifierStart.test(ch));
***REMOVED***

    function isIdentifierPart(ch) {
        return (ch === '$') || (ch === '_') || (ch === '\\') ||
            (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ||
            ((ch >= '0') && (ch <= '9')) ||
            ((ch.charCodeAt(0) >= 0x80) && Regex.NonAsciiIdentifierPart.test(ch));
***REMOVED***

    // 7.6.1.2 Future Reserved Words

    function isFutureReservedWord(id) {
        switch (id) {

        // Future reserved words.
        case 'class':
        case 'enum':
        case 'export':
        case 'extends':
        case 'import':
        case 'super':
            return true;
    ***REMOVED***

        return false;
***REMOVED***

    function isStrictModeReservedWord(id) {
        switch (id) {

        // Strict Mode reserved words.
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'yield':
        case 'let':
            return true;
    ***REMOVED***

        return false;
***REMOVED***

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
***REMOVED***

    // 7.6.1.1 Keywords

    function isKeyword(id) {
        var keyword = false;
        switch (id.length) {
        case 2:
            keyword = (id === 'if') || (id === 'in') || (id === 'do');
            break;
        case 3:
            keyword = (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
            break;
        case 4:
            keyword = (id === 'this') || (id === 'else') || (id === 'case') || (id === 'void') || (id === 'with');
            break;
        case 5:
            keyword = (id === 'while') || (id === 'break') || (id === 'catch') || (id === 'throw');
            break;
        case 6:
            keyword = (id === 'return') || (id === 'typeof') || (id === 'delete') || (id === 'switch');
            break;
        case 7:
            keyword = (id === 'default') || (id === 'finally');
            break;
        case 8:
            keyword = (id === 'function') || (id === 'continue') || (id === 'debugger');
            break;
        case 10:
            keyword = (id === 'instanceof');
            break;
    ***REMOVED***

        if (keyword) {
            return true;
    ***REMOVED***

        switch (id) {
        // Future reserved words.
        // 'const' is specialized as Keyword in V8.
        case 'const':
            return true;

        // For compatiblity to SpiderMonkey and ES.next
        case 'yield':
        case 'let':
            return true;
    ***REMOVED***

        if (strict && isStrictModeReservedWord(id)) {
            return true;
    ***REMOVED***

        return isFutureReservedWord(id);
***REMOVED***

    // Return the next character and move forward.

    function nextChar() {
        return source[index++];
***REMOVED***

    // 7.4 Comments

    function skipComment() {
        var ch, blockComment, lineComment;

        blockComment = false;
        lineComment = false;

        while (index < length) {
            ch = source[index];

            if (lineComment) {
                ch = nextChar();
                if (isLineTerminator(ch)) {
                    lineComment = false;
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                ***REMOVED***
                    ++lineNumber;
                    lineStart = index;
            ***REMOVED***
        ***REMOVED*** else if (blockComment) {
                if (isLineTerminator(ch)) {
                    if (ch === '\r' && source[index + 1] === '\n') {
                        ++index;
                ***REMOVED***
                    ++lineNumber;
                    ++index;
                    lineStart = index;
                    if (index >= length) {
                        throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                ***REMOVED***
            ***REMOVED*** else {
                    ch = nextChar();
                    if (index >= length) {
                        throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                ***REMOVED***
                    if (ch === '*') {
                        ch = source[index];
                        if (ch === '/') {
                            ++index;
                            blockComment = false;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED*** else if (ch === '/') {
                ch = source[index + 1];
                if (ch === '/') {
                    index += 2;
                    lineComment = true;
            ***REMOVED*** else if (ch === '*') {
                    index += 2;
                    blockComment = true;
                    if (index >= length) {
                        throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                ***REMOVED***
            ***REMOVED*** else {
                    break;
            ***REMOVED***
        ***REMOVED*** else if (isWhiteSpace(ch)) {
                ++index;
        ***REMOVED*** else if (isLineTerminator(ch)) {
                ++index;
                if (ch ===  '\r' && source[index] === '\n') {
                    ++index;
            ***REMOVED***
                ++lineNumber;
                lineStart = index;
        ***REMOVED*** else {
                break;
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    function scanHexEscape(prefix) {
        var i, len, ch, code = 0;

        len = (prefix === 'u') ? 4 : 2;
        for (i = 0; i < len; ++i) {
            if (index < length && isHexDigit(source[index])) {
                ch = nextChar();
                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
        ***REMOVED*** else {
                return '';
        ***REMOVED***
    ***REMOVED***
        return String.fromCharCode(code);
***REMOVED***

    function scanIdentifier() {
        var ch, start, id, restore;

        ch = source[index];
        if (!isIdentifierStart(ch)) {
            return;
    ***REMOVED***

        start = index;
        if (ch === '\\') {
            ++index;
            if (source[index] !== 'u') {
                return;
        ***REMOVED***
            ++index;
            restore = index;
            ch = scanHexEscape('u');
            if (ch) {
                if (ch === '\\' || !isIdentifierStart(ch)) {
                    return;
            ***REMOVED***
                id = ch;
        ***REMOVED*** else {
                index = restore;
                id = 'u';
        ***REMOVED***
    ***REMOVED*** else {
            id = nextChar();
    ***REMOVED***

        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch)) {
                break;
        ***REMOVED***
            if (ch === '\\') {
                ++index;
                if (source[index] !== 'u') {
                    return;
            ***REMOVED***
                ++index;
                restore = index;
                ch = scanHexEscape('u');
                if (ch) {
                    if (ch === '\\' || !isIdentifierPart(ch)) {
                        return;
                ***REMOVED***
                    id += ch;
            ***REMOVED*** else {
                    index = restore;
                    id += 'u';
            ***REMOVED***
        ***REMOVED*** else {
                id += nextChar();
        ***REMOVED***
    ***REMOVED***

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            return {
                type: Token.Identifier,
                value: id,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        if (isKeyword(id)) {
            return {
                type: Token.Keyword,
                value: id,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        // 7.8.1 Null Literals

        if (id === 'null') {
            return {
                type: Token.NullLiteral,
                value: id,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        // 7.8.2 Boolean Literals

        if (id === 'true' || id === 'false') {
            return {
                type: Token.BooleanLiteral,
                value: id,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        return {
            type: Token.Identifier,
            value: id,
            lineNumber: lineNumber,
            lineStart: lineStart,
            range: [start, index]
    ***REMOVED***;
***REMOVED***

    // 7.7 Punctuators

    function scanPunctuator() {
        var start = index,
            ch1 = source[index],
            ch2,
            ch3,
            ch4;

        // Check for most common single-character punctuators.

        if (ch1 === ';' || ch1 === '{' || ch1 === '***REMOVED***') {
            ++index;
            return {
                type: Token.Punctuator,
                value: ch1,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        if (ch1 === ',' || ch1 === '(' || ch1 === ')') {
            ++index;
            return {
                type: Token.Punctuator,
                value: ch1,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        // Dot (.) can also start a floating-point number, hence the need
        // to check the next character.

        ch2 = source[index + 1];
        if (ch1 === '.' && !isDecimalDigit(ch2)) {
            return {
                type: Token.Punctuator,
                value: nextChar(),
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        // Peek more characters.

        ch3 = source[index + 2];
        ch4 = source[index + 3];

        // 4-character punctuator: >>>=

        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
            if (ch4 === '=') {
                index += 4;
                return {
                    type: Token.Punctuator,
                    value: '>>>=',
                    lineNumber: lineNumber,
                    lineStart: lineStart,
                    range: [start, index]
            ***REMOVED***;
        ***REMOVED***
    ***REMOVED***

        // 3-character punctuators: === !== >>> <<= >>=

        if (ch1 === '=' && ch2 === '=' && ch3 === '=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '===',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        if (ch1 === '!' && ch2 === '=' && ch3 === '=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '!==',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '>>>',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        if (ch1 === '<' && ch2 === '<' && ch3 === '=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '<<=',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        if (ch1 === '>' && ch2 === '>' && ch3 === '=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '>>=',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***

        // 2-character punctuators: <= >= == != ++ -- << >> && ||
        // += -= *= %= &= |= ^= /=

        if (ch2 === '=') {
            if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
                index += 2;
                return {
                    type: Token.Punctuator,
                    value: ch1 + ch2,
                    lineNumber: lineNumber,
                    lineStart: lineStart,
                    range: [start, index]
            ***REMOVED***;
        ***REMOVED***
    ***REMOVED***

        if (ch1 === ch2 && ('+-<>&|'.indexOf(ch1) >= 0)) {
            if ('+-<>&|'.indexOf(ch2) >= 0) {
                index += 2;
                return {
                    type: Token.Punctuator,
                    value: ch1 + ch2,
                    lineNumber: lineNumber,
                    lineStart: lineStart,
                    range: [start, index]
            ***REMOVED***;
        ***REMOVED***
    ***REMOVED***

        // The remaining 1-character punctuators.

        if ('[]<>+-*%&|^!~?:=/'.indexOf(ch1) >= 0) {
            return {
                type: Token.Punctuator,
                value: nextChar(),
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
        ***REMOVED***;
    ***REMOVED***
***REMOVED***

    // 7.8.3 Numeric Literals

    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = nextChar();
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            if (number === '0') {
                if (ch === 'x' || ch === 'X') {
                    number += nextChar();
                    while (index < length) {
                        ch = source[index];
                        if (!isHexDigit(ch)) {
                            break;
                    ***REMOVED***
                        number += nextChar();
                ***REMOVED***

                    if (number.length <= 2) {
                        // only 0x
                        throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                ***REMOVED***

                    if (index < length) {
                        ch = source[index];
                        if (isIdentifierStart(ch)) {
                            throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                    ***REMOVED***
                ***REMOVED***
                    return {
                        type: Token.NumericLiteral,
                        value: parseInt(number, 16),
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        range: [start, index]
                ***REMOVED***;
            ***REMOVED*** else if (isOctalDigit(ch)) {
                    number += nextChar();
                    while (index < length) {
                        ch = source[index];
                        if (!isOctalDigit(ch)) {
                            break;
                    ***REMOVED***
                        number += nextChar();
                ***REMOVED***

                    if (index < length) {
                        ch = source[index];
                        if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
                            throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                    ***REMOVED***
                ***REMOVED***
                    return {
                        type: Token.NumericLiteral,
                        value: parseInt(number, 8),
                        octal: true,
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        range: [start, index]
                ***REMOVED***;
            ***REMOVED***

                // decimal number starts with '0' such as '09' is illegal.
                if (isDecimalDigit(ch)) {
                    throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
            ***REMOVED***
        ***REMOVED***

            while (index < length) {
                ch = source[index];
                if (!isDecimalDigit(ch)) {
                    break;
            ***REMOVED***
                number += nextChar();
        ***REMOVED***
    ***REMOVED***

        if (ch === '.') {
            number += nextChar();
            while (index < length) {
                ch = source[index];
                if (!isDecimalDigit(ch)) {
                    break;
            ***REMOVED***
                number += nextChar();
        ***REMOVED***
    ***REMOVED***

        if (ch === 'e' || ch === 'E') {
            number += nextChar();

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += nextChar();
        ***REMOVED***

            ch = source[index];
            if (isDecimalDigit(ch)) {
                number += nextChar();
                while (index < length) {
                    ch = source[index];
                    if (!isDecimalDigit(ch)) {
                        break;
                ***REMOVED***
                    number += nextChar();
            ***REMOVED***
        ***REMOVED*** else {
                ch = 'character ' + ch;
                if (index >= length) {
                    ch = '<end>';
            ***REMOVED***
                throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
        ***REMOVED***
    ***REMOVED***

        if (index < length) {
            ch = source[index];
            if (isIdentifierStart(ch)) {
                throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
        ***REMOVED***
    ***REMOVED***

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            lineNumber: lineNumber,
            lineStart: lineStart,
            range: [start, index]
    ***REMOVED***;
***REMOVED***

    // 7.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, code, unescaped, restore, octal = false;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = nextChar();

            if (ch === quote) {
                quote = '';
                break;
        ***REMOVED*** else if (ch === '\\') {
                ch = nextChar();
                if (!isLineTerminator(ch)) {
                    switch (ch) {
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'u':
                    case 'x':
                        restore = index;
                        unescaped = scanHexEscape(ch);
                        if (unescaped) {
                            str += unescaped;
                    ***REMOVED*** else {
                            index = restore;
                            str += ch;
                    ***REMOVED***
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\v';
                        break;

                    default:
                        if (isOctalDigit(ch)) {
                            code = '01234567'.indexOf(ch);

                            // \0 is not octal escape sequence
                            if (code !== 0) {
                                octal = true;
                        ***REMOVED***

                            if (index < length && isOctalDigit(source[index])) {
                                octal = true;
                                code = code * 8 + '01234567'.indexOf(nextChar());

                                // 3 digits are only allowed when string starts
                                // with 0, 1, 2, 3
                                if ('0123'.indexOf(ch) >= 0 &&
                                        index < length &&
                                        isOctalDigit(source[index])) {
                                    code = code * 8 + '01234567'.indexOf(nextChar());
                            ***REMOVED***
                        ***REMOVED***
                            str += String.fromCharCode(code);
                    ***REMOVED*** else {
                            str += ch;
                    ***REMOVED***
                        break;
                ***REMOVED***
            ***REMOVED*** else {
                    ++lineNumber;
                    if (ch ===  '\r' && source[index] === '\n') {
                        ++index;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED*** else if (isLineTerminator(ch)) {
                break;
        ***REMOVED*** else {
                str += ch;
        ***REMOVED***
    ***REMOVED***

        if (quote !== '') {
            throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
    ***REMOVED***

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            lineNumber: lineNumber,
            lineStart: lineStart,
            range: [start, index]
    ***REMOVED***;
***REMOVED***

    function scanRegExp() {
        var str = '', ch, start, pattern, flags, value, classMarker = false, restore;

        buffer = null;
        skipComment();

        start = index;
        ch = source[index];
        assert(ch === '/', 'Regular expression literal must start with a slash');
        str = nextChar();

        while (index < length) {
            ch = nextChar();
            str += ch;
            if (classMarker) {
                if (ch === ']') {
                    classMarker = false;
            ***REMOVED***
        ***REMOVED*** else {
                if (ch === '\\') {
                    ch = nextChar();
                    // ECMA-262 7.8.5
                    if (isLineTerminator(ch)) {
                        throwError({***REMOVED***, Messages.UnterminatedRegExp);
                ***REMOVED***
                    str += ch;
            ***REMOVED*** else if (ch === '/') {
                    break;
            ***REMOVED*** else if (ch === '[') {
                    classMarker = true;
            ***REMOVED*** else if (isLineTerminator(ch)) {
                    throwError({***REMOVED***, Messages.UnterminatedRegExp);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        if (str.length === 1) {
            throwError({***REMOVED***, Messages.UnterminatedRegExp);
    ***REMOVED***

        // Exclude leading and trailing slash.
        pattern = str.substr(1, str.length - 2);

        flags = '';
        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch)) {
                break;
        ***REMOVED***

            ++index;
            if (ch === '\\' && index < length) {
                ch = source[index];
                if (ch === 'u') {
                    ++index;
                    restore = index;
                    ch = scanHexEscape('u');
                    if (ch) {
                        flags += ch;
                        str += '\\u';
                        for (; restore < index; ++restore) {
                            str += source[restore];
                    ***REMOVED***
                ***REMOVED*** else {
                        index = restore;
                        flags += 'u';
                        str += '\\u';
                ***REMOVED***
            ***REMOVED*** else {
                    str += '\\';
            ***REMOVED***
        ***REMOVED*** else {
                flags += ch;
                str += ch;
        ***REMOVED***
    ***REMOVED***

        try {
            value = new RegExp(pattern, flags);
    ***REMOVED*** catch (e) {
            throwError({***REMOVED***, Messages.InvalidRegExp);
    ***REMOVED***

        return {
            literal: str,
            value: value,
            range: [start, index]
    ***REMOVED***;
***REMOVED***

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
***REMOVED***

    function advance() {
        var ch, token;

        skipComment();

        if (index >= length) {
            return {
                type: Token.EOF,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [index, index]
        ***REMOVED***;
    ***REMOVED***

        token = scanPunctuator();
        if (typeof token !== 'undefined') {
            return token;
    ***REMOVED***

        ch = source[index];

        if (ch === '\'' || ch === '"') {
            return scanStringLiteral();
    ***REMOVED***

        if (ch === '.' || isDecimalDigit(ch)) {
            return scanNumericLiteral();
    ***REMOVED***

        token = scanIdentifier();
        if (typeof token !== 'undefined') {
            return token;
    ***REMOVED***

        throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
***REMOVED***

    function lex() {
        var token;

        if (buffer) {
            index = buffer.range[1];
            lineNumber = buffer.lineNumber;
            lineStart = buffer.lineStart;
            token = buffer;
            buffer = null;
            return token;
    ***REMOVED***

        buffer = null;
        return advance();
***REMOVED***

    function lookahead() {
        var pos, line, start;

        if (buffer !== null) {
            return buffer;
    ***REMOVED***

        pos = index;
        line = lineNumber;
        start = lineStart;
        buffer = advance();
        index = pos;
        lineNumber = line;
        lineStart = start;

        return buffer;
***REMOVED***

    // Return true if there is a line terminator before the next token.

    function peekLineTerminator() {
        var pos, line, start, found;

        pos = index;
        line = lineNumber;
        start = lineStart;
        skipComment();
        found = lineNumber !== line;
        index = pos;
        lineNumber = line;
        lineStart = start;

        return found;
***REMOVED***

    // Throw an exception

    function throwError(token, messageFormat) {
        var error,
            args = Array.prototype.slice.call(arguments, 2),
            msg = messageFormat.replace(
                /%(\d)/g,
                function (whole, index) {
                    return args[index] || '';
            ***REMOVED***
            );

        if (typeof token.lineNumber === 'number') {
            error = new Error('Line ' + token.lineNumber + ': ' + msg);
            error.index = token.range[0];
            error.lineNumber = token.lineNumber;
            error.column = token.range[0] - lineStart + 1;
    ***REMOVED*** else {
            error = new Error('Line ' + lineNumber + ': ' + msg);
            error.index = index;
            error.lineNumber = lineNumber;
            error.column = index - lineStart + 1;
    ***REMOVED***

        throw error;
***REMOVED***

    function throwErrorTolerant() {
        var error;
        try {
            throwError.apply(null, arguments);
    ***REMOVED*** catch (e) {
            if (extra.errors) {
                extra.errors.push(e);
        ***REMOVED*** else {
                throw e;
        ***REMOVED***
    ***REMOVED***
***REMOVED***


    // Throw an exception because of the token.

    function throwUnexpected(token) {
        var s;

        if (token.type === Token.EOF) {
            throwError(token, Messages.UnexpectedEOS);
    ***REMOVED***

        if (token.type === Token.NumericLiteral) {
            throwError(token, Messages.UnexpectedNumber);
    ***REMOVED***

        if (token.type === Token.StringLiteral) {
            throwError(token, Messages.UnexpectedString);
    ***REMOVED***

        if (token.type === Token.Identifier) {
            throwError(token, Messages.UnexpectedIdentifier);
    ***REMOVED***

        if (token.type === Token.Keyword) {
            if (isFutureReservedWord(token.value)) {
                throwError(token, Messages.UnexpectedReserved);
        ***REMOVED*** else if (strict && isStrictModeReservedWord(token.value)) {
                throwError(token, Messages.StrictReservedWord);
        ***REMOVED***
            throwError(token, Messages.UnexpectedToken, token.value);
    ***REMOVED***

        // BooleanLiteral, NullLiteral, or Punctuator.
        throwError(token, Messages.UnexpectedToken, token.value);
***REMOVED***

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpected(token);
    ***REMOVED***
***REMOVED***

    // Expect the next token to match the specified keyword.
    // If not, an exception will be thrown.

    function expectKeyword(keyword) {
        var token = lex();
        if (token.type !== Token.Keyword || token.value !== keyword) {
            throwUnexpected(token);
    ***REMOVED***
***REMOVED***

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        var token = lookahead();
        return token.type === Token.Punctuator && token.value === value;
***REMOVED***

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        var token = lookahead();
        return token.type === Token.Keyword && token.value === keyword;
***REMOVED***

    // Return true if the next token is an assignment operator

    function matchAssign() {
        var token = lookahead(),
            op = token.value;

        if (token.type !== Token.Punctuator) {
            return false;
    ***REMOVED***
        return op === '=' ||
            op === '*=' ||
            op === '/=' ||
            op === '%=' ||
            op === '+=' ||
            op === '-=' ||
            op === '<<=' ||
            op === '>>=' ||
            op === '>>>=' ||
            op === '&=' ||
            op === '^=' ||
            op === '|=';
***REMOVED***

    function consumeSemicolon() {
        var token, line;

        // Catch the very common case first.
        if (source[index] === ';') {
            lex();
            return;
    ***REMOVED***

        line = lineNumber;
        skipComment();
        if (lineNumber !== line) {
            return;
    ***REMOVED***

        if (match(';')) {
            lex();
            return;
    ***REMOVED***

        token = lookahead();
        if (token.type !== Token.EOF && !match('***REMOVED***')) {
            throwUnexpected(token);
    ***REMOVED***
        return;
***REMOVED***

    // Return true if provided expression is LeftHandSideExpression

    function isLeftHandSide(expr) {
        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
***REMOVED***

    // 11.1.4 Array Initialiser

    function parseArrayInitialiser() {
        var elements = [],
            undef;

        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(undef);
        ***REMOVED*** else {
                elements.push(parseAssignmentExpression());

                if (!match(']')) {
                    expect(',');
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        expect(']');

        return {
            type: Syntax.ArrayExpression,
            elements: elements
    ***REMOVED***;
***REMOVED***

    // 11.1.5 Object Initialiser

    function parsePropertyFunction(param, first) {
        var previousStrict, body;

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (first && strict && isRestrictedWord(param[0].name)) {
            throwError(first, Messages.StrictParamName);
    ***REMOVED***
        strict = previousStrict;

        return {
            type: Syntax.FunctionExpression,
            id: null,
            params: param,
            body: body
    ***REMOVED***;
***REMOVED***

    function parseObjectPropertyKey() {
        var token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.

        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
            if (strict && token.octal) {
                throwError(token, Messages.StrictOctalLiteral);
        ***REMOVED***
            return createLiteral(token);
    ***REMOVED***

        return {
            type: Syntax.Identifier,
            name: token.value
    ***REMOVED***;
***REMOVED***

    function parseObjectProperty() {
        var token, key, id, param;

        token = lookahead();

        if (token.type === Token.Identifier) {

            id = parseObjectPropertyKey();

            // Property Assignment: Getter and Setter.

            if (token.value === 'get' && !match(':')) {
                key = parseObjectPropertyKey();
                expect('(');
                expect(')');
                return {
                    type: Syntax.Property,
                    key: key,
                    value: parsePropertyFunction([]),
                    kind: 'get'
            ***REMOVED***;
        ***REMOVED*** else if (token.value === 'set' && !match(':')) {
                key = parseObjectPropertyKey();
                expect('(');
                token = lookahead();
                if (token.type !== Token.Identifier) {
                    throwUnexpected(lex());
            ***REMOVED***
                param = [ parseVariableIdentifier() ];
                expect(')');
                return {
                    type: Syntax.Property,
                    key: key,
                    value: parsePropertyFunction(param, token),
                    kind: 'set'
            ***REMOVED***;
        ***REMOVED*** else {
                expect(':');
                return {
                    type: Syntax.Property,
                    key: id,
                    value: parseAssignmentExpression(),
                    kind: 'init'
            ***REMOVED***;
        ***REMOVED***
    ***REMOVED*** else if (token.type === Token.EOF || token.type === Token.Punctuator) {
            throwUnexpected(token);
    ***REMOVED*** else {
            key = parseObjectPropertyKey();
            expect(':');
            return {
                type: Syntax.Property,
                key: key,
                value: parseAssignmentExpression(),
                kind: 'init'
        ***REMOVED***;
    ***REMOVED***
***REMOVED***

    function parseObjectInitialiser() {
        var token, properties = [], property, name, kind, map = {***REMOVED***, toString = String;

        expect('{');

        while (!match('***REMOVED***')) {
            property = parseObjectProperty();

            if (property.key.type === Syntax.Identifier) {
                name = property.key.name;
        ***REMOVED*** else {
                name = toString(property.key.value);
        ***REMOVED***
            kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;
            if (Object.prototype.hasOwnProperty.call(map, name)) {
                if (map[name] === PropertyKind.Data) {
                    if (strict && kind === PropertyKind.Data) {
                        throwErrorTolerant({***REMOVED***, Messages.StrictDuplicateProperty);
                ***REMOVED*** else if (kind !== PropertyKind.Data) {
                        throwError({***REMOVED***, Messages.AccessorDataProperty);
                ***REMOVED***
            ***REMOVED*** else {
                    if (kind === PropertyKind.Data) {
                        throwError({***REMOVED***, Messages.AccessorDataProperty);
                ***REMOVED*** else if (map[name] & kind) {
                        throwError({***REMOVED***, Messages.AccessorGetSet);
                ***REMOVED***
            ***REMOVED***
                map[name] |= kind;
        ***REMOVED*** else {
                map[name] = kind;
        ***REMOVED***

            properties.push(property);

            if (!match('***REMOVED***')) {
                expect(',');
        ***REMOVED***
    ***REMOVED***

        expect('***REMOVED***');

        return {
            type: Syntax.ObjectExpression,
            properties: properties
    ***REMOVED***;
***REMOVED***

    // 11.1 Primary Expressions

    function parsePrimaryExpression() {
        var expr,
            token = lookahead(),
            type = token.type;

        if (type === Token.Identifier) {
            return {
                type: Syntax.Identifier,
                name: lex().value
        ***REMOVED***;
    ***REMOVED***

        if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            if (strict && token.octal) {
                throwErrorTolerant(token, Messages.StrictOctalLiteral);
        ***REMOVED***
            return createLiteral(lex());
    ***REMOVED***

        if (type === Token.Keyword) {
            if (matchKeyword('this')) {
                lex();
                return {
                    type: Syntax.ThisExpression
            ***REMOVED***;
        ***REMOVED***

            if (matchKeyword('function')) {
                return parseFunctionExpression();
        ***REMOVED***
    ***REMOVED***

        if (type === Token.BooleanLiteral) {
            lex();
            token.value = (token.value === 'true');
            return createLiteral(token);
    ***REMOVED***

        if (type === Token.NullLiteral) {
            lex();
            token.value = null;
            return createLiteral(token);
    ***REMOVED***

        if (match('[')) {
            return parseArrayInitialiser();
    ***REMOVED***

        if (match('{')) {
            return parseObjectInitialiser();
    ***REMOVED***

        if (match('(')) {
            lex();
            state.lastParenthesized = expr = parseExpression();
            expect(')');
            return expr;
    ***REMOVED***

        if (match('/') || match('/=')) {
            return createLiteral(scanRegExp());
    ***REMOVED***

        return throwUnexpected(lex());
***REMOVED***

    // 11.2 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [];

        expect('(');

        if (!match(')')) {
            while (index < length) {
                args.push(parseAssignmentExpression());
                if (match(')')) {
                    break;
            ***REMOVED***
                expect(',');
        ***REMOVED***
    ***REMOVED***

        expect(')');

        return args;
***REMOVED***

    function parseNonComputedProperty() {
        var token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpected(token);
    ***REMOVED***

        return {
            type: Syntax.Identifier,
            name: token.value
    ***REMOVED***;
***REMOVED***

    function parseNonComputedMember(object) {
        return {
            type: Syntax.MemberExpression,
            computed: false,
            object: object,
            property: parseNonComputedProperty()
    ***REMOVED***;
***REMOVED***

    function parseComputedMember(object) {
        var property, expr;

        expect('[');
        property = parseExpression();
        expr = {
            type: Syntax.MemberExpression,
            computed: true,
            object: object,
            property: property
    ***REMOVED***;
        expect(']');
        return expr;
***REMOVED***

    function parseCallMember(object) {
        return {
            type: Syntax.CallExpression,
            callee: object,
            'arguments': parseArguments()
    ***REMOVED***;
***REMOVED***

    function parseNewExpression() {
        var expr;

        expectKeyword('new');

        expr = {
            type: Syntax.NewExpression,
            callee: parseLeftHandSideExpression(),
            'arguments': []
    ***REMOVED***;

        if (match('(')) {
            expr['arguments'] = parseArguments();
    ***REMOVED***

        return expr;
***REMOVED***

    function parseLeftHandSideExpressionAllowCall() {
        var useNew, expr;

        useNew = matchKeyword('new');
        expr = useNew ? parseNewExpression() : parsePrimaryExpression();

        while (index < length) {
            if (match('.')) {
                lex();
                expr = parseNonComputedMember(expr);
        ***REMOVED*** else if (match('[')) {
                expr = parseComputedMember(expr);
        ***REMOVED*** else if (match('(')) {
                expr = parseCallMember(expr);
        ***REMOVED*** else {
                break;
        ***REMOVED***
    ***REMOVED***

        return expr;
***REMOVED***

    function parseLeftHandSideExpression() {
        var useNew, expr;

        useNew = matchKeyword('new');
        expr = useNew ? parseNewExpression() : parsePrimaryExpression();

        while (index < length) {
            if (match('.')) {
                lex();
                expr = parseNonComputedMember(expr);
        ***REMOVED*** else if (match('[')) {
                expr = parseComputedMember(expr);
        ***REMOVED*** else {
                break;
        ***REMOVED***
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.3 Postfix Expressions

    function parsePostfixExpression() {
        var expr = parseLeftHandSideExpressionAllowCall();

        if ((match('++') || match('--')) && !peekLineTerminator()) {
            // 11.3.1, 11.3.2
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwError({***REMOVED***, Messages.StrictLHSPostfix);
        ***REMOVED***

            if (!isLeftHandSide(expr)) {
                throwError({***REMOVED***, Messages.InvalidLHSInAssignment);
        ***REMOVED***

            expr = {
                type: Syntax.UpdateExpression,
                operator: lex().value,
                argument: expr,
                prefix: false
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.4 Unary Operators

    function parseUnaryExpression() {
        var token, expr;

        if (match('++') || match('--')) {
            token = lex();
            expr = parseUnaryExpression();
            // 11.4.4, 11.4.5
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwError({***REMOVED***, Messages.StrictLHSPrefix);
        ***REMOVED***

            if (!isLeftHandSide(expr)) {
                throwError({***REMOVED***, Messages.InvalidLHSInAssignment);
        ***REMOVED***

            expr = {
                type: Syntax.UpdateExpression,
                operator: token.value,
                argument: expr,
                prefix: true
        ***REMOVED***;
            return expr;
    ***REMOVED***

        if (match('+') || match('-') || match('~') || match('!')) {
            expr = {
                type: Syntax.UnaryExpression,
                operator: lex().value,
                argument: parseUnaryExpression()
        ***REMOVED***;
            return expr;
    ***REMOVED***

        if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            expr = {
                type: Syntax.UnaryExpression,
                operator: lex().value,
                argument: parseUnaryExpression()
        ***REMOVED***;
            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
                throwErrorTolerant({***REMOVED***, Messages.StrictDelete);
        ***REMOVED***
            return expr;
    ***REMOVED***

        return parsePostfixExpression();
***REMOVED***

    // 11.5 Multiplicative Operators

    function parseMultiplicativeExpression() {
        var expr = parseUnaryExpression();

        while (match('*') || match('/') || match('%')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseUnaryExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.6 Additive Operators

    function parseAdditiveExpression() {
        var expr = parseMultiplicativeExpression();

        while (match('+') || match('-')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseMultiplicativeExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.7 Bitwise Shift Operators

    function parseShiftExpression() {
        var expr = parseAdditiveExpression();

        while (match('<<') || match('>>') || match('>>>')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseAdditiveExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***
    // 11.8 Relational Operators

    function parseRelationalExpression() {
        var expr, previousAllowIn;

        previousAllowIn = state.allowIn;
        state.allowIn = true;

        expr = parseShiftExpression();

        while (match('<') || match('>') || match('<=') || match('>=') || (previousAllowIn && matchKeyword('in')) || matchKeyword('instanceof')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseShiftExpression()
        ***REMOVED***;
    ***REMOVED***

        state.allowIn = previousAllowIn;
        return expr;
***REMOVED***

    // 11.9 Equality Operators

    function parseEqualityExpression() {
        var expr = parseRelationalExpression();

        while (match('==') || match('!=') || match('===') || match('!==')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseRelationalExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.10 Binary Bitwise Operators

    function parseBitwiseANDExpression() {
        var expr = parseEqualityExpression();

        while (match('&')) {
            lex();
            expr = {
                type: Syntax.BinaryExpression,
                operator: '&',
                left: expr,
                right: parseEqualityExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    function parseBitwiseXORExpression() {
        var expr = parseBitwiseANDExpression();

        while (match('^')) {
            lex();
            expr = {
                type: Syntax.BinaryExpression,
                operator: '^',
                left: expr,
                right: parseBitwiseANDExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    function parseBitwiseORExpression() {
        var expr = parseBitwiseXORExpression();

        while (match('|')) {
            lex();
            expr = {
                type: Syntax.BinaryExpression,
                operator: '|',
                left: expr,
                right: parseBitwiseXORExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.11 Binary Logical Operators

    function parseLogicalANDExpression() {
        var expr = parseBitwiseORExpression();

        while (match('&&')) {
            lex();
            expr = {
                type: Syntax.LogicalExpression,
                operator: '&&',
                left: expr,
                right: parseBitwiseORExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    function parseLogicalORExpression() {
        var expr = parseLogicalANDExpression();

        while (match('||')) {
            lex();
            expr = {
                type: Syntax.LogicalExpression,
                operator: '||',
                left: expr,
                right: parseLogicalANDExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.12 Conditional Operator

    function parseConditionalExpression() {
        var expr, previousAllowIn, consequent;

        expr = parseLogicalORExpression();

        if (match('?')) {
            lex();
            previousAllowIn = state.allowIn;
            state.allowIn = true;
            consequent = parseAssignmentExpression();
            state.allowIn = previousAllowIn;
            expect(':');

            expr = {
                type: Syntax.ConditionalExpression,
                test: expr,
                consequent: consequent,
                alternate: parseAssignmentExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.13 Assignment Operators

    function parseAssignmentExpression() {
        var expr;

        expr = parseConditionalExpression();

        if (matchAssign()) {
            // LeftHandSideExpression
            if (!isLeftHandSide(expr)) {
                throwError({***REMOVED***, Messages.InvalidLHSInAssignment);
        ***REMOVED***

            // 11.13.1
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwError({***REMOVED***, Messages.StrictLHSAssignment);
        ***REMOVED***

            expr = {
                type: Syntax.AssignmentExpression,
                operator: lex().value,
                left: expr,
                right: parseAssignmentExpression()
        ***REMOVED***;
    ***REMOVED***

        return expr;
***REMOVED***

    // 11.14 Comma Operator

    function parseExpression() {
        var expr = parseAssignmentExpression();

        if (match(',')) {
            expr = {
                type: Syntax.SequenceExpression,
                expressions: [ expr ]
        ***REMOVED***;

            while (index < length) {
                if (!match(',')) {
                    break;
            ***REMOVED***
                lex();
                expr.expressions.push(parseAssignmentExpression());
        ***REMOVED***

    ***REMOVED***
        return expr;
***REMOVED***

    // 12.1 Block

    function parseStatementList() {
        var list = [],
            statement;

        while (index < length) {
            if (match('***REMOVED***')) {
                break;
        ***REMOVED***
            statement = parseSourceElement();
            if (typeof statement === 'undefined') {
                break;
        ***REMOVED***
            list.push(statement);
    ***REMOVED***

        return list;
***REMOVED***

    function parseBlock() {
        var block;

        expect('{');

        block = parseStatementList();

        expect('***REMOVED***');

        return {
            type: Syntax.BlockStatement,
            body: block
    ***REMOVED***;
***REMOVED***

    // 12.2 Variable Statement

    function parseVariableIdentifier() {
        var token = lex();

        if (token.type !== Token.Identifier) {
            throwUnexpected(token);
    ***REMOVED***

        return {
            type: Syntax.Identifier,
            name: token.value
    ***REMOVED***;
***REMOVED***

    function parseVariableDeclaration(kind) {
        var id = parseVariableIdentifier(),
            init = null;

        // 12.2.1
        if (strict && isRestrictedWord(id.name)) {
            throwErrorTolerant({***REMOVED***, Messages.StrictVarName);
    ***REMOVED***

        if (kind === 'const') {
            expect('=');
            init = parseAssignmentExpression();
    ***REMOVED*** else if (match('=')) {
            lex();
            init = parseAssignmentExpression();
    ***REMOVED***

        return {
            type: Syntax.VariableDeclarator,
            id: id,
            init: init
    ***REMOVED***;
***REMOVED***

    function parseVariableDeclarationList(kind) {
        var list = [];

        while (index < length) {
            list.push(parseVariableDeclaration(kind));
            if (!match(',')) {
                break;
        ***REMOVED***
            lex();
    ***REMOVED***

        return list;
***REMOVED***

    function parseVariableStatement() {
        var declarations;

        expectKeyword('var');

        declarations = parseVariableDeclarationList();

        consumeSemicolon();

        return {
            type: Syntax.VariableDeclaration,
            declarations: declarations,
            kind: 'var'
    ***REMOVED***;
***REMOVED***

    // kind may be `const` or `let`
    // Both are experimental and not in the specification yet.
    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
    function parseConstLetDeclaration(kind) {
        var declarations;

        expectKeyword(kind);

        declarations = parseVariableDeclarationList(kind);

        consumeSemicolon();

        return {
            type: Syntax.VariableDeclaration,
            declarations: declarations,
            kind: kind
    ***REMOVED***;
***REMOVED***

    // 12.3 Empty Statement

    function parseEmptyStatement() {
        expect(';');

        return {
            type: Syntax.EmptyStatement
    ***REMOVED***;
***REMOVED***

    // 12.4 Expression Statement

    function parseExpressionStatement() {
        var expr = parseExpression();

        consumeSemicolon();

        return {
            type: Syntax.ExpressionStatement,
            expression: expr
    ***REMOVED***;
***REMOVED***

    // 12.5 If statement

    function parseIfStatement() {
        var test, consequent, alternate;

        expectKeyword('if');

        expect('(');

        test = parseExpression();

        expect(')');

        consequent = parseStatement();

        if (matchKeyword('else')) {
            lex();
            alternate = parseStatement();
    ***REMOVED*** else {
            alternate = null;
    ***REMOVED***

        return {
            type: Syntax.IfStatement,
            test: test,
            consequent: consequent,
            alternate: alternate
    ***REMOVED***;
***REMOVED***

    // 12.6 Iteration Statements

    function parseDoWhileStatement() {
        var body, test, oldInIteration;

        expectKeyword('do');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        if (match(';')) {
            lex();
    ***REMOVED***

        return {
            type: Syntax.DoWhileStatement,
            body: body,
            test: test
    ***REMOVED***;
***REMOVED***

    function parseWhileStatement() {
        var test, body, oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return {
            type: Syntax.WhileStatement,
            test: test,
            body: body
    ***REMOVED***;
***REMOVED***

    function parseForVariableDeclaration() {
        var token = lex();

        return {
            type: Syntax.VariableDeclaration,
            declarations: parseVariableDeclarationList(),
            kind: token.value
    ***REMOVED***;
***REMOVED***

    function parseForStatement() {
        var init, test, update, left, right, body, oldInIteration;

        init = test = update = null;

        expectKeyword('for');

        expect('(');

        if (match(';')) {
            lex();
    ***REMOVED*** else {
            if (matchKeyword('var') || matchKeyword('let')) {
                state.allowIn = false;
                init = parseForVariableDeclaration();
                state.allowIn = true;

                if (init.declarations.length === 1 && matchKeyword('in')) {
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
            ***REMOVED***
        ***REMOVED*** else {
                state.allowIn = false;
                init = parseExpression();
                state.allowIn = true;

                if (matchKeyword('in')) {
                    // LeftHandSideExpression
                    if (!isLeftHandSide(init)) {
                        throwError({***REMOVED***, Messages.InvalidLHSInForIn);
                ***REMOVED***

                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
            ***REMOVED***
        ***REMOVED***

            if (typeof left === 'undefined') {
                expect(';');
        ***REMOVED***
    ***REMOVED***

        if (typeof left === 'undefined') {

            if (!match(';')) {
                test = parseExpression();
        ***REMOVED***
            expect(';');

            if (!match(')')) {
                update = parseExpression();
        ***REMOVED***
    ***REMOVED***

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        if (typeof left === 'undefined') {
            return {
                type: Syntax.ForStatement,
                init: init,
                test: test,
                update: update,
                body: body
        ***REMOVED***;
    ***REMOVED***

        return {
            type: Syntax.ForInStatement,
            left: left,
            right: right,
            body: body,
            each: false
    ***REMOVED***;
***REMOVED***

    // 12.7 The continue statement

    function parseContinueStatement() {
        var token, label = null;

        expectKeyword('continue');

        // Optimize the most common form: 'continue;'.
        if (source[index] === ';') {
            lex();

            if (!state.inIteration) {
                throwError({***REMOVED***, Messages.IllegalContinue);
        ***REMOVED***

            return {
                type: Syntax.ContinueStatement,
                label: null
        ***REMOVED***;
    ***REMOVED***

        if (peekLineTerminator()) {
            if (!state.inIteration) {
                throwError({***REMOVED***, Messages.IllegalContinue);
        ***REMOVED***

            return {
                type: Syntax.ContinueStatement,
                label: null
        ***REMOVED***;
    ***REMOVED***

        token = lookahead();
        if (token.type === Token.Identifier) {
            label = parseVariableIdentifier();

            if (!Object.prototype.hasOwnProperty.call(state.labelSet, label.name)) {
                throwError({***REMOVED***, Messages.UnknownLabel, label.name);
        ***REMOVED***
    ***REMOVED***

        consumeSemicolon();

        if (label === null && !state.inIteration) {
            throwError({***REMOVED***, Messages.IllegalContinue);
    ***REMOVED***

        return {
            type: Syntax.ContinueStatement,
            label: label
    ***REMOVED***;
***REMOVED***

    // 12.8 The break statement

    function parseBreakStatement() {
        var token, label = null;

        expectKeyword('break');

        // Optimize the most common form: 'break;'.
        if (source[index] === ';') {
            lex();

            if (!(state.inIteration || state.inSwitch)) {
                throwError({***REMOVED***, Messages.IllegalBreak);
        ***REMOVED***

            return {
                type: Syntax.BreakStatement,
                label: null
        ***REMOVED***;
    ***REMOVED***

        if (peekLineTerminator()) {
            if (!(state.inIteration || state.inSwitch)) {
                throwError({***REMOVED***, Messages.IllegalBreak);
        ***REMOVED***

            return {
                type: Syntax.BreakStatement,
                label: null
        ***REMOVED***;
    ***REMOVED***

        token = lookahead();
        if (token.type === Token.Identifier) {
            label = parseVariableIdentifier();

            if (!Object.prototype.hasOwnProperty.call(state.labelSet, label.name)) {
                throwError({***REMOVED***, Messages.UnknownLabel, label.name);
        ***REMOVED***
    ***REMOVED***

        consumeSemicolon();

        if (label === null && !(state.inIteration || state.inSwitch)) {
            throwError({***REMOVED***, Messages.IllegalBreak);
    ***REMOVED***

        return {
            type: Syntax.BreakStatement,
            label: label
    ***REMOVED***;
***REMOVED***

    // 12.9 The return statement

    function parseReturnStatement() {
        var token, argument = null;

        expectKeyword('return');

        if (!state.inFunctionBody) {
            throwErrorTolerant({***REMOVED***, Messages.IllegalReturn);
    ***REMOVED***

        // 'return' followed by a space and an identifier is very common.
        if (source[index] === ' ') {
            if (isIdentifierStart(source[index + 1])) {
                argument = parseExpression();
                consumeSemicolon();
                return {
                    type: Syntax.ReturnStatement,
                    argument: argument
            ***REMOVED***;
        ***REMOVED***
    ***REMOVED***

        if (peekLineTerminator()) {
            return {
                type: Syntax.ReturnStatement,
                argument: null
        ***REMOVED***;
    ***REMOVED***

        if (!match(';')) {
            token = lookahead();
            if (!match('***REMOVED***') && token.type !== Token.EOF) {
                argument = parseExpression();
        ***REMOVED***
    ***REMOVED***

        consumeSemicolon();

        return {
            type: Syntax.ReturnStatement,
            argument: argument
    ***REMOVED***;
***REMOVED***

    // 12.10 The with statement

    function parseWithStatement() {
        var object, body;

        if (strict) {
            throwErrorTolerant({***REMOVED***, Messages.StrictModeWith);
    ***REMOVED***

        expectKeyword('with');

        expect('(');

        object = parseExpression();

        expect(')');

        body = parseStatement();

        return {
            type: Syntax.WithStatement,
            object: object,
            body: body
    ***REMOVED***;
***REMOVED***

    // 12.10 The swith statement

    function parseSwitchCase() {
        var test,
            consequent = [],
            statement;

        if (matchKeyword('default')) {
            lex();
            test = null;
    ***REMOVED*** else {
            expectKeyword('case');
            test = parseExpression();
    ***REMOVED***
        expect(':');

        while (index < length) {
            if (match('***REMOVED***') || matchKeyword('default') || matchKeyword('case')) {
                break;
        ***REMOVED***
            statement = parseStatement();
            if (typeof statement === 'undefined') {
                break;
        ***REMOVED***
            consequent.push(statement);
    ***REMOVED***

        return {
            type: Syntax.SwitchCase,
            test: test,
            consequent: consequent
    ***REMOVED***;
***REMOVED***

    function parseSwitchStatement() {
        var discriminant, cases, oldInSwitch;

        expectKeyword('switch');

        expect('(');

        discriminant = parseExpression();

        expect(')');

        expect('{');

        if (match('***REMOVED***')) {
            lex();
            return {
                type: Syntax.SwitchStatement,
                discriminant: discriminant
        ***REMOVED***;
    ***REMOVED***

        cases = [];

        oldInSwitch = state.inSwitch;
        state.inSwitch = true;

        while (index < length) {
            if (match('***REMOVED***')) {
                break;
        ***REMOVED***
            cases.push(parseSwitchCase());
    ***REMOVED***

        state.inSwitch = oldInSwitch;

        expect('***REMOVED***');

        return {
            type: Syntax.SwitchStatement,
            discriminant: discriminant,
            cases: cases
    ***REMOVED***;
***REMOVED***

    // 12.13 The throw statement

    function parseThrowStatement() {
        var argument;

        expectKeyword('throw');

        if (peekLineTerminator()) {
            throwError({***REMOVED***, Messages.NewlineAfterThrow);
    ***REMOVED***

        argument = parseExpression();

        consumeSemicolon();

        return {
            type: Syntax.ThrowStatement,
            argument: argument
    ***REMOVED***;
***REMOVED***

    // 12.14 The try statement

    function parseCatchClause() {
        var param;

        expectKeyword('catch');

        expect('(');
        if (!match(')')) {
            param = parseExpression();
            // 12.14.1
            if (strict && param.type === Syntax.Identifier && isRestrictedWord(param.name)) {
                throwErrorTolerant({***REMOVED***, Messages.StrictCatchVariable);
        ***REMOVED***
    ***REMOVED***
        expect(')');

        return {
            type: Syntax.CatchClause,
            param: param,
            guard: null,
            body: parseBlock()
    ***REMOVED***;
***REMOVED***

    function parseTryStatement() {
        var block, handlers = [], finalizer = null;

        expectKeyword('try');

        block = parseBlock();

        if (matchKeyword('catch')) {
            handlers.push(parseCatchClause());
    ***REMOVED***

        if (matchKeyword('finally')) {
            lex();
            finalizer = parseBlock();
    ***REMOVED***

        if (handlers.length === 0 && !finalizer) {
            throwError({***REMOVED***, Messages.NoCatchOrFinally);
    ***REMOVED***

        return {
            type: Syntax.TryStatement,
            block: block,
            handlers: handlers,
            finalizer: finalizer
    ***REMOVED***;
***REMOVED***

    // 12.15 The debugger statement

    function parseDebuggerStatement() {
        expectKeyword('debugger');

        consumeSemicolon();

        return {
            type: Syntax.DebuggerStatement
    ***REMOVED***;
***REMOVED***

    // 12 Statements

    function parseStatement() {
        var token = lookahead(),
            expr,
            labeledBody;

        if (token.type === Token.EOF) {
            throwUnexpected(token);
    ***REMOVED***

        if (token.type === Token.Punctuator) {
            switch (token.value) {
            case ';':
                return parseEmptyStatement();
            case '{':
                return parseBlock();
            case '(':
                return parseExpressionStatement();
            default:
                break;
        ***REMOVED***
    ***REMOVED***

        if (token.type === Token.Keyword) {
            switch (token.value) {
            case 'break':
                return parseBreakStatement();
            case 'continue':
                return parseContinueStatement();
            case 'debugger':
                return parseDebuggerStatement();
            case 'do':
                return parseDoWhileStatement();
            case 'for':
                return parseForStatement();
            case 'function':
                return parseFunctionDeclaration();
            case 'if':
                return parseIfStatement();
            case 'return':
                return parseReturnStatement();
            case 'switch':
                return parseSwitchStatement();
            case 'throw':
                return parseThrowStatement();
            case 'try':
                return parseTryStatement();
            case 'var':
                return parseVariableStatement();
            case 'while':
                return parseWhileStatement();
            case 'with':
                return parseWithStatement();
            default:
                break;
        ***REMOVED***
    ***REMOVED***

        expr = parseExpression();

        // 12.12 Labelled Statements
        if ((expr.type === Syntax.Identifier) && match(':')) {
            lex();

            if (Object.prototype.hasOwnProperty.call(state.labelSet, expr.name)) {
                throwError({***REMOVED***, Messages.Redeclaration, 'Label', expr.name);
        ***REMOVED***

            state.labelSet[expr.name] = true;
            labeledBody = parseStatement();
            delete state.labelSet[expr.name];

            return {
                type: Syntax.LabeledStatement,
                label: expr,
                body: labeledBody
        ***REMOVED***;
    ***REMOVED***

        consumeSemicolon();

        return {
            type: Syntax.ExpressionStatement,
            expression: expr
    ***REMOVED***;
***REMOVED***

    // 13 Function Definition

    function parseFunctionSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted,
            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody;

        expect('{');

        while (index < length) {
            token = lookahead();
            if (token.type !== Token.StringLiteral) {
                break;
        ***REMOVED***

            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
        ***REMOVED***
            directive = sliceSource(token.range[0] + 1, token.range[1] - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    throwError(firstRestricted, Messages.StrictOctalLiteral);
            ***REMOVED***
        ***REMOVED*** else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        oldLabelSet = state.labelSet;
        oldInIteration = state.inIteration;
        oldInSwitch = state.inSwitch;
        oldInFunctionBody = state.inFunctionBody;

        state.labelSet = {***REMOVED***;
        state.inIteration = false;
        state.inSwitch = false;
        state.inFunctionBody = true;

        while (index < length) {
            if (match('***REMOVED***')) {
                break;
        ***REMOVED***
            sourceElement = parseSourceElement();
            if (typeof sourceElement === 'undefined') {
                break;
        ***REMOVED***
            sourceElements.push(sourceElement);
    ***REMOVED***

        expect('***REMOVED***');

        state.labelSet = oldLabelSet;
        state.inIteration = oldInIteration;
        state.inSwitch = oldInSwitch;
        state.inFunctionBody = oldInFunctionBody;

        return {
            type: Syntax.BlockStatement,
            body: sourceElements
    ***REMOVED***;
***REMOVED***

    function parseFunctionDeclaration() {
        var id, param, params = [], body, token, firstRestricted, message, previousStrict, paramSet;

        expectKeyword('function');
        token = lookahead();
        id = parseVariableIdentifier();
        if (strict) {
            if (isRestrictedWord(token.value)) {
                throwError(token, Messages.StrictFunctionName);
        ***REMOVED***
    ***REMOVED*** else {
            if (isRestrictedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictFunctionName;
        ***REMOVED*** else if (isStrictModeReservedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictReservedWord;
        ***REMOVED***
    ***REMOVED***

        expect('(');

        if (!match(')')) {
            paramSet = {***REMOVED***;
            while (index < length) {
                token = lookahead();
                param = parseVariableIdentifier();
                if (strict) {
                    if (isRestrictedWord(token.value)) {
                        throwError(token, Messages.StrictParamName);
                ***REMOVED***
                    if (Object.prototype.hasOwnProperty.call(paramSet, token.value)) {
                        throwError(token, Messages.StrictParamDupe);
                ***REMOVED***
            ***REMOVED*** else if (!firstRestricted) {
                    if (isRestrictedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamName;
                ***REMOVED*** else if (isStrictModeReservedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictReservedWord;
                ***REMOVED*** else if (Object.prototype.hasOwnProperty.call(paramSet, token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamDupe;
                ***REMOVED***
            ***REMOVED***
                params.push(param);
                paramSet[param.name] = true;
                if (match(')')) {
                    break;
            ***REMOVED***
                expect(',');
        ***REMOVED***
    ***REMOVED***

        expect(')');

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwError(firstRestricted, message);
    ***REMOVED***
        strict = previousStrict;

        return {
            type: Syntax.FunctionDeclaration,
            id: id,
            params: params,
            body: body
    ***REMOVED***;
***REMOVED***

    function parseFunctionExpression() {
        var token, id = null, firstRestricted, message, param, params = [], body, previousStrict, paramSet;

        expectKeyword('function');

        if (!match('(')) {
            token = lookahead();
            id = parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    throwError(token, Messages.StrictFunctionName);
            ***REMOVED***
        ***REMOVED*** else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
            ***REMOVED*** else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        expect('(');

        if (!match(')')) {
            paramSet = {***REMOVED***;
            while (index < length) {
                token = lookahead();
                param = parseVariableIdentifier();
                if (strict) {
                    if (isRestrictedWord(token.value)) {
                        throwError(token, Messages.StrictParamName);
                ***REMOVED***
                    if (Object.prototype.hasOwnProperty.call(paramSet, token.value)) {
                        throwError(token, Messages.StrictParamDupe);
                ***REMOVED***
            ***REMOVED*** else if (!firstRestricted) {
                    if (isRestrictedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamName;
                ***REMOVED*** else if (isStrictModeReservedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictReservedWord;
                ***REMOVED*** else if (Object.prototype.hasOwnProperty.call(paramSet, token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamDupe;
                ***REMOVED***
            ***REMOVED***
                params.push(param);
                paramSet[param.name] = true;
                if (match(')')) {
                    break;
            ***REMOVED***
                expect(',');
        ***REMOVED***
    ***REMOVED***

        expect(')');

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwError(firstRestricted, message);
    ***REMOVED***
        strict = previousStrict;

        return {
            type: Syntax.FunctionExpression,
            id: id,
            params: params,
            body: body
    ***REMOVED***;
***REMOVED***

    // 14 Program

    function parseSourceElement() {
        var token = lookahead();

        if (token.type === Token.Keyword) {
            switch (token.value) {
            case 'const':
            case 'let':
                return parseConstLetDeclaration(token.value);
            case 'function':
                return parseFunctionDeclaration();
            default:
                return parseStatement();
        ***REMOVED***
    ***REMOVED***

        if (token.type !== Token.EOF) {
            return parseStatement();
    ***REMOVED***
***REMOVED***

    function parseSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted;

        while (index < length) {
            token = lookahead();
            if (token.type !== Token.StringLiteral) {
                break;
        ***REMOVED***

            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
        ***REMOVED***
            directive = sliceSource(token.range[0] + 1, token.range[1] - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    throwError(firstRestricted, Messages.StrictOctalLiteral);
            ***REMOVED***
        ***REMOVED*** else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        while (index < length) {
            sourceElement = parseSourceElement();
            if (typeof sourceElement === 'undefined') {
                break;
        ***REMOVED***
            sourceElements.push(sourceElement);
    ***REMOVED***
        return sourceElements;
***REMOVED***

    function parseProgram() {
        var program;
        strict = false;
        program = {
            type: Syntax.Program,
            body: parseSourceElements()
    ***REMOVED***;
        return program;
***REMOVED***

    // The following functions are needed only when the option to preserve
    // the comments is active.

    function addComment(start, end, type, value) {
        assert(typeof start === 'number', 'Comment must have valid position');

        // Because the way the actual token is scanned, often the comments
        // (if any) are skipped twice during the lexical analysis.
        // Thus, we need to skip adding a comment if the comment array already
        // handled it.
        if (extra.comments.length > 0) {
            if (extra.comments[extra.comments.length - 1].range[1] > start) {
                return;
        ***REMOVED***
    ***REMOVED***

        extra.comments.push({
            range: [start, end],
            type: type,
            value: value
    ***REMOVED***);
***REMOVED***

    function scanComment() {
        var comment, ch, start, blockComment, lineComment;

        comment = '';
        blockComment = false;
        lineComment = false;

        while (index < length) {
            ch = source[index];

            if (lineComment) {
                ch = nextChar();
                if (index >= length) {
                    lineComment = false;
                    comment += ch;
                    addComment(start, index, 'Line', comment);
            ***REMOVED*** else if (isLineTerminator(ch)) {
                    lineComment = false;
                    addComment(start, index, 'Line', comment);
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                ***REMOVED***
                    ++lineNumber;
                    lineStart = index;
                    comment = '';
            ***REMOVED*** else {
                    comment += ch;
            ***REMOVED***
        ***REMOVED*** else if (blockComment) {
                if (isLineTerminator(ch)) {
                    if (ch === '\r' && source[index + 1] === '\n') {
                        ++index;
                        comment += '\r\n';
                ***REMOVED*** else {
                        comment += ch;
                ***REMOVED***
                    ++lineNumber;
                    ++index;
                    lineStart = index;
                    if (index >= length) {
                        throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                ***REMOVED***
            ***REMOVED*** else {
                    ch = nextChar();
                    if (index >= length) {
                        throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                ***REMOVED***
                    comment += ch;
                    if (ch === '*') {
                        ch = source[index];
                        if (ch === '/') {
                            comment = comment.substr(0, comment.length - 1);
                            blockComment = false;
                            ++index;
                            addComment(start, index, 'Block', comment);
                            comment = '';
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED*** else if (ch === '/') {
                ch = source[index + 1];
                if (ch === '/') {
                    start = index;
                    index += 2;
                    lineComment = true;
            ***REMOVED*** else if (ch === '*') {
                    start = index;
                    index += 2;
                    blockComment = true;
                    if (index >= length) {
                        throwError({***REMOVED***, Messages.UnexpectedToken, 'ILLEGAL');
                ***REMOVED***
            ***REMOVED*** else {
                    break;
            ***REMOVED***
        ***REMOVED*** else if (isWhiteSpace(ch)) {
                ++index;
        ***REMOVED*** else if (isLineTerminator(ch)) {
                ++index;
                if (ch ===  '\r' && source[index] === '\n') {
                    ++index;
            ***REMOVED***
                ++lineNumber;
                lineStart = index;
        ***REMOVED*** else {
                break;
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    function collectToken() {
        var token = extra.advance(),
            range,
            value;

        if (token.type !== Token.EOF) {
            range = [token.range[0], token.range[1]];
            value = sliceSource(token.range[0], token.range[1]);
            extra.tokens.push({
                type: TokenName[token.type],
                value: value,
                range: range
        ***REMOVED***);
    ***REMOVED***

        return token;
***REMOVED***

    function collectRegex() {
        var pos, regex, token;

        skipComment();

        pos = index;
        regex = extra.scanRegExp();

        // Pop the previous token, which is likely '/' or '/='
        if (extra.tokens.length > 0) {
            token = extra.tokens[extra.tokens.length - 1];
            if (token.range[0] === pos && token.type === 'Punctuator') {
                if (token.value === '/' || token.value === '/=') {
                    extra.tokens.pop();
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        extra.tokens.push({
            type: 'RegularExpression',
            value: regex.literal,
            range: [pos, index]
    ***REMOVED***);

        return regex;
***REMOVED***

    function createLiteral(token) {
        return {
            type: Syntax.Literal,
            value: token.value
    ***REMOVED***;
***REMOVED***

    function createRawLiteral(token) {
        return {
            type: Syntax.Literal,
            value: token.value,
            raw: sliceSource(token.range[0], token.range[1])
    ***REMOVED***;
***REMOVED***

    function wrapTrackingFunction(range, loc) {

        return function (parseFunction) {

            function isBinary(node) {
                return node.type === Syntax.LogicalExpression ||
                    node.type === Syntax.BinaryExpression;
        ***REMOVED***

            function visit(node) {
                if (isBinary(node.left)) {
                    visit(node.left);
            ***REMOVED***
                if (isBinary(node.right)) {
                    visit(node.right);
            ***REMOVED***

                if (range && typeof node.range === 'undefined') {
                    node.range = [node.left.range[0], node.right.range[1]];
            ***REMOVED***
                if (loc && typeof node.loc === 'undefined') {
                    node.loc = {
                        start: node.left.loc.start,
                        end: node.right.loc.end
                ***REMOVED***;
            ***REMOVED***
        ***REMOVED***

            return function () {
                var node, rangeInfo, locInfo;

                skipComment();
                rangeInfo = [index, 0];
                locInfo = {
                    start: {
                        line: lineNumber,
                        column: index - lineStart
                ***REMOVED***
            ***REMOVED***;

                node = parseFunction.apply(null, arguments);
                if (typeof node !== 'undefined') {

                    if (range) {
                        rangeInfo[1] = index;
                        node.range = rangeInfo;
                ***REMOVED***

                    if (loc) {
                        locInfo.end = {
                            line: lineNumber,
                            column: index - lineStart
                    ***REMOVED***;
                        node.loc = locInfo;
                ***REMOVED***

                    if (isBinary(node)) {
                        visit(node);
                ***REMOVED***

                    if (node.type === Syntax.MemberExpression) {
                        if (typeof node.object.range !== 'undefined') {
                            node.range[0] = node.object.range[0];
                    ***REMOVED***
                        if (typeof node.object.loc !== 'undefined') {
                            node.loc.start = node.object.loc.start;
                    ***REMOVED***
                ***REMOVED***

                    if (node.type === Syntax.CallExpression) {
                        if (typeof node.callee.range !== 'undefined') {
                            node.range[0] = node.callee.range[0];
                    ***REMOVED***
                        if (typeof node.callee.loc !== 'undefined') {
                            node.loc.start = node.callee.loc.start;
                    ***REMOVED***
                ***REMOVED***
                    return node;
            ***REMOVED***
        ***REMOVED***;

    ***REMOVED***;
***REMOVED***

    function patch() {

        var wrapTracking;

        if (extra.comments) {
            extra.skipComment = skipComment;
            skipComment = scanComment;
    ***REMOVED***

        if (extra.raw) {
            extra.createLiteral = createLiteral;
            createLiteral = createRawLiteral;
    ***REMOVED***

        if (extra.range || extra.loc) {

            wrapTracking = wrapTrackingFunction(extra.range, extra.loc);

            extra.parseAdditiveExpression = parseAdditiveExpression;
            extra.parseAssignmentExpression = parseAssignmentExpression;
            extra.parseBitwiseANDExpression = parseBitwiseANDExpression;
            extra.parseBitwiseORExpression = parseBitwiseORExpression;
            extra.parseBitwiseXORExpression = parseBitwiseXORExpression;
            extra.parseBlock = parseBlock;
            extra.parseFunctionSourceElements = parseFunctionSourceElements;
            extra.parseCallMember = parseCallMember;
            extra.parseCatchClause = parseCatchClause;
            extra.parseComputedMember = parseComputedMember;
            extra.parseConditionalExpression = parseConditionalExpression;
            extra.parseConstLetDeclaration = parseConstLetDeclaration;
            extra.parseEqualityExpression = parseEqualityExpression;
            extra.parseExpression = parseExpression;
            extra.parseForVariableDeclaration = parseForVariableDeclaration;
            extra.parseFunctionDeclaration = parseFunctionDeclaration;
            extra.parseFunctionExpression = parseFunctionExpression;
            extra.parseLogicalANDExpression = parseLogicalANDExpression;
            extra.parseLogicalORExpression = parseLogicalORExpression;
            extra.parseMultiplicativeExpression = parseMultiplicativeExpression;
            extra.parseNewExpression = parseNewExpression;
            extra.parseNonComputedMember = parseNonComputedMember;
            extra.parseNonComputedProperty = parseNonComputedProperty;
            extra.parseObjectProperty = parseObjectProperty;
            extra.parseObjectPropertyKey = parseObjectPropertyKey;
            extra.parsePostfixExpression = parsePostfixExpression;
            extra.parsePrimaryExpression = parsePrimaryExpression;
            extra.parseProgram = parseProgram;
            extra.parsePropertyFunction = parsePropertyFunction;
            extra.parseRelationalExpression = parseRelationalExpression;
            extra.parseStatement = parseStatement;
            extra.parseShiftExpression = parseShiftExpression;
            extra.parseSwitchCase = parseSwitchCase;
            extra.parseUnaryExpression = parseUnaryExpression;
            extra.parseVariableDeclaration = parseVariableDeclaration;
            extra.parseVariableIdentifier = parseVariableIdentifier;

            parseAdditiveExpression = wrapTracking(extra.parseAdditiveExpression);
            parseAssignmentExpression = wrapTracking(extra.parseAssignmentExpression);
            parseBitwiseANDExpression = wrapTracking(extra.parseBitwiseANDExpression);
            parseBitwiseORExpression = wrapTracking(extra.parseBitwiseORExpression);
            parseBitwiseXORExpression = wrapTracking(extra.parseBitwiseXORExpression);
            parseBlock = wrapTracking(extra.parseBlock);
            parseFunctionSourceElements = wrapTracking(extra.parseFunctionSourceElements);
            parseCallMember = wrapTracking(extra.parseCallMember);
            parseCatchClause = wrapTracking(extra.parseCatchClause);
            parseComputedMember = wrapTracking(extra.parseComputedMember);
            parseConditionalExpression = wrapTracking(extra.parseConditionalExpression);
            parseConstLetDeclaration = wrapTracking(extra.parseConstLetDeclaration);
            parseEqualityExpression = wrapTracking(extra.parseEqualityExpression);
            parseExpression = wrapTracking(extra.parseExpression);
            parseForVariableDeclaration = wrapTracking(extra.parseForVariableDeclaration);
            parseFunctionDeclaration = wrapTracking(extra.parseFunctionDeclaration);
            parseFunctionExpression = wrapTracking(extra.parseFunctionExpression);
            parseLogicalANDExpression = wrapTracking(extra.parseLogicalANDExpression);
            parseLogicalORExpression = wrapTracking(extra.parseLogicalORExpression);
            parseMultiplicativeExpression = wrapTracking(extra.parseMultiplicativeExpression);
            parseNewExpression = wrapTracking(extra.parseNewExpression);
            parseNonComputedMember = wrapTracking(extra.parseNonComputedMember);
            parseNonComputedProperty = wrapTracking(extra.parseNonComputedProperty);
            parseObjectProperty = wrapTracking(extra.parseObjectProperty);
            parseObjectPropertyKey = wrapTracking(extra.parseObjectPropertyKey);
            parsePostfixExpression = wrapTracking(extra.parsePostfixExpression);
            parsePrimaryExpression = wrapTracking(extra.parsePrimaryExpression);
            parseProgram = wrapTracking(extra.parseProgram);
            parsePropertyFunction = wrapTracking(extra.parsePropertyFunction);
            parseRelationalExpression = wrapTracking(extra.parseRelationalExpression);
            parseStatement = wrapTracking(extra.parseStatement);
            parseShiftExpression = wrapTracking(extra.parseShiftExpression);
            parseSwitchCase = wrapTracking(extra.parseSwitchCase);
            parseUnaryExpression = wrapTracking(extra.parseUnaryExpression);
            parseVariableDeclaration = wrapTracking(extra.parseVariableDeclaration);
            parseVariableIdentifier = wrapTracking(extra.parseVariableIdentifier);
    ***REMOVED***

        if (typeof extra.tokens !== 'undefined') {
            extra.advance = advance;
            extra.scanRegExp = scanRegExp;

            advance = collectToken;
            scanRegExp = collectRegex;
    ***REMOVED***
***REMOVED***

    function unpatch() {
        if (typeof extra.skipComment === 'function') {
            skipComment = extra.skipComment;
    ***REMOVED***

        if (extra.raw) {
            createLiteral = extra.createLiteral;
    ***REMOVED***

        if (extra.range || extra.loc) {
            parseAdditiveExpression = extra.parseAdditiveExpression;
            parseAssignmentExpression = extra.parseAssignmentExpression;
            parseBitwiseANDExpression = extra.parseBitwiseANDExpression;
            parseBitwiseORExpression = extra.parseBitwiseORExpression;
            parseBitwiseXORExpression = extra.parseBitwiseXORExpression;
            parseBlock = extra.parseBlock;
            parseFunctionSourceElements = extra.parseFunctionSourceElements;
            parseCallMember = extra.parseCallMember;
            parseCatchClause = extra.parseCatchClause;
            parseComputedMember = extra.parseComputedMember;
            parseConditionalExpression = extra.parseConditionalExpression;
            parseConstLetDeclaration = extra.parseConstLetDeclaration;
            parseEqualityExpression = extra.parseEqualityExpression;
            parseExpression = extra.parseExpression;
            parseForVariableDeclaration = extra.parseForVariableDeclaration;
            parseFunctionDeclaration = extra.parseFunctionDeclaration;
            parseFunctionExpression = extra.parseFunctionExpression;
            parseLogicalANDExpression = extra.parseLogicalANDExpression;
            parseLogicalORExpression = extra.parseLogicalORExpression;
            parseMultiplicativeExpression = extra.parseMultiplicativeExpression;
            parseNewExpression = extra.parseNewExpression;
            parseNonComputedMember = extra.parseNonComputedMember;
            parseNonComputedProperty = extra.parseNonComputedProperty;
            parseObjectProperty = extra.parseObjectProperty;
            parseObjectPropertyKey = extra.parseObjectPropertyKey;
            parsePrimaryExpression = extra.parsePrimaryExpression;
            parsePostfixExpression = extra.parsePostfixExpression;
            parseProgram = extra.parseProgram;
            parsePropertyFunction = extra.parsePropertyFunction;
            parseRelationalExpression = extra.parseRelationalExpression;
            parseStatement = extra.parseStatement;
            parseShiftExpression = extra.parseShiftExpression;
            parseSwitchCase = extra.parseSwitchCase;
            parseUnaryExpression = extra.parseUnaryExpression;
            parseVariableDeclaration = extra.parseVariableDeclaration;
            parseVariableIdentifier = extra.parseVariableIdentifier;
    ***REMOVED***

        if (typeof extra.scanRegExp === 'function') {
            advance = extra.advance;
            scanRegExp = extra.scanRegExp;
    ***REMOVED***
***REMOVED***

    function stringToArray(str) {
        var length = str.length,
            result = [],
            i;
        for (i = 0; i < length; ++i) {
            result[i] = str.charAt(i);
    ***REMOVED***
        return result;
***REMOVED***

    function parse(code, options) {
        var program, toString;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
    ***REMOVED***

        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        length = source.length;
        buffer = null;
        state = {
            allowIn: true,
            labelSet: {***REMOVED***,
            lastParenthesized: null,
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false
    ***REMOVED***;

        extra = {***REMOVED***;
        if (typeof options !== 'undefined') {
            extra.range = (typeof options.range === 'boolean') && options.range;
            extra.loc = (typeof options.loc === 'boolean') && options.loc;
            extra.raw = (typeof options.raw === 'boolean') && options.raw;
            if (typeof options.tokens === 'boolean' && options.tokens) {
                extra.tokens = [];
        ***REMOVED***
            if (typeof options.comment === 'boolean' && options.comment) {
                extra.comments = [];
        ***REMOVED***
            if (typeof options.tolerant === 'boolean' && options.tolerant) {
                extra.errors = [];
        ***REMOVED***
    ***REMOVED***

        if (length > 0) {
            if (typeof source[0] === 'undefined') {
                // Try first to convert to a string. This is good as fast path
                // for old IE which understands string indexing for string
                // literals only and not for string object.
                if (code instanceof String) {
                    source = code.valueOf();
            ***REMOVED***

                // Force accessing the characters via an array.
                if (typeof source[0] === 'undefined') {
                    source = stringToArray(code);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        patch();
        try {
            program = parseProgram();
            if (typeof extra.comments !== 'undefined') {
                program.comments = extra.comments;
        ***REMOVED***
            if (typeof extra.tokens !== 'undefined') {
                program.tokens = extra.tokens;
        ***REMOVED***
            if (typeof extra.errors !== 'undefined') {
                program.errors = extra.errors;
        ***REMOVED***
    ***REMOVED*** catch (e) {
            throw e;
    ***REMOVED*** finally {
            unpatch();
            extra = {***REMOVED***;
    ***REMOVED***

        return program;
***REMOVED***

    // Sync with package.json.
    exports.version = '1.0.0-dev';

    exports.parse = parse;

    // Deep copy.
    exports.Syntax = (function () {
        var name, types = {***REMOVED***;

        if (typeof Object.create === 'function') {
            types = Object.create(null);
    ***REMOVED***

        for (name in Syntax) {
            if (Syntax.hasOwnProperty(name)) {
                types[name] = Syntax[name];
        ***REMOVED***
    ***REMOVED***

        if (typeof Object.freeze === 'function') {
            Object.freeze(types);
    ***REMOVED***

        return types;
***REMOVED***());

***REMOVED***(typeof exports === 'undefined' ? (esprima = {***REMOVED***) : exports));
/* vim: set sw=4 ts=4 et tw=80 : */

***REMOVED***);define('uglifyjs/consolidator', ["require", "exports", "module", "./parse-js", "./process"], function(require, exports, module) {
/**
 * @preserve Copyright 2012 Robert Gust-Bardon <http://robert.gust-bardon.org/>.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *     * Redistributions of source code must retain the above
 *       copyright notice, this list of conditions and the following
 *       disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above
 *       copyright notice, this list of conditions and the following
 *       disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
 * THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

/**
 * @fileoverview Enhances <a href="https://github.com/mishoo/UglifyJS/"
 * >UglifyJS</a> with consolidation of null, Boolean, and String values.
 * <p>Also known as aliasing, this feature has been deprecated in <a href=
 * "http://closure-compiler.googlecode.com/">the Closure Compiler</a> since its
 * initial release, where it is unavailable from the <abbr title=
 * "command line interface">CLI</a>. The Closure Compiler allows one to log and
 * influence this process. In contrast, this implementation does not introduce
 * any variable declarations in global code and derives String values from
 * identifier names used as property accessors.</p>
 * <p>Consolidating literals may worsen the data compression ratio when an <a
 * href="http://tools.ietf.org/html/rfc2616#section-3.5">encoding
 * transformation</a> is applied. For instance, <a href=
 * "http://code.jquery.com/jquery-1.7.1.js">jQuery 1.7.1</a> takes 248235 bytes.
 * Building it with <a href="https://github.com/mishoo/UglifyJS/tarball/v1.2.5">
 * UglifyJS v1.2.5</a> results in 93647 bytes (37.73% of the original) which are
 * then compressed to 33154 bytes (13.36% of the original) using <a href=
 * "http://linux.die.net/man/1/gzip">gzip(1)</a>. Building it with the same
 * version of UglifyJS 1.2.5 patched with the implementation of consolidation
 * results in 80784 bytes (a decrease of 12863 bytes, i.e. 13.74%, in comparison
 * to the aforementioned 93647 bytes) which are then compressed to 34013 bytes
 * (an increase of 859 bytes, i.e. 2.59%, in comparison to the aforementioned
 * 33154 bytes).</p>
 * <p>Written in <a href="http://es5.github.com/#x4.2.2">the strict variant</a>
 * of <a href="http://es5.github.com/">ECMA-262 5.1 Edition</a>. Encoded in <a
 * href="http://tools.ietf.org/html/rfc3629">UTF-8</a>. Follows <a href=
 * "http://google-styleguide.googlecode.com/svn-history/r76/trunk/javascriptguide.xml"
 * >Revision 2.28 of the Google JavaScript Style Guide</a> (except for the
 * discouraged use of the {@code function***REMOVED*** tag and the {@code namespace***REMOVED*** tag).
 * 100% typed for the <a href=
 * "http://closure-compiler.googlecode.com/files/compiler-20120123.tar.gz"
 * >Closure Compiler Version 1741</a>.</p>
 * <p>Should you find this software useful, please consider <a href=
 * "https://paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JZLW72X8FD4WG"
 * >a donation</a>.</p>
 * @author follow.me@RGustBardon (Robert Gust-Bardon)
 * @supported Tested with:
 *     <ul>
 *     <li><a href="http://nodejs.org/dist/v0.6.10/">Node v0.6.10</a>,</li>
 *     <li><a href="https://github.com/mishoo/UglifyJS/tarball/v1.2.5">UglifyJS
 *       v1.2.5</a>.</li>
 *     </ul>
 */

/*global console:false, exports:true, module:false, require:false */
/*jshint sub:true */
/**
 * Consolidates null, Boolean, and String values found inside an <abbr title=
 * "abstract syntax tree">AST</abbr>.
 * @param {!TSyntacticCodeUnit***REMOVED*** oAbstractSyntaxTree An array-like object
 *     representing an <abbr title="abstract syntax tree">AST</abbr>.
 * @return {!TSyntacticCodeUnit***REMOVED*** An array-like object representing an <abbr
 *     title="abstract syntax tree">AST</abbr> with its null, Boolean, and
 *     String values consolidated.
 */
// TODO(user) Consolidation of mathematical values found in numeric literals.
// TODO(user) Unconsolidation.
// TODO(user) Consolidation of ECMA-262 6th Edition programs.
// TODO(user) Rewrite in ECMA-262 6th Edition.
exports['ast_consolidate'] = function(oAbstractSyntaxTree) {
  'use strict';
  /*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true,
        latedef:true, newcap:true, noarge:true, noempty:true, nonew:true,
        onevar:true, plusplus:true, regexp:true, undef:true, strict:true,
        sub:false, trailing:true */

  var _,
      /**
       * A record consisting of data about one or more source elements.
       * @constructor
       * @nosideeffects
       */
      TSourceElementsData = function() {
        /**
         * The category of the elements.
         * @type {number***REMOVED***
         * @see ESourceElementCategories
         */
        this.nCategory = ESourceElementCategories.N_OTHER;
        /**
         * The number of occurrences (within the elements) of each primitive
         * value that could be consolidated.
         * @type {!Array.<!Object.<string, number>>***REMOVED***
         */
        this.aCount = [];
        this.aCount[EPrimaryExpressionCategories.N_IDENTIFIER_NAMES] = {***REMOVED***;
        this.aCount[EPrimaryExpressionCategories.N_STRING_LITERALS] = {***REMOVED***;
        this.aCount[EPrimaryExpressionCategories.N_NULL_AND_BOOLEAN_LITERALS] =
            {***REMOVED***;
        /**
         * Identifier names found within the elements.
         * @type {!Array.<string>***REMOVED***
         */
        this.aIdentifiers = [];
        /**
         * Prefixed representation Strings of each primitive value that could be
         * consolidated within the elements.
         * @type {!Array.<string>***REMOVED***
         */
        this.aPrimitiveValues = [];
    ***REMOVED***
      /**
       * A record consisting of data about a primitive value that could be
       * consolidated.
       * @constructor
       * @nosideeffects
       */
      TPrimitiveValue = function() {
        /**
         * The difference in the number of terminal symbols between the original
         * source text and the one with the primitive value consolidated. If the
         * difference is positive, the primitive value is considered worthwhile.
         * @type {number***REMOVED***
         */
        this.nSaving = 0;
        /**
         * An identifier name of the variable that will be declared and assigned
         * the primitive value if the primitive value is consolidated.
         * @type {string***REMOVED***
         */
        this.sName = '';
    ***REMOVED***
      /**
       * A record consisting of data on what to consolidate within the range of
       * source elements that is currently being considered.
       * @constructor
       * @nosideeffects
       */
      TSolution = function() {
        /**
         * An object whose keys are prefixed representation Strings of each
         * primitive value that could be consolidated within the elements and
         * whose values are corresponding data about those primitive values.
         * @type {!Object.<string, {nSaving: number, sName: string***REMOVED***>***REMOVED***
         * @see TPrimitiveValue
         */
        this.oPrimitiveValues = {***REMOVED***;
        /**
         * The difference in the number of terminal symbols between the original
         * source text and the one with all the worthwhile primitive values
         * consolidated.
         * @type {number***REMOVED***
         * @see TPrimitiveValue#nSaving
         */
        this.nSavings = 0;
    ***REMOVED***
      /**
       * The processor of <abbr title="abstract syntax tree">AST</abbr>s found
       * in UglifyJS.
       * @namespace
       * @type {!TProcessor***REMOVED***
       */
      oProcessor = (/** @type {!TProcessor***REMOVED*** */ require('./process')),
      /**
       * A record consisting of a number of constants that represent the
       * difference in the number of terminal symbols between a source text with
       * a modified syntactic code unit and the original one.
       * @namespace
       * @type {!Object.<string, number>***REMOVED***
       */
      oWeights = {
        /**
         * The difference in the number of punctuators required by the bracket
         * notation and the dot notation.
         * <p><code>'[]'.length - '.'.length</code></p>
         * @const
         * @type {number***REMOVED***
         */
        N_PROPERTY_ACCESSOR: 1,
        /**
         * The number of punctuators required by a variable declaration with an
         * initialiser.
         * <p><code>':'.length + ';'.length</code></p>
         * @const
         * @type {number***REMOVED***
         */
        N_VARIABLE_DECLARATION: 2,
        /**
         * The number of terminal symbols required to introduce a variable
         * statement (excluding its variable declaration list).
         * <p><code>'var '.length</code></p>
         * @const
         * @type {number***REMOVED***
         */
        N_VARIABLE_STATEMENT_AFFIXATION: 4,
        /**
         * The number of terminal symbols needed to enclose source elements
         * within a function call with no argument values to a function with an
         * empty parameter list.
         * <p><code>'(function(){***REMOVED***());'.length</code></p>
         * @const
         * @type {number***REMOVED***
         */
        N_CLOSURE: 17
    ***REMOVED***
      /**
       * Categories of primary expressions from which primitive values that
       * could be consolidated are derivable.
       * @namespace
       * @enum {number***REMOVED***
       */
      EPrimaryExpressionCategories = {
        /**
         * Identifier names used as property accessors.
         * @type {number***REMOVED***
         */
        N_IDENTIFIER_NAMES: 0,
        /**
         * String literals.
         * @type {number***REMOVED***
         */
        N_STRING_LITERALS: 1,
        /**
         * Null and Boolean literals.
         * @type {number***REMOVED***
         */
        N_NULL_AND_BOOLEAN_LITERALS: 2
    ***REMOVED***
      /**
       * Prefixes of primitive values that could be consolidated.
       * The String values of the prefixes must have same number of characters.
       * The prefixes must not be used in any properties defined in any version
       * of <a href=
       * "http://www.ecma-international.org/publications/standards/Ecma-262.htm"
       * >ECMA-262</a>.
       * @namespace
       * @enum {string***REMOVED***
       */
      EValuePrefixes = {
        /**
         * Identifies String values.
         * @type {string***REMOVED***
         */
        S_STRING: '#S',
        /**
         * Identifies null and Boolean values.
         * @type {string***REMOVED***
         */
        S_SYMBOLIC: '#O'
    ***REMOVED***
      /**
       * Categories of source elements in terms of their appropriateness of
       * having their primitive values consolidated.
       * @namespace
       * @enum {number***REMOVED***
       */
      ESourceElementCategories = {
        /**
         * Identifies a source element that includes the <a href=
         * "http://es5.github.com/#x12.10">{@code with***REMOVED***</a> statement.
         * @type {number***REMOVED***
         */
        N_WITH: 0,
        /**
         * Identifies a source element that includes the <a href=
         * "http://es5.github.com/#x15.1.2.1">{@code eval***REMOVED***</a> identifier name.
         * @type {number***REMOVED***
         */
        N_EVAL: 1,
        /**
         * Identifies a source element that must be excluded from the process
         * unless its whole scope is examined.
         * @type {number***REMOVED***
         */
        N_EXCLUDABLE: 2,
        /**
         * Identifies source elements not posing any problems.
         * @type {number***REMOVED***
         */
        N_OTHER: 3
    ***REMOVED***
      /**
       * The list of literals (other than the String ones) whose primitive
       * values can be consolidated.
       * @const
       * @type {!Array.<string>***REMOVED***
       */
      A_OTHER_SUBSTITUTABLE_LITERALS = [
        'null',   // The null literal.
        'false',  // The Boolean literal {@code false***REMOVED***.
        'true'    // The Boolean literal {@code true***REMOVED***.
      ];

  (/**
    * Consolidates all worthwhile primitive values in a syntactic code unit.
    * @param {!TSyntacticCodeUnit***REMOVED*** oSyntacticCodeUnit An array-like object
    *     representing the branch of the abstract syntax tree representing the
    *     syntactic code unit along with its scope.
    * @see TPrimitiveValue#nSaving
    */
   function fExamineSyntacticCodeUnit(oSyntacticCodeUnit) {
     var _,
         /**
          * Indicates whether the syntactic code unit represents global code.
          * @type {boolean***REMOVED***
          */
         bIsGlobal = 'toplevel' === oSyntacticCodeUnit[0],
         /**
          * Indicates whether the whole scope is being examined.
          * @type {boolean***REMOVED***
          */
         bIsWhollyExaminable = !bIsGlobal,
         /**
          * An array-like object representing source elements that constitute a
          * syntactic code unit.
          * @type {!TSyntacticCodeUnit***REMOVED***
          */
         oSourceElements,
         /**
          * A record consisting of data about the source element that is
          * currently being examined.
          * @type {!TSourceElementsData***REMOVED***
          */
         oSourceElementData,
         /**
          * The scope of the syntactic code unit.
          * @type {!TScope***REMOVED***
          */
         oScope,
         /**
          * An instance of an object that allows the traversal of an <abbr
          * title="abstract syntax tree">AST</abbr>.
          * @type {!TWalker***REMOVED***
          */
         oWalker,
         /**
          * An object encompassing collections of functions used during the
          * traversal of an <abbr title="abstract syntax tree">AST</abbr>.
          * @namespace
          * @type {!Object.<string, !Object.<string, function(...[*])>>***REMOVED***
          */
         oWalkers = {
           /**
            * A collection of functions used during the surveyance of source
            * elements.
            * @namespace
            * @type {!Object.<string, function(...[*])>***REMOVED***
            */
           oSurveySourceElement: {
             /**#nocode+*/  // JsDoc Toolkit 2.4.0 hides some of the keys.
             /**
              * Classifies the source element as excludable if it does not
              * contain a {@code with***REMOVED*** statement or the {@code eval***REMOVED*** identifier
              * name. Adds the identifier of the function and its formal
              * parameters to the list of identifier names found.
              * @param {string***REMOVED*** sIdentifier The identifier of the function.
              * @param {!Array.<string>***REMOVED*** aFormalParameterList Formal parameters.
              * @param {!TSyntacticCodeUnit***REMOVED*** oFunctionBody Function code.
              */
             'defun': function(
                 sIdentifier,
                 aFormalParameterList,
                 oFunctionBody) {
               fClassifyAsExcludable();
               fAddIdentifier(sIdentifier);
               aFormalParameterList.forEach(fAddIdentifier);
           ***REMOVED***
             /**
              * Increments the count of the number of occurrences of the String
              * value that is equivalent to the sequence of terminal symbols
              * that constitute the encountered identifier name.
              * @param {!TSyntacticCodeUnit***REMOVED*** oExpression The nonterminal
              *     MemberExpression.
              * @param {string***REMOVED*** sIdentifierName The identifier name used as the
              *     property accessor.
              * @return {!Array***REMOVED*** The encountered branch of an <abbr title=
              *     "abstract syntax tree">AST</abbr> with its nonterminal
              *     MemberExpression traversed.
              */
             'dot': function(oExpression, sIdentifierName) {
               fCountPrimaryExpression(
                   EPrimaryExpressionCategories.N_IDENTIFIER_NAMES,
                   EValuePrefixes.S_STRING + sIdentifierName);
               return ['dot', oWalker.walk(oExpression), sIdentifierName];
           ***REMOVED***
             /**
              * Adds the optional identifier of the function and its formal
              * parameters to the list of identifier names found.
              * @param {?string***REMOVED*** sIdentifier The optional identifier of the
              *     function.
              * @param {!Array.<string>***REMOVED*** aFormalParameterList Formal parameters.
              * @param {!TSyntacticCodeUnit***REMOVED*** oFunctionBody Function code.
              */
             'function': function(
                 sIdentifier,
                 aFormalParameterList,
                 oFunctionBody) {
               if ('string' === typeof sIdentifier) {
                 fAddIdentifier(sIdentifier);
           ***REMOVED***
               aFormalParameterList.forEach(fAddIdentifier);
           ***REMOVED***
             /**
              * Either increments the count of the number of occurrences of the
              * encountered null or Boolean value or classifies a source element
              * as containing the {@code eval***REMOVED*** identifier name.
              * @param {string***REMOVED*** sIdentifier The identifier encountered.
              */
             'name': function(sIdentifier) {
               if (-1 !== A_OTHER_SUBSTITUTABLE_LITERALS.indexOf(sIdentifier)) {
                 fCountPrimaryExpression(
                     EPrimaryExpressionCategories.N_NULL_AND_BOOLEAN_LITERALS,
                     EValuePrefixes.S_SYMBOLIC + sIdentifier);
           ***REMOVED*** else {
                 if ('eval' === sIdentifier) {
                   oSourceElementData.nCategory =
                       ESourceElementCategories.N_EVAL;
             ***REMOVED***
                 fAddIdentifier(sIdentifier);
           ***REMOVED***
           ***REMOVED***
             /**
              * Classifies the source element as excludable if it does not
              * contain a {@code with***REMOVED*** statement or the {@code eval***REMOVED*** identifier
              * name.
              * @param {TSyntacticCodeUnit***REMOVED*** oExpression The expression whose
              *     value is to be returned.
              */
             'return': function(oExpression) {
               fClassifyAsExcludable();
           ***REMOVED***
             /**
              * Increments the count of the number of occurrences of the
              * encountered String value.
              * @param {string***REMOVED*** sStringValue The String value of the string
              *     literal encountered.
              */
             'string': function(sStringValue) {
               if (sStringValue.length > 0) {
                 fCountPrimaryExpression(
                     EPrimaryExpressionCategories.N_STRING_LITERALS,
                     EValuePrefixes.S_STRING + sStringValue);
           ***REMOVED***
           ***REMOVED***
             /**
              * Adds the identifier reserved for an exception to the list of
              * identifier names found.
              * @param {!TSyntacticCodeUnit***REMOVED*** oTry A block of code in which an
              *     exception can occur.
              * @param {Array***REMOVED*** aCatch The identifier reserved for an exception
              *     and a block of code to handle the exception.
              * @param {TSyntacticCodeUnit***REMOVED*** oFinally An optional block of code
              *     to be evaluated regardless of whether an exception occurs.
              */
             'try': function(oTry, aCatch, oFinally) {
               if (Array.isArray(aCatch)) {
                 fAddIdentifier(aCatch[0]);
           ***REMOVED***
           ***REMOVED***
             /**
              * Classifies the source element as excludable if it does not
              * contain a {@code with***REMOVED*** statement or the {@code eval***REMOVED*** identifier
              * name. Adds the identifier of each declared variable to the list
              * of identifier names found.
              * @param {!Array.<!Array>***REMOVED*** aVariableDeclarationList Variable
              *     declarations.
              */
             'var': function(aVariableDeclarationList) {
               fClassifyAsExcludable();
               aVariableDeclarationList.forEach(fAddVariable);
           ***REMOVED***
             /**
              * Classifies a source element as containing the {@code with***REMOVED***
              * statement.
              * @param {!TSyntacticCodeUnit***REMOVED*** oExpression An expression whose
              *     value is to be converted to a value of type Object and
              *     become the binding object of a new object environment
              *     record of a new lexical environment in which the statement
              *     is to be executed.
              * @param {!TSyntacticCodeUnit***REMOVED*** oStatement The statement to be
              *     executed in the augmented lexical environment.
              * @return {!Array***REMOVED*** An empty array to stop the traversal.
              */
             'with': function(oExpression, oStatement) {
               oSourceElementData.nCategory = ESourceElementCategories.N_WITH;
               return [];
         ***REMOVED***
             /**#nocode-*/  // JsDoc Toolkit 2.4.0 hides some of the keys.
         ***REMOVED***
           /**
            * A collection of functions used while looking for nested functions.
            * @namespace
            * @type {!Object.<string, function(...[*])>***REMOVED***
            */
           oExamineFunctions: {
             /**#nocode+*/  // JsDoc Toolkit 2.4.0 hides some of the keys.
             /**
              * Orders an examination of a nested function declaration.
              * @this {!TSyntacticCodeUnit***REMOVED*** An array-like object representing
              *     the branch of an <abbr title="abstract syntax tree"
              *     >AST</abbr> representing the syntactic code unit along with
              *     its scope.
              * @return {!Array***REMOVED*** An empty array to stop the traversal.
              */
             'defun': function() {
               fExamineSyntacticCodeUnit(this);
               return [];
           ***REMOVED***
             /**
              * Orders an examination of a nested function expression.
              * @this {!TSyntacticCodeUnit***REMOVED*** An array-like object representing
              *     the branch of an <abbr title="abstract syntax tree"
              *     >AST</abbr> representing the syntactic code unit along with
              *     its scope.
              * @return {!Array***REMOVED*** An empty array to stop the traversal.
              */
             'function': function() {
               fExamineSyntacticCodeUnit(this);
               return [];
         ***REMOVED***
             /**#nocode-*/  // JsDoc Toolkit 2.4.0 hides some of the keys.
       ***REMOVED***
       ***REMOVED***
         /**
          * Records containing data about source elements.
          * @type {Array.<TSourceElementsData>***REMOVED***
          */
         aSourceElementsData = [],
         /**
          * The index (in the source text order) of the source element
          * immediately following a <a href="http://es5.github.com/#x14.1"
          * >Directive Prologue</a>.
          * @type {number***REMOVED***
          */
         nAfterDirectivePrologue = 0,
         /**
          * The index (in the source text order) of the source element that is
          * currently being considered.
          * @type {number***REMOVED***
          */
         nPosition,
         /**
          * The index (in the source text order) of the source element that is
          * the last element of the range of source elements that is currently
          * being considered.
          * @type {(undefined|number)***REMOVED***
          */
         nTo,
         /**
          * Initiates the traversal of a source element.
          * @param {!TWalker***REMOVED*** oWalker An instance of an object that allows the
          *     traversal of an abstract syntax tree.
          * @param {!TSyntacticCodeUnit***REMOVED*** oSourceElement A source element from
          *     which the traversal should commence.
          * @return {function(): !TSyntacticCodeUnit***REMOVED*** A function that is able to
          *     initiate the traversal from a given source element.
          */
         cContext = function(oWalker, oSourceElement) {
           /**
            * @return {!TSyntacticCodeUnit***REMOVED*** A function that is able to
            *     initiate the traversal from a given source element.
            */
           var fLambda = function() {
             return oWalker.walk(oSourceElement);
       ***REMOVED***;

           return fLambda;
       ***REMOVED***
         /**
          * Classifies the source element as excludable if it does not
          * contain a {@code with***REMOVED*** statement or the {@code eval***REMOVED*** identifier
          * name.
          */
         fClassifyAsExcludable = function() {
           if (oSourceElementData.nCategory ===
               ESourceElementCategories.N_OTHER) {
             oSourceElementData.nCategory =
                 ESourceElementCategories.N_EXCLUDABLE;
       ***REMOVED***
       ***REMOVED***
         /**
          * Adds an identifier to the list of identifier names found.
          * @param {string***REMOVED*** sIdentifier The identifier to be added.
          */
         fAddIdentifier = function(sIdentifier) {
           if (-1 === oSourceElementData.aIdentifiers.indexOf(sIdentifier)) {
             oSourceElementData.aIdentifiers.push(sIdentifier);
       ***REMOVED***
       ***REMOVED***
         /**
          * Adds the identifier of a variable to the list of identifier names
          * found.
          * @param {!Array***REMOVED*** aVariableDeclaration A variable declaration.
          */
         fAddVariable = function(aVariableDeclaration) {
           fAddIdentifier(/** @type {string***REMOVED*** */ aVariableDeclaration[0]);
       ***REMOVED***
         /**
          * Increments the count of the number of occurrences of the prefixed
          * String representation attributed to the primary expression.
          * @param {number***REMOVED*** nCategory The category of the primary expression.
          * @param {string***REMOVED*** sName The prefixed String representation attributed
          *     to the primary expression.
          */
         fCountPrimaryExpression = function(nCategory, sName) {
           if (!oSourceElementData.aCount[nCategory].hasOwnProperty(sName)) {
             oSourceElementData.aCount[nCategory][sName] = 0;
             if (-1 === oSourceElementData.aPrimitiveValues.indexOf(sName)) {
               oSourceElementData.aPrimitiveValues.push(sName);
         ***REMOVED***
       ***REMOVED***
           oSourceElementData.aCount[nCategory][sName] += 1;
       ***REMOVED***
         /**
          * Consolidates all worthwhile primitive values in a range of source
          *     elements.
          * @param {number***REMOVED*** nFrom The index (in the source text order) of the
          *     source element that is the first element of the range.
          * @param {number***REMOVED*** nTo The index (in the source text order) of the
          *     source element that is the last element of the range.
          * @param {boolean***REMOVED*** bEnclose Indicates whether the range should be
          *     enclosed within a function call with no argument values to a
          *     function with an empty parameter list if any primitive values
          *     are consolidated.
          * @see TPrimitiveValue#nSaving
          */
         fExamineSourceElements = function(nFrom, nTo, bEnclose) {
           var _,
               /**
                * The index of the last mangled name.
                * @type {number***REMOVED***
                */
               nIndex = oScope.cname,
               /**
                * The index of the source element that is currently being
                * considered.
                * @type {number***REMOVED***
                */
               nPosition,
               /**
                * A collection of functions used during the consolidation of
                * primitive values and identifier names used as property
                * accessors.
                * @namespace
                * @type {!Object.<string, function(...[*])>***REMOVED***
                */
               oWalkersTransformers = {
                 /**
                  * If the String value that is equivalent to the sequence of
                  * terminal symbols that constitute the encountered identifier
                  * name is worthwhile, a syntactic conversion from the dot
                  * notation to the bracket notation ensues with that sequence
                  * being substituted by an identifier name to which the value
                  * is assigned.
                  * Applies to property accessors that use the dot notation.
                  * @param {!TSyntacticCodeUnit***REMOVED*** oExpression The nonterminal
                  *     MemberExpression.
                  * @param {string***REMOVED*** sIdentifierName The identifier name used as
                  *     the property accessor.
                  * @return {!Array***REMOVED*** A syntactic code unit that is equivalent to
                  *     the one encountered.
                  * @see TPrimitiveValue#nSaving
                  */
                 'dot': function(oExpression, sIdentifierName) {
                   /**
                    * The prefixed String value that is equivalent to the
                    * sequence of terminal symbols that constitute the
                    * encountered identifier name.
                    * @type {string***REMOVED***
                    */
                   var sPrefixed = EValuePrefixes.S_STRING + sIdentifierName;

                   return oSolutionBest.oPrimitiveValues.hasOwnProperty(
                       sPrefixed) &&
                       oSolutionBest.oPrimitiveValues[sPrefixed].nSaving > 0 ?
                       ['sub',
                        oWalker.walk(oExpression),
                        ['name',
                         oSolutionBest.oPrimitiveValues[sPrefixed].sName]] :
                       ['dot', oWalker.walk(oExpression), sIdentifierName];
               ***REMOVED***
                 /**
                  * If the encountered identifier is a null or Boolean literal
                  * and its value is worthwhile, the identifier is substituted
                  * by an identifier name to which that value is assigned.
                  * Applies to identifier names.
                  * @param {string***REMOVED*** sIdentifier The identifier encountered.
                  * @return {!Array***REMOVED*** A syntactic code unit that is equivalent to
                  *     the one encountered.
                  * @see TPrimitiveValue#nSaving
                  */
                 'name': function(sIdentifier) {
                   /**
                    * The prefixed representation String of the identifier.
                    * @type {string***REMOVED***
                    */
                   var sPrefixed = EValuePrefixes.S_SYMBOLIC + sIdentifier;

                   return [
                     'name',
                     oSolutionBest.oPrimitiveValues.hasOwnProperty(sPrefixed) &&
                     oSolutionBest.oPrimitiveValues[sPrefixed].nSaving > 0 ?
                     oSolutionBest.oPrimitiveValues[sPrefixed].sName :
                     sIdentifier
                   ];
               ***REMOVED***
                 /**
                  * If the encountered String value is worthwhile, it is
                  * substituted by an identifier name to which that value is
                  * assigned.
                  * Applies to String values.
                  * @param {string***REMOVED*** sStringValue The String value of the string
                  *     literal encountered.
                  * @return {!Array***REMOVED*** A syntactic code unit that is equivalent to
                  *     the one encountered.
                  * @see TPrimitiveValue#nSaving
                  */
                 'string': function(sStringValue) {
                   /**
                    * The prefixed representation String of the primitive value
                    * of the literal.
                    * @type {string***REMOVED***
                    */
                   var sPrefixed =
                       EValuePrefixes.S_STRING + sStringValue;

                   return oSolutionBest.oPrimitiveValues.hasOwnProperty(
                       sPrefixed) &&
                       oSolutionBest.oPrimitiveValues[sPrefixed].nSaving > 0 ?
                       ['name',
                        oSolutionBest.oPrimitiveValues[sPrefixed].sName] :
                       ['string', sStringValue];
             ***REMOVED***
             ***REMOVED***
               /**
                * Such data on what to consolidate within the range of source
                * elements that is currently being considered that lead to the
                * greatest known reduction of the number of the terminal symbols
                * in comparison to the original source text.
                * @type {!TSolution***REMOVED***
                */
               oSolutionBest = new TSolution(),
               /**
                * Data representing an ongoing attempt to find a better
                * reduction of the number of the terminal symbols in comparison
                * to the original source text than the best one that is
                * currently known.
                * @type {!TSolution***REMOVED***
                * @see oSolutionBest
                */
               oSolutionCandidate = new TSolution(),
               /**
                * A record consisting of data about the range of source elements
                * that is currently being examined.
                * @type {!TSourceElementsData***REMOVED***
                */
               oSourceElementsData = new TSourceElementsData(),
               /**
                * Variable declarations for each primitive value that is to be
                * consolidated within the elements.
                * @type {!Array.<!Array>***REMOVED***
                */
               aVariableDeclarations = [],
               /**
                * Augments a list with a prefixed representation String.
                * @param {!Array.<string>***REMOVED*** aList A list that is to be augmented.
                * @return {function(string)***REMOVED*** A function that augments a list
                *     with a prefixed representation String.
                */
               cAugmentList = function(aList) {
                 /**
                  * @param {string***REMOVED*** sPrefixed Prefixed representation String of
                  *     a primitive value that could be consolidated within the
                  *     elements.
                  */
                 var fLambda = function(sPrefixed) {
                   if (-1 === aList.indexOf(sPrefixed)) {
                     aList.push(sPrefixed);
               ***REMOVED***
             ***REMOVED***;

                 return fLambda;
             ***REMOVED***
               /**
                * Adds the number of occurrences of a primitive value of a given
                * category that could be consolidated in the source element with
                * a given index to the count of occurrences of that primitive
                * value within the range of source elements that is currently
                * being considered.
                * @param {number***REMOVED*** nPosition The index (in the source text order)
                *     of a source element.
                * @param {number***REMOVED*** nCategory The category of the primary
                *     expression from which the primitive value is derived.
                * @return {function(string)***REMOVED*** A function that performs the
                *     addition.
                * @see cAddOccurrencesInCategory
                */
               cAddOccurrences = function(nPosition, nCategory) {
                 /**
                  * @param {string***REMOVED*** sPrefixed The prefixed representation String
                  *     of a primitive value.
                  */
                 var fLambda = function(sPrefixed) {
                   if (!oSourceElementsData.aCount[nCategory].hasOwnProperty(
                           sPrefixed)) {
                     oSourceElementsData.aCount[nCategory][sPrefixed] = 0;
               ***REMOVED***
                   oSourceElementsData.aCount[nCategory][sPrefixed] +=
                       aSourceElementsData[nPosition].aCount[nCategory][
                           sPrefixed];
             ***REMOVED***;

                 return fLambda;
             ***REMOVED***
               /**
                * Adds the number of occurrences of each primitive value of a
                * given category that could be consolidated in the source
                * element with a given index to the count of occurrences of that
                * primitive values within the range of source elements that is
                * currently being considered.
                * @param {number***REMOVED*** nPosition The index (in the source text order)
                *     of a source element.
                * @return {function(number)***REMOVED*** A function that performs the
                *     addition.
                * @see fAddOccurrences
                */
               cAddOccurrencesInCategory = function(nPosition) {
                 /**
                  * @param {number***REMOVED*** nCategory The category of the primary
                  *     expression from which the primitive value is derived.
                  */
                 var fLambda = function(nCategory) {
                   Object.keys(
                       aSourceElementsData[nPosition].aCount[nCategory]
                   ).forEach(cAddOccurrences(nPosition, nCategory));
             ***REMOVED***;

                 return fLambda;
             ***REMOVED***
               /**
                * Adds the number of occurrences of each primitive value that
                * could be consolidated in the source element with a given index
                * to the count of occurrences of that primitive values within
                * the range of source elements that is currently being
                * considered.
                * @param {number***REMOVED*** nPosition The index (in the source text order)
                *     of a source element.
                */
               fAddOccurrences = function(nPosition) {
                 Object.keys(aSourceElementsData[nPosition].aCount).forEach(
                     cAddOccurrencesInCategory(nPosition));
             ***REMOVED***
               /**
                * Creates a variable declaration for a primitive value if that
                * primitive value is to be consolidated within the elements.
                * @param {string***REMOVED*** sPrefixed Prefixed representation String of a
                *     primitive value that could be consolidated within the
                *     elements.
                * @see aVariableDeclarations
                */
               cAugmentVariableDeclarations = function(sPrefixed) {
                 if (oSolutionBest.oPrimitiveValues[sPrefixed].nSaving > 0) {
                   aVariableDeclarations.push([
                     oSolutionBest.oPrimitiveValues[sPrefixed].sName,
                     [0 === sPrefixed.indexOf(EValuePrefixes.S_SYMBOLIC) ?
                      'name' : 'string',
                      sPrefixed.substring(EValuePrefixes.S_SYMBOLIC.length)]
                   ]);
             ***REMOVED***
             ***REMOVED***
               /**
                * Sorts primitive values with regard to the difference in the
                * number of terminal symbols between the original source text
                * and the one with those primitive values consolidated.
                * @param {string***REMOVED*** sPrefixed0 The prefixed representation String
                *     of the first of the two primitive values that are being
                *     compared.
                * @param {string***REMOVED*** sPrefixed1 The prefixed representation String
                *     of the second of the two primitive values that are being
                *     compared.
                * @return {number***REMOVED***
                *     <dl>
                *         <dt>-1</dt>
                *         <dd>if the first primitive value must be placed before
                *              the other one,</dd>
                *         <dt>0</dt>
                *         <dd>if the first primitive value may be placed before
                *              the other one,</dd>
                *         <dt>1</dt>
                *         <dd>if the first primitive value must not be placed
                *              before the other one.</dd>
                *     </dl>
                * @see TSolution.oPrimitiveValues
                */
               cSortPrimitiveValues = function(sPrefixed0, sPrefixed1) {
                 /**
                  * The difference between:
                  * <ol>
                  * <li>the difference in the number of terminal symbols
                  *     between the original source text and the one with the
                  *     first primitive value consolidated, and</li>
                  * <li>the difference in the number of terminal symbols
                  *     between the original source text and the one with the
                  *     second primitive value consolidated.</li>
                  * </ol>
                  * @type {number***REMOVED***
                  */
                 var nDifference =
                     oSolutionCandidate.oPrimitiveValues[sPrefixed0].nSaving -
                     oSolutionCandidate.oPrimitiveValues[sPrefixed1].nSaving;

                 return nDifference > 0 ? -1 : nDifference < 0 ? 1 : 0;
             ***REMOVED***
               /**
                * Assigns an identifier name to a primitive value and calculates
                * whether instances of that primitive value are worth
                * consolidating.
                * @param {string***REMOVED*** sPrefixed The prefixed representation String
                *     of a primitive value that is being evaluated.
                */
               fEvaluatePrimitiveValue = function(sPrefixed) {
                 var _,
                     /**
                      * The index of the last mangled name.
                      * @type {number***REMOVED***
                      */
                     nIndex,
                     /**
                      * The representation String of the primitive value that is
                      * being evaluated.
                      * @type {string***REMOVED***
                      */
                     sName =
                         sPrefixed.substring(EValuePrefixes.S_SYMBOLIC.length),
                     /**
                      * The number of source characters taken up by the
                      * representation String of the primitive value that is
                      * being evaluated.
                      * @type {number***REMOVED***
                      */
                     nLengthOriginal = sName.length,
                     /**
                      * The number of source characters taken up by the
                      * identifier name that could substitute the primitive
                      * value that is being evaluated.
                      * substituted.
                      * @type {number***REMOVED***
                      */
                     nLengthSubstitution,
                     /**
                      * The number of source characters taken up by by the
                      * representation String of the primitive value that is
                      * being evaluated when it is represented by a string
                      * literal.
                      * @type {number***REMOVED***
                      */
                     nLengthString = oProcessor.make_string(sName).length;

                 oSolutionCandidate.oPrimitiveValues[sPrefixed] =
                     new TPrimitiveValue();
                 do {  // Find an identifier unused in this or any nested scope.
                   nIndex = oScope.cname;
                   oSolutionCandidate.oPrimitiveValues[sPrefixed].sName =
                       oScope.next_mangled();
             ***REMOVED*** while (-1 !== oSourceElementsData.aIdentifiers.indexOf(
                     oSolutionCandidate.oPrimitiveValues[sPrefixed].sName));
                 nLengthSubstitution = oSolutionCandidate.oPrimitiveValues[
                     sPrefixed].sName.length;
                 if (0 === sPrefixed.indexOf(EValuePrefixes.S_SYMBOLIC)) {
                   // foo:null, or foo:null;
                   oSolutionCandidate.oPrimitiveValues[sPrefixed].nSaving -=
                       nLengthSubstitution + nLengthOriginal +
                       oWeights.N_VARIABLE_DECLARATION;
                   // null vs foo
                   oSolutionCandidate.oPrimitiveValues[sPrefixed].nSaving +=
                       oSourceElementsData.aCount[
                           EPrimaryExpressionCategories.
                               N_NULL_AND_BOOLEAN_LITERALS][sPrefixed] *
                       (nLengthOriginal - nLengthSubstitution);
             ***REMOVED*** else {
                   // foo:'fromCharCode';
                   oSolutionCandidate.oPrimitiveValues[sPrefixed].nSaving -=
                       nLengthSubstitution + nLengthString +
                       oWeights.N_VARIABLE_DECLARATION;
                   // .fromCharCode vs [foo]
                   if (oSourceElementsData.aCount[
                           EPrimaryExpressionCategories.N_IDENTIFIER_NAMES
                       ].hasOwnProperty(sPrefixed)) {
                     oSolutionCandidate.oPrimitiveValues[sPrefixed].nSaving +=
                         oSourceElementsData.aCount[
                             EPrimaryExpressionCategories.N_IDENTIFIER_NAMES
                         ][sPrefixed] *
                         (nLengthOriginal - nLengthSubstitution -
                          oWeights.N_PROPERTY_ACCESSOR);
               ***REMOVED***
                   // 'fromCharCode' vs foo
                   if (oSourceElementsData.aCount[
                           EPrimaryExpressionCategories.N_STRING_LITERALS
                       ].hasOwnProperty(sPrefixed)) {
                     oSolutionCandidate.oPrimitiveValues[sPrefixed].nSaving +=
                         oSourceElementsData.aCount[
                             EPrimaryExpressionCategories.N_STRING_LITERALS
                         ][sPrefixed] *
                         (nLengthString - nLengthSubstitution);
               ***REMOVED***
             ***REMOVED***
                 if (oSolutionCandidate.oPrimitiveValues[sPrefixed].nSaving >
                     0) {
                   oSolutionCandidate.nSavings +=
                       oSolutionCandidate.oPrimitiveValues[sPrefixed].nSaving;
             ***REMOVED*** else {
                   oScope.cname = nIndex; // Free the identifier name.
             ***REMOVED***
             ***REMOVED***
               /**
                * Adds a variable declaration to an existing variable statement.
                * @param {!Array***REMOVED*** aVariableDeclaration A variable declaration
                *     with an initialiser.
                */
               cAddVariableDeclaration = function(aVariableDeclaration) {
                 (/** @type {!Array***REMOVED*** */ oSourceElements[nFrom][1]).unshift(
                     aVariableDeclaration);
           ***REMOVED***;

           if (nFrom > nTo) {
             return;
       ***REMOVED***
           // If the range is a closure, reuse the closure.
           if (nFrom === nTo &&
               'stat' === oSourceElements[nFrom][0] &&
               'call' === oSourceElements[nFrom][1][0] &&
               'function' === oSourceElements[nFrom][1][1][0]) {
             fExamineSyntacticCodeUnit(oSourceElements[nFrom][1][1]);
             return;
       ***REMOVED***
           // Create a list of all derived primitive values within the range.
           for (nPosition = nFrom; nPosition <= nTo; nPosition += 1) {
             aSourceElementsData[nPosition].aPrimitiveValues.forEach(
                 cAugmentList(oSourceElementsData.aPrimitiveValues));
       ***REMOVED***
           if (0 === oSourceElementsData.aPrimitiveValues.length) {
             return;
       ***REMOVED***
           for (nPosition = nFrom; nPosition <= nTo; nPosition += 1) {
             // Add the number of occurrences to the total count.
             fAddOccurrences(nPosition);
             // Add identifiers of this or any nested scope to the list.
             aSourceElementsData[nPosition].aIdentifiers.forEach(
                 cAugmentList(oSourceElementsData.aIdentifiers));
       ***REMOVED***
           // Distribute identifier names among derived primitive values.
           do {  // If there was any progress, find a better distribution.
             oSolutionBest = oSolutionCandidate;
             if (Object.keys(oSolutionCandidate.oPrimitiveValues).length > 0) {
               // Sort primitive values descending by their worthwhileness.
               oSourceElementsData.aPrimitiveValues.sort(cSortPrimitiveValues);
         ***REMOVED***
             oSolutionCandidate = new TSolution();
             oSourceElementsData.aPrimitiveValues.forEach(
                 fEvaluatePrimitiveValue);
             oScope.cname = nIndex;
       ***REMOVED*** while (oSolutionCandidate.nSavings > oSolutionBest.nSavings);
           // Take the necessity of adding a variable statement into account.
           if ('var' !== oSourceElements[nFrom][0]) {
             oSolutionBest.nSavings -= oWeights.N_VARIABLE_STATEMENT_AFFIXATION;
       ***REMOVED***
           if (bEnclose) {
             // Take the necessity of forming a closure into account.
             oSolutionBest.nSavings -= oWeights.N_CLOSURE;
       ***REMOVED***
           if (oSolutionBest.nSavings > 0) {
             // Create variable declarations suitable for UglifyJS.
             Object.keys(oSolutionBest.oPrimitiveValues).forEach(
                 cAugmentVariableDeclarations);
             // Rewrite expressions that contain worthwhile primitive values.
             for (nPosition = nFrom; nPosition <= nTo; nPosition += 1) {
               oWalker = oProcessor.ast_walker();
               oSourceElements[nPosition] =
                   oWalker.with_walkers(
                       oWalkersTransformers,
                       cContext(oWalker, oSourceElements[nPosition]));
         ***REMOVED***
             if ('var' === oSourceElements[nFrom][0]) {  // Reuse the statement.
               (/** @type {!Array.<!Array>***REMOVED*** */ aVariableDeclarations.reverse(
                   )).forEach(cAddVariableDeclaration);
         ***REMOVED*** else {  // Add a variable statement.
               Array.prototype.splice.call(
                   oSourceElements,
                   nFrom,
                   0,
                   ['var', aVariableDeclarations]);
               nTo += 1;
         ***REMOVED***
             if (bEnclose) {
               // Add a closure.
               Array.prototype.splice.call(
                   oSourceElements,
                   nFrom,
                   0,
                   ['stat', ['call', ['function', null, [], []], []]]);
               // Copy source elements into the closure.
               for (nPosition = nTo + 1; nPosition > nFrom; nPosition -= 1) {
                 Array.prototype.unshift.call(
                     oSourceElements[nFrom][1][1][3],
                     oSourceElements[nPosition]);
           ***REMOVED***
               // Remove source elements outside the closure.
               Array.prototype.splice.call(
                   oSourceElements,
                   nFrom + 1,
                   nTo - nFrom + 1);
         ***REMOVED***
       ***REMOVED***
           if (bEnclose) {
             // Restore the availability of identifier names.
             oScope.cname = nIndex;
       ***REMOVED***
     ***REMOVED***;

     oSourceElements = (/** @type {!TSyntacticCodeUnit***REMOVED*** */
         oSyntacticCodeUnit[bIsGlobal ? 1 : 3]);
     if (0 === oSourceElements.length) {
       return;
 ***REMOVED***
     oScope = bIsGlobal ? oSyntacticCodeUnit.scope : oSourceElements.scope;
     // Skip a Directive Prologue.
     while (nAfterDirectivePrologue < oSourceElements.length &&
            'directive' === oSourceElements[nAfterDirectivePrologue][0]) {
       nAfterDirectivePrologue += 1;
       aSourceElementsData.push(null);
 ***REMOVED***
     if (oSourceElements.length === nAfterDirectivePrologue) {
       return;
 ***REMOVED***
     for (nPosition = nAfterDirectivePrologue;
          nPosition < oSourceElements.length;
          nPosition += 1) {
       oSourceElementData = new TSourceElementsData();
       oWalker = oProcessor.ast_walker();
       // Classify a source element.
       // Find its derived primitive values and count their occurrences.
       // Find all identifiers used (including nested scopes).
       oWalker.with_walkers(
           oWalkers.oSurveySourceElement,
           cContext(oWalker, oSourceElements[nPosition]));
       // Establish whether the scope is still wholly examinable.
       bIsWhollyExaminable = bIsWhollyExaminable &&
           ESourceElementCategories.N_WITH !== oSourceElementData.nCategory &&
           ESourceElementCategories.N_EVAL !== oSourceElementData.nCategory;
       aSourceElementsData.push(oSourceElementData);
 ***REMOVED***
     if (bIsWhollyExaminable) {  // Examine the whole scope.
       fExamineSourceElements(
           nAfterDirectivePrologue,
           oSourceElements.length - 1,
           false);
 ***REMOVED*** else {  // Examine unexcluded ranges of source elements.
       for (nPosition = oSourceElements.length - 1;
            nPosition >= nAfterDirectivePrologue;
            nPosition -= 1) {
         oSourceElementData = (/** @type {!TSourceElementsData***REMOVED*** */
             aSourceElementsData[nPosition]);
         if (ESourceElementCategories.N_OTHER ===
             oSourceElementData.nCategory) {
           if ('undefined' === typeof nTo) {
             nTo = nPosition;  // Indicate the end of a range.
       ***REMOVED***
           // Examine the range if it immediately follows a Directive Prologue.
           if (nPosition === nAfterDirectivePrologue) {
             fExamineSourceElements(nPosition, nTo, true);
       ***REMOVED***
     ***REMOVED*** else {
           if ('undefined' !== typeof nTo) {
             // Examine the range that immediately follows this source element.
             fExamineSourceElements(nPosition + 1, nTo, true);
             nTo = void 0;  // Obliterate the range.
       ***REMOVED***
           // Examine nested functions.
           oWalker = oProcessor.ast_walker();
           oWalker.with_walkers(
               oWalkers.oExamineFunctions,
               cContext(oWalker, oSourceElements[nPosition]));
     ***REMOVED***
   ***REMOVED***
 ***REMOVED***
   ***REMOVED***(oAbstractSyntaxTree = oProcessor.ast_add_scope(oAbstractSyntaxTree)));
  return oAbstractSyntaxTree;
***REMOVED***;
/*jshint sub:false */

/* Local Variables:      */
/* mode: js              */
/* coding: utf-8         */
/* indent-tabs-mode: nil */
/* tab-width: 2          */
/* End:                  */
/* vim: set ft=javascript fenc=utf-8 et ts=2 sts=2 sw=2: */
/* :mode=javascript:noTabs=true:tabSize=2:indentSize=2:deepIndent=true: */
***REMOVED***);
define('uglifyjs/parse-js', ["exports"], function(exports) {
/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.

  This version is suitable for Node.js.  With minimal changes (the
  exports stuff) it should work on any JS platform.

  This file contains the tokenizer/parser.  It is a port to JavaScript
  of parse-js [1], a JavaScript parser library written in Common Lisp
  by Marijn Haverbeke.  Thank you Marijn!

  [1] http://marijn.haverbeke.nl/parse-js/

  Exported functions:

    - tokenizer(code) -- returns a function.  Call the returned
      function to fetch the next token.

    - parse(code) -- returns an AST of the given JavaScript code.

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2010 (c) Mihai Bazon <mihai.bazon@gmail.com>
    Based on parse-js (http://marijn.haverbeke.nl/parse-js/).

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

/* -----[ Tokenizer (constants) ]----- */

var KEYWORDS = array_to_hash([
    "break",
    "case",
    "catch",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "finally",
    "for",
    "function",
    "if",
    "in",
    "instanceof",
    "new",
    "return",
    "switch",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with"
]);

var RESERVED_WORDS = array_to_hash([
    "abstract",
    "boolean",
    "byte",
    "char",
    "class",
    "double",
    "enum",
    "export",
    "extends",
    "final",
    "float",
    "goto",
    "implements",
    "import",
    "int",
    "interface",
    "long",
    "native",
    "package",
    "private",
    "protected",
    "public",
    "short",
    "static",
    "super",
    "synchronized",
    "throws",
    "transient",
    "volatile"
]);

var KEYWORDS_BEFORE_EXPRESSION = array_to_hash([
    "return",
    "new",
    "delete",
    "throw",
    "else",
    "case"
]);

var KEYWORDS_ATOM = array_to_hash([
    "false",
    "null",
    "true",
    "undefined"
]);

var OPERATOR_CHARS = array_to_hash(characters("+-*&%=<>!?|~^"));

var RE_HEX_NUMBER = /^0x[0-9a-f]+$/i;
var RE_OCT_NUMBER = /^0[0-7]+$/;
var RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;

var OPERATORS = array_to_hash([
    "in",
    "instanceof",
    "typeof",
    "new",
    "void",
    "delete",
    "++",
    "--",
    "+",
    "-",
    "!",
    "~",
    "&",
    "|",
    "^",
    "*",
    "/",
    "%",
    ">>",
    "<<",
    ">>>",
    "<",
    ">",
    "<=",
    ">=",
    "==",
    "===",
    "!=",
    "!==",
    "?",
    "=",
    "+=",
    "-=",
    "/=",
    "*=",
    "%=",
    ">>=",
    "<<=",
    ">>>=",
    "|=",
    "^=",
    "&=",
    "&&",
    "||"
]);

var WHITESPACE_CHARS = array_to_hash(characters(" \u00a0\n\r\t\f\u000b\u200b\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\uFEFF"));

var PUNC_BEFORE_EXPRESSION = array_to_hash(characters("[{(,.;:"));

var PUNC_CHARS = array_to_hash(characters("[]{***REMOVED***(),;:"));

var REGEXP_MODIFIERS = array_to_hash(characters("gmsiy"));

/* -----[ Tokenizer ]----- */

var UNICODE = {  // Unicode 6.1
    letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F0\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
    combining_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0859-\\u085B\\u08E4-\\u08FE\\u0900-\\u0903\\u093A-\\u093C\\u093E-\\u094F\\u0951-\\u0957\\u0962\\u0963\\u0981-\\u0983\\u09BC\\u09BE-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CD\\u09D7\\u09E2\\u09E3\\u0A01-\\u0A03\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81-\\u0A83\\u0ABC\\u0ABE-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AE2\\u0AE3\\u0B01-\\u0B03\\u0B3C\\u0B3E-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B62\\u0B63\\u0B82\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD7\\u0C01-\\u0C03\\u0C3E-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0C82\\u0C83\\u0CBC\\u0CBE-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CE2\\u0CE3\\u0D02\\u0D03\\u0D3E-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4D\\u0D57\\u0D62\\u0D63\\u0D82\\u0D83\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F3E\\u0F3F\\u0F71-\\u0F84\\u0F86\\u0F87\\u0F8D-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102B-\\u103E\\u1056-\\u1059\\u105E-\\u1060\\u1062-\\u1064\\u1067-\\u106D\\u1071-\\u1074\\u1082-\\u108D\\u108F\\u109A-\\u109D\\u135D-\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B4-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u192B\\u1930-\\u193B\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A17-\\u1A1B\\u1A55-\\u1A5E\\u1A60-\\u1A7C\\u1A7F\\u1B00-\\u1B04\\u1B34-\\u1B44\\u1B6B-\\u1B73\\u1B80-\\u1B82\\u1BA1-\\u1BAD\\u1BE6-\\u1BF3\\u1C24-\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE8\\u1CED\\u1CF2-\\u1CF4\\u1DC0-\\u1DE6\\u1DFC-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2D7F\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA674-\\uA67D\\uA69F\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA823-\\uA827\\uA880\\uA881\\uA8B4-\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA953\\uA980-\\uA983\\uA9B3-\\uA9C0\\uAA29-\\uAA36\\uAA43\\uAA4C\\uAA4D\\uAA7B\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uAAEB-\\uAAEF\\uAAF5\\uAAF6\\uABE3-\\uABEA\\uABEC\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
    connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]"),
    digit: new RegExp("[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19]")
***REMOVED***;

function is_letter(ch) {
    return UNICODE.letter.test(ch);
***REMOVED***;

function is_digit(ch) {
    ch = ch.charCodeAt(0);
    return ch >= 48 && ch <= 57;
***REMOVED***;

function is_unicode_digit(ch) {
    return UNICODE.digit.test(ch);
***REMOVED***

function is_alphanumeric_char(ch) {
    return is_digit(ch) || is_letter(ch);
***REMOVED***;

function is_unicode_combining_mark(ch) {
    return UNICODE.combining_mark.test(ch);
***REMOVED***;

function is_unicode_connector_punctuation(ch) {
    return UNICODE.connector_punctuation.test(ch);
***REMOVED***;

function is_identifier_start(ch) {
    return ch == "$" || ch == "_" || is_letter(ch);
***REMOVED***;

function is_identifier_char(ch) {
    return is_identifier_start(ch)
        || is_unicode_combining_mark(ch)
        || is_unicode_digit(ch)
        || is_unicode_connector_punctuation(ch)
        || ch == "\u200c" // zero-width non-joiner <ZWNJ>
        || ch == "\u200d" // zero-width joiner <ZWJ> (in my ECMA-262 PDF, this is also 200c)
    ;
***REMOVED***;

function parse_js_number(num) {
    if (RE_HEX_NUMBER.test(num)) {
        return parseInt(num.substr(2), 16);
***REMOVED*** else if (RE_OCT_NUMBER.test(num)) {
        return parseInt(num.substr(1), 8);
***REMOVED*** else if (RE_DEC_NUMBER.test(num)) {
        return parseFloat(num);
***REMOVED***
***REMOVED***;

function JS_Parse_Error(message, line, col, pos) {
    this.message = message;
    this.line = line + 1;
    this.col = col + 1;
    this.pos = pos + 1;
    this.stack = new Error().stack;
***REMOVED***;

JS_Parse_Error.prototype.toString = function() {
    return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack;
***REMOVED***;

function js_error(message, line, col, pos) {
    throw new JS_Parse_Error(message, line, col, pos);
***REMOVED***;

function is_token(token, type, val) {
    return token.type == type && (val == null || token.value == val);
***REMOVED***;

var EX_EOF = {***REMOVED***;

function tokenizer($TEXT) {

    var S = {
        text            : $TEXT.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, ''),
        pos             : 0,
        tokpos          : 0,
        line            : 0,
        tokline         : 0,
        col             : 0,
        tokcol          : 0,
        newline_before  : false,
        regex_allowed   : false,
        comments_before : []
***REMOVED***;

    function peek() { return S.text.charAt(S.pos); ***REMOVED***;

    function next(signal_eof, in_string) {
        var ch = S.text.charAt(S.pos++);
        if (signal_eof && !ch)
            throw EX_EOF;
        if (ch == "\n") {
            S.newline_before = S.newline_before || !in_string;
            ++S.line;
            S.col = 0;
    ***REMOVED*** else {
            ++S.col;
    ***REMOVED***
        return ch;
***REMOVED***;

    function eof() {
        return !S.peek();
***REMOVED***;

    function find(what, signal_eof) {
        var pos = S.text.indexOf(what, S.pos);
        if (signal_eof && pos == -1) throw EX_EOF;
        return pos;
***REMOVED***;

    function start_token() {
        S.tokline = S.line;
        S.tokcol = S.col;
        S.tokpos = S.pos;
***REMOVED***;

    function token(type, value, is_comment) {
        S.regex_allowed = ((type == "operator" && !HOP(UNARY_POSTFIX, value)) ||
                           (type == "keyword" && HOP(KEYWORDS_BEFORE_EXPRESSION, value)) ||
                           (type == "punc" && HOP(PUNC_BEFORE_EXPRESSION, value)));
        var ret = {
            type   : type,
            value  : value,
            line   : S.tokline,
            col    : S.tokcol,
            pos    : S.tokpos,
            endpos : S.pos,
            nlb    : S.newline_before
    ***REMOVED***;
        if (!is_comment) {
            ret.comments_before = S.comments_before;
            S.comments_before = [];
            // make note of any newlines in the comments that came before
            for (var i = 0, len = ret.comments_before.length; i < len; i++) {
                ret.nlb = ret.nlb || ret.comments_before[i].nlb;
        ***REMOVED***
    ***REMOVED***
        S.newline_before = false;
        return ret;
***REMOVED***;

    function skip_whitespace() {
        while (HOP(WHITESPACE_CHARS, peek()))
            next();
***REMOVED***;

    function read_while(pred) {
        var ret = "", ch = peek(), i = 0;
        while (ch && pred(ch, i++)) {
            ret += next();
            ch = peek();
    ***REMOVED***
        return ret;
***REMOVED***;

    function parse_error(err) {
        js_error(err, S.tokline, S.tokcol, S.tokpos);
***REMOVED***;

    function read_num(prefix) {
        var has_e = false, after_e = false, has_x = false, has_dot = prefix == ".";
        var num = read_while(function(ch, i){
            if (ch == "x" || ch == "X") {
                if (has_x) return false;
                return has_x = true;
        ***REMOVED***
            if (!has_x && (ch == "E" || ch == "e")) {
                if (has_e) return false;
                return has_e = after_e = true;
        ***REMOVED***
            if (ch == "-") {
                if (after_e || (i == 0 && !prefix)) return true;
                return false;
        ***REMOVED***
            if (ch == "+") return after_e;
            after_e = false;
            if (ch == ".") {
                if (!has_dot && !has_x && !has_e)
                    return has_dot = true;
                return false;
        ***REMOVED***
            return is_alphanumeric_char(ch);
    ***REMOVED***);
        if (prefix)
            num = prefix + num;
        var valid = parse_js_number(num);
        if (!isNaN(valid)) {
            return token("num", valid);
    ***REMOVED*** else {
            parse_error("Invalid syntax: " + num);
    ***REMOVED***
***REMOVED***;

    function read_escaped_char(in_string) {
        var ch = next(true, in_string);
        switch (ch) {
          case "n" : return "\n";
          case "r" : return "\r";
          case "t" : return "\t";
          case "b" : return "\b";
          case "v" : return "\u000b";
          case "f" : return "\f";
          case "0" : return "\0";
          case "x" : return String.fromCharCode(hex_bytes(2));
          case "u" : return String.fromCharCode(hex_bytes(4));
          case "\n": return "";
          default  : return ch;
    ***REMOVED***
***REMOVED***;

    function hex_bytes(n) {
        var num = 0;
        for (; n > 0; --n) {
            var digit = parseInt(next(true), 16);
            if (isNaN(digit))
                parse_error("Invalid hex-character pattern in string");
            num = (num << 4) | digit;
    ***REMOVED***
        return num;
***REMOVED***;

    function read_string() {
        return with_eof_error("Unterminated string constant", function(){
            var quote = next(), ret = "";
            for (;;) {
                var ch = next(true);
                if (ch == "\\") {
                    // read OctalEscapeSequence (XXX: deprecated if "strict mode")
                    // https://github.com/mishoo/UglifyJS/issues/178
                    var octal_len = 0, first = null;
                    ch = read_while(function(ch){
                        if (ch >= "0" && ch <= "7") {
                            if (!first) {
                                first = ch;
                                return ++octal_len;
                        ***REMOVED***
                            else if (first <= "3" && octal_len <= 2) return ++octal_len;
                            else if (first >= "4" && octal_len <= 1) return ++octal_len;
                    ***REMOVED***
                        return false;
                ***REMOVED***);
                    if (octal_len > 0) ch = String.fromCharCode(parseInt(ch, 8));
                    else ch = read_escaped_char(true);
            ***REMOVED***
                else if (ch == quote) break;
                else if (ch == "\n") throw EX_EOF;
                ret += ch;
        ***REMOVED***
            return token("string", ret);
    ***REMOVED***);
***REMOVED***;

    function read_line_comment() {
        next();
        var i = find("\n"), ret;
        if (i == -1) {
            ret = S.text.substr(S.pos);
            S.pos = S.text.length;
    ***REMOVED*** else {
            ret = S.text.substring(S.pos, i);
            S.pos = i;
    ***REMOVED***
        return token("comment1", ret, true);
***REMOVED***;

    function read_multiline_comment() {
        next();
        return with_eof_error("Unterminated multiline comment", function(){
            var i = find("*/", true),
            text = S.text.substring(S.pos, i);
            S.pos = i + 2;
            S.line += text.split("\n").length - 1;
            S.newline_before = S.newline_before || text.indexOf("\n") >= 0;

            // https://github.com/mishoo/UglifyJS/issues/#issue/100
            if (/^@cc_on/i.test(text)) {
                warn("WARNING: at line " + S.line);
                warn("*** Found \"conditional comment\": " + text);
                warn("*** UglifyJS DISCARDS ALL COMMENTS.  This means your code might no longer work properly in Internet Explorer.");
        ***REMOVED***

            return token("comment2", text, true);
    ***REMOVED***);
***REMOVED***;

    function read_name() {
        var backslash = false, name = "", ch, escaped = false, hex;
        while ((ch = peek()) != null) {
            if (!backslash) {
                if (ch == "\\") escaped = backslash = true, next();
                else if (is_identifier_char(ch)) name += next();
                else break;
        ***REMOVED***
            else {
                if (ch != "u") parse_error("Expecting UnicodeEscapeSequence -- uXXXX");
                ch = read_escaped_char();
                if (!is_identifier_char(ch)) parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                name += ch;
                backslash = false;
        ***REMOVED***
    ***REMOVED***
        if (HOP(KEYWORDS, name) && escaped) {
            hex = name.charCodeAt(0).toString(16).toUpperCase();
            name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1);
    ***REMOVED***
        return name;
***REMOVED***;

    function read_regexp(regexp) {
        return with_eof_error("Unterminated regular expression", function(){
            var prev_backslash = false, ch, in_class = false;
            while ((ch = next(true))) if (prev_backslash) {
                regexp += "\\" + ch;
                prev_backslash = false;
        ***REMOVED*** else if (ch == "[") {
                in_class = true;
                regexp += ch;
        ***REMOVED*** else if (ch == "]" && in_class) {
                in_class = false;
                regexp += ch;
        ***REMOVED*** else if (ch == "/" && !in_class) {
                break;
        ***REMOVED*** else if (ch == "\\") {
                prev_backslash = true;
        ***REMOVED*** else {
                regexp += ch;
        ***REMOVED***
            var mods = read_name();
            return token("regexp", [ regexp, mods ]);
    ***REMOVED***);
***REMOVED***;

    function read_operator(prefix) {
        function grow(op) {
            if (!peek()) return op;
            var bigger = op + peek();
            if (HOP(OPERATORS, bigger)) {
                next();
                return grow(bigger);
        ***REMOVED*** else {
                return op;
        ***REMOVED***
    ***REMOVED***;
        return token("operator", grow(prefix || next()));
***REMOVED***;

    function handle_slash() {
        next();
        var regex_allowed = S.regex_allowed;
        switch (peek()) {
          case "/":
            S.comments_before.push(read_line_comment());
            S.regex_allowed = regex_allowed;
            return next_token();
          case "*":
            S.comments_before.push(read_multiline_comment());
            S.regex_allowed = regex_allowed;
            return next_token();
    ***REMOVED***
        return S.regex_allowed ? read_regexp("") : read_operator("/");
***REMOVED***;

    function handle_dot() {
        next();
        return is_digit(peek())
            ? read_num(".")
            : token("punc", ".");
***REMOVED***;

    function read_word() {
        var word = read_name();
        return !HOP(KEYWORDS, word)
            ? token("name", word)
            : HOP(OPERATORS, word)
            ? token("operator", word)
            : HOP(KEYWORDS_ATOM, word)
            ? token("atom", word)
            : token("keyword", word);
***REMOVED***;

    function with_eof_error(eof_error, cont) {
        try {
            return cont();
    ***REMOVED*** catch(ex) {
            if (ex === EX_EOF) parse_error(eof_error);
            else throw ex;
    ***REMOVED***
***REMOVED***;

    function next_token(force_regexp) {
        if (force_regexp != null)
            return read_regexp(force_regexp);
        skip_whitespace();
        start_token();
        var ch = peek();
        if (!ch) return token("eof");
        if (is_digit(ch)) return read_num();
        if (ch == '"' || ch == "'") return read_string();
        if (HOP(PUNC_CHARS, ch)) return token("punc", next());
        if (ch == ".") return handle_dot();
        if (ch == "/") return handle_slash();
        if (HOP(OPERATOR_CHARS, ch)) return read_operator();
        if (ch == "\\" || is_identifier_start(ch)) return read_word();
        parse_error("Unexpected character '" + ch + "'");
***REMOVED***;

    next_token.context = function(nc) {
        if (nc) S = nc;
        return S;
***REMOVED***;

    return next_token;

***REMOVED***;

/* -----[ Parser (constants) ]----- */

var UNARY_PREFIX = array_to_hash([
    "typeof",
    "void",
    "delete",
    "--",
    "++",
    "!",
    "~",
    "-",
    "+"
]);

var UNARY_POSTFIX = array_to_hash([ "--", "++" ]);

var ASSIGNMENT = (function(a, ret, i){
    while (i < a.length) {
        ret[a[i]] = a[i].substr(0, a[i].length - 1);
        i++;
***REMOVED***
    return ret;
***REMOVED***)(
    ["+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="],
    { "=": true ***REMOVED***,
    0
);

var PRECEDENCE = (function(a, ret){
    for (var i = 0, n = 1; i < a.length; ++i, ++n) {
        var b = a[i];
        for (var j = 0; j < b.length; ++j) {
            ret[b[j]] = n;
    ***REMOVED***
***REMOVED***
    return ret;
***REMOVED***)(
    [
        ["||"],
        ["&&"],
        ["|"],
        ["^"],
        ["&"],
        ["==", "===", "!=", "!=="],
        ["<", ">", "<=", ">=", "in", "instanceof"],
        [">>", "<<", ">>>"],
        ["+", "-"],
        ["*", "/", "%"]
    ],
    {***REMOVED***
);

var STATEMENTS_WITH_LABELS = array_to_hash([ "for", "do", "while", "switch" ]);

var ATOMIC_START_TOKEN = array_to_hash([ "atom", "num", "string", "regexp", "name" ]);

/* -----[ Parser ]----- */

function NodeWithToken(str, start, end) {
    this.name = str;
    this.start = start;
    this.end = end;
***REMOVED***;

NodeWithToken.prototype.toString = function() { return this.name; ***REMOVED***;

function parse($TEXT, exigent_mode, embed_tokens) {

    var S = {
        input         : typeof $TEXT == "string" ? tokenizer($TEXT, true) : $TEXT,
        token         : null,
        prev          : null,
        peeked        : null,
        in_function   : 0,
        in_directives : true,
        in_loop       : 0,
        labels        : []
***REMOVED***;

    S.token = next();

    function is(type, value) {
        return is_token(S.token, type, value);
***REMOVED***;

    function peek() { return S.peeked || (S.peeked = S.input()); ***REMOVED***;

    function next() {
        S.prev = S.token;
        if (S.peeked) {
            S.token = S.peeked;
            S.peeked = null;
    ***REMOVED*** else {
            S.token = S.input();
    ***REMOVED***
        S.in_directives = S.in_directives && (
            S.token.type == "string" || is("punc", ";")
        );
        return S.token;
***REMOVED***;

    function prev() {
        return S.prev;
***REMOVED***;

    function croak(msg, line, col, pos) {
        var ctx = S.input.context();
        js_error(msg,
                 line != null ? line : ctx.tokline,
                 col != null ? col : ctx.tokcol,
                 pos != null ? pos : ctx.tokpos);
***REMOVED***;

    function token_error(token, msg) {
        croak(msg, token.line, token.col);
***REMOVED***;

    function unexpected(token) {
        if (token == null)
            token = S.token;
        token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
***REMOVED***;

    function expect_token(type, val) {
        if (is(type, val)) {
            return next();
    ***REMOVED***
        token_error(S.token, "Unexpected token " + S.token.type + ", expected " + type);
***REMOVED***;

    function expect(punc) { return expect_token("punc", punc); ***REMOVED***;

    function can_insert_semicolon() {
        return !exigent_mode && (
            S.token.nlb || is("eof") || is("punc", "***REMOVED***")
        );
***REMOVED***;

    function semicolon() {
        if (is("punc", ";")) next();
        else if (!can_insert_semicolon()) unexpected();
***REMOVED***;

    function as() {
        return slice(arguments);
***REMOVED***;

    function parenthesised() {
        expect("(");
        var ex = expression();
        expect(")");
        return ex;
***REMOVED***;

    function add_tokens(str, start, end) {
        return str instanceof NodeWithToken ? str : new NodeWithToken(str, start, end);
***REMOVED***;

    function maybe_embed_tokens(parser) {
        if (embed_tokens) return function() {
            var start = S.token;
            var ast = parser.apply(this, arguments);
            ast[0] = add_tokens(ast[0], start, prev());
            return ast;
    ***REMOVED***;
        else return parser;
***REMOVED***;

    var statement = maybe_embed_tokens(function() {
        if (is("operator", "/") || is("operator", "/=")) {
            S.peeked = null;
            S.token = S.input(S.token.value.substr(1)); // force regexp
    ***REMOVED***
        switch (S.token.type) {
          case "string":
            var dir = S.in_directives, stat = simple_statement();
            if (dir && stat[1][0] == "string" && !is("punc", ","))
                return as("directive", stat[1][1]);
            return stat;
          case "num":
          case "regexp":
          case "operator":
          case "atom":
            return simple_statement();

          case "name":
            return is_token(peek(), "punc", ":")
                ? labeled_statement(prog1(S.token.value, next, next))
                : simple_statement();

          case "punc":
            switch (S.token.value) {
              case "{":
                return as("block", block_());
              case "[":
              case "(":
                return simple_statement();
              case ";":
                next();
                return as("block");
              default:
                unexpected();
        ***REMOVED***

          case "keyword":
            switch (prog1(S.token.value, next)) {
              case "break":
                return break_cont("break");

              case "continue":
                return break_cont("continue");

              case "debugger":
                semicolon();
                return as("debugger");

              case "do":
                return (function(body){
                    expect_token("keyword", "while");
                    return as("do", prog1(parenthesised, semicolon), body);
            ***REMOVED***)(in_loop(statement));

              case "for":
                return for_();

              case "function":
                return function_(true);

              case "if":
                return if_();

              case "return":
                if (S.in_function == 0)
                    croak("'return' outside of function");
                return as("return",
                          is("punc", ";")
                          ? (next(), null)
                          : can_insert_semicolon()
                          ? null
                          : prog1(expression, semicolon));

              case "switch":
                return as("switch", parenthesised(), switch_block_());

              case "throw":
                if (S.token.nlb)
                    croak("Illegal newline after 'throw'");
                return as("throw", prog1(expression, semicolon));

              case "try":
                return try_();

              case "var":
                return prog1(var_, semicolon);

              case "const":
                return prog1(const_, semicolon);

              case "while":
                return as("while", parenthesised(), in_loop(statement));

              case "with":
                return as("with", parenthesised(), statement());

              default:
                unexpected();
        ***REMOVED***
    ***REMOVED***
***REMOVED***);

    function labeled_statement(label) {
        S.labels.push(label);
        var start = S.token, stat = statement();
        if (exigent_mode && !HOP(STATEMENTS_WITH_LABELS, stat[0]))
            unexpected(start);
        S.labels.pop();
        return as("label", label, stat);
***REMOVED***;

    function simple_statement() {
        return as("stat", prog1(expression, semicolon));
***REMOVED***;

    function break_cont(type) {
        var name;
        if (!can_insert_semicolon()) {
            name = is("name") ? S.token.value : null;
    ***REMOVED***
        if (name != null) {
            next();
            if (!member(name, S.labels))
                croak("Label " + name + " without matching loop or statement");
    ***REMOVED***
        else if (S.in_loop == 0)
            croak(type + " not inside a loop or switch");
        semicolon();
        return as(type, name);
***REMOVED***;

    function for_() {
        expect("(");
        var init = null;
        if (!is("punc", ";")) {
            init = is("keyword", "var")
                ? (next(), var_(true))
                : expression(true, true);
            if (is("operator", "in")) {
                if (init[0] == "var" && init[1].length > 1)
                    croak("Only one variable declaration allowed in for..in loop");
                return for_in(init);
        ***REMOVED***
    ***REMOVED***
        return regular_for(init);
***REMOVED***;

    function regular_for(init) {
        expect(";");
        var test = is("punc", ";") ? null : expression();
        expect(";");
        var step = is("punc", ")") ? null : expression();
        expect(")");
        return as("for", init, test, step, in_loop(statement));
***REMOVED***;

    function for_in(init) {
        var lhs = init[0] == "var" ? as("name", init[1][0]) : init;
        next();
        var obj = expression();
        expect(")");
        return as("for-in", init, lhs, obj, in_loop(statement));
***REMOVED***;

    var function_ = function(in_statement) {
        var name = is("name") ? prog1(S.token.value, next) : null;
        if (in_statement && !name)
            unexpected();
        expect("(");
        return as(in_statement ? "defun" : "function",
                  name,
                  // arguments
                  (function(first, a){
                      while (!is("punc", ")")) {
                          if (first) first = false; else expect(",");
                          if (!is("name")) unexpected();
                          a.push(S.token.value);
                          next();
                  ***REMOVED***
                      next();
                      return a;
              ***REMOVED***)(true, []),
                  // body
                  (function(){
                      ++S.in_function;
                      var loop = S.in_loop;
                      S.in_directives = true;
                      S.in_loop = 0;
                      var a = block_();
                      --S.in_function;
                      S.in_loop = loop;
                      return a;
              ***REMOVED***)());
***REMOVED***;

    function if_() {
        var cond = parenthesised(), body = statement(), belse;
        if (is("keyword", "else")) {
            next();
            belse = statement();
    ***REMOVED***
        return as("if", cond, body, belse);
***REMOVED***;

    function block_() {
        expect("{");
        var a = [];
        while (!is("punc", "***REMOVED***")) {
            if (is("eof")) unexpected();
            a.push(statement());
    ***REMOVED***
        next();
        return a;
***REMOVED***;

    var switch_block_ = curry(in_loop, function(){
        expect("{");
        var a = [], cur = null;
        while (!is("punc", "***REMOVED***")) {
            if (is("eof")) unexpected();
            if (is("keyword", "case")) {
                next();
                cur = [];
                a.push([ expression(), cur ]);
                expect(":");
        ***REMOVED***
            else if (is("keyword", "default")) {
                next();
                expect(":");
                cur = [];
                a.push([ null, cur ]);
        ***REMOVED***
            else {
                if (!cur) unexpected();
                cur.push(statement());
        ***REMOVED***
    ***REMOVED***
        next();
        return a;
***REMOVED***);

    function try_() {
        var body = block_(), bcatch, bfinally;
        if (is("keyword", "catch")) {
            next();
            expect("(");
            if (!is("name"))
                croak("Name expected");
            var name = S.token.value;
            next();
            expect(")");
            bcatch = [ name, block_() ];
    ***REMOVED***
        if (is("keyword", "finally")) {
            next();
            bfinally = block_();
    ***REMOVED***
        if (!bcatch && !bfinally)
            croak("Missing catch/finally blocks");
        return as("try", body, bcatch, bfinally);
***REMOVED***;

    function vardefs(no_in) {
        var a = [];
        for (;;) {
            if (!is("name"))
                unexpected();
            var name = S.token.value;
            next();
            if (is("operator", "=")) {
                next();
                a.push([ name, expression(false, no_in) ]);
        ***REMOVED*** else {
                a.push([ name ]);
        ***REMOVED***
            if (!is("punc", ","))
                break;
            next();
    ***REMOVED***
        return a;
***REMOVED***;

    function var_(no_in) {
        return as("var", vardefs(no_in));
***REMOVED***;

    function const_() {
        return as("const", vardefs());
***REMOVED***;

    function new_() {
        var newexp = expr_atom(false), args;
        if (is("punc", "(")) {
            next();
            args = expr_list(")");
    ***REMOVED*** else {
            args = [];
    ***REMOVED***
        return subscripts(as("new", newexp, args), true);
***REMOVED***;

    var expr_atom = maybe_embed_tokens(function(allow_calls) {
        if (is("operator", "new")) {
            next();
            return new_();
    ***REMOVED***
        if (is("punc")) {
            switch (S.token.value) {
              case "(":
                next();
                return subscripts(prog1(expression, curry(expect, ")")), allow_calls);
              case "[":
                next();
                return subscripts(array_(), allow_calls);
              case "{":
                next();
                return subscripts(object_(), allow_calls);
        ***REMOVED***
            unexpected();
    ***REMOVED***
        if (is("keyword", "function")) {
            next();
            return subscripts(function_(false), allow_calls);
    ***REMOVED***
        if (HOP(ATOMIC_START_TOKEN, S.token.type)) {
            var atom = S.token.type == "regexp"
                ? as("regexp", S.token.value[0], S.token.value[1])
                : as(S.token.type, S.token.value);
            return subscripts(prog1(atom, next), allow_calls);
    ***REMOVED***
        unexpected();
***REMOVED***);

    function expr_list(closing, allow_trailing_comma, allow_empty) {
        var first = true, a = [];
        while (!is("punc", closing)) {
            if (first) first = false; else expect(",");
            if (allow_trailing_comma && is("punc", closing)) break;
            if (is("punc", ",") && allow_empty) {
                a.push([ "atom", "undefined" ]);
        ***REMOVED*** else {
                a.push(expression(false));
        ***REMOVED***
    ***REMOVED***
        next();
        return a;
***REMOVED***;

    function array_() {
        return as("array", expr_list("]", !exigent_mode, true));
***REMOVED***;

    function object_() {
        var first = true, a = [];
        while (!is("punc", "***REMOVED***")) {
            if (first) first = false; else expect(",");
            if (!exigent_mode && is("punc", "***REMOVED***"))
                // allow trailing comma
                break;
            var type = S.token.type;
            var name = as_property_name();
            if (type == "name" && (name == "get" || name == "set") && !is("punc", ":")) {
                a.push([ as_name(), function_(false), name ]);
        ***REMOVED*** else {
                expect(":");
                a.push([ name, expression(false) ]);
        ***REMOVED***
    ***REMOVED***
        next();
        return as("object", a);
***REMOVED***;

    function as_property_name() {
        switch (S.token.type) {
          case "num":
          case "string":
            return prog1(S.token.value, next);
    ***REMOVED***
        return as_name();
***REMOVED***;

    function as_name() {
        switch (S.token.type) {
          case "name":
          case "operator":
          case "keyword":
          case "atom":
            return prog1(S.token.value, next);
          default:
            unexpected();
    ***REMOVED***
***REMOVED***;

    function subscripts(expr, allow_calls) {
        if (is("punc", ".")) {
            next();
            return subscripts(as("dot", expr, as_name()), allow_calls);
    ***REMOVED***
        if (is("punc", "[")) {
            next();
            return subscripts(as("sub", expr, prog1(expression, curry(expect, "]"))), allow_calls);
    ***REMOVED***
        if (allow_calls && is("punc", "(")) {
            next();
            return subscripts(as("call", expr, expr_list(")")), true);
    ***REMOVED***
        return expr;
***REMOVED***;

    function maybe_unary(allow_calls) {
        if (is("operator") && HOP(UNARY_PREFIX, S.token.value)) {
            return make_unary("unary-prefix",
                              prog1(S.token.value, next),
                              maybe_unary(allow_calls));
    ***REMOVED***
        var val = expr_atom(allow_calls);
        while (is("operator") && HOP(UNARY_POSTFIX, S.token.value) && !S.token.nlb) {
            val = make_unary("unary-postfix", S.token.value, val);
            next();
    ***REMOVED***
        return val;
***REMOVED***;

    function make_unary(tag, op, expr) {
        if ((op == "++" || op == "--") && !is_assignable(expr))
            croak("Invalid use of " + op + " operator");
        return as(tag, op, expr);
***REMOVED***;

    function expr_op(left, min_prec, no_in) {
        var op = is("operator") ? S.token.value : null;
        if (op && op == "in" && no_in) op = null;
        var prec = op != null ? PRECEDENCE[op] : null;
        if (prec != null && prec > min_prec) {
            next();
            var right = expr_op(maybe_unary(true), prec, no_in);
            return expr_op(as("binary", op, left, right), min_prec, no_in);
    ***REMOVED***
        return left;
***REMOVED***;

    function expr_ops(no_in) {
        return expr_op(maybe_unary(true), 0, no_in);
***REMOVED***;

    function maybe_conditional(no_in) {
        var expr = expr_ops(no_in);
        if (is("operator", "?")) {
            next();
            var yes = expression(false);
            expect(":");
            return as("conditional", expr, yes, expression(false, no_in));
    ***REMOVED***
        return expr;
***REMOVED***;

    function is_assignable(expr) {
        if (!exigent_mode) return true;
        switch (expr[0]+"") {
          case "dot":
          case "sub":
          case "new":
          case "call":
            return true;
          case "name":
            return expr[1] != "this";
    ***REMOVED***
***REMOVED***;

    function maybe_assign(no_in) {
        var left = maybe_conditional(no_in), val = S.token.value;
        if (is("operator") && HOP(ASSIGNMENT, val)) {
            if (is_assignable(left)) {
                next();
                return as("assign", ASSIGNMENT[val], left, maybe_assign(no_in));
        ***REMOVED***
            croak("Invalid assignment");
    ***REMOVED***
        return left;
***REMOVED***;

    var expression = maybe_embed_tokens(function(commas, no_in) {
        if (arguments.length == 0)
            commas = true;
        var expr = maybe_assign(no_in);
        if (commas && is("punc", ",")) {
            next();
            return as("seq", expr, expression(true, no_in));
    ***REMOVED***
        return expr;
***REMOVED***);

    function in_loop(cont) {
        try {
            ++S.in_loop;
            return cont();
    ***REMOVED*** finally {
            --S.in_loop;
    ***REMOVED***
***REMOVED***;

    return as("toplevel", (function(a){
        while (!is("eof"))
            a.push(statement());
        return a;
***REMOVED***)([]));

***REMOVED***;

/* -----[ Utilities ]----- */

function curry(f) {
    var args = slice(arguments, 1);
    return function() { return f.apply(this, args.concat(slice(arguments))); ***REMOVED***;
***REMOVED***;

function prog1(ret) {
    if (ret instanceof Function)
        ret = ret();
    for (var i = 1, n = arguments.length; --n > 0; ++i)
        arguments[i]();
    return ret;
***REMOVED***;

function array_to_hash(a) {
    var ret = {***REMOVED***;
    for (var i = 0; i < a.length; ++i)
        ret[a[i]] = true;
    return ret;
***REMOVED***;

function slice(a, start) {
    return Array.prototype.slice.call(a, start || 0);
***REMOVED***;

function characters(str) {
    return str.split("");
***REMOVED***;

function member(name, array) {
    for (var i = array.length; --i >= 0;)
        if (array[i] == name)
            return true;
    return false;
***REMOVED***;

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
***REMOVED***;

var warn = function() {***REMOVED***;

/* -----[ Exports ]----- */

exports.tokenizer = tokenizer;
exports.parse = parse;
exports.slice = slice;
exports.curry = curry;
exports.member = member;
exports.array_to_hash = array_to_hash;
exports.PRECEDENCE = PRECEDENCE;
exports.KEYWORDS_ATOM = KEYWORDS_ATOM;
exports.RESERVED_WORDS = RESERVED_WORDS;
exports.KEYWORDS = KEYWORDS;
exports.ATOMIC_START_TOKEN = ATOMIC_START_TOKEN;
exports.OPERATORS = OPERATORS;
exports.is_alphanumeric_char = is_alphanumeric_char;
exports.is_identifier_start = is_identifier_start;
exports.is_identifier_char = is_identifier_char;
exports.set_logger = function(logger) {
    warn = logger;
***REMOVED***;

// Local variables:
// js-indent-level: 4
// End:
***REMOVED***);define('uglifyjs/squeeze-more', ["require", "exports", "module", "./parse-js", "./squeeze-more"], function(require, exports, module) {
var jsp = require("./parse-js"),
    pro = require("./process"),
    slice = jsp.slice,
    member = jsp.member,
    curry = jsp.curry,
    MAP = pro.MAP,
    PRECEDENCE = jsp.PRECEDENCE,
    OPERATORS = jsp.OPERATORS;

function ast_squeeze_more(ast) {
    var w = pro.ast_walker(), walk = w.walk, scope;
    function with_scope(s, cont) {
        var save = scope, ret;
        scope = s;
        ret = cont();
        scope = save;
        return ret;
***REMOVED***;
    function _lambda(name, args, body) {
        return [ this[0], name, args, with_scope(body.scope, curry(MAP, body, walk)) ];
***REMOVED***;
    return w.with_walkers({
        "toplevel": function(body) {
            return [ this[0], with_scope(this.scope, curry(MAP, body, walk)) ];
      ***REMOVED***
        "function": _lambda,
        "defun": _lambda,
        "new": function(ctor, args) {
            if (ctor[0] == "name") {
                if (ctor[1] == "Array" && !scope.has("Array")) {
                    if (args.length != 1) {
                        return [ "array", args ];
                ***REMOVED*** else {
                        return walk([ "call", [ "name", "Array" ], args ]);
                ***REMOVED***
            ***REMOVED*** else if (ctor[1] == "Object" && !scope.has("Object")) {
                    if (!args.length) {
                        return [ "object", [] ];
                ***REMOVED*** else {
                        return walk([ "call", [ "name", "Object" ], args ]);
                ***REMOVED***
            ***REMOVED*** else if ((ctor[1] == "RegExp" || ctor[1] == "Function" || ctor[1] == "Error") && !scope.has(ctor[1])) {
                    return walk([ "call", [ "name", ctor[1] ], args]);
            ***REMOVED***
        ***REMOVED***
      ***REMOVED***
        "call": function(expr, args) {
            if (expr[0] == "dot" && expr[1][0] == "string" && args.length == 1
                && (args[0][1] > 0 && expr[2] == "substring" || expr[2] == "substr")) {
                return [ "call", [ "dot", expr[1], "slice"], args];
        ***REMOVED***
            if (expr[0] == "dot" && expr[2] == "toString" && args.length == 0) {
                // foo.toString()  ==>  foo+""
                if (expr[1][0] == "string") return expr[1];
                return [ "binary", "+", expr[1], [ "string", "" ]];
        ***REMOVED***
            if (expr[0] == "name") {
                if (expr[1] == "Array" && args.length != 1 && !scope.has("Array")) {
                    return [ "array", args ];
            ***REMOVED***
                if (expr[1] == "Object" && !args.length && !scope.has("Object")) {
                    return [ "object", [] ];
            ***REMOVED***
                if (expr[1] == "String" && !scope.has("String")) {
                    return [ "binary", "+", args[0], [ "string", "" ]];
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
  ***REMOVED*** function() {
        return walk(pro.ast_add_scope(ast));
***REMOVED***);
***REMOVED***;

exports.ast_squeeze_more = ast_squeeze_more;

// Local variables:
// js-indent-level: 4
// End:
***REMOVED***);
define('uglifyjs/process', ["require", "exports", "module", "./parse-js", "./squeeze-more"], function(require, exports, module) {
/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.

  This version is suitable for Node.js.  With minimal changes (the
  exports stuff) it should work on any JS platform.

  This file implements some AST processors.  They work on data built
  by parse-js.

  Exported functions:

    - ast_mangle(ast, options) -- mangles the variable/function names
      in the AST.  Returns an AST.

    - ast_squeeze(ast) -- employs various optimizations to make the
      final generated code even smaller.  Returns an AST.

    - gen_code(ast, options) -- generates JS code from the AST.  Pass
      true (or an object, see the code for some options) as second
      argument to get "pretty" (indented) code.

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2010 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

var jsp = require("./parse-js"),
    curry = jsp.curry,
    slice = jsp.slice,
    member = jsp.member,
    is_identifier_char = jsp.is_identifier_char,
    PRECEDENCE = jsp.PRECEDENCE,
    OPERATORS = jsp.OPERATORS;

/* -----[ helper for AST traversal ]----- */

function ast_walker() {
    function _vardefs(defs) {
        return [ this[0], MAP(defs, function(def){
            var a = [ def[0] ];
            if (def.length > 1)
                a[1] = walk(def[1]);
            return a;
    ***REMOVED***) ];
***REMOVED***;
    function _block(statements) {
        var out = [ this[0] ];
        if (statements != null)
            out.push(MAP(statements, walk));
        return out;
***REMOVED***;
    var walkers = {
        "string": function(str) {
            return [ this[0], str ];
      ***REMOVED***
        "num": function(num) {
            return [ this[0], num ];
      ***REMOVED***
        "name": function(name) {
            return [ this[0], name ];
      ***REMOVED***
        "toplevel": function(statements) {
            return [ this[0], MAP(statements, walk) ];
      ***REMOVED***
        "block": _block,
        "splice": _block,
        "var": _vardefs,
        "const": _vardefs,
        "try": function(t, c, f) {
            return [
                this[0],
                MAP(t, walk),
                c != null ? [ c[0], MAP(c[1], walk) ] : null,
                f != null ? MAP(f, walk) : null
            ];
      ***REMOVED***
        "throw": function(expr) {
            return [ this[0], walk(expr) ];
      ***REMOVED***
        "new": function(ctor, args) {
            return [ this[0], walk(ctor), MAP(args, walk) ];
      ***REMOVED***
        "switch": function(expr, body) {
            return [ this[0], walk(expr), MAP(body, function(branch){
                return [ branch[0] ? walk(branch[0]) : null,
                         MAP(branch[1], walk) ];
        ***REMOVED***) ];
      ***REMOVED***
        "break": function(label) {
            return [ this[0], label ];
      ***REMOVED***
        "continue": function(label) {
            return [ this[0], label ];
      ***REMOVED***
        "conditional": function(cond, t, e) {
            return [ this[0], walk(cond), walk(t), walk(e) ];
      ***REMOVED***
        "assign": function(op, lvalue, rvalue) {
            return [ this[0], op, walk(lvalue), walk(rvalue) ];
      ***REMOVED***
        "dot": function(expr) {
            return [ this[0], walk(expr) ].concat(slice(arguments, 1));
      ***REMOVED***
        "call": function(expr, args) {
            return [ this[0], walk(expr), MAP(args, walk) ];
      ***REMOVED***
        "function": function(name, args, body) {
            return [ this[0], name, args.slice(), MAP(body, walk) ];
      ***REMOVED***
        "debugger": function() {
            return [ this[0] ];
      ***REMOVED***
        "defun": function(name, args, body) {
            return [ this[0], name, args.slice(), MAP(body, walk) ];
      ***REMOVED***
        "if": function(conditional, t, e) {
            return [ this[0], walk(conditional), walk(t), walk(e) ];
      ***REMOVED***
        "for": function(init, cond, step, block) {
            return [ this[0], walk(init), walk(cond), walk(step), walk(block) ];
      ***REMOVED***
        "for-in": function(vvar, key, hash, block) {
            return [ this[0], walk(vvar), walk(key), walk(hash), walk(block) ];
      ***REMOVED***
        "while": function(cond, block) {
            return [ this[0], walk(cond), walk(block) ];
      ***REMOVED***
        "do": function(cond, block) {
            return [ this[0], walk(cond), walk(block) ];
      ***REMOVED***
        "return": function(expr) {
            return [ this[0], walk(expr) ];
      ***REMOVED***
        "binary": function(op, left, right) {
            return [ this[0], op, walk(left), walk(right) ];
      ***REMOVED***
        "unary-prefix": function(op, expr) {
            return [ this[0], op, walk(expr) ];
      ***REMOVED***
        "unary-postfix": function(op, expr) {
            return [ this[0], op, walk(expr) ];
      ***REMOVED***
        "sub": function(expr, subscript) {
            return [ this[0], walk(expr), walk(subscript) ];
      ***REMOVED***
        "object": function(props) {
            return [ this[0], MAP(props, function(p){
                return p.length == 2
                    ? [ p[0], walk(p[1]) ]
                    : [ p[0], walk(p[1]), p[2] ]; // get/set-ter
        ***REMOVED***) ];
      ***REMOVED***
        "regexp": function(rx, mods) {
            return [ this[0], rx, mods ];
      ***REMOVED***
        "array": function(elements) {
            return [ this[0], MAP(elements, walk) ];
      ***REMOVED***
        "stat": function(stat) {
            return [ this[0], walk(stat) ];
      ***REMOVED***
        "seq": function() {
            return [ this[0] ].concat(MAP(slice(arguments), walk));
      ***REMOVED***
        "label": function(name, block) {
            return [ this[0], name, walk(block) ];
      ***REMOVED***
        "with": function(expr, block) {
            return [ this[0], walk(expr), walk(block) ];
      ***REMOVED***
        "atom": function(name) {
            return [ this[0], name ];
      ***REMOVED***
        "directive": function(dir) {
            return [ this[0], dir ];
    ***REMOVED***
***REMOVED***;

    var user = {***REMOVED***;
    var stack = [];
    function walk(ast) {
        if (ast == null)
            return null;
        try {
            stack.push(ast);
            var type = ast[0];
            var gen = user[type];
            if (gen) {
                var ret = gen.apply(ast, ast.slice(1));
                if (ret != null)
                    return ret;
        ***REMOVED***
            gen = walkers[type];
            return gen.apply(ast, ast.slice(1));
    ***REMOVED*** finally {
            stack.pop();
    ***REMOVED***
***REMOVED***;

    function dive(ast) {
        if (ast == null)
            return null;
        try {
            stack.push(ast);
            return walkers[ast[0]].apply(ast, ast.slice(1));
    ***REMOVED*** finally {
            stack.pop();
    ***REMOVED***
***REMOVED***;

    function with_walkers(walkers, cont){
        var save = {***REMOVED***, i;
        for (i in walkers) if (HOP(walkers, i)) {
            save[i] = user[i];
            user[i] = walkers[i];
    ***REMOVED***
        var ret = cont();
        for (i in save) if (HOP(save, i)) {
            if (!save[i]) delete user[i];
            else user[i] = save[i];
    ***REMOVED***
        return ret;
***REMOVED***;

    return {
        walk: walk,
        dive: dive,
        with_walkers: with_walkers,
        parent: function() {
            return stack[stack.length - 2]; // last one is current node
      ***REMOVED***
        stack: function() {
            return stack;
    ***REMOVED***
***REMOVED***;
***REMOVED***;

/* -----[ Scope and mangling ]----- */

function Scope(parent) {
    this.names = {***REMOVED***;        // names defined in this scope
    this.mangled = {***REMOVED***;      // mangled names (orig.name => mangled)
    this.rev_mangled = {***REMOVED***;  // reverse lookup (mangled => orig.name)
    this.cname = -1;        // current mangled name
    this.refs = {***REMOVED***;         // names referenced from this scope
    this.uses_with = false; // will become TRUE if with() is detected in this or any subscopes
    this.uses_eval = false; // will become TRUE if eval() is detected in this or any subscopes
    this.directives = [];   // directives activated from this scope
    this.parent = parent;   // parent scope
    this.children = [];     // sub-scopes
    if (parent) {
        this.level = parent.level + 1;
        parent.children.push(this);
***REMOVED*** else {
        this.level = 0;
***REMOVED***
***REMOVED***;

function base54_digits() {
    if (typeof DIGITS_OVERRIDE_FOR_TESTING != "undefined")
        return DIGITS_OVERRIDE_FOR_TESTING;
    else
        return "etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXV$JKQGYZ0516372984";
***REMOVED***

var base54 = (function(){
    var DIGITS = base54_digits();
    return function(num) {
        var ret = "", base = 54;
        do {
            ret += DIGITS.charAt(num % base);
            num = Math.floor(num / base);
            base = 64;
    ***REMOVED*** while (num > 0);
        return ret;
***REMOVED***;
***REMOVED***)();

Scope.prototype = {
    has: function(name) {
        for (var s = this; s; s = s.parent)
            if (HOP(s.names, name))
                return s;
  ***REMOVED***
    has_mangled: function(mname) {
        for (var s = this; s; s = s.parent)
            if (HOP(s.rev_mangled, mname))
                return s;
  ***REMOVED***
    toJSON: function() {
        return {
            names: this.names,
            uses_eval: this.uses_eval,
            uses_with: this.uses_with
    ***REMOVED***;
  ***REMOVED***

    next_mangled: function() {
        // we must be careful that the new mangled name:
        //
        // 1. doesn't shadow a mangled name from a parent
        //    scope, unless we don't reference the original
        //    name from this scope OR from any sub-scopes!
        //    This will get slow.
        //
        // 2. doesn't shadow an original name from a parent
        //    scope, in the event that the name is not mangled
        //    in the parent scope and we reference that name
        //    here OR IN ANY SUBSCOPES!
        //
        // 3. doesn't shadow a name that is referenced but not
        //    defined (possibly global defined elsewhere).
        for (;;) {
            var m = base54(++this.cname), prior;

            // case 1.
            prior = this.has_mangled(m);
            if (prior && this.refs[prior.rev_mangled[m]] === prior)
                continue;

            // case 2.
            prior = this.has(m);
            if (prior && prior !== this && this.refs[m] === prior && !prior.has_mangled(m))
                continue;

            // case 3.
            if (HOP(this.refs, m) && this.refs[m] == null)
                continue;

            // I got "do" once. :-/
            if (!is_identifier(m))
                continue;

            return m;
    ***REMOVED***
  ***REMOVED***
    set_mangle: function(name, m) {
        this.rev_mangled[m] = name;
        return this.mangled[name] = m;
  ***REMOVED***
    get_mangled: function(name, newMangle) {
        if (this.uses_eval || this.uses_with) return name; // no mangle if eval or with is in use
        var s = this.has(name);
        if (!s) return name; // not in visible scope, no mangle
        if (HOP(s.mangled, name)) return s.mangled[name]; // already mangled in this scope
        if (!newMangle) return name;                      // not found and no mangling requested
        return s.set_mangle(name, s.next_mangled());
  ***REMOVED***
    references: function(name) {
        return name && !this.parent || this.uses_with || this.uses_eval || this.refs[name];
  ***REMOVED***
    define: function(name, type) {
        if (name != null) {
            if (type == "var" || !HOP(this.names, name))
                this.names[name] = type || "var";
            return name;
    ***REMOVED***
  ***REMOVED***
    active_directive: function(dir) {
        return member(dir, this.directives) || this.parent && this.parent.active_directive(dir);
***REMOVED***
***REMOVED***;

function ast_add_scope(ast) {

    var current_scope = null;
    var w = ast_walker(), walk = w.walk;
    var having_eval = [];

    function with_new_scope(cont) {
        current_scope = new Scope(current_scope);
        current_scope.labels = new Scope();
        var ret = current_scope.body = cont();
        ret.scope = current_scope;
        current_scope = current_scope.parent;
        return ret;
***REMOVED***;

    function define(name, type) {
        return current_scope.define(name, type);
***REMOVED***;

    function reference(name) {
        current_scope.refs[name] = true;
***REMOVED***;

    function _lambda(name, args, body) {
        var is_defun = this[0] == "defun";
        return [ this[0], is_defun ? define(name, "defun") : name, args, with_new_scope(function(){
            if (!is_defun) define(name, "lambda");
            MAP(args, function(name){ define(name, "arg") ***REMOVED***);
            return MAP(body, walk);
    ***REMOVED***)];
***REMOVED***;

    function _vardefs(type) {
        return function(defs) {
            MAP(defs, function(d){
                define(d[0], type);
                if (d[1]) reference(d[0]);
        ***REMOVED***);
    ***REMOVED***;
***REMOVED***;

    function _breacont(label) {
        if (label)
            current_scope.labels.refs[label] = true;
***REMOVED***;

    return with_new_scope(function(){
        // process AST
        var ret = w.with_walkers({
            "function": _lambda,
            "defun": _lambda,
            "label": function(name, stat) { current_scope.labels.define(name) ***REMOVED***,
            "break": _breacont,
            "continue": _breacont,
            "with": function(expr, block) {
                for (var s = current_scope; s; s = s.parent)
                    s.uses_with = true;
          ***REMOVED***
            "var": _vardefs("var"),
            "const": _vardefs("const"),
            "try": function(t, c, f) {
                if (c != null) return [
                    this[0],
                    MAP(t, walk),
                    [ define(c[0], "catch"), MAP(c[1], walk) ],
                    f != null ? MAP(f, walk) : null
                ];
          ***REMOVED***
            "name": function(name) {
                if (name == "eval")
                    having_eval.push(current_scope);
                reference(name);
        ***REMOVED***
      ***REMOVED*** function(){
            return walk(ast);
    ***REMOVED***);

        // the reason why we need an additional pass here is
        // that names can be used prior to their definition.

        // scopes where eval was detected and their parents
        // are marked with uses_eval, unless they define the
        // "eval" name.
        MAP(having_eval, function(scope){
            if (!scope.has("eval")) while (scope) {
                scope.uses_eval = true;
                scope = scope.parent;
        ***REMOVED***
    ***REMOVED***);

        // for referenced names it might be useful to know
        // their origin scope.  current_scope here is the
        // toplevel one.
        function fixrefs(scope, i) {
            // do children first; order shouldn't matter
            for (i = scope.children.length; --i >= 0;)
                fixrefs(scope.children[i]);
            for (i in scope.refs) if (HOP(scope.refs, i)) {
                // find origin scope and propagate the reference to origin
                for (var origin = scope.has(i), s = scope; s; s = s.parent) {
                    s.refs[i] = origin;
                    if (s === origin) break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
        fixrefs(current_scope);

        return ret;
***REMOVED***);

***REMOVED***;

/* -----[ mangle names ]----- */

function ast_mangle(ast, options) {
    var w = ast_walker(), walk = w.walk, scope;
    options = defaults(options, {
        mangle       : true,
        toplevel     : false,
        defines      : null,
        except       : null,
        no_functions : false
***REMOVED***);

    function get_mangled(name, newMangle) {
        if (!options.mangle) return name;
        if (!options.toplevel && !scope.parent) return name; // don't mangle toplevel
        if (options.except && member(name, options.except))
            return name;
        if (options.no_functions && HOP(scope.names, name) &&
            (scope.names[name] == 'defun' || scope.names[name] == 'lambda'))
            return name;
        return scope.get_mangled(name, newMangle);
***REMOVED***;

    function get_define(name) {
        if (options.defines) {
            // we always lookup a defined symbol for the current scope FIRST, so declared
            // vars trump a DEFINE symbol, but if no such var is found, then match a DEFINE value
            if (!scope.has(name)) {
                if (HOP(options.defines, name)) {
                    return options.defines[name];
            ***REMOVED***
        ***REMOVED***
            return null;
    ***REMOVED***
***REMOVED***;

    function _lambda(name, args, body) {
        if (!options.no_functions && options.mangle) {
            var is_defun = this[0] == "defun", extra;
            if (name) {
                if (is_defun) name = get_mangled(name);
                else if (body.scope.references(name)) {
                    extra = {***REMOVED***;
                    if (!(scope.uses_eval || scope.uses_with))
                        name = extra[name] = scope.next_mangled();
                    else
                        extra[name] = name;
            ***REMOVED***
                else name = null;
        ***REMOVED***
    ***REMOVED***
        body = with_scope(body.scope, function(){
            args = MAP(args, function(name){ return get_mangled(name) ***REMOVED***);
            return MAP(body, walk);
      ***REMOVED*** extra);
        return [ this[0], name, args, body ];
***REMOVED***;

    function with_scope(s, cont, extra) {
        var _scope = scope;
        scope = s;
        if (extra) for (var i in extra) if (HOP(extra, i)) {
            s.set_mangle(i, extra[i]);
    ***REMOVED***
        for (var i in s.names) if (HOP(s.names, i)) {
            get_mangled(i, true);
    ***REMOVED***
        var ret = cont();
        ret.scope = s;
        scope = _scope;
        return ret;
***REMOVED***;

    function _vardefs(defs) {
        return [ this[0], MAP(defs, function(d){
            return [ get_mangled(d[0]), walk(d[1]) ];
    ***REMOVED***) ];
***REMOVED***;

    function _breacont(label) {
        if (label) return [ this[0], scope.labels.get_mangled(label) ];
***REMOVED***;

    return w.with_walkers({
        "function": _lambda,
        "defun": function() {
            // move function declarations to the top when
            // they are not in some block.
            var ast = _lambda.apply(this, arguments);
            switch (w.parent()[0]) {
              case "toplevel":
              case "function":
              case "defun":
                return MAP.at_top(ast);
        ***REMOVED***
            return ast;
      ***REMOVED***
        "label": function(label, stat) {
            if (scope.labels.refs[label]) return [
                this[0],
                scope.labels.get_mangled(label, true),
                walk(stat)
            ];
            return walk(stat);
      ***REMOVED***
        "break": _breacont,
        "continue": _breacont,
        "var": _vardefs,
        "const": _vardefs,
        "name": function(name) {
            return get_define(name) || [ this[0], get_mangled(name) ];
      ***REMOVED***
        "try": function(t, c, f) {
            return [ this[0],
                     MAP(t, walk),
                     c != null ? [ get_mangled(c[0]), MAP(c[1], walk) ] : null,
                     f != null ? MAP(f, walk) : null ];
      ***REMOVED***
        "toplevel": function(body) {
            var self = this;
            return with_scope(self.scope, function(){
                return [ self[0], MAP(body, walk) ];
        ***REMOVED***);
      ***REMOVED***
        "directive": function() {
            return MAP.at_top(this);
    ***REMOVED***
  ***REMOVED*** function() {
        return walk(ast_add_scope(ast));
***REMOVED***);
***REMOVED***;

/* -----[
   - compress foo["bar"] into foo.bar,
   - remove block brackets {***REMOVED*** where possible
   - join consecutive var declarations
   - various optimizations for IFs:
   - if (cond) foo(); else bar();  ==>  cond?foo():bar();
   - if (cond) foo();  ==>  cond&&foo();
   - if (foo) return bar(); else return baz();  ==> return foo?bar():baz(); // also for throw
   - if (foo) return bar(); else something();  ==> {if(foo)return bar();something()***REMOVED***
   ]----- */

var warn = function(){***REMOVED***;

function best_of(ast1, ast2) {
    return gen_code(ast1).length > gen_code(ast2[0] == "stat" ? ast2[1] : ast2).length ? ast2 : ast1;
***REMOVED***;

function last_stat(b) {
    if (b[0] == "block" && b[1] && b[1].length > 0)
        return b[1][b[1].length - 1];
    return b;
***REMOVED***

function aborts(t) {
    if (t) switch (last_stat(t)[0]) {
      case "return":
      case "break":
      case "continue":
      case "throw":
        return true;
***REMOVED***
***REMOVED***;

function boolean_expr(expr) {
    return ( (expr[0] == "unary-prefix"
              && member(expr[1], [ "!", "delete" ])) ||

             (expr[0] == "binary"
              && member(expr[1], [ "in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">" ])) ||

             (expr[0] == "binary"
              && member(expr[1], [ "&&", "||" ])
              && boolean_expr(expr[2])
              && boolean_expr(expr[3])) ||

             (expr[0] == "conditional"
              && boolean_expr(expr[2])
              && boolean_expr(expr[3])) ||

             (expr[0] == "assign"
              && expr[1] === true
              && boolean_expr(expr[3])) ||

             (expr[0] == "seq"
              && boolean_expr(expr[expr.length - 1]))
           );
***REMOVED***;

function empty(b) {
    return !b || (b[0] == "block" && (!b[1] || b[1].length == 0));
***REMOVED***;

function is_string(node) {
    return (node[0] == "string" ||
            node[0] == "unary-prefix" && node[1] == "typeof" ||
            node[0] == "binary" && node[1] == "+" &&
            (is_string(node[2]) || is_string(node[3])));
***REMOVED***;

var when_constant = (function(){

    var $NOT_CONSTANT = {***REMOVED***;

    // this can only evaluate constant expressions.  If it finds anything
    // not constant, it throws $NOT_CONSTANT.
    function evaluate(expr) {
        switch (expr[0]) {
          case "string":
          case "num":
            return expr[1];
          case "name":
          case "atom":
            switch (expr[1]) {
              case "true": return true;
              case "false": return false;
              case "null": return null;
        ***REMOVED***
            break;
          case "unary-prefix":
            switch (expr[1]) {
              case "!": return !evaluate(expr[2]);
              case "typeof": return typeof evaluate(expr[2]);
              case "~": return ~evaluate(expr[2]);
              case "-": return -evaluate(expr[2]);
              case "+": return +evaluate(expr[2]);
        ***REMOVED***
            break;
          case "binary":
            var left = expr[2], right = expr[3];
            switch (expr[1]) {
              case "&&"         : return evaluate(left) &&         evaluate(right);
              case "||"         : return evaluate(left) ||         evaluate(right);
              case "|"          : return evaluate(left) |          evaluate(right);
              case "&"          : return evaluate(left) &          evaluate(right);
              case "^"          : return evaluate(left) ^          evaluate(right);
              case "+"          : return evaluate(left) +          evaluate(right);
              case "*"          : return evaluate(left) *          evaluate(right);
              case "/"          : return evaluate(left) /          evaluate(right);
              case "%"          : return evaluate(left) %          evaluate(right);
              case "-"          : return evaluate(left) -          evaluate(right);
              case "<<"         : return evaluate(left) <<         evaluate(right);
              case ">>"         : return evaluate(left) >>         evaluate(right);
              case ">>>"        : return evaluate(left) >>>        evaluate(right);
              case "=="         : return evaluate(left) ==         evaluate(right);
              case "==="        : return evaluate(left) ===        evaluate(right);
              case "!="         : return evaluate(left) !=         evaluate(right);
              case "!=="        : return evaluate(left) !==        evaluate(right);
              case "<"          : return evaluate(left) <          evaluate(right);
              case "<="         : return evaluate(left) <=         evaluate(right);
              case ">"          : return evaluate(left) >          evaluate(right);
              case ">="         : return evaluate(left) >=         evaluate(right);
              case "in"         : return evaluate(left) in         evaluate(right);
              case "instanceof" : return evaluate(left) instanceof evaluate(right);
        ***REMOVED***
    ***REMOVED***
        throw $NOT_CONSTANT;
***REMOVED***;

    return function(expr, yes, no) {
        try {
            var val = evaluate(expr), ast;
            switch (typeof val) {
              case "string": ast =  [ "string", val ]; break;
              case "number": ast =  [ "num", val ]; break;
              case "boolean": ast =  [ "name", String(val) ]; break;
              default:
                if (val === null) { ast = [ "atom", "null" ]; break; ***REMOVED***
                throw new Error("Can't handle constant of type: " + (typeof val));
        ***REMOVED***
            return yes.call(expr, ast, val);
    ***REMOVED*** catch(ex) {
            if (ex === $NOT_CONSTANT) {
                if (expr[0] == "binary"
                    && (expr[1] == "===" || expr[1] == "!==")
                    && ((is_string(expr[2]) && is_string(expr[3]))
                        || (boolean_expr(expr[2]) && boolean_expr(expr[3])))) {
                    expr[1] = expr[1].substr(0, 2);
            ***REMOVED***
                else if (no && expr[0] == "binary"
                         && (expr[1] == "||" || expr[1] == "&&")) {
                    // the whole expression is not constant but the lval may be...
                    try {
                        var lval = evaluate(expr[2]);
                        expr = ((expr[1] == "&&" && (lval ? expr[3] : lval))    ||
                                (expr[1] == "||" && (lval ? lval    : expr[3])) ||
                                expr);
                ***REMOVED*** catch(ex2) {
                        // IGNORE... lval is not constant
                ***REMOVED***
            ***REMOVED***
                return no ? no.call(expr, expr) : null;
        ***REMOVED***
            else throw ex;
    ***REMOVED***
***REMOVED***;

***REMOVED***)();

function warn_unreachable(ast) {
    if (!empty(ast))
        warn("Dropping unreachable code: " + gen_code(ast, true));
***REMOVED***;

function prepare_ifs(ast) {
    var w = ast_walker(), walk = w.walk;
    // In this first pass, we rewrite ifs which abort with no else with an
    // if-else.  For example:
    //
    // if (x) {
    //     blah();
    //     return y;
    // ***REMOVED***
    // foobar();
    //
    // is rewritten into:
    //
    // if (x) {
    //     blah();
    //     return y;
    // ***REMOVED*** else {
    //     foobar();
    // ***REMOVED***
    function redo_if(statements) {
        statements = MAP(statements, walk);

        for (var i = 0; i < statements.length; ++i) {
            var fi = statements[i];
            if (fi[0] != "if") continue;

            if (fi[3]) continue;

            var t = fi[2];
            if (!aborts(t)) continue;

            var conditional = walk(fi[1]);

            var e_body = redo_if(statements.slice(i + 1));
            var e = e_body.length == 1 ? e_body[0] : [ "block", e_body ];

            return statements.slice(0, i).concat([ [
                fi[0],          // "if"
                conditional,    // conditional
                t,              // then
                e               // else
            ] ]);
    ***REMOVED***

        return statements;
***REMOVED***;

    function redo_if_lambda(name, args, body) {
        body = redo_if(body);
        return [ this[0], name, args, body ];
***REMOVED***;

    function redo_if_block(statements) {
        return [ this[0], statements != null ? redo_if(statements) : null ];
***REMOVED***;

    return w.with_walkers({
        "defun": redo_if_lambda,
        "function": redo_if_lambda,
        "block": redo_if_block,
        "splice": redo_if_block,
        "toplevel": function(statements) {
            return [ this[0], redo_if(statements) ];
      ***REMOVED***
        "try": function(t, c, f) {
            return [
                this[0],
                redo_if(t),
                c != null ? [ c[0], redo_if(c[1]) ] : null,
                f != null ? redo_if(f) : null
            ];
    ***REMOVED***
  ***REMOVED*** function() {
        return walk(ast);
***REMOVED***);
***REMOVED***;

function for_side_effects(ast, handler) {
    var w = ast_walker(), walk = w.walk;
    var $stop = {***REMOVED***, $restart = {***REMOVED***;
    function stop() { throw $stop ***REMOVED***;
    function restart() { throw $restart ***REMOVED***;
    function found(){ return handler.call(this, this, w, stop, restart) ***REMOVED***;
    function unary(op) {
        if (op == "++" || op == "--")
            return found.apply(this, arguments);
***REMOVED***;
    function binary(op) {
        if (op == "&&" || op == "||")
            return found.apply(this, arguments);
***REMOVED***;
    return w.with_walkers({
        "try": found,
        "throw": found,
        "return": found,
        "new": found,
        "switch": found,
        "break": found,
        "continue": found,
        "assign": found,
        "call": found,
        "if": found,
        "for": found,
        "for-in": found,
        "while": found,
        "do": found,
        "return": found,
        "unary-prefix": unary,
        "unary-postfix": unary,
        "conditional": found,
        "binary": binary,
        "defun": found
  ***REMOVED*** function(){
        while (true) try {
            walk(ast);
            break;
    ***REMOVED*** catch(ex) {
            if (ex === $stop) break;
            if (ex === $restart) continue;
            throw ex;
    ***REMOVED***
***REMOVED***);
***REMOVED***;

function ast_lift_variables(ast) {
    var w = ast_walker(), walk = w.walk, scope;
    function do_body(body, env) {
        var _scope = scope;
        scope = env;
        body = MAP(body, walk);
        var hash = {***REMOVED***, names = MAP(env.names, function(type, name){
            if (type != "var") return MAP.skip;
            if (!env.references(name)) return MAP.skip;
            hash[name] = true;
            return [ name ];
    ***REMOVED***);
        if (names.length > 0) {
            // looking for assignments to any of these variables.
            // we can save considerable space by moving the definitions
            // in the var declaration.
            for_side_effects([ "block", body ], function(ast, walker, stop, restart) {
                if (ast[0] == "assign"
                    && ast[1] === true
                    && ast[2][0] == "name"
                    && HOP(hash, ast[2][1])) {
                    // insert the definition into the var declaration
                    for (var i = names.length; --i >= 0;) {
                        if (names[i][0] == ast[2][1]) {
                            if (names[i][1]) // this name already defined, we must stop
                                stop();
                            names[i][1] = ast[3]; // definition
                            names.push(names.splice(i, 1)[0]);
                            break;
                    ***REMOVED***
                ***REMOVED***
                    // remove this assignment from the AST.
                    var p = walker.parent();
                    if (p[0] == "seq") {
                        var a = p[2];
                        a.unshift(0, p.length);
                        p.splice.apply(p, a);
                ***REMOVED***
                    else if (p[0] == "stat") {
                        p.splice(0, p.length, "block"); // empty statement
                ***REMOVED***
                    else {
                        stop();
                ***REMOVED***
                    restart();
            ***REMOVED***
                stop();
        ***REMOVED***);
            body.unshift([ "var", names ]);
    ***REMOVED***
        scope = _scope;
        return body;
***REMOVED***;
    function _vardefs(defs) {
        var ret = null;
        for (var i = defs.length; --i >= 0;) {
            var d = defs[i];
            if (!d[1]) continue;
            d = [ "assign", true, [ "name", d[0] ], d[1] ];
            if (ret == null) ret = d;
            else ret = [ "seq", d, ret ];
    ***REMOVED***
        if (ret == null && w.parent()[0] != "for") {
            if (w.parent()[0] == "for-in")
                return [ "name", defs[0][0] ];
            return MAP.skip;
    ***REMOVED***
        return [ "stat", ret ];
***REMOVED***;
    function _toplevel(body) {
        return [ this[0], do_body(body, this.scope) ];
***REMOVED***;
    return w.with_walkers({
        "function": function(name, args, body){
            for (var i = args.length; --i >= 0 && !body.scope.references(args[i]);)
                args.pop();
            if (!body.scope.references(name)) name = null;
            return [ this[0], name, args, do_body(body, body.scope) ];
      ***REMOVED***
        "defun": function(name, args, body){
            if (!scope.references(name)) return MAP.skip;
            for (var i = args.length; --i >= 0 && !body.scope.references(args[i]);)
                args.pop();
            return [ this[0], name, args, do_body(body, body.scope) ];
      ***REMOVED***
        "var": _vardefs,
        "toplevel": _toplevel
  ***REMOVED*** function(){
        return walk(ast_add_scope(ast));
***REMOVED***);
***REMOVED***;

function ast_squeeze(ast, options) {
    ast = squeeze_1(ast, options);
    ast = squeeze_2(ast, options);
    return ast;
***REMOVED***;

function squeeze_1(ast, options) {
    options = defaults(options, {
        make_seqs   : true,
        dead_code   : true,
        no_warnings : false,
        keep_comps  : true,
        unsafe      : false
***REMOVED***);

    var w = ast_walker(), walk = w.walk, scope;

    function negate(c) {
        var not_c = [ "unary-prefix", "!", c ];
        switch (c[0]) {
          case "unary-prefix":
            return c[1] == "!" && boolean_expr(c[2]) ? c[2] : not_c;
          case "seq":
            c = slice(c);
            c[c.length - 1] = negate(c[c.length - 1]);
            return c;
          case "conditional":
            return best_of(not_c, [ "conditional", c[1], negate(c[2]), negate(c[3]) ]);
          case "binary":
            var op = c[1], left = c[2], right = c[3];
            if (!options.keep_comps) switch (op) {
              case "<="  : return [ "binary", ">", left, right ];
              case "<"   : return [ "binary", ">=", left, right ];
              case ">="  : return [ "binary", "<", left, right ];
              case ">"   : return [ "binary", "<=", left, right ];
        ***REMOVED***
            switch (op) {
              case "=="  : return [ "binary", "!=", left, right ];
              case "!="  : return [ "binary", "==", left, right ];
              case "===" : return [ "binary", "!==", left, right ];
              case "!==" : return [ "binary", "===", left, right ];
              case "&&"  : return best_of(not_c, [ "binary", "||", negate(left), negate(right) ]);
              case "||"  : return best_of(not_c, [ "binary", "&&", negate(left), negate(right) ]);
        ***REMOVED***
            break;
    ***REMOVED***
        return not_c;
***REMOVED***;

    function make_conditional(c, t, e) {
        var make_real_conditional = function() {
            if (c[0] == "unary-prefix" && c[1] == "!") {
                return e ? [ "conditional", c[2], e, t ] : [ "binary", "||", c[2], t ];
        ***REMOVED*** else {
                return e ? best_of(
                    [ "conditional", c, t, e ],
                    [ "conditional", negate(c), e, t ]
                ) : [ "binary", "&&", c, t ];
        ***REMOVED***
    ***REMOVED***;
        // shortcut the conditional if the expression has a constant value
        return when_constant(c, function(ast, val){
            warn_unreachable(val ? e : t);
            return          (val ? t : e);
      ***REMOVED*** make_real_conditional);
***REMOVED***;

    function rmblock(block) {
        if (block != null && block[0] == "block" && block[1]) {
            if (block[1].length == 1)
                block = block[1][0];
            else if (block[1].length == 0)
                block = [ "block" ];
    ***REMOVED***
        return block;
***REMOVED***;

    function _lambda(name, args, body) {
        return [ this[0], name, args, tighten(body, "lambda") ];
***REMOVED***;

    // this function does a few things:
    // 1. discard useless blocks
    // 2. join consecutive var declarations
    // 3. remove obviously dead code
    // 4. transform consecutive statements using the comma operator
    // 5. if block_type == "lambda" and it detects constructs like if(foo) return ... - rewrite like if (!foo) { ... ***REMOVED***
    function tighten(statements, block_type) {
        statements = MAP(statements, walk);

        statements = statements.reduce(function(a, stat){
            if (stat[0] == "block") {
                if (stat[1]) {
                    a.push.apply(a, stat[1]);
            ***REMOVED***
        ***REMOVED*** else {
                a.push(stat);
        ***REMOVED***
            return a;
      ***REMOVED*** []);

        statements = (function(a, prev){
            statements.forEach(function(cur){
                if (prev && ((cur[0] == "var" && prev[0] == "var") ||
                             (cur[0] == "const" && prev[0] == "const"))) {
                    prev[1] = prev[1].concat(cur[1]);
            ***REMOVED*** else {
                    a.push(cur);
                    prev = cur;
            ***REMOVED***
        ***REMOVED***);
            return a;
    ***REMOVED***)([]);

        if (options.dead_code) statements = (function(a, has_quit){
            statements.forEach(function(st){
                if (has_quit) {
                    if (st[0] == "function" || st[0] == "defun") {
                        a.push(st);
                ***REMOVED***
                    else if (st[0] == "var" || st[0] == "const") {
                        if (!options.no_warnings)
                            warn("Variables declared in unreachable code");
                        st[1] = MAP(st[1], function(def){
                            if (def[1] && !options.no_warnings)
                                warn_unreachable([ "assign", true, [ "name", def[0] ], def[1] ]);
                            return [ def[0] ];
                    ***REMOVED***);
                        a.push(st);
                ***REMOVED***
                    else if (!options.no_warnings)
                        warn_unreachable(st);
            ***REMOVED***
                else {
                    a.push(st);
                    if (member(st[0], [ "return", "throw", "break", "continue" ]))
                        has_quit = true;
            ***REMOVED***
        ***REMOVED***);
            return a;
    ***REMOVED***)([]);

        if (options.make_seqs) statements = (function(a, prev) {
            statements.forEach(function(cur){
                if (prev && prev[0] == "stat" && cur[0] == "stat") {
                    prev[1] = [ "seq", prev[1], cur[1] ];
            ***REMOVED*** else {
                    a.push(cur);
                    prev = cur;
            ***REMOVED***
        ***REMOVED***);
            if (a.length >= 2
                && a[a.length-2][0] == "stat"
                && (a[a.length-1][0] == "return" || a[a.length-1][0] == "throw")
                && a[a.length-1][1])
            {
                a.splice(a.length - 2, 2,
                         [ a[a.length-1][0],
                           [ "seq", a[a.length-2][1], a[a.length-1][1] ]]);
        ***REMOVED***
            return a;
    ***REMOVED***)([]);

        // this increases jQuery by 1K.  Probably not such a good idea after all..
        // part of this is done in prepare_ifs anyway.
        // if (block_type == "lambda") statements = (function(i, a, stat){
        //         while (i < statements.length) {
        //                 stat = statements[i++];
        //                 if (stat[0] == "if" && !stat[3]) {
        //                         if (stat[2][0] == "return" && stat[2][1] == null) {
        //                                 a.push(make_if(negate(stat[1]), [ "block", statements.slice(i) ]));
        //                                 break;
        //                     ***REMOVED***
        //                         var last = last_stat(stat[2]);
        //                         if (last[0] == "return" && last[1] == null) {
        //                                 a.push(make_if(stat[1], [ "block", stat[2][1].slice(0, -1) ], [ "block", statements.slice(i) ]));
        //                                 break;
        //                     ***REMOVED***
        //             ***REMOVED***
        //                 a.push(stat);
        //     ***REMOVED***
        //         return a;
        // ***REMOVED***)(0, []);

        return statements;
***REMOVED***;

    function make_if(c, t, e) {
        return when_constant(c, function(ast, val){
            if (val) {
                t = walk(t);
                warn_unreachable(e);
                return t || [ "block" ];
        ***REMOVED*** else {
                e = walk(e);
                warn_unreachable(t);
                return e || [ "block" ];
        ***REMOVED***
      ***REMOVED*** function() {
            return make_real_if(c, t, e);
    ***REMOVED***);
***REMOVED***;

    function abort_else(c, t, e) {
        var ret = [ [ "if", negate(c), e ] ];
        if (t[0] == "block") {
            if (t[1]) ret = ret.concat(t[1]);
    ***REMOVED*** else {
            ret.push(t);
    ***REMOVED***
        return walk([ "block", ret ]);
***REMOVED***;

    function make_real_if(c, t, e) {
        c = walk(c);
        t = walk(t);
        e = walk(e);

        if (empty(e) && empty(t))
            return [ "stat", c ];

        if (empty(t)) {
            c = negate(c);
            t = e;
            e = null;
    ***REMOVED*** else if (empty(e)) {
            e = null;
    ***REMOVED*** else {
            // if we have both else and then, maybe it makes sense to switch them?
            (function(){
                var a = gen_code(c);
                var n = negate(c);
                var b = gen_code(n);
                if (b.length < a.length) {
                    var tmp = t;
                    t = e;
                    e = tmp;
                    c = n;
            ***REMOVED***
        ***REMOVED***)();
    ***REMOVED***
        var ret = [ "if", c, t, e ];
        if (t[0] == "if" && empty(t[3]) && empty(e)) {
            ret = best_of(ret, walk([ "if", [ "binary", "&&", c, t[1] ], t[2] ]));
    ***REMOVED***
        else if (t[0] == "stat") {
            if (e) {
                if (e[0] == "stat")
                    ret = best_of(ret, [ "stat", make_conditional(c, t[1], e[1]) ]);
                else if (aborts(e))
                    ret = abort_else(c, t, e);
        ***REMOVED***
            else {
                ret = best_of(ret, [ "stat", make_conditional(c, t[1]) ]);
        ***REMOVED***
    ***REMOVED***
        else if (e && t[0] == e[0] && (t[0] == "return" || t[0] == "throw") && t[1] && e[1]) {
            ret = best_of(ret, [ t[0], make_conditional(c, t[1], e[1] ) ]);
    ***REMOVED***
        else if (e && aborts(t)) {
            ret = [ [ "if", c, t ] ];
            if (e[0] == "block") {
                if (e[1]) ret = ret.concat(e[1]);
        ***REMOVED***
            else {
                ret.push(e);
        ***REMOVED***
            ret = walk([ "block", ret ]);
    ***REMOVED***
        else if (t && aborts(e)) {
            ret = abort_else(c, t, e);
    ***REMOVED***
        return ret;
***REMOVED***;

    function _do_while(cond, body) {
        return when_constant(cond, function(cond, val){
            if (!val) {
                warn_unreachable(body);
                return [ "block" ];
        ***REMOVED*** else {
                return [ "for", null, null, null, walk(body) ];
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;

    return w.with_walkers({
        "sub": function(expr, subscript) {
            if (subscript[0] == "string") {
                var name = subscript[1];
                if (is_identifier(name))
                    return [ "dot", walk(expr), name ];
                else if (/^[1-9][0-9]*$/.test(name) || name === "0")
                    return [ "sub", walk(expr), [ "num", parseInt(name, 10) ] ];
        ***REMOVED***
      ***REMOVED***
        "if": make_if,
        "toplevel": function(body) {
            return [ "toplevel", tighten(body) ];
      ***REMOVED***
        "switch": function(expr, body) {
            var last = body.length - 1;
            return [ "switch", walk(expr), MAP(body, function(branch, i){
                var block = tighten(branch[1]);
                if (i == last && block.length > 0) {
                    var node = block[block.length - 1];
                    if (node[0] == "break" && !node[1])
                        block.pop();
            ***REMOVED***
                return [ branch[0] ? walk(branch[0]) : null, block ];
        ***REMOVED***) ];
      ***REMOVED***
        "function": _lambda,
        "defun": _lambda,
        "block": function(body) {
            if (body) return rmblock([ "block", tighten(body) ]);
      ***REMOVED***
        "binary": function(op, left, right) {
            return when_constant([ "binary", op, walk(left), walk(right) ], function yes(c){
                return best_of(walk(c), this);
          ***REMOVED*** function no() {
                return function(){
                    if(op != "==" && op != "!=") return;
                    var l = walk(left), r = walk(right);
                    if(l && l[0] == "unary-prefix" && l[1] == "!" && l[2][0] == "num")
                        left = ['num', +!l[2][1]];
                    else if (r && r[0] == "unary-prefix" && r[1] == "!" && r[2][0] == "num")
                        right = ['num', +!r[2][1]];
                    return ["binary", op, left, right];
            ***REMOVED***() || this;
        ***REMOVED***);
      ***REMOVED***
        "conditional": function(c, t, e) {
            return make_conditional(walk(c), walk(t), walk(e));
      ***REMOVED***
        "try": function(t, c, f) {
            return [
                "try",
                tighten(t),
                c != null ? [ c[0], tighten(c[1]) ] : null,
                f != null ? tighten(f) : null
            ];
      ***REMOVED***
        "unary-prefix": function(op, expr) {
            expr = walk(expr);
            var ret = [ "unary-prefix", op, expr ];
            if (op == "!")
                ret = best_of(ret, negate(expr));
            return when_constant(ret, function(ast, val){
                return walk(ast); // it's either true or false, so minifies to !0 or !1
          ***REMOVED*** function() { return ret ***REMOVED***);
      ***REMOVED***
        "name": function(name) {
            switch (name) {
              case "true": return [ "unary-prefix", "!", [ "num", 0 ]];
              case "false": return [ "unary-prefix", "!", [ "num", 1 ]];
        ***REMOVED***
      ***REMOVED***
        "while": _do_while,
        "assign": function(op, lvalue, rvalue) {
            lvalue = walk(lvalue);
            rvalue = walk(rvalue);
            var okOps = [ '+', '-', '/', '*', '%', '>>', '<<', '>>>', '|', '^', '&' ];
            if (op === true && lvalue[0] === "name" && rvalue[0] === "binary" &&
                ~okOps.indexOf(rvalue[1]) && rvalue[2][0] === "name" &&
                rvalue[2][1] === lvalue[1]) {
                return [ this[0], rvalue[1], lvalue, rvalue[3] ]
        ***REMOVED***
            return [ this[0], op, lvalue, rvalue ];
      ***REMOVED***
        "call": function(expr, args) {
            expr = walk(expr);
            if (options.unsafe && expr[0] == "dot" && expr[1][0] == "string" && expr[2] == "toString") {
                return expr[1];
        ***REMOVED***
            return [ this[0], expr,  MAP(args, walk) ];
      ***REMOVED***
        "num": function (num) {
            if (!isFinite(num))
                return [ "binary", "/", num === 1 / 0
                         ? [ "num", 1 ] : num === -1 / 0
                         ? [ "unary-prefix", "-", [ "num", 1 ] ]
                         : [ "num", 0 ], [ "num", 0 ] ];

            return [ this[0], num ];
    ***REMOVED***
  ***REMOVED*** function() {
        return walk(prepare_ifs(walk(prepare_ifs(ast))));
***REMOVED***);
***REMOVED***;

function squeeze_2(ast, options) {
    var w = ast_walker(), walk = w.walk, scope;
    function with_scope(s, cont) {
        var save = scope, ret;
        scope = s;
        ret = cont();
        scope = save;
        return ret;
***REMOVED***;
    function lambda(name, args, body) {
        return [ this[0], name, args, with_scope(body.scope, curry(MAP, body, walk)) ];
***REMOVED***;
    return w.with_walkers({
        "directive": function(dir) {
            if (scope.active_directive(dir))
                return [ "block" ];
            scope.directives.push(dir);
      ***REMOVED***
        "toplevel": function(body) {
            return [ this[0], with_scope(this.scope, curry(MAP, body, walk)) ];
      ***REMOVED***
        "function": lambda,
        "defun": lambda
  ***REMOVED*** function(){
        return walk(ast_add_scope(ast));
***REMOVED***);
***REMOVED***;

/* -----[ re-generate code from the AST ]----- */

var DOT_CALL_NO_PARENS = jsp.array_to_hash([
    "name",
    "array",
    "object",
    "string",
    "dot",
    "sub",
    "call",
    "regexp",
    "defun"
]);

function make_string(str, ascii_only) {
    var dq = 0, sq = 0;
    str = str.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function(s){
        switch (s) {
          case "\\": return "\\\\";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\u2028": return "\\u2028";
          case "\u2029": return "\\u2029";
          case '"': ++dq; return '"';
          case "'": ++sq; return "'";
          case "\0": return "\\0";
    ***REMOVED***
        return s;
***REMOVED***);
    if (ascii_only) str = to_ascii(str);
    if (dq > sq) return "'" + str.replace(/\x27/g, "\\'") + "'";
    else return '"' + str.replace(/\x22/g, '\\"') + '"';
***REMOVED***;

function to_ascii(str) {
    return str.replace(/[\u0080-\uffff]/g, function(ch) {
        var code = ch.charCodeAt(0).toString(16);
        while (code.length < 4) code = "0" + code;
        return "\\u" + code;
***REMOVED***);
***REMOVED***;

var SPLICE_NEEDS_BRACKETS = jsp.array_to_hash([ "if", "while", "do", "for", "for-in", "with" ]);

function gen_code(ast, options) {
    options = defaults(options, {
        indent_start : 0,
        indent_level : 4,
        quote_keys   : false,
        space_colon  : false,
        beautify     : false,
        ascii_only   : false,
        inline_script: false
***REMOVED***);
    var beautify = !!options.beautify;
    var indentation = 0,
    newline = beautify ? "\n" : "",
    space = beautify ? " " : "";

    function encode_string(str) {
        var ret = make_string(str, options.ascii_only);
        if (options.inline_script)
            ret = ret.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
        return ret;
***REMOVED***;

    function make_name(name) {
        name = name.toString();
        if (options.ascii_only)
            name = to_ascii(name);
        return name;
***REMOVED***;

    function indent(line) {
        if (line == null)
            line = "";
        if (beautify)
            line = repeat_string(" ", options.indent_start + indentation * options.indent_level) + line;
        return line;
***REMOVED***;

    function with_indent(cont, incr) {
        if (incr == null) incr = 1;
        indentation += incr;
        try { return cont.apply(null, slice(arguments, 1)); ***REMOVED***
        finally { indentation -= incr; ***REMOVED***
***REMOVED***;

    function last_char(str) {
        str = str.toString();
        return str.charAt(str.length - 1);
***REMOVED***;

    function first_char(str) {
        return str.toString().charAt(0);
***REMOVED***;

    function add_spaces(a) {
        if (beautify)
            return a.join(" ");
        var b = [];
        for (var i = 0; i < a.length; ++i) {
            var next = a[i + 1];
            b.push(a[i]);
            if (next &&
                ((is_identifier_char(last_char(a[i])) && (is_identifier_char(first_char(next))
                                                          || first_char(next) == "\\")) ||
                 (/[\+\-]$/.test(a[i].toString()) && /^[\+\-]/.test(next.toString()) ||
                 last_char(a[i]) == "/" && first_char(next) == "/"))) {
                b.push(" ");
        ***REMOVED***
    ***REMOVED***
        return b.join("");
***REMOVED***;

    function add_commas(a) {
        return a.join("," + space);
***REMOVED***;

    function parenthesize(expr) {
        var gen = make(expr);
        for (var i = 1; i < arguments.length; ++i) {
            var el = arguments[i];
            if ((el instanceof Function && el(expr)) || expr[0] == el)
                return "(" + gen + ")";
    ***REMOVED***
        return gen;
***REMOVED***;

    function best_of(a) {
        if (a.length == 1) {
            return a[0];
    ***REMOVED***
        if (a.length == 2) {
            var b = a[1];
            a = a[0];
            return a.length <= b.length ? a : b;
    ***REMOVED***
        return best_of([ a[0], best_of(a.slice(1)) ]);
***REMOVED***;

    function needs_parens(expr) {
        if (expr[0] == "function" || expr[0] == "object") {
            // dot/call on a literal function requires the
            // function literal itself to be parenthesized
            // only if it's the first "thing" in a
            // statement.  This means that the parent is
            // "stat", but it could also be a "seq" and
            // we're the first in this "seq" and the
            // parent is "stat", and so on.  Messy stuff,
            // but it worths the trouble.
            var a = slice(w.stack()), self = a.pop(), p = a.pop();
            while (p) {
                if (p[0] == "stat") return true;
                if (((p[0] == "seq" || p[0] == "call" || p[0] == "dot" || p[0] == "sub" || p[0] == "conditional") && p[1] === self) ||
                    ((p[0] == "binary" || p[0] == "assign" || p[0] == "unary-postfix") && p[2] === self)) {
                    self = p;
                    p = a.pop();
            ***REMOVED*** else {
                    return false;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        return !HOP(DOT_CALL_NO_PARENS, expr[0]);
***REMOVED***;

    function make_num(num) {
        var str = num.toString(10), a = [ str.replace(/^0\./, ".").replace('e+', 'e') ], m;
        if (Math.floor(num) === num) {
            if (num >= 0) {
                a.push("0x" + num.toString(16).toLowerCase(), // probably pointless
                       "0" + num.toString(8)); // same.
        ***REMOVED*** else {
                a.push("-0x" + (-num).toString(16).toLowerCase(), // probably pointless
                       "-0" + (-num).toString(8)); // same.
        ***REMOVED***
            if ((m = /^(.*?)(0+)$/.exec(num))) {
                a.push(m[1] + "e" + m[2].length);
        ***REMOVED***
    ***REMOVED*** else if ((m = /^0?\.(0+)(.*)$/.exec(num))) {
            a.push(m[2] + "e-" + (m[1].length + m[2].length),
                   str.substr(str.indexOf(".")));
    ***REMOVED***
        return best_of(a);
***REMOVED***;

    var w = ast_walker();
    var make = w.walk;
    return w.with_walkers({
        "string": encode_string,
        "num": make_num,
        "name": make_name,
        "debugger": function(){ return "debugger;" ***REMOVED***,
        "toplevel": function(statements) {
            return make_block_statements(statements)
                .join(newline + newline);
      ***REMOVED***
        "splice": function(statements) {
            var parent = w.parent();
            if (HOP(SPLICE_NEEDS_BRACKETS, parent)) {
                // we need block brackets in this case
                return make_block.apply(this, arguments);
        ***REMOVED*** else {
                return MAP(make_block_statements(statements, true),
                           function(line, i) {
                               // the first line is already indented
                               return i > 0 ? indent(line) : line;
                       ***REMOVED***).join(newline);
        ***REMOVED***
      ***REMOVED***
        "block": make_block,
        "var": function(defs) {
            return "var " + add_commas(MAP(defs, make_1vardef)) + ";";
      ***REMOVED***
        "const": function(defs) {
            return "const " + add_commas(MAP(defs, make_1vardef)) + ";";
      ***REMOVED***
        "try": function(tr, ca, fi) {
            var out = [ "try", make_block(tr) ];
            if (ca) out.push("catch", "(" + ca[0] + ")", make_block(ca[1]));
            if (fi) out.push("finally", make_block(fi));
            return add_spaces(out);
      ***REMOVED***
        "throw": function(expr) {
            return add_spaces([ "throw", make(expr) ]) + ";";
      ***REMOVED***
        "new": function(ctor, args) {
            args = args.length > 0 ? "(" + add_commas(MAP(args, function(expr){
                return parenthesize(expr, "seq");
        ***REMOVED***)) + ")" : "";
            return add_spaces([ "new", parenthesize(ctor, "seq", "binary", "conditional", "assign", function(expr){
                var w = ast_walker(), has_call = {***REMOVED***;
                try {
                    w.with_walkers({
                        "call": function() { throw has_call ***REMOVED***,
                        "function": function() { return this ***REMOVED***
                  ***REMOVED*** function(){
                        w.walk(expr);
                ***REMOVED***);
            ***REMOVED*** catch(ex) {
                    if (ex === has_call)
                        return true;
                    throw ex;
            ***REMOVED***
        ***REMOVED***) + args ]);
      ***REMOVED***
        "switch": function(expr, body) {
            return add_spaces([ "switch", "(" + make(expr) + ")", make_switch_block(body) ]);
      ***REMOVED***
        "break": function(label) {
            var out = "break";
            if (label != null)
                out += " " + make_name(label);
            return out + ";";
      ***REMOVED***
        "continue": function(label) {
            var out = "continue";
            if (label != null)
                out += " " + make_name(label);
            return out + ";";
      ***REMOVED***
        "conditional": function(co, th, el) {
            return add_spaces([ parenthesize(co, "assign", "seq", "conditional"), "?",
                                parenthesize(th, "seq"), ":",
                                parenthesize(el, "seq") ]);
      ***REMOVED***
        "assign": function(op, lvalue, rvalue) {
            if (op && op !== true) op += "=";
            else op = "=";
            return add_spaces([ make(lvalue), op, parenthesize(rvalue, "seq") ]);
      ***REMOVED***
        "dot": function(expr) {
            var out = make(expr), i = 1;
            if (expr[0] == "num") {
                if (!/[a-f.]/i.test(out))
                    out += ".";
        ***REMOVED*** else if (expr[0] != "function" && needs_parens(expr))
                out = "(" + out + ")";
            while (i < arguments.length)
                out += "." + make_name(arguments[i++]);
            return out;
      ***REMOVED***
        "call": function(func, args) {
            var f = make(func);
            if (f.charAt(0) != "(" && needs_parens(func))
                f = "(" + f + ")";
            return f + "(" + add_commas(MAP(args, function(expr){
                return parenthesize(expr, "seq");
        ***REMOVED***)) + ")";
      ***REMOVED***
        "function": make_function,
        "defun": make_function,
        "if": function(co, th, el) {
            var out = [ "if", "(" + make(co) + ")", el ? make_then(th) : make(th) ];
            if (el) {
                out.push("else", make(el));
        ***REMOVED***
            return add_spaces(out);
      ***REMOVED***
        "for": function(init, cond, step, block) {
            var out = [ "for" ];
            init = (init != null ? make(init) : "").replace(/;*\s*$/, ";" + space);
            cond = (cond != null ? make(cond) : "").replace(/;*\s*$/, ";" + space);
            step = (step != null ? make(step) : "").replace(/;*\s*$/, "");
            var args = init + cond + step;
            if (args == "; ; ") args = ";;";
            out.push("(" + args + ")", make(block));
            return add_spaces(out);
      ***REMOVED***
        "for-in": function(vvar, key, hash, block) {
            return add_spaces([ "for", "(" +
                                (vvar ? make(vvar).replace(/;+$/, "") : make(key)),
                                "in",
                                make(hash) + ")", make(block) ]);
      ***REMOVED***
        "while": function(condition, block) {
            return add_spaces([ "while", "(" + make(condition) + ")", make(block) ]);
      ***REMOVED***
        "do": function(condition, block) {
            return add_spaces([ "do", make(block), "while", "(" + make(condition) + ")" ]) + ";";
      ***REMOVED***
        "return": function(expr) {
            var out = [ "return" ];
            if (expr != null) out.push(make(expr));
            return add_spaces(out) + ";";
      ***REMOVED***
        "binary": function(operator, lvalue, rvalue) {
            var left = make(lvalue), right = make(rvalue);
            // XXX: I'm pretty sure other cases will bite here.
            //      we need to be smarter.
            //      adding parens all the time is the safest bet.
            if (member(lvalue[0], [ "assign", "conditional", "seq" ]) ||
                lvalue[0] == "binary" && PRECEDENCE[operator] > PRECEDENCE[lvalue[1]] ||
                lvalue[0] == "function" && needs_parens(this)) {
                left = "(" + left + ")";
        ***REMOVED***
            if (member(rvalue[0], [ "assign", "conditional", "seq" ]) ||
                rvalue[0] == "binary" && PRECEDENCE[operator] >= PRECEDENCE[rvalue[1]] &&
                !(rvalue[1] == operator && member(operator, [ "&&", "||", "*" ]))) {
                right = "(" + right + ")";
        ***REMOVED***
            else if (!beautify && options.inline_script && (operator == "<" || operator == "<<")
                     && rvalue[0] == "regexp" && /^script/i.test(rvalue[1])) {
                right = " " + right;
        ***REMOVED***
            return add_spaces([ left, operator, right ]);
      ***REMOVED***
        "unary-prefix": function(operator, expr) {
            var val = make(expr);
            if (!(expr[0] == "num" || (expr[0] == "unary-prefix" && !HOP(OPERATORS, operator + expr[1])) || !needs_parens(expr)))
                val = "(" + val + ")";
            return operator + (jsp.is_alphanumeric_char(operator.charAt(0)) ? " " : "") + val;
      ***REMOVED***
        "unary-postfix": function(operator, expr) {
            var val = make(expr);
            if (!(expr[0] == "num" || (expr[0] == "unary-postfix" && !HOP(OPERATORS, operator + expr[1])) || !needs_parens(expr)))
                val = "(" + val + ")";
            return val + operator;
      ***REMOVED***
        "sub": function(expr, subscript) {
            var hash = make(expr);
            if (needs_parens(expr))
                hash = "(" + hash + ")";
            return hash + "[" + make(subscript) + "]";
      ***REMOVED***
        "object": function(props) {
            var obj_needs_parens = needs_parens(this);
            if (props.length == 0)
                return obj_needs_parens ? "({***REMOVED***)" : "{***REMOVED***";
            var out = "{" + newline + with_indent(function(){
                return MAP(props, function(p){
                    if (p.length == 3) {
                        // getter/setter.  The name is in p[0], the arg.list in p[1][2], the
                        // body in p[1][3] and type ("get" / "set") in p[2].
                        return indent(make_function(p[0], p[1][2], p[1][3], p[2], true));
                ***REMOVED***
                    var key = p[0], val = parenthesize(p[1], "seq");
                    if (options.quote_keys) {
                        key = encode_string(key);
                ***REMOVED*** else if ((typeof key == "number" || !beautify && +key + "" == key)
                               && parseFloat(key) >= 0) {
                        key = make_num(+key);
                ***REMOVED*** else if (!is_identifier(key)) {
                        key = encode_string(key);
                ***REMOVED***
                    return indent(add_spaces(beautify && options.space_colon
                                             ? [ key, ":", val ]
                                             : [ key + ":", val ]));
            ***REMOVED***).join("," + newline);
        ***REMOVED***) + newline + indent("***REMOVED***");
            return obj_needs_parens ? "(" + out + ")" : out;
      ***REMOVED***
        "regexp": function(rx, mods) {
            if (options.ascii_only) rx = to_ascii(rx);
            return "/" + rx + "/" + mods;
      ***REMOVED***
        "array": function(elements) {
            if (elements.length == 0) return "[]";
            return add_spaces([ "[", add_commas(MAP(elements, function(el, i){
                if (!beautify && el[0] == "atom" && el[1] == "undefined") return i === elements.length - 1 ? "," : "";
                return parenthesize(el, "seq");
        ***REMOVED***)), "]" ]);
      ***REMOVED***
        "stat": function(stmt) {
            return stmt != null
                ? make(stmt).replace(/;*\s*$/, ";")
                : ";";
      ***REMOVED***
        "seq": function() {
            return add_commas(MAP(slice(arguments), make));
      ***REMOVED***
        "label": function(name, block) {
            return add_spaces([ make_name(name), ":", make(block) ]);
      ***REMOVED***
        "with": function(expr, block) {
            return add_spaces([ "with", "(" + make(expr) + ")", make(block) ]);
      ***REMOVED***
        "atom": function(name) {
            return make_name(name);
      ***REMOVED***
        "directive": function(dir) {
            return make_string(dir) + ";";
    ***REMOVED***
  ***REMOVED*** function(){ return make(ast) ***REMOVED***);

    // The squeezer replaces "block"-s that contain only a single
    // statement with the statement itself; technically, the AST
    // is correct, but this can create problems when we output an
    // IF having an ELSE clause where the THEN clause ends in an
    // IF *without* an ELSE block (then the outer ELSE would refer
    // to the inner IF).  This function checks for this case and
    // adds the block brackets if needed.
    function make_then(th) {
        if (th == null) return ";";
        if (th[0] == "do") {
            // https://github.com/mishoo/UglifyJS/issues/#issue/57
            // IE croaks with "syntax error" on code like this:
            //     if (foo) do ... while(cond); else ...
            // we need block brackets around do/while
            return make_block([ th ]);
    ***REMOVED***
        var b = th;
        while (true) {
            var type = b[0];
            if (type == "if") {
                if (!b[3])
                    // no else, we must add the block
                    return make([ "block", [ th ]]);
                b = b[3];
        ***REMOVED***
            else if (type == "while" || type == "do") b = b[2];
            else if (type == "for" || type == "for-in") b = b[4];
            else break;
    ***REMOVED***
        return make(th);
***REMOVED***;

    function make_function(name, args, body, keyword, no_parens) {
        var out = keyword || "function";
        if (name) {
            out += " " + make_name(name);
    ***REMOVED***
        out += "(" + add_commas(MAP(args, make_name)) + ")";
        out = add_spaces([ out, make_block(body) ]);
        return (!no_parens && needs_parens(this)) ? "(" + out + ")" : out;
***REMOVED***;

    function must_has_semicolon(node) {
        switch (node[0]) {
          case "with":
          case "while":
            return empty(node[2]) || must_has_semicolon(node[2]);
          case "for":
          case "for-in":
            return empty(node[4]) || must_has_semicolon(node[4]);
          case "if":
            if (empty(node[2]) && !node[3]) return true; // `if' with empty `then' and no `else'
            if (node[3]) {
                if (empty(node[3])) return true; // `else' present but empty
                return must_has_semicolon(node[3]); // dive into the `else' branch
        ***REMOVED***
            return must_has_semicolon(node[2]); // dive into the `then' branch
          case "directive":
            return true;
    ***REMOVED***
***REMOVED***;

    function make_block_statements(statements, noindent) {
        for (var a = [], last = statements.length - 1, i = 0; i <= last; ++i) {
            var stat = statements[i];
            var code = make(stat);
            if (code != ";") {
                if (!beautify && i == last && !must_has_semicolon(stat)) {
                    code = code.replace(/;+\s*$/, "");
            ***REMOVED***
                a.push(code);
        ***REMOVED***
    ***REMOVED***
        return noindent ? a : MAP(a, indent);
***REMOVED***;

    function make_switch_block(body) {
        var n = body.length;
        if (n == 0) return "{***REMOVED***";
        return "{" + newline + MAP(body, function(branch, i){
            var has_body = branch[1].length > 0, code = with_indent(function(){
                return indent(branch[0]
                              ? add_spaces([ "case", make(branch[0]) + ":" ])
                              : "default:");
          ***REMOVED*** 0.5) + (has_body ? newline + with_indent(function(){
                return make_block_statements(branch[1]).join(newline);
        ***REMOVED***) : "");
            if (!beautify && has_body && i < n - 1)
                code += ";";
            return code;
    ***REMOVED***).join(newline) + newline + indent("***REMOVED***");
***REMOVED***;

    function make_block(statements) {
        if (!statements) return ";";
        if (statements.length == 0) return "{***REMOVED***";
        return "{" + newline + with_indent(function(){
            return make_block_statements(statements).join(newline);
    ***REMOVED***) + newline + indent("***REMOVED***");
***REMOVED***;

    function make_1vardef(def) {
        var name = def[0], val = def[1];
        if (val != null)
            name = add_spaces([ make_name(name), "=", parenthesize(val, "seq") ]);
        return name;
***REMOVED***;

***REMOVED***;

function split_lines(code, max_line_length) {
    var splits = [ 0 ];
    jsp.parse(function(){
        var next_token = jsp.tokenizer(code);
        var last_split = 0;
        var prev_token;
        function current_length(tok) {
            return tok.pos - last_split;
    ***REMOVED***;
        function split_here(tok) {
            last_split = tok.pos;
            splits.push(last_split);
    ***REMOVED***;
        function custom(){
            var tok = next_token.apply(this, arguments);
            out: {
                if (prev_token) {
                    if (prev_token.type == "keyword") break out;
            ***REMOVED***
                if (current_length(tok) > max_line_length) {
                    switch (tok.type) {
                      case "keyword":
                      case "atom":
                      case "name":
                      case "punc":
                        split_here(tok);
                        break out;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            prev_token = tok;
            return tok;
    ***REMOVED***;
        custom.context = function() {
            return next_token.context.apply(this, arguments);
    ***REMOVED***;
        return custom;
***REMOVED***());
    return splits.map(function(pos, i){
        return code.substring(pos, splits[i + 1] || code.length);
***REMOVED***).join("\n");
***REMOVED***;

/* -----[ Utilities ]----- */

function repeat_string(str, i) {
    if (i <= 0) return "";
    if (i == 1) return str;
    var d = repeat_string(str, i >> 1);
    d += d;
    if (i & 1) d += str;
    return d;
***REMOVED***;

function defaults(args, defs) {
    var ret = {***REMOVED***;
    if (args === true)
        args = {***REMOVED***;
    for (var i in defs) if (HOP(defs, i)) {
        ret[i] = (args && HOP(args, i)) ? args[i] : defs[i];
***REMOVED***
    return ret;
***REMOVED***;

function is_identifier(name) {
    return /^[a-z_$][a-z0-9_$]*$/i.test(name)
        && name != "this"
        && !HOP(jsp.KEYWORDS_ATOM, name)
        && !HOP(jsp.RESERVED_WORDS, name)
        && !HOP(jsp.KEYWORDS, name);
***REMOVED***;

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
***REMOVED***;

// some utilities

var MAP;

(function(){
    MAP = function(a, f, o) {
        var ret = [], top = [], i;
        function doit() {
            var val = f.call(o, a[i], i);
            if (val instanceof AtTop) {
                val = val.v;
                if (val instanceof Splice) {
                    top.push.apply(top, val.v);
            ***REMOVED*** else {
                    top.push(val);
            ***REMOVED***
        ***REMOVED***
            else if (val != skip) {
                if (val instanceof Splice) {
                    ret.push.apply(ret, val.v);
            ***REMOVED*** else {
                    ret.push(val);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
        if (a instanceof Array) for (i = 0; i < a.length; ++i) doit();
        else for (i in a) if (HOP(a, i)) doit();
        return top.concat(ret);
***REMOVED***;
    MAP.at_top = function(val) { return new AtTop(val) ***REMOVED***;
    MAP.splice = function(val) { return new Splice(val) ***REMOVED***;
    var skip = MAP.skip = {***REMOVED***;
    function AtTop(val) { this.v = val ***REMOVED***;
    function Splice(val) { this.v = val ***REMOVED***;
***REMOVED***)();

/* -----[ Exports ]----- */

exports.ast_walker = ast_walker;
exports.ast_mangle = ast_mangle;
exports.ast_squeeze = ast_squeeze;
exports.ast_lift_variables = ast_lift_variables;
exports.gen_code = gen_code;
exports.ast_add_scope = ast_add_scope;
exports.set_logger = function(logger) { warn = logger ***REMOVED***;
exports.make_string = make_string;
exports.split_lines = split_lines;
exports.MAP = MAP;

// keep this last!
exports.ast_squeeze_more = require("./squeeze-more").ast_squeeze_more;

// Local variables:
// js-indent-level: 4
// End:
***REMOVED***);
define('uglifyjs/index', ["require", "exports", "module", "./parse-js", "./process", "./consolidator"], function(require, exports, module) {
//convienence function(src, [options]);
function uglify(orig_code, options){
  options || (options = {***REMOVED***);
  var jsp = uglify.parser;
  var pro = uglify.uglify;

  var ast = jsp.parse(orig_code, options.strict_semicolons); // parse code and get the initial AST
  ast = pro.ast_mangle(ast, options.mangle_options); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast, options.squeeze_options); // get an AST with compression optimizations
  var final_code = pro.gen_code(ast, options.gen_options); // compressed code here
  return final_code;
***REMOVED***;

uglify.parser = require("./parse-js");
uglify.uglify = require("./process");
uglify.consolidator = require("./consolidator");

module.exports = uglify
***REMOVED***);/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define('source-map/array-set', function (require, exports, module) {

  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */
  function ArraySet() {
    this._array = [];
    this._set = {***REMOVED***;
  ***REMOVED***

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  ArraySet.fromArray = function ArraySet_fromArray(aArray) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i]);
***REMOVED***
    return set;
  ***REMOVED***;

  /**
   * Because behavior goes wacky when you set `__proto__` on `this._set`, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  ArraySet.prototype._toSetString = function ArraySet__toSetString (aStr) {
    return "$" + aStr;
  ***REMOVED***;

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  ArraySet.prototype.add = function ArraySet_add(aStr) {
    if (this.has(aStr)) {
      // Already a member; nothing to do.
      return;
***REMOVED***
    var idx = this._array.length;
    this._array.push(aStr);
    this._set[this._toSetString(aStr)] = idx;
  ***REMOVED***;

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    return Object.prototype.hasOwnProperty.call(this._set,
                                                this._toSetString(aStr));
  ***REMOVED***;

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (this.has(aStr)) {
      return this._set[this._toSetString(aStr)];
***REMOVED***
    throw new Error('"' + aStr + '" is not in the set.');
  ***REMOVED***;

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
***REMOVED***
    throw new Error('No element indexed by ' + aIdx);
  ***REMOVED***;

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  ***REMOVED***;

  exports.ArraySet = ArraySet;

***REMOVED***);
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

define('source-map/base64-vlq', function (require, exports, module) {

  var base64 = require('./base64');

  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5;

  // binary: 100000
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

  // binary: 011111
  var VLQ_BASE_MASK = VLQ_BASE - 1;

  // binary: 100000
  var VLQ_CONTINUATION_BIT = VLQ_BASE;

  /**
   * Converts from a two-complement value to a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */
  function toVLQSigned(aValue) {
    return aValue < 0
      ? ((-aValue) << 1) + 1
      : (aValue << 1) + 0;
  ***REMOVED***

  /**
   * Converts to a two-complement value from a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative
      ? -shifted
      : shifted;
  ***REMOVED***

  /**
   * Returns the base 64 VLQ encoded value.
   */
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;

    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
  ***REMOVED***
      encoded += base64.encode(digit);
***REMOVED*** while (vlq > 0);

    return encoded;
  ***REMOVED***;

  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string.
   */
  exports.decode = function base64VLQ_decode(aStr) {
    var i = 0;
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (i >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
  ***REMOVED***
      digit = base64.decode(aStr.charAt(i++));
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
***REMOVED*** while (continuation);

    return {
      value: fromVLQSigned(result),
      rest: aStr.slice(i)
***REMOVED***;
  ***REMOVED***;

***REMOVED***);
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define('source-map/base64', function (require, exports, module) {

  var charToIntMap = {***REMOVED***;
  var intToCharMap = {***REMOVED***;

  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .forEach(function (ch, index) {
      charToIntMap[ch] = index;
      intToCharMap[index] = ch;
***REMOVED***);

  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */
  exports.encode = function base64_encode(aNumber) {
    if (aNumber in intToCharMap) {
      return intToCharMap[aNumber];
***REMOVED***
    throw new TypeError("Must be between 0 and 63: " + aNumber);
  ***REMOVED***;

  /**
   * Decode a single base 64 digit to an integer.
   */
  exports.decode = function base64_decode(aChar) {
    if (aChar in charToIntMap) {
      return charToIntMap[aChar];
***REMOVED***
    throw new TypeError("Not a valid base 64 digit: " + aChar);
  ***REMOVED***;

***REMOVED***);
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define('source-map/binary-search', function (require, exports, module) {

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the next
    //      closest element that is less than that element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element which is less than the one we are searching for, so we
    //      return null.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid]);
    if (cmp === 0) {
      // Found the element we are looking for.
      return aHaystack[mid];
***REMOVED***
    else if (cmp > 0) {
      // aHaystack[mid] is greater than our needle.
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
  ***REMOVED***
      // We did not find an exact match, return the next closest one
      // (termination case 2).
      return aHaystack[mid];
***REMOVED***
    else {
      // aHaystack[mid] is less than our needle.
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
  ***REMOVED***
      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (2) or (3) and return the appropriate thing.
      return aLow < 0
        ? null
        : aHaystack[aLow];
***REMOVED***
  ***REMOVED***

  /**
   * This is an implementation of binary search which will always try and return
   * the next lowest value checked if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare) {
    return aHaystack.length > 0
      ? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
      : null;
  ***REMOVED***;

***REMOVED***);
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define('source-map/source-map-consumer', function (require, exports, module) {

  var util = require('./util');
  var binarySearch = require('./binary-search');
  var ArraySet = require('./array-set').ArraySet;
  var base64VLQ = require('./base64-vlq');

  /**
   * A SourceMapConsumer instance represents a parsed source map which we can
   * query for information about the original file positions by giving it a file
   * position in the generated source.
   *
   * The only parameter is the raw source map (either as a JSON string, or
   * already parsed to an object). According to the spec, source maps have the
   * following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - sources: An array of URLs to the original source files.
   *   - names: An array of identifiers which can be referrenced by individual mappings.
   *   - sourceRoot: Optional. The URL root from which all sources are relative.
   *   - mappings: A string of base64 VLQs which contain the actual mappings.
   *   - file: The generated file this source map is associated with.
   *
   * Here is an example source map, taken from the source map spec[0]:
   *
   *     {
   *       version : 3,
   *       file: "out.js",
   *       sourceRoot : "",
   *       sources: ["foo.js", "bar.js"],
   *       names: ["src", "maps", "are", "fun"],
   *       mappings: "AA,AB;;ABCDE;"
   * ***REMOVED***
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
   */
  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\***REMOVED***'/, ''));
***REMOVED***

    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    var names = util.getArg(sourceMap, 'names');
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file');

    if (version !== this._version) {
      throw new Error('Unsupported version: ' + version);
***REMOVED***

    this._names = ArraySet.fromArray(names);
    this._sources = ArraySet.fromArray(sources);
    this._sourceRoot = sourceRoot;
    this.file = file;

    // `this._generatedMappings` and `this._originalMappings` hold the parsed
    // mapping coordinates from the source map's "mappings" attribute. Each
    // object in the array is of the form
    //
    //     {
    //       generatedLine: The line number in the generated code,
    //       generatedColumn: The column number in the generated code,
    //       source: The path to the original source file that generated this
    //               chunk of code,
    //       originalLine: The line number in the original source that
    //                     corresponds to this chunk of generated code,
    //       originalColumn: The column number in the original source that
    //                       corresponds to this chunk of generated code,
    //       name: The name of the original symbol which generated this chunk of
    //             code.
    // ***REMOVED***
    //
    // All properties except for `generatedLine` and `generatedColumn` can be
    // `null`.
    //
    // `this._generatedMappings` is ordered by the generated positions.
    //
    // `this._originalMappings` is ordered by the original positions.
    this._generatedMappings = [];
    this._originalMappings = [];
    this._parseMappings(mappings, sourceRoot);
  ***REMOVED***

  /**
   * The version of the source mapping spec that we are consuming.
   */
  SourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
    get: function () {
      return this._sources.toArray().map(function (s) {
        return this._sourceRoot ? util.join(this._sourceRoot, s) : s;
    ***REMOVED*** this);
***REMOVED***
  ***REMOVED***);

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (an ordered list in this._generatedMappings).
   */
  SourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var mappingSeparator = /^[,;]/;
      var str = aStr;
      var mapping;
      var temp;

      while (str.length > 0) {
        if (str.charAt(0) === ';') {
          generatedLine++;
          str = str.slice(1);
          previousGeneratedColumn = 0;
    ***REMOVED***
        else if (str.charAt(0) === ',') {
          str = str.slice(1);
    ***REMOVED***
        else {
          mapping = {***REMOVED***;
          mapping.generatedLine = generatedLine;

          // Generated column.
          temp = base64VLQ.decode(str);
          mapping.generatedColumn = previousGeneratedColumn + temp.value;
          previousGeneratedColumn = mapping.generatedColumn;
          str = temp.rest;

          if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
            // Original source.
            temp = base64VLQ.decode(str);
            if (aSourceRoot) {
              mapping.source = util.join(aSourceRoot, this._sources.at(previousSource + temp.value));
        ***REMOVED***
            else {
              mapping.source = this._sources.at(previousSource + temp.value);
        ***REMOVED***
            previousSource += temp.value;
            str = temp.rest;
            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
              throw new Error('Found a source, but no line and column');
        ***REMOVED***

            // Original line.
            temp = base64VLQ.decode(str);
            mapping.originalLine = previousOriginalLine + temp.value;
            previousOriginalLine = mapping.originalLine;
            // Lines are stored 0-based
            mapping.originalLine += 1;
            str = temp.rest;
            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
              throw new Error('Found a source and line, but no column');
        ***REMOVED***

            // Original column.
            temp = base64VLQ.decode(str);
            mapping.originalColumn = previousOriginalColumn + temp.value;
            previousOriginalColumn = mapping.originalColumn;
            str = temp.rest;

            if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
              // Original name.
              temp = base64VLQ.decode(str);
              mapping.name = this._names.at(previousName + temp.value);
              previousName += temp.value;
              str = temp.rest;
        ***REMOVED***
      ***REMOVED***

          this._generatedMappings.push(mapping);
          this._originalMappings.push(mapping);
    ***REMOVED***
  ***REMOVED***

      this._originalMappings.sort(this._compareOriginalPositions);
***REMOVED***;

  /**
   * Comparator between two mappings where the original positions are compared.
   */
  SourceMapConsumer.prototype._compareOriginalPositions =
    function SourceMapConsumer_compareOriginalPositions(mappingA, mappingB) {
      if (mappingA.source > mappingB.source) {
        return 1;
  ***REMOVED***
      else if (mappingA.source < mappingB.source) {
        return -1;
  ***REMOVED***
      else {
        var cmp = mappingA.originalLine - mappingB.originalLine;
        return cmp === 0
          ? mappingA.originalColumn - mappingB.originalColumn
          : cmp;
  ***REMOVED***
***REMOVED***;

  /**
   * Comparator between two mappings where the generated positions are compared.
   */
  SourceMapConsumer.prototype._compareGeneratedPositions =
    function SourceMapConsumer_compareGeneratedPositions(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      return cmp === 0
        ? mappingA.generatedColumn - mappingB.generatedColumn
        : cmp;
***REMOVED***;

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  SourceMapConsumer.prototype._findMapping =
    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                           aColumnName, aComparator) {
      // To return the position we are searching for, we must first find the
      // mapping for the given position and then return the opposite position it
      // points to. Because the mappings are sorted, we can use binary search to
      // find the best mapping.

      if (aNeedle[aLineName] <= 0) {
        throw new TypeError('Line must be greater than or equal to 1, got '
                            + aNeedle[aLineName]);
  ***REMOVED***
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError('Column must be greater than or equal to 0, got '
                            + aNeedle[aColumnName]);
  ***REMOVED***

      return binarySearch.search(aNeedle, aMappings, aComparator);
***REMOVED***;

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  SourceMapConsumer.prototype.originalPositionFor =
    function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
  ***REMOVED***;

      var mapping = this._findMapping(needle,
                                      this._generatedMappings,
                                      "generatedLine",
                                      "generatedColumn",
                                      this._compareGeneratedPositions)

      if (mapping) {
        return {
          source: util.getArg(mapping, 'source', null),
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: util.getArg(mapping, 'name', null)
    ***REMOVED***;
  ***REMOVED***

      return {
        source: null,
        line: null,
        column: null,
        name: null
  ***REMOVED***;
***REMOVED***;

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  SourceMapConsumer.prototype.generatedPositionFor =
    function SourceMapConsumer_generatedPositionFor(aArgs) {
      var needle = {
        source: util.getArg(aArgs, 'source'),
        originalLine: util.getArg(aArgs, 'line'),
        originalColumn: util.getArg(aArgs, 'column')
  ***REMOVED***;

      var mapping = this._findMapping(needle,
                                      this._originalMappings,
                                      "originalLine",
                                      "originalColumn",
                                      this._compareOriginalPositions)

      if (mapping) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null)
    ***REMOVED***;
  ***REMOVED***

      return {
        line: null,
        column: null
  ***REMOVED***;
***REMOVED***;

  exports.SourceMapConsumer = SourceMapConsumer;

***REMOVED***);
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define('source-map/source-map-generator', function (require, exports, module) {

  var base64VLQ = require('./base64-vlq');
  var util = require('./util');
  var ArraySet = require('./array-set').ArraySet;

  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. To create a new one, you must pass an object
   * with the following properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: An optional root for all URLs in this source map.
   */
  function SourceMapGenerator(aArgs) {
    this._file = util.getArg(aArgs, 'file');
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = [];
  ***REMOVED***

  SourceMapGenerator.prototype._version = 3;

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  SourceMapGenerator.prototype.addMapping =
    function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, 'generated');
      var original = util.getArg(aArgs, 'original', null);
      var source = util.getArg(aArgs, 'source', null);
      var name = util.getArg(aArgs, 'name', null);

      this._validateMapping(generated, original, source, name);

      if (source && !this._sources.has(source)) {
        this._sources.add(source);
  ***REMOVED***

      if (name && !this._names.has(name)) {
        this._names.add(name);
  ***REMOVED***

      this._mappings.push({
        generated: generated,
        original: original,
        source: source,
        name: name
  ***REMOVED***);
***REMOVED***;

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  SourceMapGenerator.prototype._validateMapping =
    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                aName) {
      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
          && aGenerated.line > 0 && aGenerated.column >= 0
          && !aOriginal && !aSource && !aName) {
        // Case 1.
        return;
  ***REMOVED***
      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
               && aGenerated.line > 0 && aGenerated.column >= 0
               && aOriginal.line > 0 && aOriginal.column >= 0
               && aSource) {
        // Cases 2 and 3.
        return;
  ***REMOVED***
      else {
        throw new Error('Invalid mapping.');
  ***REMOVED***
***REMOVED***;

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  SourceMapGenerator.prototype._serializeMappings =
    function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = '';
      var mapping;

      // The mappings must be guarenteed to be in sorted order before we start
      // serializing them or else the generated line numbers (which are defined
      // via the ';' separators) will be all messed up. Note: it might be more
      // performant to maintain the sorting as we insert them, rather than as we
      // serialize them, but the big O is the same either way.
      this._mappings.sort(function (mappingA, mappingB) {
        var cmp = mappingA.generated.line - mappingB.generated.line;
        return cmp === 0
          ? mappingA.generated.column - mappingB.generated.column
          : cmp;
  ***REMOVED***);

      for (var i = 0, len = this._mappings.length; i < len; i++) {
        mapping = this._mappings[i];

        if (mapping.generated.line !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generated.line !== previousGeneratedLine) {
            result += ';';
            previousGeneratedLine++;
      ***REMOVED***
    ***REMOVED***
        else {
          if (i > 0) {
            result += ',';
      ***REMOVED***
    ***REMOVED***

        result += base64VLQ.encode(mapping.generated.column
                                   - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generated.column;

        if (mapping.source && mapping.original) {
          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
                                     - previousSource);
          previousSource = this._sources.indexOf(mapping.source);

          // lines are stored 0-based in SourceMap spec version 3
          result += base64VLQ.encode(mapping.original.line - 1
                                     - previousOriginalLine);
          previousOriginalLine = mapping.original.line - 1;

          result += base64VLQ.encode(mapping.original.column
                                     - previousOriginalColumn);
          previousOriginalColumn = mapping.original.column;

          if (mapping.name) {
            result += base64VLQ.encode(this._names.indexOf(mapping.name)
                                       - previousName);
            previousName = this._names.indexOf(mapping.name);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      return result;
***REMOVED***;

  /**
   * Externalize the source map.
   */
  SourceMapGenerator.prototype.toJSON =
    function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        file: this._file,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
  ***REMOVED***;
      if (this._sourceRoot) {
        map.sourceRoot = this._sourceRoot;
  ***REMOVED***
      return map;
***REMOVED***;

  /**
   * Render the source map being generated to a string.
   */
  SourceMapGenerator.prototype.toString =
    function SourceMapGenerator_toString() {
      return JSON.stringify(this);
***REMOVED***;

  exports.SourceMapGenerator = SourceMapGenerator;

***REMOVED***);
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define('source-map/source-node', function (require, exports, module) {

  var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;

  /**
   * SourceNodes provide a way to abstract over interpolating/concatenating
   * snippets of generated JavaScript source code while maintaining the line and
   * column information associated with the original source code.
   *
   * @param aLine The original line number.
   * @param aColumn The original column number.
   * @param aSource The original source's filename.
   * @param aChunks Optional. An array of strings which are snippets of
   *        generated JS, or other SourceNodes.
   */
  function SourceNode(aLine, aColumn, aSource, aChunks) {
    this.children = [];
    this.line = aLine;
    this.column = aColumn;
    this.source = aSource;
    if (aChunks != null) this.add(aChunks);
  ***REMOVED***

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function (chunk) {
        this.add(chunk);
    ***REMOVED*** this);
***REMOVED***
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
  ***REMOVED***
***REMOVED***
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
***REMOVED***
    return this;
  ***REMOVED***;

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length-1; i >= 0; i--) {
        this.prepend(aChunk[i]);
  ***REMOVED***
***REMOVED***
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      this.children.unshift(aChunk);
***REMOVED***
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
***REMOVED***
    return this;
  ***REMOVED***;

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    this.children.forEach(function (chunk) {
      if (chunk instanceof SourceNode) {
        chunk.walk(aFn);
  ***REMOVED***
      else {
        if (chunk !== '') {
          aFn(chunk, { source: this.source, line: this.line, column: this.column ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
  ***REMOVED*** this);
  ***REMOVED***;

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len-1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
  ***REMOVED***
      newChildren.push(this.children[i]);
      this.children = newChildren;
***REMOVED***
    return this;
  ***REMOVED***;

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild instanceof SourceNode) {
      lastChild.replaceRight(aPattern, aReplacement);
***REMOVED***
    else if (typeof lastChild === 'string') {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
***REMOVED***
    else {
      this.children.push(''.replace(aPattern, aReplacement));
***REMOVED***
    return this;
  ***REMOVED***;

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function (chunk) {
      str += chunk;
***REMOVED***);
    return str;
  ***REMOVED***;

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
***REMOVED***;
    var map = new SourceMapGenerator(aArgs);
    this.walk(function (chunk, original) {
      generated.code += chunk;
      if (original.source != null
          && original.line != null
          && original.column != null) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
        ***REMOVED***
          generated: {
            line: generated.line,
            column: generated.column
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
      chunk.split('').forEach(function (char) {
        if (char === '\n') {
          generated.line++;
          generated.column = 0;
    ***REMOVED*** else {
          generated.column++;
    ***REMOVED***
  ***REMOVED***);
***REMOVED***);

    return { code: generated.code, map: map ***REMOVED***;
  ***REMOVED***;

  exports.SourceNode = SourceNode;

***REMOVED***);
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define('source-map/util', function (require, exports, module) {

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
***REMOVED*** else if (arguments.length === 3) {
      return aDefaultValue;
***REMOVED*** else {
      throw new Error('"' + aName + '" is a required argument.');
***REMOVED***
  ***REMOVED***
  exports.getArg = getArg;

  function join(aRoot, aPath) {
    return aPath.charAt(0) === '/'
      ? aPath
      : aRoot.replace(/\/*$/, '') + '/' + aPath;
  ***REMOVED***
  exports.join = join;

***REMOVED***);
define('source-map', function (require, exports, module) {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./source-map/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./source-map/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./source-map/source-node').SourceNode;

***REMOVED***);

//Distributed under the BSD license:
//Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>
define('uglifyjs2', ['exports', 'source-map', 'logger'], function (exports, MOZ_SourceMap, logger) {
(function(exports, global) {
    global["UglifyJS"] = exports;
    "use strict";
    function array_to_hash(a) {
        var ret = Object.create(null);
        for (var i = 0; i < a.length; ++i) ret[a[i]] = true;
        return ret;
***REMOVED***
    function slice(a, start) {
        return Array.prototype.slice.call(a, start || 0);
***REMOVED***
    function characters(str) {
        return str.split("");
***REMOVED***
    function member(name, array) {
        for (var i = array.length; --i >= 0; ) if (array[i] == name) return true;
        return false;
***REMOVED***
    function find_if(func, array) {
        for (var i = 0, n = array.length; i < n; ++i) {
            if (func(array[i])) return array[i];
    ***REMOVED***
***REMOVED***
    function repeat_string(str, i) {
        if (i <= 0) return "";
        if (i == 1) return str;
        var d = repeat_string(str, i >> 1);
        d += d;
        if (i & 1) d += str;
        return d;
***REMOVED***
    function DefaultsError(msg, defs) {
        this.msg = msg;
        this.defs = defs;
***REMOVED***
    function defaults(args, defs, croak) {
        if (args === true) args = {***REMOVED***;
        var ret = args || {***REMOVED***;
        if (croak) for (var i in ret) if (ret.hasOwnProperty(i) && !defs.hasOwnProperty(i)) throw new DefaultsError("`" + i + "` is not a supported option", defs);
        for (var i in defs) if (defs.hasOwnProperty(i)) {
            ret[i] = args && args.hasOwnProperty(i) ? args[i] : defs[i];
    ***REMOVED***
        return ret;
***REMOVED***
    function merge(obj, ext) {
        for (var i in ext) if (ext.hasOwnProperty(i)) {
            obj[i] = ext[i];
    ***REMOVED***
        return obj;
***REMOVED***
    function noop() {***REMOVED***
    var MAP = function() {
        function MAP(a, f, backwards) {
            var ret = [], top = [], i;
            function doit() {
                var val = f(a[i], i);
                var is_last = val instanceof Last;
                if (is_last) val = val.v;
                if (val instanceof AtTop) {
                    val = val.v;
                    if (val instanceof Splice) {
                        top.push.apply(top, backwards ? val.v.slice().reverse() : val.v);
                ***REMOVED*** else {
                        top.push(val);
                ***REMOVED***
            ***REMOVED*** else if (val !== skip) {
                    if (val instanceof Splice) {
                        ret.push.apply(ret, backwards ? val.v.slice().reverse() : val.v);
                ***REMOVED*** else {
                        ret.push(val);
                ***REMOVED***
            ***REMOVED***
                return is_last;
        ***REMOVED***
            if (a instanceof Array) {
                if (backwards) {
                    for (i = a.length; --i >= 0; ) if (doit()) break;
                    ret.reverse();
                    top.reverse();
            ***REMOVED*** else {
                    for (i = 0; i < a.length; ++i) if (doit()) break;
            ***REMOVED***
        ***REMOVED*** else {
                for (i in a) if (a.hasOwnProperty(i)) if (doit()) break;
        ***REMOVED***
            return top.concat(ret);
    ***REMOVED***
        MAP.at_top = function(val) {
            return new AtTop(val);
    ***REMOVED***;
        MAP.splice = function(val) {
            return new Splice(val);
    ***REMOVED***;
        MAP.last = function(val) {
            return new Last(val);
    ***REMOVED***;
        var skip = MAP.skip = {***REMOVED***;
        function AtTop(val) {
            this.v = val;
    ***REMOVED***
        function Splice(val) {
            this.v = val;
    ***REMOVED***
        function Last(val) {
            this.v = val;
    ***REMOVED***
        return MAP;
***REMOVED***();
    function push_uniq(array, el) {
        if (array.indexOf(el) < 0) array.push(el);
***REMOVED***
    function string_template(text, props) {
        return text.replace(/\{(.+?)\***REMOVED***/g, function(str, p) {
            return props[p];
    ***REMOVED***);
***REMOVED***
    function remove(array, el) {
        for (var i = array.length; --i >= 0; ) {
            if (array[i] === el) array.splice(i, 1);
    ***REMOVED***
***REMOVED***
    function mergeSort(array, cmp) {
        if (array.length < 2) return array.slice();
        function merge(a, b) {
            var r = [], ai = 0, bi = 0, i = 0;
            while (ai < a.length && bi < b.length) {
                cmp(a[ai], b[bi]) <= 0 ? r[i++] = a[ai++] : r[i++] = b[bi++];
        ***REMOVED***
            if (ai < a.length) r.push.apply(r, a.slice(ai));
            if (bi < b.length) r.push.apply(r, b.slice(bi));
            return r;
    ***REMOVED***
        function _ms(a) {
            if (a.length <= 1) return a;
            var m = Math.floor(a.length / 2), left = a.slice(0, m), right = a.slice(m);
            left = _ms(left);
            right = _ms(right);
            return merge(left, right);
    ***REMOVED***
        return _ms(array);
***REMOVED***
    function set_difference(a, b) {
        return a.filter(function(el) {
            return b.indexOf(el) < 0;
    ***REMOVED***);
***REMOVED***
    function set_intersection(a, b) {
        return a.filter(function(el) {
            return b.indexOf(el) >= 0;
    ***REMOVED***);
***REMOVED***
    function makePredicate(words) {
        if (!(words instanceof Array)) words = words.split(" ");
        var f = "", cats = [];
        out: for (var i = 0; i < words.length; ++i) {
            for (var j = 0; j < cats.length; ++j) if (cats[j][0].length == words[i].length) {
                cats[j].push(words[i]);
                continue out;
        ***REMOVED***
            cats.push([ words[i] ]);
    ***REMOVED***
        function compareTo(arr) {
            if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";";
            f += "switch(str){";
            for (var i = 0; i < arr.length; ++i) f += "case " + JSON.stringify(arr[i]) + ":";
            f += "return true***REMOVED***return false;";
    ***REMOVED***
        if (cats.length > 3) {
            cats.sort(function(a, b) {
                return b.length - a.length;
        ***REMOVED***);
            f += "switch(str.length){";
            for (var i = 0; i < cats.length; ++i) {
                var cat = cats[i];
                f += "case " + cat[0].length + ":";
                compareTo(cat);
        ***REMOVED***
            f += "***REMOVED***";
    ***REMOVED*** else {
            compareTo(words);
    ***REMOVED***
        return new Function("str", f);
***REMOVED***
    function Dictionary() {
        this._values = Object.create(null);
        this._size = 0;
***REMOVED***
    Dictionary.prototype = {
        set: function(key, val) {
            if (!this.has(key)) ++this._size;
            this._values["$" + key] = val;
            return this;
      ***REMOVED***
        get: function(key) {
            return this._values["$" + key];
      ***REMOVED***
        del: function(key) {
            if (this.has(key)) {
                --this._size;
                delete this._values["$" + key];
        ***REMOVED***
            return this;
      ***REMOVED***
        has: function(key) {
            return "$" + key in this._values;
      ***REMOVED***
        each: function(f) {
            for (var i in this._values) f(this._values[i], i.substr(1));
      ***REMOVED***
        size: function() {
            return this._size;
      ***REMOVED***
        map: function(f) {
            var ret = [];
            for (var i in this._values) ret.push(f(this._values[i], i.substr(1)));
            return ret;
    ***REMOVED***
***REMOVED***;
    "use strict";
    function DEFNODE(type, props, methods, base) {
        if (arguments.length < 4) base = AST_Node;
        if (!props) props = []; else props = props.split(/\s+/);
        var self_props = props;
        if (base && base.PROPS) props = props.concat(base.PROPS);
        var code = "return function AST_" + type + "(props){ if (props) { ";
        for (var i = props.length; --i >= 0; ) {
            code += "this." + props[i] + " = props." + props[i] + ";";
    ***REMOVED***
        var proto = base && new base();
        if (proto && proto.initialize || methods && methods.initialize) code += "this.initialize();";
        code += "***REMOVED******REMOVED***";
        var ctor = new Function(code)();
        if (proto) {
            ctor.prototype = proto;
            ctor.BASE = base;
    ***REMOVED***
        if (base) base.SUBCLASSES.push(ctor);
        ctor.prototype.CTOR = ctor;
        ctor.PROPS = props || null;
        ctor.SELF_PROPS = self_props;
        ctor.SUBCLASSES = [];
        if (type) {
            ctor.prototype.TYPE = ctor.TYPE = type;
    ***REMOVED***
        if (methods) for (i in methods) if (methods.hasOwnProperty(i)) {
            if (/^\$/.test(i)) {
                ctor[i.substr(1)] = methods[i];
        ***REMOVED*** else {
                ctor.prototype[i] = methods[i];
        ***REMOVED***
    ***REMOVED***
        ctor.DEFMETHOD = function(name, method) {
            this.prototype[name] = method;
    ***REMOVED***;
        return ctor;
***REMOVED***
    var AST_Token = DEFNODE("Token", "type value line col pos endpos nlb comments_before file", {***REMOVED***, null);
    var AST_Node = DEFNODE("Node", "start end", {
        clone: function() {
            return new this.CTOR(this);
      ***REMOVED***
        $documentation: "Base class of all AST nodes",
        $propdoc: {
            start: "[AST_Token] The first token of this node",
            end: "[AST_Token] The last token of this node"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this);
      ***REMOVED***
        walk: function(visitor) {
            return this._walk(visitor);
    ***REMOVED***
  ***REMOVED*** null);
    AST_Node.warn_function = null;
    AST_Node.warn = function(txt, props) {
        if (AST_Node.warn_function) AST_Node.warn_function(string_template(txt, props));
***REMOVED***;
    var AST_Statement = DEFNODE("Statement", null, {
        $documentation: "Base class of all statements"
***REMOVED***);
    var AST_Debugger = DEFNODE("Debugger", null, {
        $documentation: "Represents a debugger statement"
  ***REMOVED*** AST_Statement);
    var AST_Directive = DEFNODE("Directive", "value scope", {
        $documentation: 'Represents a directive, like "use strict";',
        $propdoc: {
            value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
            scope: "[AST_Scope/S] The scope that this directive affects"
    ***REMOVED***
  ***REMOVED*** AST_Statement);
    var AST_SimpleStatement = DEFNODE("SimpleStatement", "body", {
        $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
        $propdoc: {
            body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.body._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Statement);
    function walk_body(node, visitor) {
        if (node.body instanceof AST_Statement) {
            node.body._walk(visitor);
    ***REMOVED*** else node.body.forEach(function(stat) {
            stat._walk(visitor);
    ***REMOVED***);
***REMOVED***
    var AST_Block = DEFNODE("Block", "body", {
        $documentation: "A body of statements (usually bracketed)",
        $propdoc: {
            body: "[AST_Statement*] an array of statements"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                walk_body(this, visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Statement);
    var AST_BlockStatement = DEFNODE("BlockStatement", null, {
        $documentation: "A block statement"
  ***REMOVED*** AST_Block);
    var AST_EmptyStatement = DEFNODE("EmptyStatement", null, {
        $documentation: "The empty statement (empty block or simply a semicolon)",
        _walk: function(visitor) {
            return visitor._visit(this);
    ***REMOVED***
  ***REMOVED*** AST_Statement);
    var AST_StatementWithBody = DEFNODE("StatementWithBody", "body", {
        $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
        $propdoc: {
            body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.body._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Statement);
    var AST_LabeledStatement = DEFNODE("LabeledStatement", "label", {
        $documentation: "Statement with a label",
        $propdoc: {
            label: "[AST_Label] a label definition"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.label._walk(visitor);
                this.body._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_StatementWithBody);
    var AST_DWLoop = DEFNODE("DWLoop", "condition", {
        $documentation: "Base class for do/while statements",
        $propdoc: {
            condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.condition._walk(visitor);
                this.body._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_StatementWithBody);
    var AST_Do = DEFNODE("Do", null, {
        $documentation: "A `do` statement"
  ***REMOVED*** AST_DWLoop);
    var AST_While = DEFNODE("While", null, {
        $documentation: "A `while` statement"
  ***REMOVED*** AST_DWLoop);
    var AST_For = DEFNODE("For", "init condition step", {
        $documentation: "A `for` statement",
        $propdoc: {
            init: "[AST_Node?] the `for` initialization code, or null if empty",
            condition: "[AST_Node?] the `for` termination clause, or null if empty",
            step: "[AST_Node?] the `for` update clause, or null if empty"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                if (this.init) this.init._walk(visitor);
                if (this.condition) this.condition._walk(visitor);
                if (this.step) this.step._walk(visitor);
                this.body._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_StatementWithBody);
    var AST_ForIn = DEFNODE("ForIn", "init name object", {
        $documentation: "A `for ... in` statement",
        $propdoc: {
            init: "[AST_Node] the `for/in` initialization code",
            name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var",
            object: "[AST_Node] the object that we're looping through"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.init._walk(visitor);
                this.object._walk(visitor);
                this.body._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_StatementWithBody);
    var AST_With = DEFNODE("With", "expression", {
        $documentation: "A `with` statement",
        $propdoc: {
            expression: "[AST_Node] the `with` expression"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
                this.body._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_StatementWithBody);
    var AST_Scope = DEFNODE("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", {
        $documentation: "Base class for all statements introducing a lexical scope",
        $propdoc: {
            directives: "[string*/S] an array of directives declared in this scope",
            variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
            functions: "[Object/S] like `variables`, but only lists function declarations",
            uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
            uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
            parent_scope: "[AST_Scope?/S] link to the parent scope",
            enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
            cname: "[integer/S] current index for mangling variables (used internally by the mangler)"
    ***REMOVED***
  ***REMOVED*** AST_Block);
    var AST_Toplevel = DEFNODE("Toplevel", "globals", {
        $documentation: "The toplevel scope",
        $propdoc: {
            globals: "[Object/S] a map of name -> SymbolDef for all undeclared names"
      ***REMOVED***
        wrap_commonjs: function(name, export_all) {
            var self = this;
            if (export_all) {
                self.figure_out_scope();
                var to_export = [];
                self.walk(new TreeWalker(function(node) {
                    if (node instanceof AST_SymbolDeclaration && node.definition().global) {
                        if (!find_if(function(n) {
                            return n.name == node.name;
                      ***REMOVED*** to_export)) to_export.push(node);
                ***REMOVED***
            ***REMOVED***));
        ***REMOVED***
            var wrapped_tl = "(function(exports, global){ global['" + name + "'] = exports; '$ORIG'; '$EXPORTS'; ***REMOVED***({***REMOVED***, (function(){return this***REMOVED***())))";
            wrapped_tl = parse(wrapped_tl);
            wrapped_tl = wrapped_tl.transform(new TreeTransformer(function before(node) {
                if (node instanceof AST_SimpleStatement) {
                    node = node.body;
                    if (node instanceof AST_String) switch (node.getValue()) {
                      case "$ORIG":
                        return MAP.splice(self.body);

                      case "$EXPORTS":
                        var body = [];
                        to_export.forEach(function(sym) {
                            body.push(new AST_SimpleStatement({
                                body: new AST_Assign({
                                    left: new AST_Sub({
                                        expression: new AST_SymbolRef({
                                            name: "exports"
                                    ***REMOVED***),
                                        property: new AST_String({
                                            value: sym.name
                                    ***REMOVED***)
                                ***REMOVED***),
                                    operator: "=",
                                    right: new AST_SymbolRef(sym)
                            ***REMOVED***)
                        ***REMOVED***));
                    ***REMOVED***);
                        return MAP.splice(body);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***));
            return wrapped_tl;
    ***REMOVED***
  ***REMOVED*** AST_Scope);
    var AST_Lambda = DEFNODE("Lambda", "name argnames uses_arguments", {
        $documentation: "Base class for functions",
        $propdoc: {
            name: "[AST_SymbolDeclaration?] the name of this function",
            argnames: "[AST_SymbolFunarg*] array of function arguments",
            uses_arguments: "[boolean/S] tells whether this function accesses the arguments array"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                if (this.name) this.name._walk(visitor);
                this.argnames.forEach(function(arg) {
                    arg._walk(visitor);
            ***REMOVED***);
                walk_body(this, visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Scope);
    var AST_Accessor = DEFNODE("Accessor", null, {
        $documentation: "A setter/getter function"
  ***REMOVED*** AST_Lambda);
    var AST_Function = DEFNODE("Function", null, {
        $documentation: "A function expression"
  ***REMOVED*** AST_Lambda);
    var AST_Defun = DEFNODE("Defun", null, {
        $documentation: "A function definition"
  ***REMOVED*** AST_Lambda);
    var AST_Jump = DEFNODE("Jump", null, {
        $documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)"
  ***REMOVED*** AST_Statement);
    var AST_Exit = DEFNODE("Exit", "value", {
        $documentation: "Base class for “exits” (`return` and `throw`)",
        $propdoc: {
            value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, this.value && function() {
                this.value._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Jump);
    var AST_Return = DEFNODE("Return", null, {
        $documentation: "A `return` statement"
  ***REMOVED*** AST_Exit);
    var AST_Throw = DEFNODE("Throw", null, {
        $documentation: "A `throw` statement"
  ***REMOVED*** AST_Exit);
    var AST_LoopControl = DEFNODE("LoopControl", "label", {
        $documentation: "Base class for loop control statements (`break` and `continue`)",
        $propdoc: {
            label: "[AST_LabelRef?] the label, or null if none"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, this.label && function() {
                this.label._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Jump);
    var AST_Break = DEFNODE("Break", null, {
        $documentation: "A `break` statement"
  ***REMOVED*** AST_LoopControl);
    var AST_Continue = DEFNODE("Continue", null, {
        $documentation: "A `continue` statement"
  ***REMOVED*** AST_LoopControl);
    var AST_If = DEFNODE("If", "condition alternative", {
        $documentation: "A `if` statement",
        $propdoc: {
            condition: "[AST_Node] the `if` condition",
            alternative: "[AST_Statement?] the `else` part, or null if not present"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.condition._walk(visitor);
                this.body._walk(visitor);
                if (this.alternative) this.alternative._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_StatementWithBody);
    var AST_Switch = DEFNODE("Switch", "expression", {
        $documentation: "A `switch` statement",
        $propdoc: {
            expression: "[AST_Node] the `switch` “discriminant”"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
                walk_body(this, visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Block);
    var AST_SwitchBranch = DEFNODE("SwitchBranch", null, {
        $documentation: "Base class for `switch` branches"
  ***REMOVED*** AST_Block);
    var AST_Default = DEFNODE("Default", null, {
        $documentation: "A `default` switch branch"
  ***REMOVED*** AST_SwitchBranch);
    var AST_Case = DEFNODE("Case", "expression", {
        $documentation: "A `case` switch branch",
        $propdoc: {
            expression: "[AST_Node] the `case` expression"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
                walk_body(this, visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_SwitchBranch);
    var AST_Try = DEFNODE("Try", "bcatch bfinally", {
        $documentation: "A `try` statement",
        $propdoc: {
            bcatch: "[AST_Catch?] the catch block, or null if not present",
            bfinally: "[AST_Finally?] the finally block, or null if not present"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                walk_body(this, visitor);
                if (this.bcatch) this.bcatch._walk(visitor);
                if (this.bfinally) this.bfinally._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Block);
    var AST_Catch = DEFNODE("Catch", "argname", {
        $documentation: "A `catch` node; only makes sense as part of a `try` statement",
        $propdoc: {
            argname: "[AST_SymbolCatch] symbol for the exception"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.argname._walk(visitor);
                walk_body(this, visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Block);
    var AST_Finally = DEFNODE("Finally", null, {
        $documentation: "A `finally` node; only makes sense as part of a `try` statement"
  ***REMOVED*** AST_Block);
    var AST_Definitions = DEFNODE("Definitions", "definitions", {
        $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
        $propdoc: {
            definitions: "[AST_VarDef*] array of variable definitions"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.definitions.forEach(function(def) {
                    def._walk(visitor);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_Statement);
    var AST_Var = DEFNODE("Var", null, {
        $documentation: "A `var` statement"
  ***REMOVED*** AST_Definitions);
    var AST_Const = DEFNODE("Const", null, {
        $documentation: "A `const` statement"
  ***REMOVED*** AST_Definitions);
    var AST_VarDef = DEFNODE("VarDef", "name value", {
        $documentation: "A variable declaration; only appears in a AST_Definitions node",
        $propdoc: {
            name: "[AST_SymbolVar|AST_SymbolConst] name of the variable",
            value: "[AST_Node?] initializer, or null of there's no initializer"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.name._walk(visitor);
                if (this.value) this.value._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_Call = DEFNODE("Call", "expression args", {
        $documentation: "A function call expression",
        $propdoc: {
            expression: "[AST_Node] expression to invoke as function",
            args: "[AST_Node*] array of arguments"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
                this.args.forEach(function(arg) {
                    arg._walk(visitor);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_New = DEFNODE("New", null, {
        $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"
  ***REMOVED*** AST_Call);
    var AST_Seq = DEFNODE("Seq", "car cdr", {
        $documentation: "A sequence expression (two comma-separated expressions)",
        $propdoc: {
            car: "[AST_Node] first element in sequence",
            cdr: "[AST_Node] second element in sequence"
      ***REMOVED***
        $cons: function(x, y) {
            var seq = new AST_Seq(x);
            seq.car = x;
            seq.cdr = y;
            return seq;
      ***REMOVED***
        $from_array: function(array) {
            if (array.length == 0) return null;
            if (array.length == 1) return array[0].clone();
            var list = null;
            for (var i = array.length; --i >= 0; ) {
                list = AST_Seq.cons(array[i], list);
        ***REMOVED***
            var p = list;
            while (p) {
                if (p.cdr && !p.cdr.cdr) {
                    p.cdr = p.cdr.car;
                    break;
            ***REMOVED***
                p = p.cdr;
        ***REMOVED***
            return list;
      ***REMOVED***
        to_array: function() {
            var p = this, a = [];
            while (p) {
                a.push(p.car);
                if (p.cdr && !(p.cdr instanceof AST_Seq)) {
                    a.push(p.cdr);
                    break;
            ***REMOVED***
                p = p.cdr;
        ***REMOVED***
            return a;
      ***REMOVED***
        add: function(node) {
            var p = this;
            while (p) {
                if (!(p.cdr instanceof AST_Seq)) {
                    var cell = AST_Seq.cons(p.cdr, node);
                    return p.cdr = cell;
            ***REMOVED***
                p = p.cdr;
        ***REMOVED***
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.car._walk(visitor);
                if (this.cdr) this.cdr._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_PropAccess = DEFNODE("PropAccess", "expression property", {
        $documentation: 'Base class for property access expressions, i.e. `a.foo` or `a["foo"]`',
        $propdoc: {
            expression: "[AST_Node] the “container” expression",
            property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node"
    ***REMOVED***
***REMOVED***);
    var AST_Dot = DEFNODE("Dot", null, {
        $documentation: "A dotted property access expression",
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_PropAccess);
    var AST_Sub = DEFNODE("Sub", null, {
        $documentation: 'Index-style property access, i.e. `a["foo"]`',
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
                this.property._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED*** AST_PropAccess);
    var AST_Unary = DEFNODE("Unary", "operator expression", {
        $documentation: "Base class for unary expressions",
        $propdoc: {
            operator: "[string] the operator",
            expression: "[AST_Node] expression that this unary operator applies to"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.expression._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_UnaryPrefix = DEFNODE("UnaryPrefix", null, {
        $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"
  ***REMOVED*** AST_Unary);
    var AST_UnaryPostfix = DEFNODE("UnaryPostfix", null, {
        $documentation: "Unary postfix expression, i.e. `i++`"
  ***REMOVED*** AST_Unary);
    var AST_Binary = DEFNODE("Binary", "left operator right", {
        $documentation: "Binary expression, i.e. `a + b`",
        $propdoc: {
            left: "[AST_Node] left-hand side expression",
            operator: "[string] the operator",
            right: "[AST_Node] right-hand side expression"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.left._walk(visitor);
                this.right._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_Conditional = DEFNODE("Conditional", "condition consequent alternative", {
        $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
        $propdoc: {
            condition: "[AST_Node]",
            consequent: "[AST_Node]",
            alternative: "[AST_Node]"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.condition._walk(visitor);
                this.consequent._walk(visitor);
                this.alternative._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_Assign = DEFNODE("Assign", null, {
        $documentation: "An assignment expression — `a = b + 5`"
  ***REMOVED*** AST_Binary);
    var AST_Array = DEFNODE("Array", "elements", {
        $documentation: "An array literal",
        $propdoc: {
            elements: "[AST_Node*] array of elements"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.elements.forEach(function(el) {
                    el._walk(visitor);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_Object = DEFNODE("Object", "properties", {
        $documentation: "An object literal",
        $propdoc: {
            properties: "[AST_ObjectProperty*] array of properties"
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.properties.forEach(function(prop) {
                    prop._walk(visitor);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_ObjectProperty = DEFNODE("ObjectProperty", "key value", {
        $documentation: "Base class for literal object properties",
        $propdoc: {
            key: "[string] the property name; it's always a plain string in our AST, no matter if it was a string, number or identifier in original code",
            value: "[AST_Node] property value.  For setters and getters this is an AST_Function."
      ***REMOVED***
        _walk: function(visitor) {
            return visitor._visit(this, function() {
                this.value._walk(visitor);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    var AST_ObjectKeyVal = DEFNODE("ObjectKeyVal", null, {
        $documentation: "A key: value object property"
  ***REMOVED*** AST_ObjectProperty);
    var AST_ObjectSetter = DEFNODE("ObjectSetter", null, {
        $documentation: "An object setter property"
  ***REMOVED*** AST_ObjectProperty);
    var AST_ObjectGetter = DEFNODE("ObjectGetter", null, {
        $documentation: "An object getter property"
  ***REMOVED*** AST_ObjectProperty);
    var AST_Symbol = DEFNODE("Symbol", "scope name thedef", {
        $propdoc: {
            name: "[string] name of this symbol",
            scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
            thedef: "[SymbolDef/S] the definition of this symbol"
      ***REMOVED***
        $documentation: "Base class for all symbols"
***REMOVED***);
    var AST_SymbolAccessor = DEFNODE("SymbolAccessor", null, {
        $documentation: "The name of a property accessor (setter/getter function)"
  ***REMOVED*** AST_Symbol);
    var AST_SymbolDeclaration = DEFNODE("SymbolDeclaration", "init", {
        $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)",
        $propdoc: {
            init: "[AST_Node*/S] array of initializers for this declaration."
    ***REMOVED***
  ***REMOVED*** AST_Symbol);
    var AST_SymbolVar = DEFNODE("SymbolVar", null, {
        $documentation: "Symbol defining a variable"
  ***REMOVED*** AST_SymbolDeclaration);
    var AST_SymbolConst = DEFNODE("SymbolConst", null, {
        $documentation: "A constant declaration"
  ***REMOVED*** AST_SymbolDeclaration);
    var AST_SymbolFunarg = DEFNODE("SymbolFunarg", null, {
        $documentation: "Symbol naming a function argument"
  ***REMOVED*** AST_SymbolVar);
    var AST_SymbolDefun = DEFNODE("SymbolDefun", null, {
        $documentation: "Symbol defining a function"
  ***REMOVED*** AST_SymbolDeclaration);
    var AST_SymbolLambda = DEFNODE("SymbolLambda", null, {
        $documentation: "Symbol naming a function expression"
  ***REMOVED*** AST_SymbolDeclaration);
    var AST_SymbolCatch = DEFNODE("SymbolCatch", null, {
        $documentation: "Symbol naming the exception in catch"
  ***REMOVED*** AST_SymbolDeclaration);
    var AST_Label = DEFNODE("Label", "references", {
        $documentation: "Symbol naming a label (declaration)",
        $propdoc: {
            references: "[AST_LabelRef*] a list of nodes referring to this label"
    ***REMOVED***
  ***REMOVED*** AST_Symbol);
    var AST_SymbolRef = DEFNODE("SymbolRef", null, {
        $documentation: "Reference to some symbol (not definition/declaration)"
  ***REMOVED*** AST_Symbol);
    var AST_LabelRef = DEFNODE("LabelRef", null, {
        $documentation: "Reference to a label symbol"
  ***REMOVED*** AST_Symbol);
    var AST_This = DEFNODE("This", null, {
        $documentation: "The `this` symbol"
  ***REMOVED*** AST_Symbol);
    var AST_Constant = DEFNODE("Constant", null, {
        $documentation: "Base class for all constants",
        getValue: function() {
            return this.value;
    ***REMOVED***
***REMOVED***);
    var AST_String = DEFNODE("String", "value", {
        $documentation: "A string literal",
        $propdoc: {
            value: "[string] the contents of this string"
    ***REMOVED***
  ***REMOVED*** AST_Constant);
    var AST_Number = DEFNODE("Number", "value", {
        $documentation: "A number literal",
        $propdoc: {
            value: "[number] the numeric value"
    ***REMOVED***
  ***REMOVED*** AST_Constant);
    var AST_RegExp = DEFNODE("RegExp", "value", {
        $documentation: "A regexp literal",
        $propdoc: {
            value: "[RegExp] the actual regexp"
    ***REMOVED***
  ***REMOVED*** AST_Constant);
    var AST_Atom = DEFNODE("Atom", null, {
        $documentation: "Base class for atoms"
  ***REMOVED*** AST_Constant);
    var AST_Null = DEFNODE("Null", null, {
        $documentation: "The `null` atom",
        value: null
  ***REMOVED*** AST_Atom);
    var AST_NaN = DEFNODE("NaN", null, {
        $documentation: "The impossible value",
        value: 0 / 0
  ***REMOVED*** AST_Atom);
    var AST_Undefined = DEFNODE("Undefined", null, {
        $documentation: "The `undefined` value",
        value: function() {***REMOVED***()
  ***REMOVED*** AST_Atom);
    var AST_Infinity = DEFNODE("Infinity", null, {
        $documentation: "The `Infinity` value",
        value: 1 / 0
  ***REMOVED*** AST_Atom);
    var AST_Boolean = DEFNODE("Boolean", null, {
        $documentation: "Base class for booleans"
  ***REMOVED*** AST_Atom);
    var AST_False = DEFNODE("False", null, {
        $documentation: "The `false` atom",
        value: false
  ***REMOVED*** AST_Boolean);
    var AST_True = DEFNODE("True", null, {
        $documentation: "The `true` atom",
        value: true
  ***REMOVED*** AST_Boolean);
    function TreeWalker(callback) {
        this.visit = callback;
        this.stack = [];
***REMOVED***
    TreeWalker.prototype = {
        _visit: function(node, descend) {
            this.stack.push(node);
            var ret = this.visit(node, descend ? function() {
                descend.call(node);
        ***REMOVED*** : noop);
            if (!ret && descend) {
                descend.call(node);
        ***REMOVED***
            this.stack.pop();
            return ret;
      ***REMOVED***
        parent: function(n) {
            return this.stack[this.stack.length - 2 - (n || 0)];
      ***REMOVED***
        push: function(node) {
            this.stack.push(node);
      ***REMOVED***
        pop: function() {
            return this.stack.pop();
      ***REMOVED***
        self: function() {
            return this.stack[this.stack.length - 1];
      ***REMOVED***
        find_parent: function(type) {
            var stack = this.stack;
            for (var i = stack.length; --i >= 0; ) {
                var x = stack[i];
                if (x instanceof type) return x;
        ***REMOVED***
      ***REMOVED***
        in_boolean_context: function() {
            var stack = this.stack;
            var i = stack.length, self = stack[--i];
            while (i > 0) {
                var p = stack[--i];
                if (p instanceof AST_If && p.condition === self || p instanceof AST_Conditional && p.condition === self || p instanceof AST_DWLoop && p.condition === self || p instanceof AST_For && p.condition === self || p instanceof AST_UnaryPrefix && p.operator == "!" && p.expression === self) {
                    return true;
            ***REMOVED***
                if (!(p instanceof AST_Binary && (p.operator == "&&" || p.operator == "||"))) return false;
                self = p;
        ***REMOVED***
      ***REMOVED***
        loopcontrol_target: function(label) {
            var stack = this.stack;
            if (label) {
                for (var i = stack.length; --i >= 0; ) {
                    var x = stack[i];
                    if (x instanceof AST_LabeledStatement && x.label.name == label.name) {
                        return x.body;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED*** else {
                for (var i = stack.length; --i >= 0; ) {
                    var x = stack[i];
                    if (x instanceof AST_Switch || x instanceof AST_For || x instanceof AST_ForIn || x instanceof AST_DWLoop) return x;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    "use strict";
    var KEYWORDS = "break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with";
    var KEYWORDS_ATOM = "false null true";
    var RESERVED_WORDS = "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile" + " " + KEYWORDS_ATOM + " " + KEYWORDS;
    var KEYWORDS_BEFORE_EXPRESSION = "return new delete throw else case";
    KEYWORDS = makePredicate(KEYWORDS);
    RESERVED_WORDS = makePredicate(RESERVED_WORDS);
    KEYWORDS_BEFORE_EXPRESSION = makePredicate(KEYWORDS_BEFORE_EXPRESSION);
    KEYWORDS_ATOM = makePredicate(KEYWORDS_ATOM);
    var OPERATOR_CHARS = makePredicate(characters("+-*&%=<>!?|~^"));
    var RE_HEX_NUMBER = /^0x[0-9a-f]+$/i;
    var RE_OCT_NUMBER = /^0[0-7]+$/;
    var RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;
    var OPERATORS = makePredicate([ "in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||" ]);
    var WHITESPACE_CHARS = makePredicate(characters("  \n\r	\f​᠎             　"));
    var PUNC_BEFORE_EXPRESSION = makePredicate(characters("[{(,.;:"));
    var PUNC_CHARS = makePredicate(characters("[]{***REMOVED***(),;:"));
    var REGEXP_MODIFIERS = makePredicate(characters("gmsiy"));
    var UNICODE = {
        letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0523\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u097B-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1159\\u115F-\\u11A2\\u11A8-\\u11F9\\u1200-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u1676\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19A9\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2C6F\\u2C71-\\u2C7D\\u2C80-\\u2CE4\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400\\u4DB5\\u4E00\\u9FC3\\uA000-\\uA48C\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA90A-\\uA925\\uA930-\\uA946\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAC00\\uD7A3\\uF900-\\uFA2D\\uFA30-\\uFA6A\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
        non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
        space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
        connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
***REMOVED***;
    function is_letter(code) {
        return code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 170 && UNICODE.letter.test(String.fromCharCode(code));
***REMOVED***
    function is_digit(code) {
        return code >= 48 && code <= 57;
***REMOVED***
    function is_alphanumeric_char(code) {
        return is_digit(code) || is_letter(code);
***REMOVED***
    function is_unicode_combining_mark(ch) {
        return UNICODE.non_spacing_mark.test(ch) || UNICODE.space_combining_mark.test(ch);
***REMOVED***
    function is_unicode_connector_punctuation(ch) {
        return UNICODE.connector_punctuation.test(ch);
***REMOVED***
    function is_identifier(name) {
        return /^[a-z_$][a-z0-9_$]*$/i.test(name) && !RESERVED_WORDS(name);
***REMOVED***
    function is_identifier_start(code) {
        return code == 36 || code == 95 || is_letter(code);
***REMOVED***
    function is_identifier_char(ch) {
        var code = ch.charCodeAt(0);
        return is_identifier_start(code) || is_digit(code) || code == 8204 || code == 8205 || is_unicode_combining_mark(ch) || is_unicode_connector_punctuation(ch);
***REMOVED***
    function parse_js_number(num) {
        if (RE_HEX_NUMBER.test(num)) {
            return parseInt(num.substr(2), 16);
    ***REMOVED*** else if (RE_OCT_NUMBER.test(num)) {
            return parseInt(num.substr(1), 8);
    ***REMOVED*** else if (RE_DEC_NUMBER.test(num)) {
            return parseFloat(num);
    ***REMOVED***
***REMOVED***
    function JS_Parse_Error(message, line, col, pos) {
        this.message = message;
        this.line = line;
        this.col = col;
        this.pos = pos;
        this.stack = new Error().stack;
***REMOVED***
    JS_Parse_Error.prototype.toString = function() {
        return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack;
***REMOVED***;
    function js_error(message, filename, line, col, pos) {
        AST_Node.warn("ERROR: {message***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", {
            message: message,
            file: filename,
            line: line,
            col: col
    ***REMOVED***);
        throw new JS_Parse_Error(message, line, col, pos);
***REMOVED***
    function is_token(token, type, val) {
        return token.type == type && (val == null || token.value == val);
***REMOVED***
    var EX_EOF = {***REMOVED***;
    function tokenizer($TEXT, filename) {
        var S = {
            text: $TEXT.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/\uFEFF/g, ""),
            filename: filename,
            pos: 0,
            tokpos: 0,
            line: 1,
            tokline: 0,
            col: 0,
            tokcol: 0,
            newline_before: false,
            regex_allowed: false,
            comments_before: []
    ***REMOVED***;
        function peek() {
            return S.text.charAt(S.pos);
    ***REMOVED***
        function next(signal_eof, in_string) {
            var ch = S.text.charAt(S.pos++);
            if (signal_eof && !ch) throw EX_EOF;
            if (ch == "\n") {
                S.newline_before = S.newline_before || !in_string;
                ++S.line;
                S.col = 0;
        ***REMOVED*** else {
                ++S.col;
        ***REMOVED***
            return ch;
    ***REMOVED***
        function find(what, signal_eof) {
            var pos = S.text.indexOf(what, S.pos);
            if (signal_eof && pos == -1) throw EX_EOF;
            return pos;
    ***REMOVED***
        function start_token() {
            S.tokline = S.line;
            S.tokcol = S.col;
            S.tokpos = S.pos;
    ***REMOVED***
        function token(type, value, is_comment) {
            S.regex_allowed = type == "operator" && !UNARY_POSTFIX[value] || type == "keyword" && KEYWORDS_BEFORE_EXPRESSION(value) || type == "punc" && PUNC_BEFORE_EXPRESSION(value);
            var ret = {
                type: type,
                value: value,
                line: S.tokline,
                col: S.tokcol,
                pos: S.tokpos,
                endpos: S.pos,
                nlb: S.newline_before,
                file: filename
        ***REMOVED***;
            if (!is_comment) {
                ret.comments_before = S.comments_before;
                S.comments_before = [];
                for (var i = 0, len = ret.comments_before.length; i < len; i++) {
                    ret.nlb = ret.nlb || ret.comments_before[i].nlb;
            ***REMOVED***
        ***REMOVED***
            S.newline_before = false;
            return new AST_Token(ret);
    ***REMOVED***
        function skip_whitespace() {
            while (WHITESPACE_CHARS(peek())) next();
    ***REMOVED***
        function read_while(pred) {
            var ret = "", ch, i = 0;
            while ((ch = peek()) && pred(ch, i++)) ret += next();
            return ret;
    ***REMOVED***
        function parse_error(err) {
            js_error(err, filename, S.tokline, S.tokcol, S.tokpos);
    ***REMOVED***
        function read_num(prefix) {
            var has_e = false, after_e = false, has_x = false, has_dot = prefix == ".";
            var num = read_while(function(ch, i) {
                var code = ch.charCodeAt(0);
                switch (code) {
                  case 120:
                  case 88:
                    return has_x ? false : has_x = true;

                  case 101:
                  case 69:
                    return has_x ? true : has_e ? false : has_e = after_e = true;

                  case 45:
                    return after_e || i == 0 && !prefix;

                  case 43:
                    return after_e;

                  case after_e = false, 46:
                    return !has_dot && !has_x && !has_e ? has_dot = true : false;
            ***REMOVED***
                return is_alphanumeric_char(code);
        ***REMOVED***);
            if (prefix) num = prefix + num;
            var valid = parse_js_number(num);
            if (!isNaN(valid)) {
                return token("num", valid);
        ***REMOVED*** else {
                parse_error("Invalid syntax: " + num);
        ***REMOVED***
    ***REMOVED***
        function read_escaped_char(in_string) {
            var ch = next(true, in_string);
            switch (ch.charCodeAt(0)) {
              case 110:
                return "\n";

              case 114:
                return "\r";

              case 116:
                return "	";

              case 98:
                return "\b";

              case 118:
                return "";

              case 102:
                return "\f";

              case 48:
                return "\0";

              case 120:
                return String.fromCharCode(hex_bytes(2));

              case 117:
                return String.fromCharCode(hex_bytes(4));

              case 10:
                return "";

              default:
                return ch;
        ***REMOVED***
    ***REMOVED***
        function hex_bytes(n) {
            var num = 0;
            for (;n > 0; --n) {
                var digit = parseInt(next(true), 16);
                if (isNaN(digit)) parse_error("Invalid hex-character pattern in string");
                num = num << 4 | digit;
        ***REMOVED***
            return num;
    ***REMOVED***
        var read_string = with_eof_error("Unterminated string constant", function() {
            var quote = next(), ret = "";
            for (;;) {
                var ch = next(true);
                if (ch == "\\") {
                    var octal_len = 0, first = null;
                    ch = read_while(function(ch) {
                        if (ch >= "0" && ch <= "7") {
                            if (!first) {
                                first = ch;
                                return ++octal_len;
                        ***REMOVED*** else if (first <= "3" && octal_len <= 2) return ++octal_len; else if (first >= "4" && octal_len <= 1) return ++octal_len;
                    ***REMOVED***
                        return false;
                ***REMOVED***);
                    if (octal_len > 0) ch = String.fromCharCode(parseInt(ch, 8)); else ch = read_escaped_char(true);
            ***REMOVED*** else if (ch == quote) break;
                ret += ch;
        ***REMOVED***
            return token("string", ret);
    ***REMOVED***);
        function read_line_comment() {
            next();
            var i = find("\n"), ret;
            if (i == -1) {
                ret = S.text.substr(S.pos);
                S.pos = S.text.length;
        ***REMOVED*** else {
                ret = S.text.substring(S.pos, i);
                S.pos = i;
        ***REMOVED***
            return token("comment1", ret, true);
    ***REMOVED***
        var read_multiline_comment = with_eof_error("Unterminated multiline comment", function() {
            next();
            var i = find("*/", true);
            var text = S.text.substring(S.pos, i);
            var a = text.split("\n"), n = a.length;
            S.pos = i + 2;
            S.line += n - 1;
            if (n > 1) S.col = a[n - 1].length; else S.col += a[n - 1].length;
            S.col += 2;
            S.newline_before = S.newline_before || text.indexOf("\n") >= 0;
            return token("comment2", text, true);
    ***REMOVED***);
        function read_name() {
            var backslash = false, name = "", ch, escaped = false, hex;
            while ((ch = peek()) != null) {
                if (!backslash) {
                    if (ch == "\\") escaped = backslash = true, next(); else if (is_identifier_char(ch)) name += next(); else break;
            ***REMOVED*** else {
                    if (ch != "u") parse_error("Expecting UnicodeEscapeSequence -- uXXXX");
                    ch = read_escaped_char();
                    if (!is_identifier_char(ch)) parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                    name += ch;
                    backslash = false;
            ***REMOVED***
        ***REMOVED***
            if (KEYWORDS(name) && escaped) {
                hex = name.charCodeAt(0).toString(16).toUpperCase();
                name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1);
        ***REMOVED***
            return name;
    ***REMOVED***
        var read_regexp = with_eof_error("Unterminated regular expression", function(regexp) {
            var prev_backslash = false, ch, in_class = false;
            while (ch = next(true)) if (prev_backslash) {
                regexp += "\\" + ch;
                prev_backslash = false;
        ***REMOVED*** else if (ch == "[") {
                in_class = true;
                regexp += ch;
        ***REMOVED*** else if (ch == "]" && in_class) {
                in_class = false;
                regexp += ch;
        ***REMOVED*** else if (ch == "/" && !in_class) {
                break;
        ***REMOVED*** else if (ch == "\\") {
                prev_backslash = true;
        ***REMOVED*** else {
                regexp += ch;
        ***REMOVED***
            var mods = read_name();
            return token("regexp", new RegExp(regexp, mods));
    ***REMOVED***);
        function read_operator(prefix) {
            function grow(op) {
                if (!peek()) return op;
                var bigger = op + peek();
                if (OPERATORS(bigger)) {
                    next();
                    return grow(bigger);
            ***REMOVED*** else {
                    return op;
            ***REMOVED***
        ***REMOVED***
            return token("operator", grow(prefix || next()));
    ***REMOVED***
        function handle_slash() {
            next();
            var regex_allowed = S.regex_allowed;
            switch (peek()) {
              case "/":
                S.comments_before.push(read_line_comment());
                S.regex_allowed = regex_allowed;
                return next_token();

              case "*":
                S.comments_before.push(read_multiline_comment());
                S.regex_allowed = regex_allowed;
                return next_token();
        ***REMOVED***
            return S.regex_allowed ? read_regexp("") : read_operator("/");
    ***REMOVED***
        function handle_dot() {
            next();
            return is_digit(peek().charCodeAt(0)) ? read_num(".") : token("punc", ".");
    ***REMOVED***
        function read_word() {
            var word = read_name();
            return KEYWORDS_ATOM(word) ? token("atom", word) : !KEYWORDS(word) ? token("name", word) : OPERATORS(word) ? token("operator", word) : token("keyword", word);
    ***REMOVED***
        function with_eof_error(eof_error, cont) {
            return function(x) {
                try {
                    return cont(x);
            ***REMOVED*** catch (ex) {
                    if (ex === EX_EOF) parse_error(eof_error); else throw ex;
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
        function next_token(force_regexp) {
            if (force_regexp != null) return read_regexp(force_regexp);
            skip_whitespace();
            start_token();
            var ch = peek();
            if (!ch) return token("eof");
            var code = ch.charCodeAt(0);
            switch (code) {
              case 34:
              case 39:
                return read_string();

              case 46:
                return handle_dot();

              case 47:
                return handle_slash();
        ***REMOVED***
            if (is_digit(code)) return read_num();
            if (PUNC_CHARS(ch)) return token("punc", next());
            if (OPERATOR_CHARS(ch)) return read_operator();
            if (code == 92 || is_identifier_start(code)) return read_word();
            parse_error("Unexpected character '" + ch + "'");
    ***REMOVED***
        next_token.context = function(nc) {
            if (nc) S = nc;
            return S;
    ***REMOVED***;
        return next_token;
***REMOVED***
    var UNARY_PREFIX = makePredicate([ "typeof", "void", "delete", "--", "++", "!", "~", "-", "+" ]);
    var UNARY_POSTFIX = makePredicate([ "--", "++" ]);
    var ASSIGNMENT = makePredicate([ "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=" ]);
    var PRECEDENCE = function(a, ret) {
        for (var i = 0, n = 1; i < a.length; ++i, ++n) {
            var b = a[i];
            for (var j = 0; j < b.length; ++j) {
                ret[b[j]] = n;
        ***REMOVED***
    ***REMOVED***
        return ret;
***REMOVED***([ [ "||" ], [ "&&" ], [ "|" ], [ "^" ], [ "&" ], [ "==", "===", "!=", "!==" ], [ "<", ">", "<=", ">=", "in", "instanceof" ], [ ">>", "<<", ">>>" ], [ "+", "-" ], [ "*", "/", "%" ] ], {***REMOVED***);
    var STATEMENTS_WITH_LABELS = array_to_hash([ "for", "do", "while", "switch" ]);
    var ATOMIC_START_TOKEN = array_to_hash([ "atom", "num", "string", "regexp", "name" ]);
    function parse($TEXT, options) {
        options = defaults(options, {
            strict: false,
            filename: null,
            toplevel: null
    ***REMOVED***);
        var S = {
            input: typeof $TEXT == "string" ? tokenizer($TEXT, options.filename) : $TEXT,
            token: null,
            prev: null,
            peeked: null,
            in_function: 0,
            in_directives: true,
            in_loop: 0,
            labels: []
    ***REMOVED***;
        S.token = next();
        function is(type, value) {
            return is_token(S.token, type, value);
    ***REMOVED***
        function peek() {
            return S.peeked || (S.peeked = S.input());
    ***REMOVED***
        function next() {
            S.prev = S.token;
            if (S.peeked) {
                S.token = S.peeked;
                S.peeked = null;
        ***REMOVED*** else {
                S.token = S.input();
        ***REMOVED***
            S.in_directives = S.in_directives && (S.token.type == "string" || is("punc", ";"));
            return S.token;
    ***REMOVED***
        function prev() {
            return S.prev;
    ***REMOVED***
        function croak(msg, line, col, pos) {
            var ctx = S.input.context();
            js_error(msg, ctx.filename, line != null ? line : ctx.tokline, col != null ? col : ctx.tokcol, pos != null ? pos : ctx.tokpos);
    ***REMOVED***
        function token_error(token, msg) {
            croak(msg, token.line, token.col);
    ***REMOVED***
        function unexpected(token) {
            if (token == null) token = S.token;
            token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
    ***REMOVED***
        function expect_token(type, val) {
            if (is(type, val)) {
                return next();
        ***REMOVED***
            token_error(S.token, "Unexpected token " + S.token.type + " «" + S.token.value + "»" + ", expected " + type + " «" + val + "»");
    ***REMOVED***
        function expect(punc) {
            return expect_token("punc", punc);
    ***REMOVED***
        function can_insert_semicolon() {
            return !options.strict && (S.token.nlb || is("eof") || is("punc", "***REMOVED***"));
    ***REMOVED***
        function semicolon() {
            if (is("punc", ";")) next(); else if (!can_insert_semicolon()) unexpected();
    ***REMOVED***
        function parenthesised() {
            expect("(");
            var exp = expression(true);
            expect(")");
            return exp;
    ***REMOVED***
        function embed_tokens(parser) {
            return function() {
                var start = S.token;
                var expr = parser();
                var end = prev();
                expr.start = start;
                expr.end = end;
                return expr;
        ***REMOVED***;
    ***REMOVED***
        var statement = embed_tokens(function() {
            var tmp;
            if (is("operator", "/") || is("operator", "/=")) {
                S.peeked = null;
                S.token = S.input(S.token.value.substr(1));
        ***REMOVED***
            switch (S.token.type) {
              case "string":
                var dir = S.in_directives, stat = simple_statement();
                if (dir && stat.body instanceof AST_String && !is("punc", ",")) return new AST_Directive({
                    value: stat.body.value
            ***REMOVED***);
                return stat;

              case "num":
              case "regexp":
              case "operator":
              case "atom":
                return simple_statement();

              case "name":
                return is_token(peek(), "punc", ":") ? labeled_statement() : simple_statement();

              case "punc":
                switch (S.token.value) {
                  case "{":
                    return new AST_BlockStatement({
                        start: S.token,
                        body: block_(),
                        end: prev()
                ***REMOVED***);

                  case "[":
                  case "(":
                    return simple_statement();

                  case ";":
                    next();
                    return new AST_EmptyStatement();

                  default:
                    unexpected();
            ***REMOVED***

              case "keyword":
                switch (tmp = S.token.value, next(), tmp) {
                  case "break":
                    return break_cont(AST_Break);

                  case "continue":
                    return break_cont(AST_Continue);

                  case "debugger":
                    semicolon();
                    return new AST_Debugger();

                  case "do":
                    return new AST_Do({
                        body: in_loop(statement),
                        condition: (expect_token("keyword", "while"), tmp = parenthesised(), semicolon(), 
                        tmp)
                ***REMOVED***);

                  case "while":
                    return new AST_While({
                        condition: parenthesised(),
                        body: in_loop(statement)
                ***REMOVED***);

                  case "for":
                    return for_();

                  case "function":
                    return function_(true);

                  case "if":
                    return if_();

                  case "return":
                    if (S.in_function == 0) croak("'return' outside of function");
                    return new AST_Return({
                        value: is("punc", ";") ? (next(), null) : can_insert_semicolon() ? null : (tmp = expression(true), 
                        semicolon(), tmp)
                ***REMOVED***);

                  case "switch":
                    return new AST_Switch({
                        expression: parenthesised(),
                        body: in_loop(switch_body_)
                ***REMOVED***);

                  case "throw":
                    if (S.token.nlb) croak("Illegal newline after 'throw'");
                    return new AST_Throw({
                        value: (tmp = expression(true), semicolon(), tmp)
                ***REMOVED***);

                  case "try":
                    return try_();

                  case "var":
                    return tmp = var_(), semicolon(), tmp;

                  case "const":
                    return tmp = const_(), semicolon(), tmp;

                  case "with":
                    return new AST_With({
                        expression: parenthesised(),
                        body: statement()
                ***REMOVED***);

                  default:
                    unexpected();
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
        function labeled_statement() {
            var label = as_symbol(AST_Label);
            if (find_if(function(l) {
                return l.name == label.name;
          ***REMOVED*** S.labels)) {
                croak("Label " + label.name + " defined twice");
        ***REMOVED***
            expect(":");
            S.labels.push(label);
            var stat = statement();
            S.labels.pop();
            return new AST_LabeledStatement({
                body: stat,
                label: label
        ***REMOVED***);
    ***REMOVED***
        function simple_statement(tmp) {
            return new AST_SimpleStatement({
                body: (tmp = expression(true), semicolon(), tmp)
        ***REMOVED***);
    ***REMOVED***
        function break_cont(type) {
            var label = null;
            if (!can_insert_semicolon()) {
                label = as_symbol(AST_LabelRef, true);
        ***REMOVED***
            if (label != null) {
                if (!find_if(function(l) {
                    return l.name == label.name;
              ***REMOVED*** S.labels)) croak("Undefined label " + label.name);
        ***REMOVED*** else if (S.in_loop == 0) croak(type.TYPE + " not inside a loop or switch");
            semicolon();
            return new type({
                label: label
        ***REMOVED***);
    ***REMOVED***
        function for_() {
            expect("(");
            var init = null;
            if (!is("punc", ";")) {
                init = is("keyword", "var") ? (next(), var_(true)) : expression(true, true);
                if (is("operator", "in")) {
                    if (init instanceof AST_Var && init.definitions.length > 1) croak("Only one variable declaration allowed in for..in loop");
                    next();
                    return for_in(init);
            ***REMOVED***
        ***REMOVED***
            return regular_for(init);
    ***REMOVED***
        function regular_for(init) {
            expect(";");
            var test = is("punc", ";") ? null : expression(true);
            expect(";");
            var step = is("punc", ")") ? null : expression(true);
            expect(")");
            return new AST_For({
                init: init,
                condition: test,
                step: step,
                body: in_loop(statement)
        ***REMOVED***);
    ***REMOVED***
        function for_in(init) {
            var lhs = init instanceof AST_Var ? init.definitions[0].name : null;
            var obj = expression(true);
            expect(")");
            return new AST_ForIn({
                init: init,
                name: lhs,
                object: obj,
                body: in_loop(statement)
        ***REMOVED***);
    ***REMOVED***
        var function_ = function(in_statement, ctor) {
            var name = is("name") ? as_symbol(in_statement ? AST_SymbolDefun : ctor === AST_Accessor ? AST_SymbolAccessor : AST_SymbolLambda) : null;
            if (in_statement && !name) unexpected();
            expect("(");
            if (!ctor) ctor = in_statement ? AST_Defun : AST_Function;
            return new ctor({
                name: name,
                argnames: function(first, a) {
                    while (!is("punc", ")")) {
                        if (first) first = false; else expect(",");
                        a.push(as_symbol(AST_SymbolFunarg));
                ***REMOVED***
                    next();
                    return a;
            ***REMOVED***(true, []),
                body: function(loop, labels) {
                    ++S.in_function;
                    S.in_directives = true;
                    S.in_loop = 0;
                    S.labels = [];
                    var a = block_();
                    --S.in_function;
                    S.in_loop = loop;
                    S.labels = labels;
                    return a;
            ***REMOVED***(S.in_loop, S.labels)
        ***REMOVED***);
    ***REMOVED***;
        function if_() {
            var cond = parenthesised(), body = statement(), belse = null;
            if (is("keyword", "else")) {
                next();
                belse = statement();
        ***REMOVED***
            return new AST_If({
                condition: cond,
                body: body,
                alternative: belse
        ***REMOVED***);
    ***REMOVED***
        function block_() {
            expect("{");
            var a = [];
            while (!is("punc", "***REMOVED***")) {
                if (is("eof")) unexpected();
                a.push(statement());
        ***REMOVED***
            next();
            return a;
    ***REMOVED***
        function switch_body_() {
            expect("{");
            var a = [], cur = null, branch = null, tmp;
            while (!is("punc", "***REMOVED***")) {
                if (is("eof")) unexpected();
                if (is("keyword", "case")) {
                    if (branch) branch.end = prev();
                    cur = [];
                    branch = new AST_Case({
                        start: (tmp = S.token, next(), tmp),
                        expression: expression(true),
                        body: cur
                ***REMOVED***);
                    a.push(branch);
                    expect(":");
            ***REMOVED*** else if (is("keyword", "default")) {
                    if (branch) branch.end = prev();
                    cur = [];
                    branch = new AST_Default({
                        start: (tmp = S.token, next(), expect(":"), tmp),
                        body: cur
                ***REMOVED***);
                    a.push(branch);
            ***REMOVED*** else {
                    if (!cur) unexpected();
                    cur.push(statement());
            ***REMOVED***
        ***REMOVED***
            if (branch) branch.end = prev();
            next();
            return a;
    ***REMOVED***
        function try_() {
            var body = block_(), bcatch = null, bfinally = null;
            if (is("keyword", "catch")) {
                var start = S.token;
                next();
                expect("(");
                var name = as_symbol(AST_SymbolCatch);
                expect(")");
                bcatch = new AST_Catch({
                    start: start,
                    argname: name,
                    body: block_(),
                    end: prev()
            ***REMOVED***);
        ***REMOVED***
            if (is("keyword", "finally")) {
                var start = S.token;
                next();
                bfinally = new AST_Finally({
                    start: start,
                    body: block_(),
                    end: prev()
            ***REMOVED***);
        ***REMOVED***
            if (!bcatch && !bfinally) croak("Missing catch/finally blocks");
            return new AST_Try({
                body: body,
                bcatch: bcatch,
                bfinally: bfinally
        ***REMOVED***);
    ***REMOVED***
        function vardefs(no_in, in_const) {
            var a = [];
            for (;;) {
                a.push(new AST_VarDef({
                    start: S.token,
                    name: as_symbol(in_const ? AST_SymbolConst : AST_SymbolVar),
                    value: is("operator", "=") ? (next(), expression(false, no_in)) : null,
                    end: prev()
            ***REMOVED***));
                if (!is("punc", ",")) break;
                next();
        ***REMOVED***
            return a;
    ***REMOVED***
        var var_ = function(no_in) {
            return new AST_Var({
                start: prev(),
                definitions: vardefs(no_in, false),
                end: prev()
        ***REMOVED***);
    ***REMOVED***;
        var const_ = function() {
            return new AST_Const({
                start: prev(),
                definitions: vardefs(false, true),
                end: prev()
        ***REMOVED***);
    ***REMOVED***;
        var new_ = function() {
            var start = S.token;
            expect_token("operator", "new");
            var newexp = expr_atom(false), args;
            if (is("punc", "(")) {
                next();
                args = expr_list(")");
        ***REMOVED*** else {
                args = [];
        ***REMOVED***
            return subscripts(new AST_New({
                start: start,
                expression: newexp,
                args: args,
                end: prev()
        ***REMOVED***), true);
    ***REMOVED***;
        function as_atom_node() {
            var tok = S.token, ret;
            switch (tok.type) {
              case "name":
                return as_symbol(AST_SymbolRef);

              case "num":
                ret = new AST_Number({
                    start: tok,
                    end: tok,
                    value: tok.value
            ***REMOVED***);
                break;

              case "string":
                ret = new AST_String({
                    start: tok,
                    end: tok,
                    value: tok.value
            ***REMOVED***);
                break;

              case "regexp":
                ret = new AST_RegExp({
                    start: tok,
                    end: tok,
                    value: tok.value
            ***REMOVED***);
                break;

              case "atom":
                switch (tok.value) {
                  case "false":
                    ret = new AST_False({
                        start: tok,
                        end: tok
                ***REMOVED***);
                    break;

                  case "true":
                    ret = new AST_True({
                        start: tok,
                        end: tok
                ***REMOVED***);
                    break;

                  case "null":
                    ret = new AST_Null({
                        start: tok,
                        end: tok
                ***REMOVED***);
                    break;
            ***REMOVED***
                break;
        ***REMOVED***
            next();
            return ret;
    ***REMOVED***
        var expr_atom = function(allow_calls) {
            if (is("operator", "new")) {
                return new_();
        ***REMOVED***
            var start = S.token;
            if (is("punc")) {
                switch (start.value) {
                  case "(":
                    next();
                    var ex = expression(true);
                    ex.start = start;
                    ex.end = S.token;
                    expect(")");
                    return subscripts(ex, allow_calls);

                  case "[":
                    return subscripts(array_(), allow_calls);

                  case "{":
                    return subscripts(object_(), allow_calls);
            ***REMOVED***
                unexpected();
        ***REMOVED***
            if (is("keyword", "function")) {
                next();
                var func = function_(false);
                func.start = start;
                func.end = prev();
                return subscripts(func, allow_calls);
        ***REMOVED***
            if (ATOMIC_START_TOKEN[S.token.type]) {
                return subscripts(as_atom_node(), allow_calls);
        ***REMOVED***
            unexpected();
    ***REMOVED***;
        function expr_list(closing, allow_trailing_comma, allow_empty) {
            var first = true, a = [];
            while (!is("punc", closing)) {
                if (first) first = false; else expect(",");
                if (allow_trailing_comma && is("punc", closing)) break;
                if (is("punc", ",") && allow_empty) {
                    a.push(new AST_Undefined({
                        start: S.token,
                        end: S.token
                ***REMOVED***));
            ***REMOVED*** else {
                    a.push(expression(false));
            ***REMOVED***
        ***REMOVED***
            next();
            return a;
    ***REMOVED***
        var array_ = embed_tokens(function() {
            expect("[");
            return new AST_Array({
                elements: expr_list("]", !options.strict, true)
        ***REMOVED***);
    ***REMOVED***);
        var object_ = embed_tokens(function() {
            expect("{");
            var first = true, a = [];
            while (!is("punc", "***REMOVED***")) {
                if (first) first = false; else expect(",");
                if (!options.strict && is("punc", "***REMOVED***")) break;
                var start = S.token;
                var type = start.type;
                var name = as_property_name();
                if (type == "name" && !is("punc", ":")) {
                    if (name == "get") {
                        a.push(new AST_ObjectGetter({
                            start: start,
                            key: name,
                            value: function_(false, AST_Accessor),
                            end: prev()
                    ***REMOVED***));
                        continue;
                ***REMOVED***
                    if (name == "set") {
                        a.push(new AST_ObjectSetter({
                            start: start,
                            key: name,
                            value: function_(false, AST_Accessor),
                            end: prev()
                    ***REMOVED***));
                        continue;
                ***REMOVED***
            ***REMOVED***
                expect(":");
                a.push(new AST_ObjectKeyVal({
                    start: start,
                    key: name,
                    value: expression(false),
                    end: prev()
            ***REMOVED***));
        ***REMOVED***
            next();
            return new AST_Object({
                properties: a
        ***REMOVED***);
    ***REMOVED***);
        function as_property_name() {
            var tmp = S.token;
            next();
            switch (tmp.type) {
              case "num":
              case "string":
              case "name":
              case "operator":
              case "keyword":
              case "atom":
                return tmp.value;

              default:
                unexpected();
        ***REMOVED***
    ***REMOVED***
        function as_name() {
            var tmp = S.token;
            next();
            switch (tmp.type) {
              case "name":
              case "operator":
              case "keyword":
              case "atom":
                return tmp.value;

              default:
                unexpected();
        ***REMOVED***
    ***REMOVED***
        function as_symbol(type, noerror) {
            if (!is("name")) {
                if (!noerror) croak("Name expected");
                return null;
        ***REMOVED***
            var name = S.token.value;
            var sym = new (name == "this" ? AST_This : type)({
                name: String(S.token.value),
                start: S.token,
                end: S.token
        ***REMOVED***);
            next();
            return sym;
    ***REMOVED***
        var subscripts = function(expr, allow_calls) {
            var start = expr.start;
            if (is("punc", ".")) {
                next();
                return subscripts(new AST_Dot({
                    start: start,
                    expression: expr,
                    property: as_name(),
                    end: prev()
            ***REMOVED***), allow_calls);
        ***REMOVED***
            if (is("punc", "[")) {
                next();
                var prop = expression(true);
                expect("]");
                return subscripts(new AST_Sub({
                    start: start,
                    expression: expr,
                    property: prop,
                    end: prev()
            ***REMOVED***), allow_calls);
        ***REMOVED***
            if (allow_calls && is("punc", "(")) {
                next();
                return subscripts(new AST_Call({
                    start: start,
                    expression: expr,
                    args: expr_list(")"),
                    end: prev()
            ***REMOVED***), true);
        ***REMOVED***
            return expr;
    ***REMOVED***;
        var maybe_unary = function(allow_calls) {
            var start = S.token;
            if (is("operator") && UNARY_PREFIX(start.value)) {
                next();
                var ex = make_unary(AST_UnaryPrefix, start.value, maybe_unary(allow_calls));
                ex.start = start;
                ex.end = prev();
                return ex;
        ***REMOVED***
            var val = expr_atom(allow_calls);
            while (is("operator") && UNARY_POSTFIX(S.token.value) && !S.token.nlb) {
                val = make_unary(AST_UnaryPostfix, S.token.value, val);
                val.start = start;
                val.end = S.token;
                next();
        ***REMOVED***
            return val;
    ***REMOVED***;
        function make_unary(ctor, op, expr) {
            if ((op == "++" || op == "--") && !is_assignable(expr)) croak("Invalid use of " + op + " operator");
            return new ctor({
                operator: op,
                expression: expr
        ***REMOVED***);
    ***REMOVED***
        var expr_op = function(left, min_prec, no_in) {
            var op = is("operator") ? S.token.value : null;
            if (op == "in" && no_in) op = null;
            var prec = op != null ? PRECEDENCE[op] : null;
            if (prec != null && prec > min_prec) {
                next();
                var right = expr_op(maybe_unary(true), prec, no_in);
                return expr_op(new AST_Binary({
                    start: left.start,
                    left: left,
                    operator: op,
                    right: right,
                    end: right.end
            ***REMOVED***), min_prec, no_in);
        ***REMOVED***
            return left;
    ***REMOVED***;
        function expr_ops(no_in) {
            return expr_op(maybe_unary(true), 0, no_in);
    ***REMOVED***
        var maybe_conditional = function(no_in) {
            var start = S.token;
            var expr = expr_ops(no_in);
            if (is("operator", "?")) {
                next();
                var yes = expression(false);
                expect(":");
                return new AST_Conditional({
                    start: start,
                    condition: expr,
                    consequent: yes,
                    alternative: expression(false, no_in),
                    end: peek()
            ***REMOVED***);
        ***REMOVED***
            return expr;
    ***REMOVED***;
        function is_assignable(expr) {
            if (!options.strict) return true;
            switch (expr[0] + "") {
              case "dot":
              case "sub":
              case "new":
              case "call":
                return true;

              case "name":
                return expr[1] != "this";
        ***REMOVED***
    ***REMOVED***
        var maybe_assign = function(no_in) {
            var start = S.token;
            var left = maybe_conditional(no_in), val = S.token.value;
            if (is("operator") && ASSIGNMENT(val)) {
                if (is_assignable(left)) {
                    next();
                    return new AST_Assign({
                        start: start,
                        left: left,
                        operator: val,
                        right: maybe_assign(no_in),
                        end: peek()
                ***REMOVED***);
            ***REMOVED***
                croak("Invalid assignment");
        ***REMOVED***
            return left;
    ***REMOVED***;
        var expression = function(commas, no_in) {
            var start = S.token;
            var expr = maybe_assign(no_in);
            if (commas && is("punc", ",")) {
                next();
                return new AST_Seq({
                    start: start,
                    car: expr,
                    cdr: expression(true, no_in),
                    end: peek()
            ***REMOVED***);
        ***REMOVED***
            return expr;
    ***REMOVED***;
        function in_loop(cont) {
            ++S.in_loop;
            var ret = cont();
            --S.in_loop;
            return ret;
    ***REMOVED***
        return function() {
            var start = S.token;
            var body = [];
            while (!is("eof")) body.push(statement());
            var end = prev();
            var toplevel = options.toplevel;
            if (toplevel) {
                toplevel.body = toplevel.body.concat(body);
                toplevel.end = end;
        ***REMOVED*** else {
                toplevel = new AST_Toplevel({
                    start: start,
                    body: body,
                    end: end
            ***REMOVED***);
        ***REMOVED***
            return toplevel;
    ***REMOVED***();
***REMOVED***
    "use strict";
    function TreeTransformer(before, after) {
        TreeWalker.call(this);
        this.before = before;
        this.after = after;
***REMOVED***
    TreeTransformer.prototype = new TreeWalker();
    (function(undefined) {
        function _(node, descend) {
            node.DEFMETHOD("transform", function(tw, in_list) {
                var x, y;
                tw.push(this);
                if (tw.before) x = tw.before(this, descend, in_list);
                if (x === undefined) {
                    if (!tw.after) {
                        x = this;
                        descend(x, tw);
                ***REMOVED*** else {
                        tw.stack[tw.stack - 1] = x = this.clone();
                        descend(x, tw);
                        y = tw.after(x, in_list);
                        if (y !== undefined) x = y;
                ***REMOVED***
            ***REMOVED***
                tw.pop();
                return x;
        ***REMOVED***);
    ***REMOVED***
        function do_list(list, tw) {
            return MAP(list, function(node) {
                return node.transform(tw, true);
        ***REMOVED***);
    ***REMOVED***
        _(AST_Node, noop);
        _(AST_LabeledStatement, function(self, tw) {
            self.label = self.label.transform(tw);
            self.body = self.body.transform(tw);
    ***REMOVED***);
        _(AST_SimpleStatement, function(self, tw) {
            self.body = self.body.transform(tw);
    ***REMOVED***);
        _(AST_Block, function(self, tw) {
            self.body = do_list(self.body, tw);
    ***REMOVED***);
        _(AST_DWLoop, function(self, tw) {
            self.condition = self.condition.transform(tw);
            self.body = self.body.transform(tw);
    ***REMOVED***);
        _(AST_For, function(self, tw) {
            if (self.init) self.init = self.init.transform(tw);
            if (self.condition) self.condition = self.condition.transform(tw);
            if (self.step) self.step = self.step.transform(tw);
            self.body = self.body.transform(tw);
    ***REMOVED***);
        _(AST_ForIn, function(self, tw) {
            self.init = self.init.transform(tw);
            self.object = self.object.transform(tw);
            self.body = self.body.transform(tw);
    ***REMOVED***);
        _(AST_With, function(self, tw) {
            self.expression = self.expression.transform(tw);
            self.body = self.body.transform(tw);
    ***REMOVED***);
        _(AST_Exit, function(self, tw) {
            if (self.value) self.value = self.value.transform(tw);
    ***REMOVED***);
        _(AST_LoopControl, function(self, tw) {
            if (self.label) self.label = self.label.transform(tw);
    ***REMOVED***);
        _(AST_If, function(self, tw) {
            self.condition = self.condition.transform(tw);
            self.body = self.body.transform(tw);
            if (self.alternative) self.alternative = self.alternative.transform(tw);
    ***REMOVED***);
        _(AST_Switch, function(self, tw) {
            self.expression = self.expression.transform(tw);
            self.body = do_list(self.body, tw);
    ***REMOVED***);
        _(AST_Case, function(self, tw) {
            self.expression = self.expression.transform(tw);
            self.body = do_list(self.body, tw);
    ***REMOVED***);
        _(AST_Try, function(self, tw) {
            self.body = do_list(self.body, tw);
            if (self.bcatch) self.bcatch = self.bcatch.transform(tw);
            if (self.bfinally) self.bfinally = self.bfinally.transform(tw);
    ***REMOVED***);
        _(AST_Catch, function(self, tw) {
            self.argname = self.argname.transform(tw);
            self.body = do_list(self.body, tw);
    ***REMOVED***);
        _(AST_Definitions, function(self, tw) {
            self.definitions = do_list(self.definitions, tw);
    ***REMOVED***);
        _(AST_VarDef, function(self, tw) {
            if (self.value) self.value = self.value.transform(tw);
    ***REMOVED***);
        _(AST_Lambda, function(self, tw) {
            if (self.name) self.name = self.name.transform(tw);
            self.argnames = do_list(self.argnames, tw);
            self.body = do_list(self.body, tw);
    ***REMOVED***);
        _(AST_Call, function(self, tw) {
            self.expression = self.expression.transform(tw);
            self.args = do_list(self.args, tw);
    ***REMOVED***);
        _(AST_Seq, function(self, tw) {
            self.car = self.car.transform(tw);
            self.cdr = self.cdr.transform(tw);
    ***REMOVED***);
        _(AST_Dot, function(self, tw) {
            self.expression = self.expression.transform(tw);
    ***REMOVED***);
        _(AST_Sub, function(self, tw) {
            self.expression = self.expression.transform(tw);
            self.property = self.property.transform(tw);
    ***REMOVED***);
        _(AST_Unary, function(self, tw) {
            self.expression = self.expression.transform(tw);
    ***REMOVED***);
        _(AST_Binary, function(self, tw) {
            self.left = self.left.transform(tw);
            self.right = self.right.transform(tw);
    ***REMOVED***);
        _(AST_Conditional, function(self, tw) {
            self.condition = self.condition.transform(tw);
            self.consequent = self.consequent.transform(tw);
            self.alternative = self.alternative.transform(tw);
    ***REMOVED***);
        _(AST_Array, function(self, tw) {
            self.elements = do_list(self.elements, tw);
    ***REMOVED***);
        _(AST_Object, function(self, tw) {
            self.properties = do_list(self.properties, tw);
    ***REMOVED***);
        _(AST_ObjectProperty, function(self, tw) {
            self.value = self.value.transform(tw);
    ***REMOVED***);
***REMOVED***)();
    "use strict";
    function SymbolDef(scope, index, orig) {
        this.name = orig.name;
        this.orig = [ orig ];
        this.scope = scope;
        this.references = [];
        this.global = false;
        this.mangled_name = null;
        this.undeclared = false;
        this.constant = false;
        this.index = index;
***REMOVED***
    SymbolDef.prototype = {
        unmangleable: function(options) {
            return this.global || this.undeclared || !(options && options.eval) && (this.scope.uses_eval || this.scope.uses_with);
      ***REMOVED***
        mangle: function(options) {
            if (!this.mangled_name && !this.unmangleable(options)) this.mangled_name = this.scope.next_mangled(options);
    ***REMOVED***
***REMOVED***;
    AST_Toplevel.DEFMETHOD("figure_out_scope", function() {
        var self = this;
        var scope = self.parent_scope = null;
        var labels = new Dictionary();
        var nesting = 0;
        var tw = new TreeWalker(function(node, descend) {
            if (node instanceof AST_Scope) {
                node.init_scope_vars(nesting);
                var save_scope = node.parent_scope = scope;
                ++nesting;
                scope = node;
                descend();
                scope = save_scope;
                --nesting;
                return true;
        ***REMOVED***
            if (node instanceof AST_Directive) {
                node.scope = scope;
                push_uniq(scope.directives, node.value);
                return true;
        ***REMOVED***
            if (node instanceof AST_With) {
                for (var s = scope; s; s = s.parent_scope) s.uses_with = true;
                return;
        ***REMOVED***
            if (node instanceof AST_LabeledStatement) {
                var l = node.label;
                if (labels.has(l.name)) throw new Error(string_template("Label {name***REMOVED*** defined twice", l));
                labels.set(l.name, l);
                descend();
                labels.del(l.name);
                return true;
        ***REMOVED***
            if (node instanceof AST_SymbolDeclaration) {
                node.init_scope_vars();
        ***REMOVED***
            if (node instanceof AST_Symbol) {
                node.scope = scope;
        ***REMOVED***
            if (node instanceof AST_Label) {
                node.thedef = node;
                node.init_scope_vars();
        ***REMOVED***
            if (node instanceof AST_SymbolLambda) {
                (node.scope = scope.parent_scope).def_function(node);
                node.init.push(tw.parent());
        ***REMOVED*** else if (node instanceof AST_SymbolDefun) {
                (node.scope = scope.parent_scope).def_function(node);
                node.init.push(tw.parent());
        ***REMOVED*** else if (node instanceof AST_SymbolVar || node instanceof AST_SymbolConst) {
                var def = scope.def_variable(node);
                def.constant = node instanceof AST_SymbolConst;
                def = tw.parent();
                if (def.value) node.init.push(def);
        ***REMOVED*** else if (node instanceof AST_SymbolCatch) {
                scope.def_variable(node);
        ***REMOVED***
            if (node instanceof AST_LabelRef) {
                var sym = labels.get(node.name);
                if (!sym) throw new Error(string_template("Undefined label {name***REMOVED*** [{line***REMOVED***,{col***REMOVED***]", {
                    name: node.name,
                    line: node.start.line,
                    col: node.start.col
            ***REMOVED***));
                node.thedef = sym;
        ***REMOVED***
    ***REMOVED***);
        self.walk(tw);
        var func = null;
        var globals = self.globals = new Dictionary();
        var tw = new TreeWalker(function(node, descend) {
            if (node instanceof AST_Lambda) {
                var prev_func = func;
                func = node;
                descend();
                func = prev_func;
                return true;
        ***REMOVED***
            if (node instanceof AST_LabelRef) {
                node.reference();
                return true;
        ***REMOVED***
            if (node instanceof AST_SymbolRef) {
                var name = node.name;
                var sym = node.scope.find_variable(name);
                if (!sym) {
                    var g;
                    if (globals.has(name)) {
                        g = globals.get(name);
                ***REMOVED*** else {
                        g = new SymbolDef(self, globals.size(), node);
                        g.undeclared = true;
                        globals.set(name, g);
                ***REMOVED***
                    node.thedef = g;
                    if (name == "eval" && tw.parent() instanceof AST_Call) {
                        for (var s = node.scope; s && !s.uses_eval; s = s.parent_scope) s.uses_eval = true;
                ***REMOVED***
                    if (name == "arguments") {
                        func.uses_arguments = true;
                ***REMOVED***
            ***REMOVED*** else {
                    node.thedef = sym;
            ***REMOVED***
                node.reference();
                return true;
        ***REMOVED***
    ***REMOVED***);
        self.walk(tw);
***REMOVED***);
    AST_Scope.DEFMETHOD("init_scope_vars", function(nesting) {
        this.directives = [];
        this.variables = new Dictionary();
        this.functions = new Dictionary();
        this.uses_with = false;
        this.uses_eval = false;
        this.parent_scope = null;
        this.enclosed = [];
        this.cname = -1;
        this.nesting = nesting;
***REMOVED***);
    AST_Scope.DEFMETHOD("strict", function() {
        return this.has_directive("use strict");
***REMOVED***);
    AST_Lambda.DEFMETHOD("init_scope_vars", function() {
        AST_Scope.prototype.init_scope_vars.apply(this, arguments);
        this.uses_arguments = false;
***REMOVED***);
    AST_SymbolRef.DEFMETHOD("reference", function() {
        var def = this.definition();
        def.references.push(this);
        var s = this.scope;
        while (s) {
            push_uniq(s.enclosed, def);
            if (s === def.scope) break;
            s = s.parent_scope;
    ***REMOVED***
        this.frame = this.scope.nesting - def.scope.nesting;
***REMOVED***);
    AST_SymbolDeclaration.DEFMETHOD("init_scope_vars", function() {
        this.init = [];
***REMOVED***);
    AST_Label.DEFMETHOD("init_scope_vars", function() {
        this.references = [];
***REMOVED***);
    AST_LabelRef.DEFMETHOD("reference", function() {
        this.thedef.references.push(this);
***REMOVED***);
    AST_Scope.DEFMETHOD("find_variable", function(name) {
        if (name instanceof AST_Symbol) name = name.name;
        return this.variables.get(name) || this.parent_scope && this.parent_scope.find_variable(name);
***REMOVED***);
    AST_Scope.DEFMETHOD("has_directive", function(value) {
        return this.parent_scope && this.parent_scope.has_directive(value) || (this.directives.indexOf(value) >= 0 ? this : null);
***REMOVED***);
    AST_Scope.DEFMETHOD("def_function", function(symbol) {
        this.functions.set(symbol.name, this.def_variable(symbol));
***REMOVED***);
    AST_Scope.DEFMETHOD("def_variable", function(symbol) {
        var def;
        if (!this.variables.has(symbol.name)) {
            def = new SymbolDef(this, this.variables.size(), symbol);
            this.variables.set(symbol.name, def);
            def.global = !this.parent_scope;
    ***REMOVED*** else {
            def = this.variables.get(symbol.name);
            def.orig.push(symbol);
    ***REMOVED***
        return symbol.thedef = def;
***REMOVED***);
    AST_Scope.DEFMETHOD("next_mangled", function(options) {
        var ext = this.enclosed, n = ext.length;
        out: while (true) {
            var m = base54(++this.cname);
            if (!is_identifier(m)) continue;
            for (var i = n; --i >= 0; ) {
                var sym = ext[i];
                var name = sym.mangled_name || sym.unmangleable(options) && sym.name;
                if (m == name) continue out;
        ***REMOVED***
            return m;
    ***REMOVED***
***REMOVED***);
    AST_Scope.DEFMETHOD("references", function(sym) {
        if (sym instanceof AST_Symbol) sym = sym.definition();
        return this.enclosed.indexOf(sym) < 0 ? null : sym;
***REMOVED***);
    AST_Symbol.DEFMETHOD("unmangleable", function(options) {
        return this.definition().unmangleable(options);
***REMOVED***);
    AST_SymbolAccessor.DEFMETHOD("unmangleable", function() {
        return true;
***REMOVED***);
    AST_Label.DEFMETHOD("unmangleable", function() {
        return false;
***REMOVED***);
    AST_Symbol.DEFMETHOD("unreferenced", function() {
        return this.definition().references.length == 0 && !(this.scope.uses_eval || this.scope.uses_with);
***REMOVED***);
    AST_Symbol.DEFMETHOD("undeclared", function() {
        return this.definition().undeclared;
***REMOVED***);
    AST_LabelRef.DEFMETHOD("undeclared", function() {
        return false;
***REMOVED***);
    AST_Label.DEFMETHOD("undeclared", function() {
        return false;
***REMOVED***);
    AST_Symbol.DEFMETHOD("definition", function() {
        return this.thedef;
***REMOVED***);
    AST_Symbol.DEFMETHOD("global", function() {
        return this.definition().global;
***REMOVED***);
    AST_Toplevel.DEFMETHOD("_default_mangler_options", function(options) {
        return defaults(options, {
            except: [],
            eval: false
    ***REMOVED***);
***REMOVED***);
    AST_Toplevel.DEFMETHOD("mangle_names", function(options) {
        options = this._default_mangler_options(options);
        var lname = -1;
        var to_mangle = [];
        var tw = new TreeWalker(function(node, descend) {
            if (node instanceof AST_LabeledStatement) {
                var save_nesting = lname;
                descend();
                lname = save_nesting;
                return true;
        ***REMOVED***
            if (node instanceof AST_Scope) {
                var p = tw.parent();
                node.variables.each(function(symbol) {
                    if (options.except.indexOf(symbol.name) < 0) {
                        to_mangle.push(symbol);
                ***REMOVED***
            ***REMOVED***);
                return;
        ***REMOVED***
            if (node instanceof AST_Label) {
                var name;
                do name = base54(++lname); while (!is_identifier(name));
                node.mangled_name = name;
                return true;
        ***REMOVED***
    ***REMOVED***);
        this.walk(tw);
        to_mangle.forEach(function(def) {
            def.mangle(options);
    ***REMOVED***);
***REMOVED***);
    AST_Toplevel.DEFMETHOD("compute_char_frequency", function(options) {
        options = this._default_mangler_options(options);
        var tw = new TreeWalker(function(node) {
            if (node instanceof AST_Constant) base54.consider(node.print_to_string()); else if (node instanceof AST_Return) base54.consider("return"); else if (node instanceof AST_Throw) base54.consider("throw"); else if (node instanceof AST_Continue) base54.consider("continue"); else if (node instanceof AST_Break) base54.consider("break"); else if (node instanceof AST_Debugger) base54.consider("debugger"); else if (node instanceof AST_Directive) base54.consider(node.value); else if (node instanceof AST_While) base54.consider("while"); else if (node instanceof AST_Do) base54.consider("do while"); else if (node instanceof AST_If) {
                base54.consider("if");
                if (node.alternative) base54.consider("else");
        ***REMOVED*** else if (node instanceof AST_Var) base54.consider("var"); else if (node instanceof AST_Const) base54.consider("const"); else if (node instanceof AST_Lambda) base54.consider("function"); else if (node instanceof AST_For) base54.consider("for"); else if (node instanceof AST_ForIn) base54.consider("for in"); else if (node instanceof AST_Switch) base54.consider("switch"); else if (node instanceof AST_Case) base54.consider("case"); else if (node instanceof AST_Default) base54.consider("default"); else if (node instanceof AST_With) base54.consider("with"); else if (node instanceof AST_ObjectSetter) base54.consider("set" + node.key); else if (node instanceof AST_ObjectGetter) base54.consider("get" + node.key); else if (node instanceof AST_ObjectKeyVal) base54.consider(node.key); else if (node instanceof AST_New) base54.consider("new"); else if (node instanceof AST_This) base54.consider("this"); else if (node instanceof AST_Try) base54.consider("try"); else if (node instanceof AST_Catch) base54.consider("catch"); else if (node instanceof AST_Finally) base54.consider("finally"); else if (node instanceof AST_Symbol && node.unmangleable(options)) base54.consider(node.name); else if (node instanceof AST_Unary || node instanceof AST_Binary) base54.consider(node.operator); else if (node instanceof AST_Dot) base54.consider(node.property);
    ***REMOVED***);
        this.walk(tw);
        base54.sort();
***REMOVED***);
    var base54 = function() {
        var string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
        var chars, frequency;
        function reset() {
            frequency = Object.create(null);
            chars = string.split("").map(function(ch) {
                return ch.charCodeAt(0);
        ***REMOVED***);
            chars.forEach(function(ch) {
                frequency[ch] = 0;
        ***REMOVED***);
    ***REMOVED***
        base54.consider = function(str) {
            for (var i = str.length; --i >= 0; ) {
                var code = str.charCodeAt(i);
                if (code in frequency) ++frequency[code];
        ***REMOVED***
    ***REMOVED***;
        base54.sort = function() {
            chars = mergeSort(chars, function(a, b) {
                if (is_digit(a) && !is_digit(b)) return 1;
                if (is_digit(b) && !is_digit(a)) return -1;
                return frequency[b] - frequency[a];
        ***REMOVED***);
    ***REMOVED***;
        base54.reset = reset;
        reset();
        base54.get = function() {
            return chars;
    ***REMOVED***;
        base54.freq = function() {
            return frequency;
    ***REMOVED***;
        function base54(num) {
            var ret = "", base = 54;
            do {
                ret += String.fromCharCode(chars[num % base]);
                num = Math.floor(num / base);
                base = 64;
        ***REMOVED*** while (num > 0);
            return ret;
    ***REMOVED***
        return base54;
***REMOVED***();
    AST_Toplevel.DEFMETHOD("scope_warnings", function(options) {
        options = defaults(options, {
            undeclared: false,
            unreferenced: true,
            assign_to_global: true,
            func_arguments: true,
            nested_defuns: true,
            eval: true
    ***REMOVED***);
        var tw = new TreeWalker(function(node) {
            if (options.undeclared && node instanceof AST_SymbolRef && node.undeclared()) {
                AST_Node.warn("Undeclared symbol: {name***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", {
                    name: node.name,
                    file: node.start.file,
                    line: node.start.line,
                    col: node.start.col
            ***REMOVED***);
        ***REMOVED***
            if (options.assign_to_global) {
                var sym = null;
                if (node instanceof AST_Assign && node.left instanceof AST_SymbolRef) sym = node.left; else if (node instanceof AST_ForIn && node.init instanceof AST_SymbolRef) sym = node.init;
                if (sym && (sym.undeclared() || sym.global() && sym.scope !== sym.definition().scope)) {
                    AST_Node.warn("{msg***REMOVED***: {name***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", {
                        msg: sym.undeclared() ? "Accidental global?" : "Assignment to global",
                        name: sym.name,
                        file: sym.start.file,
                        line: sym.start.line,
                        col: sym.start.col
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***
            if (options.eval && node instanceof AST_SymbolRef && node.undeclared() && node.name == "eval") {
                AST_Node.warn("Eval is used [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", node.start);
        ***REMOVED***
            if (options.unreferenced && (node instanceof AST_SymbolDeclaration || node instanceof AST_Label) && node.unreferenced()) {
                AST_Node.warn("{type***REMOVED*** {name***REMOVED*** is declared but not referenced [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", {
                    type: node instanceof AST_Label ? "Label" : "Symbol",
                    name: node.name,
                    file: node.start.file,
                    line: node.start.line,
                    col: node.start.col
            ***REMOVED***);
        ***REMOVED***
            if (options.func_arguments && node instanceof AST_Lambda && node.uses_arguments) {
                AST_Node.warn("arguments used in function {name***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", {
                    name: node.name ? node.name.name : "anonymous",
                    file: node.start.file,
                    line: node.start.line,
                    col: node.start.col
            ***REMOVED***);
        ***REMOVED***
            if (options.nested_defuns && node instanceof AST_Defun && !(tw.parent() instanceof AST_Scope)) {
                AST_Node.warn('Function {name***REMOVED*** declared in nested statement "{type***REMOVED***" [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]', {
                    name: node.name.name,
                    type: tw.parent().TYPE,
                    file: node.start.file,
                    line: node.start.line,
                    col: node.start.col
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***);
        this.walk(tw);
***REMOVED***);
    "use strict";
    function OutputStream(options) {
        options = defaults(options, {
            indent_start: 0,
            indent_level: 4,
            quote_keys: false,
            space_colon: true,
            ascii_only: false,
            inline_script: false,
            width: 80,
            max_line_len: 32e3,
            ie_proof: true,
            beautify: false,
            source_map: null,
            bracketize: false,
            semicolons: true,
            comments: false
      ***REMOVED*** true);
        var indentation = 0;
        var current_col = 0;
        var current_line = 1;
        var current_pos = 0;
        var OUTPUT = "";
        function to_ascii(str) {
            return str.replace(/[\u0080-\uffff]/g, function(ch) {
                var code = ch.charCodeAt(0).toString(16);
                while (code.length < 4) code = "0" + code;
                return "\\u" + code;
        ***REMOVED***);
    ***REMOVED***
        function make_string(str) {
            var dq = 0, sq = 0;
            str = str.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function(s) {
                switch (s) {
                  case "\\":
                    return "\\\\";

                  case "\b":
                    return "\\b";

                  case "\f":
                    return "\\f";

                  case "\n":
                    return "\\n";

                  case "\r":
                    return "\\r";

                  case "\u2028":
                    return "\\u2028";

                  case "\u2029":
                    return "\\u2029";

                  case '"':
                    ++dq;
                    return '"';

                  case "'":
                    ++sq;
                    return "'";

                  case "\0":
                    return "\\0";
            ***REMOVED***
                return s;
        ***REMOVED***);
            if (options.ascii_only) str = to_ascii(str);
            if (dq > sq) return "'" + str.replace(/\x27/g, "\\'") + "'"; else return '"' + str.replace(/\x22/g, '\\"') + '"';
    ***REMOVED***
        function encode_string(str) {
            var ret = make_string(str);
            if (options.inline_script) ret = ret.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
            return ret;
    ***REMOVED***
        function make_name(name) {
            name = name.toString();
            if (options.ascii_only) name = to_ascii(name);
            return name;
    ***REMOVED***
        function make_indent(back) {
            return repeat_string(" ", options.indent_start + indentation - back * options.indent_level);
    ***REMOVED***
        var might_need_space = false;
        var might_need_semicolon = false;
        var last = null;
        function last_char() {
            return last.charAt(last.length - 1);
    ***REMOVED***
        function maybe_newline() {
            if (options.max_line_len && current_col > options.max_line_len) print("\n");
    ***REMOVED***
        var requireSemicolonChars = makePredicate("( [ + * / - , .");
        function print(str) {
            str = String(str);
            var ch = str.charAt(0);
            if (might_need_semicolon) {
                if ((!ch || ";***REMOVED***".indexOf(ch) < 0) && !/[;]$/.test(last)) {
                    if (options.semicolons || requireSemicolonChars(ch)) {
                        OUTPUT += ";";
                        current_col++;
                        current_pos++;
                ***REMOVED*** else {
                        OUTPUT += "\n";
                        current_pos++;
                        current_line++;
                        current_col = 0;
                ***REMOVED***
                    if (!options.beautify) might_need_space = false;
            ***REMOVED***
                might_need_semicolon = false;
                maybe_newline();
        ***REMOVED***
            if (might_need_space) {
                var prev = last_char();
                if (is_identifier_char(prev) && (is_identifier_char(ch) || ch == "\\") || /^[\+\-\/]$/.test(ch) && ch == prev) {
                    OUTPUT += " ";
                    current_col++;
                    current_pos++;
            ***REMOVED***
                might_need_space = false;
        ***REMOVED***
            var a = str.split(/\r?\n/), n = a.length - 1;
            current_line += n;
            if (n == 0) {
                current_col += a[n].length;
        ***REMOVED*** else {
                current_col = a[n].length;
        ***REMOVED***
            current_pos += str.length;
            last = str;
            OUTPUT += str;
    ***REMOVED***
        var space = options.beautify ? function() {
            print(" ");
    ***REMOVED*** : function() {
            might_need_space = true;
    ***REMOVED***;
        var indent = options.beautify ? function(half) {
            if (options.beautify) {
                print(make_indent(half ? .5 : 0));
        ***REMOVED***
    ***REMOVED*** : noop;
        var with_indent = options.beautify ? function(col, cont) {
            if (col === true) col = next_indent();
            var save_indentation = indentation;
            indentation = col;
            var ret = cont();
            indentation = save_indentation;
            return ret;
    ***REMOVED*** : function(col, cont) {
            return cont();
    ***REMOVED***;
        var newline = options.beautify ? function() {
            print("\n");
    ***REMOVED*** : noop;
        var semicolon = options.beautify ? function() {
            print(";");
    ***REMOVED*** : function() {
            might_need_semicolon = true;
    ***REMOVED***;
        function force_semicolon() {
            might_need_semicolon = false;
            print(";");
    ***REMOVED***
        function next_indent() {
            return indentation + options.indent_level;
    ***REMOVED***
        function with_block(cont) {
            var ret;
            print("{");
            newline();
            with_indent(next_indent(), function() {
                ret = cont();
        ***REMOVED***);
            indent();
            print("***REMOVED***");
            return ret;
    ***REMOVED***
        function with_parens(cont) {
            print("(");
            var ret = cont();
            print(")");
            return ret;
    ***REMOVED***
        function with_square(cont) {
            print("[");
            var ret = cont();
            print("]");
            return ret;
    ***REMOVED***
        function comma() {
            print(",");
            space();
    ***REMOVED***
        function colon() {
            print(":");
            if (options.space_colon) space();
    ***REMOVED***
        var add_mapping = options.source_map ? function(token, name) {
            try {
                if (token) options.source_map.add(token.file || "?", current_line, current_col, token.line, token.col, !name && token.type == "name" ? token.value : name);
        ***REMOVED*** catch (ex) {
                AST_Node.warn("Couldn't figure out mapping for {file***REMOVED***:{line***REMOVED***,{col***REMOVED*** → {cline***REMOVED***,{ccol***REMOVED*** [{name***REMOVED***]", {
                    file: token.file,
                    line: token.line,
                    col: token.col,
                    cline: current_line,
                    ccol: current_col,
                    name: name || ""
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED*** : noop;
        function get() {
            return OUTPUT;
    ***REMOVED***
        var stack = [];
        return {
            get: get,
            toString: get,
            indent: indent,
            indentation: function() {
                return indentation;
          ***REMOVED***
            current_width: function() {
                return current_col - indentation;
          ***REMOVED***
            should_break: function() {
                return options.width && this.current_width() >= options.width;
          ***REMOVED***
            newline: newline,
            print: print,
            space: space,
            comma: comma,
            colon: colon,
            last: function() {
                return last;
          ***REMOVED***
            semicolon: semicolon,
            force_semicolon: force_semicolon,
            to_ascii: to_ascii,
            print_name: function(name) {
                print(make_name(name));
          ***REMOVED***
            print_string: function(str) {
                print(encode_string(str));
          ***REMOVED***
            next_indent: next_indent,
            with_indent: with_indent,
            with_block: with_block,
            with_parens: with_parens,
            with_square: with_square,
            add_mapping: add_mapping,
            option: function(opt) {
                return options[opt];
          ***REMOVED***
            line: function() {
                return current_line;
          ***REMOVED***
            col: function() {
                return current_col;
          ***REMOVED***
            pos: function() {
                return current_pos;
          ***REMOVED***
            push_node: function(node) {
                stack.push(node);
          ***REMOVED***
            pop_node: function() {
                return stack.pop();
          ***REMOVED***
            stack: function() {
                return stack;
          ***REMOVED***
            parent: function(n) {
                return stack[stack.length - 2 - (n || 0)];
        ***REMOVED***
    ***REMOVED***;
***REMOVED***
    (function() {
        function DEFPRINT(nodetype, generator) {
            nodetype.DEFMETHOD("print", function(stream) {
                var self = this;
                stream.push_node(self);
                if (self.needs_parens(stream)) {
                    stream.with_parens(function() {
                        self.add_comments(stream);
                        self.add_source_map(stream);
                        generator(self, stream);
                ***REMOVED***);
            ***REMOVED*** else {
                    self.add_comments(stream);
                    self.add_source_map(stream);
                    generator(self, stream);
            ***REMOVED***
                stream.pop_node();
        ***REMOVED***);
    ***REMOVED***
        AST_Node.DEFMETHOD("print_to_string", function(options) {
            var s = OutputStream(options);
            this.print(s);
            return s.get();
    ***REMOVED***);
        AST_Node.DEFMETHOD("add_comments", function(output) {
            var c = output.option("comments"), self = this;
            if (c) {
                var start = self.start;
                if (start && !start._comments_dumped) {
                    start._comments_dumped = true;
                    var comments = start.comments_before;
                    if (c.test) {
                        comments = comments.filter(function(comment) {
                            return c.test(comment.value);
                    ***REMOVED***);
                ***REMOVED*** else if (typeof c == "function") {
                        comments = comments.filter(function(comment) {
                            return c(self, comment);
                    ***REMOVED***);
                ***REMOVED***
                    comments.forEach(function(c) {
                        if (c.type == "comment1") {
                            output.print("//" + c.value + "\n");
                            output.indent();
                    ***REMOVED*** else if (c.type == "comment2") {
                            output.print("/*" + c.value + "*/");
                            if (start.nlb) {
                                output.print("\n");
                                output.indent();
                        ***REMOVED*** else {
                                output.space();
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
        function PARENS(nodetype, func) {
            nodetype.DEFMETHOD("needs_parens", func);
    ***REMOVED***
        PARENS(AST_Node, function() {
            return false;
    ***REMOVED***);
        PARENS(AST_Function, function(output) {
            return first_in_statement(output);
    ***REMOVED***);
        PARENS(AST_Object, function(output) {
            return first_in_statement(output);
    ***REMOVED***);
        PARENS(AST_Unary, function(output) {
            var p = output.parent();
            return p instanceof AST_PropAccess && p.expression === this;
    ***REMOVED***);
        PARENS(AST_Seq, function(output) {
            var p = output.parent();
            return p instanceof AST_Call || p instanceof AST_Unary || p instanceof AST_Binary || p instanceof AST_VarDef || p instanceof AST_Dot || p instanceof AST_Array || p instanceof AST_ObjectProperty || p instanceof AST_Conditional;
    ***REMOVED***);
        PARENS(AST_Binary, function(output) {
            var p = output.parent();
            if (p instanceof AST_Call && p.expression === this) return true;
            if (p instanceof AST_Unary) return true;
            if (p instanceof AST_PropAccess && p.expression === this) return true;
            if (p instanceof AST_Binary) {
                var po = p.operator, pp = PRECEDENCE[po];
                var so = this.operator, sp = PRECEDENCE[so];
                if (pp > sp || pp == sp && this === p.right && !(so == po && (so == "*" || so == "&&" || so == "||"))) {
                    return true;
            ***REMOVED***
        ***REMOVED***
            if (this.operator == "in") {
                if ((p instanceof AST_For || p instanceof AST_ForIn) && p.init === this) return true;
                if (p instanceof AST_VarDef) {
                    var v = output.parent(1), p2 = output.parent(2);
                    if ((p2 instanceof AST_For || p2 instanceof AST_ForIn) && p2.init === v) return true;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
        PARENS(AST_PropAccess, function(output) {
            var p = output.parent();
            if (p instanceof AST_New && p.expression === this) {
                try {
                    this.walk(new TreeWalker(function(node) {
                        if (node instanceof AST_Call) throw p;
                ***REMOVED***));
            ***REMOVED*** catch (ex) {
                    if (ex !== p) throw ex;
                    return true;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
        PARENS(AST_Call, function(output) {
            var p = output.parent();
            return p instanceof AST_New && p.expression === this;
    ***REMOVED***);
        PARENS(AST_New, function(output) {
            var p = output.parent();
            if (no_constructor_parens(this, output) && (p instanceof AST_Dot || p instanceof AST_Call && p.expression === this)) return true;
    ***REMOVED***);
        function assign_and_conditional_paren_rules(output) {
            var p = output.parent();
            if (p instanceof AST_Unary) return true;
            if (p instanceof AST_Binary && !(p instanceof AST_Assign)) return true;
            if (p instanceof AST_Call && p.expression === this) return true;
            if (p instanceof AST_Conditional && p.condition === this) return true;
            if (p instanceof AST_PropAccess && p.expression === this) return true;
    ***REMOVED***
        PARENS(AST_Assign, assign_and_conditional_paren_rules);
        PARENS(AST_Conditional, assign_and_conditional_paren_rules);
        DEFPRINT(AST_Directive, function(self, output) {
            output.print_string(self.value);
            output.semicolon();
    ***REMOVED***);
        DEFPRINT(AST_Debugger, function(self, output) {
            output.print("debugger");
            output.semicolon();
    ***REMOVED***);
        function display_body(body, is_toplevel, output) {
            var last = body.length - 1;
            body.forEach(function(stmt, i) {
                if (!(stmt instanceof AST_EmptyStatement)) {
                    output.indent();
                    stmt.print(output);
                    if (!(i == last && is_toplevel)) {
                        output.newline();
                        if (is_toplevel) output.newline();
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
        AST_StatementWithBody.DEFMETHOD("_do_print_body", function(output) {
            force_statement(this.body, output);
    ***REMOVED***);
        DEFPRINT(AST_Statement, function(self, output) {
            self.body.print(output);
            output.semicolon();
    ***REMOVED***);
        DEFPRINT(AST_Toplevel, function(self, output) {
            display_body(self.body, true, output);
            output.print("");
    ***REMOVED***);
        DEFPRINT(AST_LabeledStatement, function(self, output) {
            self.label.print(output);
            output.colon();
            self.body.print(output);
    ***REMOVED***);
        DEFPRINT(AST_SimpleStatement, function(self, output) {
            self.body.print(output);
            output.semicolon();
    ***REMOVED***);
        function print_bracketed(body, output) {
            if (body.length > 0) output.with_block(function() {
                display_body(body, false, output);
        ***REMOVED***); else output.print("{***REMOVED***");
    ***REMOVED***
        DEFPRINT(AST_BlockStatement, function(self, output) {
            print_bracketed(self.body, output);
    ***REMOVED***);
        DEFPRINT(AST_EmptyStatement, function(self, output) {
            output.semicolon();
    ***REMOVED***);
        DEFPRINT(AST_Do, function(self, output) {
            output.print("do");
            output.space();
            self._do_print_body(output);
            output.space();
            output.print("while");
            output.space();
            output.with_parens(function() {
                self.condition.print(output);
        ***REMOVED***);
            output.semicolon();
    ***REMOVED***);
        DEFPRINT(AST_While, function(self, output) {
            output.print("while");
            output.space();
            output.with_parens(function() {
                self.condition.print(output);
        ***REMOVED***);
            output.space();
            self._do_print_body(output);
    ***REMOVED***);
        DEFPRINT(AST_For, function(self, output) {
            output.print("for");
            output.space();
            output.with_parens(function() {
                if (self.init) {
                    self.init.print(output);
                    output.print(";");
                    output.space();
            ***REMOVED*** else {
                    output.print(";");
            ***REMOVED***
                if (self.condition) {
                    self.condition.print(output);
                    output.print(";");
                    output.space();
            ***REMOVED*** else {
                    output.print(";");
            ***REMOVED***
                if (self.step) {
                    self.step.print(output);
            ***REMOVED***
        ***REMOVED***);
            output.space();
            self._do_print_body(output);
    ***REMOVED***);
        DEFPRINT(AST_ForIn, function(self, output) {
            output.print("for");
            output.space();
            output.with_parens(function() {
                self.init.print(output);
                output.space();
                output.print("in");
                output.space();
                self.object.print(output);
        ***REMOVED***);
            output.space();
            self._do_print_body(output);
    ***REMOVED***);
        DEFPRINT(AST_With, function(self, output) {
            output.print("with");
            output.space();
            output.with_parens(function() {
                self.expression.print(output);
        ***REMOVED***);
            output.space();
            self._do_print_body(output);
    ***REMOVED***);
        AST_Lambda.DEFMETHOD("_do_print", function(output, nokeyword) {
            var self = this;
            if (!nokeyword) {
                output.print("function");
        ***REMOVED***
            if (self.name) {
                output.space();
                self.name.print(output);
        ***REMOVED***
            output.with_parens(function() {
                self.argnames.forEach(function(arg, i) {
                    if (i) output.comma();
                    arg.print(output);
            ***REMOVED***);
        ***REMOVED***);
            output.space();
            print_bracketed(self.body, output);
    ***REMOVED***);
        DEFPRINT(AST_Lambda, function(self, output) {
            self._do_print(output);
    ***REMOVED***);
        AST_Exit.DEFMETHOD("_do_print", function(output, kind) {
            output.print(kind);
            if (this.value) {
                output.space();
                this.value.print(output);
        ***REMOVED***
            output.semicolon();
    ***REMOVED***);
        DEFPRINT(AST_Return, function(self, output) {
            self._do_print(output, "return");
    ***REMOVED***);
        DEFPRINT(AST_Throw, function(self, output) {
            self._do_print(output, "throw");
    ***REMOVED***);
        AST_LoopControl.DEFMETHOD("_do_print", function(output, kind) {
            output.print(kind);
            if (this.label) {
                output.space();
                this.label.print(output);
        ***REMOVED***
            output.semicolon();
    ***REMOVED***);
        DEFPRINT(AST_Break, function(self, output) {
            self._do_print(output, "break");
    ***REMOVED***);
        DEFPRINT(AST_Continue, function(self, output) {
            self._do_print(output, "continue");
    ***REMOVED***);
        function make_then(self, output) {
            if (output.option("bracketize")) {
                make_block(self.body, output);
                return;
        ***REMOVED***
            if (!self.body) return output.semicolon();
            if (self.body instanceof AST_Do && output.option("ie_proof")) {
                make_block(self.body, output);
                return;
        ***REMOVED***
            var b = self.body;
            while (true) {
                if (b instanceof AST_If) {
                    if (!b.alternative) {
                        make_block(self.body, output);
                        return;
                ***REMOVED***
                    b = b.alternative;
            ***REMOVED*** else if (b instanceof AST_StatementWithBody) {
                    b = b.body;
            ***REMOVED*** else break;
        ***REMOVED***
            self.body.print(output);
    ***REMOVED***
        DEFPRINT(AST_If, function(self, output) {
            output.print("if");
            output.space();
            output.with_parens(function() {
                self.condition.print(output);
        ***REMOVED***);
            output.space();
            if (self.alternative) {
                make_then(self, output);
                output.space();
                output.print("else");
                output.space();
                force_statement(self.alternative, output);
        ***REMOVED*** else {
                self._do_print_body(output);
        ***REMOVED***
    ***REMOVED***);
        DEFPRINT(AST_Switch, function(self, output) {
            output.print("switch");
            output.space();
            output.with_parens(function() {
                self.expression.print(output);
        ***REMOVED***);
            output.space();
            if (self.body.length > 0) output.with_block(function() {
                self.body.forEach(function(stmt, i) {
                    if (i) output.newline();
                    output.indent(true);
                    stmt.print(output);
            ***REMOVED***);
        ***REMOVED***); else output.print("{***REMOVED***");
    ***REMOVED***);
        AST_SwitchBranch.DEFMETHOD("_do_print_body", function(output) {
            if (this.body.length > 0) {
                output.newline();
                this.body.forEach(function(stmt) {
                    output.indent();
                    stmt.print(output);
                    output.newline();
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***);
        DEFPRINT(AST_Default, function(self, output) {
            output.print("default:");
            self._do_print_body(output);
    ***REMOVED***);
        DEFPRINT(AST_Case, function(self, output) {
            output.print("case");
            output.space();
            self.expression.print(output);
            output.print(":");
            self._do_print_body(output);
    ***REMOVED***);
        DEFPRINT(AST_Try, function(self, output) {
            output.print("try");
            output.space();
            print_bracketed(self.body, output);
            if (self.bcatch) {
                output.space();
                self.bcatch.print(output);
        ***REMOVED***
            if (self.bfinally) {
                output.space();
                self.bfinally.print(output);
        ***REMOVED***
    ***REMOVED***);
        DEFPRINT(AST_Catch, function(self, output) {
            output.print("catch");
            output.space();
            output.with_parens(function() {
                self.argname.print(output);
        ***REMOVED***);
            output.space();
            print_bracketed(self.body, output);
    ***REMOVED***);
        DEFPRINT(AST_Finally, function(self, output) {
            output.print("finally");
            output.space();
            print_bracketed(self.body, output);
    ***REMOVED***);
        AST_Definitions.DEFMETHOD("_do_print", function(output, kind) {
            output.print(kind);
            output.space();
            this.definitions.forEach(function(def, i) {
                if (i) output.comma();
                def.print(output);
        ***REMOVED***);
            var p = output.parent();
            var in_for = p instanceof AST_For || p instanceof AST_ForIn;
            var avoid_semicolon = in_for && p.init === this;
            if (!avoid_semicolon) output.semicolon();
    ***REMOVED***);
        DEFPRINT(AST_Var, function(self, output) {
            self._do_print(output, "var");
    ***REMOVED***);
        DEFPRINT(AST_Const, function(self, output) {
            self._do_print(output, "const");
    ***REMOVED***);
        DEFPRINT(AST_VarDef, function(self, output) {
            self.name.print(output);
            if (self.value) {
                output.space();
                output.print("=");
                output.space();
                self.value.print(output);
        ***REMOVED***
    ***REMOVED***);
        DEFPRINT(AST_Call, function(self, output) {
            self.expression.print(output);
            if (self instanceof AST_New && no_constructor_parens(self, output)) return;
            output.with_parens(function() {
                self.args.forEach(function(expr, i) {
                    if (i) output.comma();
                    expr.print(output);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***);
        DEFPRINT(AST_New, function(self, output) {
            output.print("new");
            output.space();
            AST_Call.prototype.print.call(self, output);
    ***REMOVED***);
        AST_Seq.DEFMETHOD("_do_print", function(output) {
            this.car.print(output);
            if (this.cdr) {
                output.comma();
                if (output.should_break()) {
                    output.newline();
                    output.indent();
            ***REMOVED***
                this.cdr.print(output);
        ***REMOVED***
    ***REMOVED***);
        DEFPRINT(AST_Seq, function(self, output) {
            self._do_print(output);
    ***REMOVED***);
        DEFPRINT(AST_Dot, function(self, output) {
            var expr = self.expression;
            expr.print(output);
            if (expr instanceof AST_Number) {
                if (!/[xa-f.]/i.test(output.last())) {
                    output.print(".");
            ***REMOVED***
        ***REMOVED***
            output.print(".");
            output.add_mapping(self.end);
            output.print_name(self.property);
    ***REMOVED***);
        DEFPRINT(AST_Sub, function(self, output) {
            self.expression.print(output);
            output.print("[");
            self.property.print(output);
            output.print("]");
    ***REMOVED***);
        DEFPRINT(AST_UnaryPrefix, function(self, output) {
            var op = self.operator;
            output.print(op);
            if (/^[a-z]/i.test(op)) output.space();
            self.expression.print(output);
    ***REMOVED***);
        DEFPRINT(AST_UnaryPostfix, function(self, output) {
            self.expression.print(output);
            output.print(self.operator);
    ***REMOVED***);
        DEFPRINT(AST_Binary, function(self, output) {
            self.left.print(output);
            output.space();
            output.print(self.operator);
            output.space();
            self.right.print(output);
    ***REMOVED***);
        DEFPRINT(AST_Conditional, function(self, output) {
            self.condition.print(output);
            output.space();
            output.print("?");
            output.space();
            self.consequent.print(output);
            output.space();
            output.colon();
            self.alternative.print(output);
    ***REMOVED***);
        DEFPRINT(AST_Array, function(self, output) {
            output.with_square(function() {
                var a = self.elements, len = a.length;
                if (len > 0) output.space();
                a.forEach(function(exp, i) {
                    if (i) output.comma();
                    if (!(exp instanceof AST_Undefined)) exp.print(output);
            ***REMOVED***);
                if (len > 0) output.space();
        ***REMOVED***);
    ***REMOVED***);
        DEFPRINT(AST_Object, function(self, output) {
            if (self.properties.length > 0) output.with_block(function() {
                self.properties.forEach(function(prop, i) {
                    if (i) {
                        output.print(",");
                        output.newline();
                ***REMOVED***
                    output.indent();
                    prop.print(output);
            ***REMOVED***);
                output.newline();
        ***REMOVED***); else output.print("{***REMOVED***");
    ***REMOVED***);
        DEFPRINT(AST_ObjectKeyVal, function(self, output) {
            var key = self.key;
            if (output.option("quote_keys")) {
                output.print_string(key);
        ***REMOVED*** else if ((typeof key == "number" || !output.option("beautify") && +key + "" == key) && parseFloat(key) >= 0) {
                output.print(make_num(key));
        ***REMOVED*** else if (!is_identifier(key)) {
                output.print_string(key);
        ***REMOVED*** else {
                output.print_name(key);
        ***REMOVED***
            output.colon();
            self.value.print(output);
    ***REMOVED***);
        DEFPRINT(AST_ObjectSetter, function(self, output) {
            output.print("set");
            self.value._do_print(output, true);
    ***REMOVED***);
        DEFPRINT(AST_ObjectGetter, function(self, output) {
            output.print("get");
            self.value._do_print(output, true);
    ***REMOVED***);
        DEFPRINT(AST_Symbol, function(self, output) {
            var def = self.definition();
            output.print_name(def ? def.mangled_name || def.name : self.name);
    ***REMOVED***);
        DEFPRINT(AST_Undefined, function(self, output) {
            output.print("void 0");
    ***REMOVED***);
        DEFPRINT(AST_Infinity, function(self, output) {
            output.print("1/0");
    ***REMOVED***);
        DEFPRINT(AST_NaN, function(self, output) {
            output.print("0/0");
    ***REMOVED***);
        DEFPRINT(AST_This, function(self, output) {
            output.print("this");
    ***REMOVED***);
        DEFPRINT(AST_Constant, function(self, output) {
            output.print(self.getValue());
    ***REMOVED***);
        DEFPRINT(AST_String, function(self, output) {
            output.print_string(self.getValue());
    ***REMOVED***);
        DEFPRINT(AST_Number, function(self, output) {
            output.print(make_num(self.getValue()));
    ***REMOVED***);
        DEFPRINT(AST_RegExp, function(self, output) {
            var str = self.getValue().toString();
            if (output.option("ascii_only")) str = output.to_ascii(str);
            output.print(str);
    ***REMOVED***);
        function force_statement(stat, output) {
            if (output.option("bracketize")) {
                if (!stat || stat instanceof AST_EmptyStatement) output.print("{***REMOVED***"); else if (stat instanceof AST_BlockStatement) stat.print(output); else output.with_block(function() {
                    output.indent();
                    stat.print(output);
                    output.newline();
            ***REMOVED***);
        ***REMOVED*** else {
                if (!stat || stat instanceof AST_EmptyStatement) output.force_semicolon(); else stat.print(output);
        ***REMOVED***
    ***REMOVED***
        function first_in_statement(output) {
            var a = output.stack(), i = a.length, node = a[--i], p = a[--i];
            while (i > 0) {
                if (p instanceof AST_Statement && p.body === node) return true;
                if (p instanceof AST_Seq && p.car === node || p instanceof AST_Call && p.expression === node || p instanceof AST_Dot && p.expression === node || p instanceof AST_Sub && p.expression === node || p instanceof AST_Conditional && p.condition === node || p instanceof AST_Binary && p.left === node || p instanceof AST_UnaryPostfix && p.expression === node) {
                    node = p;
                    p = a[--i];
            ***REMOVED*** else {
                    return false;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        function no_constructor_parens(self, output) {
            return self.args.length == 0 && !output.option("beautify");
    ***REMOVED***
        function best_of(a) {
            var best = a[0], len = best.length;
            for (var i = 1; i < a.length; ++i) {
                if (a[i].length < len) {
                    best = a[i];
                    len = best.length;
            ***REMOVED***
        ***REMOVED***
            return best;
    ***REMOVED***
        function make_num(num) {
            var str = num.toString(10), a = [ str.replace(/^0\./, ".").replace("e+", "e") ], m;
            if (Math.floor(num) === num) {
                if (num >= 0) {
                    a.push("0x" + num.toString(16).toLowerCase(), "0" + num.toString(8));
            ***REMOVED*** else {
                    a.push("-0x" + (-num).toString(16).toLowerCase(), "-0" + (-num).toString(8));
            ***REMOVED***
                if (m = /^(.*?)(0+)$/.exec(num)) {
                    a.push(m[1] + "e" + m[2].length);
            ***REMOVED***
        ***REMOVED*** else if (m = /^0?\.(0+)(.*)$/.exec(num)) {
                a.push(m[2] + "e-" + (m[1].length + m[2].length), str.substr(str.indexOf(".")));
        ***REMOVED***
            return best_of(a);
    ***REMOVED***
        function make_block(stmt, output) {
            if (stmt instanceof AST_BlockStatement) {
                stmt.print(output);
                return;
        ***REMOVED***
            output.with_block(function() {
                output.indent();
                stmt.print(output);
                output.newline();
        ***REMOVED***);
    ***REMOVED***
        function DEFMAP(nodetype, generator) {
            nodetype.DEFMETHOD("add_source_map", function(stream) {
                generator(this, stream);
        ***REMOVED***);
    ***REMOVED***
        DEFMAP(AST_Node, noop);
        function basic_sourcemap_gen(self, output) {
            output.add_mapping(self.start);
    ***REMOVED***
        DEFMAP(AST_Directive, basic_sourcemap_gen);
        DEFMAP(AST_Debugger, basic_sourcemap_gen);
        DEFMAP(AST_Symbol, basic_sourcemap_gen);
        DEFMAP(AST_Jump, basic_sourcemap_gen);
        DEFMAP(AST_StatementWithBody, basic_sourcemap_gen);
        DEFMAP(AST_LabeledStatement, noop);
        DEFMAP(AST_Lambda, basic_sourcemap_gen);
        DEFMAP(AST_Switch, basic_sourcemap_gen);
        DEFMAP(AST_SwitchBranch, basic_sourcemap_gen);
        DEFMAP(AST_BlockStatement, basic_sourcemap_gen);
        DEFMAP(AST_Toplevel, noop);
        DEFMAP(AST_New, basic_sourcemap_gen);
        DEFMAP(AST_Try, basic_sourcemap_gen);
        DEFMAP(AST_Catch, basic_sourcemap_gen);
        DEFMAP(AST_Finally, basic_sourcemap_gen);
        DEFMAP(AST_Definitions, basic_sourcemap_gen);
        DEFMAP(AST_Constant, basic_sourcemap_gen);
        DEFMAP(AST_ObjectProperty, function(self, output) {
            output.add_mapping(self.start, self.key);
    ***REMOVED***);
***REMOVED***)();
    "use strict";
    function Compressor(options, false_by_default) {
        if (!(this instanceof Compressor)) return new Compressor(options, false_by_default);
        TreeTransformer.call(this, this.before, this.after);
        this.options = defaults(options, {
            sequences: !false_by_default,
            properties: !false_by_default,
            dead_code: !false_by_default,
            drop_debugger: !false_by_default,
            unsafe: !false_by_default,
            unsafe_comps: false,
            conditionals: !false_by_default,
            comparisons: !false_by_default,
            evaluate: !false_by_default,
            booleans: !false_by_default,
            loops: !false_by_default,
            unused: !false_by_default,
            hoist_funs: !false_by_default,
            hoist_vars: false,
            if_return: !false_by_default,
            join_vars: !false_by_default,
            cascade: !false_by_default,
            side_effects: !false_by_default,
            warnings: true,
            global_defs: {***REMOVED***
      ***REMOVED*** true);
***REMOVED***
    Compressor.prototype = new TreeTransformer();
    merge(Compressor.prototype, {
        option: function(key) {
            return this.options[key];
      ***REMOVED***
        warn: function() {
            if (this.options.warnings) AST_Node.warn.apply(AST_Node, arguments);
      ***REMOVED***
        before: function(node, descend, in_list) {
            if (node._squeezed) return node;
            if (node instanceof AST_Scope) {
                node.drop_unused(this);
                node = node.hoist_declarations(this);
        ***REMOVED***
            descend(node, this);
            node = node.optimize(this);
            if (node instanceof AST_Scope) {
                var save_warnings = this.options.warnings;
                this.options.warnings = false;
                node.drop_unused(this);
                this.options.warnings = save_warnings;
        ***REMOVED***
            node._squeezed = true;
            return node;
    ***REMOVED***
***REMOVED***);
    (function() {
        function OPT(node, optimizer) {
            node.DEFMETHOD("optimize", function(compressor) {
                var self = this;
                if (self._optimized) return self;
                var opt = optimizer(self, compressor);
                opt._optimized = true;
                if (opt === self) return opt;
                return opt.transform(compressor);
        ***REMOVED***);
    ***REMOVED***
        OPT(AST_Node, function(self, compressor) {
            return self;
    ***REMOVED***);
        AST_Node.DEFMETHOD("equivalent_to", function(node) {
            return this.print_to_string() == node.print_to_string();
    ***REMOVED***);
        function make_node(ctor, orig, props) {
            if (!props) props = {***REMOVED***;
            if (orig) {
                if (!props.start) props.start = orig.start;
                if (!props.end) props.end = orig.end;
        ***REMOVED***
            return new ctor(props);
    ***REMOVED***
        function make_node_from_constant(compressor, val, orig) {
            if (val instanceof AST_Node) return val.transform(compressor);
            switch (typeof val) {
              case "string":
                return make_node(AST_String, orig, {
                    value: val
            ***REMOVED***).optimize(compressor);

              case "number":
                return make_node(isNaN(val) ? AST_NaN : AST_Number, orig, {
                    value: val
            ***REMOVED***).optimize(compressor);

              case "boolean":
                return make_node(val ? AST_True : AST_False, orig);

              case "undefined":
                return make_node(AST_Undefined, orig).optimize(compressor);

              default:
                if (val === null) {
                    return make_node(AST_Null, orig).optimize(compressor);
            ***REMOVED***
                if (val instanceof RegExp) {
                    return make_node(AST_RegExp, orig).optimize(compressor);
            ***REMOVED***
                throw new Error(string_template("Can't handle constant of type: {type***REMOVED***", {
                    type: typeof val
            ***REMOVED***));
        ***REMOVED***
    ***REMOVED***
        function as_statement_array(thing) {
            if (thing === null) return [];
            if (thing instanceof AST_BlockStatement) return thing.body;
            if (thing instanceof AST_EmptyStatement) return [];
            if (thing instanceof AST_Statement) return [ thing ];
            throw new Error("Can't convert thing to statement array");
    ***REMOVED***
        function is_empty(thing) {
            if (thing === null) return true;
            if (thing instanceof AST_EmptyStatement) return true;
            if (thing instanceof AST_BlockStatement) return thing.body.length == 0;
            return false;
    ***REMOVED***
        function loop_body(x) {
            if (x instanceof AST_Switch) return x;
            if (x instanceof AST_For || x instanceof AST_ForIn || x instanceof AST_DWLoop) {
                return x.body instanceof AST_BlockStatement ? x.body : x;
        ***REMOVED***
            return x;
    ***REMOVED***
        function tighten_body(statements, compressor) {
            var CHANGED;
            do {
                CHANGED = false;
                statements = eliminate_spurious_blocks(statements);
                if (compressor.option("dead_code")) {
                    statements = eliminate_dead_code(statements, compressor);
            ***REMOVED***
                if (compressor.option("if_return")) {
                    statements = handle_if_return(statements, compressor);
            ***REMOVED***
                if (compressor.option("sequences")) {
                    statements = sequencesize(statements, compressor);
            ***REMOVED***
                if (compressor.option("join_vars")) {
                    statements = join_consecutive_vars(statements, compressor);
            ***REMOVED***
        ***REMOVED*** while (CHANGED);
            return statements;
            function eliminate_spurious_blocks(statements) {
                var seen_dirs = [];
                return statements.reduce(function(a, stat) {
                    if (stat instanceof AST_BlockStatement) {
                        CHANGED = true;
                        a.push.apply(a, eliminate_spurious_blocks(stat.body));
                ***REMOVED*** else if (stat instanceof AST_EmptyStatement) {
                        CHANGED = true;
                ***REMOVED*** else if (stat instanceof AST_Directive) {
                        if (seen_dirs.indexOf(stat.value) < 0) {
                            a.push(stat);
                            seen_dirs.push(stat.value);
                    ***REMOVED*** else {
                            CHANGED = true;
                    ***REMOVED***
                ***REMOVED*** else {
                        a.push(stat);
                ***REMOVED***
                    return a;
              ***REMOVED*** []);
        ***REMOVED***
            function handle_if_return(statements, compressor) {
                var self = compressor.self();
                var in_lambda = self instanceof AST_Lambda;
                var ret = [];
                loop: for (var i = statements.length; --i >= 0; ) {
                    var stat = statements[i];
                    switch (true) {
                      case in_lambda && stat instanceof AST_Return && !stat.value && ret.length == 0:
                        CHANGED = true;
                        continue loop;

                      case stat instanceof AST_If:
                        if (stat.body instanceof AST_Return) {
                            if ((in_lambda && ret.length == 0 || ret[0] instanceof AST_Return && !ret[0].value) && !stat.body.value && !stat.alternative) {
                                CHANGED = true;
                                var cond = make_node(AST_SimpleStatement, stat.condition, {
                                    body: stat.condition
                            ***REMOVED***);
                                ret.unshift(cond);
                                continue loop;
                        ***REMOVED***
                            if (ret[0] instanceof AST_Return && stat.body.value && ret[0].value && !stat.alternative) {
                                CHANGED = true;
                                stat = stat.clone();
                                stat.alternative = ret[0];
                                ret[0] = stat.transform(compressor);
                                continue loop;
                        ***REMOVED***
                            if ((ret.length == 0 || ret[0] instanceof AST_Return) && stat.body.value && !stat.alternative && in_lambda) {
                                CHANGED = true;
                                stat = stat.clone();
                                stat.alternative = ret[0] || make_node(AST_Return, stat, {
                                    value: make_node(AST_Undefined, stat)
                            ***REMOVED***);
                                ret[0] = stat.transform(compressor);
                                continue loop;
                        ***REMOVED***
                            if (!stat.body.value && in_lambda) {
                                CHANGED = true;
                                stat = stat.clone();
                                stat.condition = stat.condition.negate(compressor);
                                stat.body = make_node(AST_BlockStatement, stat, {
                                    body: as_statement_array(stat.alternative).concat(ret)
                            ***REMOVED***);
                                stat.alternative = null;
                                ret = [ stat.transform(compressor) ];
                                continue loop;
                        ***REMOVED***
                            if (ret.length == 1 && in_lambda && ret[0] instanceof AST_SimpleStatement && (!stat.alternative || stat.alternative instanceof AST_SimpleStatement)) {
                                CHANGED = true;
                                ret.push(make_node(AST_Return, ret[0], {
                                    value: make_node(AST_Undefined, ret[0])
                            ***REMOVED***).transform(compressor));
                                ret = as_statement_array(stat.alternative).concat(ret);
                                ret.unshift(stat);
                                continue loop;
                        ***REMOVED***
                    ***REMOVED***
                        var ab = aborts(stat.body);
                        var lct = ab instanceof AST_LoopControl ? compressor.loopcontrol_target(ab.label) : null;
                        if (ab && (ab instanceof AST_Return && !ab.value && in_lambda || ab instanceof AST_Continue && self === loop_body(lct) || ab instanceof AST_Break && lct instanceof AST_BlockStatement && self === lct)) {
                            if (ab.label) {
                                remove(ab.label.thedef.references, ab.label);
                        ***REMOVED***
                            CHANGED = true;
                            var body = as_statement_array(stat.body).slice(0, -1);
                            stat = stat.clone();
                            stat.condition = stat.condition.negate(compressor);
                            stat.body = make_node(AST_BlockStatement, stat, {
                                body: ret
                        ***REMOVED***);
                            stat.alternative = make_node(AST_BlockStatement, stat, {
                                body: body
                        ***REMOVED***);
                            ret = [ stat.transform(compressor) ];
                            continue loop;
                    ***REMOVED***
                        var ab = aborts(stat.alternative);
                        var lct = ab instanceof AST_LoopControl ? compressor.loopcontrol_target(ab.label) : null;
                        if (ab && (ab instanceof AST_Return && !ab.value && in_lambda || ab instanceof AST_Continue && self === loop_body(lct) || ab instanceof AST_Break && lct instanceof AST_BlockStatement && self === lct)) {
                            if (ab.label) {
                                remove(ab.label.thedef.references, ab.label);
                        ***REMOVED***
                            CHANGED = true;
                            stat = stat.clone();
                            stat.body = make_node(AST_BlockStatement, stat.body, {
                                body: as_statement_array(stat.body).concat(ret)
                        ***REMOVED***);
                            stat.alternative = make_node(AST_BlockStatement, stat.alternative, {
                                body: as_statement_array(stat.alternative).slice(0, -1)
                        ***REMOVED***);
                            ret = [ stat.transform(compressor) ];
                            continue loop;
                    ***REMOVED***
                        ret.unshift(stat);
                        break;

                      default:
                        ret.unshift(stat);
                        break;
                ***REMOVED***
            ***REMOVED***
                return ret;
        ***REMOVED***
            function eliminate_dead_code(statements, compressor) {
                var has_quit = false;
                var orig = statements.length;
                var self = compressor.self();
                statements = statements.reduce(function(a, stat) {
                    if (has_quit) {
                        extract_declarations_from_unreachable_code(compressor, stat, a);
                ***REMOVED*** else {
                        if (stat instanceof AST_LoopControl) {
                            var lct = compressor.loopcontrol_target(stat.label);
                            if (stat instanceof AST_Break && lct instanceof AST_BlockStatement && loop_body(lct) === self || stat instanceof AST_Continue && loop_body(lct) === self) {
                                if (stat.label) {
                                    remove(stat.label.thedef.references, stat.label);
                            ***REMOVED***
                        ***REMOVED*** else {
                                a.push(stat);
                        ***REMOVED***
                    ***REMOVED*** else {
                            a.push(stat);
                    ***REMOVED***
                        if (aborts(stat)) has_quit = true;
                ***REMOVED***
                    return a;
              ***REMOVED*** []);
                CHANGED = statements.length != orig;
                return statements;
        ***REMOVED***
            function sequencesize(statements, compressor) {
                if (statements.length < 2) return statements;
                var seq = [], ret = [];
                function push_seq() {
                    seq = AST_Seq.from_array(seq);
                    if (seq) ret.push(make_node(AST_SimpleStatement, seq, {
                        body: seq
                ***REMOVED***));
                    seq = [];
            ***REMOVED***
                statements.forEach(function(stat) {
                    if (stat instanceof AST_SimpleStatement) seq.push(stat.body); else push_seq(), ret.push(stat);
            ***REMOVED***);
                push_seq();
                ret = sequencesize_2(ret, compressor);
                CHANGED = ret.length != statements.length;
                return ret;
        ***REMOVED***
            function sequencesize_2(statements, compressor) {
                function cons_seq(right) {
                    ret.pop();
                    var left = prev.body;
                    if (left instanceof AST_Seq) {
                        left.add(right);
                ***REMOVED*** else {
                        left = AST_Seq.cons(left, right);
                ***REMOVED***
                    return left.transform(compressor);
            ***REMOVED***
                var ret = [], prev = null;
                statements.forEach(function(stat) {
                    if (prev) {
                        if (stat instanceof AST_For) {
                            var opera = {***REMOVED***;
                            try {
                                prev.body.walk(new TreeWalker(function(node) {
                                    if (node instanceof AST_Binary && node.operator == "in") throw opera;
                            ***REMOVED***));
                                if (stat.init && !(stat.init instanceof AST_Definitions)) {
                                    stat.init = cons_seq(stat.init);
                            ***REMOVED*** else if (!stat.init) {
                                    stat.init = prev.body;
                                    ret.pop();
                            ***REMOVED***
                        ***REMOVED*** catch (ex) {
                                if (ex !== opera) throw ex;
                        ***REMOVED***
                    ***REMOVED*** else if (stat instanceof AST_If) {
                            stat.condition = cons_seq(stat.condition);
                    ***REMOVED*** else if (stat instanceof AST_With) {
                            stat.expression = cons_seq(stat.expression);
                    ***REMOVED*** else if (stat instanceof AST_Exit && stat.value) {
                            stat.value = cons_seq(stat.value);
                    ***REMOVED*** else if (stat instanceof AST_Exit) {
                            stat.value = cons_seq(make_node(AST_Undefined, stat));
                    ***REMOVED*** else if (stat instanceof AST_Switch) {
                            stat.expression = cons_seq(stat.expression);
                    ***REMOVED***
                ***REMOVED***
                    ret.push(stat);
                    prev = stat instanceof AST_SimpleStatement ? stat : null;
            ***REMOVED***);
                return ret;
        ***REMOVED***
            function join_consecutive_vars(statements, compressor) {
                var prev = null;
                return statements.reduce(function(a, stat) {
                    if (stat instanceof AST_Definitions && prev && prev.TYPE == stat.TYPE) {
                        prev.definitions = prev.definitions.concat(stat.definitions);
                        CHANGED = true;
                ***REMOVED*** else if (stat instanceof AST_For && prev instanceof AST_Definitions && (!stat.init || stat.init.TYPE == prev.TYPE)) {
                        CHANGED = true;
                        a.pop();
                        if (stat.init) {
                            stat.init.definitions = prev.definitions.concat(stat.init.definitions);
                    ***REMOVED*** else {
                            stat.init = prev;
                    ***REMOVED***
                        a.push(stat);
                        prev = stat;
                ***REMOVED*** else {
                        prev = stat;
                        a.push(stat);
                ***REMOVED***
                    return a;
              ***REMOVED*** []);
        ***REMOVED***
    ***REMOVED***
        function extract_declarations_from_unreachable_code(compressor, stat, target) {
            compressor.warn("Dropping unreachable code [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", stat.start);
            stat.walk(new TreeWalker(function(node) {
                if (node instanceof AST_Definitions) {
                    compressor.warn("Declarations in unreachable code! [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", node.start);
                    node.remove_initializers();
                    target.push(node);
                    return true;
            ***REMOVED***
                if (node instanceof AST_Defun) {
                    target.push(node);
                    return true;
            ***REMOVED***
                if (node instanceof AST_Scope) {
                    return true;
            ***REMOVED***
        ***REMOVED***));
    ***REMOVED***
        (function(def) {
            var unary_bool = [ "!", "delete" ];
            var binary_bool = [ "in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">" ];
            def(AST_Node, function() {
                return false;
        ***REMOVED***);
            def(AST_UnaryPrefix, function() {
                return member(this.operator, unary_bool);
        ***REMOVED***);
            def(AST_Binary, function() {
                return member(this.operator, binary_bool) || (this.operator == "&&" || this.operator == "||") && this.left.is_boolean() && this.right.is_boolean();
        ***REMOVED***);
            def(AST_Conditional, function() {
                return this.consequent.is_boolean() && this.alternative.is_boolean();
        ***REMOVED***);
            def(AST_Assign, function() {
                return this.operator == "=" && this.right.is_boolean();
        ***REMOVED***);
            def(AST_Seq, function() {
                return this.cdr.is_boolean();
        ***REMOVED***);
            def(AST_True, function() {
                return true;
        ***REMOVED***);
            def(AST_False, function() {
                return true;
        ***REMOVED***);
    ***REMOVED***)(function(node, func) {
            node.DEFMETHOD("is_boolean", func);
    ***REMOVED***);
        (function(def) {
            def(AST_Node, function() {
                return false;
        ***REMOVED***);
            def(AST_String, function() {
                return true;
        ***REMOVED***);
            def(AST_UnaryPrefix, function() {
                return this.operator == "typeof";
        ***REMOVED***);
            def(AST_Binary, function() {
                return this.operator == "+" && (this.left.is_string() || this.right.is_string());
        ***REMOVED***);
            def(AST_Assign, function() {
                return this.operator == "=" && this.right.is_string();
        ***REMOVED***);
    ***REMOVED***)(function(node, func) {
            node.DEFMETHOD("is_string", func);
    ***REMOVED***);
        function best_of(ast1, ast2) {
            return ast1.print_to_string().length > ast2.print_to_string().length ? ast2 : ast1;
    ***REMOVED***
        (function(def) {
            AST_Node.DEFMETHOD("evaluate", function(compressor) {
                if (!compressor.option("evaluate")) return [ this ];
                try {
                    var val = this._eval(), ast = make_node_from_constant(compressor, val, this);
                    return [ best_of(ast, this), val ];
            ***REMOVED*** catch (ex) {
                    if (ex !== def) throw ex;
                    return [ this ];
            ***REMOVED***
        ***REMOVED***);
            def(AST_Statement, function() {
                throw new Error(string_template("Cannot evaluate a statement [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", this.start));
        ***REMOVED***);
            def(AST_Function, function() {
                return [ this ];
        ***REMOVED***);
            function ev(node) {
                return node._eval();
        ***REMOVED***
            def(AST_Node, function() {
                throw def;
        ***REMOVED***);
            def(AST_Constant, function() {
                return this.getValue();
        ***REMOVED***);
            def(AST_UnaryPrefix, function() {
                var e = this.expression;
                switch (this.operator) {
                  case "!":
                    return !ev(e);

                  case "typeof":
                    return typeof ev(e);

                  case "void":
                    return void ev(e);

                  case "~":
                    return ~ev(e);

                  case "-":
                    return -ev(e);

                  case "+":
                    return +ev(e);
            ***REMOVED***
                throw def;
        ***REMOVED***);
            def(AST_Binary, function() {
                var left = this.left, right = this.right;
                switch (this.operator) {
                  case "&&":
                    return ev(left) && ev(right);

                  case "||":
                    return ev(left) || ev(right);

                  case "|":
                    return ev(left) | ev(right);

                  case "&":
                    return ev(left) & ev(right);

                  case "^":
                    return ev(left) ^ ev(right);

                  case "+":
                    return ev(left) + ev(right);

                  case "*":
                    return ev(left) * ev(right);

                  case "/":
                    return ev(left) / ev(right);

                  case "%":
                    return ev(left) % ev(right);

                  case "-":
                    return ev(left) - ev(right);

                  case "<<":
                    return ev(left) << ev(right);

                  case ">>":
                    return ev(left) >> ev(right);

                  case ">>>":
                    return ev(left) >>> ev(right);

                  case "==":
                    return ev(left) == ev(right);

                  case "===":
                    return ev(left) === ev(right);

                  case "!=":
                    return ev(left) != ev(right);

                  case "!==":
                    return ev(left) !== ev(right);

                  case "<":
                    return ev(left) < ev(right);

                  case "<=":
                    return ev(left) <= ev(right);

                  case ">":
                    return ev(left) > ev(right);

                  case ">=":
                    return ev(left) >= ev(right);

                  case "in":
                    return ev(left) in ev(right);

                  case "instanceof":
                    return ev(left) instanceof ev(right);
            ***REMOVED***
                throw def;
        ***REMOVED***);
            def(AST_Conditional, function() {
                return ev(this.condition) ? ev(this.consequent) : ev(this.alternative);
        ***REMOVED***);
            def(AST_SymbolRef, function() {
                var d = this.definition();
                if (d && d.constant) {
                    var orig = d.orig[0];
                    if (orig) orig = orig.init[0];
                    orig = orig && orig.value;
                    if (orig) return ev(orig);
            ***REMOVED***
                throw def;
        ***REMOVED***);
    ***REMOVED***)(function(node, func) {
            node.DEFMETHOD("_eval", func);
    ***REMOVED***);
        (function(def) {
            function basic_negation(exp) {
                return make_node(AST_UnaryPrefix, exp, {
                    operator: "!",
                    expression: exp
            ***REMOVED***);
        ***REMOVED***
            def(AST_Node, function() {
                return basic_negation(this);
        ***REMOVED***);
            def(AST_Statement, function() {
                throw new Error("Cannot negate a statement");
        ***REMOVED***);
            def(AST_Function, function() {
                return basic_negation(this);
        ***REMOVED***);
            def(AST_UnaryPrefix, function() {
                if (this.operator == "!") return this.expression;
                return basic_negation(this);
        ***REMOVED***);
            def(AST_Seq, function(compressor) {
                var self = this.clone();
                self.cdr = self.cdr.negate(compressor);
                return self;
        ***REMOVED***);
            def(AST_Conditional, function(compressor) {
                var self = this.clone();
                self.consequent = self.consequent.negate(compressor);
                self.alternative = self.alternative.negate(compressor);
                return best_of(basic_negation(this), self);
        ***REMOVED***);
            def(AST_Binary, function(compressor) {
                var self = this.clone(), op = this.operator;
                if (compressor.option("unsafe_comps")) {
                    switch (op) {
                      case "<=":
                        self.operator = ">";
                        return self;

                      case "<":
                        self.operator = ">=";
                        return self;

                      case ">=":
                        self.operator = "<";
                        return self;

                      case ">":
                        self.operator = "<=";
                        return self;
                ***REMOVED***
            ***REMOVED***
                switch (op) {
                  case "==":
                    self.operator = "!=";
                    return self;

                  case "!=":
                    self.operator = "==";
                    return self;

                  case "===":
                    self.operator = "!==";
                    return self;

                  case "!==":
                    self.operator = "===";
                    return self;

                  case "&&":
                    self.operator = "||";
                    self.left = self.left.negate(compressor);
                    self.right = self.right.negate(compressor);
                    return best_of(basic_negation(this), self);

                  case "||":
                    self.operator = "&&";
                    self.left = self.left.negate(compressor);
                    self.right = self.right.negate(compressor);
                    return best_of(basic_negation(this), self);
            ***REMOVED***
                return basic_negation(this);
        ***REMOVED***);
    ***REMOVED***)(function(node, func) {
            node.DEFMETHOD("negate", function(compressor) {
                return func.call(this, compressor);
        ***REMOVED***);
    ***REMOVED***);
        (function(def) {
            def(AST_Node, function() {
                return true;
        ***REMOVED***);
            def(AST_EmptyStatement, function() {
                return false;
        ***REMOVED***);
            def(AST_Constant, function() {
                return false;
        ***REMOVED***);
            def(AST_This, function() {
                return false;
        ***REMOVED***);
            def(AST_Block, function() {
                for (var i = this.body.length; --i >= 0; ) {
                    if (this.body[i].has_side_effects()) return true;
            ***REMOVED***
                return false;
        ***REMOVED***);
            def(AST_SimpleStatement, function() {
                return this.body.has_side_effects();
        ***REMOVED***);
            def(AST_Defun, function() {
                return true;
        ***REMOVED***);
            def(AST_Function, function() {
                return false;
        ***REMOVED***);
            def(AST_Binary, function() {
                return this.left.has_side_effects() || this.right.has_side_effects();
        ***REMOVED***);
            def(AST_Assign, function() {
                return true;
        ***REMOVED***);
            def(AST_Conditional, function() {
                return this.condition.has_side_effects() || this.consequent.has_side_effects() || this.alternative.has_side_effects();
        ***REMOVED***);
            def(AST_Unary, function() {
                return this.operator == "delete" || this.operator == "++" || this.operator == "--" || this.expression.has_side_effects();
        ***REMOVED***);
            def(AST_SymbolRef, function() {
                return false;
        ***REMOVED***);
            def(AST_Object, function() {
                for (var i = this.properties.length; --i >= 0; ) if (this.properties[i].has_side_effects()) return true;
                return false;
        ***REMOVED***);
            def(AST_ObjectProperty, function() {
                return this.value.has_side_effects();
        ***REMOVED***);
            def(AST_Array, function() {
                for (var i = this.elements.length; --i >= 0; ) if (this.elements[i].has_side_effects()) return true;
                return false;
        ***REMOVED***);
            def(AST_PropAccess, function() {
                return true;
        ***REMOVED***);
            def(AST_Seq, function() {
                return this.car.has_side_effects() || this.cdr.has_side_effects();
        ***REMOVED***);
    ***REMOVED***)(function(node, func) {
            node.DEFMETHOD("has_side_effects", func);
    ***REMOVED***);
        function aborts(thing) {
            return thing && thing.aborts();
    ***REMOVED***
        (function(def) {
            def(AST_Statement, function() {
                return null;
        ***REMOVED***);
            def(AST_Jump, function() {
                return this;
        ***REMOVED***);
            def(AST_BlockStatement, function() {
                var n = this.body.length;
                return n > 0 && aborts(this.body[n - 1]);
        ***REMOVED***);
            def(AST_If, function() {
                return this.alternative && aborts(this.body) && aborts(this.alternative);
        ***REMOVED***);
    ***REMOVED***)(function(node, func) {
            node.DEFMETHOD("aborts", func);
    ***REMOVED***);
        OPT(AST_Directive, function(self, compressor) {
            if (self.scope.has_directive(self.value) !== self.scope) {
                return make_node(AST_EmptyStatement, self);
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Debugger, function(self, compressor) {
            if (compressor.option("drop_debugger")) return make_node(AST_EmptyStatement, self);
            return self;
    ***REMOVED***);
        OPT(AST_LabeledStatement, function(self, compressor) {
            if (self.body instanceof AST_Break && compressor.loopcontrol_target(self.body.label) === self.body) {
                return make_node(AST_EmptyStatement, self);
        ***REMOVED***
            return self.label.references.length == 0 ? self.body : self;
    ***REMOVED***);
        OPT(AST_Block, function(self, compressor) {
            self.body = tighten_body(self.body, compressor);
            return self;
    ***REMOVED***);
        OPT(AST_BlockStatement, function(self, compressor) {
            self.body = tighten_body(self.body, compressor);
            switch (self.body.length) {
              case 1:
                return self.body[0];

              case 0:
                return make_node(AST_EmptyStatement, self);
        ***REMOVED***
            return self;
    ***REMOVED***);
        AST_Scope.DEFMETHOD("drop_unused", function(compressor) {
            var self = this;
            if (compressor.option("unused") && !(self instanceof AST_Toplevel) && !self.uses_eval) {
                var in_use = [];
                var scope = this;
                var tw = new TreeWalker(function(node, descend) {
                    if (node !== self) {
                        if (node instanceof AST_Defun) {
                            return true;
                    ***REMOVED***
                        if (node instanceof AST_Definitions && scope === self) {
                            node.definitions.forEach(function(def) {
                                if (def.value && def.value.has_side_effects()) {
                                    def.value.walk(tw);
                            ***REMOVED***
                        ***REMOVED***);
                            return true;
                    ***REMOVED***
                        if (node instanceof AST_SymbolRef) {
                            push_uniq(in_use, node.definition());
                            return true;
                    ***REMOVED***
                        if (node instanceof AST_Scope) {
                            var save_scope = scope;
                            scope = node;
                            descend();
                            scope = save_scope;
                            return true;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
                self.walk(tw);
                for (var i = 0; i < in_use.length; ++i) {
                    in_use[i].orig.forEach(function(decl) {
                        if (decl instanceof AST_SymbolDeclaration) {
                            decl.init.forEach(function(init) {
                                var tw = new TreeWalker(function(node) {
                                    if (node instanceof AST_SymbolRef) {
                                        push_uniq(in_use, node.definition());
                                ***REMOVED***
                            ***REMOVED***);
                                init.walk(tw);
                        ***REMOVED***);
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***
                var tt = new TreeTransformer(function before(node, descend, in_list) {
                    if (node instanceof AST_Lambda) {
                        for (var a = node.argnames, i = a.length; --i >= 0; ) {
                            var sym = a[i];
                            if (sym.unreferenced()) {
                                a.pop();
                                compressor.warn("Dropping unused function argument {name***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", {
                                    name: sym.name,
                                    file: sym.start.file,
                                    line: sym.start.line,
                                    col: sym.start.col
                            ***REMOVED***);
                        ***REMOVED*** else break;
                    ***REMOVED***
                ***REMOVED***
                    if (node instanceof AST_Defun && node !== self) {
                        if (!member(node.name.definition(), in_use)) {
                            compressor.warn("Dropping unused function {name***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", {
                                name: node.name.name,
                                file: node.name.start.file,
                                line: node.name.start.line,
                                col: node.name.start.col
                        ***REMOVED***);
                            return make_node(AST_EmptyStatement, node);
                    ***REMOVED***
                        return node;
                ***REMOVED***
                    if (node instanceof AST_Definitions && !(tt.parent() instanceof AST_ForIn)) {
                        var def = node.definitions.filter(function(def) {
                            if (member(def.name.definition(), in_use)) return true;
                            var w = {
                                name: def.name.name,
                                file: def.name.start.file,
                                line: def.name.start.line,
                                col: def.name.start.col
                        ***REMOVED***;
                            if (def.value && def.value.has_side_effects()) {
                                def._unused_side_effects = true;
                                compressor.warn("Side effects in initialization of unused variable {name***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", w);
                                return true;
                        ***REMOVED***
                            compressor.warn("Dropping unused variable {name***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", w);
                            return false;
                    ***REMOVED***);
                        def = mergeSort(def, function(a, b) {
                            if (!a.value && b.value) return -1;
                            if (!b.value && a.value) return 1;
                            return 0;
                    ***REMOVED***);
                        var side_effects = [];
                        for (var i = 0; i < def.length; ) {
                            var x = def[i];
                            if (x._unused_side_effects) {
                                side_effects.push(x.value);
                                def.splice(i, 1);
                        ***REMOVED*** else {
                                if (side_effects.length > 0) {
                                    side_effects.push(x.value);
                                    x.value = AST_Seq.from_array(side_effects);
                                    side_effects = [];
                            ***REMOVED***
                                ++i;
                        ***REMOVED***
                    ***REMOVED***
                        if (side_effects.length > 0) {
                            side_effects = make_node(AST_BlockStatement, node, {
                                body: [ make_node(AST_SimpleStatement, node, {
                                    body: AST_Seq.from_array(side_effects)
                            ***REMOVED***) ]
                        ***REMOVED***);
                    ***REMOVED*** else {
                            side_effects = null;
                    ***REMOVED***
                        if (def.length == 0 && !side_effects) {
                            return make_node(AST_EmptyStatement, node);
                    ***REMOVED***
                        if (def.length == 0) {
                            return side_effects;
                    ***REMOVED***
                        node.definitions = def;
                        if (side_effects) {
                            side_effects.body.unshift(node);
                            node = side_effects;
                    ***REMOVED***
                        return node;
                ***REMOVED***
                    if (node instanceof AST_For && node.init instanceof AST_BlockStatement) {
                        descend(node, this);
                        var body = node.init.body.slice(0, -1);
                        node.init = node.init.body.slice(-1)[0].body;
                        body.push(node);
                        return in_list ? MAP.splice(body) : make_node(AST_BlockStatement, node, {
                            body: body
                    ***REMOVED***);
                ***REMOVED***
                    if (node instanceof AST_Scope && node !== self) return node;
            ***REMOVED***);
                self.transform(tt);
        ***REMOVED***
    ***REMOVED***);
        AST_Scope.DEFMETHOD("hoist_declarations", function(compressor) {
            var hoist_funs = compressor.option("hoist_funs");
            var hoist_vars = compressor.option("hoist_vars");
            var self = this;
            if (hoist_funs || hoist_vars) {
                var dirs = [];
                var hoisted = [];
                var vars = new Dictionary(), vars_found = 0, var_decl = 0;
                self.walk(new TreeWalker(function(node) {
                    if (node instanceof AST_Scope && node !== self) return true;
                    if (node instanceof AST_Var) {
                        ++var_decl;
                        return true;
                ***REMOVED***
            ***REMOVED***));
                hoist_vars = hoist_vars && var_decl > 1;
                var tt = new TreeTransformer(function before(node) {
                    if (node !== self) {
                        if (node instanceof AST_Directive) {
                            dirs.push(node);
                            return make_node(AST_EmptyStatement, node);
                    ***REMOVED***
                        if (node instanceof AST_Defun && hoist_funs) {
                            hoisted.push(node);
                            return make_node(AST_EmptyStatement, node);
                    ***REMOVED***
                        if (node instanceof AST_Var && hoist_vars) {
                            node.definitions.forEach(function(def) {
                                vars.set(def.name.name, def);
                                ++vars_found;
                        ***REMOVED***);
                            var seq = node.to_assignments();
                            var p = tt.parent();
                            if (p instanceof AST_ForIn && p.init === node) {
                                if (seq == null) return node.definitions[0].name;
                                return seq;
                        ***REMOVED***
                            if (p instanceof AST_For && p.init === node) {
                                return seq;
                        ***REMOVED***
                            if (!seq) return make_node(AST_EmptyStatement, node);
                            return make_node(AST_SimpleStatement, node, {
                                body: seq
                        ***REMOVED***);
                    ***REMOVED***
                        if (node instanceof AST_Scope) return node;
                ***REMOVED***
            ***REMOVED***);
                self = self.transform(tt);
                if (vars_found > 0) hoisted.unshift(make_node(AST_Var, self, {
                    definitions: vars.map(function(def) {
                        def = def.clone();
                        def.value = null;
                        return def;
                ***REMOVED***)
            ***REMOVED***));
                self.body = dirs.concat(hoisted, self.body);
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_SimpleStatement, function(self, compressor) {
            if (compressor.option("side_effects")) {
                if (!self.body.has_side_effects()) {
                    compressor.warn("Dropping side-effect-free statement [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.start);
                    return make_node(AST_EmptyStatement, self);
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_DWLoop, function(self, compressor) {
            var cond = self.condition.evaluate(compressor);
            self.condition = cond[0];
            if (!compressor.option("loops")) return self;
            if (cond.length > 1) {
                if (cond[1]) {
                    return make_node(AST_For, self, {
                        body: self.body
                ***REMOVED***);
            ***REMOVED*** else if (self instanceof AST_While) {
                    if (compressor.option("dead_code")) {
                        var a = [];
                        extract_declarations_from_unreachable_code(compressor, self.body, a);
                        return make_node(AST_BlockStatement, self, {
                            body: a
                    ***REMOVED***);
                ***REMOVED***
            ***REMOVED*** else {
                    return self.body;
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        function if_break_in_loop(self, compressor) {
            function drop_it(rest) {
                rest = as_statement_array(rest);
                if (self.body instanceof AST_BlockStatement) {
                    self.body = self.body.clone();
                    self.body.body = rest.concat(self.body.body.slice(1));
                    self.body = self.body.transform(compressor);
            ***REMOVED*** else {
                    self.body = make_node(AST_BlockStatement, self.body, {
                        body: rest
                ***REMOVED***).transform(compressor);
            ***REMOVED***
                if_break_in_loop(self, compressor);
        ***REMOVED***
            var first = self.body instanceof AST_BlockStatement ? self.body.body[0] : self.body;
            if (first instanceof AST_If) {
                if (first.body instanceof AST_Break && compressor.loopcontrol_target(first.body.label) === self) {
                    if (self.condition) {
                        self.condition = make_node(AST_Binary, self.condition, {
                            left: self.condition,
                            operator: "&&",
                            right: first.condition.negate(compressor)
                    ***REMOVED***);
                ***REMOVED*** else {
                        self.condition = first.condition.negate(compressor);
                ***REMOVED***
                    drop_it(first.alternative);
            ***REMOVED*** else if (first.alternative instanceof AST_Break && compressor.loopcontrol_target(first.alternative.label) === self) {
                    if (self.condition) {
                        self.condition = make_node(AST_Binary, self.condition, {
                            left: self.condition,
                            operator: "&&",
                            right: first.condition
                    ***REMOVED***);
                ***REMOVED*** else {
                        self.condition = first.condition;
                ***REMOVED***
                    drop_it(first.body);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
        OPT(AST_While, function(self, compressor) {
            if (!compressor.option("loops")) return self;
            self = AST_DWLoop.prototype.optimize.call(self, compressor);
            if (self instanceof AST_While) {
                if_break_in_loop(self, compressor);
                self = make_node(AST_For, self, self).transform(compressor);
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_For, function(self, compressor) {
            var cond = self.condition;
            if (cond) {
                cond = cond.evaluate(compressor);
                self.condition = cond[0];
        ***REMOVED***
            if (!compressor.option("loops")) return self;
            if (cond) {
                if (cond.length > 1 && !cond[1]) {
                    if (compressor.option("dead_code")) {
                        var a = [];
                        if (self.init instanceof AST_Statement) {
                            a.push(self.init);
                    ***REMOVED*** else if (self.init) {
                            a.push(make_node(AST_SimpleStatement, self.init, {
                                body: self.init
                        ***REMOVED***));
                    ***REMOVED***
                        extract_declarations_from_unreachable_code(compressor, self.body, a);
                        return make_node(AST_BlockStatement, self, {
                            body: a
                    ***REMOVED***);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            if_break_in_loop(self, compressor);
            return self;
    ***REMOVED***);
        OPT(AST_If, function(self, compressor) {
            if (!compressor.option("conditionals")) return self;
            var cond = self.condition.evaluate(compressor);
            self.condition = cond[0];
            if (cond.length > 1) {
                if (cond[1]) {
                    compressor.warn("Condition always true [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.condition.start);
                    if (compressor.option("dead_code")) {
                        var a = [];
                        if (self.alternative) {
                            extract_declarations_from_unreachable_code(compressor, self.alternative, a);
                    ***REMOVED***
                        a.push(self.body);
                        return make_node(AST_BlockStatement, self, {
                            body: a
                    ***REMOVED***).transform(compressor);
                ***REMOVED***
            ***REMOVED*** else {
                    compressor.warn("Condition always false [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.condition.start);
                    if (compressor.option("dead_code")) {
                        var a = [];
                        extract_declarations_from_unreachable_code(compressor, self.body, a);
                        if (self.alternative) a.push(self.alternative);
                        return make_node(AST_BlockStatement, self, {
                            body: a
                    ***REMOVED***).transform(compressor);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            if (is_empty(self.alternative)) self.alternative = null;
            var negated = self.condition.negate(compressor);
            var negated_is_best = best_of(self.condition, negated) === negated;
            if (self.alternative && negated_is_best) {
                negated_is_best = false;
                self.condition = negated;
                var tmp = self.body;
                self.body = self.alternative || make_node(AST_EmptyStatement);
                self.alternative = tmp;
        ***REMOVED***
            if (is_empty(self.body) && is_empty(self.alternative)) {
                return make_node(AST_SimpleStatement, self.condition, {
                    body: self.condition
            ***REMOVED***).transform(compressor);
        ***REMOVED***
            if (self.body instanceof AST_SimpleStatement && self.alternative instanceof AST_SimpleStatement) {
                return make_node(AST_SimpleStatement, self, {
                    body: make_node(AST_Conditional, self, {
                        condition: self.condition,
                        consequent: self.body.body,
                        alternative: self.alternative.body
                ***REMOVED***)
            ***REMOVED***).transform(compressor);
        ***REMOVED***
            if (is_empty(self.alternative) && self.body instanceof AST_SimpleStatement) {
                if (negated_is_best) return make_node(AST_SimpleStatement, self, {
                    body: make_node(AST_Binary, self, {
                        operator: "||",
                        left: negated,
                        right: self.body.body
                ***REMOVED***)
            ***REMOVED***).transform(compressor);
                return make_node(AST_SimpleStatement, self, {
                    body: make_node(AST_Binary, self, {
                        operator: "&&",
                        left: self.condition,
                        right: self.body.body
                ***REMOVED***)
            ***REMOVED***).transform(compressor);
        ***REMOVED***
            if (self.body instanceof AST_EmptyStatement && self.alternative && self.alternative instanceof AST_SimpleStatement) {
                return make_node(AST_SimpleStatement, self, {
                    body: make_node(AST_Binary, self, {
                        operator: "||",
                        left: self.condition,
                        right: self.alternative.body
                ***REMOVED***)
            ***REMOVED***).transform(compressor);
        ***REMOVED***
            if (self.body instanceof AST_Exit && self.alternative instanceof AST_Exit && self.body.TYPE == self.alternative.TYPE) {
                return make_node(self.body.CTOR, self, {
                    value: make_node(AST_Conditional, self, {
                        condition: self.condition,
                        consequent: self.body.value || make_node(AST_Undefined, self.body).optimize(compressor),
                        alternative: self.alternative.value || make_node(AST_Undefined, self.alternative).optimize(compressor)
                ***REMOVED***)
            ***REMOVED***).transform(compressor);
        ***REMOVED***
            if (self.body instanceof AST_If && !self.body.alternative && !self.alternative) {
                self.condition = make_node(AST_Binary, self.condition, {
                    operator: "&&",
                    left: self.condition,
                    right: self.body.condition
            ***REMOVED***).transform(compressor);
                self.body = self.body.body;
        ***REMOVED***
            if (aborts(self.body)) {
                if (self.alternative) {
                    var alt = self.alternative;
                    self.alternative = null;
                    return make_node(AST_BlockStatement, self, {
                        body: [ self, alt ]
                ***REMOVED***).transform(compressor);
            ***REMOVED***
        ***REMOVED***
            if (aborts(self.alternative)) {
                var body = self.body;
                self.body = self.alternative;
                self.condition = negated_is_best ? negated : self.condition.negate(compressor);
                self.alternative = null;
                return make_node(AST_BlockStatement, self, {
                    body: [ self, body ]
            ***REMOVED***).transform(compressor);
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Switch, function(self, compressor) {
            if (self.body.length == 0 && compressor.option("conditionals")) {
                return make_node(AST_SimpleStatement, self, {
                    body: self.expression
            ***REMOVED***).transform(compressor);
        ***REMOVED***
            var last_branch = self.body[self.body.length - 1];
            if (last_branch) {
                var stat = last_branch.body[last_branch.body.length - 1];
                if (stat instanceof AST_Break && loop_body(compressor.loopcontrol_target(stat.label)) === self) last_branch.body.pop();
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Case, function(self, compressor) {
            self.body = tighten_body(self.body, compressor);
            return self;
    ***REMOVED***);
        OPT(AST_Try, function(self, compressor) {
            self.body = tighten_body(self.body, compressor);
            return self;
    ***REMOVED***);
        AST_Definitions.DEFMETHOD("remove_initializers", function() {
            this.definitions.forEach(function(def) {
                def.value = null;
        ***REMOVED***);
    ***REMOVED***);
        AST_Definitions.DEFMETHOD("to_assignments", function() {
            var assignments = this.definitions.reduce(function(a, def) {
                if (def.value) {
                    var name = make_node(AST_SymbolRef, def.name, def.name);
                    a.push(make_node(AST_Assign, def, {
                        operator: "=",
                        left: name,
                        right: def.value
                ***REMOVED***));
            ***REMOVED***
                return a;
          ***REMOVED*** []);
            if (assignments.length == 0) return null;
            return AST_Seq.from_array(assignments);
    ***REMOVED***);
        OPT(AST_Definitions, function(self, compressor) {
            if (self.definitions.length == 0) return make_node(AST_EmptyStatement, self);
            return self;
    ***REMOVED***);
        OPT(AST_Function, function(self, compressor) {
            self = AST_Lambda.prototype.optimize.call(self, compressor);
            if (compressor.option("unused")) {
                if (self.name && self.name.unreferenced()) {
                    self.name = null;
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Call, function(self, compressor) {
            if (compressor.option("unsafe")) {
                var exp = self.expression;
                if (exp instanceof AST_SymbolRef && exp.undeclared()) {
                    switch (exp.name) {
                      case "Array":
                        if (self.args.length != 1) {
                            return make_node(AST_Array, self, {
                                elements: self.args
                        ***REMOVED***);
                    ***REMOVED***
                        break;

                      case "Object":
                        if (self.args.length == 0) {
                            return make_node(AST_Object, self, {
                                properties: []
                        ***REMOVED***);
                    ***REMOVED***
                        break;

                      case "String":
                        return make_node(AST_Binary, self, {
                            left: self.args[0],
                            operator: "+",
                            right: make_node(AST_String, self, {
                                value: ""
                        ***REMOVED***)
                    ***REMOVED***);
                ***REMOVED***
            ***REMOVED*** else if (exp instanceof AST_Dot && exp.property == "toString" && self.args.length == 0) {
                    return make_node(AST_Binary, self, {
                        left: make_node(AST_String, self, {
                            value: ""
                    ***REMOVED***),
                        operator: "+",
                        right: exp.expression
                ***REMOVED***).transform(compressor);
            ***REMOVED***
        ***REMOVED***
            if (compressor.option("side_effects")) {
                if (self.expression instanceof AST_Function && self.args.length == 0 && !AST_Block.prototype.has_side_effects.call(self.expression)) {
                    return make_node(AST_Undefined, self).transform(compressor);
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_New, function(self, compressor) {
            if (compressor.option("unsafe")) {
                var exp = self.expression;
                if (exp instanceof AST_SymbolRef && exp.undeclared()) {
                    switch (exp.name) {
                      case "Object":
                      case "RegExp":
                      case "Function":
                      case "Error":
                      case "Array":
                        return make_node(AST_Call, self, self);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Seq, function(self, compressor) {
            if (!compressor.option("side_effects")) return self;
            if (!self.car.has_side_effects()) return self.cdr;
            if (compressor.option("cascade")) {
                if (self.car instanceof AST_Assign && !self.car.left.has_side_effects() && self.car.left.equivalent_to(self.cdr)) {
                    return self.car;
            ***REMOVED***
                if (!self.car.has_side_effects() && !self.cdr.has_side_effects() && self.car.equivalent_to(self.cdr)) {
                    return self.car;
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        AST_Unary.DEFMETHOD("lift_sequences", function(compressor) {
            if (compressor.option("sequences")) {
                if (this.expression instanceof AST_Seq) {
                    var seq = this.expression;
                    var x = seq.to_array();
                    this.expression = x.pop();
                    x.push(this);
                    seq = AST_Seq.from_array(x).transform(compressor);
                    return seq;
            ***REMOVED***
        ***REMOVED***
            return this;
    ***REMOVED***);
        OPT(AST_UnaryPostfix, function(self, compressor) {
            return self.lift_sequences(compressor);
    ***REMOVED***);
        OPT(AST_UnaryPrefix, function(self, compressor) {
            self = self.lift_sequences(compressor);
            var e = self.expression;
            if (compressor.option("booleans") && compressor.in_boolean_context()) {
                switch (self.operator) {
                  case "!":
                    if (e instanceof AST_UnaryPrefix && e.operator == "!") {
                        return e.expression;
                ***REMOVED***
                    break;

                  case "typeof":
                    compressor.warn("Boolean expression always true [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.start);
                    return make_node(AST_True, self);
            ***REMOVED***
                if (e instanceof AST_Binary && self.operator == "!") {
                    self = best_of(self, e.negate(compressor));
            ***REMOVED***
        ***REMOVED***
            return self.evaluate(compressor)[0];
    ***REMOVED***);
        AST_Binary.DEFMETHOD("lift_sequences", function(compressor) {
            if (compressor.option("sequences")) {
                if (this.left instanceof AST_Seq) {
                    var seq = this.left;
                    var x = seq.to_array();
                    this.left = x.pop();
                    x.push(this);
                    seq = AST_Seq.from_array(x).transform(compressor);
                    return seq;
            ***REMOVED***
                if (this.right instanceof AST_Seq && !(this.operator == "||" || this.operator == "&&") && !this.left.has_side_effects()) {
                    var seq = this.right;
                    var x = seq.to_array();
                    this.right = x.pop();
                    x.push(this);
                    seq = AST_Seq.from_array(x).transform(compressor);
                    return seq;
            ***REMOVED***
        ***REMOVED***
            return this;
    ***REMOVED***);
        var commutativeOperators = makePredicate("== === != !== * & | ^");
        OPT(AST_Binary, function(self, compressor) {
            function reverse(op) {
                if (op) self.operator = op;
                var tmp = self.left;
                self.left = self.right;
                self.right = tmp;
        ***REMOVED***
            if (commutativeOperators(self.operator)) {
                if (self.right instanceof AST_Constant && !(self.left instanceof AST_Constant)) {
                    reverse();
            ***REMOVED***
        ***REMOVED***
            self = self.lift_sequences(compressor);
            if (compressor.option("comparisons")) switch (self.operator) {
              case "===":
              case "!==":
                if (self.left.is_string() && self.right.is_string() || self.left.is_boolean() && self.right.is_boolean()) {
                    self.operator = self.operator.substr(0, 2);
            ***REMOVED***

              case "==":
              case "!=":
                if (self.left instanceof AST_String && self.left.value == "undefined" && self.right instanceof AST_UnaryPrefix && self.right.operator == "typeof") {
                    if (!(self.right.expression instanceof AST_SymbolRef) || !self.right.expression.undeclared()) {
                        self.left = self.right.expression;
                        self.right = make_node(AST_Undefined, self.left).optimize(compressor);
                        if (self.operator.length == 2) self.operator += "=";
                ***REMOVED***
            ***REMOVED***
                break;
        ***REMOVED***
            if (compressor.option("booleans") && compressor.in_boolean_context()) switch (self.operator) {
              case "&&":
                var ll = self.left.evaluate(compressor);
                var rr = self.right.evaluate(compressor);
                if (ll.length > 1 && !ll[1] || rr.length > 1 && !rr[1]) {
                    compressor.warn("Boolean && always false [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.start);
                    return make_node(AST_False, self);
            ***REMOVED***
                if (ll.length > 1 && ll[1]) {
                    return rr[0];
            ***REMOVED***
                if (rr.length > 1 && rr[1]) {
                    return ll[0];
            ***REMOVED***
                break;

              case "||":
                var ll = self.left.evaluate(compressor);
                var rr = self.right.evaluate(compressor);
                if (ll.length > 1 && ll[1] || rr.length > 1 && rr[1]) {
                    compressor.warn("Boolean || always true [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.start);
                    return make_node(AST_True, self);
            ***REMOVED***
                if (ll.length > 1 && !ll[1]) {
                    return rr[0];
            ***REMOVED***
                if (rr.length > 1 && !rr[1]) {
                    return ll[0];
            ***REMOVED***
                break;

              case "+":
                var ll = self.left.evaluate(compressor);
                var rr = self.right.evaluate(compressor);
                if (ll.length > 1 && ll[0] instanceof AST_String && ll[1] || rr.length > 1 && rr[0] instanceof AST_String && rr[1]) {
                    compressor.warn("+ in boolean context always true [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.start);
                    return make_node(AST_True, self);
            ***REMOVED***
                break;
        ***REMOVED***
            var exp = self.evaluate(compressor);
            if (exp.length > 1) {
                if (best_of(exp[0], self) !== self) return exp[0];
        ***REMOVED***
            if (compressor.option("comparisons")) {
                if (!(compressor.parent() instanceof AST_Binary) || compressor.parent() instanceof AST_Assign) {
                    var negated = make_node(AST_UnaryPrefix, self, {
                        operator: "!",
                        expression: self.negate(compressor)
                ***REMOVED***);
                    self = best_of(self, negated);
            ***REMOVED***
                switch (self.operator) {
                  case "<":
                    reverse(">");
                    break;

                  case "<=":
                    reverse(">=");
                    break;
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_SymbolRef, function(self, compressor) {
            if (self.undeclared()) {
                var defines = compressor.option("global_defs");
                if (defines && defines.hasOwnProperty(self.name)) {
                    return make_node_from_constant(compressor, defines[self.name], self);
            ***REMOVED***
                switch (self.name) {
                  case "undefined":
                    return make_node(AST_Undefined, self);

                  case "NaN":
                    return make_node(AST_NaN, self);

                  case "Infinity":
                    return make_node(AST_Infinity, self);
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Undefined, function(self, compressor) {
            if (compressor.option("unsafe")) {
                var scope = compressor.find_parent(AST_Scope);
                var undef = scope.find_variable("undefined");
                if (undef) {
                    var ref = make_node(AST_SymbolRef, self, {
                        name: "undefined",
                        scope: scope,
                        thedef: undef
                ***REMOVED***);
                    ref.reference();
                    return ref;
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        var ASSIGN_OPS = [ "+", "-", "/", "*", "%", ">>", "<<", ">>>", "|", "^", "&" ];
        OPT(AST_Assign, function(self, compressor) {
            self = self.lift_sequences(compressor);
            if (self.operator == "=" && self.left instanceof AST_SymbolRef && self.right instanceof AST_Binary && self.right.left instanceof AST_SymbolRef && self.right.left.name == self.left.name && member(self.right.operator, ASSIGN_OPS)) {
                self.operator = self.right.operator + "=";
                self.right = self.right.right;
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Conditional, function(self, compressor) {
            if (!compressor.option("conditionals")) return self;
            if (self.condition instanceof AST_Seq) {
                var car = self.condition.car;
                self.condition = self.condition.cdr;
                return AST_Seq.cons(car, self);
        ***REMOVED***
            var cond = self.condition.evaluate(compressor);
            if (cond.length > 1) {
                if (cond[1]) {
                    compressor.warn("Condition always true [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.start);
                    return self.consequent;
            ***REMOVED*** else {
                    compressor.warn("Condition always false [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", self.start);
                    return self.alternative;
            ***REMOVED***
        ***REMOVED***
            var negated = cond[0].negate(compressor);
            if (best_of(cond[0], negated) === negated) {
                self = make_node(AST_Conditional, self, {
                    condition: negated,
                    consequent: self.alternative,
                    alternative: self.consequent
            ***REMOVED***);
        ***REMOVED***
            var consequent = self.consequent;
            var alternative = self.alternative;
            if (consequent instanceof AST_Assign && alternative instanceof AST_Assign && consequent.operator == alternative.operator && consequent.left.equivalent_to(alternative.left)) {
                self = make_node(AST_Assign, self, {
                    operator: consequent.operator,
                    left: consequent.left,
                    right: make_node(AST_Conditional, self, {
                        condition: self.condition,
                        consequent: consequent.right,
                        alternative: alternative.right
                ***REMOVED***)
            ***REMOVED***);
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Boolean, function(self, compressor) {
            if (compressor.option("booleans")) {
                var p = compressor.parent();
                if (p instanceof AST_Binary && (p.operator == "==" || p.operator == "!=")) {
                    compressor.warn("Non-strict equality against boolean: {operator***REMOVED*** {value***REMOVED*** [{file***REMOVED***:{line***REMOVED***,{col***REMOVED***]", {
                        operator: p.operator,
                        value: self.value,
                        file: p.start.file,
                        line: p.start.line,
                        col: p.start.col
                ***REMOVED***);
                    return make_node(AST_Number, self, {
                        value: +self.value
                ***REMOVED***);
            ***REMOVED***
                return make_node(AST_UnaryPrefix, self, {
                    operator: "!",
                    expression: make_node(AST_Number, self, {
                        value: 1 - self.value
                ***REMOVED***)
            ***REMOVED***);
        ***REMOVED***
            return self;
    ***REMOVED***);
        OPT(AST_Sub, function(self, compressor) {
            var prop = self.property;
            if (prop instanceof AST_String && compressor.option("properties")) {
                prop = prop.getValue();
                if (is_identifier(prop)) {
                    return make_node(AST_Dot, self, {
                        expression: self.expression,
                        property: prop
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***
            return self;
    ***REMOVED***);
        function literals_in_boolean_context(self, compressor) {
            if (compressor.option("booleans") && compressor.in_boolean_context()) {
                return make_node(AST_True, self);
        ***REMOVED***
            return self;
    ***REMOVED***
        OPT(AST_Array, literals_in_boolean_context);
        OPT(AST_Object, literals_in_boolean_context);
        OPT(AST_RegExp, literals_in_boolean_context);
***REMOVED***)();
    "use strict";
    function SourceMap(options) {
        options = defaults(options, {
            file: null,
            root: null,
            orig: null
    ***REMOVED***);
        var generator = new MOZ_SourceMap.SourceMapGenerator({
            file: options.file,
            sourceRoot: options.root
    ***REMOVED***);
        var orig_map = options.orig && new MOZ_SourceMap.SourceMapConsumer(options.orig);
        function add(source, gen_line, gen_col, orig_line, orig_col, name) {
            if (orig_map) {
                var info = orig_map.originalPositionFor({
                    line: orig_line,
                    column: orig_col
            ***REMOVED***);
                source = info.source;
                orig_line = info.line;
                orig_col = info.column;
                name = info.name;
        ***REMOVED***
            generator.addMapping({
                generated: {
                    line: gen_line,
                    column: gen_col
              ***REMOVED***
                original: {
                    line: orig_line,
                    column: orig_col
              ***REMOVED***
                source: source,
                name: name
        ***REMOVED***);
    ***REMOVED***
        return {
            add: add,
            get: function() {
                return generator;
          ***REMOVED***
            toString: function() {
                return generator.toString();
        ***REMOVED***
    ***REMOVED***;
***REMOVED***
    "use strict";
    (function() {
        var MOZ_TO_ME = {
            TryStatement: function(M) {
                return new AST_Try({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    body: from_moz(M.block).body,
                    bcatch: from_moz(M.handlers[0]),
                    bfinally: M.finalizer ? new AST_Finally(from_moz(M.finalizer)) : null
            ***REMOVED***);
          ***REMOVED***
            CatchClause: function(M) {
                return new AST_Catch({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    argname: from_moz(M.param),
                    body: from_moz(M.body).body
            ***REMOVED***);
          ***REMOVED***
            ObjectExpression: function(M) {
                return new AST_Object({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    properties: M.properties.map(function(prop) {
                        var key = prop.key;
                        var name = key.type == "Identifier" ? key.name : key.value;
                        var args = {
                            start: my_start_token(key),
                            end: my_end_token(prop.value),
                            key: name,
                            value: from_moz(prop.value)
                    ***REMOVED***;
                        switch (prop.kind) {
                          case "init":
                            return new AST_ObjectKeyVal(args);

                          case "set":
                            args.value.name = from_moz(key);
                            return new AST_ObjectSetter(args);

                          case "get":
                            args.value.name = from_moz(key);
                            return new AST_ObjectGetter(args);
                    ***REMOVED***
                ***REMOVED***)
            ***REMOVED***);
          ***REMOVED***
            SequenceExpression: function(M) {
                return AST_Seq.from_array(M.expressions.map(from_moz));
          ***REMOVED***
            MemberExpression: function(M) {
                return new (M.computed ? AST_Sub : AST_Dot)({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    property: M.computed ? from_moz(M.property) : M.property.name,
                    expression: from_moz(M.object)
            ***REMOVED***);
          ***REMOVED***
            SwitchCase: function(M) {
                return new (M.test ? AST_Case : AST_Default)({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    expression: from_moz(M.test),
                    body: M.consequent.map(from_moz)
            ***REMOVED***);
          ***REMOVED***
            Literal: function(M) {
                var val = M.value, args = {
                    start: my_start_token(M),
                    end: my_end_token(M)
            ***REMOVED***;
                if (val === null) return new AST_Null(args);
                switch (typeof val) {
                  case "string":
                    args.value = val;
                    return new AST_String(args);

                  case "number":
                    args.value = val;
                    return new AST_Number(args);

                  case "boolean":
                    return new (val ? AST_True : AST_False)(args);

                  default:
                    args.value = val;
                    return new AST_RegExp(args);
            ***REMOVED***
          ***REMOVED***
            UnaryExpression: From_Moz_Unary,
            UpdateExpression: From_Moz_Unary,
            Identifier: function(M) {
                var p = FROM_MOZ_STACK[FROM_MOZ_STACK.length - 2];
                return new (M.name == "this" ? AST_This : p.type == "LabeledStatement" ? AST_Label : p.type == "VariableDeclarator" && p.id === M ? p.kind == "const" ? AST_SymbolConst : AST_SymbolVar : p.type == "FunctionExpression" ? p.id === M ? AST_SymbolLambda : AST_SymbolFunarg : p.type == "FunctionDeclaration" ? p.id === M ? AST_SymbolDefun : AST_SymbolFunarg : p.type == "CatchClause" ? AST_SymbolCatch : p.type == "BreakStatement" || p.type == "ContinueStatement" ? AST_LabelRef : AST_SymbolRef)({
                    start: my_start_token(M),
                    end: my_end_token(M),
                    name: M.name
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
        function From_Moz_Unary(M) {
            return new (M.prefix ? AST_UnaryPrefix : AST_UnaryPostfix)({
                start: my_start_token(M),
                end: my_end_token(M),
                operator: M.operator,
                expression: from_moz(M.argument)
        ***REMOVED***);
    ***REMOVED***
        var ME_TO_MOZ = {***REMOVED***;
        map("Node", AST_Node);
        map("Program", AST_Toplevel, "body@body");
        map("Function", AST_Function, "id>name, params@argnames, body%body");
        map("EmptyStatement", AST_EmptyStatement);
        map("BlockStatement", AST_BlockStatement, "body@body");
        map("ExpressionStatement", AST_SimpleStatement, "expression>body");
        map("IfStatement", AST_If, "test>condition, consequent>body, alternate>alternative");
        map("LabeledStatement", AST_LabeledStatement, "label>label, body>body");
        map("BreakStatement", AST_Break, "label>label");
        map("ContinueStatement", AST_Continue, "label>label");
        map("WithStatement", AST_With, "object>expression, body>body");
        map("SwitchStatement", AST_Switch, "discriminant>expression, cases@body");
        map("ReturnStatement", AST_Return, "argument>value");
        map("ThrowStatement", AST_Throw, "argument>value");
        map("WhileStatement", AST_While, "test>condition, body>body");
        map("DoWhileStatement", AST_Do, "test>condition, body>body");
        map("ForStatement", AST_For, "init>init, test>condition, update>step, body>body");
        map("ForInStatement", AST_ForIn, "left>init, right>object, body>body");
        map("DebuggerStatement", AST_Debugger);
        map("FunctionDeclaration", AST_Defun, "id>name, params@argnames, body%body");
        map("VariableDeclaration", AST_Var, "declarations@definitions");
        map("VariableDeclarator", AST_VarDef, "id>name, init>value");
        map("ThisExpression", AST_This);
        map("ArrayExpression", AST_Array, "elements@elements");
        map("FunctionExpression", AST_Function, "id>name, params@argnames, body%body");
        map("BinaryExpression", AST_Binary, "operator=operator, left>left, right>right");
        map("AssignmentExpression", AST_Assign, "operator=operator, left>left, right>right");
        map("LogicalExpression", AST_Binary, "operator=operator, left>left, right>right");
        map("ConditionalExpression", AST_Conditional, "test>condition, consequent>consequent, alternate>alternative");
        map("NewExpression", AST_New, "callee>expression, arguments@args");
        map("CallExpression", AST_Call, "callee>expression, arguments@args");
        function my_start_token(moznode) {
            return new AST_Token({
                file: moznode.loc && moznode.loc.source,
                line: moznode.loc && moznode.loc.start.line,
                col: moznode.loc && moznode.loc.start.column,
                pos: moznode.start,
                endpos: moznode.start
        ***REMOVED***);
    ***REMOVED***
        function my_end_token(moznode) {
            return new AST_Token({
                file: moznode.loc && moznode.loc.source,
                line: moznode.loc && moznode.loc.end.line,
                col: moznode.loc && moznode.loc.end.column,
                pos: moznode.end,
                endpos: moznode.end
        ***REMOVED***);
    ***REMOVED***
        function map(moztype, mytype, propmap) {
            var moz_to_me = "function From_Moz_" + moztype + "(M){\n";
            moz_to_me += "return new mytype({\n" + "start: my_start_token(M),\n" + "end: my_end_token(M)";
            if (propmap) propmap.split(/\s*,\s*/).forEach(function(prop) {
                var m = /([a-z0-9$_]+)(=|@|>|%)([a-z0-9$_]+)/i.exec(prop);
                if (!m) throw new Error("Can't understand property map: " + prop);
                var moz = "M." + m[1], how = m[2], my = m[3];
                moz_to_me += ",\n" + my + ": ";
                if (how == "@") {
                    moz_to_me += moz + ".map(from_moz)";
            ***REMOVED*** else if (how == ">") {
                    moz_to_me += "from_moz(" + moz + ")";
            ***REMOVED*** else if (how == "=") {
                    moz_to_me += moz;
            ***REMOVED*** else if (how == "%") {
                    moz_to_me += "from_moz(" + moz + ").body";
            ***REMOVED*** else throw new Error("Can't understand operator in propmap: " + prop);
        ***REMOVED***);
            moz_to_me += "\n***REMOVED***)***REMOVED***";
            moz_to_me = new Function("mytype", "my_start_token", "my_end_token", "from_moz", "return(" + moz_to_me + ")")(mytype, my_start_token, my_end_token, from_moz);
            return MOZ_TO_ME[moztype] = moz_to_me;
    ***REMOVED***
        var FROM_MOZ_STACK = null;
        function from_moz(node) {
            FROM_MOZ_STACK.push(node);
            var ret = node != null ? MOZ_TO_ME[node.type](node) : null;
            FROM_MOZ_STACK.pop();
            return ret;
    ***REMOVED***
        AST_Node.from_mozilla_ast = function(node) {
            var save_stack = FROM_MOZ_STACK;
            FROM_MOZ_STACK = [];
            var ast = from_moz(node);
            FROM_MOZ_STACK = save_stack;
            return ast;
    ***REMOVED***;
***REMOVED***)();
    exports["array_to_hash"] = array_to_hash;
    exports["slice"] = slice;
    exports["characters"] = characters;
    exports["member"] = member;
    exports["find_if"] = find_if;
    exports["repeat_string"] = repeat_string;
    exports["DefaultsError"] = DefaultsError;
    exports["defaults"] = defaults;
    exports["merge"] = merge;
    exports["noop"] = noop;
    exports["MAP"] = MAP;
    exports["push_uniq"] = push_uniq;
    exports["string_template"] = string_template;
    exports["remove"] = remove;
    exports["mergeSort"] = mergeSort;
    exports["set_difference"] = set_difference;
    exports["set_intersection"] = set_intersection;
    exports["makePredicate"] = makePredicate;
    exports["Dictionary"] = Dictionary;
    exports["DEFNODE"] = DEFNODE;
    exports["AST_Token"] = AST_Token;
    exports["AST_Node"] = AST_Node;
    exports["AST_Statement"] = AST_Statement;
    exports["AST_Debugger"] = AST_Debugger;
    exports["AST_Directive"] = AST_Directive;
    exports["AST_SimpleStatement"] = AST_SimpleStatement;
    exports["walk_body"] = walk_body;
    exports["AST_Block"] = AST_Block;
    exports["AST_BlockStatement"] = AST_BlockStatement;
    exports["AST_EmptyStatement"] = AST_EmptyStatement;
    exports["AST_StatementWithBody"] = AST_StatementWithBody;
    exports["AST_LabeledStatement"] = AST_LabeledStatement;
    exports["AST_DWLoop"] = AST_DWLoop;
    exports["AST_Do"] = AST_Do;
    exports["AST_While"] = AST_While;
    exports["AST_For"] = AST_For;
    exports["AST_ForIn"] = AST_ForIn;
    exports["AST_With"] = AST_With;
    exports["AST_Scope"] = AST_Scope;
    exports["AST_Toplevel"] = AST_Toplevel;
    exports["AST_Lambda"] = AST_Lambda;
    exports["AST_Accessor"] = AST_Accessor;
    exports["AST_Function"] = AST_Function;
    exports["AST_Defun"] = AST_Defun;
    exports["AST_Jump"] = AST_Jump;
    exports["AST_Exit"] = AST_Exit;
    exports["AST_Return"] = AST_Return;
    exports["AST_Throw"] = AST_Throw;
    exports["AST_LoopControl"] = AST_LoopControl;
    exports["AST_Break"] = AST_Break;
    exports["AST_Continue"] = AST_Continue;
    exports["AST_If"] = AST_If;
    exports["AST_Switch"] = AST_Switch;
    exports["AST_SwitchBranch"] = AST_SwitchBranch;
    exports["AST_Default"] = AST_Default;
    exports["AST_Case"] = AST_Case;
    exports["AST_Try"] = AST_Try;
    exports["AST_Catch"] = AST_Catch;
    exports["AST_Finally"] = AST_Finally;
    exports["AST_Definitions"] = AST_Definitions;
    exports["AST_Var"] = AST_Var;
    exports["AST_Const"] = AST_Const;
    exports["AST_VarDef"] = AST_VarDef;
    exports["AST_Call"] = AST_Call;
    exports["AST_New"] = AST_New;
    exports["AST_Seq"] = AST_Seq;
    exports["AST_PropAccess"] = AST_PropAccess;
    exports["AST_Dot"] = AST_Dot;
    exports["AST_Sub"] = AST_Sub;
    exports["AST_Unary"] = AST_Unary;
    exports["AST_UnaryPrefix"] = AST_UnaryPrefix;
    exports["AST_UnaryPostfix"] = AST_UnaryPostfix;
    exports["AST_Binary"] = AST_Binary;
    exports["AST_Conditional"] = AST_Conditional;
    exports["AST_Assign"] = AST_Assign;
    exports["AST_Array"] = AST_Array;
    exports["AST_Object"] = AST_Object;
    exports["AST_ObjectProperty"] = AST_ObjectProperty;
    exports["AST_ObjectKeyVal"] = AST_ObjectKeyVal;
    exports["AST_ObjectSetter"] = AST_ObjectSetter;
    exports["AST_ObjectGetter"] = AST_ObjectGetter;
    exports["AST_Symbol"] = AST_Symbol;
    exports["AST_SymbolAccessor"] = AST_SymbolAccessor;
    exports["AST_SymbolDeclaration"] = AST_SymbolDeclaration;
    exports["AST_SymbolVar"] = AST_SymbolVar;
    exports["AST_SymbolConst"] = AST_SymbolConst;
    exports["AST_SymbolFunarg"] = AST_SymbolFunarg;
    exports["AST_SymbolDefun"] = AST_SymbolDefun;
    exports["AST_SymbolLambda"] = AST_SymbolLambda;
    exports["AST_SymbolCatch"] = AST_SymbolCatch;
    exports["AST_Label"] = AST_Label;
    exports["AST_SymbolRef"] = AST_SymbolRef;
    exports["AST_LabelRef"] = AST_LabelRef;
    exports["AST_This"] = AST_This;
    exports["AST_Constant"] = AST_Constant;
    exports["AST_String"] = AST_String;
    exports["AST_Number"] = AST_Number;
    exports["AST_RegExp"] = AST_RegExp;
    exports["AST_Atom"] = AST_Atom;
    exports["AST_Null"] = AST_Null;
    exports["AST_NaN"] = AST_NaN;
    exports["AST_Undefined"] = AST_Undefined;
    exports["AST_Infinity"] = AST_Infinity;
    exports["AST_Boolean"] = AST_Boolean;
    exports["AST_False"] = AST_False;
    exports["AST_True"] = AST_True;
    exports["TreeWalker"] = TreeWalker;
    exports["KEYWORDS"] = KEYWORDS;
    exports["KEYWORDS_ATOM"] = KEYWORDS_ATOM;
    exports["RESERVED_WORDS"] = RESERVED_WORDS;
    exports["KEYWORDS_BEFORE_EXPRESSION"] = KEYWORDS_BEFORE_EXPRESSION;
    exports["OPERATOR_CHARS"] = OPERATOR_CHARS;
    exports["RE_HEX_NUMBER"] = RE_HEX_NUMBER;
    exports["RE_OCT_NUMBER"] = RE_OCT_NUMBER;
    exports["RE_DEC_NUMBER"] = RE_DEC_NUMBER;
    exports["OPERATORS"] = OPERATORS;
    exports["WHITESPACE_CHARS"] = WHITESPACE_CHARS;
    exports["PUNC_BEFORE_EXPRESSION"] = PUNC_BEFORE_EXPRESSION;
    exports["PUNC_CHARS"] = PUNC_CHARS;
    exports["REGEXP_MODIFIERS"] = REGEXP_MODIFIERS;
    exports["UNICODE"] = UNICODE;
    exports["is_letter"] = is_letter;
    exports["is_digit"] = is_digit;
    exports["is_alphanumeric_char"] = is_alphanumeric_char;
    exports["is_unicode_combining_mark"] = is_unicode_combining_mark;
    exports["is_unicode_connector_punctuation"] = is_unicode_connector_punctuation;
    exports["is_identifier"] = is_identifier;
    exports["is_identifier_start"] = is_identifier_start;
    exports["is_identifier_char"] = is_identifier_char;
    exports["parse_js_number"] = parse_js_number;
    exports["JS_Parse_Error"] = JS_Parse_Error;
    exports["js_error"] = js_error;
    exports["is_token"] = is_token;
    exports["EX_EOF"] = EX_EOF;
    exports["tokenizer"] = tokenizer;
    exports["UNARY_PREFIX"] = UNARY_PREFIX;
    exports["UNARY_POSTFIX"] = UNARY_POSTFIX;
    exports["ASSIGNMENT"] = ASSIGNMENT;
    exports["PRECEDENCE"] = PRECEDENCE;
    exports["STATEMENTS_WITH_LABELS"] = STATEMENTS_WITH_LABELS;
    exports["ATOMIC_START_TOKEN"] = ATOMIC_START_TOKEN;
    exports["parse"] = parse;
    exports["TreeTransformer"] = TreeTransformer;
    exports["SymbolDef"] = SymbolDef;
    exports["base54"] = base54;
    exports["OutputStream"] = OutputStream;
    exports["Compressor"] = Compressor;
    exports["SourceMap"] = SourceMap;
***REMOVED***)({***REMOVED***, function() {
    return exports;
***REMOVED***());

var UglifyJS = exports.UglifyJS;

UglifyJS.AST_Node.warn_function = function(txt) {
    logger.error("uglifyjs2 WARN: " + txt);
***REMOVED***;

//JRB: MODIFIED FROM UGLIFY SOURCE
//to take a name for the file, and then set toplevel.filename to be that name.
exports.minify = function(files, options, name) {
    options = UglifyJS.defaults(options, {
        outSourceMap : null,
        sourceRoot   : null,
        inSourceMap  : null,
        fromString   : false,
        warnings     : false,
***REMOVED***);
    if (typeof files == "string")
        files = [ files ];

    // 1. parse
    var toplevel = null;
    files.forEach(function(file){
        var code = options.fromString
            ? file
            : fs.readFileSync(file, "utf8");
        toplevel = UglifyJS.parse(code, {
            filename: options.fromString ? name : file,
            toplevel: toplevel
    ***REMOVED***);
***REMOVED***);

    // 2. compress
    toplevel.figure_out_scope();
    var sq = UglifyJS.Compressor({
        warnings: options.warnings,
***REMOVED***);
    toplevel = toplevel.transform(sq);

    // 3. mangle
    toplevel.figure_out_scope();
    toplevel.compute_char_frequency();
    toplevel.mangle_names();

    // 4. output
    var map = null;
    var inMap = null;
    if (options.inSourceMap) {
        inMap = fs.readFileSync(options.inSourceMap, "utf8");
***REMOVED***
    if (options.outSourceMap) map = UglifyJS.SourceMap({
        file: options.outSourceMap,
        orig: inMap,
        root: options.sourceRoot
***REMOVED***);
    var stream = UglifyJS.OutputStream({ source_map: map ***REMOVED***);
    toplevel.print(stream);
    return {
        code : stream + "",
        map  : map + ""
***REMOVED***;
***REMOVED***;

// exports.describe_ast = function() {
//     function doitem(ctor) {
//         var sub = {***REMOVED***;
//         ctor.SUBCLASSES.forEach(function(ctor){
//             sub[ctor.TYPE] = doitem(ctor);
//     ***REMOVED***);
//         var ret = {***REMOVED***;
//         if (ctor.SELF_PROPS.length > 0) ret.props = ctor.SELF_PROPS;
//         if (ctor.SUBCLASSES.length > 0) ret.sub = sub;
//         return ret;
// ***REMOVED***
//     return doitem(UglifyJS.AST_Node).sub;
// ***REMOVED***

exports.describe_ast = function() {
    var out = UglifyJS.OutputStream({ beautify: true ***REMOVED***);
    function doitem(ctor) {
        out.print("AST_" + ctor.TYPE);
        var props = ctor.SELF_PROPS.filter(function(prop){
            return !/^\$/.test(prop);
    ***REMOVED***);
        if (props.length > 0) {
            out.space();
            out.with_parens(function(){
                props.forEach(function(prop, i){
                    if (i) out.space();
                    out.print(prop);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
        if (ctor.documentation) {
            out.space();
            out.print_string(ctor.documentation);
    ***REMOVED***
        if (ctor.SUBCLASSES.length > 0) {
            out.space();
            out.with_block(function(){
                ctor.SUBCLASSES.forEach(function(ctor, i){
                    out.indent();
                    doitem(ctor);
                    out.newline();
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***;
    doitem(UglifyJS.AST_Node);
    return out + "";
***REMOVED***;

***REMOVED***);
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint plusplus: true */
/*global define: false */

define('parse', ['./esprima'], function (esprima) {
    'use strict';

    var ostring = Object.prototype.toString,
        //This string is saved off because JSLint complains
        //about obj.arguments use, as 'reserved word'
        argPropName = 'arguments';

    //From an esprima example for traversing its ast.
    function traverse(object, visitor) {
        var key, child;

        if (!object) {
            return;
    ***REMOVED***

        if (visitor.call(null, object) === false) {
            return false;
    ***REMOVED***
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    if (traverse(child, visitor) === false) {
                        return false;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***


    /**
     * Pulls out dependencies from an array literal with just string members.
     * If string literals, will just return those string values in an array,
     * skipping other items in the array.
     *
     * @param {Node***REMOVED*** node an AST node.
     *
     * @returns {Array***REMOVED*** an array of strings.
     * If null is returned, then it means the input node was not a valid
     * dependency.
     */
    function getValidDeps(node) {
        if (!node || node.type !== 'ArrayExpression' || !node.elements) {
            return;
    ***REMOVED***

        var deps = [];

        node.elements.some(function (elem) {
            if (elem.type === 'Literal') {
                deps.push(elem.value);
        ***REMOVED***
    ***REMOVED***);

        return deps.length ? deps : undefined;
***REMOVED***

    /**
     * Main parse function. Returns a string of any valid require or
     * define/require.def calls as part of one JavaScript source string.
     * @param {String***REMOVED*** moduleName the module name that represents this file.
     * It is used to create a default define if there is not one already for the
     * file. This allows properly tracing dependencies for builds. Otherwise, if
     * the file just has a require() call, the file dependencies will not be
     * properly reflected: the file will come before its dependencies.
     * @param {String***REMOVED*** moduleName
     * @param {String***REMOVED*** fileName
     * @param {String***REMOVED*** fileContents
     * @param {Object***REMOVED*** options optional options. insertNeedsDefine: true will
     * add calls to require.needsDefine() if appropriate.
     * @returns {String***REMOVED*** JS source string or null, if no require or
     * define/require.def calls are found.
     */
    function parse(moduleName, fileName, fileContents, options) {
        options = options || {***REMOVED***;

        //Set up source input
        var i, moduleCall, depString,
            moduleDeps = [],
            result = '',
            moduleList = [],
            needsDefine = true,
            astRoot = esprima.parse(fileContents);

        parse.recurse(astRoot, function (callName, config, name, deps) {
            if (!deps) {
                deps = [];
        ***REMOVED***

            if (callName === 'define' && (!name || name === moduleName)) {
                needsDefine = false;
        ***REMOVED***

            if (!name) {
                //If there is no module name, the dependencies are for
                //this file/default module name.
                moduleDeps = moduleDeps.concat(deps);
        ***REMOVED*** else {
                moduleList.push({
                    name: name,
                    deps: deps
            ***REMOVED***);
        ***REMOVED***

            //If define was found, no need to dive deeper, unless
            //the config explicitly wants to dig deeper.
            return !!options.findNestedDependencies;
      ***REMOVED*** options);

        if (options.insertNeedsDefine && needsDefine) {
            result += 'require.needsDefine("' + moduleName + '");';
    ***REMOVED***

        if (moduleDeps.length || moduleList.length) {
            for (i = 0; i < moduleList.length; i++) {
                moduleCall = moduleList[i];
                if (result) {
                    result += '\n';
            ***REMOVED***

                //If this is the main module for this file, combine any
                //"anonymous" dependencies (could come from a nested require
                //call) with this module.
                if (moduleCall.name === moduleName) {
                    moduleCall.deps = moduleCall.deps.concat(moduleDeps);
                    moduleDeps = [];
            ***REMOVED***

                depString = moduleCall.deps.length ? '["' +
                            moduleCall.deps.join('","') + '"]' : '[]';
                result += 'define("' + moduleCall.name + '",' +
                          depString + ');';
        ***REMOVED***
            if (moduleDeps.length) {
                if (result) {
                    result += '\n';
            ***REMOVED***
                depString = moduleDeps.length ? '["' + moduleDeps.join('","') +
                            '"]' : '[]';
                result += 'define("' + moduleName + '",' + depString + ');';
        ***REMOVED***
    ***REMOVED***

        return result || null;
***REMOVED***

    /**
     * Handles parsing a file recursively for require calls.
     * @param {Array***REMOVED*** parentNode the AST node to start with.
     * @param {Function***REMOVED*** onMatch function to call on a parse match.
     * @param {Object***REMOVED*** [options] This is normally the build config options if
     * it is passed.
     */
    parse.recurse = function (object, onMatch, options) {
        //Like traverse, but skips if branches that would not be processed
        //after has application that results in tests of true or false boolean
        //literal values.
        var key, child,
            hasHas = options && options.has;

        if (!object) {
            return;
    ***REMOVED***

        //If has replacement has resulted in if(true){***REMOVED*** or if(false){***REMOVED***, take
        //the appropriate branch and skip the other one.
        if (hasHas && object.type === 'IfStatement' && object.test.type &&
                object.test.type === 'Literal') {
            if (object.test.value) {
                //Take the if branch
                this.recurse(object.consequent, onMatch, options);
        ***REMOVED*** else {
                //Take the else branch
                this.recurse(object.alternate, onMatch, options);
        ***REMOVED***
    ***REMOVED*** else {
            if (this.parseNode(object, onMatch) === false) {
                return;
        ***REMOVED***
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    child = object[key];
                    if (typeof child === 'object' && child !== null) {
                        this.recurse(child, onMatch, options);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    /**
     * Determines if the file defines the require/define module API.
     * Specifically, it looks for the `define.amd = ` expression.
     * @param {String***REMOVED*** fileName
     * @param {String***REMOVED*** fileContents
     * @returns {Boolean***REMOVED***
     */
    parse.definesRequire = function (fileName, fileContents) {
        var found = false;

        traverse(esprima.parse(fileContents), function (node) {
            if (parse.hasDefineAmd(node)) {
                found = true;

                //Stop traversal
                return false;
        ***REMOVED***
    ***REMOVED***);

        return found;
***REMOVED***;

    /**
     * Finds require("") calls inside a CommonJS anonymous module wrapped in a
     * define(function(require, exports, module){***REMOVED***) wrapper. These dependencies
     * will be added to a modified define() call that lists the dependencies
     * on the outside of the function.
     * @param {String***REMOVED*** fileName
     * @param {String***REMOVED*** fileContents
     * @returns {Array***REMOVED*** an array of module names that are dependencies. Always
     * returns an array, but could be of length zero.
     */
    parse.getAnonDeps = function (fileName, fileContents) {
        var astRoot = esprima.parse(fileContents),
            defFunc = this.findAnonDefineFactory(astRoot);

        return parse.getAnonDepsFromNode(defFunc);
***REMOVED***;

    /**
     * Finds require("") calls inside a CommonJS anonymous module wrapped
     * in a define function, given an AST node for the definition function.
     * @param {Node***REMOVED*** node the AST node for the definition function.
     * @returns {Array***REMOVED*** and array of dependency names. Can be of zero length.
     */
    parse.getAnonDepsFromNode = function (node) {
        var deps = [],
            funcArgLength;

        if (node) {
            this.findRequireDepNames(node, deps);

            //If no deps, still add the standard CommonJS require, exports,
            //module, in that order, to the deps, but only if specified as
            //function args. In particular, if exports is used, it is favored
            //over the return value of the function, so only add it if asked.
            funcArgLength = node.params && node.params.length;
            if (funcArgLength) {
                deps = (funcArgLength > 1 ? ["require", "exports", "module"] :
                        ["require"]).concat(deps);
        ***REMOVED***
    ***REMOVED***
        return deps;
***REMOVED***;

    /**
     * Finds the function in define(function (require, exports, module){***REMOVED***);
     * @param {Array***REMOVED*** node
     * @returns {Boolean***REMOVED***
     */
    parse.findAnonDefineFactory = function (node) {
        var match;

        traverse(node, function (node) {
            var arg0, arg1;

            if (node && node.type === 'CallExpression' &&
                    node.callee && node.callee.type === 'Identifier' &&
                    node.callee.name === 'define' && node[argPropName]) {

                //Just the factory function passed to define
                arg0 = node[argPropName][0];
                if (arg0 && arg0.type === 'FunctionExpression') {
                    match = arg0;
                    return false;
            ***REMOVED***

                //A string literal module ID followed by the factory function.
                arg1 = node[argPropName][1];
                if (arg0.type === 'Literal' &&
                        arg1 && arg1.type === 'FunctionExpression') {
                    match = arg1;
                    return false;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);

        return match;
***REMOVED***;

    /**
     * Finds any config that is passed to requirejs. That includes calls to
     * require/requirejs.config(), as well as require({***REMOVED***, ...) and
     * requirejs({***REMOVED***, ...)
     * @param {String***REMOVED*** fileName
     * @param {String***REMOVED*** fileContents
     *
     * @returns {Object***REMOVED*** a config object. Will be null if no config.
     * Can throw an error if the config in the file cannot be evaluated in
     * a build context to valid JavaScript.
     */
    parse.findConfig = function (fileName, fileContents) {
        /*jslint evil: true */
        var jsConfig,
            foundConfig = null,
            astRoot = esprima.parse(fileContents, {
                range: true
        ***REMOVED***);

        traverse(astRoot, function (node) {
            var arg,
                c = node && node.callee,
                requireType = parse.hasRequire(node);

            if (requireType && (requireType === 'require' ||
                    requireType === 'requirejs' ||
                    requireType === 'requireConfig' ||
                    requireType === 'requirejsConfig')) {

                arg = node[argPropName] && node[argPropName][0];

                if (arg && arg.type === 'ObjectExpression') {
                    jsConfig = parse.nodeToString(fileContents, arg);
                    return false;
            ***REMOVED***
        ***REMOVED*** else {
                arg = parse.getRequireObjectLiteral(node);
                if (arg) {
                    jsConfig = parse.nodeToString(fileContents, arg);
                    return false;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);

        if (jsConfig) {
            foundConfig = eval('(' + jsConfig + ')');
    ***REMOVED***

        return foundConfig;
***REMOVED***;

    /** Returns the node for the object literal assigned to require/requirejs,
     * for holding a declarative config.
     */
    parse.getRequireObjectLiteral = function (node) {
        if (node.id && node.id.type === 'Identifier' &&
                (node.id.name === 'require' || node.id.name === 'requirejs') &&
                node.init && node.init.type === 'ObjectExpression') {
            return node.init;
    ***REMOVED***
***REMOVED***;

    /**
     * Finds all dependencies specified in dependency arrays and inside
     * simplified commonjs wrappers.
     * @param {String***REMOVED*** fileName
     * @param {String***REMOVED*** fileContents
     *
     * @returns {Array***REMOVED*** an array of dependency strings. The dependencies
     * have not been normalized, they may be relative IDs.
     */
    parse.findDependencies = function (fileName, fileContents, options) {
        var dependencies = [],
            astRoot = esprima.parse(fileContents);

        parse.recurse(astRoot, function (callName, config, name, deps) {
            if (deps) {
                dependencies = dependencies.concat(deps);
        ***REMOVED***
      ***REMOVED*** options);

        return dependencies;
***REMOVED***;

    /**
     * Finds only CJS dependencies, ones that are the form
     * require('stringLiteral')
     */
    parse.findCjsDependencies = function (fileName, fileContents, options) {
        var dependencies = [];

        traverse(esprima.parse(fileContents), function (node) {
            var arg;

            if (node && node.type === 'CallExpression' && node.callee &&
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' && node[argPropName] &&
                    node[argPropName].length === 1) {
                arg = node[argPropName][0];
                if (arg.type === 'Literal') {
                    dependencies.push(arg.value);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);

        return dependencies;
***REMOVED***;

    //function define() {***REMOVED***
    parse.hasDefDefine = function (node) {
        return node.type === 'FunctionDeclaration' && node.id &&
                    node.id.type === 'Identifier' && node.id.name === 'define';
***REMOVED***;

    //define.amd = ...
    parse.hasDefineAmd = function (node) {
        return node && node.type === 'AssignmentExpression' &&
            node.left && node.left.type === 'MemberExpression' &&
            node.left.object && node.left.object.name === 'define' &&
            node.left.property && node.left.property.name === 'amd';
***REMOVED***;

    //require(), requirejs(), require.config() and requirejs.config()
    parse.hasRequire = function (node) {
        var callName,
            c = node && node.callee;

        if (node && node.type === 'CallExpression' && c) {
            if (c.type === 'Identifier' &&
                    (c.name === 'require' ||
                    c.name === 'requirejs')) {
                //A require/requirejs({***REMOVED***, ...) call
                callName = c.name;
        ***REMOVED*** else if (c.type === 'MemberExpression' &&
                    c.object &&
                    c.object.type === 'Identifier' &&
                    (c.object.name === 'require' ||
                        c.object.name === 'requirejs') &&
                    c.property && c.property.name === 'config') {
                // require/requirejs.config({***REMOVED***) call
                callName = c.object.name + 'Config';
        ***REMOVED***
    ***REMOVED***

        return callName;
***REMOVED***;

    //define()
    parse.hasDefine = function (node) {
        return node && node.type === 'CallExpression' && node.callee &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'define';
***REMOVED***;

    /**
     * Determines if define(), require({***REMOVED***|[]) or requirejs was called in the
     * file. Also finds out if define() is declared and if define.amd is called.
     */
    parse.usesAmdOrRequireJs = function (fileName, fileContents, options) {
        var uses;

        traverse(esprima.parse(fileContents), function (node) {
            var type, callName, arg;

            if (parse.hasDefDefine(node)) {
                //function define() {***REMOVED***
                type = 'declaresDefine';
        ***REMOVED*** else if (parse.hasDefineAmd(node)) {
                type = 'defineAmd';
        ***REMOVED*** else {
                callName = parse.hasRequire(node);
                if (callName) {
                    arg = node[argPropName] && node[argPropName][0];
                    if (arg && (arg.type === 'ObjectExpression' ||
                            arg.type === 'ArrayExpression')) {
                        type = callName;
                ***REMOVED***
            ***REMOVED*** else if (parse.hasDefine(node)) {
                    type = 'define';
            ***REMOVED***
        ***REMOVED***

            if (type) {
                if (!uses) {
                    uses = {***REMOVED***;
            ***REMOVED***
                uses[type] = true;
        ***REMOVED***
    ***REMOVED***);

        return uses;
***REMOVED***;

    /**
     * Determines if require(''), exports.x =, module.exports =,
     * __dirname, __filename are used. So, not strictly traditional CommonJS,
     * also checks for Node variants.
     */
    parse.usesCommonJs = function (fileName, fileContents, options) {
        var uses = null,
            assignsExports = false;


        traverse(esprima.parse(fileContents), function (node) {
            var type,
                exp = node.expression;

            if (node.type === 'Identifier' &&
                    (node.name === '__dirname' || node.name === '__filename')) {
                type = node.name.substring(2);
        ***REMOVED*** else if (node.type === 'VariableDeclarator' && node.id &&
                    node.id.type === 'Identifier' &&
                        node.id.name === 'exports') {
                //Hmm, a variable assignment for exports, so does not use cjs
                //exports.
                type = 'varExports';
        ***REMOVED*** else if (exp && exp.type === 'AssignmentExpression' && exp.left &&
                    exp.left.type === 'MemberExpression' && exp.left.object) {
                if (exp.left.object.name === 'module' && exp.left.property &&
                        exp.left.property.name === 'exports') {
                    type = 'moduleExports';
            ***REMOVED*** else if (exp.left.object.name === 'exports' &&
                        exp.left.property) {
                    type = 'exports';
            ***REMOVED***

        ***REMOVED*** else if (node && node.type === 'CallExpression' && node.callee &&
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' && node[argPropName] &&
                    node[argPropName].length === 1 &&
                    node[argPropName][0].type === 'Literal') {
                type = 'require';
        ***REMOVED***

            if (type) {
                if (type === 'varExports') {
                    assignsExports = true;
            ***REMOVED*** else if (type !== 'exports' || !assignsExports) {
                    if (!uses) {
                        uses = {***REMOVED***;
                ***REMOVED***
                    uses[type] = true;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);

        return uses;
***REMOVED***;


    parse.findRequireDepNames = function (node, deps) {
        var moduleName, i, n, call, args;

        traverse(node, function (node) {
            var arg;

            if (node && node.type === 'CallExpression' && node.callee &&
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' &&
                    node[argPropName] && node[argPropName].length === 1) {

                arg = node[argPropName][0];
                if (arg.type === 'Literal') {
                    deps.push(arg.value);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;

    /**
     * Determines if a specific node is a valid require or define/require.def
     * call.
     * @param {Array***REMOVED*** node
     * @param {Function***REMOVED*** onMatch a function to call when a match is found.
     * It is passed the match name, and the config, name, deps possible args.
     * The config, name and deps args are not normalized.
     *
     * @returns {String***REMOVED*** a JS source string with the valid require/define call.
     * Otherwise null.
     */
    parse.parseNode = function (node, onMatch) {
        var name, deps, cjsDeps, arg, factory,
            args = node && node[argPropName],
            callName = parse.hasRequire(node);

        if (callName === 'require' || callName === 'requirejs') {
            //A plain require/requirejs call
            arg = node[argPropName] && node[argPropName][0];
            if (arg.type !== 'ArrayExpression') {
                if (arg.type === 'ObjectExpression') {
                    //A config call, try the second arg.
                    arg = node[argPropName][1];
            ***REMOVED***
        ***REMOVED***

            deps = getValidDeps(arg);
            if (!deps) {
                return;
        ***REMOVED***

            return onMatch("require", null, null, deps);
    ***REMOVED*** else if (parse.hasDefine(node) && args && args.length) {
            name = args[0];
            deps = args[1];
            factory = args[2];

            if (name.type === 'ArrayExpression') {
                //No name, adjust args
                factory = deps;
                deps = name;
                name = null;
        ***REMOVED*** else if (name.type === 'FunctionExpression') {
                //Just the factory, no name or deps
                factory = name;
                name = deps = null;
        ***REMOVED*** else if (name.type !== 'Literal') {
                 //An object literal, just null out
                name = deps = factory = null;
        ***REMOVED***

            if (name && name.type === 'Literal' && deps) {
                if (deps.type === 'FunctionExpression') {
                    //deps is the factory
                    factory = deps;
                    deps = null;
            ***REMOVED*** else if (deps.type === 'ObjectExpression') {
                    //deps is object literal, null out
                    deps = factory = null;
            ***REMOVED***
        ***REMOVED***

            if (deps && deps.type === 'ArrayExpression') {
                deps = getValidDeps(deps);
        ***REMOVED*** else if (factory && factory.type === 'FunctionExpression') {
                //If no deps and a factory function, could be a commonjs sugar
                //wrapper, scan the function for dependencies.
                cjsDeps = parse.getAnonDepsFromNode(factory);
                if (cjsDeps.length) {
                    deps = cjsDeps;
            ***REMOVED***
        ***REMOVED*** else if (deps || factory) {
                //Does not match the shape of an AMD call.
                return;
        ***REMOVED***

            //Just save off the name as a string instead of an AST object.
            if (name && name.type === 'Literal') {
                name = name.value;
        ***REMOVED***

            return onMatch("define", null, name, deps);
    ***REMOVED***
***REMOVED***;

    /**
     * Converts an AST node into a JS source string by extracting
     * the node's location from the given contents string. Assumes
     * esprima.parse() with ranges was done.
     * @param {String***REMOVED*** contents
     * @param {Object***REMOVED*** node
     * @returns {String***REMOVED*** a JS source string.
     */
    parse.nodeToString = function (contents, node) {
        var range = node.range;
        return contents.substring(range[0], range[1]);
***REMOVED***;

    /**
     * Extracts license comments from JS text.
     * @param {String***REMOVED*** fileName
     * @param {String***REMOVED*** contents
     * @returns {String***REMOVED*** a string of license comments.
     */
    parse.getLicenseComments = function (fileName, contents) {
        var commentNode, refNode, subNode, value, i, j,
            ast = esprima.parse(contents, {
                comment: true
        ***REMOVED***),
            result = '',
            existsMap = {***REMOVED***,
            lineEnd = contents.indexOf('\r') === -1 ? '\n' : '\r\n';

        if (ast.comments) {
            for (i = 0; i < ast.comments.length; i++) {
                commentNode = ast.comments[i];

                if (commentNode.type === 'Line') {
                    value = '//' + commentNode.value + lineEnd;
                    refNode = commentNode;

                    if (i + 1 >= ast.comments.length) {
                        value += lineEnd;
                ***REMOVED*** else {
                        //Look for immediately adjacent single line comments
                        //since it could from a multiple line comment made out
                        //of single line comments. Like this comment.
                        for (j = i + 1; j < ast.comments.length; j++) {
                            subNode = ast.comments[j];
                            if (subNode.type === 'Line' &&
                                    subNode.range[0] === refNode.range[1]) {
                                //Adjacent single line comment. Collect it.
                                value += '//' + subNode.value + lineEnd;
                                refNode = subNode;
                        ***REMOVED*** else {
                                //No more single line comment blocks. Break out
                                //and continue outer looping.
                                break;
                        ***REMOVED***
                    ***REMOVED***
                        value += lineEnd;
                        i = j - 1;
                ***REMOVED***
            ***REMOVED*** else {
                    value = '/*' + commentNode.value + '*/' + lineEnd + lineEnd;
            ***REMOVED***

                if (!existsMap[value] && (value.indexOf('license') !== -1 ||
                        (commentNode.type === 'Block' &&
                            value.indexOf('/*!') === 0) ||
                        value.indexOf('opyright') !== -1 ||
                        value.indexOf('(c)') !== -1)) {

                    result += value;
                    existsMap[value] = true;
            ***REMOVED***

        ***REMOVED***
    ***REMOVED***

        return result;
***REMOVED***;

    return parse;
***REMOVED***);
/**
 * @license Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint */
/*global define */

define('transform', [ './esprima', './parse', 'logger', 'lang'], function (esprima, parse, logger, lang) {
    'use strict';
    var transform;

    return (transform = {
        toTransport: function (namespace, moduleName, path, contents, onFound, options) {
            options = options || {***REMOVED***;

            var tokens, foundAnon, deps, lastRange, parenCount, inDefine,
                scanCount = 0,
                scanReset = false,
                defineRanges = [],
                contentInsertion = '',
                depString = '';

            try {
                tokens = esprima.parse(contents, {
                    tokens: true,
                    range: true
            ***REMOVED***).tokens;
        ***REMOVED*** catch (e) {
                logger.trace('toTransport skipping ' + path + ': ' +
                             e.toString());
                return contents;
        ***REMOVED***

            //Find the define calls and their position in the files.
            tokens.forEach(function (token, i) {
                var prev, prev2, next, next2, next3, next4, next5,
                    needsId, depAction, nameCommaRange, foundId,
                    sourceUrlData, range,
                    namespaceExists = false;

                if (inDefine && token.type === 'Punctuator') {
                    //Looking for the end of the define call.
                    if (token.value === '(') {
                        parenCount += 1;
                ***REMOVED*** else if (token.value === ')') {
                        parenCount -= 1;
                ***REMOVED***

                    if (parenCount === 0) {
                        inDefine = false;

                        //Found the end of the define call. Hold onto
                        //it.
                        lastRange = defineRanges.length &&
                            defineRanges[defineRanges.length - 1];
                        if (lastRange) {
                            lastRange.defineEndRange = token.range;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***

                if (token.type === 'Identifier' && token.value === 'define') {
                    //Possible match. Do not want something.define calls
                    //though, and only defines follow by a paren
                    prev = tokens[i - 1];
                    next = tokens[i + 1];

                    if (prev && prev.type === 'Punctuator' &&
                            prev.value === '.') {
                        //a define on a sub-object, not a top level
                        //define() call. If the sub object is the
                        //namespace, then it is ok.
                        prev2 = tokens[i - 2];
                        if (!prev2) {
                            return;
                    ***REMOVED***

                        //If the prev2 does not match namespace, then bail.
                        if (!namespace || prev2.type !== 'Identifier' ||
                                prev2.value !== namespace) {
                            return;
                    ***REMOVED*** else if (namespace) {
                            namespaceExists = true;
                    ***REMOVED***
                ***REMOVED***

                    if (!next || next.type !== 'Punctuator' ||
                            next.value !== '(') {
                       //Not a define() function call. Bail.
                        return;
                ***REMOVED***

                    next2 = tokens[i + 2];
                    if (!next2) {
                        return;
                ***REMOVED***

                    //Figure out if this needs a named define call.
                    if (next2.type === 'Punctuator' && next2.value === '[') {
                        //Dependency array
                        needsId = true;
                        depAction = 'skip';
                ***REMOVED*** else if (next2.type === 'Punctuator' &&
                            next2.value === '{') {
                        //Object literal
                        needsId = true;
                        depAction = 'skip';
                ***REMOVED*** else if (next2.type === 'Keyword' &&
                               next2.value === 'function') {
                        //function
                        needsId = true;
                        depAction = 'scan';
                ***REMOVED*** else if (next2.type === 'String') {
                        //Named module
                        needsId = false;

                        //The value includes the quotes around the string,
                        //so remove them.
                        foundId = next2.value.substring(1,
                                                        next2.value.length - 1);

                        //assumed it does not need dependencies injected

                        //If next argument is a function it means we need
                        //dependency scanning.
                        next3 = tokens[i + 3];
                        next4 = tokens[i + 4];
                        if (!next3 || !next4) {
                            return;
                    ***REMOVED***

                        if (next3.type === 'Punctuator' &&
                                next3.value === ',' &&
                                next4.type === 'Keyword' &&
                                next4.value === 'function') {
                            depAction = 'scan';
                            nameCommaRange = next3.range;
                    ***REMOVED*** else {
                            depAction = 'skip';
                    ***REMOVED***
                ***REMOVED*** else if (next2.type === 'Identifier') {
                        //May be the define(factory); type.
                        next3 = tokens[i + 3];
                        if (!next3) {
                            return;
                    ***REMOVED***
                        if (next3.type === 'Punctuator' &&
                                next3.value === ')') {
                            needsId = true;
                            depAction = 'empty';
                    ***REMOVED*** else {
                            return;
                    ***REMOVED***
                ***REMOVED*** else if (next2.type === 'Numeric') {
                        //May be the define(12345); type.
                        next3 = tokens[i + 3];
                        if (!next3) {
                            return;
                    ***REMOVED***
                        if (next3.type === 'Punctuator' &&
                                next3.value === ')') {
                            needsId = true;
                            depAction = 'skip';
                    ***REMOVED*** else {
                            return;
                    ***REMOVED***
                ***REMOVED*** else if (next2.type === 'Punctuator' &&
                               next2.value === '-') {
                        //May be the define(-12345); type.
                        next3 = tokens[i + 3];
                        if (!next3) {
                            return;
                    ***REMOVED***
                        if (next3.type === 'Numeric') {
                            next4 = tokens[i + 4];
                            if (!next4) {
                                return;
                        ***REMOVED***
                            if (next4.type === 'Punctuator' &&
                                    next4.value === ')') {
                                needsId = true;
                                depAction = 'skip';
                        ***REMOVED*** else {
                                return;
                        ***REMOVED***
                    ***REMOVED*** else {
                            return;
                    ***REMOVED***
                ***REMOVED*** else if (next2.type === 'Keyword' && next2.value === 'this') {
                        //May be the define(this.key); type
                        next3 = tokens[i + 3];
                        next4 = tokens[i + 4];
                        next5 = tokens[i + 5];
                        if (!next3 || !next4 || !next5) {
                            return;
                    ***REMOVED***

                        if (next3.type === 'Punctuator' && next3.value === '.' &&
                                next4.type === 'Identifier' &&
                                next5.type === 'Punctuator' && next5.value === ')') {
                            needsId = true;
                            depAction = 'empty';
                    ***REMOVED*** else {
                            return;
                    ***REMOVED***
                ***REMOVED*** else {
                        //Not a match, skip it.
                        return;
                ***REMOVED***

                    //A valid define call. Need to find the end, start counting
                    //parentheses.
                    inDefine = true;
                    parenCount = 0;

                    range = {
                        foundId: foundId,
                        needsId: needsId,
                        depAction: depAction,
                        namespaceExists: namespaceExists,
                        defineRange: token.range,
                        parenRange: next.range,
                        nameCommaRange: nameCommaRange,
                        sourceUrlData: sourceUrlData
                ***REMOVED***;

                    //Only transform ones that do not have IDs. If it has an
                    //ID but no dependency array, assume it is something like
                    //a phonegap implementation, that has its own internal
                    //define that cannot handle dependency array constructs,
                    //and if it is a named module, then it means it has been
                    //set for transport form.
                    if (range.needsId) {
                        if (foundAnon) {
                            throw new Error(path +
                                ' has two many anonymous modules in it.');
                    ***REMOVED*** else {
                            foundAnon = range;
                            defineRanges.push(range);
                    ***REMOVED***
                ***REMOVED*** else if (depAction === 'scan') {
                        scanCount += 1;
                        if (scanCount > 1) {
                            //Just go back to an array that just has the
                            //anon one, since this is an already optimized
                            //file like the phonegap one.
                            if (!scanReset) {
                                defineRanges =  foundAnon ? [foundAnon] : [];
                                scanReset = true;
                        ***REMOVED***
                    ***REMOVED*** else {
                            defineRanges.push(range);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);

            if (!defineRanges.length) {
                return contents;
        ***REMOVED***

            //Reverse the matches, need to start from the bottom of
            //the file to modify it, so that the ranges are still true
            //further up.
            defineRanges.reverse();

            defineRanges.forEach(function (info) {
                //Do the modifications "backwards", in other words, start with the
                //one that is farthest down and work up, so that the ranges in the
                //defineRanges still apply. So that means deps, id, then namespace.

                if (info.needsId && moduleName) {
                    contentInsertion += "'" + moduleName + "',";
            ***REMOVED***

                if (info.depAction === 'scan') {
                    deps = parse.getAnonDeps(path, contents.substring(info.defineRange[0], info.defineEndRange[1]));

                    if (deps.length) {
                        depString = '[' + deps.map(function (dep) {
                            return "'" + dep + "'";
                    ***REMOVED***) + ']';
                ***REMOVED*** else {
                        depString = '[]';
                ***REMOVED***
                    depString +=  ',';

                    if (info.nameCommaRange) {
                        //Already have a named module, need to insert the
                        //dependencies after the name.
                        contents = contents.substring(0, info.nameCommaRange[1]) +
                                   depString +
                                   contents.substring(info.nameCommaRange[1],
                                                  contents.length);
                ***REMOVED*** else {
                        contentInsertion +=  depString;
                ***REMOVED***
            ***REMOVED***

                if (contentInsertion) {
                    contents = contents.substring(0, info.parenRange[1]) +
                               contentInsertion +
                               contents.substring(info.parenRange[1],
                                                  contents.length);
            ***REMOVED***

                //Do namespace last so that ui does not mess upthe parenRange
                //used above.
                if (namespace && !info.namespaceExists) {
                    contents = contents.substring(0, info.defineRange[0]) +
                               namespace + '.' +
                               contents.substring(info.defineRange[0],
                                                  contents.length);
            ***REMOVED***

                //Notify any listener for the found info
                if (onFound) {
                    onFound(info);
            ***REMOVED***
        ***REMOVED***);

            if (options.useSourceUrl) {
                contents = 'eval("' + lang.jsEscape(contents) +
                    '\\n//@ sourceURL=' + (path.indexOf('/') === 0 ? '' : '/') +
                    path +
                    '");\n';
        ***REMOVED***

            return contents;
    ***REMOVED***
***REMOVED***);
***REMOVED***);/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint regexp: true, plusplus: true  */
/*global define: false */

define('pragma', ['parse', 'logger'], function (parse, logger) {
    'use strict';
    function Temp() {***REMOVED***

    function create(obj, mixin) {
        Temp.prototype = obj;
        var temp = new Temp(), prop;

        //Avoid any extra memory hanging around
        Temp.prototype = null;

        if (mixin) {
            for (prop in mixin) {
                if (mixin.hasOwnProperty(prop) && !temp.hasOwnProperty(prop)) {
                    temp[prop] = mixin[prop];
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

        return temp; // Object
***REMOVED***

    var pragma = {
        conditionalRegExp: /(exclude|include)Start\s*\(\s*["'](\w+)["']\s*,(.*)\)/,
        useStrictRegExp: /['"]use strict['"];/g,
        hasRegExp: /has\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
        nsRegExp: /(^|[^\.])(requirejs|require|define)(\.config)?\s*\(/g,
        nsWrapRegExp: /\/\*requirejs namespace: true \*\//,
        apiDefRegExp: /var requirejs, require, define;/,
        defineCheckRegExp: /typeof\s+define\s*===\s*["']function["']\s*&&\s*define\s*\.\s*amd/g,
        defineTypeFirstCheckRegExp: /\s*["']function["']\s*===\s*typeof\s+define\s*&&\s*define\s*\.\s*amd/g,
        defineJQueryRegExp: /typeof\s+define\s*===\s*["']function["']\s*&&\s*define\s*\.\s*amd\s*&&\s*define\s*\.\s*amd\s*\.\s*jQuery/g,
        defineHasRegExp: /typeof\s+define\s*==(=)?\s*['"]function['"]\s*&&\s*typeof\s+define\.amd\s*==(=)?\s*['"]object['"]\s*&&\s*define\.amd/g,
        defineTernaryRegExp: /typeof\s+define\s*===\s*['"]function["']\s*&&\s*define\s*\.\s*amd\s*\?\s*define/,
        amdefineRegExp: /if\s*\(\s*typeof define\s*\!==\s*'function'\s*\)\s*\{\s*[^\{\***REMOVED***]+amdefine[^\{\***REMOVED***]+\***REMOVED***/g,

        removeStrict: function (contents, config) {
            return config.useStrict ? contents : contents.replace(pragma.useStrictRegExp, '');
      ***REMOVED***

        namespace: function (fileContents, ns, onLifecycleName) {
            if (ns) {
                //Namespace require/define calls
                fileContents = fileContents.replace(pragma.nsRegExp, '$1' + ns + '.$2$3(');

                //Namespace define ternary use:
                fileContents = fileContents.replace(pragma.defineTernaryRegExp,
                                                    "typeof " + ns + ".define === 'function' && " + ns + ".define.amd ? " + ns + ".define");

                //Namespace define jquery use:
                fileContents = fileContents.replace(pragma.defineJQueryRegExp,
                                                    "typeof " + ns + ".define === 'function' && " + ns + ".define.amd && " + ns + ".define.amd.jQuery");

                //Namespace has.js define use:
                fileContents = fileContents.replace(pragma.defineHasRegExp,
                                                    "typeof " + ns + ".define === 'function' && typeof " + ns + ".define.amd === 'object' && " + ns + ".define.amd");

                //Namespace define checks.
                //Do these ones last, since they are a subset of the more specific
                //checks above.
                fileContents = fileContents.replace(pragma.defineCheckRegExp,
                                                    "typeof " + ns + ".define === 'function' && " + ns + ".define.amd");
                fileContents = fileContents.replace(pragma.defineTypeFirstCheckRegExp,
                                                    "'function' === typeof " + ns + ".define && " + ns + ".define.amd");

                //Check for require.js with the require/define definitions
                if (pragma.apiDefRegExp.test(fileContents) &&
                    fileContents.indexOf("if (typeof " + ns + " === 'undefined')") === -1) {
                    //Wrap the file contents in a typeof check, and a function
                    //to contain the API globals.
                    fileContents = "var " + ns + ";(function () { if (typeof " +
                                    ns + " === 'undefined') {\n" +
                                    ns + ' = {***REMOVED***;\n' +
                                    fileContents +
                                    "\n" +
                                    ns + ".requirejs = requirejs;" +
                                    ns + ".require = require;" +
                                    ns + ".define = define;\n" +
                                    "***REMOVED***\n***REMOVED***());";
            ***REMOVED***

                //Finally, if the file wants a special wrapper because it ties
                //in to the requirejs internals in a way that would not fit
                //the above matches, do that. Look for /*requirejs namespace: true*/
                if (pragma.nsWrapRegExp.test(fileContents)) {
                    //Remove the pragma.
                    fileContents = fileContents.replace(pragma.nsWrapRegExp, '');

                    //Alter the contents.
                    fileContents = '(function () {\n' +
                                   'var require = ' + ns + '.require,' +
                                   'requirejs = ' + ns + '.requirejs,' +
                                   'define = ' + ns + '.define;\n' +
                                   fileContents +
                                   '\n***REMOVED***());';
            ***REMOVED***
        ***REMOVED***

            return fileContents;
      ***REMOVED***

        /**
         * processes the fileContents for some //>> conditional statements
         */
        process: function (fileName, fileContents, config, onLifecycleName, pluginCollector) {
            /*jslint evil: true */
            var foundIndex = -1, startIndex = 0, lineEndIndex, conditionLine,
                matches, type, marker, condition, isTrue, endRegExp, endMatches,
                endMarkerIndex, shouldInclude, startLength, lifecycleHas, deps,
                i, dep, moduleName, collectorMod,
                lifecyclePragmas, pragmas = config.pragmas, hasConfig = config.has,
                //Legacy arg defined to help in dojo conversion script. Remove later
                //when dojo no longer needs conversion:
                kwArgs = pragmas;

            //Mix in a specific lifecycle scoped object, to allow targeting
            //some pragmas/has tests to only when files are saved, or at different
            //lifecycle events. Do not bother with kwArgs in this section, since
            //the old dojo kwArgs were for all points in the build lifecycle.
            if (onLifecycleName) {
                lifecyclePragmas = config['pragmas' + onLifecycleName];
                lifecycleHas = config['has' + onLifecycleName];

                if (lifecyclePragmas) {
                    pragmas = create(pragmas || {***REMOVED***, lifecyclePragmas);
            ***REMOVED***

                if (lifecycleHas) {
                    hasConfig = create(hasConfig || {***REMOVED***, lifecycleHas);
            ***REMOVED***
        ***REMOVED***

            //Replace has references if desired
            if (hasConfig) {
                fileContents = fileContents.replace(pragma.hasRegExp, function (match, test) {
                    if (hasConfig.hasOwnProperty(test)) {
                        return !!hasConfig[test];
                ***REMOVED***
                    return match;
            ***REMOVED***);
        ***REMOVED***

            if (!config.skipPragmas) {

                while ((foundIndex = fileContents.indexOf("//>>", startIndex)) !== -1) {
                    //Found a conditional. Get the conditional line.
                    lineEndIndex = fileContents.indexOf("\n", foundIndex);
                    if (lineEndIndex === -1) {
                        lineEndIndex = fileContents.length - 1;
                ***REMOVED***

                    //Increment startIndex past the line so the next conditional search can be done.
                    startIndex = lineEndIndex + 1;

                    //Break apart the conditional.
                    conditionLine = fileContents.substring(foundIndex, lineEndIndex + 1);
                    matches = conditionLine.match(pragma.conditionalRegExp);
                    if (matches) {
                        type = matches[1];
                        marker = matches[2];
                        condition = matches[3];
                        isTrue = false;
                        //See if the condition is true.
                        try {
                            isTrue = !!eval("(" + condition + ")");
                    ***REMOVED*** catch (e) {
                            throw "Error in file: " +
                                   fileName +
                                   ". Conditional comment: " +
                                   conditionLine +
                                   " failed with this error: " + e;
                    ***REMOVED***

                        //Find the endpoint marker.
                        endRegExp = new RegExp('\\/\\/\\>\\>\\s*' + type + 'End\\(\\s*[\'"]' + marker + '[\'"]\\s*\\)', "g");
                        endMatches = endRegExp.exec(fileContents.substring(startIndex, fileContents.length));
                        if (endMatches) {
                            endMarkerIndex = startIndex + endRegExp.lastIndex - endMatches[0].length;

                            //Find the next line return based on the match position.
                            lineEndIndex = fileContents.indexOf("\n", endMarkerIndex);
                            if (lineEndIndex === -1) {
                                lineEndIndex = fileContents.length - 1;
                        ***REMOVED***

                            //Should we include the segment?
                            shouldInclude = ((type === "exclude" && !isTrue) || (type === "include" && isTrue));

                            //Remove the conditional comments, and optionally remove the content inside
                            //the conditional comments.
                            startLength = startIndex - foundIndex;
                            fileContents = fileContents.substring(0, foundIndex) +
                                (shouldInclude ? fileContents.substring(startIndex, endMarkerIndex) : "") +
                                fileContents.substring(lineEndIndex + 1, fileContents.length);

                            //Move startIndex to foundIndex, since that is the new position in the file
                            //where we need to look for more conditionals in the next while loop pass.
                            startIndex = foundIndex;
                    ***REMOVED*** else {
                            throw "Error in file: " +
                                  fileName +
                                  ". Cannot find end marker for conditional comment: " +
                                  conditionLine;

                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

            //If need to find all plugin resources to optimize, do that now,
            //before namespacing, since the namespacing will change the API
            //names.
            //If there is a plugin collector, scan the file for plugin resources.
            if (config.optimizeAllPluginResources && pluginCollector) {
                try {
                    deps = parse.findDependencies(fileName, fileContents);
                    if (deps.length) {
                        for (i = 0; i < deps.length; i++) {
                            dep = deps[i];
                            if (dep.indexOf('!') !== -1) {
                                moduleName = dep.split('!')[0];
                                collectorMod = pluginCollector[moduleName];
                                if (!collectorMod) {
                                 collectorMod = pluginCollector[moduleName] = [];
                            ***REMOVED***
                                collectorMod.push(dep);
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED*** catch (eDep) {
                    logger.error('Parse error looking for plugin resources in ' +
                                 fileName + ', skipping.');
            ***REMOVED***
        ***REMOVED***

            //Strip amdefine use for node-shared modules.
            fileContents = fileContents.replace(pragma.amdefineRegExp, '');

            //Do namespacing
            if (onLifecycleName === 'OnSave' && config.namespace) {
                fileContents = pragma.namespace(fileContents, config.namespace, onLifecycleName);
        ***REMOVED***


            return pragma.removeStrict(fileContents, config);
    ***REMOVED***
***REMOVED***;

    return pragma;
***REMOVED***);
if(env === 'browser') {
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false */

define('browser/optimize', {***REMOVED***);

***REMOVED***

if(env === 'node') {
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint strict: false */
/*global define: false */

define('node/optimize', {***REMOVED***);

***REMOVED***

if(env === 'rhino') {
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint sloppy: true, plusplus: true */
/*global define, java, Packages, com */

define('rhino/optimize', ['logger', 'env!env/file'], function (logger, file) {

    //Add .reduce to Rhino so UglifyJS can run in Rhino,
    //inspired by https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
    //but rewritten for brevity, and to be good enough for use by UglifyJS.
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (fn /*, initialValue */) {
            var i = 0,
                length = this.length,
                accumulator;

            if (arguments.length >= 2) {
                accumulator = arguments[1];
        ***REMOVED*** else {
                if (length) {
                    while (!(i in this)) {
                        i++;
                ***REMOVED***
                    accumulator = this[i++];
            ***REMOVED***
        ***REMOVED***

            for (; i < length; i++) {
                if (i in this) {
                    accumulator = fn.call(undefined, accumulator, this[i], i, this);
            ***REMOVED***
        ***REMOVED***

            return accumulator;
    ***REMOVED***;
***REMOVED***

    var JSSourceFilefromCode, optimize,
        mapRegExp = /"file":"[^"]+"/;

    //Bind to Closure compiler, but if it is not available, do not sweat it.
    try {
        JSSourceFilefromCode = java.lang.Class.forName('com.google.javascript.jscomp.JSSourceFile').getMethod('fromCode', [java.lang.String, java.lang.String]);
***REMOVED*** catch (e) {***REMOVED***

    //Helper for closure compiler, because of weird Java-JavaScript interactions.
    function closurefromCode(filename, content) {
        return JSSourceFilefromCode.invoke(null, [filename, content]);
***REMOVED***


    function getFileWriter(fileName, encoding) {
        var outFile = new java.io.File(fileName), outWriter, parentDir;

        parentDir = outFile.getAbsoluteFile().getParentFile();
        if (!parentDir.exists()) {
            if (!parentDir.mkdirs()) {
                throw "Could not create directory: " + parentDir.getAbsolutePath();
        ***REMOVED***
    ***REMOVED***

        if (encoding) {
            outWriter = new java.io.OutputStreamWriter(new java.io.FileOutputStream(outFile), encoding);
    ***REMOVED*** else {
            outWriter = new java.io.OutputStreamWriter(new java.io.FileOutputStream(outFile));
    ***REMOVED***

        return new java.io.BufferedWriter(outWriter);
***REMOVED***

    optimize = {
        closure: function (fileName, fileContents, outFileName, keepLines, config) {
            config = config || {***REMOVED***;
            var result, mappings, optimized, compressed, baseName, writer,
                outBaseName, outFileNameMap, outFileNameMapContent,
                jscomp = Packages.com.google.javascript.jscomp,
                flags = Packages.com.google.common.flags,
                //Fake extern
                externSourceFile = closurefromCode("fakeextern.js", " "),
                //Set up source input
                jsSourceFile = closurefromCode(String(fileName), String(fileContents)),
                options, option, FLAG_compilation_level, compiler,
                Compiler = Packages.com.google.javascript.jscomp.Compiler;

            logger.trace("Minifying file: " + fileName);

            baseName = (new java.io.File(fileName)).getName();

            //Set up options
            options = new jscomp.CompilerOptions();
            for (option in config.CompilerOptions) {
                // options are false by default and jslint wanted an if statement in this for loop
                if (config.CompilerOptions[option]) {
                    options[option] = config.CompilerOptions[option];
            ***REMOVED***

        ***REMOVED***
            options.prettyPrint = keepLines || options.prettyPrint;

            FLAG_compilation_level = jscomp.CompilationLevel[config.CompilationLevel || 'SIMPLE_OPTIMIZATIONS'];
            FLAG_compilation_level.setOptionsForCompilationLevel(options);

            if (config.generateSourceMaps) {
                mappings = new java.util.ArrayList();

                mappings.add(new com.google.javascript.jscomp.SourceMap.LocationMapping(fileName, baseName + ".src"));
                options.setSourceMapLocationMappings(mappings);
                options.setSourceMapOutputPath(fileName + ".map");
        ***REMOVED***

            //Trigger the compiler
            Compiler.setLoggingLevel(Packages.java.util.logging.Level[config.loggingLevel || 'WARNING']);
            compiler = new Compiler();

            result = compiler.compile(externSourceFile, jsSourceFile, options);
            if (result.success) {
                optimized = String(compiler.toSource());

                if (config.generateSourceMaps && result.sourceMap && outFileName) {
                    outBaseName = (new java.io.File(outFileName)).getName();

                    file.saveUtf8File(outFileName + ".src", fileContents);

                    outFileNameMap = outFileName + ".map";
                    writer = getFileWriter(outFileNameMap, "utf-8");
                    result.sourceMap.appendTo(writer, outFileName);
                    writer.close();

                    //Not sure how better to do this, but right now the .map file
                    //leaks the full OS path in the "file" property. Manually
                    //modify it to not do that.
                    file.saveFile(outFileNameMap,
                        file.readFile(outFileNameMap).replace(mapRegExp, '"file":"' + baseName + '"'));

                    fileContents = optimized + "\n//@ sourceMappingURL=" + outBaseName + ".map";
            ***REMOVED*** else {
                    fileContents = optimized;
            ***REMOVED***
                return fileContents;
        ***REMOVED*** else {
                logger.error('Cannot closure compile file: ' + fileName + '. Skipping it.');
        ***REMOVED***

            return fileContents;
    ***REMOVED***
***REMOVED***;

    return optimize;
***REMOVED***);
***REMOVED***
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint plusplus: true, nomen: true, regexp: true */
/*global define: false */

define('optimize', [ 'lang', 'logger', 'env!env/optimize', 'env!env/file', 'parse',
         'pragma', 'uglifyjs/index', 'uglifyjs2'],
function (lang,   logger,   envOptimize,        file,           parse,
          pragma, uglify,             uglify2) {
    'use strict';

    var optimize,
        cssImportRegExp = /\@import\s+(url\()?\s*([^);]+)\s*(\))?([\w, ]*)(;)?/g,
        cssCommentImportRegExp = /\/\*[^\*]*@import[^\*]*\*\//g,
        cssUrlRegExp = /\url\(\s*([^\)]+)\s*\)?/g,
        endSemicolonRegExp = /;\s*$/;

    /**
     * If an URL from a CSS url value contains start/end quotes, remove them.
     * This is not done in the regexp, since my regexp fu is not that strong,
     * and the CSS spec allows for ' and " in the URL if they are backslash escaped.
     * @param {String***REMOVED*** url
     */
    function cleanCssUrlQuotes(url) {
        //Make sure we are not ending in whitespace.
        //Not very confident of the css regexps above that there will not be ending
        //whitespace.
        url = url.replace(/\s+$/, "");

        if (url.charAt(0) === "'" || url.charAt(0) === "\"") {
            url = url.substring(1, url.length - 1);
    ***REMOVED***

        return url;
***REMOVED***

    /**
     * Inlines nested stylesheets that have @import calls in them.
     * @param {String***REMOVED*** fileName the file name
     * @param {String***REMOVED*** fileContents the file contents
     * @param {String***REMOVED*** cssImportIgnore comma delimited string of files to ignore
     * @param {Object***REMOVED*** included an object used to track the files already imported
     */
    function flattenCss(fileName, fileContents, cssImportIgnore, included) {
        //Find the last slash in the name.
        fileName = fileName.replace(lang.backSlashRegExp, "/");
        var endIndex = fileName.lastIndexOf("/"),
            //Make a file path based on the last slash.
            //If no slash, so must be just a file name. Use empty string then.
            filePath = (endIndex !== -1) ? fileName.substring(0, endIndex + 1) : "",
            //store a list of merged files
            importList = [],
            skippedList = [];

        //First make a pass by removing an commented out @import calls.
        fileContents = fileContents.replace(cssCommentImportRegExp, '');

        //Make sure we have a delimited ignore list to make matching faster
        if (cssImportIgnore && cssImportIgnore.charAt(cssImportIgnore.length - 1) !== ",") {
            cssImportIgnore += ",";
    ***REMOVED***

        fileContents = fileContents.replace(cssImportRegExp, function (fullMatch, urlStart, importFileName, urlEnd, mediaTypes) {
            //Only process media type "all" or empty media type rules.
            if (mediaTypes && ((mediaTypes.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) !== "all")) {
                skippedList.push(fileName);
                return fullMatch;
        ***REMOVED***

            importFileName = cleanCssUrlQuotes(importFileName);

            //Ignore the file import if it is part of an ignore list.
            if (cssImportIgnore && cssImportIgnore.indexOf(importFileName + ",") !== -1) {
                return fullMatch;
        ***REMOVED***

            //Make sure we have a unix path for the rest of the operation.
            importFileName = importFileName.replace(lang.backSlashRegExp, "/");

            try {
                //if a relative path, then tack on the filePath.
                //If it is not a relative path, then the readFile below will fail,
                //and we will just skip that import.
                var fullImportFileName = importFileName.charAt(0) === "/" ? importFileName : filePath + importFileName,
                    importContents = file.readFile(fullImportFileName), i,
                    importEndIndex, importPath, fixedUrlMatch, colonIndex, parts, flat;

                //Skip the file if it has already been included.
                if (included[fullImportFileName]) {
                    return '';
            ***REMOVED***
                included[fullImportFileName] = true;

                //Make sure to flatten any nested imports.
                flat = flattenCss(fullImportFileName, importContents, cssImportIgnore, included);
                importContents = flat.fileContents;

                if (flat.importList.length) {
                    importList.push.apply(importList, flat.importList);
            ***REMOVED***
                if (flat.skippedList.length) {
                    skippedList.push.apply(skippedList, flat.skippedList);
            ***REMOVED***

                //Make the full import path
                importEndIndex = importFileName.lastIndexOf("/");

                //Make a file path based on the last slash.
                //If no slash, so must be just a file name. Use empty string then.
                importPath = (importEndIndex !== -1) ? importFileName.substring(0, importEndIndex + 1) : "";

                //fix url() on relative import (#5)
                importPath = importPath.replace(/^\.\//, '');

                //Modify URL paths to match the path represented by this file.
                importContents = importContents.replace(cssUrlRegExp, function (fullMatch, urlMatch) {
                    fixedUrlMatch = cleanCssUrlQuotes(urlMatch);
                    fixedUrlMatch = fixedUrlMatch.replace(lang.backSlashRegExp, "/");

                    //Only do the work for relative URLs. Skip things that start with / or have
                    //a protocol.
                    colonIndex = fixedUrlMatch.indexOf(":");
                    if (fixedUrlMatch.charAt(0) !== "/" && (colonIndex === -1 || colonIndex > fixedUrlMatch.indexOf("/"))) {
                        //It is a relative URL, tack on the path prefix
                        urlMatch = importPath + fixedUrlMatch;
                ***REMOVED*** else {
                        logger.trace(importFileName + "\n  URL not a relative URL, skipping: " + urlMatch);
                ***REMOVED***

                    //Collapse .. and .
                    parts = urlMatch.split("/");
                    for (i = parts.length - 1; i > 0; i--) {
                        if (parts[i] === ".") {
                            parts.splice(i, 1);
                    ***REMOVED*** else if (parts[i] === "..") {
                            if (i !== 0 && parts[i - 1] !== "..") {
                                parts.splice(i - 1, 2);
                                i -= 1;
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***

                    return "url(" + parts.join("/") + ")";
            ***REMOVED***);

                importList.push(fullImportFileName);
                return importContents;
        ***REMOVED*** catch (e) {
                logger.warn(fileName + "\n  Cannot inline css import, skipping: " + importFileName);
                return fullMatch;
        ***REMOVED***
    ***REMOVED***);

        return {
            importList : importList,
            skippedList: skippedList,
            fileContents : fileContents
    ***REMOVED***;
***REMOVED***

    optimize = {
        /**
         * Optimizes a file that contains JavaScript content. Optionally collects
         * plugin resources mentioned in a file, and then passes the content
         * through an minifier if one is specified via config.optimize.
         *
         * @param {String***REMOVED*** fileName the name of the file to optimize
         * @param {String***REMOVED*** fileContents the contents to optimize. If this is
         * a null value, then fileName will be used to read the fileContents.
         * @param {String***REMOVED*** outFileName the name of the file to use for the
         * saved optimized content.
         * @param {Object***REMOVED*** config the build config object.
         * @param {Array***REMOVED*** [pluginCollector] storage for any plugin resources
         * found.
         */
        jsFile: function (fileName, fileContents, outFileName, config, pluginCollector) {
            if (!fileContents) {
                fileContents = file.readFile(fileName);
        ***REMOVED***

            fileContents = optimize.js(fileName, fileContents, outFileName, config, pluginCollector);

            file.saveUtf8File(outFileName, fileContents);
      ***REMOVED***

        /**
         * Optimizes a file that contains JavaScript content. Optionally collects
         * plugin resources mentioned in a file, and then passes the content
         * through an minifier if one is specified via config.optimize.
         *
         * @param {String***REMOVED*** fileName the name of the file that matches the
         * fileContents.
         * @param {String***REMOVED*** fileContents the string of JS to optimize.
         * @param {Object***REMOVED*** [config] the build config object.
         * @param {Array***REMOVED*** [pluginCollector] storage for any plugin resources
         * found.
         */
        js: function (fileName, fileContents, outFileName, config, pluginCollector) {
            var optFunc, optConfig,
                parts = (String(config.optimize)).split('.'),
                optimizerName = parts[0],
                keepLines = parts[1] === 'keepLines',
                licenseContents = '';

            config = config || {***REMOVED***;

            //Apply pragmas/namespace renaming
            fileContents = pragma.process(fileName, fileContents, config, 'OnSave', pluginCollector);

            //Optimize the JS files if asked.
            if (optimizerName && optimizerName !== 'none') {
                optFunc = envOptimize[optimizerName] || optimize.optimizers[optimizerName];
                if (!optFunc) {
                    throw new Error('optimizer with name of "' +
                                    optimizerName +
                                    '" not found for this environment');
            ***REMOVED***

                optConfig = config[optimizerName] || {***REMOVED***
                if (config.generateSourceMaps) {
                    optConfig.generateSourceMaps = !!config.generateSourceMaps;
            ***REMOVED***

                if (config.preserveLicenseComments) {
                    //Pull out any license comments for prepending after optimization.
                    try {
                        licenseContents = parse.getLicenseComments(fileName, fileContents);
                ***REMOVED*** catch (e) {
                        logger.error('Cannot parse file: ' + fileName + ' for comments. Skipping it. Error is:\n' + e.toString());
                ***REMOVED***
            ***REMOVED***

                fileContents = licenseContents + optFunc(fileName,
                                                         fileContents,
                                                         outFileName,
                                                         keepLines,
                                                         optConfig);
        ***REMOVED***

            return fileContents;
      ***REMOVED***

        /**
         * Optimizes one CSS file, inlining @import calls, stripping comments, and
         * optionally removes line returns.
         * @param {String***REMOVED*** fileName the path to the CSS file to optimize
         * @param {String***REMOVED*** outFileName the path to save the optimized file.
         * @param {Object***REMOVED*** config the config object with the optimizeCss and
         * cssImportIgnore options.
         */
        cssFile: function (fileName, outFileName, config) {

            //Read in the file. Make sure we have a JS string.
            var originalFileContents = file.readFile(fileName),
                flat = flattenCss(fileName, originalFileContents, config.cssImportIgnore, {***REMOVED***),
                //Do not use the flattened CSS if there was one that was skipped.
                fileContents = flat.skippedList.length ? originalFileContents : flat.fileContents,
                startIndex, endIndex, buildText, comment;

            if (flat.skippedList.length) {
                logger.warn('Cannot inline @imports for ' + fileName +
                            ',\nthe following files had media queries in them:\n' +
                            flat.skippedList.join('\n'));
        ***REMOVED***

            //Do comment removal.
            try {
                if (config.optimizeCss.indexOf(".keepComments") === -1) {
                    startIndex = 0;
                    //Get rid of comments.
                    while ((startIndex = fileContents.indexOf("/*", startIndex)) !== -1) {
                        endIndex = fileContents.indexOf("*/", startIndex + 2);
                        if (endIndex === -1) {
                            throw "Improper comment in CSS file: " + fileName;
                    ***REMOVED***
                        comment = fileContents.substring(startIndex, endIndex);

                        if (config.preserveLicenseComments &&
                            (comment.indexOf('license') !== -1 ||
                             comment.indexOf('opyright') !== -1 ||
                             comment.indexOf('(c)') !== -1)) {
                            //Keep the comment, just increment the startIndex
                            startIndex = endIndex;
                    ***REMOVED*** else {
                            fileContents = fileContents.substring(0, startIndex) + fileContents.substring(endIndex + 2, fileContents.length);
                            startIndex = 0;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
                //Get rid of newlines.
                if (config.optimizeCss.indexOf(".keepLines") === -1) {
                    fileContents = fileContents.replace(/[\r\n]/g, "");
                    fileContents = fileContents.replace(/\s+/g, " ");
                    fileContents = fileContents.replace(/\{\s/g, "{");
                    fileContents = fileContents.replace(/\s\***REMOVED***/g, "***REMOVED***");
            ***REMOVED*** else {
                    //Remove multiple empty lines.
                    fileContents = fileContents.replace(/(\r\n)+/g, "\r\n");
                    fileContents = fileContents.replace(/(\n)+/g, "\n");
            ***REMOVED***
        ***REMOVED*** catch (e) {
                fileContents = originalFileContents;
                logger.error("Could not optimized CSS file: " + fileName + ", error: " + e);
        ***REMOVED***

            file.saveUtf8File(outFileName, fileContents);

            //text output to stdout and/or written to build.txt file
            buildText = "\n"+ outFileName.replace(config.dir, "") +"\n----------------\n";
            flat.importList.push(fileName);
            buildText += flat.importList.map(function(path){
                return path.replace(config.dir, "");
        ***REMOVED***).join("\n");

            return {
                importList: flat.importList,
                buildText: buildText +"\n"
        ***REMOVED***;
      ***REMOVED***

        /**
         * Optimizes CSS files, inlining @import calls, stripping comments, and
         * optionally removes line returns.
         * @param {String***REMOVED*** startDir the path to the top level directory
         * @param {Object***REMOVED*** config the config object with the optimizeCss and
         * cssImportIgnore options.
         */
        css: function (startDir, config) {
            var buildText = "",
                importList = [],
                shouldRemove = config.dir && config.removeCombined,
                i, fileName, result, fileList;
            if (config.optimizeCss.indexOf("standard") !== -1) {
                fileList = file.getFilteredFileList(startDir, /\.css$/, true);
                if (fileList) {
                    for (i = 0; i < fileList.length; i++) {
                        fileName = fileList[i];
                        logger.trace("Optimizing (" + config.optimizeCss + ") CSS file: " + fileName);
                        result = optimize.cssFile(fileName, fileName, config);
                        buildText += result.buildText;
                        if (shouldRemove) {
                            result.importList.pop();
                            importList = importList.concat(result.importList);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***

                if (shouldRemove) {
                    importList.forEach(function (path) {
                        if (file.exists(path)) {
                            file.deleteFile(path);
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***
            return buildText;
      ***REMOVED***

        optimizers: {
            uglify: function (fileName, fileContents, outFileName, keepLines, config) {
                var parser = uglify.parser,
                    processor = uglify.uglify,
                    ast, errMessage, errMatch;

                config = config || {***REMOVED***;

                logger.trace("Uglifying file: " + fileName);

                try {
                    ast = parser.parse(fileContents, config.strict_semicolons);
                    if (config.no_mangle !== true) {
                        ast = processor.ast_mangle(ast, config);
                ***REMOVED***
                    ast = processor.ast_squeeze(ast, config);

                    fileContents = processor.gen_code(ast, config);

                    if (config.max_line_length) {
                        fileContents = processor.split_lines(fileContents, config.max_line_length);
                ***REMOVED***

                    //Add trailing semicolon to match uglifyjs command line version
                    fileContents += ';';
            ***REMOVED*** catch (e) {
                    errMessage = e.toString();
                    errMatch = /\nError(\r)?\n/.exec(errMessage);
                    if (errMatch) {
                        errMessage = errMessage.substring(0, errMatch.index);
                ***REMOVED***
                    logger.error('Cannot uglify file: ' + fileName + '. Skipping it. Error is:\n' + errMessage);
            ***REMOVED***
                return fileContents;
          ***REMOVED***
            uglify2: function (fileName, fileContents, outFileName, keepLines, config) {
                var result,
                    uconfig = {***REMOVED***,
                    baseName = fileName && fileName.split('/').pop();

                config = config || {***REMOVED***;

                lang.mixin(uconfig, config, true);

                uconfig.fromString = true;

                if (config.generateSourceMaps && outFileName) {
                    uconfig.outSourceMap = baseName;
            ***REMOVED***

                logger.trace("Uglify2 file: " + fileName);

                try {
                    result = uglify2.minify(fileContents, uconfig, baseName + '.src');

                    if (uconfig.outSourceMap && result.map) {
                        file.saveFile(outFileName + '.src', fileContents);
                        file.saveFile(outFileName + '.map', result.map);
                        fileContents = result.code + "\n//@ sourceMappingURL=" + baseName + ".map";
                ***REMOVED*** else {
                        fileContents = result.code;
                ***REMOVED***
            ***REMOVED*** catch (e) {
                    logger.error('Cannot uglify2 file: ' + fileName + '. Skipping it. Error is:\n' + e.toString());
            ***REMOVED***
                return fileContents;
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    return optimize;
***REMOVED***);
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*
 * This file patches require.js to communicate with the build system.
 */

//Using sloppy since this uses eval for some code like plugins,
//which may not be strict mode compliant. So if use strict is used
//below they will have strict rules applied and may cause an error.
/*jslint sloppy: true, nomen: true, plusplus: true, regexp: true */
/*global require, define: true */

//NOT asking for require as a dependency since the goal is to modify the
//global require below
define('requirePatch', [ 'env!env/file', 'pragma', 'parse', 'lang', 'logger', 'commonJs', 'prim'], function (
    file,
    pragma,
    parse,
    lang,
    logger,
    commonJs,
    prim
) {

    var allowRun = true,
        hasProp = lang.hasProp,
        falseProp = lang.falseProp,
        getOwn = lang.getOwn;

    //This method should be called when the patches to require should take hold.
    return function () {
        if (!allowRun) {
            return;
    ***REMOVED***
        allowRun = false;

        var layer,
            pluginBuilderRegExp = /(["']?)pluginBuilder(["']?)\s*[=\:]\s*["']([^'"\s]+)["']/,
            oldNewContext = require.s.newContext,
            oldDef,

            //create local undefined values for module and exports,
            //so that when files are evaled in this function they do not
            //see the node values used for r.js
            exports,
            module;

        /**
         * Reset "global" build caches that are kept around between
         * build layer builds. Useful to do when there are multiple
         * top level requirejs.optimize() calls.
         */
        require._cacheReset = function () {
            //Stored raw text caches, used by browser use.
            require._cachedRawText = {***REMOVED***;
            //Stored cached file contents for reuse in other layers.
            require._cachedFileContents = {***REMOVED***;
            //Store which cached files contain a require definition.
            require._cachedDefinesRequireUrls = {***REMOVED***;
    ***REMOVED***;
        require._cacheReset();

        /**
         * Makes sure the URL is something that can be supported by the
         * optimization tool.
         * @param {String***REMOVED*** url
         * @returns {Boolean***REMOVED***
         */
        require._isSupportedBuildUrl = function (url) {
            //Ignore URLs with protocols, hosts or question marks, means either network
            //access is needed to fetch it or it is too dynamic. Note that
            //on Windows, full paths are used for some urls, which include
            //the drive, like c:/something, so need to test for something other
            //than just a colon.
            if (url.indexOf("://") === -1 && url.indexOf("?") === -1 &&
                    url.indexOf('empty:') !== 0 && url.indexOf('//') !== 0) {
                return true;
        ***REMOVED*** else {
                if (!layer.ignoredUrls[url]) {
                    if (url.indexOf('empty:') === -1) {
                        logger.info('Cannot optimize network URL, skipping: ' + url);
                ***REMOVED***
                    layer.ignoredUrls[url] = true;
            ***REMOVED***
                return false;
        ***REMOVED***
    ***REMOVED***;

        function normalizeUrlWithBase(context, moduleName, url) {
            //Adjust the URL if it was not transformed to use baseUrl.
            if (require.jsExtRegExp.test(moduleName)) {
                url = (context.config.dir || context.config.dirBaseUrl) + url;
        ***REMOVED***
            return url;
    ***REMOVED***

        //Overrides the new context call to add existing tracking features.
        require.s.newContext = function (name) {
            var context = oldNewContext(name),
                oldEnable = context.enable,
                moduleProto = context.Module.prototype,
                oldInit = moduleProto.init,
                oldCallPlugin = moduleProto.callPlugin;

            //Only do this for the context used for building.
            if (name === '_') {
                //For build contexts, do everything sync
                context.nextTick = function (fn) {
                    fn();
            ***REMOVED***;

                context.needFullExec = {***REMOVED***;
                context.fullExec = {***REMOVED***;
                context.plugins = {***REMOVED***;
                context.buildShimExports = {***REMOVED***;

                //Override the shim exports function generator to just
                //spit out strings that can be used in the stringified
                //build output.
                context.makeShimExports = function (value) {
                    function fn() {
                        return '(function (global) {\n' +
                            '    return function () {\n' +
                            '        var ret, fn;\n' +
                            (value.init ?
                                    ('       fn = ' + value.init.toString() + ';\n' +
                                    '        ret = fn.apply(global, arguments);\n') : '') +
                            (value.exports ?
                                    '        return ret || global.' + value.exports + ';\n' :
                                    '        return ret;\n') +
                            '***REMOVED***;\n' +
                            '***REMOVED***(this))';
                ***REMOVED***

                    return fn;
            ***REMOVED***;

                context.enable = function (depMap, parent) {
                    var id = depMap.id,
                        parentId = parent && parent.map.id,
                        needFullExec = context.needFullExec,
                        fullExec = context.fullExec,
                        mod = getOwn(context.registry, id);

                    if (mod && !mod.defined) {
                        if (parentId && getOwn(needFullExec, parentId)) {
                            needFullExec[id] = true;
                    ***REMOVED***

                ***REMOVED*** else if ((getOwn(needFullExec, id) && falseProp(fullExec, id)) ||
                               (parentId && getOwn(needFullExec, parentId) &&
                                falseProp(fullExec, id))) {
                        context.require.undef(id);
                ***REMOVED***

                    return oldEnable.apply(context, arguments);
            ***REMOVED***;

                //Override load so that the file paths can be collected.
                context.load = function (moduleName, url) {
                    /*jslint evil: true */
                    var contents, pluginBuilderMatch, builderName,
                        shim, shimExports;

                    //Do not mark the url as fetched if it is
                    //not an empty: URL, used by the optimizer.
                    //In that case we need to be sure to call
                    //load() for each module that is mapped to
                    //empty: so that dependencies are satisfied
                    //correctly.
                    if (url.indexOf('empty:') === 0) {
                        delete context.urlFetched[url];
                ***REMOVED***

                    //Only handle urls that can be inlined, so that means avoiding some
                    //URLs like ones that require network access or may be too dynamic,
                    //like JSONP
                    if (require._isSupportedBuildUrl(url)) {
                        //Adjust the URL if it was not transformed to use baseUrl.
                        url = normalizeUrlWithBase(context, moduleName, url);

                        //Save the module name to path  and path to module name mappings.
                        layer.buildPathMap[moduleName] = url;
                        layer.buildFileToModule[url] = moduleName;

                        if (hasProp(context.plugins, moduleName)) {
                            //plugins need to have their source evaled as-is.
                            context.needFullExec[moduleName] = true;
                    ***REMOVED***

                        prim().start(function () {
                            if (hasProp(require._cachedFileContents, url) &&
                                    (falseProp(context.needFullExec, moduleName) ||
                                    getOwn(context.fullExec, moduleName))) {
                                contents = require._cachedFileContents[url];

                                //If it defines require, mark it so it can be hoisted.
                                //Done here and in the else below, before the
                                //else block removes code from the contents.
                                //Related to #263
                                if (!layer.existingRequireUrl && require._cachedDefinesRequireUrls[url]) {
                                    layer.existingRequireUrl = url;
                            ***REMOVED***
                        ***REMOVED*** else {
                                //Load the file contents, process for conditionals, then
                                //evaluate it.
                                return require._cacheReadAsync(url).then(function (text) {
                                    contents = text;

                                    if (context.config.cjsTranslate) {
                                        contents = commonJs.convert(url, contents);
                                ***REMOVED***

                                    //If there is a read filter, run it now.
                                    if (context.config.onBuildRead) {
                                        contents = context.config.onBuildRead(moduleName, url, contents);
                                ***REMOVED***

                                    contents = pragma.process(url, contents, context.config, 'OnExecute');

                                    //Find out if the file contains a require() definition. Need to know
                                    //this so we can inject plugins right after it, but before they are needed,
                                    //and to make sure this file is first, so that define calls work.
                                    try {
                                        if (!layer.existingRequireUrl && parse.definesRequire(url, contents)) {
                                            layer.existingRequireUrl = url;
                                            require._cachedDefinesRequireUrls[url] = true;
                                    ***REMOVED***
                                ***REMOVED*** catch (e1) {
                                        throw new Error('Parse error using esprima ' +
                                                        'for file: ' + url + '\n' + e1);
                                ***REMOVED***
                            ***REMOVED***).then(function () {
                                    if (hasProp(context.plugins, moduleName)) {
                                        //This is a loader plugin, check to see if it has a build extension,
                                        //otherwise the plugin will act as the plugin builder too.
                                        pluginBuilderMatch = pluginBuilderRegExp.exec(contents);
                                        if (pluginBuilderMatch) {
                                            //Load the plugin builder for the plugin contents.
                                            builderName = context.makeModuleMap(pluginBuilderMatch[3],
                                                                                context.makeModuleMap(moduleName),
                                                                                null,
                                                                                true).id;
                                            return require._cacheReadAsync(context.nameToUrl(builderName));
                                    ***REMOVED***
                                ***REMOVED***
                                    return contents;
                            ***REMOVED***).then(function (text) {
                                    contents = text;

                                    //Parse out the require and define calls.
                                    //Do this even for plugins in case they have their own
                                    //dependencies that may be separate to how the pluginBuilder works.
                                    try {
                                        if (falseProp(context.needFullExec, moduleName)) {
                                            contents = parse(moduleName, url, contents, {
                                                insertNeedsDefine: true,
                                                has: context.config.has,
                                                findNestedDependencies: context.config.findNestedDependencies
                                        ***REMOVED***);
                                    ***REMOVED***
                                ***REMOVED*** catch (e2) {
                                        throw new Error('Parse error using esprima ' +
                                                        'for file: ' + url + '\n' + e2);
                                ***REMOVED***

                                    require._cachedFileContents[url] = contents;
                            ***REMOVED***);
                        ***REMOVED***
                    ***REMOVED***).then(function () {
                            if (contents) {
                                eval(contents);
                        ***REMOVED***

                            try {
                                //If have a string shim config, and this is
                                //a fully executed module, try to see if
                                //it created a variable in this eval scope
                                if (getOwn(context.needFullExec, moduleName)) {
                                    shim = getOwn(context.config.shim, moduleName);
                                    if (shim && shim.exports) {
                                        shimExports = eval(shim.exports);
                                        if (typeof shimExports !== 'undefined') {
                                            context.buildShimExports[moduleName] = shimExports;
                                    ***REMOVED***
                                ***REMOVED***
                            ***REMOVED***

                                //Need to close out completion of this module
                                //so that listeners will get notified that it is available.
                                context.completeLoad(moduleName);
                        ***REMOVED*** catch (e) {
                                //Track which module could not complete loading.
                                if (!e.moduleTree) {
                                    e.moduleTree = [];
                            ***REMOVED***
                                e.moduleTree.push(moduleName);
                                throw e;
                        ***REMOVED***
                    ***REMOVED***).then(null, function (eOuter) {

                            if (!eOuter.fileName) {
                                eOuter.fileName = url;
                        ***REMOVED***
                            throw eOuter;
                    ***REMOVED***).end();
                ***REMOVED*** else {
                        //With unsupported URLs still need to call completeLoad to
                        //finish loading.
                        context.completeLoad(moduleName);
                ***REMOVED***
            ***REMOVED***;

                //Marks module has having a name, and optionally executes the
                //callback, but only if it meets certain criteria.
                context.execCb = function (name, cb, args, exports) {
                    var buildShimExports = getOwn(layer.context.buildShimExports, name);

                    if (falseProp(layer.needsDefine, name) && !buildShimExports) {
                        layer.modulesWithNames[name] = true;
                ***REMOVED***

                    if (buildShimExports) {
                        return buildShimExports;
                ***REMOVED*** else if (cb.__requireJsBuild || getOwn(layer.context.needFullExec, name)) {
                        return cb.apply(exports, args);
                ***REMOVED***
                    return undefined;
            ***REMOVED***;

                moduleProto.init = function (depMaps) {
                    if (context.needFullExec[this.map.id]) {
                        lang.each(depMaps, lang.bind(this, function (depMap) {
                            if (typeof depMap === 'string') {
                                depMap = context.makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap));
                        ***REMOVED***

                            if (!context.fullExec[depMap.id]) {
                                context.require.undef(depMap.id);
                        ***REMOVED***
                    ***REMOVED***));
                ***REMOVED***

                    return oldInit.apply(this, arguments);
            ***REMOVED***;

                moduleProto.callPlugin = function () {
                    var map = this.map,
                        pluginMap = context.makeModuleMap(map.prefix),
                        pluginId = pluginMap.id,
                        pluginMod = getOwn(context.registry, pluginId);

                    context.plugins[pluginId] = true;
                    context.needFullExec[pluginId] = true;

                    //If the module is not waiting to finish being defined,
                    //undef it and start over, to get full execution.
                    if (falseProp(context.fullExec, pluginId) && (!pluginMod || pluginMod.defined)) {
                        context.require.undef(pluginMap.id);
                ***REMOVED***

                    return oldCallPlugin.apply(this, arguments);
            ***REMOVED***;
        ***REMOVED***

            return context;
    ***REMOVED***;

        //Clear up the existing context so that the newContext modifications
        //above will be active.
        delete require.s.contexts._;

        /** Reset state for each build layer pass. */
        require._buildReset = function () {
            var oldContext = require.s.contexts._;

            //Clear up the existing context.
            delete require.s.contexts._;

            //Set up new context, so the layer object can hold onto it.
            require({***REMOVED***);

            layer = require._layer = {
                buildPathMap: {***REMOVED***,
                buildFileToModule: {***REMOVED***,
                buildFilePaths: [],
                pathAdded: {***REMOVED***,
                modulesWithNames: {***REMOVED***,
                needsDefine: {***REMOVED***,
                existingRequireUrl: "",
                ignoredUrls: {***REMOVED***,
                context: require.s.contexts._
        ***REMOVED***;

            //Return the previous context in case it is needed, like for
            //the basic config object.
            return oldContext;
    ***REMOVED***;

        require._buildReset();

        //Override define() to catch modules that just define an object, so that
        //a dummy define call is not put in the build file for them. They do
        //not end up getting defined via context.execCb, so we need to catch them
        //at the define call.
        oldDef = define;

        //This function signature does not have to be exact, just match what we
        //are looking for.
        define = function (name) {
            if (typeof name === "string" && falseProp(layer.needsDefine, name)) {
                layer.modulesWithNames[name] = true;
        ***REMOVED***
            return oldDef.apply(require, arguments);
    ***REMOVED***;

        define.amd = oldDef.amd;

        //Add some utilities for plugins
        require._readFile = file.readFile;
        require._fileExists = function (path) {
            return file.exists(path);
    ***REMOVED***;

        //Called when execManager runs for a dependency. Used to figure out
        //what order of execution.
        require.onResourceLoad = function (context, map) {
            var id = map.id,
                url;

            //If build needed a full execution, indicate it
            //has been done now. But only do it if the context is tracking
            //that. Only valid for the context used in a build, not for
            //other contexts being run, like for useLib, plain requirejs
            //use in node/rhino.
            if (context.needFullExec && getOwn(context.needFullExec, id)) {
                context.fullExec[id] = true;
        ***REMOVED***

            //A plugin.
            if (map.prefix) {
                if (falseProp(layer.pathAdded, id)) {
                    layer.buildFilePaths.push(id);
                    //For plugins the real path is not knowable, use the name
                    //for both module to file and file to module mappings.
                    layer.buildPathMap[id] = id;
                    layer.buildFileToModule[id] = id;
                    layer.modulesWithNames[id] = true;
                    layer.pathAdded[id] = true;
            ***REMOVED***
        ***REMOVED*** else if (map.url && require._isSupportedBuildUrl(map.url)) {
                //If the url has not been added to the layer yet, and it
                //is from an actual file that was loaded, add it now.
                url = normalizeUrlWithBase(context, id, map.url);
                if (!layer.pathAdded[url] && getOwn(layer.buildPathMap, id)) {
                    //Remember the list of dependencies for this layer.
                    layer.buildFilePaths.push(url);
                    layer.pathAdded[url] = true;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        //Called by output of the parse() function, when a file does not
        //explicitly call define, probably just require, but the parse()
        //function normalizes on define() for dependency mapping and file
        //ordering works correctly.
        require.needsDefine = function (moduleName) {
            layer.needsDefine[moduleName] = true;
    ***REMOVED***;
***REMOVED***;
***REMOVED***);
/**
 * @license RequireJS Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint */
/*global define: false, console: false */

define('commonJs', ['env!env/file', 'parse'], function (file, parse) {
    'use strict';
    var commonJs = {
        //Set to false if you do not want this file to log. Useful in environments
        //like node where you want the work to happen without noise.
        useLog: true,

        convertDir: function (commonJsPath, savePath) {
            var fileList, i,
                jsFileRegExp = /\.js$/,
                fileName, convertedFileName, fileContents;

            //Get list of files to convert.
            fileList = file.getFilteredFileList(commonJsPath, /\w/, true);

            //Normalize on front slashes and make sure the paths do not end in a slash.
            commonJsPath = commonJsPath.replace(/\\/g, "/");
            savePath = savePath.replace(/\\/g, "/");
            if (commonJsPath.charAt(commonJsPath.length - 1) === "/") {
                commonJsPath = commonJsPath.substring(0, commonJsPath.length - 1);
        ***REMOVED***
            if (savePath.charAt(savePath.length - 1) === "/") {
                savePath = savePath.substring(0, savePath.length - 1);
        ***REMOVED***

            //Cycle through all the JS files and convert them.
            if (!fileList || !fileList.length) {
                if (commonJs.useLog) {
                    if (commonJsPath === "convert") {
                        //A request just to convert one file.
                        console.log('\n\n' + commonJs.convert(savePath, file.readFile(savePath)));
                ***REMOVED*** else {
                        console.log("No files to convert in directory: " + commonJsPath);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED*** else {
                for (i = 0; i < fileList.length; i++) {
                    fileName = fileList[i];
                    convertedFileName = fileName.replace(commonJsPath, savePath);

                    //Handle JS files.
                    if (jsFileRegExp.test(fileName)) {
                        fileContents = file.readFile(fileName);
                        fileContents = commonJs.convert(fileName, fileContents);
                        file.saveUtf8File(convertedFileName, fileContents);
                ***REMOVED*** else {
                        //Just copy the file over.
                        file.copyFile(fileName, convertedFileName, true);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
      ***REMOVED***

        /**
         * Does the actual file conversion.
         *
         * @param {String***REMOVED*** fileName the name of the file.
         *
         * @param {String***REMOVED*** fileContents the contents of a file :)
         *
         * @returns {String***REMOVED*** the converted contents
         */
        convert: function (fileName, fileContents) {
            //Strip out comments.
            try {
                var preamble = '',
                    commonJsProps = parse.usesCommonJs(fileName, fileContents);

                //First see if the module is not already RequireJS-formatted.
                if (parse.usesAmdOrRequireJs(fileName, fileContents) || !commonJsProps) {
                    return fileContents;
            ***REMOVED***

                if (commonJsProps.dirname || commonJsProps.filename) {
                    preamble = 'var __filename = module.uri || "", ' +
                               '__dirname = __filename.substring(0, __filename.lastIndexOf("/") + 1);\n';
            ***REMOVED***

                //Construct the wrapper boilerplate.
                fileContents = 'define(function (require, exports, module) {\n' +
                    preamble +
                    fileContents +
                    '\n***REMOVED***);\n';

        ***REMOVED*** catch (e) {
                console.log("commonJs.convert: COULD NOT CONVERT: " + fileName + ", so skipping it. Error was: " + e);
                return fileContents;
        ***REMOVED***

            return fileContents;
    ***REMOVED***
***REMOVED***;

    return commonJs;
***REMOVED***);
/**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*jslint plusplus: true, nomen: true, regexp: true  */
/*global define, require, requirejs */


define('build', function (require) {
    'use strict';

    var build, buildBaseConfig,
        lang = require('lang'),
        prim = require('prim'),
        logger = require('logger'),
        file = require('env!env/file'),
        parse = require('parse'),
        optimize = require('optimize'),
        pragma = require('pragma'),
        transform = require('transform'),
        load = require('env!env/load'),
        requirePatch = require('requirePatch'),
        quit = require('env!env/quit'),
        commonJs = require('commonJs'),
        hasProp = lang.hasProp,
        getOwn = lang.getOwn,
        falseProp = lang.falseProp,
        endsWithSemiColonRegExp = /;\s*$/;

    prim.nextTick = function (fn) {
        fn();
***REMOVED***;

    //Now map require to the outermost requirejs, now that we have
    //local dependencies for this module. The rest of the require use is
    //manipulating the requirejs loader.
    require = requirejs;

    //Caching function for performance. Attached to
    //require so it can be reused in requirePatch.js. _cachedRawText
    //set up by requirePatch.js
    require._cacheReadAsync = function (path, encoding) {
        var d;

        if (lang.hasProp(require._cachedRawText, path)) {
            d = prim();
            d.resolve(require._cachedRawText[path]);
            return d.promise;
    ***REMOVED*** else {
            return file.readFileAsync(path, encoding).then(function (text) {
                require._cachedRawText[path] = text;
                return text;
        ***REMOVED***);
    ***REMOVED***
***REMOVED***;

    buildBaseConfig = {
        appDir: "",
        pragmas: {***REMOVED***,
        paths: {***REMOVED***,
        optimize: "uglify",
        optimizeCss: "standard.keepLines",
        inlineText: true,
        isBuild: true,
        optimizeAllPluginResources: false,
        findNestedDependencies: false,
        preserveLicenseComments: true,
        //By default, all files/directories are copied, unless
        //they match this regexp, by default just excludes .folders
        dirExclusionRegExp: file.dirExclusionRegExp,
        _buildPathToModuleIndex: {***REMOVED***
***REMOVED***;

    /**
     * Some JS may not be valid if concatenated with other JS, in particular
     * the style of omitting semicolons and rely on ASI. Add a semicolon in
     * those cases.
     */
    function addSemiColon(text) {
        if (endsWithSemiColonRegExp.test(text)) {
            return text;
    ***REMOVED*** else {
            return text + ";";
    ***REMOVED***
***REMOVED***

    function endsWithSlash(dirName) {
        if (dirName.charAt(dirName.length - 1) !== "/") {
            dirName += "/";
    ***REMOVED***
        return dirName;
***REMOVED***

    //Method used by plugin writeFile calls, defined up here to avoid
    //jslint warning about "making a function in a loop".
    function makeWriteFile(namespace, layer) {
        function writeFile(name, contents) {
            logger.trace('Saving plugin-optimized file: ' + name);
            file.saveUtf8File(name, contents);
    ***REMOVED***

        writeFile.asModule = function (moduleName, fileName, contents) {
            writeFile(fileName,
                build.toTransport(namespace, moduleName, fileName, contents, layer));
    ***REMOVED***;

        return writeFile;
***REMOVED***

    /**
     * Main API entry point into the build. The args argument can either be
     * an array of arguments (like the onese passed on a command-line),
     * or it can be a JavaScript object that has the format of a build profile
     * file.
     *
     * If it is an object, then in addition to the normal properties allowed in
     * a build profile file, the object should contain one other property:
     *
     * The object could also contain a "buildFile" property, which is a string
     * that is the file path to a build profile that contains the rest
     * of the build profile directives.
     *
     * This function does not return a status, it should throw an error if
     * there is a problem completing the build.
     */
    build = function (args) {
        var buildFile, cmdConfig, errorMsg, errorStack, stackMatch, errorTree,
            i, j, errorMod,
            stackRegExp = /( {4***REMOVED***at[^\n]+)\n/,
            standardIndent = '  ';

        return prim().start(function () {
            if (!args || lang.isArray(args)) {
                if (!args || args.length < 1) {
                    logger.error("build.js buildProfile.js\n" +
                          "where buildProfile.js is the name of the build file (see example.build.js for hints on how to make a build file).");
                    return undefined;
            ***REMOVED***

                //Next args can include a build file path as well as other build args.
                //build file path comes first. If it does not contain an = then it is
                //a build file path. Otherwise, just all build args.
                if (args[0].indexOf("=") === -1) {
                    buildFile = args[0];
                    args.splice(0, 1);
            ***REMOVED***

                //Remaining args are options to the build
                cmdConfig = build.convertArrayToObject(args);
                cmdConfig.buildFile = buildFile;
        ***REMOVED*** else {
                cmdConfig = args;
        ***REMOVED***

            return build._run(cmdConfig);
    ***REMOVED***).then(null, function (e) {
            errorMsg = e.toString();
            errorTree = e.moduleTree;
            stackMatch = stackRegExp.exec(errorMsg);

            if (stackMatch) {
                errorMsg += errorMsg.substring(0, stackMatch.index + stackMatch[0].length + 1);
        ***REMOVED***

            //If a module tree that shows what module triggered the error,
            //print it out.
            if (errorTree && errorTree.length > 0) {
                errorMsg += '\nIn module tree:\n';

                for (i = errorTree.length - 1; i > -1; i--) {
                    errorMod = errorTree[i];
                    if (errorMod) {
                        for (j = errorTree.length - i; j > -1; j--) {
                            errorMsg += standardIndent;
                    ***REMOVED***
                        errorMsg += errorMod + '\n';
                ***REMOVED***
            ***REMOVED***

                logger.error(errorMsg);
        ***REMOVED***

            errorStack = e.stack;

            if (typeof args === 'string' && args.indexOf('stacktrace=true') !== -1) {
                errorMsg += '\n' + errorStack;
        ***REMOVED*** else {
                if (!stackMatch && errorStack) {
                    //Just trim out the first "at" in the stack.
                    stackMatch = stackRegExp.exec(errorStack);
                    if (stackMatch) {
                        errorMsg += '\n' + stackMatch[0] || '';
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

            if (logger.level > logger.ERROR) {
                throw new Error(errorMsg);
        ***REMOVED*** else {
                logger.error(errorMsg);
                quit(1);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;

    build._run = function (cmdConfig) {
        var buildPaths, fileName, fileNames,
            paths, i,
            baseConfig, config,
            modules, builtModule, srcPath, buildContext,
            destPath, moduleMap, parentModuleMap, context,
            resources, resource, plugin, fileContents,
            pluginProcessed = {***REMOVED***,
            buildFileContents = "",
            pluginCollector = {***REMOVED***;

        return prim().start(function () {
            var prop, moduleName;

            //Can now run the patches to require.js to allow it to be used for
            //build generation. Do it here instead of at the top of the module
            //because we want normal require behavior to load the build tool
            //then want to switch to build mode.
            requirePatch();

            config = build.createConfig(cmdConfig);
            paths = config.paths;

            if (config.logLevel) {
                logger.logLevel(config.logLevel);
        ***REMOVED***

            //Remove the previous build dir, in case it contains source transforms,
            //like the ones done with onBuildRead and onBuildWrite.
            if (config.dir && !config.keepBuildDir && file.exists(config.dir)) {
                file.deleteFile(config.dir);
        ***REMOVED***

            if (!config.out && !config.cssIn) {
                //This is not just a one-off file build but a full build profile, with
                //lots of files to process.

                //First copy all the baseUrl content
                file.copyDir((config.appDir || config.baseUrl), config.dir, /\w/, true);

                //Adjust baseUrl if config.appDir is in play, and set up build output paths.
                buildPaths = {***REMOVED***;
                if (config.appDir) {
                    //All the paths should be inside the appDir, so just adjust
                    //the paths to use the dirBaseUrl
                    for (prop in paths) {
                        if (hasProp(paths, prop)) {
                            buildPaths[prop] = paths[prop].replace(config.appDir, config.dir);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED*** else {
                    //If no appDir, then make sure to copy the other paths to this directory.
                    for (prop in paths) {
                        if (hasProp(paths, prop)) {
                            //Set up build path for each path prefix, but only do so
                            //if the path falls out of the current baseUrl
                            if (paths[prop].indexOf(config.baseUrl) === 0) {
                                buildPaths[prop] = paths[prop].replace(config.baseUrl, config.dirBaseUrl);
                        ***REMOVED*** else {
                                buildPaths[prop] = paths[prop] === 'empty:' ? 'empty:' : prop.replace(/\./g, "/");

                                //Make sure source path is fully formed with baseUrl,
                                //if it is a relative URL.
                                srcPath = paths[prop];
                                if (srcPath.indexOf('/') !== 0 && srcPath.indexOf(':') === -1) {
                                    srcPath = config.baseUrl + srcPath;
                            ***REMOVED***

                                destPath = config.dirBaseUrl + buildPaths[prop];

                                //Skip empty: paths
                                if (srcPath !== 'empty:') {
                                    //If the srcPath is a directory, copy the whole directory.
                                    if (file.exists(srcPath) && file.isDirectory(srcPath)) {
                                        //Copy files to build area. Copy all files (the /\w/ regexp)
                                        file.copyDir(srcPath, destPath, /\w/, true);
                                ***REMOVED*** else {
                                        //Try a .js extension
                                        srcPath += '.js';
                                        destPath += '.js';
                                        file.copyFile(srcPath, destPath);
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

            //Figure out source file location for each module layer. Do this by seeding require
            //with source area configuration. This is needed so that later the module layers
            //can be manually copied over to the source area, since the build may be
            //require multiple times and the above copyDir call only copies newer files.
            require({
                baseUrl: config.baseUrl,
                paths: paths,
                packagePaths: config.packagePaths,
                packages: config.packages
        ***REMOVED***);
            buildContext = require.s.contexts._;
            modules = config.modules;

            if (modules) {
                modules.forEach(function (module) {
                    if (module.name) {
                        module._sourcePath = buildContext.nameToUrl(module.name);
                        //If the module does not exist, and this is not a "new" module layer,
                        //as indicated by a true "create" property on the module, and
                        //it is not a plugin-loaded resource, then throw an error.
                        if (!file.exists(module._sourcePath) && !module.create &&
                                module.name.indexOf('!') === -1) {
                            throw new Error("ERROR: module path does not exist: " +
                                            module._sourcePath + " for module named: " + module.name +
                                            ". Path is relative to: " + file.absPath('.'));
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***

            if (config.out) {
                //Just set up the _buildPath for the module layer.
                require(config);
                if (!config.cssIn) {
                    config.modules[0]._buildPath = typeof config.out === 'function' ?
                                                   'FUNCTION' : config.out;
            ***REMOVED***
        ***REMOVED*** else if (!config.cssIn) {
                //Now set up the config for require to use the build area, and calculate the
                //build file locations. Pass along any config info too.
                baseConfig = {
                    baseUrl: config.dirBaseUrl,
                    paths: buildPaths
            ***REMOVED***;

                lang.mixin(baseConfig, config);
                require(baseConfig);

                if (modules) {
                    modules.forEach(function (module) {
                        if (module.name) {
                            module._buildPath = buildContext.nameToUrl(module.name, null);
                            if (!module.create) {
                                file.copyFile(module._sourcePath, module._buildPath);
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***

            //Run CSS optimizations before doing JS module tracing, to allow
            //things like text loader plugins loading CSS to get the optimized
            //CSS.
            if (config.optimizeCss && config.optimizeCss !== "none" && config.dir) {
                buildFileContents += optimize.css(config.dir, config);
        ***REMOVED***
    ***REMOVED***).then(function () {
            var actions = [];

            if (modules) {
                actions = modules.map(function (module, i) {
                    return function () {
                        //Save off buildPath to module index in a hash for quicker
                        //lookup later.
                        config._buildPathToModuleIndex[module._buildPath] = i;

                        //Call require to calculate dependencies.
                        return build.traceDependencies(module, config)
                            .then(function (layer) {
                                module.layer = layer;
                        ***REMOVED***);
                ***REMOVED***;
            ***REMOVED***);

                return prim.serial(actions);
        ***REMOVED***
    ***REMOVED***).then(function () {
            var actions;

            if (modules) {
                //Now build up shadow layers for anything that should be excluded.
                //Do this after tracing dependencies for each module, in case one
                //of those modules end up being one of the excluded values.
                actions = modules.map(function (module) {
                    return function () {
                        var actions;
                        if (module.exclude) {
                            module.excludeLayers = [];
                            return prim.serial(module.exclude.map(function (exclude, i) {
                                return function () {
                                    //See if it is already in the list of modules.
                                    //If not trace dependencies for it.
                                    var found = build.findBuildModule(exclude, modules);
                                    if (found) {
                                        module.excludeLayers[i] = found;
                                ***REMOVED*** else {
                                        return build.traceDependencies({name: exclude***REMOVED***, config)
                                            .then(function (layer) {
                                                module.excludeLayers[i] = { layer: layer ***REMOVED***;
                                        ***REMOVED***);
                                ***REMOVED***
                            ***REMOVED***;
                        ***REMOVED***));
                    ***REMOVED***
                ***REMOVED***;
            ***REMOVED***);

                return prim.serial(actions);
        ***REMOVED***
    ***REMOVED***).then(function () {
            if (modules) {
                return prim.serial(modules.map(function (module) {
                    return function () {
                        if (module.exclude) {
                            //module.exclude is an array of module names. For each one,
                            //get the nested dependencies for it via a matching entry
                            //in the module.excludeLayers array.
                            module.exclude.forEach(function (excludeModule, i) {
                                var excludeLayer = module.excludeLayers[i].layer, map = excludeLayer.buildPathMap, prop;
                                for (prop in map) {
                                    if (hasProp(map, prop)) {
                                        build.removeModulePath(prop, map[prop], module.layer);
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***);
                    ***REMOVED***
                        if (module.excludeShallow) {
                            //module.excludeShallow is an array of module names.
                            //shallow exclusions are just that module itself, and not
                            //its nested dependencies.
                            module.excludeShallow.forEach(function (excludeShallowModule) {
                                var path = getOwn(module.layer.buildPathMap, excludeShallowModule);
                                if (path) {
                                    build.removeModulePath(excludeShallowModule, path, module.layer);
                            ***REMOVED***
                        ***REMOVED***);
                    ***REMOVED***

                        //Flatten them and collect the build output for each module.
                        return build.flattenModule(module, module.layer, config).then(function (builtModule) {
                            //Save it to a temp file for now, in case there are other layers that
                            //contain optimized content that should not be included in later
                            //layer optimizations. See issue #56.
                            if (module._buildPath === 'FUNCTION') {
                                module._buildText = builtModule.text;
                        ***REMOVED*** else {
                                file.saveUtf8File(module._buildPath + '-temp', builtModule.text);
                        ***REMOVED***
                            buildFileContents += builtModule.buildText;
                    ***REMOVED***);
                ***REMOVED***;
            ***REMOVED***));
        ***REMOVED***
    ***REMOVED***).then(function () {
            var moduleName;
            if (modules) {
                //Now move the build layers to their final position.
                modules.forEach(function (module) {
                    var finalPath = module._buildPath;
                    if (finalPath !== 'FUNCTION') {
                        if (file.exists(finalPath)) {
                            file.deleteFile(finalPath);
                    ***REMOVED***
                        file.renameFile(finalPath + '-temp', finalPath);

                        //And finally, if removeCombined is specified, remove
                        //any of the files that were used in this layer.
                        //Be sure not to remove other build layers.
                        if (config.removeCombined) {
                            module.layer.buildFilePaths.forEach(function (path) {
                                if (file.exists(path) && !modules.some(function (mod) {
                                        return mod._buildPath === path;
                                ***REMOVED***)) {
                                    file.deleteFile(path);
                            ***REMOVED***
                        ***REMOVED***);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***

            //If removeCombined in play, remove any empty directories that
            //may now exist because of its use
            if (config.removeCombined && !config.out && config.dir) {
                file.deleteEmptyDirs(config.dir);
        ***REMOVED***

            //Do other optimizations.
            if (config.out && !config.cssIn) {
                //Just need to worry about one JS file.
                fileName = config.modules[0]._buildPath;
                if (fileName === 'FUNCTION') {
                    config.modules[0]._buildText = optimize.js(fileName,
                                                               config.modules[0]._buildText,
                                                               null,
                                                               config);
            ***REMOVED*** else {
                    optimize.jsFile(fileName, null, fileName, config);
            ***REMOVED***
        ***REMOVED*** else if (!config.cssIn) {
                //Normal optimizations across modules.

                //JS optimizations.
                fileNames = file.getFilteredFileList(config.dir, /\.js$/, true);
                fileNames.forEach(function (fileName, i) {
                    var cfg, override, moduleIndex;

                    //Generate the module name from the config.dir root.
                    moduleName = fileName.replace(config.dir, '');
                    //Get rid of the extension
                    moduleName = moduleName.substring(0, moduleName.length - 3);

                    //If there is an override for a specific layer build module,
                    //and this file is that module, mix in the override for use
                    //by optimize.jsFile.
                    moduleIndex = getOwn(config._buildPathToModuleIndex, fileName);
                    //Normalize, since getOwn could have returned undefined
                    moduleIndex = moduleIndex === 0 || moduleIndex > 0 ? moduleIndex : -1;

                    //Try to avoid extra work if the other files do not need to
                    //be read. Build layers should be processed at the very
                    //least for optimization.
                    if (moduleIndex > -1 || !config.skipDirOptimize ||
                            config.normalizeDirDefines === "all" ||
                            config.cjsTranslate) {
                        //Convert the file to transport format, but without a name
                        //inserted (by passing null for moduleName) since the files are
                        //standalone, one module per file.
                        fileContents = file.readFile(fileName);

                        //For builds, if wanting cjs translation, do it now, so that
                        //the individual modules can be loaded cross domain via
                        //plain script tags.
                        if (config.cjsTranslate) {
                            fileContents = commonJs.convert(fileName, fileContents);
                    ***REMOVED***

                        //Only do transport normalization if this is not a build
                        //layer (since it was already normalized) and if
                        //normalizeDirDefines indicated all should be done.
                        if (moduleIndex === -1 && config.normalizeDirDefines === "all") {
                            fileContents = build.toTransport(config.namespace,
                                                         null,
                                                         fileName,
                                                         fileContents);
                    ***REMOVED***

                        override = moduleIndex > -1 ?
                                   config.modules[moduleIndex].override : null;
                        if (override) {
                            cfg = build.createOverrideConfig(config, override);
                    ***REMOVED*** else {
                            cfg = config;
                    ***REMOVED***

                        if (moduleIndex > -1 || !config.skipDirOptimize) {
                            optimize.jsFile(fileName, fileContents, fileName, cfg, pluginCollector);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);

                //Normalize all the plugin resources.
                context = require.s.contexts._;

                for (moduleName in pluginCollector) {
                    if (hasProp(pluginCollector, moduleName)) {
                        parentModuleMap = context.makeModuleMap(moduleName);
                        resources = pluginCollector[moduleName];
                        for (i = 0; i < resources.length; i++) {
                            resource = resources[i];
                            moduleMap = context.makeModuleMap(resource, parentModuleMap);
                            if (falseProp(context.plugins, moduleMap.prefix)) {
                                //Set the value in context.plugins so it
                                //will be evaluated as a full plugin.
                                context.plugins[moduleMap.prefix] = true;

                                //Do not bother if the plugin is not available.
                                if (!file.exists(require.toUrl(moduleMap.prefix + '.js'))) {
                                    continue;
                            ***REMOVED***

                                //Rely on the require in the build environment
                                //to be synchronous
                                context.require([moduleMap.prefix]);

                                //Now that the plugin is loaded, redo the moduleMap
                                //since the plugin will need to normalize part of the path.
                                moduleMap = context.makeModuleMap(resource, parentModuleMap);
                        ***REMOVED***

                            //Only bother with plugin resources that can be handled
                            //processed by the plugin, via support of the writeFile
                            //method.
                            if (falseProp(pluginProcessed, moduleMap.id)) {
                                //Only do the work if the plugin was really loaded.
                                //Using an internal access because the file may
                                //not really be loaded.
                                plugin = getOwn(context.defined, moduleMap.prefix);
                                if (plugin && plugin.writeFile) {
                                    plugin.writeFile(
                                        moduleMap.prefix,
                                        moduleMap.name,
                                        require,
                                        makeWriteFile(
                                            config.namespace
                                        ),
                                        context.config
                                    );
                            ***REMOVED***

                                pluginProcessed[moduleMap.id] = true;
                        ***REMOVED***
                    ***REMOVED***

                ***REMOVED***
            ***REMOVED***

                //console.log('PLUGIN COLLECTOR: ' + JSON.stringify(pluginCollector, null, "  "));


                //All module layers are done, write out the build.txt file.
                file.saveUtf8File(config.dir + "build.txt", buildFileContents);
        ***REMOVED***

            //If just have one CSS file to optimize, do that here.
            if (config.cssIn) {
                buildFileContents += optimize.cssFile(config.cssIn, config.out, config).buildText;
        ***REMOVED***

            if (typeof config.out === 'function') {
                config.out(config.modules[0]._buildText);
        ***REMOVED***

            //Print out what was built into which layers.
            if (buildFileContents) {
                logger.info(buildFileContents);
                return buildFileContents;
        ***REMOVED***

            return '';
    ***REMOVED***);
***REMOVED***;

    /**
     * Converts command line args like "paths.foo=../some/path"
     * result.paths = { foo: '../some/path' ***REMOVED*** where prop = paths,
     * name = paths.foo and value = ../some/path, so it assumes the
     * name=value splitting has already happened.
     */
    function stringDotToObj(result, name, value) {
        var parts = name.split('.'),
            prop = parts[0];

        parts.forEach(function (prop, i) {
            if (i === parts.length - 1) {
                result[prop] = value;
        ***REMOVED*** else {
                if (falseProp(result, prop)) {
                    result[prop] = {***REMOVED***;
            ***REMOVED***
                result = result[prop];
        ***REMOVED***

    ***REMOVED***);
***REMOVED***

    build.objProps = {
        paths: true,
        wrap: true,
        pragmas: true,
        pragmasOnSave: true,
        has: true,
        hasOnSave: true,
        uglify: true,
        closure: true,
        map: true
***REMOVED***;

    build.hasDotPropMatch = function (prop) {
        var dotProp,
            index = prop.indexOf('.');

        if (index !== -1) {
            dotProp = prop.substring(0, index);
            return hasProp(build.objProps, dotProp);
    ***REMOVED***
        return false;
***REMOVED***;

    /**
     * Converts an array that has String members of "name=value"
     * into an object, where the properties on the object are the names in the array.
     * Also converts the strings "true" and "false" to booleans for the values.
     * member name/value pairs, and converts some comma-separated lists into
     * arrays.
     * @param {Array***REMOVED*** ary
     */
    build.convertArrayToObject = function (ary) {
        var result = {***REMOVED***, i, separatorIndex, prop, value,
            needArray = {
                "include": true,
                "exclude": true,
                "excludeShallow": true,
                "insertRequire": true
        ***REMOVED***;

        for (i = 0; i < ary.length; i++) {
            separatorIndex = ary[i].indexOf("=");
            if (separatorIndex === -1) {
                throw "Malformed name/value pair: [" + ary[i] + "]. Format should be name=value";
        ***REMOVED***

            value = ary[i].substring(separatorIndex + 1, ary[i].length);
            if (value === "true") {
                value = true;
        ***REMOVED*** else if (value === "false") {
                value = false;
        ***REMOVED***

            prop = ary[i].substring(0, separatorIndex);

            //Convert to array if necessary
            if (getOwn(needArray, prop)) {
                value = value.split(",");
        ***REMOVED***

            if (build.hasDotPropMatch(prop)) {
                stringDotToObj(result, prop, value);
        ***REMOVED*** else {
                result[prop] = value;
        ***REMOVED***
    ***REMOVED***
        return result; //Object
***REMOVED***;

    build.makeAbsPath = function (path, absFilePath) {
        //Add abspath if necessary. If path starts with a slash or has a colon,
        //then already is an abolute path.
        if (path.indexOf('/') !== 0 && path.indexOf(':') === -1) {
            path = absFilePath +
                   (absFilePath.charAt(absFilePath.length - 1) === '/' ? '' : '/') +
                   path;
            path = file.normalize(path);
    ***REMOVED***
        return path.replace(lang.backSlashRegExp, '/');
***REMOVED***;

    build.makeAbsObject = function (props, obj, absFilePath) {
        var i, prop;
        if (obj) {
            for (i = 0; i < props.length; i++) {
                prop = props[i];
                if (hasProp(obj, prop) && typeof obj[prop] === 'string') {
                    obj[prop] = build.makeAbsPath(obj[prop], absFilePath);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    /**
     * For any path in a possible config, make it absolute relative
     * to the absFilePath passed in.
     */
    build.makeAbsConfig = function (config, absFilePath) {
        var props, prop, i;

        props = ["appDir", "dir", "baseUrl"];
        for (i = 0; i < props.length; i++) {
            prop = props[i];

            if (getOwn(config, prop)) {
                //Add abspath if necessary, make sure these paths end in
                //slashes
                if (prop === "baseUrl") {
                    config.originalBaseUrl = config.baseUrl;
                    if (config.appDir) {
                        //If baseUrl with an appDir, the baseUrl is relative to
                        //the appDir, *not* the absFilePath. appDir and dir are
                        //made absolute before baseUrl, so this will work.
                        config.baseUrl = build.makeAbsPath(config.originalBaseUrl, config.appDir);
                ***REMOVED*** else {
                        //The dir output baseUrl is same as regular baseUrl, both
                        //relative to the absFilePath.
                        config.baseUrl = build.makeAbsPath(config[prop], absFilePath);
                ***REMOVED***
            ***REMOVED*** else {
                    config[prop] = build.makeAbsPath(config[prop], absFilePath);
            ***REMOVED***

                config[prop] = endsWithSlash(config[prop]);
        ***REMOVED***
    ***REMOVED***

        build.makeAbsObject(["out", "cssIn"], config, absFilePath);
        build.makeAbsObject(["startFile", "endFile"], config.wrap, absFilePath);
***REMOVED***;

    build.nestedMix = {
        paths: true,
        has: true,
        hasOnSave: true,
        pragmas: true,
        pragmasOnSave: true
***REMOVED***;

    /**
     * Mixes additional source config into target config, and merges some
     * nested config, like paths, correctly.
     */
    function mixConfig(target, source) {
        var prop, value;

        for (prop in source) {
            if (hasProp(source, prop)) {
                //If the value of the property is a plain object, then
                //allow a one-level-deep mixing of it.
                value = source[prop];
                if (typeof value === 'object' && value &&
                        !lang.isArray(value) && !lang.isFunction(value) &&
                        !lang.isRegExp(value)) {
                    target[prop] = lang.mixin({***REMOVED***, target[prop], value, true);
            ***REMOVED*** else {
                    target[prop] = value;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    /**
     * Converts a wrap.startFile or endFile to be start/end as a string.
     * the startFile/endFile values can be arrays.
     */
    function flattenWrapFile(wrap, keyName, absFilePath) {
        var keyFileName = keyName + 'File';

        if (typeof wrap[keyName] !== 'string' && wrap[keyFileName]) {
            wrap[keyName] = '';
            if (typeof wrap[keyFileName] === 'string') {
                wrap[keyFileName] = [wrap[keyFileName]];
        ***REMOVED***
            wrap[keyFileName].forEach(function (fileName) {
                wrap[keyName] += (wrap[keyName] ? '\n' : '') +
                    file.readFile(build.makeAbsPath(fileName, absFilePath));
        ***REMOVED***);
    ***REMOVED*** else if (typeof wrap[keyName] !== 'string') {
            throw new Error('wrap.' + keyName + ' or wrap.' + keyFileName + ' malformed');
    ***REMOVED***
***REMOVED***

    /**
     * Creates a config object for an optimization build.
     * It will also read the build profile if it is available, to create
     * the configuration.
     *
     * @param {Object***REMOVED*** cfg config options that take priority
     * over defaults and ones in the build file. These options could
     * be from a command line, for instance.
     *
     * @param {Object***REMOVED*** the created config object.
     */
    build.createConfig = function (cfg) {
        /*jslint evil: true */
        var config = {***REMOVED***, buildFileContents, buildFileConfig, mainConfig,
            mainConfigFile, mainConfigPath, prop, buildFile, absFilePath;

        //Make sure all paths are relative to current directory.
        absFilePath = file.absPath('.');
        build.makeAbsConfig(cfg, absFilePath);
        build.makeAbsConfig(buildBaseConfig, absFilePath);

        lang.mixin(config, buildBaseConfig);
        lang.mixin(config, cfg, true);

        if (config.buildFile) {
            //A build file exists, load it to get more config.
            buildFile = file.absPath(config.buildFile);

            //Find the build file, and make sure it exists, if this is a build
            //that has a build profile, and not just command line args with an in=path
            if (!file.exists(buildFile)) {
                throw new Error("ERROR: build file does not exist: " + buildFile);
        ***REMOVED***

            absFilePath = config.baseUrl = file.absPath(file.parent(buildFile));

            //Load build file options.
            buildFileContents = file.readFile(buildFile);
            try {
                buildFileConfig = eval("(" + buildFileContents + ")");
                build.makeAbsConfig(buildFileConfig, absFilePath);

                //Mix in the config now so that items in mainConfigFile can
                //be resolved relative to them if necessary, like if appDir
                //is set here, but the baseUrl is in mainConfigFile. Will
                //re-mix in the same build config later after mainConfigFile
                //is processed, since build config should take priority.
                mixConfig(config, buildFileConfig);
        ***REMOVED*** catch (e) {
                throw new Error("Build file " + buildFile + " is malformed: " + e);
        ***REMOVED***
    ***REMOVED***

        mainConfigFile = config.mainConfigFile || (buildFileConfig && buildFileConfig.mainConfigFile);
        if (mainConfigFile) {
            mainConfigFile = build.makeAbsPath(mainConfigFile, absFilePath);
            if (!file.exists(mainConfigFile)) {
                throw new Error(mainConfigFile + ' does not exist.');
        ***REMOVED***
            try {
                mainConfig = parse.findConfig(mainConfigFile, file.readFile(mainConfigFile));
        ***REMOVED*** catch (configError) {
                throw new Error('The config in mainConfigFile ' +
                        mainConfigFile +
                        ' cannot be used because it cannot be evaluated' +
                        ' correctly while running in the optimizer. Try only' +
                        ' using a config that is also valid JSON, or do not use' +
                        ' mainConfigFile and instead copy the config values needed' +
                        ' into a build file or command line arguments given to the optimizer.');
        ***REMOVED***
            if (mainConfig) {
                mainConfigPath = mainConfigFile.substring(0, mainConfigFile.lastIndexOf('/'));

                //Add in some existing config, like appDir, since they can be
                //used inside the mainConfigFile -- paths and baseUrl are
                //relative to them.
                if (config.appDir && !mainConfig.appDir) {
                    mainConfig.appDir = config.appDir;
            ***REMOVED***

                //If no baseUrl, then use the directory holding the main config.
                if (!mainConfig.baseUrl) {
                    mainConfig.baseUrl = mainConfigPath;
            ***REMOVED***

                build.makeAbsConfig(mainConfig, mainConfigPath);
                mixConfig(config, mainConfig);
        ***REMOVED***
    ***REMOVED***

        //Mix in build file config, but only after mainConfig has been mixed in.
        if (buildFileConfig) {
            mixConfig(config, buildFileConfig);
    ***REMOVED***

        //Re-apply the override config values. Command line
        //args should take precedence over build file values.
        mixConfig(config, cfg);

        //Fix paths to full paths so that they can be adjusted consistently
        //lately to be in the output area.
        lang.eachProp(config.paths, function (value, prop) {
            if (lang.isArray(value)) {
                throw new Error('paths fallback not supported in optimizer. ' +
                                'Please provide a build config path override ' +
                                'for ' + prop);
        ***REMOVED***
            config.paths[prop] = build.makeAbsPath(value, config.baseUrl);
    ***REMOVED***);

        //Set final output dir
        if (hasProp(config, "baseUrl")) {
            if (config.appDir) {
                config.dirBaseUrl = build.makeAbsPath(config.originalBaseUrl, config.dir);
        ***REMOVED*** else {
                config.dirBaseUrl = config.dir || config.baseUrl;
        ***REMOVED***
            //Make sure dirBaseUrl ends in a slash, since it is
            //concatenated with other strings.
            config.dirBaseUrl = endsWithSlash(config.dirBaseUrl);
    ***REMOVED***

        //Check for errors in config
        if (config.main) {
            throw new Error('"main" passed as an option, but the ' +
                            'supported option is called "name".');
    ***REMOVED***
        if (!config.name && !config.modules && !config.include && !config.cssIn) {
            throw new Error('Missing either a "name", "include" or "modules" ' +
                            'option');
    ***REMOVED***
        if (config.cssIn) {
            if (config.dir || config.appDir) {
                throw new Error('cssIn is only for the output of single file ' +
                    'CSS optimizations and is not compatible with "dir" or "appDir" configuration.');
        ***REMOVED***
            if (!config.out) {
                throw new Error('"out" option missing.');
        ***REMOVED***
    ***REMOVED***
        if (!config.cssIn && !config.baseUrl) {
            //Just use the current directory as the baseUrl
            config.baseUrl = './';
    ***REMOVED***
        if (!config.out && !config.dir) {
            throw new Error('Missing either an "out" or "dir" config value. ' +
                            'If using "appDir" for a full project optimization, ' +
                            'use "dir". If you want to optimize to one file, ' +
                            'use "out".');
    ***REMOVED***
        if (config.appDir && config.out) {
            throw new Error('"appDir" is not compatible with "out". Use "dir" ' +
                            'instead. appDir is used to copy whole projects, ' +
                            'where "out" is used to just optimize to one file.');
    ***REMOVED***
        if (config.out && config.dir) {
            throw new Error('The "out" and "dir" options are incompatible.' +
                            ' Use "out" if you are targeting a single file for' +
                            ' for optimization, and "dir" if you want the appDir' +
                            ' or baseUrl directories optimized.');
    ***REMOVED***

        if (config.insertRequire && !lang.isArray(config.insertRequire)) {
            throw new Error('insertRequire should be a list of module IDs' +
                            ' to insert in to a require([]) call.');
    ***REMOVED***

        if (config.generateSourceMaps) {
            if (config.preserveLicenseComments) {
                throw new Error('Cannot use preserveLicenseComments and ' +
                    'generateSourceMaps together. Either explcitly set ' +
                    'preserveLicenseComments to false (default is true) or ' +
                    'turn off generateSourceMaps. If you want source maps with ' +
                    'license comments, see: ' +
                    'http://requirejs.org/docs/errors.html#sourcemapcomments');
        ***REMOVED*** else if (config.optimize !== 'none' &&
                       config.optimize !== 'closure' &&
                       config.optimize !== 'uglify2') {
                //Allow optimize: none to pass, since it is useful when toggling
                //minification on and off to debug something, and it implicitly
                //works, since it does not need a source map.
                throw new Error('optimize: "' + config.optimize +
                    '" does not support generateSourceMaps.');
        ***REMOVED***
    ***REMOVED***

        if ((config.name || config.include) && !config.modules) {
            //Just need to build one file, but may be part of a whole appDir/
            //baseUrl copy, but specified on the command line, so cannot do
            //the modules array setup. So create a modules section in that
            //case.
            config.modules = [
                {
                    name: config.name,
                    out: config.out,
                    create: config.create,
                    include: config.include,
                    exclude: config.exclude,
                    excludeShallow: config.excludeShallow,
                    insertRequire: config.insertRequire,
                    stubModules: config.stubModules
            ***REMOVED***
            ];
            delete config.stubModules;
    ***REMOVED*** else if (config.modules && config.out) {
            throw new Error('If the "modules" option is used, then there ' +
                            'should be a "dir" option set and "out" should ' +
                            'not be used since "out" is only for single file ' +
                            'optimization output.');
    ***REMOVED*** else if (config.modules && config.name) {
            throw new Error('"name" and "modules" options are incompatible. ' +
                            'Either use "name" if doing a single file ' +
                            'optimization, or "modules" if you want to target ' +
                            'more than one file for optimization.');
    ***REMOVED***

        if (config.out && !config.cssIn) {
            //Just one file to optimize.

            //Does not have a build file, so set up some defaults.
            //Optimizing CSS should not be allowed, unless explicitly
            //asked for on command line. In that case the only task is
            //to optimize a CSS file.
            if (!cfg.optimizeCss) {
                config.optimizeCss = "none";
        ***REMOVED***
    ***REMOVED***

        //Cycle through modules and combine any local stubModules with
        //global values.
        if (config.modules && config.modules.length) {
            config.modules.forEach(function (mod) {
                if (config.stubModules) {
                    mod.stubModules = config.stubModules.concat(mod.stubModules || []);
            ***REMOVED***

                //Create a hash lookup for the stubModules config to make lookup
                //cheaper later.
                if (mod.stubModules) {
                    mod.stubModules._byName = {***REMOVED***;
                    mod.stubModules.forEach(function (id) {
                        mod.stubModules._byName[id] = true;
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

        //Get any wrap text.
        try {
            if (config.wrap) {
                if (config.wrap === true) {
                    //Use default values.
                    config.wrap = {
                        start: '(function () {',
                        end: '***REMOVED***());'
                ***REMOVED***;
            ***REMOVED*** else {
                    flattenWrapFile(config.wrap, 'start', absFilePath);
                    flattenWrapFile(config.wrap, 'end', absFilePath);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED*** catch (wrapError) {
            throw new Error('Malformed wrap config: need both start/end or ' +
                            'startFile/endFile: ' + wrapError.toString());
    ***REMOVED***

        //Do final input verification
        if (config.context) {
            throw new Error('The build argument "context" is not supported' +
                            ' in a build. It should only be used in web' +
                            ' pages.');
    ***REMOVED***

        //Set up normalizeDirDefines. If not explicitly set, if optimize "none",
        //set to "skip" otherwise set to "all".
        if (!hasProp(config, 'normalizeDirDefines')) {
            if (config.optimize === 'none' || config.skipDirOptimize) {
                config.normalizeDirDefines = 'skip';
        ***REMOVED*** else {
                config.normalizeDirDefines = 'all';
        ***REMOVED***
    ***REMOVED***

        //Set file.fileExclusionRegExp if desired
        if (hasProp(config, 'fileExclusionRegExp')) {
            if (typeof config.fileExclusionRegExp === "string") {
                file.exclusionRegExp = new RegExp(config.fileExclusionRegExp);
        ***REMOVED*** else {
                file.exclusionRegExp = config.fileExclusionRegExp;
        ***REMOVED***
    ***REMOVED*** else if (hasProp(config, 'dirExclusionRegExp')) {
            //Set file.dirExclusionRegExp if desired, this is the old
            //name for fileExclusionRegExp before 1.0.2. Support for backwards
            //compatibility
            file.exclusionRegExp = config.dirExclusionRegExp;
    ***REMOVED***

        //Remove things that may cause problems in the build.
        delete config.jQuery;
        delete config.enforceDefine;
        delete config.urlArgs;

        return config;
***REMOVED***;

    /**
     * finds the module being built/optimized with the given moduleName,
     * or returns null.
     * @param {String***REMOVED*** moduleName
     * @param {Array***REMOVED*** modules
     * @returns {Object***REMOVED*** the module object from the build profile, or null.
     */
    build.findBuildModule = function (moduleName, modules) {
        var i, module;
        for (i = 0; i < modules.length; i++) {
            module = modules[i];
            if (module.name === moduleName) {
                return module;
        ***REMOVED***
    ***REMOVED***
        return null;
***REMOVED***;

    /**
     * Removes a module name and path from a layer, if it is supposed to be
     * excluded from the layer.
     * @param {String***REMOVED*** moduleName the name of the module
     * @param {String***REMOVED*** path the file path for the module
     * @param {Object***REMOVED*** layer the layer to remove the module/path from
     */
    build.removeModulePath = function (module, path, layer) {
        var index = layer.buildFilePaths.indexOf(path);
        if (index !== -1) {
            layer.buildFilePaths.splice(index, 1);
    ***REMOVED***
***REMOVED***;

    /**
     * Uses the module build config object to trace the dependencies for the
     * given module.
     *
     * @param {Object***REMOVED*** module the module object from the build config info.
     * @param {Object***REMOVED*** the build config object.
     *
     * @returns {Object***REMOVED*** layer information about what paths and modules should
     * be in the flattened module.
     */
    build.traceDependencies = function (module, config) {
        var include, override, layer, context, baseConfig, oldContext,
            registry, id, idParts, pluginId, mod, errUrl,
            errMessage = '',
            failedPluginMap = {***REMOVED***,
            failedPluginIds = [],
            errIds = [],
            errUrlMap = {***REMOVED***,
            errUrlConflicts = {***REMOVED***,
            hasErrUrl = false,
            deferred = prim();

        //Reset some state set up in requirePatch.js, and clean up require's
        //current context.
        oldContext = require._buildReset();

        //Grab the reset layer and context after the reset, but keep the
        //old config to reuse in the new context.
        baseConfig = oldContext.config;
        layer = require._layer;
        context = layer.context;

        //Put back basic config, use a fresh object for it.
        //WARNING: probably not robust for paths and packages/packagePaths,
        //since those property's objects can be modified. But for basic
        //config clone it works out.
        require(lang.mixin({***REMOVED***, baseConfig, true));

        logger.trace("\nTracing dependencies for: " + (module.name || module.out));
        include = module.name && !module.create ? [module.name] : [];
        if (module.include) {
            include = include.concat(module.include);
    ***REMOVED***

        //If there are overrides to basic config, set that up now.;
        if (module.override) {
            override = lang.mixin({***REMOVED***, baseConfig, true);
            lang.mixin(override, module.override, true);
            require(override);
    ***REMOVED***

        //Figure out module layer dependencies by calling require to do the work.
        //Configure the callbacks to be called.
        deferred.resolve.__requireJsBuild = true;
        deferred.reject.__requireJsBuild = true;
        require(include, deferred.resolve, deferred.reject);

        return deferred.promise.then(function () {
            var id, prop;

            //Reset config
            if (module.override) {
                require(baseConfig);
        ***REMOVED***

            //Check to see if it all loaded. If not, then stop, and give
            //a message on what is left.
            registry = context.registry;
            for (id in registry) {
                if (hasProp(registry, id) && id.indexOf('_@r') !== 0) {
                    mod = getOwn(registry, id);
                    if (id.indexOf('_unnormalized') === -1 && mod && mod.enabled) {
                        errIds.push(id);
                        errUrl = mod.map.url;

                        if (errUrlMap[errUrl]) {
                            hasErrUrl = true;
                            //This error module has the same URL as another
                            //error module, could be misconfiguration.
                            if (!errUrlConflicts[errUrl]) {
                                errUrlConflicts[errUrl] = [];
                                //Store the original module that had the same URL.
                                errUrlConflicts[errUrl].push(errUrlMap[errUrl]);
                        ***REMOVED***
                            errUrlConflicts[errUrl].push(id);
                    ***REMOVED*** else {
                            errUrlMap[errUrl] = id;
                    ***REMOVED***
                ***REMOVED***

                    //Look for plugins that did not call load()
                    idParts = id.split('!');
                    pluginId = idParts[0];
                    if (idParts.length > 1 && falseProp(failedPluginMap, pluginId)) {
                        failedPluginIds.push(pluginId);
                        failedPluginMap[pluginId] = true;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

            if (errIds.length || failedPluginIds.length) {
                if (failedPluginIds.length) {
                    errMessage += 'Loader plugin' +
                        (failedPluginIds.length === 1 ? '' : 's') +
                        ' did not call ' +
                        'the load callback in the build: ' +
                        failedPluginIds.join(', ') + '\n';
            ***REMOVED***
                errMessage += 'Module loading did not complete for: ' + errIds.join(', ');

                if (hasErrUrl) {
                    errMessage += '\nThe following modules share the same URL. This ' +
                                  'could be a misconfiguration if that URL only has ' +
                                  'one anonymous module in it:';
                    for (prop in errUrlConflicts) {
                        if (hasProp(errUrlConflicts, prop)) {
                            errMessage += '\n' + prop + ': ' +
                                          errUrlConflicts[prop].join(', ');
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
                throw new Error(errMessage);
        ***REMOVED***

            return layer;
    ***REMOVED***);
***REMOVED***;

    build.createOverrideConfig = function (config, override) {
        var cfg = {***REMOVED***;

        lang.mixin(cfg, config, true);
        lang.eachProp(override, function (value, prop) {
            if (hasProp(build.objProps, prop)) {
                //An object property, merge keys. Start a new object
                //so that source object in config does not get modified.
                cfg[prop] = {***REMOVED***;
                lang.mixin(cfg[prop], config[prop], true);
                lang.mixin(cfg[prop], override[prop], true);
        ***REMOVED*** else {
                cfg[prop] = override[prop];
        ***REMOVED***
    ***REMOVED***);
        return cfg;
***REMOVED***;

    /**
     * Uses the module build config object to create an flattened version
     * of the module, with deep dependencies included.
     *
     * @param {Object***REMOVED*** module the module object from the build config info.
     *
     * @param {Object***REMOVED*** layer the layer object returned from build.traceDependencies.
     *
     * @param {Object***REMOVED*** the build config object.
     *
     * @returns {Object***REMOVED*** with two properties: "text", the text of the flattened
     * module, and "buildText", a string of text representing which files were
     * included in the flattened module text.
     */
    build.flattenModule = function (module, layer, config) {
        var fileContents,
            buildFileContents = '';

        return prim().start(function () {
            var path, reqIndex, currContents,
                i, moduleName, shim, packageConfig,
                parts, builder, writeApi, tempPragmas,
                namespace, namespaceWithDot, stubModulesByName,
                newConfig = {***REMOVED***,
                context = layer.context,
                onLayerEnds = [],
                onLayerEndAdded = {***REMOVED***;

            //Use override settings, particularly for pragmas
            //Do this before the var readings since it reads config values.
            if (module.override) {
                config = build.createOverrideConfig(config, module.override);
        ***REMOVED***

            namespace = config.namespace || '';
            namespaceWithDot = namespace ? namespace + '.' : '';
            stubModulesByName = (module.stubModules && module.stubModules._byName) || {***REMOVED***;

            //Start build output for the module.
            buildFileContents += "\n" +
                                 (config.dir ? module._buildPath.replace(config.dir, "") : module._buildPath) +
                                 "\n----------------\n";

            //If there was an existing file with require in it, hoist to the top.
            if (layer.existingRequireUrl) {
                reqIndex = layer.buildFilePaths.indexOf(layer.existingRequireUrl);
                if (reqIndex !== -1) {
                    layer.buildFilePaths.splice(reqIndex, 1);
                    layer.buildFilePaths.unshift(layer.existingRequireUrl);
            ***REMOVED***
        ***REMOVED***

            //Write the built module to disk, and build up the build output.
            fileContents = "";
            return prim.serial(layer.buildFilePaths.map(function (path) {
                return function () {
                    moduleName = layer.buildFileToModule[path];
                    //If the moduleName is for a package main, then update it to the
                    //real main value.
                    packageConfig = layer.context.config.pkgs &&
                                    getOwn(layer.context.config.pkgs, moduleName);
                    if (packageConfig) {
                        moduleName += '/' + packageConfig.main;
                ***REMOVED***

                    return prim().start(function () {
                        //Figure out if the module is a result of a build plugin, and if so,
                        //then delegate to that plugin.
                        parts = context.makeModuleMap(moduleName);
                        builder = parts.prefix && getOwn(context.defined, parts.prefix);
                        if (builder) {
                            if (builder.onLayerEnd && falseProp(onLayerEndAdded, parts.prefix)) {
                                onLayerEnds.push(builder);
                                onLayerEndAdded[parts.prefix] = true;
                        ***REMOVED***

                            if (builder.write) {
                                writeApi = function (input) {
                                    fileContents += "\n" + addSemiColon(input);
                                    if (config.onBuildWrite) {
                                        fileContents = config.onBuildWrite(moduleName, path, fileContents);
                                ***REMOVED***
                            ***REMOVED***;
                                writeApi.asModule = function (moduleName, input) {
                                    fileContents += "\n" +
                                        addSemiColon(build.toTransport(namespace, moduleName, path, input, layer, {
                                            useSourceUrl: layer.context.config.useSourceUrl
                                    ***REMOVED***));
                                    if (config.onBuildWrite) {
                                        fileContents = config.onBuildWrite(moduleName, path, fileContents);
                                ***REMOVED***
                            ***REMOVED***;
                                builder.write(parts.prefix, parts.name, writeApi);
                        ***REMOVED***
                            return;
                    ***REMOVED*** else {
                            return prim().start(function () {
                                if (hasProp(stubModulesByName, moduleName)) {
                                    //Just want to insert a simple module definition instead
                                    //of the source module. Useful for plugins that inline
                                    //all their resources.
                                    if (hasProp(layer.context.plugins, moduleName)) {
                                        //Slightly different content for plugins, to indicate
                                        //that dynamic loading will not work.
                                        return 'define({load: function(id){throw new Error("Dynamic load not allowed: " + id);***REMOVED******REMOVED***);';
                                ***REMOVED*** else {
                                        return 'define({***REMOVED***);';
                                ***REMOVED***
                            ***REMOVED*** else {
                                    return require._cacheReadAsync(path);
                            ***REMOVED***
                        ***REMOVED***).then(function (text) {
                                currContents = text;

                                if (config.cjsTranslate) {
                                    currContents = commonJs.convert(path, currContents);
                            ***REMOVED***

                                if (config.onBuildRead) {
                                    currContents = config.onBuildRead(moduleName, path, currContents);
                            ***REMOVED***

                                if (namespace) {
                                    currContents = pragma.namespace(currContents, namespace);
                            ***REMOVED***

                                currContents = build.toTransport(namespace, moduleName, path, currContents, layer, {
                                    useSourceUrl: config.useSourceUrl
                            ***REMOVED***);

                                if (packageConfig) {
                                    currContents = addSemiColon(currContents) + '\n';
                                    currContents += namespaceWithDot + "define('" +
                                                    packageConfig.name + "', ['" + moduleName +
                                                    "'], function (main) { return main; ***REMOVED***);\n";
                            ***REMOVED***

                                if (config.onBuildWrite) {
                                    currContents = config.onBuildWrite(moduleName, path, currContents);
                            ***REMOVED***

                                //Semicolon is for files that are not well formed when
                                //concatenated with other content.
                                fileContents += "\n" + addSemiColon(currContents);
                        ***REMOVED***);
                    ***REMOVED***
                ***REMOVED***).then(function () {
                        buildFileContents += path.replace(config.dir, "") + "\n";
                        //Some files may not have declared a require module, and if so,
                        //put in a placeholder call so the require does not try to load them
                        //after the module is processed.
                        //If we have a name, but no defined module, then add in the placeholder.
                        if (moduleName && falseProp(layer.modulesWithNames, moduleName) && !config.skipModuleInsertion) {
                            shim = config.shim && getOwn(config.shim, moduleName);
                            if (shim) {
                                fileContents += '\n' + namespaceWithDot + 'define("' + moduleName + '", ' +
                                                 (shim.deps && shim.deps.length ?
                                                        build.makeJsArrayString(shim.deps) + ', ' : '') +
                                                 (shim.exportsFn ? shim.exportsFn() : 'function(){***REMOVED***') +
                                                 ');\n';
                        ***REMOVED*** else {
                                fileContents += '\n' + namespaceWithDot + 'define("' + moduleName + '", function(){***REMOVED***);\n';
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***;
        ***REMOVED***)).then(function () {
                if (onLayerEnds.length) {
                    onLayerEnds.forEach(function (builder) {
                        var path;
                        if (typeof module.out === 'string') {
                            path = module.out;
                    ***REMOVED*** else if (typeof module._buildPath === 'string') {
                            path = module._buildPath;
                    ***REMOVED***
                        builder.onLayerEnd(function (input) {
                            fileContents += "\n" + addSemiColon(input);
                      ***REMOVED*** {
                            name: module.name,
                            path: path
                    ***REMOVED***);
                ***REMOVED***);
            ***REMOVED***

                //Add a require at the end to kick start module execution, if that
                //was desired. Usually this is only specified when using small shim
                //loaders like almond.
                if (module.insertRequire) {
                    fileContents += '\n' + namespaceWithDot + 'require(["' + module.insertRequire.join('", "') + '"]);\n';
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***).then(function () {
            return {
                text: config.wrap ?
                        config.wrap.start + fileContents + config.wrap.end :
                        fileContents,
                buildText: buildFileContents
        ***REMOVED***;
    ***REMOVED***);
***REMOVED***;

    //Converts an JS array of strings to a string representation.
    //Not using JSON.stringify() for Rhino's sake.
    build.makeJsArrayString = function (ary) {
        return '["' + ary.map(function (item) {
            //Escape any double quotes, backslashes
            return lang.jsEscape(item);
    ***REMOVED***).join('","') + '"]';
***REMOVED***;

    build.toTransport = function (namespace, moduleName, path, contents, layer, options) {
        var baseUrl = layer && layer.context.config.baseUrl;

        function onFound(info) {
            //Only mark this module as having a name if not a named module,
            //or if a named module and the name matches expectations.
            if (layer && (info.needsId || info.foundId === moduleName)) {
                layer.modulesWithNames[moduleName] = true;
        ***REMOVED***
    ***REMOVED***

        //Convert path to be a local one to the baseUrl, useful for
        //useSourceUrl.
        if (baseUrl) {
            path = path.replace(baseUrl, '');
    ***REMOVED***

        return transform.toTransport(namespace, moduleName, path, contents, onFound, options);
***REMOVED***;

    return build;
***REMOVED***);

***REMOVED***


    /**
     * Sets the default baseUrl for requirejs to be directory of top level
     * script.
     */
    function setBaseUrl(fileName) {
        //Use the file name's directory as the baseUrl if available.
        dir = fileName.replace(/\\/g, '/');
        if (dir.indexOf('/') !== -1) {
            dir = dir.split('/');
            dir.pop();
            dir = dir.join('/');
            exec("require({baseUrl: '" + dir + "'***REMOVED***);");
    ***REMOVED***
***REMOVED***

    function createRjsApi() {
        //Create a method that will run the optimzer given an object
        //config.
        requirejs.optimize = function (config, callback, errback) {
            if (!loadedOptimizedLib) {
                loadLib();
                loadedOptimizedLib = true;
        ***REMOVED***

            //Create the function that will be called once build modules
            //have been loaded.
            var runBuild = function (build, logger) {
                //Make sure config has a log level, and if not,
                //make it "silent" by default.
                config.logLevel = config.hasOwnProperty('logLevel') ?
                                  config.logLevel : logger.SILENT;

                //Reset build internals first in case this is part
                //of a long-running server process that could have
                //exceptioned out in a bad state. It is only defined
                //after the first call though.
                if (requirejs._buildReset) {
                    requirejs._buildReset();
                    requirejs._cacheReset();
            ***REMOVED***

                function done(result) {
                    //And clean up, in case something else triggers
                    //a build in another pathway.
                    if (requirejs._buildReset) {
                        requirejs._buildReset();
                        requirejs._cacheReset();
                ***REMOVED***

                    return result;
            ***REMOVED***

                build(config).then(done, done).then(callback, errback);
        ***REMOVED***;

            requirejs({
                context: 'build'
          ***REMOVED*** ['build', 'logger'], runBuild);
    ***REMOVED***;

        requirejs.tools = {
            useLib: function (contextName, callback) {
                if (!callback) {
                    callback = contextName;
                    contextName = 'uselib';
            ***REMOVED***

                if (!useLibLoaded[contextName]) {
                    loadLib();
                    useLibLoaded[contextName] = true;
            ***REMOVED***

                var req = requirejs({
                    context: contextName
            ***REMOVED***);

                req(['build'], function () {
                    callback(req);
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;

        requirejs.define = define;
***REMOVED***

    //If in Node, and included via a require('requirejs'), just export and
    //THROW IT ON THE GROUND!
    if (env === 'node' && reqMain !== module) {
        setBaseUrl(path.resolve(reqMain ? reqMain.filename : '.'));

        createRjsApi();

        module.exports = requirejs;
        return;
***REMOVED*** else if (env === 'browser') {
        //Only option is to use the API.
        setBaseUrl(location.href);
        createRjsApi();
        return;
***REMOVED***

    if (commandOption === 'o') {
        //Do the optimizer work.
        loadLib();

        /**
 * @license Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/*
 * Create a build.js file that has the build options you want and pass that
 * build file to this file to do the build. See example.build.js for more information.
 */

/*jslint strict: false, nomen: false */
/*global require: false */

require({
    baseUrl: require.s.contexts._.config.baseUrl,
    //Use a separate context than the default context so that the
    //build can use the default context.
    context: 'build',
    catchError: {
        define: true
***REMOVED***
***REMOVED***,       ['env!env/args', 'build'],
function (args,            build) {
    build(args);
***REMOVED***);


***REMOVED*** else if (commandOption === 'v') {
        console.log('r.js: ' + version + ', RequireJS: ' + this.requirejsVars.require.version);
***REMOVED*** else if (commandOption === 'convert') {
        loadLib();

        this.requirejsVars.require(['env!env/args', 'commonJs', 'env!env/print'],
            function (args, commonJs, print) {

                var srcDir, outDir;
                srcDir = args[0];
                outDir = args[1];

                if (!srcDir || !outDir) {
                    print('Usage: path/to/commonjs/modules output/dir');
                    return;
            ***REMOVED***

                commonJs.convertDir(args[0], args[1]);
        ***REMOVED***);
***REMOVED*** else {
        //Just run an app

        //Load the bundled libraries for use in the app.
        if (commandOption === 'lib') {
            loadLib();
    ***REMOVED***

        setBaseUrl(fileName);

        if (exists(fileName)) {
            exec(readFile(fileName), fileName);
    ***REMOVED*** else {
            showHelp();
    ***REMOVED***
***REMOVED***

***REMOVED***((typeof console !== 'undefined' ? console : undefined),
    (typeof Packages !== 'undefined' ? Array.prototype.slice.call(arguments, 0) : []),
    (typeof readFile !== 'undefined' ? readFile : undefined)));
