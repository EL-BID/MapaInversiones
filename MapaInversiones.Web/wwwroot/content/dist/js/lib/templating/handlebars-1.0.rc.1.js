// lib/handlebars/base.js

/*jshint eqnull:true*/
this.Handlebars = {***REMOVED***;

(function(Handlebars) {

Handlebars.VERSION = "1.0.rc.1";

Handlebars.helpers  = {***REMOVED***;
Handlebars.partials = {***REMOVED***;

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; ***REMOVED***
  this.helpers[name] = fn;
***REMOVED***;

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
***REMOVED***;

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  ***REMOVED*** else {
    throw new Error("Could not find property '" + arg + "'");
  ***REMOVED***
***REMOVED***);

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {***REMOVED***, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); ***REMOVED***

  if(context === true) {
    return fn(this);
  ***REMOVED*** else if(context === false || context == null) {
    return inverse(this);
  ***REMOVED*** else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
***REMOVED*** else {
      return inverse(this);
***REMOVED***
  ***REMOVED*** else {
    return fn(context);
  ***REMOVED***
***REMOVED***);

Handlebars.K = function() {***REMOVED***;

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
***REMOVED***;

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  ***REMOVED***

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      if (data) { data.index = i; ***REMOVED***
      ret = ret + fn(context[i], { data: data ***REMOVED***);
***REMOVED***
  ***REMOVED*** else {
    ret = inverse(this);
  ***REMOVED***
  return ret;
***REMOVED***);

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); ***REMOVED***

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  ***REMOVED*** else {
    return options.fn(this);
  ***REMOVED***
***REMOVED***);

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
***REMOVED***);

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
***REMOVED***);

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
***REMOVED***);

***REMOVED***(this.Handlebars));
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { ***REMOVED***,
yy: {***REMOVED***,
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"DATA":27,"param":28,"STRING":29,"INTEGER":30,"BOOLEAN":31,"hashSegments":32,"hashSegment":33,"ID":34,"EQUALS":35,"pathSegments":36,"SEP":37,"$accept":0,"$end":1***REMOVED***,
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",27:"DATA",29:"STRING",30:"INTEGER",31:"BOOLEAN",34:"ID",35:"EQUALS",37:"SEP"***REMOVED***,
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[17,1],[25,2],[25,1],[28,1],[28,1],[28,1],[28,1],[28,1],[26,1],[32,2],[32,1],[33,3],[33,3],[33,3],[33,3],[33,3],[21,1],[36,3],[36,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]; 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]); 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]); 
break;
case 4: this.$ = new yy.ProgramNode([]); 
break;
case 5: this.$ = [$$[$0]]; 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 7: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0]); 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0]); 
break;
case 9: this.$ = $$[$0]; 
break;
case 10: this.$ = $$[$0]; 
break;
case 11: this.$ = new yy.ContentNode($$[$0]); 
break;
case 12: this.$ = new yy.CommentNode($$[$0]); 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 15: this.$ = $$[$0-1]; 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true); 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]); 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]); 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]]; 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null]; 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]]; 
break;
case 24: this.$ = [[$$[$0]], null]; 
break;
case 25: this.$ = [[new yy.DataNode($$[$0])], null]; 
break;
case 26: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 27: this.$ = [$$[$0]]; 
break;
case 28: this.$ = $$[$0]; 
break;
case 29: this.$ = new yy.StringNode($$[$0]); 
break;
case 30: this.$ = new yy.IntegerNode($$[$0]); 
break;
case 31: this.$ = new yy.BooleanNode($$[$0]); 
break;
case 32: this.$ = new yy.DataNode($$[$0]); 
break;
case 33: this.$ = new yy.HashNode($$[$0]); 
break;
case 34: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 35: this.$ = [$$[$0]]; 
break;
case 36: this.$ = [$$[$0-2], $$[$0]]; 
break;
case 37: this.$ = [$$[$0-2], new yy.StringNode($$[$0])]; 
break;
case 38: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])]; 
break;
case 39: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])]; 
break;
case 40: this.$ = [$$[$0-2], new yy.DataNode($$[$0])]; 
break;
case 41: this.$ = new yy.IdNode($$[$0]); 
break;
case 42: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 43: this.$ = [$$[$0]]; 
break;
***REMOVED***
***REMOVED***,
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]***REMOVED***,{1:[3]***REMOVED***,{5:[1,16]***REMOVED***,{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]***REMOVED***,{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]***REMOVED***,{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]***REMOVED***,{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]***REMOVED***,{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]***REMOVED***,{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]***REMOVED***,{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]***REMOVED***,{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]***REMOVED***,{17:22,21:23,27:[1,24],34:[1,26],36:25***REMOVED***,{17:27,21:23,27:[1,24],34:[1,26],36:25***REMOVED***,{17:28,21:23,27:[1,24],34:[1,26],36:25***REMOVED***,{17:29,21:23,27:[1,24],34:[1,26],36:25***REMOVED***,{21:30,34:[1,26],36:25***REMOVED***,{1:[2,1]***REMOVED***,{6:31,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]***REMOVED***,{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]***REMOVED***,{17:22,18:[1,32],21:23,27:[1,24],34:[1,26],36:25***REMOVED***,{10:33,20:[1,34]***REMOVED***,{10:35,20:[1,34]***REMOVED***,{18:[1,36]***REMOVED***,{18:[2,24],21:41,25:37,26:38,27:[1,45],28:39,29:[1,42],30:[1,43],31:[1,44],32:40,33:46,34:[1,47],36:25***REMOVED***,{18:[2,25]***REMOVED***,{18:[2,41],27:[2,41],29:[2,41],30:[2,41],31:[2,41],34:[2,41],37:[1,48]***REMOVED***,{18:[2,43],27:[2,43],29:[2,43],30:[2,43],31:[2,43],34:[2,43],37:[2,43]***REMOVED***,{18:[1,49]***REMOVED***,{18:[1,50]***REMOVED***,{18:[1,51]***REMOVED***,{18:[1,52],21:53,34:[1,26],36:25***REMOVED***,{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]***REMOVED***,{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]***REMOVED***,{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]***REMOVED***,{21:54,34:[1,26],36:25***REMOVED***,{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]***REMOVED***,{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]***REMOVED***,{18:[2,22],21:41,26:55,27:[1,45],28:56,29:[1,42],30:[1,43],31:[1,44],32:40,33:46,34:[1,47],36:25***REMOVED***,{18:[2,23]***REMOVED***,{18:[2,27],27:[2,27],29:[2,27],30:[2,27],31:[2,27],34:[2,27]***REMOVED***,{18:[2,33],33:57,34:[1,58]***REMOVED***,{18:[2,28],27:[2,28],29:[2,28],30:[2,28],31:[2,28],34:[2,28]***REMOVED***,{18:[2,29],27:[2,29],29:[2,29],30:[2,29],31:[2,29],34:[2,29]***REMOVED***,{18:[2,30],27:[2,30],29:[2,30],30:[2,30],31:[2,30],34:[2,30]***REMOVED***,{18:[2,31],27:[2,31],29:[2,31],30:[2,31],31:[2,31],34:[2,31]***REMOVED***,{18:[2,32],27:[2,32],29:[2,32],30:[2,32],31:[2,32],34:[2,32]***REMOVED***,{18:[2,35],34:[2,35]***REMOVED***,{18:[2,43],27:[2,43],29:[2,43],30:[2,43],31:[2,43],34:[2,43],35:[1,59],37:[2,43]***REMOVED***,{34:[1,60]***REMOVED***,{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]***REMOVED***,{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]***REMOVED***,{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]***REMOVED***,{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]***REMOVED***,{18:[1,61]***REMOVED***,{18:[1,62]***REMOVED***,{18:[2,21]***REMOVED***,{18:[2,26],27:[2,26],29:[2,26],30:[2,26],31:[2,26],34:[2,26]***REMOVED***,{18:[2,34],34:[2,34]***REMOVED***,{35:[1,59]***REMOVED***,{21:63,27:[1,67],29:[1,64],30:[1,65],31:[1,66],34:[1,26],36:25***REMOVED***,{18:[2,42],27:[2,42],29:[2,42],30:[2,42],31:[2,42],34:[2,42],37:[2,42]***REMOVED***,{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]***REMOVED***,{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]***REMOVED***,{18:[2,36],34:[2,36]***REMOVED***,{18:[2,37],34:[2,37]***REMOVED***,{18:[2,38],34:[2,38]***REMOVED***,{18:[2,39],34:[2,39]***REMOVED***,{18:[2,40],34:[2,40]***REMOVED***],
defaultActions: {16:[2,1],24:[2,25],38:[2,23],55:[2,21]***REMOVED***,
parseError: function parseError(str, hash) {
    throw new Error(str);
***REMOVED***,
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {***REMOVED***;
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
***REMOVED***
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
    ***REMOVED***
        return token;
***REMOVED***
    var symbol, preErrorSymbol, state, action, a, r, yyval = {***REMOVED***, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
    ***REMOVED*** else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
        ***REMOVED***
            action = table[state] && table[state][symbol];
    ***REMOVED***
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                ***REMOVED***
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
            ***REMOVED*** else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
            ***REMOVED***
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected***REMOVED***);
        ***REMOVED***
    ***REMOVED***
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
    ***REMOVED***
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
        ***REMOVED*** else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
        ***REMOVED***
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column***REMOVED***;
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
        ***REMOVED***
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
        ***REMOVED***
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
        ***REMOVED***
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
    ***REMOVED***
***REMOVED***
    return true;
***REMOVED***
***REMOVED***;
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
    ***REMOVED*** else {
            throw new Error(str);
    ***REMOVED***
  ***REMOVED***
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0***REMOVED***;
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
  ***REMOVED***
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
    ***REMOVED*** else {
            this.yylloc.last_column++;
    ***REMOVED***
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
  ***REMOVED***
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
      ***REMOVED***;

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
    ***REMOVED***
        return this;
  ***REMOVED***
more:function () {
        this._more = true;
        return this;
  ***REMOVED***
less:function (n) {
        this.unput(this.match.slice(n));
  ***REMOVED***
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
  ***REMOVED***
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
    ***REMOVED***
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
  ***REMOVED***
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
  ***REMOVED***
next:function () {
        if (this.done) {
            return this.EOF;
    ***REMOVED***
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
    ***REMOVED***
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
        ***REMOVED***
    ***REMOVED***
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length***REMOVED***;
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
        ***REMOVED***
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
    ***REMOVED***
        if (this._input === "") {
            return this.EOF;
    ***REMOVED*** else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno***REMOVED***);
    ***REMOVED***
  ***REMOVED***
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
    ***REMOVED*** else {
            return this.lex();
    ***REMOVED***
  ***REMOVED***
begin:function begin(condition) {
        this.conditionStack.push(condition);
  ***REMOVED***
popState:function popState() {
        return this.conditionStack.pop();
  ***REMOVED***
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
  ***REMOVED***
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
  ***REMOVED***
pushState:function begin(condition) {
        this.begin(condition);
***REMOVED******REMOVED***);
lexer.options = {***REMOVED***;
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2:
                                   if(yy_.yytext.slice(-1) !== "\\") this.popState();
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1);
                                   return 14;
                                 
break;
case 3: return 24; 
break;
case 4: return 16; 
break;
case 5: return 20; 
break;
case 6: return 19; 
break;
case 7: return 19; 
break;
case 8: return 23; 
break;
case 9: return 23; 
break;
case 10: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 11: return 22; 
break;
case 12: return 35; 
break;
case 13: return 34; 
break;
case 14: return 34; 
break;
case 15: return 37; 
break;
case 16: /*ignore whitespace*/ 
break;
case 17: this.popState(); return 18; 
break;
case 18: this.popState(); return 18; 
break;
case 19: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 29; 
break;
case 20: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 29; 
break;
case 21: yy_.yytext = yy_.yytext.substr(1); return 27; 
break;
case 22: return 31; 
break;
case 23: return 31; 
break;
case 24: return 30; 
break;
case 25: return 34; 
break;
case 26: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 34; 
break;
case 27: return 'INVALID'; 
break;
case 28: return 5; 
break;
***REMOVED***
***REMOVED***;
lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,***REMOVED***?(?=(\{\{|$)))/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{![\s\S]*?\***REMOVED***\***REMOVED***)/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[***REMOVED*** ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\***REMOVED***\***REMOVED***\***REMOVED***)/,/^(?:\***REMOVED***\***REMOVED***)/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@[a-zA-Z]+)/,/^(?:true(?=[***REMOVED***\s]))/,/^(?:false(?=[***REMOVED***\s]))/,/^(?:[0-9]+(?=[***REMOVED***\s]))/,/^(?:[a-zA-Z0-9_$-]+(?=[=***REMOVED***\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"inclusive":false***REMOVED***,"emu":{"rules":[2],"inclusive":false***REMOVED***,"INITIAL":{"rules":[0,1,28],"inclusive":true***REMOVED******REMOVED***;
return lexer;***REMOVED***)()
parser.lexer = lexer;
function Parser () { this.yy = {***REMOVED***; ***REMOVED***Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
***REMOVED***)();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = handlebars;
exports.Parser = handlebars.Parser;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); ***REMOVED***
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    var source, cwd;
    if (typeof process !== 'undefined') {
        source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
***REMOVED*** else {
        source = require("file").path(require("file").cwd()).join(args[1]).read({charset: "utf-8"***REMOVED***);
***REMOVED***
    return exports.parser.parse(source);
***REMOVED***
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
***REMOVED***
***REMOVED***;
;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
***REMOVED***;

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
***REMOVED***;

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {***REMOVED***
***REMOVED***;

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); ***REMOVED***;
;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {***REMOVED***;

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); ***REMOVED***
  ***REMOVED***;

  Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
    this.type = "mustache";
    this.escaped = !unescaped;
    this.hash = hash;

    var id = this.id = rawParams[0];
    var params = this.params = rawParams.slice(1);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    var eligibleHelper = this.eligibleHelper = id.isSimple;

    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    this.isHelper = eligibleHelper && (params.length || hash);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
  ***REMOVED***;

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  ***REMOVED***;

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
***REMOVED***
  ***REMOVED***;

  Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
    this.inverse  = inverse;

    if (this.inverse && !this.program) {
      this.isInverse = true;
***REMOVED***
  ***REMOVED***;

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  ***REMOVED***;

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  ***REMOVED***;

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; ***REMOVED***
      else if(part === "." || part === "this") { this.isScoped = true; ***REMOVED***
      else { dig.push(part); ***REMOVED***
***REMOVED***

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;
  ***REMOVED***;

  Handlebars.AST.DataNode = function(id) {
    this.type = "DATA";
    this.id = id;
  ***REMOVED***;

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  ***REMOVED***;

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  ***REMOVED***;

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  ***REMOVED***;

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  ***REMOVED***;

***REMOVED***)();;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; ***REMOVED***
  ***REMOVED***

  this.message = tmp.message;
***REMOVED***;
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
***REMOVED***;
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
***REMOVED***;

(function() {
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  ***REMOVED***;

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  ***REMOVED***;

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
  ***REMOVED*** else if (string == null || string === false) {
        return "";
  ***REMOVED***

      if(!possible.test(string)) { return string; ***REMOVED***
      return string.replace(badChars, escapeChar);
  ***REMOVED***

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
  ***REMOVED*** else if (value === null) {
        return true;
  ***REMOVED*** else if (value === false) {
        return true;
  ***REMOVED*** else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
  ***REMOVED*** else {
        return false;
  ***REMOVED***
***REMOVED***
  ***REMOVED***;
***REMOVED***)();;
// lib/handlebars/compiler/compiler.js

/*jshint eqnull:true*/
Handlebars.Compiler = function() {***REMOVED***;
Handlebars.JavaScriptCompiler = function() {***REMOVED***;

(function(Compiler, JavaScriptCompiler) {
  // the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
    ***REMOVED*** else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
        ***REMOVED***
            params.push(param);
      ***REMOVED***
          out.push(opcode.opcode + " " + params.join(" "));
    ***REMOVED***
  ***REMOVED***

      return out.join("\n");
  ***REMOVED***

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []***REMOVED***;
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
  ***REMOVED***;
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
    ***REMOVED***
  ***REMOVED***

      return this.program(program);
  ***REMOVED***

    accept: function(node) {
      return this[node.type](node);
  ***REMOVED***

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
  ***REMOVED***
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
  ***REMOVED***);

      return this;
  ***REMOVED***

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; ***REMOVED***
        else { this.addDepth(depth - 1); ***REMOVED***
  ***REMOVED***

      return guid;
  ***REMOVED***

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
  ***REMOVED***

      if (inverse) {
        inverse = this.compileProgram(inverse);
  ***REMOVED***

      var type = this.classifyMustache(mustache);

      if (type === "helper") {
        this.helperMustache(mustache, program, inverse);
  ***REMOVED*** else if (type === "simple") {
        this.simpleMustache(mustache);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushLiteral', '{***REMOVED***');
        this.opcode('blockValue');
  ***REMOVED*** else {
        this.ambiguousMustache(mustache, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushLiteral', '{***REMOVED***');
        this.opcode('ambiguousBlockValue');
  ***REMOVED***

      this.opcode('append');
  ***REMOVED***

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{***REMOVED***');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
  ***REMOVED***
  ***REMOVED***

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
  ***REMOVED*** else {
        this.opcode('push', 'depth0');
  ***REMOVED***

      this.opcode('invokePartial', id.original);
      this.opcode('append');
  ***REMOVED***

    content: function(content) {
      this.opcode('appendContent', content.string);
  ***REMOVED***

    mustache: function(mustache) {
      var options = this.options;
      var type = this.classifyMustache(mustache);

      if (type === "simple") {
        this.simpleMustache(mustache);
  ***REMOVED*** else if (type === "helper") {
        this.helperMustache(mustache);
  ***REMOVED*** else {
        this.ambiguousMustache(mustache);
  ***REMOVED***

      if(mustache.escaped && !options.noEscape) {
        this.opcode('appendEscaped');
  ***REMOVED*** else {
        this.opcode('append');
  ***REMOVED***
  ***REMOVED***

    ambiguousMustache: function(mustache, program, inverse) {
      var id = mustache.id, name = id.parts[0];

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name);
  ***REMOVED***

    simpleMustache: function(mustache, program, inverse) {
      var id = mustache.id;

      if (id.type === 'DATA') {
        this.DATA(id);
  ***REMOVED*** else if (id.parts.length) {
        this.ID(id);
  ***REMOVED*** else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
  ***REMOVED***

      this.opcode('resolvePossibleLambda');
  ***REMOVED***

    helperMustache: function(mustache, program, inverse) {
      var params = this.setupFullMustacheParams(mustache, program, inverse),
          name = mustache.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
  ***REMOVED*** else if (this.knownHelpersOnly) {
        throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
  ***REMOVED*** else {
        this.opcode('invokeHelper', params.length, name);
  ***REMOVED***
  ***REMOVED***

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        this.opcode('pushContext');
  ***REMOVED*** else {
        this.opcode('lookupOnContext', id.parts[0]);
  ***REMOVED***

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
  ***REMOVED***
  ***REMOVED***

    DATA: function(data) {
      this.options.data = true;
      this.opcode('lookupData', data.id);
  ***REMOVED***

    STRING: function(string) {
      this.opcode('pushString', string.string);
  ***REMOVED***

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
  ***REMOVED***

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
  ***REMOVED***

    comment: function() {***REMOVED***,

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) ***REMOVED***);
  ***REMOVED***

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value ***REMOVED***);
  ***REMOVED***

    addDepth: function(depth) {
      if(isNaN(depth)) { throw new Error("EWOT"); ***REMOVED***
      if(depth === 0) { return; ***REMOVED***

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
  ***REMOVED***
  ***REMOVED***

    classifyMustache: function(mustache) {
      var isHelper   = mustache.isHelper;
      var isEligible = mustache.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = mustache.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
    ***REMOVED*** else if (options.knownHelpersOnly) {
          isEligible = false;
    ***REMOVED***
  ***REMOVED***

      if (isHelper) { return "helper"; ***REMOVED***
      else if (isEligible) { return "ambiguous"; ***REMOVED***
      else { return "simple"; ***REMOVED***
  ***REMOVED***

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
      ***REMOVED***

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
    ***REMOVED*** else {
          this[param.type](param);
    ***REMOVED***
  ***REMOVED***
  ***REMOVED***

    setupMustacheParams: function(mustache) {
      var params = mustache.params;
      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
  ***REMOVED*** else {
        this.opcode('pushLiteral', '{***REMOVED***');
  ***REMOVED***

      return params;
  ***REMOVED***

    // this will replace setupMustacheParams when we're done
    setupFullMustacheParams: function(mustache, program, inverse) {
      var params = mustache.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if(mustache.hash) {
        this.hash(mustache.hash);
  ***REMOVED*** else {
        this.opcode('pushLiteral', '{***REMOVED***');
  ***REMOVED***

      return params;
***REMOVED***
  ***REMOVED***;

  var Literal = function(value) {
    this.value = value;
  ***REMOVED***;

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
  ***REMOVED*** else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
  ***REMOVED***
      else {
        return parent + "['" + name + "']";
  ***REMOVED***
  ***REMOVED***

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
  ***REMOVED*** else {
        return "buffer += " + string + ";";
  ***REMOVED***
  ***REMOVED***

    initializeBuffer: function() {
      return this.quotedString("");
  ***REMOVED***

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {***REMOVED***;

      Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { ***REMOVED***
  ***REMOVED***;

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] ***REMOVED***;
      this.compileStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
    ***REMOVED*** else {
          this[opcode.opcode].apply(this, opcode.args);
    ***REMOVED***
  ***REMOVED***

      return this.createFunctionContext(asObject);
  ***REMOVED***

    nextOpcode: function() {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + 1];
      return opcodes[this.i + 1];
  ***REMOVED***

    eat: function(opcode) {
      this.i = this.i + 1;
  ***REMOVED***

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if (this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; ***REMOVED***
        if (this.options.data) { copies = copies + " data = data || {***REMOVED***;"; ***REMOVED***
        out.push(copies);
  ***REMOVED*** else {
        out.push('');
  ***REMOVED***

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
  ***REMOVED*** else {
        out.push("");
  ***REMOVED***

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
  ***REMOVED***

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
  ***REMOVED***

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = [];
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
    ***REMOVED***
  ***REMOVED***

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
  ***REMOVED***

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
  ***REMOVED***

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
  ***REMOVED***

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
  ***REMOVED***

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
  ***REMOVED*** else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '***REMOVED***';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
  ***REMOVED***
  ***REMOVED***

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo***REMOVED******REMOVED***...{{/foo***REMOVED******REMOVED***`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return current + " = blockHelperMissing.call(" + params.join(", ") + ")";
  ***REMOVED***);
  ***REMOVED***

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); ***REMOVED***");
  ***REMOVED***

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
  ***REMOVED***

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " ***REMOVED***");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " ***REMOVED***");
  ***REMOVED***
  ***REMOVED***

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      var opcode = this.nextOpcode(), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode && opcode.opcode === 'appendContent') {
        extra = " + " + this.quotedString(opcode.args[0]);
        this.eat(opcode);
  ***REMOVED***

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
  ***REMOVED***

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
  ***REMOVED***
  ***REMOVED***

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.pushStack(this.nameLookup('depth' + this.lastContext, name, 'context'));
  ***REMOVED***

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
  ***REMOVED***

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + "() : " + current;
  ***REMOVED***);
  ***REMOVED***

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
  ***REMOVED***);
  ***REMOVED***

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data[id], ...
    //
    // Push the result of looking up `id` on the current data
    lookupData: function(id) {
      this.pushStack(this.nameLookup('data', id, 'data'));
  ***REMOVED***

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string) {
      this.pushStackLiteral('depth' + this.lastContext);
      this.pushString(string);
  ***REMOVED***

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
  ***REMOVED***

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.pushStack(expr);
  ***REMOVED***

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
  ***REMOVED***

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
  ***REMOVED*** else {
        this.pushStackLiteral(null);
  ***REMOVED***
  ***REMOVED***

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';

      var helper = this.lastHelper = this.setupHelper(paramSize, name);
      this.register('foundHelper', helper.name);

      this.pushStack("foundHelper ? foundHelper.call(" +
        helper.callParams + ") " + ": helperMissing.call(" +
        helper.helperMissingParams + ")");
  ***REMOVED***

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.pushStack(helper.name + ".call(" + helper.callParams + ")");
  ***REMOVED***

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo***REMOVED******REMOVED***`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name) {
      this.context.aliases.functionType = '"function"';

      this.pushStackLiteral('{***REMOVED***');
      var helper = this.setupHelper(0, name);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
      this.register('foundHelper', helperName);

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      this.source.push('if (foundHelper) { ' + nextStack + ' = foundHelper.call(' + helper.callParams + '); ***REMOVED***');
      this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '() : ' + nextStack + '; ***REMOVED***');
  ***REMOVED***

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
  ***REMOVED***

      this.context.aliases.self = "this";
      this.pushStack("self.invokePartial(" + params.join(", ") + ");");
  ***REMOVED***

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
  ***REMOVED***

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
  ***REMOVED***
  ***REMOVED***

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
  ***REMOVED***

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); ***REMOVED***
        else { programParams.push("depth" + (depth - 1)); ***REMOVED***
  ***REMOVED***

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
  ***REMOVED*** else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
  ***REMOVED***
  ***REMOVED***

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
  ***REMOVED***

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
  ***REMOVED***
  ***REMOVED***

    pushStackLiteral: function(item) {
      this.compileStack.push(new Literal(item));
      return item;
  ***REMOVED***

    pushStack: function(item) {
      this.source.push(this.incrStack() + " = " + item + ";");
      this.compileStack.push("stack" + this.stackSlot);
      return "stack" + this.stackSlot;
  ***REMOVED***

    replaceStack: function(callback) {
      var item = callback.call(this, this.topStack());

      this.source.push(this.topStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
  ***REMOVED***

    nextStack: function(skipCompileStack) {
      var name = this.incrStack();
      this.compileStack.push("stack" + this.stackSlot);
      return name;
  ***REMOVED***

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); ***REMOVED***
      return "stack" + this.stackSlot;
  ***REMOVED***

    popStack: function() {
      var item = this.compileStack.pop();

      if (item instanceof Literal) {
        return item.value;
  ***REMOVED*** else {
        this.stackSlot--;
        return item;
  ***REMOVED***
  ***REMOVED***

    topStack: function() {
      var item = this.compileStack[this.compileStack.length - 1];

      if (item instanceof Literal) {
        return item.value;
  ***REMOVED*** else {
        return item;
  ***REMOVED***
  ***REMOVED***

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
  ***REMOVED***

    setupHelper: function(paramSize, name) {
      var params = [];
      this.setupParams(paramSize, params);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: ["depth0", this.quotedString(name)].concat(params).join(", ")
  ***REMOVED***;
  ***REMOVED***

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params) {
      var options = [], contexts = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
    ***REMOVED***

        if (!inverse) {
         this.context.aliases.self = "this";
          inverse = "self.noop";
    ***REMOVED***

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
  ***REMOVED***

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          contexts.push(this.popStack());
    ***REMOVED***
  ***REMOVED***

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
  ***REMOVED***

      if(this.options.data) {
        options.push("data:data");
  ***REMOVED***

      params.push("{" + options.join(",") + "***REMOVED***");
      return params.join(", ");
***REMOVED***
  ***REMOVED***;

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {***REMOVED***;

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  ***REMOVED***

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
      return true;
***REMOVED***
    return false;
  ***REMOVED***;

***REMOVED***)(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  options = options || {***REMOVED***;

  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
***REMOVED***;

Handlebars.compile = function(string, options) {
  options = options || {***REMOVED***;

  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  ***REMOVED***

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
***REMOVED***
    return compiled.call(this, context, options);
  ***REMOVED***;
***REMOVED***;
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
    ***REMOVED*** else if(programWrapper) {
          return programWrapper;
    ***REMOVED*** else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
    ***REMOVED***
    ***REMOVED***
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
***REMOVED***;

    return function(context, options) {
      options = options || {***REMOVED***;
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
***REMOVED***;
***REMOVED***

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {***REMOVED***;

      return fn.apply(this, [context, options.data || data].concat(args));
***REMOVED***;
***REMOVED***
  program: function(fn, data) {
    return function(context, options) {
      options = options || {***REMOVED***;

      return fn(context, options.data || data);
***REMOVED***;
***REMOVED***
  noop: function() { return ""; ***REMOVED***,
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data ***REMOVED***;

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
***REMOVED*** else if(partial instanceof Function) {
      return partial(context, options);
***REMOVED*** else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
***REMOVED*** else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined***REMOVED***);
      return partials[name](context, options);
***REMOVED***
  ***REMOVED***
***REMOVED***;

Handlebars.template = Handlebars.VM.template;
;
