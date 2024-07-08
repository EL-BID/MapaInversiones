var config = require("./webpack.config.js");

var rule = {enforce: 'post', test: /pdfkit[/\\]js[/\\]/, loader: "transform-loader?brfs"***REMOVED***;

config.module.rules.push(rule);

module.exports = config;