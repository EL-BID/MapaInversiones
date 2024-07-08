/*!
* inputmask.extensions.js
* https://github.com/RobinHerbots/Inputmask
* Copyright (c) 2010 - 2019 Robin Herbots
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
* Version: 4.0.9
*/

(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([ "./inputmask" ], factory);
***REMOVED*** else if (typeof exports === "object") {
        module.exports = factory(require("./inputmask"));
***REMOVED*** else {
        factory(window.Inputmask);
***REMOVED***
***REMOVED***)(function(Inputmask) {
    Inputmask.extendDefinitions({
        A: {
            validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
            casing: "upper"
      ***REMOVED***
        "&": {
            validator: "[0-9A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
            casing: "upper"
      ***REMOVED***
        "#": {
            validator: "[0-9A-Fa-f]",
            casing: "upper"
    ***REMOVED***
***REMOVED***);
    Inputmask.extendAliases({
        cssunit: {
            regex: "[+-]?[0-9]+\\.?([0-9]+)?(px|em|rem|ex|%|in|cm|mm|pt|pc)"
      ***REMOVED***
        url: {
            regex: "(https?|ftp)//.*",
            autoUnmask: false
      ***REMOVED***
        ip: {
            mask: "i[i[i]].i[i[i]].i[i[i]].i[i[i]]",
            definitions: {
                i: {
                    validator: function(chrs, maskset, pos, strict, opts) {
                        if (pos - 1 > -1 && maskset.buffer[pos - 1] !== ".") {
                            chrs = maskset.buffer[pos - 1] + chrs;
                            if (pos - 2 > -1 && maskset.buffer[pos - 2] !== ".") {
                                chrs = maskset.buffer[pos - 2] + chrs;
                        ***REMOVED*** else chrs = "0" + chrs;
                    ***REMOVED*** else chrs = "00" + chrs;
                        return new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]").test(chrs);
                ***REMOVED***
            ***REMOVED***
          ***REMOVED***
            onUnMask: function(maskedValue, unmaskedValue, opts) {
                return maskedValue;
          ***REMOVED***
            inputmode: "numeric"
      ***REMOVED***
        email: {
            mask: "*{1,64***REMOVED***[.*{1,64***REMOVED***][.*{1,64***REMOVED***][.*{1,63***REMOVED***]@-{1,63***REMOVED***.-{1,63***REMOVED***[.-{1,63***REMOVED***][.-{1,63***REMOVED***]",
            greedy: false,
            casing: "lower",
            onBeforePaste: function(pastedValue, opts) {
                pastedValue = pastedValue.toLowerCase();
                return pastedValue.replace("mailto:", "");
          ***REMOVED***
            definitions: {
                "*": {
                    validator: "[0-9\uff11-\uff19A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5!#$%&'*+/=?^_`{|***REMOVED***~-]"
              ***REMOVED***
                "-": {
                    validator: "[0-9A-Za-z-]"
            ***REMOVED***
          ***REMOVED***
            onUnMask: function(maskedValue, unmaskedValue, opts) {
                return maskedValue;
          ***REMOVED***
            inputmode: "email"
      ***REMOVED***
        mac: {
            mask: "##:##:##:##:##:##"
      ***REMOVED***
        vin: {
            mask: "V{13***REMOVED***9{4***REMOVED***",
            definitions: {
                V: {
                    validator: "[A-HJ-NPR-Za-hj-npr-z\\d]",
                    casing: "upper"
            ***REMOVED***
          ***REMOVED***
            clearIncomplete: true,
            autoUnmask: true
    ***REMOVED***
***REMOVED***);
    return Inputmask;
***REMOVED***);