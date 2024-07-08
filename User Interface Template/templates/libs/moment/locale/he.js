//! moment.js locale configuration

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
***REMOVED***(this, (function (moment) { 'use strict';


    var he = moment.defineLocale('he', {
        months : 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
        monthsShort : 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
        weekdays : 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
        weekdaysShort : 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
        weekdaysMin : 'א_ב_ג_ד_ה_ו_ש'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [ב]MMMM YYYY',
            LLL : 'D [ב]MMMM YYYY HH:mm',
            LLLL : 'dddd, D [ב]MMMM YYYY HH:mm',
            l : 'D/M/YYYY',
            ll : 'D MMM YYYY',
            lll : 'D MMM YYYY HH:mm',
            llll : 'ddd, D MMM YYYY HH:mm'
      ***REMOVED***
        calendar : {
            sameDay : '[היום ב־]LT',
            nextDay : '[מחר ב־]LT',
            nextWeek : 'dddd [בשעה] LT',
            lastDay : '[אתמול ב־]LT',
            lastWeek : '[ביום] dddd [האחרון בשעה] LT',
            sameElse : 'L'
      ***REMOVED***
        relativeTime : {
            future : 'בעוד %s',
            past : 'לפני %s',
            s : 'מספר שניות',
            ss : '%d שניות',
            m : 'דקה',
            mm : '%d דקות',
            h : 'שעה',
            hh : function (number) {
                if (number === 2) {
                    return 'שעתיים';
            ***REMOVED***
                return number + ' שעות';
          ***REMOVED***
            d : 'יום',
            dd : function (number) {
                if (number === 2) {
                    return 'יומיים';
            ***REMOVED***
                return number + ' ימים';
          ***REMOVED***
            M : 'חודש',
            MM : function (number) {
                if (number === 2) {
                    return 'חודשיים';
            ***REMOVED***
                return number + ' חודשים';
          ***REMOVED***
            y : 'שנה',
            yy : function (number) {
                if (number === 2) {
                    return 'שנתיים';
            ***REMOVED*** else if (number % 10 === 0 && number !== 10) {
                    return number + ' שנה';
            ***REMOVED***
                return number + ' שנים';
        ***REMOVED***
      ***REMOVED***
        meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
        isPM : function (input) {
            return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
      ***REMOVED***
        meridiem : function (hour, minute, isLower) {
            if (hour < 5) {
                return 'לפנות בוקר';
        ***REMOVED*** else if (hour < 10) {
                return 'בבוקר';
        ***REMOVED*** else if (hour < 12) {
                return isLower ? 'לפנה"צ' : 'לפני הצהריים';
        ***REMOVED*** else if (hour < 18) {
                return isLower ? 'אחה"צ' : 'אחרי הצהריים';
        ***REMOVED*** else {
                return 'בערב';
        ***REMOVED***
    ***REMOVED***
***REMOVED***);

    return he;

***REMOVED***)));
