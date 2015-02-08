
var Parser = require('parse5').Parser;

module.exports = function(data) {
	var parser = new Parser();
	return parser.parseFragment(data);
};
