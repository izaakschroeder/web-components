
'use strict';

var _ = require('lodash'),
	recast = require('recast');

var n = recast.types.namedTypes,
	b = recast.types.builders;

// check for on- events and fail that they should be converted to native
// `onevent` style.


var template = require('./template');
var attributes = require('./tags');

function attrs(attrs) {

	return b.objectExpression(_.map(attrs, function(attr) {
		var name = attr.name.toLowerCase(),
			value = template(attr.value);

		if (_.has(attributes, name)) {
			name = attributes[name];
		}

		return b.property(
			'init',
			b.literal(name),
			value
		);
	}));
}

function text(val) {
	return template(val);
}

function isCustom(elem) {
	// A dash in the element name means its a custom element, otherwise its
	// just a vanilla HTML5 element.
	return elem.nodeName[0] !== '#' && /-/.exec(elem.nodeName);
}

function imports(e) {
	return _.chain(e.childNodes)
		.map(imports)
		.concat(isCustom(e) ? e.nodeName : [])
		.flatten()
		.uniq()
		.value();
}

// build React DOM from HTML DOM
function element(e) {
	switch(e.nodeName) {
	case '#document-fragment':
		return b.callExpression(
			b.identifier('React.createElement'),
			[
				b.literal('anonymous'),
				b.arrayExpression([]),
				b.arrayExpression(
					_.map(e.childNodes, element)
				)
			]
		);
	case '#text':
			return text(e.value);
	case 'shadow':
		return null;
	default:
		console.log(e.tagName,'->',e.childNodes.length);
		return b.callExpression(
			b.identifier('React.createElement'),
			[
				isCustom(e) ?
					b.identifier(_.camelCase(e.tagName)) :
					b.literal(e.tagName),
				attrs(e.attrs),
				b.arrayExpression(
					_.map(e.childNodes, element)
				)
			]
		);
	}
}

function component(e) {

}

function build(e) {


	// create imports for all detected components

	// create the dom tree

	// export the element

	var i = imports(e);

	var j = _.map(i, function(name) {
		return b.importDeclaration([
			b.importDefaultSpecifier(b.identifier(_.camelCase(name)))
		], b.moduleSpecifier(name));
	});

	return b.program(_.flatten([j,
		b.exportDeclaration(true, element(e))
	]));
}

module.exports = build;
