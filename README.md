# Web Components

Not sure which web component library to use? Why not all of them?

Use native HTML/CSS/JS to generate reusable and isolated web components that compile to [React], [Polymer] or [Riot].

Features:
 * No new custom language
 * Use semantic markup
 * Separate your HTML/CSS/JS
 * Use any CSS preprocessor you like
 * Automatic CSS namespaces
 * Use `id` attribute freely

Input:
 * Native
 * [React]
 * [Polymer]
 * [Riot]

Output:
 * [React]
 * [Polymer]
 * [Riot]


```sh
node example/convert.js
```


```html
<div>
	<my-list value="test" class="foo">
		<my-list-entry>5</my-list-entry>
		<my-list-entry>2</my-list-entry>
	</my-list>
</div>
```

## Mapped Features

### Imports / References

How are components loaded.


**Polymer**: HTML imports.

```html
<link rel="import" href="path/to/component.html"/>
```



**React**: Javascript loading; typically cjs-style.

```javascript
var component = require('./path/to/component');
```

**Riot**: DOM import. Riot has no reference support.


### Instantiation

How are new components created and attached to the DOM.

**Polymer**: `document.createElement`.


```javascript
var myComponent = document.createElement('my-component');
document.body.appendChild(myComponent);
```

**React**: React-specific constructor

```javascript
var myComponent = React.createComponent(MyComponent);
React.mount(myComponent, document.body);
```

**Riot**: N/A


### Naming Scheme

**Polymer**: Web components scheme

```html
<my-component-here>...</my-component-here>
```

**React**: Title-case conventionally (since they refer to object constructors), but technically any case.

```html
<MyComponentHere>...</MyComponentHere>
```

**Riot**: No convention

### Attributes

In the HTML5 standard attribute names are case insensitive. So that means `foo` and `FOO` are the same thing.

**Polymer**:

```html
<my-component attr="{{val}}"/>
```

```javascript
elem.setAttribute("property", "value");
attributeChangedCallback
```

```javascript
elem.getAttribute("property");
```

**React**:

```html
<MyComponent attr={val}/>
```

```javascript
elem.setProps()
```

```javascript
this.props.propertyName
```

**Riot**:

```javascript

```

### Templates

Templates describe the structural scaffolding that comprises a component: how the component is composed of other components or elements.

**Polymer**: HTML5 template tag
**React**: JSX
**Riot**: Existing DOM

### Binding

Binding is the process of associating some input variable to the component with some rendered output.

**Native**:
"Only if you're shitty about how you set state and props; if you do it properly, there's no reason not to have it on"


**Polymer**: TemplateBinding 2-way, double moustache `{{...}}`.

Why does Polymer have the most obscure syntax for its moustache blocks? Well it's because they want to perform static analysis on it. The expression you use is parsed and any variables are added to a watch list. Whenever those variables change, the corresponding block is updated. In this sense Polymer makes the assumption _all_ its changes are *pure*.

Polymer will only render the div value once:

```html
<div>{{ rand() }}</div>
<script>
Polymer({
    rand: function() {
        return Math.random();
    }
});
</script>
```

**React**: JSX 1-way, single moustache `{...}`.

React assumes nothing and re-renders everything by default. You must implement `shouldComponentUpdate(props, state)` and compare the given `props` and `state` with their corresponding local values to determine if an update is to occur. There is a mixin called `PureRenderMixin` which kind of does what Polymer does, but only compares objects in a shallow fashion. Note that it comares _all_ properties of the object you're sending in, not necessarily the properties that are used in the view.

For example if you have the view with `PureRenderMixin` enabled:

```html
<div>{ this.props.content }</div>
```

And make the following calls:

```javascript
React.render(document, {
    content: 'Hello',
    id: 1
});
React.render(document, {
    content: 'Hello',
    id: 2
});
```

A re-render will be triggered even though `id` is never used in the output. You must implement `shouldComponentUpdate` by hand if you want to match Polymer's semantics on this.

React's moustache blocks contain vanilla Javascript code and can do anything Javascript can, making them much more flexible but a fair bit harder to analyze effectively.

**Riot**: Compiled 1-way, single moustache `{...}`.

Riot re-evaluates every expression when `update()` is called; if the value bound to the element currently is the same, then no re-render is called.

```
<div>{ Math.random() }</div>
```

### Properties / Methods

Components often export properties or methods so that the outside world can interact with them.

### Classes

The `class` attribute of elements is one of the most commonly used and so it is quite often given preferential treatment in order to make manipulating its values easier and faster.

**Polymer**: No special treatment.
**React**: Diffed.
**Riot**: No special treatment.

### Events

**Polymer**: Polymer uses renamed event handlers with the `on-` prefix.

```html
<my-element on-click="{{handler}}"/>
```

**React**: React uses the names given to DOM nodes when interacted with in JavaScript.

```html
<MyElement onClick={handler}/>
```

**Riot**: No event magic.

```html
<my-element onclick="{{handler}}"/>
```

### Extensions


**Polymer**: Polymer uses web components type extensions and mixins.

```html
<input is="my-component"/>
```

Polymer's mixins are straightforward, and amount to nothing more than an `_.extend` call.

```javascript
Polymer('my-component', Polymer.mixin({

}, MyMixin, MyOtherMixin, ...));
```

**React**: React uses mixins.

React's mixins have slightly more magic going on under the hood. They are the same as an `_.extend` call _except_ for any properties that are lifecycle methods which are given special treatment.

Lifecycle methods are chained in the order they are given, so if you have two mixins `a` and `b` both with the lifecycle method `componentWillMount` then both `a.componentWillMount` and `b.componentWillMount` are called in the order they are mixed in.

```javascript
React.createComponent({
    mixins: [ MyMixin, MyOtherMixin, ... ]
});
```

**Riot**: Do it yourself.

### Local Element References

Accessing elements in the component is one of the most frequently performed actions, so it is often given convenience shorthand.

**Polymer**: Polymer achieves this by creating a variable called `$` mapped to everything that has an `id` attribute. Things are allowed `id` attributes since every component lives in complete isolation from other components.

```html
<div id="foo">...</div>
```

```javascript
function() {
    this.$.foo
}
```

**React**: React achieves this by creating a variable called `refs` mapped to everything that has a `ref` attribute.

```html
<div ref="foo">...</div>
```

```javascript
function() {
    this.refs.foo
}
```

**Riot**: N/A.

[Polymer]: https://github.com/Polymer/polymer
[React]: http://facebook.github.io/react
[Riot]: https://github.com/muut/riotjs


https://github.com/Polymer/polymer
https://github.com/Polymer/TemplateBinding
https://github.com/Polymer/polymer-expressions
https://www.polymer-project.org/docs/polymer/expressions.html
https://github.com/muut/riotjs/blob/master/lib/tmpl.js
https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
https://github.com/uberVU/react-guide/blob/master/props-vs-state.md
http://programmers.stackexchange.com/questions/225400/pros-and-cons-of-facebooks-react-vs-web-components-polymer
http://www.webpagetest.org/video/compare.php?tests=141120_RG_14H8,141120_A7_14H9,141120_VR_14HA,141120_76_14HB,141120_4B_14HC,141120_6E_14HD,141120_RX_14HE,141120_NF_14HF,141120_WZ_14HG
