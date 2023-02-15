// doT.js
// 2011, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

;(function() {
	"use strict";

	var doT = {
		version: '1.0.0',
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?\***REMOVED***?)\***REMOVED***\***REMOVED***/g,
			interpolate: /\{\{=([\s\S]+?)\***REMOVED***\***REMOVED***/g,
			encode:      /\{\{!([\s\S]+?)\***REMOVED***\***REMOVED***/g,
			use:         /\{\{#([\s\S]+?)\***REMOVED***\***REMOVED***/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\***REMOVED***]+\***REMOVED***)/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\***REMOVED***\***REMOVED***/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\***REMOVED***\***REMOVED***/g,
			iterate:     /\{\{~\s*(?:\***REMOVED***\***REMOVED***|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\***REMOVED***\***REMOVED***)/g,
			varname:	'it',
			strip:		true,
			append:		true,
			selfcontained: false
		***REMOVED***,
		template: undefined, //fn, compile template
		compile:  undefined  //fn, for express
	***REMOVED***, global;

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = doT;
	***REMOVED*** else if (typeof define === 'function' && define.amd) {
		define(function(){return doT;***REMOVED***);
	***REMOVED*** else {
		global = (function(){ return this || (0,eval)('this'); ***REMOVED***());
		global.doT = doT;
	***REMOVED***

	function encodeHTMLSource() {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' ***REMOVED***,
			matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
		return function() {
			return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;***REMOVED***) : this;
		***REMOVED***;
	***REMOVED***
	String.prototype.encodeHTML = encodeHTMLSource();

	var startend = {
		append: { start: "'+(",      end: ")+'",      endencode: "||'').toString().encodeHTML()+'" ***REMOVED***,
		split:  { start: "';out+=(", end: ");out+='", endencode: "||'').toString().encodeHTML();out+='"***REMOVED***
	***REMOVED***, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === 'string') ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf('def.') === 0) {
				code = code.substring(4);
			***REMOVED***
			if (!(code in def)) {
				if (assign === ':') {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v***REMOVED***;
					***REMOVED***);
					if (!(code in def)) def[code]= value;
				***REMOVED*** else {
					new Function("def", "def['"+code+"']=" + value)(def);
				***REMOVED***
			***REMOVED***
			return '';
		***REMOVED***)
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, '_');
					def.__exp = def.__exp || {***REMOVED***;
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				***REMOVED***
			***REMOVED***);
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		***REMOVED***);
	***REMOVED***

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
	***REMOVED***

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {***REMOVED***) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
			.replace(/'|\\/g, '\\$&')
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			***REMOVED***)
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.start + unescape(code) + cse.endencode;
			***REMOVED***)
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';***REMOVED***else if(" + unescape(code) + "){out+='" : "';***REMOVED***else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';***REMOVED***out+='");
			***REMOVED***)
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';***REMOVED*** ***REMOVED*** out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			***REMOVED***)
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			***REMOVED***)
			+ "';return out;")
			.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
			.replace(/(\s|;|\***REMOVED***|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
			.replace(/(\s|;|\***REMOVED***|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode && c.selfcontained) {
			str = "String.prototype.encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
		***REMOVED***
		try {
			return new Function(c.varname, str);
		***REMOVED*** catch (e) {
			if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
			throw e;
		***REMOVED***
	***REMOVED***;

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	***REMOVED***;
***REMOVED***());