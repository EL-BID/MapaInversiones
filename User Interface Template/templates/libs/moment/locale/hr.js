//! moment.js locale configuration

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
***REMOVED***(this, (function (moment) { 'use strict';


    function translate(number, withoutSuffix, key) {
        var result = number + ' ';
        switch (key) {
            case 'ss':
                if (number === 1) {
                    result += 'sekunda';
            ***REMOVED*** else if (number === 2 || number === 3 || number === 4) {
                    result += 'sekunde';
            ***REMOVED*** else {
                    result += 'sekundi';
            ***REMOVED***
                return result;
            case 'm':
                return withoutSuffix ? 'jedna minuta' : 'jedne minute';
            case 'mm':
                if (number === 1) {
                    result += 'minuta';
            ***REMOVED*** else if (number === 2 || number === 3 || number === 4) {
                    result += 'minute';
            ***REMOVED*** else {
                    result += 'minuta';
            ***REMOVED***
                return result;
            case 'h':
                return withoutSuffix ? 'jedan sat' : 'jednog sata';
            case 'hh':
                if (number === 1) {
                    result += 'sat';
            ***REMOVED*** else if (number === 2 || number === 3 || number === 4) {
                    result += 'sata';
            ***REMOVED*** else {
                    result += 'sati';
            ***REMOVED***
                return result;
            case 'dd':
                if (number === 1) {
                    result += 'dan';
            ***REMOVED*** else {
                    result += 'dana';
            ***REMOVED***
                return result;
            case 'MM':
                if (number === 1) {
                    result += 'mjesec';
            ***REMOVED*** else if (number === 2 || number === 3 || number === 4) {
                    result += 'mjeseca';
            ***REMOVED*** else {
                    result += 'mjeseci';
            ***REMOVED***
                return result;
            case 'yy':
                if (number === 1) {
                    result += 'godina';
            ***REMOVED*** else if (number === 2 || number === 3 || number === 4) {
                    result += 'godine';
            ***REMOVED*** else {
                    result += 'godina';
            ***REMOVED***
                return result;
    ***REMOVED***
***REMOVED***

    var hr = moment.defineLocale('hr', {
        months : {
            format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
            standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
      ***REMOVED***
        monthsShort : 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
        monthsParseExact: true,
        weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
        weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
        weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
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
            sameDay  : '[danas u] LT',
            nextDay  : '[sutra u] LT',
            nextWeek : function () {
                switch (this.day()) {
                    case 0:
                        return '[u] [nedjelju] [u] LT';
                    case 3:
                        return '[u] [srijedu] [u] LT';
                    case 6:
                        return '[u] [subotu] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[u] dddd [u] LT';
            ***REMOVED***
          ***REMOVED***
            lastDay  : '[jučer u] LT',
            lastWeek : function () {
                switch (this.day()) {
                    case 0:
                    case 3:
                        return '[prošlu] dddd [u] LT';
                    case 6:
                        return '[prošle] [subote] [u] LT';
                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        return '[prošli] dddd [u] LT';
            ***REMOVED***
          ***REMOVED***
            sameElse : 'L'
      ***REMOVED***
        relativeTime : {
            future : 'za %s',
            past   : 'prije %s',
            s      : 'par sekundi',
            ss     : translate,
            m      : translate,
            mm     : translate,
            h      : translate,
            hh     : translate,
            d      : 'dan',
            dd     : translate,
            M      : 'mjesec',
            MM     : translate,
            y      : 'godinu',
            yy     : translate
      ***REMOVED***
        dayOfMonthOrdinalParse: /\d{1,2***REMOVED***\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 7th is the first week of the year.
    ***REMOVED***
***REMOVED***);

    return hr;

***REMOVED***)));
