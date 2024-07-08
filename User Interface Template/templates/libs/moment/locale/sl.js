//! moment.js locale configuration

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
***REMOVED***(this, (function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var result = number + ' ';
        switch (key) {
            case 's':
                return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
            case 'ss':
                if (number === 1) {
                    result += withoutSuffix ? 'sekundo' : 'sekundi';
            ***REMOVED*** else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'sekundi' : 'sekundah';
            ***REMOVED*** else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'sekunde' : 'sekundah';
            ***REMOVED*** else {
                    result += 'sekund';
            ***REMOVED***
                return result;
            case 'm':
                return withoutSuffix ? 'ena minuta' : 'eno minuto';
            case 'mm':
                if (number === 1) {
                    result += withoutSuffix ? 'minuta' : 'minuto';
            ***REMOVED*** else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
            ***REMOVED*** else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'minute' : 'minutami';
            ***REMOVED*** else {
                    result += withoutSuffix || isFuture ? 'minut' : 'minutami';
            ***REMOVED***
                return result;
            case 'h':
                return withoutSuffix ? 'ena ura' : 'eno uro';
            case 'hh':
                if (number === 1) {
                    result += withoutSuffix ? 'ura' : 'uro';
            ***REMOVED*** else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'uri' : 'urama';
            ***REMOVED*** else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'ure' : 'urami';
            ***REMOVED*** else {
                    result += withoutSuffix || isFuture ? 'ur' : 'urami';
            ***REMOVED***
                return result;
            case 'd':
                return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
            case 'dd':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'dan' : 'dnem';
            ***REMOVED*** else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
            ***REMOVED*** else {
                    result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
            ***REMOVED***
                return result;
            case 'M':
                return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
            case 'MM':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
            ***REMOVED*** else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
            ***REMOVED*** else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
            ***REMOVED*** else {
                    result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
            ***REMOVED***
                return result;
            case 'y':
                return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
            case 'yy':
                if (number === 1) {
                    result += withoutSuffix || isFuture ? 'leto' : 'letom';
            ***REMOVED*** else if (number === 2) {
                    result += withoutSuffix || isFuture ? 'leti' : 'letoma';
            ***REMOVED*** else if (number < 5) {
                    result += withoutSuffix || isFuture ? 'leta' : 'leti';
            ***REMOVED*** else {
                    result += withoutSuffix || isFuture ? 'let' : 'leti';
            ***REMOVED***
                return result;
    ***REMOVED***
***REMOVED***

    var sl = moment.defineLocale('sl', {
        months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
        monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
        monthsParseExact: true,
        weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
        weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
        weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'H:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY H:mm',
            LLLL : 'dddd, D. MMMM YYYY H:mm'
      ***REMOVED***
        calendar : {
            sameDay  : '[danes ob] LT',
            nextDay  : '[jutri ob] LT',

            nextWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[v] [nedeljo] [ob] LT';
                    case 3:
                        return '[v] [sredo] [ob] LT';
                    case 6:
                        return '[v] [soboto] [ob] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[v] dddd [ob] LT';
            ***REMOVED***
          ***REMOVED***
            lastDay  : '[včeraj ob] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[prejšnjo] [nedeljo] [ob] LT';
                    case 3:
                        return '[prejšnjo] [sredo] [ob] LT';
                    case 6:
                        return '[prejšnjo] [soboto] [ob] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[prejšnji] dddd [ob] LT';
            ***REMOVED***
          ***REMOVED***
            sameElse : 'L'
      ***REMOVED***
        relativeTime : {
            future : 'čez %s',
            past   : 'pred %s',
            s      : processRelativeTime,
            ss     : processRelativeTime,
            m      : processRelativeTime,
            mm     : processRelativeTime,
            h      : processRelativeTime,
            hh     : processRelativeTime,
            d      : processRelativeTime,
            dd     : processRelativeTime,
            M      : processRelativeTime,
            MM     : processRelativeTime,
            y      : processRelativeTime,
            yy     : processRelativeTime
      ***REMOVED***
        dayOfMonthOrdinalParse: /\d{1,2***REMOVED***\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
    ***REMOVED***
***REMOVED***);

    return sl;

***REMOVED***)));
