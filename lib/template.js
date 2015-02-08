
'use strict';

var acorn = require('acorn');

var _ = require('lodash'),
	recast = require('recast');

var n = recast.types.namedTypes,
	b = recast.types.builders;

function parseMoustache(text) {
	var start = '{{',
		end = '}}',
		state = 0,
		index = 0,
		last = 0,
		blocks = [],
		ast;

	function matches(target) {
		return text.substr(index, target.length) === target;
	}

	function chunk() {
		var res = text.substr(last, index);
		if (res) {
			blocks.push({ type: 'text', value: res });
		}
	}

	while (index < text.length) {
		if (state === 0) {
			if (matches(start)) {
				chunk();
				state = 1;
				index += start.length;
			} else {
				++index;
			}
		} else if (state === 1) {
			ast = acorn.parseExpressionAt(text, index, { ranges: true });
			blocks.push({ type: 'ast', value: ast });
			index = ast.range[1];
			state = 2;
		} else if (state === 2) {
			if (matches(end)) {
				state = 0;
				index += end.length;
				last = index;
			} else {
				++index;
			}
		}
	}
	chunk();

	return blocks;
}


function compileMoustache(part) {
	switch(part.type) {
	case 'moustache':
		return acorn.parseExpressionAt(part.value);
	case 'ast':
		return part.value;
	case 'text':
		return b.literal(part.value);
	default:
		throw new TypeError();
	}
}

function buildMoustache(value) {
	return _.chain(parseMoustache(value))
		.map(compileMoustache)
		.reduce(function(prev, cur) {
			return b.binaryExpression("+", prev, cur);
		})
		.value();
}

module.exports = buildMoustache;
