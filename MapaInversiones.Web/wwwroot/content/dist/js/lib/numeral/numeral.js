// numeral.js
// version : 1.4.7
// author : Adam Draper
// license : MIT
// http://adamwdraper.github.com/Numeral-js/

(function () {

    /************************************
        Constants
    ************************************/

    var numeral,
        VERSION = '1.4.7',
        // internal storage for language config files
        languages = {***REMOVED***,
        currentLanguage = 'en',
        zeroFormat = null,
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    /************************************
        Constructors
    ************************************/


    // Numeral prototype object
    function Numeral (number) {
        this._n = number;
***REMOVED***

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
     * problems for accounting- and finance-related software.
     */
    function toFixed (value, precision, optionals) {
        var power = Math.pow(10, precision),
            output;

        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (Math.round(value * power) / power).toFixed(precision);

        if (optionals) {
            var optionalsRegExp = new RegExp('0{1,' + optionals + '***REMOVED***$');
            output = output.replace(optionalsRegExp, '');
    ***REMOVED***

        return output;
***REMOVED***

    /************************************
        Formatting
    ************************************/

    // determine what type of formatting we need to do
    function formatNumeral (n, format) {
        var output;

        // figure out what kind of format we are dealing with
        if (format.indexOf('$') > -1) { // currency!!!!!
            output = formatCurrency(n, format);
    ***REMOVED*** else if (format.indexOf('%') > -1) { // percentage
            output = formatPercentage(n, format);
    ***REMOVED*** else if (format.indexOf(':') > -1) { // time
            output = formatTime(n, format);
    ***REMOVED*** else { // plain ol' numbers or bytes
            output = formatNumber(n, format);
    ***REMOVED***

        // return string
        return output;
***REMOVED***

    // revert to number
    function unformatNumeral (n, string) {
        if (string.indexOf(':') > -1) {
            n._n = unformatTime(string);
    ***REMOVED*** else {
            if (string === zeroFormat) {
                n._n = 0;
        ***REMOVED*** else {
                var stringOriginal = string;
                if (languages[currentLanguage].delimiters.decimal !== '.') {
                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
            ***REMOVED***

                // see if abbreviations are there so that we can multiply to the correct number
                var thousandRegExp = new RegExp(languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$'),
                    millionRegExp = new RegExp(languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$'),
                    billionRegExp = new RegExp(languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$'),
                    trillionRegExp = new RegExp(languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

                // see if bytes are there so that we can multiply to the correct number
                var prefixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    bytesMultiplier = false;

                for (var power = 0; power <= prefixes.length; power++) {
                    bytesMultiplier = (string.indexOf(prefixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

                    if (bytesMultiplier) {
                        break;
                ***REMOVED***
            ***REMOVED***

                // do some math to create our number
                n._n = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * Number(((string.indexOf('(') > -1) ? '-' : '') + string.replace(/[^0-9\.-]+/g, ''));

                // round if we are talking about bytes
                n._n = (bytesMultiplier) ? Math.ceil(n._n) : n._n;
        ***REMOVED***
    ***REMOVED***
        return n._n;
***REMOVED***

    function formatCurrency (n, format) {
        var prependSymbol = (format.indexOf('$') <= 1) ? true : false;

        // remove $ for the moment
        var space = '';

        // check for space before or after currency
        if (format.indexOf(' $') > -1) {
            space = ' ';
            format = format.replace(' $', '');
    ***REMOVED*** else if (format.indexOf('$ ') > -1) {
            space = ' ';
            format = format.replace('$ ', '');
    ***REMOVED*** else {
            format = format.replace('$', '');
    ***REMOVED***

        // format the number
        var output = formatNumeral(n, format);

        // position the symbol
        if (prependSymbol) {
            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
                output = output.split('');
                output.splice(1, 0, languages[currentLanguage].currency.symbol + space);
                output = output.join('');
        ***REMOVED*** else {
                output = languages[currentLanguage].currency.symbol + space + output;
        ***REMOVED***
    ***REMOVED*** else {
            if (output.indexOf(')') > -1) {
                output = output.split('');
                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
                output = output.join('');
        ***REMOVED*** else {
                output = output + space + languages[currentLanguage].currency.symbol;
        ***REMOVED***
    ***REMOVED***

        return output;
***REMOVED***

    function formatPercentage (n, format) {
        var space = '';
        // check for space before %
        if (format.indexOf(' %') > -1) {
            space = ' ';
            format = format.replace(' %', '');
    ***REMOVED*** else {
            format = format.replace('%', '');
    ***REMOVED***

        n._n = n._n * 100;
        var output = formatNumeral(n, format);
        if (output.indexOf(')') > -1 ) {
            output = output.split('');
            output.splice(-1, 0, space + '%');
            output = output.join('');
    ***REMOVED*** else {
            output = output + space + '%';
    ***REMOVED***
        return output;
***REMOVED***

    function formatTime (n, format) {
        var hours = Math.floor(n._n/60/60),
            minutes = Math.floor((n._n - (hours * 60 * 60))/60),
            seconds = Math.round(n._n - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
***REMOVED***

    function unformatTime (string) {
        var timeArray = string.split(':'),
            seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
    ***REMOVED*** else if (timeArray.lenght === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
    ***REMOVED***
        return Number(seconds);
***REMOVED***

    function formatNumber (n, format) {
        var negP = false,
            optDec = false,
            abbr = '',
            bytes = '',
            ord = '',
            abs = Math.abs(n._n);

        // check if number is zero and a custom zero format has been set
        if (n._n === 0 && zeroFormat !== null) {
            return zeroFormat;
    ***REMOVED*** else {
            // see if we should use parentheses for negative number
            if (format.indexOf('(') > -1) {
                negP = true;
                format = format.slice(1, -1);
        ***REMOVED***

            // see if abbreviation is wanted
            if (format.indexOf('a') > -1) {
                // check for space before abbreviation
                if (format.indexOf(' a') > -1) {
                    abbr = ' ';
                    format = format.replace(' a', '');
            ***REMOVED*** else {
                    format = format.replace('a', '');
            ***REMOVED***

                if (abs >= Math.pow(10, 12)) {
                    // trillion
                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
                    n._n = n._n / Math.pow(10, 12);
            ***REMOVED*** else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
                    // billion
                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
                    n._n = n._n / Math.pow(10, 9);
            ***REMOVED*** else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
                    // million
                    abbr = abbr + languages[currentLanguage].abbreviations.million;
                    n._n = n._n / Math.pow(10, 6);
            ***REMOVED*** else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
                    // thousand
                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
                    n._n = n._n / Math.pow(10, 3);
            ***REMOVED***
        ***REMOVED***

            // see if we are formatting bytes
            if (format.indexOf('b') > -1) {
                // check for space before
                if (format.indexOf(' b') > -1) {
                    bytes = ' ';
                    format = format.replace(' b', '');
            ***REMOVED*** else {
                    format = format.replace('b', '');
            ***REMOVED***

                var prefixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    min,
                    max;

                for (var power = 0; power <= prefixes.length; power++) {
                    min = Math.pow(1024, power);
                    max = Math.pow(1024, power+1);

                    if (n._n >= min && n._n < max) {
                        bytes = bytes + prefixes[power];
                        if (min > 0) {
                            n._n = n._n / min;
                    ***REMOVED***
                        break;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

            // see if ordinal is wanted
            if (format.indexOf('o') > -1) {
                // check for space before
                if (format.indexOf(' o') > -1) {
                    ord = ' ';
                    format = format.replace(' o', '');
            ***REMOVED*** else {
                    format = format.replace('o', '');
            ***REMOVED***

                ord = ord + languages[currentLanguage].ordinal(n._n);
        ***REMOVED***

            if (format.indexOf('[.]') > -1) {
                optDec = true;
                format = format.replace('[.]', '.');
        ***REMOVED***

            var w = n._n.toString().split('.')[0],
                precision = format.split('.')[1],
                thousands = format.indexOf(','),
                d = '',
                neg = false;

            if (precision) {
                if (precision.indexOf('[') > -1) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    d = toFixed(n._n, (precision[0].length + precision[1].length), precision[1].length);
            ***REMOVED*** else {
                    d = toFixed(n._n, precision.length);
            ***REMOVED***

                w = d.split('.')[0];

                if (d.split('.')[1].length) {
                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
            ***REMOVED*** else {
                    d = '';
            ***REMOVED***

                if (optDec && Number(d) === 0) {
                    d = '';
            ***REMOVED***
        ***REMOVED*** else {
                w = toFixed(n._n, null);
        ***REMOVED***

            // format number
            if (w.indexOf('-') > -1) {
                w = w.slice(1);
                neg = true;
        ***REMOVED***

            if (thousands > -1) {
                w = w.toString().replace(/(\d)(?=(\d{3***REMOVED***)+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
        ***REMOVED***

            if (format.indexOf('.') === 0) {
                w = '';
        ***REMOVED***

            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
    ***REMOVED***
***REMOVED***

    /************************************
        Top Level Functions
    ************************************/

    numeral = function (input) {
        if (numeral.isNumeral(input)) {
            input = input.value();
    ***REMOVED*** else if (!Number(input)) {
            input = 0;
    ***REMOVED***

        return new Numeral(Number(input));
***REMOVED***;

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
***REMOVED***;

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    numeral.language = function (key, values) {
        if (!key) {
            return currentLanguage;
    ***REMOVED***

        if (key && !values) {
            currentLanguage = key;
    ***REMOVED***

        if (values || !languages[key]) {
            loadLanguage(key, values);
    ***REMOVED***

        return numeral;
***REMOVED***;

    numeral.language('en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
      ***REMOVED***
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
      ***REMOVED***
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
      ***REMOVED***
        currency: {
            symbol: '$'
    ***REMOVED***
***REMOVED***);

    numeral.zeroFormat = function (format) {
        if (typeof(format) === 'string') {
            zeroFormat = format;
    ***REMOVED*** else {
            zeroFormat = null;
    ***REMOVED***
***REMOVED***;

    /************************************
        Helpers
    ************************************/

    function loadLanguage(key, values) {
        languages[key] = values;
***REMOVED***


    /************************************
        Numeral Prototype
    ************************************/


    numeral.fn = Numeral.prototype = {

        clone : function () {
            return numeral(this);
      ***REMOVED***

        format : function (inputString) {
            return formatNumeral(this, inputString ? inputString : numeral.defaultFormat);
      ***REMOVED***

        unformat : function (inputString) {
            return unformatNumeral(this, inputString ? inputString : numeral.defaultFormat);
      ***REMOVED***

        value : function () {
            return this._n;
      ***REMOVED***

        valueOf : function () {
            return this._n;
      ***REMOVED***

        set : function (value) {
            this._n = Number(value);
            return this;
      ***REMOVED***

        add : function (value) {
            this._n = this._n + Number(value);
            return this;
      ***REMOVED***

        subtract : function (value) {
            this._n = this._n - Number(value);
            return this;
      ***REMOVED***

        multiply : function (value) {
            this._n = this._n * Number(value);
            return this;
      ***REMOVED***

        divide : function (value) {
            this._n = this._n / Number(value);
            return this;
      ***REMOVED***

        difference : function (value) {
            var difference = this._n - Number(value);

            if (difference < 0) {
                difference = -difference;
        ***REMOVED***

            return difference;
    ***REMOVED***

***REMOVED***;

    /************************************
        Exposing Numeral
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = numeral;
***REMOVED***

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `numeral` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this['numeral'] = numeral;
***REMOVED***

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return numeral;
    ***REMOVED***);
***REMOVED***
***REMOVED***).call(this);
