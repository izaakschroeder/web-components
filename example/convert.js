
var parse = require('../lib/parse'),
	generate = require('../lib/generate');


var recast = require('recast');
var fs = require('fs');

var escodegen = require('escodegen');

var html = fs.readFileSync('./example/todo/components/entry/index.html', 'utf8');

var ast = generate(parse(html));

console.log(escodegen.generate(ast, { useTabs: true, quote: 'single'}));
