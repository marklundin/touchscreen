(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

'use strict';

var Detector = {

	canvas: !!window.CanvasRenderingContext2D,
	webgl: (function () {
		try {
			var canvas = document.createElement('canvas');return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
		} catch (e) {
			return false;
		}
	})(),
	workers: !!window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function getWebGLErrorMessage() {

		var element = document.createElement('div');
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if (!this.webgl) {

			element.innerHTML = window.WebGLRenderingContext ? ['Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />', 'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join('\n') : ['Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>', 'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join('\n');
		}

		return element;
	},

	addGetWebGLMessage: function addGetWebGLMessage(parameters) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild(element);
	}

};

// browserify support
if (typeof module === 'object') {

	module.exports = Detector;
}

},{}],2:[function(require,module,exports){
// import THREE from 'three'
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _meshFacingMaterial = require('./mesh-facing-material');

var _meshFacingMaterial2 = _interopRequireDefault(_meshFacingMaterial);

exports["default"] = function (resolution) {
	return (0, _meshFacingMaterial2["default"])(new THREE.ShaderMaterial({

		uniforms: {

			uResolution: { type: "v2", value: resolution },
			uOrigin: { type: "v2", value: new THREE.Vector2(resolution.x * 0.5, resolution.y * 0.5) },
			uRadius: { type: "f", value: 0 },
			uOpacity: { type: "f", value: 1.0 }

		},

		fragmentShader: "\n\n\t\t\t\t#ifdef GL_OES_standard_derivatives\n\t\t\t\t\t#extension GL_OES_standard_derivatives : enable\n\t\t\t\t#endif\n\n\t\t\t\tvarying vec2 vUv;\n\n\t\t\t\tuniform vec2 uResolution;\n\t\t\t\tuniform vec2 uOrigin;\n\t\t\t\tuniform float uOpacity;\n\t\t\t\tuniform float uRadius;\n\n\t\t\t\tfloat aastep(float threshold, float value) {\n\t\t\t\t\t#ifdef GL_OES_standard_derivatives\n\t\t\t\t\t\tfloat afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;\n\t\t\t\t\t\treturn smoothstep(threshold-afwidth, threshold+afwidth, value);\n\t\t\t\t\t#else\n\t\t\t\t\t\treturn step(threshold, value);\n\t\t\t\t\t#endif  \n\t\t\t\t}\n\n\n\t\t\t\tfloat line( vec2 p, float thickness ){\n\t\t\t\t\treturn aastep( thickness, abs( p.y ));\n\t\t\t\t}\n\n\n\t\t\t\tfloat circle( vec2 p, float radius ){\n\t\t\t\t\treturn aastep( radius, length( p ));\n\t\t\t\t}\n\n\n\t\t\t\tfloat lines( vec2 p, vec2 c, float thickness ){\n\t\t\t\t\tvec2 q = mod( p, c ) - 0.5 * c;\n\t\t\t\t\treturn line( q, thickness );\n\t\t\t\t}\n\n\n\t\t\t\tfloat pinch( vec2 p, vec2 o, float radius, float power, float verticalShape ){\n\t\t\t\t\tvec2 delta = p - o;\n\t\t\t\t\tdelta.y *= verticalShape;\n\t\t\t\t\treturn 1.0 - pow( smoothstep( .0, radius, length( delta )), power );\n\t\t\t\t}\n\n\n\t\t\t\tvoid main(){\n\n\n\t\t\t\t\t// COORDS\n\t\t\t\t\tvec2 p = vUv * uResolution;\n\t\t\t\t\tvec4 col = vec4(0.0);\n\n\n\n\t\t\t\t\t// DEFINE LINE STYLES\n\t\t\t\t\tfloat lineThickness = 1.;\n\t\t\t\t\tfloat lineSpacing = 30.0;\n\t\t\t\t\tvec3 lineColor = vec3( 0.1, 0.9, 1.0 );\n\t\t\t\t\tvec3 focusColor = vec3( 1.0, 0.0, 1.0 );\n\n\n\n\t\t\t\t\t// DISTORT COORDINATES AT HOTSPOT\n\t\t\t\t\tfloat distortionFactor = pinch( p, uOrigin, uRadius * 2.3, 1.2, 0.8 );\n\t\t\t\t\tvec2 distortion = ( p - uOrigin ) * distortionFactor * 0.9;\n\n\n\n\t\t\t\t\t// CALCULATE LINES\t\t\t\t\n\t\t\t\t\tfloat value = lines( p + distortion, vec2( 0.0, lineSpacing ), mix( lineThickness, lineThickness * 3.8, distortionFactor ));\n\n\n\t\t\t\t\t// float pulse = pulseSdf( );\n\n\n\t\t\t\t\t// Union \n\t\t\t\t\t// value = min( value, pulse )\n\n\n\t\t\t\t\tcol.rgb = mix( lineColor, focusColor, distortionFactor );\n\t\t\t\t\tcol.rgb = mix( col.rgb, vec3( 1.0 ), value );\n\t\t\t\t\tcol.a = 1.0 - ( value * uOpacity );//1.0;//1.0 - value + uOpacity;\n\n\t\t\t\t\t\n\n\t\t\t\t\tgl_FragColor = col;\n\n\t\t\t\t}\n\n\t\t\t",
		// blending: THREE.MultiplyBlending,
		transparent: true,
		vertexShader: defaultVertexShader
	}));
};

// Standard vertex shader
var defaultVertexShader = "\n\tvarying vec2 vUv;\n\tvoid main() {\n\t\tvUv = uv;\n\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t}\n";
module.exports = exports["default"];

},{"./mesh-facing-material":6}],3:[function(require,module,exports){
// import THREE from 'three'
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _meshFacingMaterial = require('./mesh-facing-material');

var _meshFacingMaterial2 = _interopRequireDefault(_meshFacingMaterial);

exports["default"] = function (resolution) {
	return new THREE.ShaderMaterial({

		uniforms: {

			uResolution: { type: "v2", value: resolution },
			uOrigin: { type: "v2", value: new THREE.Vector2(resolution.x * 0.5, resolution.y * 0.5) },
			uRadius: { type: "f", value: 0 }

		},

		fragmentShader: "\n\n\t\t\t#ifdef GL_OES_standard_derivatives\n\t\t\t\t#extension GL_OES_standard_derivatives : enable\n\t\t\t#endif\n\n\t\t\tvarying vec2 vUv;\n\n\t\t\tuniform vec2 uResolution;\n\t\t\tuniform vec2 uOrigin;\n\t\t\tuniform float uRadius;\n\t\t\t\n\n\n\t\t\tfloat aastep(float threshold, float value) {\n\t\t\t\t#ifdef GL_OES_standard_derivatives\n\t\t\t\t\tfloat afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;\n\t\t\t\t\treturn smoothstep(threshold-afwidth, threshold+afwidth, value);\n\t\t\t\t#else\n\t\t\t\t\treturn step(threshold, value);\n\t\t\t\t#endif  \n\t\t\t}\n\n\n\t\t\tfloat circle( vec2 p, float radius ){\n\t\t\t\treturn aastep( radius, length( p ));\n\t\t\t}\n\n\n\n\t\t\tvoid main(){\n\n\n\t\t\t\t// COORDS\n\t\t\t\tvec2 p = vUv * uResolution;\n\t\t\t\tvec4 col = vec4( 0.9, 0.22, 0.64, 1.0 );\n\n\n\t\t\t\t// CIRCLE SDF\n\t\t\t\tfloat value = circle( abs( p - uOrigin ), uRadius );\n\n\t\t\t\t// col.rgb = mix( lineColor, focusColor, distortionFactor );\n\t\t\t\t// col.rgb = col;\n\t\t\t\tcol.a = 1.0 - value;\n\t\t\t\t\n\n\t\t\t\tgl_FragColor = col;\n\n\t\t\t}\n\n\t\t",
		// blending: THREE.MultiplyBlending,
		transparent: true,
		vertexShader: defaultVertexShader
	});
};

// Standard vertex shader
var defaultVertexShader = "\n\tvarying vec2 vUv;\n\tvoid main() {\n\t\tvUv = uv;\n\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t}\n";
module.exports = exports["default"];

},{"./mesh-facing-material":6}],4:[function(require,module,exports){
// import THREE from 'three'
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _math = require('./math');

var _math2 = _interopRequireDefault(_math);

var _projectToUv = require('./project-to-uv');

var _projectToUv2 = _interopRequireDefault(_projectToUv);

var _electricMaterial = require('./electric-material');

var _electricMaterial2 = _interopRequireDefault(_electricMaterial);

var _hotspotMaterial = require('./hotspot-material');

var _hotspotMaterial2 = _interopRequireDefault(_hotspotMaterial);

var _sensingMaterial = require('./sensing-material');

var _sensingMaterial2 = _interopRequireDefault(_sensingMaterial);

var _pointerEvents = require('./pointer-events');

var _pointerEvents2 = _interopRequireDefault(_pointerEvents);

var _meshFacingMaterial = require('./mesh-facing-material');

var _meshFacingMaterial2 = _interopRequireDefault(_meshFacingMaterial);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _threeBmfontText = require('three-bmfont-text');

var _threeBmfontText2 = _interopRequireDefault(_threeBmfontText);

var _sdf = require('./sdf');

var _sdf2 = _interopRequireDefault(_sdf);

var _detector = require('./detector');

var _detector2 = _interopRequireDefault(_detector);

var _sounds = require('./sounds');

// DETECTOR

var _sounds2 = _interopRequireDefault(_sounds);

if (!_detector2['default'].webgl) {

	document.querySelector('#error').style.display = 'inherit';
} else {
	(function () {

		// RENDER

		var render = function render() {
			update();
			renderer.render(scene, camera);
			requestAnimationFrame(render);
		};

		// INITIALISE

		// Constants
		var container = document.querySelector('.gl'),
		    EXPANDED_HOTSPOT_SIZE = 50,
		    WIDTH = container.getBoundingClientRect().width,
		    HEIGHT = container.getBoundingClientRect().height;

		// Params
		var expandedState = 0,
		    interactionState = 0,
		    hotspotPos = [0, 0];

		// INITIALISE RENDERER

		var canvas = document.createElement('canvas'),
		    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, premultipliedAlpha: true }),
		    camera = new THREE.PerspectiveCamera(35, WIDTH / HEIGHT),
		    scene = new THREE.Scene();

		container.appendChild(canvas);
		renderer.setSize(WIDTH, HEIGHT);
		renderer.setClearColor(0x0);

		// INITIALISE TOGGLE

		var toggle = document.querySelector('#toggle');
		var infoOverlay = document.querySelector('#info');
		var infoButton = document.querySelector('#info-button');

		toggle.addEventListener('pointerdown', function (e) {
			e.stopPropagation();
			expandedState = expandedState === 1.0 ? 0.0 : 1.0;
			if (expandedState === 1.0) _sounds2['default'].openSound();else _sounds2['default'].closeSound();
		}, true);

		document.querySelector('#info-button').addEventListener('pointerdown', function (e) {
			e.stopPropagation();
			infoOverlay.style.display = 'inherit';
		}, true);

		document.querySelector('#close-button').addEventListener('pointerdown', function (e) {
			e.stopPropagation();
			infoOverlay.style.display = 'none';
		}, true);

		// POSITION CAMERA

		camera.position.z = 100;

		// Get plane dimensions that fit to the viewport
		// let fov = camera.fov * Math.PI/ 180
		var height = 2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z,
		    width = height * camera.aspect;

		// LAYERS

		var layers = new THREE.Object3D();
		var layerThickness = 1.0;

		var dashedLine = new THREE.Line(new THREE.Geometry(), new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 2, gapSize: 2.0, transparent: true }), THREE.LinePieces);

		var l = 30;
		while (l-- > 0) dashedLine.geometry.vertices.push(new THREE.Vector3(0, 0, l));

		var hotspotLayer = new THREE.Mesh(new THREE.PlaneGeometry(width, height), (0, _hotspotMaterial2['default'])(new THREE.Vector2(WIDTH, HEIGHT)));

		var electricLayer = new THREE.Mesh(new THREE.BoxGeometry(width, height, layerThickness), (0, _electricMaterial2['default'])(new THREE.Vector2(WIDTH, HEIGHT)));

		var sensingLayer = new THREE.Mesh(new THREE.BoxGeometry(width, height, layerThickness), (0, _sensingMaterial2['default'])(new THREE.Vector2(WIDTH, HEIGHT)));

		var processorLayer = new THREE.Mesh(new THREE.BoxGeometry(width * 0.5, width * 0.5, layerThickness), (0, _meshFacingMaterial2['default'])(new THREE.MeshBasicMaterial({
			transparent: true,
			map: THREE.ImageUtils.loadTexture('img/processor.jpg')
		})));

		// TEXT

		var textMesh = function textMesh(text, material, font) {

			var mesh = new THREE.Mesh((0, _threeBmfontText2['default'])({
				text: text,
				font: font,
				align: 'left'
			}), material);
			mesh.font = font;

			mesh.rotation.x = Math.PI;
			// mesh.scale.set( 0.2, 0.2, 0.2 )

			mesh.position.x = -mesh.geometry.layout.width / 2;
			//origin uses bottom left of last line
			//so we need to move it down a fair bit
			mesh.position.y = mesh.geometry.layout.height * 1.035;

			//scale it down so it fits in our 3D units
			var textAnchor = new THREE.Object3D();
			textAnchor.scale.multiplyScalar(0.12);
			textAnchor.add(mesh);
			textAnchor.font = font;

			return textAnchor;
		};

		var processorText = undefined,
		    sensingText = undefined,
		    electricText = undefined,
		    locText = undefined;

		(0, _text2['default'])({ font: 'fonts/DejaVu-sdf.fnt', image: 'fonts/DejaVu-sdf.png' }, function (font, texture) {

			var maxAni = renderer.getMaxAnisotropy();

			//setup our texture with some nice mipmapping etc
			texture.needsUpdate = true;
			texture.minFilter = THREE.LinearMipMapLinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.generateMipmaps = true;
			texture.anisotropy = maxAni;

			var textMaterial = new THREE.ShaderMaterial((0, _sdf2['default'])({
				map: texture,
				smooth: 1 / 32, //the smooth value for SDF
				side: THREE.DoubleSide,
				transparent: true,
				color: 'rgb(230, 230, 230)'
			}));

			processorLayer.add(processorText = textMesh('Processor', textMaterial, font));
			sensingLayer.add(sensingText = textMesh('Sensing layer', textMaterial, font));
			electricLayer.add(electricText = textMesh('Electric layer', textMaterial, font));
			electricLayer.add(locText = textMesh('(0, 0)', textMaterial, font));

			processorText.position.y = -40;
			sensingText.position.y = -height * 0.62;
			electricText.position.y = height * 0.5;
			locText.position.z = layerThickness * 2;
		});

		layers.add(electricLayer);
		layers.add(sensingLayer);
		layers.add(processorLayer);
		layers.add(hotspotLayer);
		layers.add(dashedLine);

		// PROCESSOR

		// ADD TO SCENE

		// scene.add( electricLayer )
		scene.add(layers);

		// DEFINE ANIMATION STATE

		var expandedAnimation = [

		// Properties and values in the collapsed states
		new Map([[camera.position, new THREE.Vector3(0, 0, 100)], [layers.rotation, new THREE.Euler(0, 0, 0)], [electricLayer.position, new THREE.Vector3(0, 0, 1)], [processorLayer.position, new THREE.Vector3(0, 0, -10)], [hotspotLayer.position, new THREE.Vector3(0, 0, 2)]]),

		// Properties and values in the expanded states
		new Map([[camera.position, new THREE.Vector3(0, 0, 200)], [layers.rotation, new THREE.Euler(-.3, .4, .12)], [electricLayer.position, new THREE.Vector3(0, 0, 30)], [processorLayer.position, new THREE.Vector3(0, 0, -40)], [hotspotLayer.position, new THREE.Vector3(0, 0, 1)]])];

		// TRANSITION

		// Performs a naive transition, sliding 'a' towards 'b'
		var slideTo = function slideTo(a, b) {
			return (b - a) * 0.12 + a;
		};

		var slideToVec3 = function slideToVec3(b, a) {

			var aArr = a.toArray(),
			    bArr = b.toArray();

			return a.fromArray(aArr.map(function (v, i) {
				return typeof v === 'number' ? slideTo(v, bArr[i]) : v;
			}));
		};

		// A dictionary that maps object types to methods of interpolation
		var lerpDict = new Map();
		lerpDict.set(Number, slideTo);
		lerpDict.set(THREE.Vector3, slideToVec3);
		lerpDict.set(THREE.Euler, slideToVec3);

		var transition = function transition(item, value) {
			return lerpDict.get(item.constructor)(item, value);
		};

		var update = function update() {

			// Update the button to reflect the current state
			toggle.className = 'puck ' + (expandedState === 1.0 ? 'expanded' : 'collapsed');
			toggle.style.visibility = infoOverlay.style.display === 'inherit' ? 'hidden' : 'visible';

			// Update elements of the expand animation
			expandedAnimation[expandedState].forEach(transition);

			// Set opacity of processor			
			processorLayer.material.materials[4].opacity = slideTo(processorLayer.material.materials[4].opacity, expandedState);

			// Set position of hotspots
			electricLayer.material.materials[4].uniforms.uOrigin.value.fromArray(hotspotPos);
			hotspotLayer.material.uniforms.uOrigin.value.fromArray(hotspotPos);

			// Position dashed line
			dashedLine.position.x = _math2['default'].map(hotspotPos[0], 0, WIDTH, -width * 0.5, width * 0.5);
			dashedLine.position.y = _math2['default'].map(hotspotPos[1], 0, HEIGHT, -height * 0.5, height * 0.5);

			if (locText) {
				locText.position.x = dashedLine.position.x - 5;
				locText.position.y = dashedLine.position.y + (dashedLine.position.y > 20 ? -15 : 0);
				locText.position.z = 6;
				locText.children[0].geometry.update({
					text: '(' + parseFloat(Math.round(dashedLine.position.x * 100) / 100).toFixed(1) + ',' + parseFloat(Math.round(dashedLine.position.y * 100) / 100).toFixed(1) + ')',
					font: locText.font,
					align: 'left'
				});

				locText.visible = expandedState === 1 && interactionState === 1 && dashedLine.position.x > -width * 0.5 && dashedLine.position.x < width * 0.5 && dashedLine.position.y > -height * 0.5 && dashedLine.position.y < height * 0.5 ? true : false;
			}

			infoButton.style.display = expandedState === 1.0 ? 'inherit' : 'none';

			// set radius of electric layer
			electricLayer.material.materials[4].uniforms.uRadius.value = slideTo(electricLayer.material.materials[4].uniforms.uRadius.value, interactionState * EXPANDED_HOTSPOT_SIZE);

			// set radius of sensing layer
			var radius = electricLayer.material.materials[4].uniforms.uRadius.value;
			hotspotLayer.material.uniforms.uRadius.value = _math2['default'].mix(expandedState, radius, radius * 0.4);

			// set opacity of electric layer
			electricLayer.material.materials[4].uniforms.uOpacity.value = slideTo(electricLayer.material.materials[4].uniforms.uOpacity.value, _math2['default'].mix(expandedState, 1.0, 0.5));

			// set opacity of sensing layer
			sensingLayer.material.materials[4].uniforms.uOpacity.value = slideTo(sensingLayer.material.materials[4].uniforms.uOpacity.value, _math2['default'].mix(expandedState, 1.0, 0.5));

			// set opacity of text
			if (locText) {

				locText.children[0].material.opacity = expandedState; //slideTo(
				// locText.children[0].material.opacity,
				// expandedState )

				sensingText.children[0].material.opacity = locText.children[0].material.opacity;
				electricText.children[0].material.opacity = locText.children[0].material.opacity;
			}

			dashedLine.material.visible = expandedState === 1 && interactionState === 1 && dashedLine.position.x > -width * 0.5 && dashedLine.position.x < width * 0.5 && dashedLine.position.y > -height * 0.5 && dashedLine.position.y < height * 0.5;
		};

		render();

		// INTERACTION

		// Prevents default OS page scroll events
		document.body.addEventListener('touchmove', function (e) {
			return e.preventDefault();
		}, false);

		var updateHotSpotPosition = function updateHotSpotPosition(evt) {

			var bounds = canvas.getBoundingClientRect();

			var x = evt.clientX - bounds.left,
			    y = evt.clientY - bounds.top;

			var screenCoord = [x / bounds.width * 2 - 1, -(y / bounds.height) * 2 + 1];
			var p = (0, _projectToUv2['default'])(camera, screenCoord, electricLayer);

			hotspotPos = [_math2['default'].map(p.x, -width * 0.5, width * 0.5, 0, WIDTH), _math2['default'].map(p.y, -height * 0.5, height * 0.5, 0, HEIGHT)];
		};

		var onInteractionUpdate = updateHotSpotPosition;

		var onInteractionStart = function onInteractionStart(evt) {

			if (!(infoOverlay.style.display == 'inherit')) {
				interactionState = 1;
				updateHotSpotPosition(evt);

				_sounds2['default'].triggerInteraction();
				_sounds2['default'].tapSound();

				document.addEventListener('pointermove', onInteractionUpdate);
				document.addEventListener('pointerup', onInteractionEnd);
			}
		};

		var onInteractionEnd = function onInteractionEnd() {
			interactionState = 0;

			_sounds2['default'].stopInteraction();

			document.removeEventListener('pointermove', onInteractionUpdate);
			document.removeEventListener('pointerup', onInteractionEnd);
		};

		document.addEventListener('pointerdown', onInteractionStart);
	})();
}

},{"./detector":1,"./electric-material":2,"./hotspot-material":3,"./math":5,"./mesh-facing-material":6,"./pointer-events":7,"./project-to-uv":8,"./sdf":9,"./sensing-material":10,"./sounds":11,"./text":12,"three-bmfont-text":29}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var PI2 = 2.0 * Math.PI,
    HALF_PI = Math.PI * 0.5,
    DEG2RAD = Math.PI / 180.0,
    RAD2DEG = 180.0 / Math.PI,
    EPS = 10e-6;

var math = {

    //Constants
    PI2: PI2,
    HALF_PI: HALF_PI,
    DEG2RAD: DEG2RAD,
    RAD2DEG: RAD2DEG,
    EPS: EPS,

    /*
     * Lineary interpolates between a->b, using n as a weight
     */
    mix: function mix(n, a, b) {
        return a * (1 - n) + b * n;
    },

    /*
     * Linearly maps n from a->b to x->y
     */
    map: function map(n, a, b, x, y) {
        return x + (n - a) * (y - x) / (b - a);
    },

    /*
     * Linearly maps n from a->b to 0-1
     */
    normalize: function normalize(n, a, b) {
        return math.map(n, a, b, 0, 1);
    },

    /*
     * Clamp n within range a->b
     */
    clamp: function clamp(n, a, b) {
        return n < a ? a : n > b ? b : n;
    },

    /*
     * Returns a pseudo-random floating point number within the range a->b, if b is not supplied it
     * returns within the range 0-a
    */
    random: function random(a, b) {
        return b === undefined ? Math.random() * a : Math.random() * (b - a) + a;
    },

    /*
     * Included for completeness. This allows functional style reductions such as `numbers.reduce( max )`. 
     * `Math.max.apply( this, numbers )` alone is bound by the stack size
     */
    max: function max(a, b) {
        return Math.max(a, b);
    },

    /*
     * Included for completeness. This allows functional style reductions such as `numbers.reduce( min )`. 
     * `Math.min.apply( this, numbers )` alone is bound by the stack size
     */
    min: function min(a, b) {
        return Math.min(a, b);
    }

};

exports["default"] = math;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
// import THREE from 'three'

"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var edgeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

exports["default"] = function (facingMaterial) {
	return new THREE.MeshFaceMaterial([edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, facingMaterial, edgeMaterial]);
};

module.exports = exports["default"];

},{}],7:[function(require,module,exports){
/*!
 * PEP v0.3.0 | https://github.com/jquery/PEP
 * Copyright jQuery Foundation and other contributors | http://jquery.org/license
 */
'use strict';

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.PointerEventsPolyfill = factory();
})(undefined, function () {
  'use strict';

  /**
   * This module implements an map of pointer states
   */
  var USE_MAP = window.Map && window.Map.prototype.forEach;
  var POINTERS_FN = function POINTERS_FN() {
    return this.size;
  };
  function PointerMap() {
    if (USE_MAP) {
      var m = new Map();
      m.pointers = POINTERS_FN;
      return m;
    } else {
      this.keys = [];
      this.values = [];
    }
  }

  PointerMap.prototype = {
    set: function set(inId, inEvent) {
      var i = this.keys.indexOf(inId);
      if (i > -1) {
        this.values[i] = inEvent;
      } else {
        this.keys.push(inId);
        this.values.push(inEvent);
      }
    },
    has: function has(inId) {
      return this.keys.indexOf(inId) > -1;
    },
    'delete': function _delete(inId) {
      var i = this.keys.indexOf(inId);
      if (i > -1) {
        this.keys.splice(i, 1);
        this.values.splice(i, 1);
      }
    },
    get: function get(inId) {
      var i = this.keys.indexOf(inId);
      return this.values[i];
    },
    clear: function clear() {
      this.keys.length = 0;
      this.values.length = 0;
    },
    // return value, key, map
    forEach: function forEach(callback, thisArg) {
      this.values.forEach(function (v, i) {
        callback.call(thisArg, v, this.keys[i], this);
      }, this);
    },
    pointers: function pointers() {
      return this.keys.length;
    }
  };

  var _pointermap = PointerMap;

  var CLONE_PROPS = [
  // MouseEvent
  'bubbles', 'cancelable', 'view', 'detail', 'screenX', 'screenY', 'clientX', 'clientY', 'ctrlKey', 'altKey', 'shiftKey', 'metaKey', 'button', 'relatedTarget',
  // DOM Level 3
  'buttons',
  // PointerEvent
  'pointerId', 'width', 'height', 'pressure', 'tiltX', 'tiltY', 'pointerType', 'hwTimestamp', 'isPrimary',
  // event instance
  'type', 'target', 'currentTarget', 'which', 'pageX', 'pageY', 'timeStamp'];

  var CLONE_DEFAULTS = [
  // MouseEvent
  false, false, null, null, 0, 0, 0, 0, false, false, false, false, 0, null,
  // DOM Level 3
  0,
  // PointerEvent
  0, 0, 0, 0, 0, 0, '', 0, false,
  // event instance
  '', null, null, 0, 0, 0, 0];

  var HAS_SVG_INSTANCE = typeof SVGElementInstance !== 'undefined';

  /**
   * This module is for normalizing events. Mouse and Touch events will be
   * collected here, and fire PointerEvents that have the same semantics, no
   * matter the source.
   * Events fired:
   *   - pointerdown: a pointing is added
   *   - pointerup: a pointer is removed
   *   - pointermove: a pointer is moved
   *   - pointerover: a pointer crosses into an element
   *   - pointerout: a pointer leaves an element
   *   - pointercancel: a pointer will no longer generate events
   */
  var dispatcher = {
    pointermap: new _pointermap(),
    eventMap: Object.create(null),
    captureInfo: Object.create(null),
    // Scope objects for native events.
    // This exists for ease of testing.
    eventSources: Object.create(null),
    eventSourceList: [],
    /**
     * Add a new event source that will generate pointer events.
     *
     * `inSource` must contain an array of event names named `events`, and
     * functions with the names specified in the `events` array.
     * @param {string} name A name for the event source
     * @param {Object} source A new source of platform events.
     */
    registerSource: function registerSource(name, source) {
      var s = source;
      var newEvents = s.events;
      if (newEvents) {
        newEvents.forEach(function (e) {
          if (s[e]) {
            this.eventMap[e] = s[e].bind(s);
          }
        }, this);
        this.eventSources[name] = s;
        this.eventSourceList.push(s);
      }
    },
    register: function register(element) {
      var l = this.eventSourceList.length;
      for (var i = 0, es; i < l && (es = this.eventSourceList[i]); i++) {
        // call eventsource register
        es.register.call(es, element);
      }
    },
    unregister: function unregister(element) {
      var l = this.eventSourceList.length;
      for (var i = 0, es; i < l && (es = this.eventSourceList[i]); i++) {
        // call eventsource register
        es.unregister.call(es, element);
      }
    },
    contains: /*scope.external.contains || */function contains(container, contained) {
      return container.contains(contained);
    },
    // EVENTS
    down: function down(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerdown', inEvent);
    },
    move: function move(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointermove', inEvent);
    },
    up: function up(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerup', inEvent);
    },
    enter: function enter(inEvent) {
      inEvent.bubbles = false;
      this.fireEvent('pointerenter', inEvent);
    },
    leave: function leave(inEvent) {
      inEvent.bubbles = false;
      this.fireEvent('pointerleave', inEvent);
    },
    over: function over(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerover', inEvent);
    },
    out: function out(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerout', inEvent);
    },
    cancel: function cancel(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointercancel', inEvent);
    },
    leaveOut: function leaveOut(event) {
      this.out(event);
      if (!this.contains(event.target, event.relatedTarget)) {
        this.leave(event);
      }
    },
    enterOver: function enterOver(event) {
      this.over(event);
      if (!this.contains(event.target, event.relatedTarget)) {
        this.enter(event);
      }
    },
    // LISTENER LOGIC
    eventHandler: function eventHandler(inEvent) {
      // This is used to prevent multiple dispatch of pointerevents from
      // platform events. This can happen when two elements in different scopes
      // are set up to create pointer events, which is relevant to Shadow DOM.
      if (inEvent._handledByPE) {
        return;
      }
      var type = inEvent.type;
      var fn = this.eventMap && this.eventMap[type];
      if (fn) {
        fn(inEvent);
      }
      inEvent._handledByPE = true;
    },
    // set up event listeners
    listen: function listen(target, events) {
      events.forEach(function (e) {
        this.addEvent(target, e);
      }, this);
    },
    // remove event listeners
    unlisten: function unlisten(target, events) {
      events.forEach(function (e) {
        this.removeEvent(target, e);
      }, this);
    },
    addEvent: /*scope.external.addEvent || */function addEvent(target, eventName) {
      target.addEventListener(eventName, this.boundHandler);
    },
    removeEvent: /*scope.external.removeEvent || */function removeEvent(target, eventName) {
      target.removeEventListener(eventName, this.boundHandler);
    },
    // EVENT CREATION AND TRACKING
    /**
     * Creates a new Event of type `inType`, based on the information in
     * `inEvent`.
     *
     * @param {string} inType A string representing the type of event to create
     * @param {Event} inEvent A platform event with a target
     * @return {Event} A PointerEvent of type `inType`
     */
    makeEvent: function makeEvent(inType, inEvent) {
      // relatedTarget must be null if pointer is captured
      if (this.captureInfo[inEvent.pointerId]) {
        inEvent.relatedTarget = null;
      }
      var e = new PointerEvent(inType, inEvent);
      if (inEvent.preventDefault) {
        e.preventDefault = inEvent.preventDefault;
      }
      e._target = e._target || inEvent.target;
      return e;
    },
    // make and dispatch an event in one call
    fireEvent: function fireEvent(inType, inEvent) {
      var e = this.makeEvent(inType, inEvent);
      return this.dispatchEvent(e);
    },
    /**
     * Returns a snapshot of inEvent, with writable properties.
     *
     * @param {Event} inEvent An event that contains properties to copy.
     * @return {Object} An object containing shallow copies of `inEvent`'s
     *    properties.
     */
    cloneEvent: function cloneEvent(inEvent) {
      var eventCopy = Object.create(null),
          p;
      for (var i = 0; i < CLONE_PROPS.length; i++) {
        p = CLONE_PROPS[i];
        eventCopy[p] = inEvent[p] || CLONE_DEFAULTS[i];
        // Work around SVGInstanceElement shadow tree
        // Return the <use> element that is represented by the instance for Safari, Chrome, IE.
        // This is the behavior implemented by Firefox.
        if (HAS_SVG_INSTANCE && (p === 'target' || p === 'relatedTarget')) {
          if (eventCopy[p] instanceof SVGElementInstance) {
            eventCopy[p] = eventCopy[p].correspondingUseElement;
          }
        }
      }
      // keep the semantics of preventDefault
      if (inEvent.preventDefault) {
        eventCopy.preventDefault = function () {
          inEvent.preventDefault();
        };
      }
      return eventCopy;
    },
    getTarget: function getTarget(inEvent) {
      // if pointer capture is set, route all events for the specified pointerId
      // to the capture target
      return this.captureInfo[inEvent.pointerId] || inEvent._target;
    },
    setCapture: function setCapture(inPointerId, inTarget) {
      if (this.captureInfo[inPointerId]) {
        this.releaseCapture(inPointerId);
      }
      this.captureInfo[inPointerId] = inTarget;
      var e = document.createEvent('Event');
      e.initEvent('gotpointercapture', true, false);
      e.pointerId = inPointerId;
      this.implicitRelease = this.releaseCapture.bind(this, inPointerId);
      document.addEventListener('pointerup', this.implicitRelease);
      document.addEventListener('pointercancel', this.implicitRelease);
      e._target = inTarget;
      this.asyncDispatchEvent(e);
    },
    releaseCapture: function releaseCapture(inPointerId) {
      var t = this.captureInfo[inPointerId];
      if (t) {
        var e = document.createEvent('Event');
        e.initEvent('lostpointercapture', true, false);
        e.pointerId = inPointerId;
        this.captureInfo[inPointerId] = undefined;
        document.removeEventListener('pointerup', this.implicitRelease);
        document.removeEventListener('pointercancel', this.implicitRelease);
        e._target = t;
        this.asyncDispatchEvent(e);
      }
    },
    /**
     * Dispatches the event to its target.
     *
     * @param {Event} inEvent The event to be dispatched.
     * @return {Boolean} True if an event handler returns true, false otherwise.
     */
    dispatchEvent: /*scope.external.dispatchEvent || */function dispatchEvent(inEvent) {
      var t = this.getTarget(inEvent);
      if (t) {
        return t.dispatchEvent(inEvent);
      }
    },
    asyncDispatchEvent: function asyncDispatchEvent(inEvent) {
      requestAnimationFrame(this.dispatchEvent.bind(this, inEvent));
    }
  };
  dispatcher.boundHandler = dispatcher.eventHandler.bind(dispatcher);

  var _dispatcher = dispatcher;

  var targeting = {
    shadow: function shadow(inEl) {
      if (inEl) {
        return inEl.shadowRoot || inEl.webkitShadowRoot;
      }
    },
    canTarget: function canTarget(shadow) {
      return shadow && Boolean(shadow.elementFromPoint);
    },
    targetingShadow: function targetingShadow(inEl) {
      var s = this.shadow(inEl);
      if (this.canTarget(s)) {
        return s;
      }
    },
    olderShadow: function olderShadow(shadow) {
      var os = shadow.olderShadowRoot;
      if (!os) {
        var se = shadow.querySelector('shadow');
        if (se) {
          os = se.olderShadowRoot;
        }
      }
      return os;
    },
    allShadows: function allShadows(element) {
      var shadows = [],
          s = this.shadow(element);
      while (s) {
        shadows.push(s);
        s = this.olderShadow(s);
      }
      return shadows;
    },
    searchRoot: function searchRoot(inRoot, x, y) {
      if (inRoot) {
        var t = inRoot.elementFromPoint(x, y);
        var st, sr, os;
        // is element a shadow host?
        sr = this.targetingShadow(t);
        while (sr) {
          // find the the element inside the shadow root
          st = sr.elementFromPoint(x, y);
          if (!st) {
            // check for older shadows
            sr = this.olderShadow(sr);
          } else {
            // shadowed element may contain a shadow root
            var ssr = this.targetingShadow(st);
            return this.searchRoot(ssr, x, y) || st;
          }
        }
        // light dom element is the target
        return t;
      }
    },
    owner: function owner(element) {
      var s = element;
      // walk up until you hit the shadow root or document
      while (s.parentNode) {
        s = s.parentNode;
      }
      // the owner element is expected to be a Document or ShadowRoot
      if (s.nodeType != Node.DOCUMENT_NODE && s.nodeType != Node.DOCUMENT_FRAGMENT_NODE) {
        s = document;
      }
      return s;
    },
    findTarget: function findTarget(inEvent) {
      var x = inEvent.clientX,
          y = inEvent.clientY;
      // if the listener is in the shadow root, it is much faster to start there
      var s = this.owner(inEvent.target);
      // if x, y is not in this root, fall back to document search
      if (!s.elementFromPoint(x, y)) {
        s = document;
      }
      return this.searchRoot(s, x, y);
    }
  };

  /**
   * This module uses Mutation Observers to dynamically adjust which nodes will
   * generate Pointer Events.
   *
   * All nodes that wish to generate Pointer Events must have the attribute
   * `touch-action` set to `none`.
   */
  var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
  var map = Array.prototype.map.call.bind(Array.prototype.map);
  var toArray = Array.prototype.slice.call.bind(Array.prototype.slice);
  var filter = Array.prototype.filter.call.bind(Array.prototype.filter);
  var MO = window.MutationObserver || window.WebKitMutationObserver;
  var SELECTOR = '[touch-action]';
  var OBSERVER_INIT = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['touch-action']
  };

  function Installer(add, remove, changed, binder) {
    this.addCallback = add.bind(binder);
    this.removeCallback = remove.bind(binder);
    this.changedCallback = changed.bind(binder);
    if (MO) {
      this.observer = new MO(this.mutationWatcher.bind(this));
    }
  }

  Installer.prototype = {
    watchSubtree: function watchSubtree(target) {
      // Only watch scopes that can target find, as these are top-level.
      // Otherwise we can see duplicate additions and removals that add noise.
      //
      // TODO(dfreedman): For some instances with ShadowDOMPolyfill, we can see
      // a removal without an insertion when a node is redistributed among
      // shadows. Since it all ends up correct in the document, watching only
      // the document will yield the correct mutations to watch.
      if (targeting.canTarget(target)) {
        this.observer.observe(target, OBSERVER_INIT);
      }
    },
    enableOnSubtree: function enableOnSubtree(target) {
      this.watchSubtree(target);
      if (target === document && document.readyState !== 'complete') {
        this.installOnLoad();
      } else {
        this.installNewSubtree(target);
      }
    },
    installNewSubtree: function installNewSubtree(target) {
      forEach(this.findElements(target), this.addElement, this);
    },
    findElements: function findElements(target) {
      if (target.querySelectorAll) {
        return target.querySelectorAll(SELECTOR);
      }
      return [];
    },
    removeElement: function removeElement(el) {
      this.removeCallback(el);
    },
    addElement: function addElement(el) {
      this.addCallback(el);
    },
    elementChanged: function elementChanged(el, oldValue) {
      this.changedCallback(el, oldValue);
    },
    concatLists: function concatLists(accum, list) {
      return accum.concat(toArray(list));
    },
    // register all touch-action = none nodes on document load
    installOnLoad: function installOnLoad() {
      document.addEventListener('readystatechange', (function () {
        if (document.readyState === 'complete') {
          this.installNewSubtree(document);
        }
      }).bind(this));
    },
    isElement: function isElement(n) {
      return n.nodeType === Node.ELEMENT_NODE;
    },
    flattenMutationTree: function flattenMutationTree(inNodes) {
      // find children with touch-action
      var tree = map(inNodes, this.findElements, this);
      // make sure the added nodes are accounted for
      tree.push(filter(inNodes, this.isElement));
      // flatten the list
      return tree.reduce(this.concatLists, []);
    },
    mutationWatcher: function mutationWatcher(mutations) {
      mutations.forEach(this.mutationHandler, this);
    },
    mutationHandler: function mutationHandler(m) {
      if (m.type === 'childList') {
        var added = this.flattenMutationTree(m.addedNodes);
        added.forEach(this.addElement, this);
        var removed = this.flattenMutationTree(m.removedNodes);
        removed.forEach(this.removeElement, this);
      } else if (m.type === 'attributes') {
        this.elementChanged(m.target, m.oldValue);
      }
    }
  };

  if (!MO) {
    Installer.prototype.watchSubtree = function () {
      console.warn('PointerEventsPolyfill: MutationObservers not found, touch-action will not be dynamically detected');
    };
  }

  var installer = Installer;

  /**
   * This is the constructor for new PointerEvents.
   *
   * New Pointer Events must be given a type, and an optional dictionary of
   * initialization properties.
   *
   * Due to certain platform requirements, events returned from the constructor
   * identify as MouseEvents.
   *
   * @constructor
   * @param {String} inType The type of the event to create.
   * @param {Object} [inDict] An optional dictionary of initial event properties.
   * @return {Event} A new PointerEvent of type `inType` and initialized with properties from `inDict`.
   */
  var MOUSE_PROPS = ['bubbles', 'cancelable', 'view', 'detail', 'screenX', 'screenY', 'clientX', 'clientY', 'ctrlKey', 'altKey', 'shiftKey', 'metaKey', 'button', 'relatedTarget', 'pageX', 'pageY'];

  var MOUSE_DEFAULTS = [false, false, null, null, 0, 0, 0, 0, false, false, false, false, 0, null, 0, 0];

  function _PointerEvent__PointerEvent(inType, inDict) {
    inDict = inDict || Object.create(null);

    var e = document.createEvent('Event');
    e.initEvent(inType, inDict.bubbles || false, inDict.cancelable || false);

    // define inherited MouseEvent properties
    // skip bubbles and cancelable since they're set above in initEvent()
    for (var i = 2, p; i < MOUSE_PROPS.length; i++) {
      p = MOUSE_PROPS[i];
      e[p] = inDict[p] || MOUSE_DEFAULTS[i];
    }
    e.buttons = inDict.buttons || 0;

    // Spec requires that pointers without pressure specified use 0.5 for down
    // state and 0 for up state.
    var pressure = 0;
    if (inDict.pressure) {
      pressure = inDict.pressure;
    } else {
      pressure = e.buttons ? 0.5 : 0;
    }

    // add x/y properties aliased to clientX/Y
    e.x = e.clientX;
    e.y = e.clientY;

    // define the properties of the PointerEvent interface
    e.pointerId = inDict.pointerId || 0;
    e.width = inDict.width || 0;
    e.height = inDict.height || 0;
    e.pressure = pressure;
    e.tiltX = inDict.tiltX || 0;
    e.tiltY = inDict.tiltY || 0;
    e.pointerType = inDict.pointerType || '';
    e.hwTimestamp = inDict.hwTimestamp || 0;
    e.isPrimary = inDict.isPrimary || false;
    return e;
  }

  var _PointerEvent = _PointerEvent__PointerEvent;

  function shadowSelector(v) {
    return 'body /shadow-deep/ ' + selector(v);
  }
  function selector(v) {
    return '[touch-action="' + v + '"]';
  }
  function rule(v) {
    return '{ -ms-touch-action: ' + v + '; touch-action: ' + v + '; touch-action-delay: none; }';
  }
  var attrib2css = ['none', 'auto', 'pan-x', 'pan-y', {
    rule: 'pan-x pan-y',
    selectors: ['pan-x pan-y', 'pan-y pan-x']
  }];
  var styles = '';
  // only install stylesheet if the browser has touch action support
  var head = document.head;
  var hasNativePE = window.PointerEvent || window.MSPointerEvent;
  // only add shadow selectors if shadowdom is supported
  var hasShadowRoot = !window.ShadowDOMPolyfill && document.head.createShadowRoot;

  function applyAttributeStyles() {
    if (hasNativePE) {
      attrib2css.forEach(function (r) {
        if (String(r) === r) {
          styles += selector(r) + rule(r) + '\n';
          if (hasShadowRoot) {
            styles += shadowSelector(r) + rule(r) + '\n';
          }
        } else {
          styles += r.selectors.map(selector) + rule(r.rule) + '\n';
          if (hasShadowRoot) {
            styles += r.selectors.map(shadowSelector) + rule(r.rule) + '\n';
          }
        }
      });

      var el = document.createElement('style');
      el.textContent = styles;
      document.head.appendChild(el);
    }
  }

  var mouse__pointermap = _dispatcher.pointermap;
  // radius around touchend that swallows mouse events
  var DEDUP_DIST = 25;

  var WHICH_TO_BUTTONS = [0, 1, 4, 2];

  var HAS_BUTTONS = false;
  try {
    HAS_BUTTONS = new MouseEvent('test', { buttons: 1 }).buttons === 1;
  } catch (e) {}

  // handler block for native mouse events
  var mouseEvents = {
    POINTER_ID: 1,
    POINTER_TYPE: 'mouse',
    events: ['mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout'],
    register: function register(target) {
      _dispatcher.listen(target, this.events);
    },
    unregister: function unregister(target) {
      _dispatcher.unlisten(target, this.events);
    },
    lastTouches: [],
    // collide with the global mouse listener
    isEventSimulatedFromTouch: function isEventSimulatedFromTouch(inEvent) {
      var lts = this.lastTouches;
      var x = inEvent.clientX,
          y = inEvent.clientY;
      for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {
        // simulated mouse events will be swallowed near a primary touchend
        var dx = Math.abs(x - t.x),
            dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DIST && dy <= DEDUP_DIST) {
          return true;
        }
      }
    },
    prepareEvent: function prepareEvent(inEvent) {
      var e = _dispatcher.cloneEvent(inEvent);
      // forward mouse preventDefault
      var pd = e.preventDefault;
      e.preventDefault = function () {
        inEvent.preventDefault();
        pd();
      };
      e.pointerId = this.POINTER_ID;
      e.isPrimary = true;
      e.pointerType = this.POINTER_TYPE;
      if (!HAS_BUTTONS) {
        e.buttons = WHICH_TO_BUTTONS[e.which] || 0;
      }
      return e;
    },
    mousedown: function mousedown(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var p = mouse__pointermap.has(this.POINTER_ID);
        // TODO(dfreedman) workaround for some elements not sending mouseup
        // http://crbug/149091
        if (p) {
          this.cancel(inEvent);
        }
        var e = this.prepareEvent(inEvent);
        mouse__pointermap.set(this.POINTER_ID, inEvent);
        _dispatcher.down(e);
      }
    },
    mousemove: function mousemove(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        _dispatcher.move(e);
      }
    },
    mouseup: function mouseup(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var p = mouse__pointermap.get(this.POINTER_ID);
        if (p && p.button === inEvent.button) {
          var e = this.prepareEvent(inEvent);
          _dispatcher.up(e);
          this.cleanupMouse();
        }
      }
    },
    mouseover: function mouseover(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        _dispatcher.enterOver(e);
      }
    },
    mouseout: function mouseout(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        _dispatcher.leaveOut(e);
      }
    },
    cancel: function cancel(inEvent) {
      var e = this.prepareEvent(inEvent);
      _dispatcher.cancel(e);
      this.cleanupMouse();
    },
    cleanupMouse: function cleanupMouse() {
      mouse__pointermap['delete'](this.POINTER_ID);
    }
  };

  var mouse = mouseEvents;

  var captureInfo = _dispatcher.captureInfo;
  var findTarget = targeting.findTarget.bind(targeting);
  var allShadows = targeting.allShadows.bind(targeting);
  var touch__pointermap = _dispatcher.pointermap;
  var touchMap = Array.prototype.map.call.bind(Array.prototype.map);
  // This should be long enough to ignore compat mouse events made by touch
  var DEDUP_TIMEOUT = 2500;
  var CLICK_COUNT_TIMEOUT = 200;
  var ATTRIB = 'touch-action';
  var INSTALLER;
  // The presence of touch event handlers blocks scrolling, and so we must be careful to
  // avoid adding handlers unnecessarily.  Chrome plans to add a touch-action-delay property
  // (crbug.com/329559) to address this, and once we have that we can opt-in to a simpler
  // handler registration mechanism.  Rather than try to predict how exactly to opt-in to
  // that we'll just leave this disabled until there is a build of Chrome to test.
  var HAS_TOUCH_ACTION_DELAY = false;

  // handler block for native touch events
  var touchEvents = {
    events: ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
    register: function register(target) {
      if (HAS_TOUCH_ACTION_DELAY) {
        _dispatcher.listen(target, this.events);
      } else {
        INSTALLER.enableOnSubtree(target);
      }
    },
    unregister: function unregister(target) {
      if (HAS_TOUCH_ACTION_DELAY) {
        _dispatcher.unlisten(target, this.events);
      } else {
        // TODO(dfreedman): is it worth it to disconnect the MO?
      }
    },
    elementAdded: function elementAdded(el) {
      var a = el.getAttribute(ATTRIB);
      var st = this.touchActionToScrollType(a);
      if (st) {
        el._scrollType = st;
        _dispatcher.listen(el, this.events);
        // set touch-action on shadows as well
        allShadows(el).forEach(function (s) {
          s._scrollType = st;
          _dispatcher.listen(s, this.events);
        }, this);
      }
    },
    elementRemoved: function elementRemoved(el) {
      el._scrollType = undefined;
      _dispatcher.unlisten(el, this.events);
      // remove touch-action from shadow
      allShadows(el).forEach(function (s) {
        s._scrollType = undefined;
        _dispatcher.unlisten(s, this.events);
      }, this);
    },
    elementChanged: function elementChanged(el, oldValue) {
      var a = el.getAttribute(ATTRIB);
      var st = this.touchActionToScrollType(a);
      var oldSt = this.touchActionToScrollType(oldValue);
      // simply update scrollType if listeners are already established
      if (st && oldSt) {
        el._scrollType = st;
        allShadows(el).forEach(function (s) {
          s._scrollType = st;
        }, this);
      } else if (oldSt) {
        this.elementRemoved(el);
      } else if (st) {
        this.elementAdded(el);
      }
    },
    scrollTypes: {
      EMITTER: 'none',
      XSCROLLER: 'pan-x',
      YSCROLLER: 'pan-y',
      SCROLLER: /^(?:pan-x pan-y)|(?:pan-y pan-x)|auto$/
    },
    touchActionToScrollType: function touchActionToScrollType(touchAction) {
      var t = touchAction;
      var st = this.scrollTypes;
      if (t === 'none') {
        return 'none';
      } else if (t === st.XSCROLLER) {
        return 'X';
      } else if (t === st.YSCROLLER) {
        return 'Y';
      } else if (st.SCROLLER.exec(t)) {
        return 'XY';
      }
    },
    POINTER_TYPE: 'touch',
    firstTouch: null,
    isPrimaryTouch: function isPrimaryTouch(inTouch) {
      return this.firstTouch === inTouch.identifier;
    },
    setPrimaryTouch: function setPrimaryTouch(inTouch) {
      // set primary touch if there no pointers, or the only pointer is the mouse
      if (touch__pointermap.pointers() === 0 || touch__pointermap.pointers() === 1 && touch__pointermap.has(1)) {
        this.firstTouch = inTouch.identifier;
        this.firstXY = { X: inTouch.clientX, Y: inTouch.clientY };
        this.scrolling = false;
        this.cancelResetClickCount();
      }
    },
    removePrimaryPointer: function removePrimaryPointer(inPointer) {
      if (inPointer.isPrimary) {
        this.firstTouch = null;
        this.firstXY = null;
        this.resetClickCount();
      }
    },
    clickCount: 0,
    resetId: null,
    resetClickCount: function resetClickCount() {
      var fn = (function () {
        this.clickCount = 0;
        this.resetId = null;
      }).bind(this);
      this.resetId = setTimeout(fn, CLICK_COUNT_TIMEOUT);
    },
    cancelResetClickCount: function cancelResetClickCount() {
      if (this.resetId) {
        clearTimeout(this.resetId);
      }
    },
    typeToButtons: function typeToButtons(type) {
      var ret = 0;
      if (type === 'touchstart' || type === 'touchmove') {
        ret = 1;
      }
      return ret;
    },
    touchToPointer: function touchToPointer(inTouch) {
      var cte = this.currentTouchEvent;
      var e = _dispatcher.cloneEvent(inTouch);
      // Spec specifies that pointerId 1 is reserved for Mouse.
      // Touch identifiers can start at 0.
      // Add 2 to the touch identifier for compatibility.
      var id = e.pointerId = inTouch.identifier + 2;
      e.target = captureInfo[id] || findTarget(e);
      e.bubbles = true;
      e.cancelable = true;
      e.detail = this.clickCount;
      e.button = 0;
      e.buttons = this.typeToButtons(cte.type);
      e.width = inTouch.webkitRadiusX || inTouch.radiusX || 0;
      e.height = inTouch.webkitRadiusY || inTouch.radiusY || 0;
      e.pressure = inTouch.webkitForce || inTouch.force || 0.5;
      e.isPrimary = this.isPrimaryTouch(inTouch);
      e.pointerType = this.POINTER_TYPE;
      // forward touch preventDefaults
      var self = this;
      e.preventDefault = function () {
        self.scrolling = false;
        self.firstXY = null;
        cte.preventDefault();
      };
      return e;
    },
    processTouches: function processTouches(inEvent, inFunction) {
      var tl = inEvent.changedTouches;
      this.currentTouchEvent = inEvent;
      for (var i = 0, t; i < tl.length; i++) {
        t = tl[i];
        inFunction.call(this, this.touchToPointer(t));
      }
    },
    // For single axis scrollers, determines whether the element should emit
    // pointer events or behave as a scroller
    shouldScroll: function shouldScroll(inEvent) {
      if (this.firstXY) {
        var ret;
        var scrollAxis = inEvent.currentTarget._scrollType;
        if (scrollAxis === 'none') {
          // this element is a touch-action: none, should never scroll
          ret = false;
        } else if (scrollAxis === 'XY') {
          // this element should always scroll
          ret = true;
        } else {
          var t = inEvent.changedTouches[0];
          // check the intended scroll axis, and other axis
          var a = scrollAxis;
          var oa = scrollAxis === 'Y' ? 'X' : 'Y';
          var da = Math.abs(t['client' + a] - this.firstXY[a]);
          var doa = Math.abs(t['client' + oa] - this.firstXY[oa]);
          // if delta in the scroll axis > delta other axis, scroll instead of
          // making events
          ret = da >= doa;
        }
        this.firstXY = null;
        return ret;
      }
    },
    findTouch: function findTouch(inTL, inId) {
      for (var i = 0, l = inTL.length, t; i < l && (t = inTL[i]); i++) {
        if (t.identifier === inId) {
          return true;
        }
      }
    },
    // In some instances, a touchstart can happen without a touchend. This
    // leaves the pointermap in a broken state.
    // Therefore, on every touchstart, we remove the touches that did not fire a
    // touchend event.
    // To keep state globally consistent, we fire a
    // pointercancel for this "abandoned" touch
    vacuumTouches: function vacuumTouches(inEvent) {
      var tl = inEvent.touches;
      // pointermap.pointers() should be < tl.length here, as the touchstart has not
      // been processed yet.
      if (touch__pointermap.pointers() >= tl.length) {
        var d = [];
        touch__pointermap.forEach(function (value, key) {
          // Never remove pointerId == 1, which is mouse.
          // Touch identifiers are 2 smaller than their pointerId, which is the
          // index in pointermap.
          if (key !== 1 && !this.findTouch(tl, key - 2)) {
            var p = value.out;
            d.push(p);
          }
        }, this);
        d.forEach(this.cancelOut, this);
      }
    },
    touchstart: function touchstart(inEvent) {
      this.vacuumTouches(inEvent);
      this.setPrimaryTouch(inEvent.changedTouches[0]);
      this.dedupSynthMouse(inEvent);
      if (!this.scrolling) {
        this.clickCount++;
        this.processTouches(inEvent, this.overDown);
      }
    },
    overDown: function overDown(inPointer) {
      var p = touch__pointermap.set(inPointer.pointerId, {
        target: inPointer.target,
        out: inPointer,
        outTarget: inPointer.target
      });
      _dispatcher.over(inPointer);
      _dispatcher.enter(inPointer);
      _dispatcher.down(inPointer);
    },
    touchmove: function touchmove(inEvent) {
      if (!this.scrolling) {
        if (this.shouldScroll(inEvent)) {
          this.scrolling = true;
          this.touchcancel(inEvent);
        } else {
          inEvent.preventDefault();
          this.processTouches(inEvent, this.moveOverOut);
        }
      }
    },
    moveOverOut: function moveOverOut(inPointer) {
      var event = inPointer;
      var pointer = touch__pointermap.get(event.pointerId);
      // a finger drifted off the screen, ignore it
      if (!pointer) {
        return;
      }
      var outEvent = pointer.out;
      var outTarget = pointer.outTarget;
      _dispatcher.move(event);
      if (outEvent && outTarget !== event.target) {
        outEvent.relatedTarget = event.target;
        event.relatedTarget = outTarget;
        // recover from retargeting by shadow
        outEvent.target = outTarget;
        if (event.target) {
          _dispatcher.leaveOut(outEvent);
          _dispatcher.enterOver(event);
        } else {
          // clean up case when finger leaves the screen
          event.target = outTarget;
          event.relatedTarget = null;
          this.cancelOut(event);
        }
      }
      pointer.out = event;
      pointer.outTarget = event.target;
    },
    touchend: function touchend(inEvent) {
      this.dedupSynthMouse(inEvent);
      this.processTouches(inEvent, this.upOut);
    },
    upOut: function upOut(inPointer) {
      if (!this.scrolling) {
        _dispatcher.up(inPointer);
        _dispatcher.out(inPointer);
        _dispatcher.leave(inPointer);
      }
      this.cleanUpPointer(inPointer);
    },
    touchcancel: function touchcancel(inEvent) {
      this.processTouches(inEvent, this.cancelOut);
    },
    cancelOut: function cancelOut(inPointer) {
      _dispatcher.cancel(inPointer);
      _dispatcher.out(inPointer);
      _dispatcher.leave(inPointer);
      this.cleanUpPointer(inPointer);
    },
    cleanUpPointer: function cleanUpPointer(inPointer) {
      touch__pointermap['delete'](inPointer.pointerId);
      this.removePrimaryPointer(inPointer);
    },
    // prevent synth mouse events from creating pointer events
    dedupSynthMouse: function dedupSynthMouse(inEvent) {
      var lts = mouse.lastTouches;
      var t = inEvent.changedTouches[0];
      // only the primary finger will synth mouse events
      if (this.isPrimaryTouch(t)) {
        // remember x/y of last touch
        var lt = { x: t.clientX, y: t.clientY };
        lts.push(lt);
        var fn = (function (lts, lt) {
          var i = lts.indexOf(lt);
          if (i > -1) {
            lts.splice(i, 1);
          }
        }).bind(null, lts, lt);
        setTimeout(fn, DEDUP_TIMEOUT);
      }
    }
  };

  if (!HAS_TOUCH_ACTION_DELAY) {
    INSTALLER = new installer(touchEvents.elementAdded, touchEvents.elementRemoved, touchEvents.elementChanged, touchEvents);
  }

  var touch = touchEvents;

  var ms__pointermap = _dispatcher.pointermap;
  var HAS_BITMAP_TYPE = window.MSPointerEvent && typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE === 'number';
  var msEvents = {
    events: ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerOut', 'MSPointerOver', 'MSPointerCancel', 'MSGotPointerCapture', 'MSLostPointerCapture'],
    register: function register(target) {
      _dispatcher.listen(target, this.events);
    },
    unregister: function unregister(target) {
      _dispatcher.unlisten(target, this.events);
    },
    POINTER_TYPES: ['', 'unavailable', 'touch', 'pen', 'mouse'],
    prepareEvent: function prepareEvent(inEvent) {
      var e = inEvent;
      if (HAS_BITMAP_TYPE) {
        e = _dispatcher.cloneEvent(inEvent);
        e.pointerType = this.POINTER_TYPES[inEvent.pointerType];
      }
      return e;
    },
    cleanup: function cleanup(id) {
      ms__pointermap['delete'](id);
    },
    MSPointerDown: function MSPointerDown(inEvent) {
      ms__pointermap.set(inEvent.pointerId, inEvent);
      var e = this.prepareEvent(inEvent);
      _dispatcher.down(e);
    },
    MSPointerMove: function MSPointerMove(inEvent) {
      var e = this.prepareEvent(inEvent);
      _dispatcher.move(e);
    },
    MSPointerUp: function MSPointerUp(inEvent) {
      var e = this.prepareEvent(inEvent);
      _dispatcher.up(e);
      this.cleanup(inEvent.pointerId);
    },
    MSPointerOut: function MSPointerOut(inEvent) {
      var e = this.prepareEvent(inEvent);
      _dispatcher.leaveOut(e);
    },
    MSPointerOver: function MSPointerOver(inEvent) {
      var e = this.prepareEvent(inEvent);
      _dispatcher.enterOver(e);
    },
    MSPointerCancel: function MSPointerCancel(inEvent) {
      var e = this.prepareEvent(inEvent);
      _dispatcher.cancel(e);
      this.cleanup(inEvent.pointerId);
    },
    MSLostPointerCapture: function MSLostPointerCapture(inEvent) {
      var e = _dispatcher.makeEvent('lostpointercapture', inEvent);
      _dispatcher.dispatchEvent(e);
    },
    MSGotPointerCapture: function MSGotPointerCapture(inEvent) {
      var e = _dispatcher.makeEvent('gotpointercapture', inEvent);
      _dispatcher.dispatchEvent(e);
    }
  };

  var ms = msEvents;

  function platform_events__applyPolyfill() {
    // only activate if this platform does not have pointer events
    if (!window.PointerEvent) {
      window.PointerEvent = _PointerEvent;

      if (window.navigator.msPointerEnabled) {
        var tp = window.navigator.msMaxTouchPoints;
        Object.defineProperty(window.navigator, 'maxTouchPoints', {
          value: tp,
          enumerable: true
        });
        _dispatcher.registerSource('ms', ms);
      } else {
        _dispatcher.registerSource('mouse', mouse);
        if (window.ontouchstart !== undefined) {
          _dispatcher.registerSource('touch', touch);
        }
      }

      _dispatcher.register(document);
    }
  }

  var n = window.navigator;
  var s, r;
  function assertDown(id) {
    if (!_dispatcher.pointermap.has(id)) {
      throw new Error('InvalidPointerId');
    }
  }
  if (n.msPointerEnabled) {
    s = function (pointerId) {
      assertDown(pointerId);
      this.msSetPointerCapture(pointerId);
    };
    r = function (pointerId) {
      assertDown(pointerId);
      this.msReleasePointerCapture(pointerId);
    };
  } else {
    s = function setPointerCapture(pointerId) {
      assertDown(pointerId);
      _dispatcher.setCapture(pointerId, this);
    };
    r = function releasePointerCapture(pointerId) {
      assertDown(pointerId);
      _dispatcher.releaseCapture(pointerId, this);
    };
  }

  function capture__applyPolyfill() {
    if (window.Element && !Element.prototype.setPointerCapture) {
      Object.defineProperties(Element.prototype, {
        'setPointerCapture': {
          value: s
        },
        'releasePointerCapture': {
          value: r
        }
      });
    }
  }

  applyAttributeStyles();
  platform_events__applyPolyfill();
  capture__applyPolyfill();

  var pointerevents = {
    dispatcher: _dispatcher,
    Installer: installer,
    PointerEvent: _PointerEvent,
    PointerMap: _pointermap,
    targetFinding: targeting
  };

  return pointerevents;
});

},{}],8:[function(require,module,exports){
/*
	Returns a 2d uv coord at the intersection 
	of a plane and a 2d screen coordinate 
	projected into the scene
*/

// import THREE from 'three'

"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var vector = new THREE.Vector3();
var raycaster = new THREE.Raycaster();
var plane = new THREE.Plane();
var facing = new THREE.Vector3(0, 0, -1);
var matObjWorldInv = new THREE.Matrix4();
var intersection = new THREE.Vector3();
var coplanarPoint = new THREE.Vector3(10, 10, 1);

exports["default"] = function (camera, screenCoord, object) {
	facing.set(0, 0, -1).transformDirection(object.matrixWorld);
	coplanarPoint.set(10, 10, 1).applyMatrix4(object.matrixWorld);

	plane.setFromNormalAndCoplanarPoint(facing, coplanarPoint);
	vector.set(screenCoord[0], screenCoord[1], 0.5);
	vector.unproject(camera);
	raycaster.set(camera.position, vector.sub(camera.position).normalize());

	raycaster.ray.intersectPlane(plane, intersection);
	matObjWorldInv.getInverse(object.matrixWorld);
	return intersection.applyMatrix4(matObjWorldInv);
};

module.exports = exports["default"];

},{}],9:[function(require,module,exports){
'use strict';

var xtend = require('xtend');

module.exports = function (opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.06;
  var smooth = typeof opt.smooth === 'number' ? opt.smooth : 1 / 16;
  return xtend({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      smooth: { type: 'f', value: smooth },
      map: { type: 't', value: opt.map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(opt.color) }
    },
    vertexShader: ["attribute float page;", "varying vec2 vUv;", "varying float vPage;", "void main() {", "vUv = uv;", "vPage = page;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xyz, 1.0 );", "}"].join("\n"),
    fragmentShader: ["#define SQRT2 1.4142135623730951", "uniform float opacity;", "uniform vec3 color;", "uniform sampler2D map;", "uniform float smooth;", "varying float vPage;", "varying vec2 vUv;", "#ifdef GL_OES_standard_derivatives", "#extension GL_OES_standard_derivatives : enable", "#endif", "float aastep(float threshold, float value) {", "#ifdef GL_OES_standard_derivatives", "float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;", "return smoothstep(threshold-afwidth, threshold+afwidth, value);", "#else", "return step(threshold, value);", "#endif  ", "}", "void main() {", "vec4 texColor = texture2D(map, vUv);", "float dst = texColor.a;", "float afwidth = smooth * SQRT2 / (2.0 * gl_FragCoord.w);", "float alpha = aastep( 0.45, dst );//smoothstep(0.5 - afwidth, 0.5 + afwidth, dst);", "gl_FragColor = vec4(color, opacity * alpha);", THREE.ShaderChunk["alphatest_fragment"], "}"].join("\n"),
    defines: {
      "USE_MAP": "",
      "ALPHATEST": Number(alphaTest || 0).toFixed(1)
    }
  }, opt);
};

},{"xtend":42}],10:[function(require,module,exports){
// import THREE from 'three'
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _meshFacingMaterial = require('./mesh-facing-material');

var _meshFacingMaterial2 = _interopRequireDefault(_meshFacingMaterial);

exports["default"] = function (resolution) {
	return (0, _meshFacingMaterial2["default"])(new THREE.ShaderMaterial({

		uniforms: {

			uResolution: { type: "v2", value: resolution },
			// uOrigin: { type: "v2", value: new THREE.Vector2( resolution.x*0.5, resolution.y*0.5) },
			// uRadius: { type: "f", value: 0 },
			uOpacity: { type: "f", value: 1.0 }

		},

		fragmentShader: "\n\n\t\t\t\t#ifdef GL_OES_standard_derivatives\n\t\t\t\t\t#extension GL_OES_standard_derivatives : enable\n\t\t\t\t#endif\n\n\t\t\t\tvarying vec2 vUv;\n\n\t\t\t\tuniform vec2 uResolution;\n\t\t\t\t// uniform vec2 uOrigin;\n\t\t\t\tuniform float uOpacity;\n\t\t\t\t// uniform float uRadius;\n\n\t\t\t\tfloat aastep(float threshold, float value) {\n\t\t\t\t\t#ifdef GL_OES_standard_derivatives\n\t\t\t\t\t\tfloat afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;\n\t\t\t\t\t\treturn smoothstep(threshold-afwidth, threshold+afwidth, value);\n\t\t\t\t\t#else\n\t\t\t\t\t\treturn step(threshold, value);\n\t\t\t\t\t#endif  \n\t\t\t\t}\n\n\n\t\t\t\tfloat line( vec2 p, float thickness ){\n\t\t\t\t\treturn aastep( thickness, abs( p.x ));\n\t\t\t\t}\n\n\n\t\t\t\tfloat lines( vec2 p, vec2 c, float thickness ){\n\t\t\t\t\tvec2 q = mod( p, c ) - 0.5 * c;\n\t\t\t\t\treturn line( q, thickness );\n\t\t\t\t}\n\n\n\t\t\t\tvoid main(){\n\n\n\t\t\t\t\t// COORDS\n\t\t\t\t\tvec2 p = vUv * uResolution;\n\t\t\t\t\tvec4 col = vec4(0.0);\n\n\n\n\t\t\t\t\t// DEFINE LINE STYLES\n\t\t\t\t\tfloat lineThickness = 1.;\n\t\t\t\t\tfloat lineSpacing = 30.0;\n\t\t\t\t\tvec3 lineColor = vec3( 1, 0.9, 0.3 );\n\t\t\t\t\t// vec3 focusColor = vec3( 1.0, 0.0, 1.0 );\n\n\n\n\t\t\t\t\t// // DISTORT COORDINATES AT HOTSPOT\n\t\t\t\t\t// float distortionFactor = pinch( p, uOrigin, uRadius * 1.5, 1.2, 0.5 );\n\t\t\t\t\t// vec2 distortion = ( p - uOrigin ) * distortionFactor * 0.9;\n\n\n\n\t\t\t\t\t// CALCULATE LINES\t\t\t\t\n\t\t\t\t\tfloat value = lines( p, vec2( lineSpacing, 0.0 ), lineThickness );\n\n\n\n\n\t\t\t\t\t// col.rgb = mix( lineColor, focusColor, distortionFactor );\n\t\t\t\t\tcol.rgb = mix( lineColor, vec3( 1.0 ), value );\n\t\t\t\t\tcol.a = uOpacity;\n\n\t\t\t\t\t\n\n\t\t\t\t\tgl_FragColor = col;\n\n\t\t\t\t}\n\n\t\t\t",
		// blending: THREE.MultiplyBlending,
		transparent: true,
		vertexShader: defaultVertexShader
	}));
};

// Standard vertex shader
var defaultVertexShader = "\n\tvarying vec2 vUv;\n\tvoid main() {\n\t\tvUv = uv;\n\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t}\n";
module.exports = exports["default"];

},{"./mesh-facing-material":6}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _tone = require('tone');

// create synth object
//create an effect and connect it to the master output

var _tone2 = _interopRequireDefault(_tone);

var tremolo = new _tone2["default"].Tremolo().toMaster().start();
tremolo.frequency.value = 2;
tremolo.depth.value = 0.7;
//create a synth and connect it to the effect
var synth = new _tone2["default"].SimpleSynth({ volume: -10 }).connect(tremolo);
synth.oscillator.type = "triangle";
synth.envelope.attack = 0.9;
synth.envelope.decay = 1.0;
synth.envelope.sustain = 0.4;
synth.envelope.release = 1.5;

var _openSound = new _tone2["default"].Player({
	"url": "./audio/open-puck.mp3",
	"loop": false
}).toMaster();

var _closeSound = new _tone2["default"].Player({
	"url": "./audio/close-puck.mp3",
	"loop": false
}).toMaster();

var _tapSound = new _tone2["default"].Player({
	"url": "./audio/tap.mp3",
	"loop": false
}).toMaster();

exports["default"] = {

	triggerInteraction: function triggerInteraction() {
		return synth.triggerAttack("G4");
	},
	stopInteraction: function stopInteraction() {
		return synth.triggerRelease();
	},

	openSound: function openSound() {
		return _openSound.start();
	},
	closeSound: function closeSound() {
		return _closeSound.start();
	},
	tapSound: function tapSound() {
		return _tapSound.start();
	}

};
module.exports = exports["default"];

},{"tone":41}],12:[function(require,module,exports){
'use strict';

var loadFont = require('load-bmfont');
// global.THREE = require('three')

//A utility to load a font, then a texture
module.exports = function (opt, cb) {
  loadFont(opt.font, function (err, font) {
    if (err) throw err;
    THREE.ImageUtils.loadTexture(opt.image, undefined, function (tex) {
      cb(font, tex);
    });
  });
};

},{"load-bmfont":13}],13:[function(require,module,exports){
(function (Buffer){
var xhr = require('xhr')
var noop = function(){}
var parseASCII = require('parse-bmfont-ascii')
var parseXML = require('parse-bmfont-xml')
var readBinary = require('parse-bmfont-binary')
var isBinaryFormat = require('./lib/is-binary')
var xtend = require('xtend')

var xml2 = (function hasXML2() {
  return window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest
})()

module.exports = function(opt, cb) {
  cb = typeof cb === 'function' ? cb : noop

  if (typeof opt === 'string')
    opt = { uri: opt }
  else if (!opt)
    opt = {}

  var expectBinary = opt.binary
  if (expectBinary)
    opt = getBinaryOpts(opt)

  xhr(opt, function(err, res, body) {
    if (err)
      return cb(err)
    if (!/^2/.test(res.statusCode))
      return cb(new Error('http status code: '+res.statusCode))
    if (!body)
      return cb(new Error('no body result'))

    var binary = false 

    //if the response type is an array buffer,
    //we need to convert it into a regular Buffer object
    if (isArrayBuffer(body)) {
      var array = new Uint8Array(body)
      body = new Buffer(array, 'binary')
    }

    //now check the string/Buffer response
    //and see if it has a binary BMF header
    if (isBinaryFormat(body)) {
      binary = true
      //if we have a string, turn it into a Buffer
      if (typeof body === 'string') 
        body = new Buffer(body, 'binary')
    } 

    //we are not parsing a binary format, just ASCII/XML/etc
    if (!binary) {
      //might still be a buffer if responseType is 'arraybuffer'
      if (Buffer.isBuffer(body))
        body = body.toString(opt.encoding)
      body = body.trim()
    }

    var result
    try {
      var type = res.headers['content-type']
      if (binary)
        result = readBinary(body)
      else if (/json/.test(type) || body.charAt(0) === '{')
        result = JSON.parse(body)
      else if (/xml/.test(type)  || body.charAt(0) === '<')
        result = parseXML(body)
      else
        result = parseASCII(body)
    } catch (e) {
      cb(new Error('error parsing font '+e.message))
      cb = noop
    }
    cb(null, result)
  })
}

function isArrayBuffer(arr) {
  var str = Object.prototype.toString
  return str.call(arr) === '[object ArrayBuffer]'
}

function getBinaryOpts(opt) {
  //IE10+ and other modern browsers support array buffers
  if (xml2)
    return xtend(opt, { responseType: 'arraybuffer' })
  
  if (typeof window.XMLHttpRequest === 'undefined')
    throw new Error('your browser does not support XHR loading')

  //IE9 and XML1 browsers could still use an override
  var req = new window.XMLHttpRequest()
  req.overrideMimeType('text/plain; charset=x-user-defined')
  return xtend({
    xhr: req
  }, opt)
}
}).call(this,require("buffer").Buffer)
},{"./lib/is-binary":14,"buffer":43,"parse-bmfont-ascii":16,"parse-bmfont-binary":17,"parse-bmfont-xml":18,"xhr":21,"xtend":28}],14:[function(require,module,exports){
(function (Buffer){
var equal = require('buffer-equal')
var HEADER = new Buffer([66, 77, 70, 3])

module.exports = function(buf) {
  if (typeof buf === 'string')
    return buf.substring(0, 3) === 'BMF'
  return buf.length > 4 && equal(buf.slice(0, 4), HEADER)
}
}).call(this,require("buffer").Buffer)
},{"buffer":43,"buffer-equal":15}],15:[function(require,module,exports){
var Buffer = require('buffer').Buffer; // for use with browserify

module.exports = function (a, b) {
    if (!Buffer.isBuffer(a)) return undefined;
    if (!Buffer.isBuffer(b)) return undefined;
    if (typeof a.equals === 'function') return a.equals(b);
    if (a.length !== b.length) return false;
    
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    
    return true;
};

},{"buffer":43}],16:[function(require,module,exports){
module.exports = function parseBMFontAscii(data) {
  if (!data)
    throw new Error('no data provided')
  data = data.toString().trim()

  var output = {
    pages: [],
    chars: [],
    kernings: []
  }

  var lines = data.split(/\r\n?|\n/g)

  if (lines.length === 0)
    throw new Error('no data in BMFont file')

  for (var i = 0; i < lines.length; i++) {
    var lineData = splitLine(lines[i], i)
    if (!lineData) //skip empty lines
      continue

    if (lineData.key === 'page') {
      if (typeof lineData.data.id !== 'number')
        throw new Error('malformed file at line ' + i + ' -- needs page id=N')
      if (typeof lineData.data.file !== 'string')
        throw new Error('malformed file at line ' + i + ' -- needs page file="path"')
      output.pages[lineData.data.id] = lineData.data.file
    } else if (lineData.key === 'chars' || lineData.key === 'kernings') {
      //... do nothing for these two ...
    } else if (lineData.key === 'char') {
      output.chars.push(lineData.data)
    } else if (lineData.key === 'kerning') {
      output.kernings.push(lineData.data)
    } else {
      output[lineData.key] = lineData.data
    }
  }

  return output
}

function splitLine(line, idx) {
  line = line.replace(/\t+/g, ' ').trim()
  if (!line)
    return null

  var space = line.indexOf(' ')
  if (space === -1) 
    throw new Error("no named row at line " + idx)

  var key = line.substring(0, space)

  line = line.substring(space + 1)
  //clear "letter" field as it is non-standard and
  //requires additional complexity to parse " / = symbols
  line = line.replace(/letter=[\'\"]\S+[\'\"]/gi, '')  
  line = line.split("=")
  line = line.map(function(str) {
    return str.trim().match((/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g))
  })

  var data = []
  for (var i = 0; i < line.length; i++) {
    var dt = line[i]
    if (i === 0) {
      data.push({
        key: dt[0],
        data: ""
      })
    } else if (i === line.length - 1) {
      data[data.length - 1].data = parseData(dt[0])
    } else {
      data[data.length - 1].data = parseData(dt[0])
      data.push({
        key: dt[1],
        data: ""
      })
    }
  }

  var out = {
    key: key,
    data: {}
  }

  data.forEach(function(v) {
    out.data[v.key] = v.data;
  })

  return out
}

function parseData(data) {
  if (!data || data.length === 0)
    return ""

  if (data.indexOf('"') === 0 || data.indexOf("'") === 0)
    return data.substring(1, data.length - 1)
  if (data.indexOf(',') !== -1)
    return parseIntList(data)
  return parseInt(data, 10)
}

function parseIntList(data) {
  return data.split(',').map(function(val) {
    return parseInt(val, 10)
  })
}
},{}],17:[function(require,module,exports){
var HEADER = [66, 77, 70]

module.exports = function readBMFontBinary(buf) {
  if (buf.length < 6)
    throw new Error('invalid buffer length for BMFont')

  var header = HEADER.every(function(byte, i) {
    return buf.readUInt8(i) === byte
  })

  if (!header)
    throw new Error('BMFont missing BMF byte header')

  var i = 3
  var vers = buf.readUInt8(i++)
  if (vers > 3)
    throw new Error('Only supports BMFont Binary v3 (BMFont App v1.10)')
  
  var target = { kernings: [], chars: [] }
  for (var b=0; b<5; b++)
    i += readBlock(target, buf, i)
  return target
}

function readBlock(target, buf, i) {
  if (i > buf.length-1)
    return 0

  var blockID = buf.readUInt8(i++)
  var blockSize = buf.readInt32LE(i)
  i += 4

  switch(blockID) {
    case 1: 
      target.info = readInfo(buf, i)
      break
    case 2:
      target.common = readCommon(buf, i)
      break
    case 3:
      target.pages = readPages(buf, i, blockSize)
      break
    case 4:
      target.chars = readChars(buf, i, blockSize)
      break
    case 5:
      target.kernings = readKernings(buf, i, blockSize)
      break
  }
  return 5 + blockSize
}

function readInfo(buf, i) {
  var info = {}
  info.size = buf.readInt16LE(i)

  var bitField = buf.readUInt8(i+2)
  info.smooth = (bitField >> 7) & 1
  info.unicode = (bitField >> 6) & 1
  info.italic = (bitField >> 5) & 1
  info.bold = (bitField >> 4) & 1
  
  //fixedHeight is only mentioned in binary spec 
  if ((bitField >> 3) & 1)
    info.fixedHeight = 1
  
  info.charset = buf.readUInt8(i+3) || ''
  info.stretchH = buf.readUInt16LE(i+4)
  info.aa = buf.readUInt8(i+6)
  info.padding = [
    buf.readInt8(i+7),
    buf.readInt8(i+8),
    buf.readInt8(i+9),
    buf.readInt8(i+10)
  ]
  info.spacing = [
    buf.readInt8(i+11),
    buf.readInt8(i+12)
  ]
  info.outline = buf.readUInt8(i+13)
  info.face = readStringNT(buf, i+14)
  return info
}

function readCommon(buf, i) {
  var common = {}
  common.lineHeight = buf.readUInt16LE(i)
  common.base = buf.readUInt16LE(i+2)
  common.scaleW = buf.readUInt16LE(i+4)
  common.scaleH = buf.readUInt16LE(i+6)
  common.pages = buf.readUInt16LE(i+8)
  var bitField = buf.readUInt8(i+10)
  common.packed = 0
  common.alphaChnl = buf.readUInt8(i+11)
  common.redChnl = buf.readUInt8(i+12)
  common.greenChnl = buf.readUInt8(i+13)
  common.blueChnl = buf.readUInt8(i+14)
  return common
}

function readPages(buf, i, size) {
  var pages = []
  var text = readNameNT(buf, i)
  var len = text.length+1
  var count = size / len
  for (var c=0; c<count; c++) {
    pages[c] = buf.slice(i, i+text.length).toString('utf8')
    i += len
  }
  return pages
}

function readChars(buf, i, blockSize) {
  var chars = []

  var count = blockSize / 20
  for (var c=0; c<count; c++) {
    var char = {}
    var off = c*20
    char.id = buf.readUInt32LE(i + 0 + off)
    char.x = buf.readUInt16LE(i + 4 + off)
    char.y = buf.readUInt16LE(i + 6 + off)
    char.width = buf.readUInt16LE(i + 8 + off)
    char.height = buf.readUInt16LE(i + 10 + off)
    char.xoffset = buf.readInt16LE(i + 12 + off)
    char.yoffset = buf.readInt16LE(i + 14 + off)
    char.xadvance = buf.readInt16LE(i + 16 + off)
    char.page = buf.readUInt8(i + 18 + off)
    char.chnl = buf.readUInt8(i + 19 + off)
    chars[c] = char
  }
  return chars
}

function readKernings(buf, i, blockSize) {
  var kernings = []
  var count = blockSize / 10
  for (var c=0; c<count; c++) {
    var kern = {}
    var off = c*10
    kern.first = buf.readUInt32LE(i + 0 + off)
    kern.second = buf.readUInt32LE(i + 4 + off)
    kern.amount = buf.readInt16LE(i + 8 + off)
    kernings[c] = kern
  }
  return kernings
}

function readNameNT(buf, offset) {
  var pos=offset
  for (; pos<buf.length; pos++) {
    if (buf[pos] === 0x00) 
      break
  }
  return buf.slice(offset, pos)
}

function readStringNT(buf, offset) {
  return readNameNT(buf, offset).toString('utf8')
}
},{}],18:[function(require,module,exports){
var parseAttributes = require('./parse-attribs')
var parseFromString = require('xml-parse-from-string')

//In some cases element.attribute.nodeName can return
//all lowercase values.. so we need to map them to the correct 
//case
var NAME_MAP = {
  scaleh: 'scaleH',
  scalew: 'scaleW',
  stretchh: 'stretchH',
  lineheight: 'lineHeight',
  alphachnl: 'alphaChnl',
  redchnl: 'redChnl',
  greenchnl: 'greenChnl',
  bluechnl: 'blueChnl'
}

module.exports = function parse(data) {
  data = data.toString()
  
  var xmlRoot = parseFromString(data)
  var output = {
    pages: [],
    chars: [],
    kernings: []
  }

  //get config settings
  ;['info', 'common'].forEach(function(key) {
    var element = xmlRoot.getElementsByTagName(key)[0]
    if (element)
      output[key] = parseAttributes(getAttribs(element))
  })

  //get page info
  var pageRoot = xmlRoot.getElementsByTagName('pages')[0]
  if (!pageRoot)
    throw new Error('malformed file -- no <pages> element')
  var pages = pageRoot.getElementsByTagName('page')
  for (var i=0; i<pages.length; i++) {
    var p = pages[i]
    var id = parseInt(p.getAttribute('id'), 10)
    var file = p.getAttribute('file')
    if (isNaN(id))
      throw new Error('malformed file -- page "id" attribute is NaN')
    if (!file)
      throw new Error('malformed file -- needs page "file" attribute')
    output.pages[parseInt(id, 10)] = file
  }

  //get kernings / chars
  ;['chars', 'kernings'].forEach(function(key) {
    var element = xmlRoot.getElementsByTagName(key)[0]
    if (!element)
      return
    var childTag = key.substring(0, key.length-1)
    var children = element.getElementsByTagName(childTag)
    for (var i=0; i<children.length; i++) {      
      var child = children[i]
      output[key].push(parseAttributes(getAttribs(child)))
    }
  })
  return output
}

function getAttribs(element) {
  var attribs = getAttribList(element)
  return attribs.reduce(function(dict, attrib) {
    var key = mapName(attrib.nodeName)
    dict[key] = attrib.nodeValue
    return dict
  }, {})
}

function getAttribList(element) {
  //IE8+ and modern browsers
  var attribs = []
  for (var i=0; i<element.attributes.length; i++)
    attribs.push(element.attributes[i])
  return attribs
}

function mapName(nodeName) {
  return NAME_MAP[nodeName.toLowerCase()] || nodeName
}
},{"./parse-attribs":19,"xml-parse-from-string":20}],19:[function(require,module,exports){
//Some versions of GlyphDesigner have a typo
//that causes some bugs with parsing. 
//Need to confirm with recent version of the software
//to see whether this is still an issue or not.
var GLYPH_DESIGNER_ERROR = 'chasrset'

module.exports = function parseAttributes(obj) {
  if (GLYPH_DESIGNER_ERROR in obj) {
    obj['charset'] = obj[GLYPH_DESIGNER_ERROR]
    delete obj[GLYPH_DESIGNER_ERROR]
  }

  for (var k in obj) {
    if (k === 'face' || k === 'charset') 
      continue
    else if (k === 'padding' || k === 'spacing')
      obj[k] = parseIntList(obj[k])
    else
      obj[k] = parseInt(obj[k], 10) 
  }
  return obj
}

function parseIntList(data) {
  return data.split(',').map(function(val) {
    return parseInt(val, 10)
  })
}
},{}],20:[function(require,module,exports){
module.exports = (function xmlparser() {
  //common browsers
  if (typeof window.DOMParser !== 'undefined') {
    return function(str) {
      var parser = new window.DOMParser()
      return parser.parseFromString(str, 'application/xml')
    }
  } 

  //IE8 fallback
  if (typeof window.ActiveXObject !== 'undefined'
      && new window.ActiveXObject('Microsoft.XMLDOM')) {
    return function(str) {
      var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM")
      xmlDoc.async = "false"
      xmlDoc.loadXML(str)
      return xmlDoc
    }
  }

  //last resort fallback
  return function(str) {
    var div = document.createElement('div')
    div.innerHTML = str
    return div
  }
})()
},{}],21:[function(require,module,exports){
"use strict";
var window = require("global/window")
var once = require("once")
var parseHeaders = require("parse-headers")



module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest


function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function createXHR(options, callback) {
    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === "text" || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }
    
    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }
    
    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "unknown") )
        }
        evt.statusCode = 0
        callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null
        
        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        callback(err, response, response.body)
        
    }
    
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    if(typeof callback === "undefined"){
        throw new Error("callback argument missing")
    }
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            aborted=true//IE9 may still call readystatechange
            xhr.abort("timeout")
            errorFunc();
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }
    
    if ("beforeSend" in options && 
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}

function noop() {}

},{"global/window":22,"once":23,"parse-headers":27}],22:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],23:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],24:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":25}],25:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],26:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],27:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":24,"trim":26}],28:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],29:[function(require,module,exports){
var createLayout = require('layout-bmfont-text')
var inherits = require('inherits')
var createIndices = require('quad-indices')
var utils = require('./lib/utils')
// var THREE = require('three')

var Base = THREE.BufferGeometry

module.exports = function(opt) {
  return new TextMesh(opt)
}

function TextMesh(opt) {
  Base.call(this)
  var multipage = opt && opt.multipage
  this.layout = null

  this._positions = new THREE.BufferAttribute(null, 2)
  this._uvs = new THREE.BufferAttribute(null, 2)
  if (multipage) 
    this._pages = new THREE.BufferAttribute(null, 1)
  this._indices = new THREE.BufferAttribute(null, 1)

  if (opt) 
    this.update(opt)

  this.addAttribute('position', this._positions)
  this.addAttribute('uv', this._uvs)
  if (multipage) 
    this.addAttribute('page', this._pages)
  this.addAttribute('index', this._indices)
}

inherits(TextMesh, Base)

TextMesh.prototype.update = function(opt) {
  opt = opt||{}
  this.layout = createLayout(opt)

  //don't allow a deferred creation of multipage
  //since it requires different buffer layout
  if (opt.multipage && !this._pages) {
    throw new Error('must specify multipage: true in constructor')
  }

  var font = opt.font

  //determine texture size from font file  
  var texWidth = font.common.scaleW
  var texHeight = font.common.scaleH

  //get visible glyphs
  var glyphs = this.layout.glyphs.filter(function(glyph) {
    var bitmap = glyph.data
    return bitmap.width * bitmap.height > 0
  })

  //get vec2 quad positions 
  var positions = getQuadPositions(glyphs, this.layout)

  //get vec2 texcoords
  var flipY = opt.flipY !== false
  var uvs = getQuadUVs(glyphs, texWidth, texHeight, flipY)
    
  if (opt.multipage) {
    var pages = getQuadPages(glyphs)
    this._pages.array = pages
    this._pages.needsUpdate = true  
  }

  //get indices
  var quadCount = glyphs.length
  var indices = createIndices({ clockwise: true, count: quadCount })

  this._uvs.array = uvs
  this._uvs.needsUpdate = true

  this._indices.array = indices
  this._indices.needsUpdate = true

  this._positions.array = positions
  this._positions.needsUpdate = true
}

TextMesh.prototype.computeBoundingSphere = function() {
    if (this.boundingSphere === null) 
      this.boundingSphere = new THREE.Sphere()

  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    this.boundingSphere.radius = 0
    this.boundingSphere.center.set(0, 0, 0)
    return
  }
  utils.computeSphere(positions, this.boundingSphere)
  if (isNaN(this.boundingSphere.radius))
    console.error('THREE.BufferGeometry.computeBoundingSphere(): '
        + 'Computed radius is NaN. The '
        + '"position" attribute is likely to have NaN values.')
}

TextMesh.prototype.computeBoundingBox = function() {
    if (this.boundingBox === null) 
      this.boundingBox = new THREE.Box3()

  var bbox = this.boundingBox
  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    bbox.makeEmpty()
    return
  }
  utils.computeBox(positions, bbox)
}

function getQuadPages(glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1)
  var i = 0
  glyphs.forEach(function(glyph) {
    var id = glyph.data.page || 0
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
  })
  return pages
}

function getQuadUVs(glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2)
  var i = 0

  glyphs.forEach(function(glyph) {
    var bitmap = glyph.data
    var bw = (bitmap.x+bitmap.width)
    var bh = (bitmap.y+bitmap.height)

    //top left position
    var u0 = bitmap.x / texWidth
    var v1 = bitmap.y / texHeight
    var u1 = bw / texWidth
    var v0 = bh / texHeight

    if (flipY) {
      v1 = (texHeight-bitmap.y) / texHeight
      v0 = (texHeight-bh) / texHeight
    }

    //BL
    uvs[i++] = u0 
    uvs[i++] = v1
    //TL
    uvs[i++] = u0
    uvs[i++] = v0
    //TR
    uvs[i++] = u1
    uvs[i++] = v0
    //BR
    uvs[i++] = u1
    uvs[i++] = v1
  })
  return uvs
}

function getQuadPositions(glyphs, layout) {
  var positions = new Float32Array(glyphs.length * 4 * 2)
  var i = 0

  glyphs.forEach(function(glyph) {
    var bitmap = glyph.data

    //bottom left position
    var x = glyph.position[0] + bitmap.xoffset
    var y = glyph.position[1] + bitmap.yoffset

    //quad size
    var w = bitmap.width
    var h = bitmap.height

    //BL
    positions[i++] = x 
    positions[i++] = y
    //TL
    positions[i++] = x
    positions[i++] = y + h
    //TR
    positions[i++] = x + w
    positions[i++] = y + h
    //BR
    positions[i++] = x + w
    positions[i++] = y
  })
  return positions
}
},{"./lib/utils":30,"inherits":31,"layout-bmfont-text":32,"quad-indices":36}],30:[function(require,module,exports){
var itemSize = 2
var box = { min: [0, 0], max: [0, 0] }

function bounds(positions) {
  var count = positions.length / itemSize
  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.max[0] = positions[0]
  box.max[1] = positions[1]

  for (var i=0; i<count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
  }
}

module.exports.computeBox = function(positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], 0) 
  output.max.set(box.max[0], box.max[1], 0)
}

module.exports.computeSphere = function(positions, output) {
  bounds(positions)
  var minX = box.min[0], minY = box.min[1],
      maxX = box.max[0], maxY = box.max[1],
      width = maxX - minX,
      height = maxY - minY,
      length = Math.sqrt(width*width + height*height)

  output.center.set(minX + width/2, minY + height/2, 0)
  output.radius = length/2
}

},{}],31:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],32:[function(require,module,exports){
var wordWrap = require('word-wrapper')
var xtend = require('xtend')
var findChar = require('indexof-property')('id')
var number = require('as-number')

var X_HEIGHTS = ['x', 'e', 'a', 'o', 'n', 's', 'r', 'c', 'u', 'm', 'v', 'w', 'z']
var M_WIDTHS = ['m', 'w']
var CAP_HEIGHTS = ['H', 'I', 'N', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


var TAB_ID = '\t'.charCodeAt(0)
var SPACE_ID = ' '.charCodeAt(0)
var ALIGN_LEFT = 0, 
    ALIGN_CENTER = 1, 
    ALIGN_RIGHT = 2

module.exports = function createLayout(opt) {
  return new TextLayout(opt)
}

function TextLayout(opt) {
  this.glyphs = []
  this._measure = this.computeMetrics.bind(this)
  this.update(opt)
}

TextLayout.prototype.update = function(opt) {
  opt = xtend({
    measure: this._measure
  }, opt)
  this._opt = opt
  this._opt.tabSize = number(this._opt.tabSize, 4)

  if (!opt.font)
    throw new Error('must provide a valid bitmap font')

  var glyphs = this.glyphs
  var text = opt.text||'' 
  var font = opt.font
  this._setupSpaceGlyphs(font)
  
  var lines = wordWrap.lines(text, opt)
  var minWidth = opt.width || 0

  //clear glyphs
  glyphs.length = 0

  //get max line width
  var maxLineWidth = lines.reduce(function(prev, line) {
    return Math.max(prev, line.width, minWidth)
  }, 0)

  //the pen position
  var x = 0
  var y = 0
  var chars = font.chars
  var lineHeight = number(opt.lineHeight, font.common.lineHeight)
  var baseline = font.common.base
  var descender = lineHeight-baseline
  var letterSpacing = opt.letterSpacing || 0
  var height = lineHeight * lines.length - descender
  var align = getAlignType(this._opt.align)

  //draw text along baseline
  y -= height
  
  //the metrics for this text layout
  this._width = maxLineWidth
  this._height = height
  this._descender = font.common.lineHeight - baseline
  this._baseline = baseline
  this._xHeight = getXHeight(font)
  this._capHeight = getCapHeight(font)
  this._lineHeight = lineHeight
  this._ascender = lineHeight - descender - this._xHeight
    
  //layout each glyph
  var self = this
  lines.forEach(function(line) {
    var start = line.start
    var end = line.end
    var lineWidth = line.width
    var lastGlyph
    
    //for each glyph in that line...
    for (var i=start; i<end; i++) {
      var id = text.charCodeAt(i)
      var glyph = self.getGlyph(font, id)
      if (glyph) {
        if (lastGlyph) 
          x += getKerning(font, lastGlyph.id, glyph.id)

        var tx = x
        if (align === ALIGN_CENTER) 
          tx += (maxLineWidth-lineWidth)/2
        else if (align === ALIGN_RIGHT)
          tx += (maxLineWidth-lineWidth)

        glyphs.push({
          position: [tx, y],
          data: glyph,
          index: i
        })  

        //move pen forward
        x += glyph.xadvance + letterSpacing
        lastGlyph = glyph
      }
    }

    //next line down
    y += lineHeight
    x = 0
  })
}

TextLayout.prototype._setupSpaceGlyphs = function(font) {
  //These are fallbacks, when the font doesn't include
  //' ' or '\t' glyphs
  this._fallbackSpaceGlyph = null
  this._fallbackTabGlyph = null

  if (!font.chars || font.chars.length === 0)
    return

  //try to get space glyph
  //then fall back to the 'm' or 'w' glyphs
  //then fall back to the first glyph available
  var space = getGlyphById(font, SPACE_ID) 
          || getMGlyph(font) 
          || font.chars[0]

  //and create a fallback for tab
  var tabWidth = this._opt.tabSize * space.xadvance
  this._fallbackSpaceGlyph = space
  this._fallbackTabGlyph = xtend(space, {
    x: 0, y: 0, xadvance: tabWidth, id: TAB_ID, 
    xoffset: 0, yoffset: 0, width: 0, height: 0
  })
}

TextLayout.prototype.getGlyph = function(font, id) {
  var glyph = getGlyphById(font, id)
  if (glyph)
    return glyph
  else if (id === TAB_ID) 
    return this._fallbackTabGlyph
  else if (id === SPACE_ID) 
    return this._fallbackSpaceGlyph
  return null
}

TextLayout.prototype.computeMetrics = function(text, start, end, width) {
  var letterSpacing = this._opt.letterSpacing || 0
  var font = this._opt.font
  var curPen = 0
  var curWidth = 0
  var count = 0
  var glyph
  var lastGlyph

  if (!font.chars || font.chars.length === 0) {
    return {
      start: start,
      end: start,
      width: 0
    }
  }

  end = Math.min(text.length, end)
  for (var i=start; i < end; i++) {
    var id = text.charCodeAt(i)
    var glyph = this.getGlyph(font, id)

    if (glyph) {
      //move pen forward
      var xoff = glyph.xoffset
      var kern = lastGlyph ? getKerning(font, lastGlyph.id, glyph.id) : 0
      curPen += kern

      var nextPen = curPen + glyph.xadvance + letterSpacing
      var nextWidth = curPen + glyph.width

      //we've hit our limit; we can't move onto the next glyph
      if (nextWidth >= width || nextPen >= width)
        break

      //otherwise continue along our line
      curPen = nextPen
      curWidth = nextWidth
      lastGlyph = glyph
    }
    count++
  }
  
  //make sure rightmost edge lines up with rendered glyphs
  if (lastGlyph)
    curWidth += lastGlyph.xoffset

  return {
    start: start,
    end: start + count,
    width: curWidth
  }
}

//getters for the private vars
;['width', 'height', 
  'descender', 'ascender',
  'xHeight', 'baseline',
  'capHeight',
  'lineHeight' ].forEach(addGetter)

function addGetter(name) {
  Object.defineProperty(TextLayout.prototype, name, {
    get: wrapper(name),
    configurable: true
  })
}

//create lookups for private vars
function wrapper(name) {
  return (new Function([
    'return function '+name+'() {',
    '  return this._'+name,
    '}'
  ].join('\n')))()
}

function getGlyphById(font, id) {
  if (!font.chars || font.chars.length === 0)
    return null

  var glyphIdx = findChar(font.chars, id)
  if (glyphIdx >= 0)
    return font.chars[glyphIdx]
  return null
}

function getXHeight(font) {
  for (var i=0; i<X_HEIGHTS.length; i++) {
    var id = X_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getMGlyph(font) {
  for (var i=0; i<M_WIDTHS.length; i++) {
    var id = M_WIDTHS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx]
  }
  return 0
}

function getCapHeight(font) {
  for (var i=0; i<CAP_HEIGHTS.length; i++) {
    var id = CAP_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getKerning(font, left, right) {
  if (!font.kernings || font.kernings.length === 0)
    return 0

  var table = font.kernings
  for (var i=0; i<table.length; i++) {
    var kern = table[i]
    if (kern.first === left && kern.second === right)
      return kern.amount
  }
  return 0
}

function getAlignType(align) {
  if (align === 'center')
    return ALIGN_CENTER
  else if (align === 'right')
    return ALIGN_RIGHT
  return ALIGN_LEFT
}
},{"as-number":33,"indexof-property":34,"word-wrapper":35,"xtend":40}],33:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],34:[function(require,module,exports){
module.exports = function compile(property) {
	if (!property || typeof property !== 'string')
		throw new Error('must specify property for indexof search')

	return new Function('array', 'value', 'start', [
		'start = start || 0',
		'for (var i=start; i<array.length; i++)',
		'  if (array[i]["' + property +'"] === value)',
		'      return i',
		'return -1'
	].join('\n'))
}
},{}],35:[function(require,module,exports){
var newline = /\n/
var newlineChar = '\n'
var whitespace = /\s/

module.exports = function(text, opt) {
    var lines = module.exports.lines(text, opt)
    return lines.map(function(line) {
        return text.substring(line.start, line.end)
    }).join('\n')
}

module.exports.lines = function wordwrap(text, opt) {
    opt = opt||{}

    //zero width results in nothing visible
    if (opt.width === 0 && opt.mode !== 'nowrap') 
        return []

    text = text||''
    var width = typeof opt.width === 'number' ? opt.width : Number.MAX_VALUE
    var start = Math.max(0, opt.start||0)
    var end = typeof opt.end === 'number' ? opt.end : text.length
    var mode = opt.mode

    var measure = opt.measure || monospace
    if (mode === 'pre')
        return pre(measure, text, start, end, width)
    else
        return greedy(measure, text, start, end, width, mode)
}

function idxOf(text, chr, start, end) {
    var idx = text.indexOf(chr, start)
    if (idx === -1 || idx > end)
        return end
    return idx
}

function isWhitespace(chr) {
    return whitespace.test(chr)
}

function pre(measure, text, start, end, width) {
    var lines = []
    var lineStart = start
    for (var i=start; i<end && i<text.length; i++) {
        var chr = text.charAt(i)
        var isNewline = newline.test(chr)

        //If we've reached a newline, then step down a line
        //Or if we've reached the EOF
        if (isNewline || i===end-1) {
            var lineEnd = isNewline ? i : i+1
            var measured = measure(text, lineStart, lineEnd, width)
            lines.push(measured)
            
            lineStart = i+1
        }
    }
    return lines
}

function greedy(measure, text, start, end, width, mode) {
    //A greedy word wrapper based on LibGDX algorithm
    //https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/BitmapFontCache.java
    var lines = []

    var testWidth = width
    //if 'nowrap' is specified, we only wrap on newline chars
    if (mode === 'nowrap')
        testWidth = Number.MAX_VALUE

    while (start < end && start < text.length) {
        //get next newline position
        var newLine = idxOf(text, newlineChar, start, end)

        //eat whitespace at start of line
        while (start < newLine) {
            if (!isWhitespace( text.charAt(start) ))
                break
            start++
        }

        //determine visible # of glyphs for the available width
        var measured = measure(text, start, newLine, testWidth)

        var lineEnd = start + (measured.end-measured.start)
        var nextStart = lineEnd + newlineChar.length

        //if we had to cut the line before the next newline...
        if (lineEnd < newLine) {
            //find char to break on
            while (lineEnd > start) {
                if (isWhitespace(text.charAt(lineEnd)))
                    break
                lineEnd--
            }
            if (lineEnd === start) {
                if (nextStart > start + newlineChar.length) nextStart--
                lineEnd = nextStart // If no characters to break, show all.
            } else {
                nextStart = lineEnd
                //eat whitespace at end of line
                while (lineEnd > start) {
                    if (!isWhitespace(text.charAt(lineEnd - newlineChar.length)))
                        break
                    lineEnd--
                }
            }
        }
        if (lineEnd >= start) {
            var result = measure(text, start, lineEnd, testWidth)
            lines.push(result)
        }
        start = nextStart
    }
    return lines
}

//determines the visible number of glyphs within a given width
function monospace(text, start, end, width) {
    var glyphs = Math.min(width, end-start)
    return {
        start: start,
        end: start+glyphs
    }
}
},{}],36:[function(require,module,exports){
var dtype = require('dtype')
var anArray = require('an-array')
var isBuffer = require('is-buffer')

var CW = [0, 2, 3]
var CCW = [2, 1, 3]

module.exports = function createQuadElements(array, opt) {
    //if user didn't specify an output array
    if (!array || !(anArray(array) || isBuffer(array))) {
        opt = array || {}
        array = null
    }

    if (typeof opt === 'number') //backwards-compatible
        opt = { count: opt }
    else
        opt = opt || {}

    var type = typeof opt.type === 'string' ? opt.type : 'uint16'
    var count = typeof opt.count === 'number' ? opt.count : 1
    var start = (opt.start || 0) 

    var dir = opt.clockwise !== false ? CW : CCW,
        a = dir[0], 
        b = dir[1],
        c = dir[2]

    var numIndices = count * 6

    var indices = array || new (dtype(type))(numIndices)
    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        var x = i + start
        indices[x + 0] = j + 0
        indices[x + 1] = j + 1
        indices[x + 2] = j + 2
        indices[x + 3] = j + a
        indices[x + 4] = j + b
        indices[x + 5] = j + c
    }
    return indices
}
},{"an-array":37,"dtype":38,"is-buffer":39}],37:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],38:[function(require,module,exports){
module.exports = function(dtype) {
  switch (dtype) {
    case 'int8':
      return Int8Array
    case 'int16':
      return Int16Array
    case 'int32':
      return Int32Array
    case 'uint8':
      return Uint8Array
    case 'uint16':
      return Uint16Array
    case 'uint32':
      return Uint32Array
    case 'float32':
      return Float32Array
    case 'float64':
      return Float64Array
    case 'array':
      return Array
    case 'uint8_clamped':
      return Uint8ClampedArray
  }
}

},{}],39:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(
    obj != null &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  )
}

},{}],40:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],41:[function(require,module,exports){
(function (root) {
	"use strict";
	var Tone;
	//constructs the main Tone object
	function Main(func){
		Tone = func();
	}
	//invokes each of the modules with the main Tone object as the argument
	function Module(func){
		func(Tone);
	}
	/**
	 *  Tone.js
	 *  @author Yotam Mann
	 *  @license http://opensource.org/licenses/MIT MIT License
	 *  @copyright 2014-2015 Yotam Mann
	 */
	Main(function () {
	    
	    //////////////////////////////////////////////////////////////////////////
	    //	WEB AUDIO CONTEXT
	    ///////////////////////////////////////////////////////////////////////////
	    //borrowed from underscore.js
	    function isUndef(val) {
	        return val === void 0;
	    }
	    //borrowed from underscore.js
	    function isFunction(val) {
	        return typeof val === 'function';
	    }
	    var audioContext;
	    //polyfill for AudioContext and OfflineAudioContext
	    if (isUndef(window.AudioContext)) {
	        window.AudioContext = window.webkitAudioContext;
	    }
	    if (isUndef(window.OfflineAudioContext)) {
	        window.OfflineAudioContext = window.webkitOfflineAudioContext;
	    }
	    if (!isUndef(AudioContext)) {
	        audioContext = new AudioContext();
	    } else {
	        throw new Error('Web Audio is not supported in this browser');
	    }
	    //SHIMS////////////////////////////////////////////////////////////////////
	    if (!isFunction(AudioContext.prototype.createGain)) {
	        AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
	    }
	    if (!isFunction(AudioContext.prototype.createDelay)) {
	        AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
	    }
	    if (!isFunction(AudioContext.prototype.createPeriodicWave)) {
	        AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;
	    }
	    if (!isFunction(AudioBufferSourceNode.prototype.start)) {
	        AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn;
	    }
	    if (!isFunction(AudioBufferSourceNode.prototype.stop)) {
	        AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff;
	    }
	    if (!isFunction(OscillatorNode.prototype.start)) {
	        OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
	    }
	    if (!isFunction(OscillatorNode.prototype.stop)) {
	        OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;
	    }
	    if (!isFunction(OscillatorNode.prototype.setPeriodicWave)) {
	        OscillatorNode.prototype.setPeriodicWave = OscillatorNode.prototype.setWaveTable;
	    }
	    //extend the connect function to include Tones
	    AudioNode.prototype._nativeConnect = AudioNode.prototype.connect;
	    AudioNode.prototype.connect = function (B, outNum, inNum) {
	        if (B.input) {
	            if (Array.isArray(B.input)) {
	                if (isUndef(inNum)) {
	                    inNum = 0;
	                }
	                this.connect(B.input[inNum]);
	            } else {
	                this.connect(B.input, outNum, inNum);
	            }
	        } else {
	            try {
	                if (B instanceof AudioNode) {
	                    this._nativeConnect(B, outNum, inNum);
	                } else {
	                    this._nativeConnect(B, outNum);
	                }
	            } catch (e) {
	                throw new Error('error connecting to node: ' + B);
	            }
	        }
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	TONE
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  @class  Tone is the base class of all other classes. It provides 
		 *          a lot of methods and functionality to all classes that extend
		 *          it. 
		 *  
		 *  @constructor
		 *  @alias Tone
		 *  @param {number} [inputs=1] the number of input nodes
		 *  @param {number} [outputs=1] the number of output nodes
		 */
	    var Tone = function (inputs, outputs) {
	        /**
			 *  the input node(s)
			 *  @type {GainNode|Array}
			 */
	        if (isUndef(inputs) || inputs === 1) {
	            this.input = this.context.createGain();
	        } else if (inputs > 1) {
	            this.input = new Array(inputs);
	        }
	        /**
			 *  the output node(s)
			 *  @type {GainNode|Array}
			 */
	        if (isUndef(outputs) || outputs === 1) {
	            this.output = this.context.createGain();
	        } else if (outputs > 1) {
	            this.output = new Array(inputs);
	        }
	    };
	    /**
		 *  Set the parameters at once. Either pass in an
		 *  object mapping parameters to values, or to set a
		 *  single parameter, by passing in a string and value.
		 *  The last argument is an optional ramp time which 
		 *  will ramp any signal values to their destination value
		 *  over the duration of the rampTime.
		 *  @param {Object|string} params
		 *  @param {number=} value
		 *  @param {Time=} rampTime
		 *  @returns {Tone} this
		 *  @example
		 * //set values using an object
		 * filter.set({
		 * 	"frequency" : 300,
		 * 	"type" : highpass
		 * });
		 *  @example
		 * filter.set("type", "highpass");
		 *  @example
		 * //ramp to the value 220 over 3 seconds. 
		 * oscillator.set({
		 * 	"frequency" : 220
		 * }, 3);
		 */
	    Tone.prototype.set = function (params, value, rampTime) {
	        if (typeof params === 'object') {
	            rampTime = value;
	        } else if (typeof params === 'string') {
	            var tmpObj = {};
	            tmpObj[params] = value;
	            params = tmpObj;
	        }
	        for (var attr in params) {
	            value = params[attr];
	            var parent = this;
	            if (attr.indexOf('.') !== -1) {
	                var attrSplit = attr.split('.');
	                for (var i = 0; i < attrSplit.length - 1; i++) {
	                    parent = parent[attrSplit[i]];
	                }
	                attr = attrSplit[attrSplit.length - 1];
	            }
	            var param = parent[attr];
	            if (isUndef(param)) {
	                continue;
	            }
	            if (param instanceof Tone.Signal) {
	                if (param.value !== value) {
	                    if (isUndef(rampTime)) {
	                        param.value = value;
	                    } else {
	                        param.rampTo(value, rampTime);
	                    }
	                }
	            } else if (param instanceof AudioParam) {
	                if (param.value !== value) {
	                    param.value = value;
	                }
	            } else if (param instanceof Tone) {
	                param.set(value);
	            } else if (param !== value) {
	                parent[attr] = value;
	            }
	        }
	        return this;
	    };
	    /**
		 *  Get the object's attributes. Given no arguments get
		 *  will return all available object properties and their corresponding
		 *  values. Pass in a single attribute to retrieve or an array
		 *  of attributes. The attribute strings can also include a "."
		 *  to access deeper properties.
		 *  @example
		 * osc.get();
		 * //returns {"type" : "sine", "frequency" : 440, ...etc}
		 *  @example
		 * osc.get("type");
		 * //returns { "type" : "sine"}
		 * @example
		 * //use dot notation to access deep properties
		 * synth.get(["envelope.attack", "envelope.release"]);
		 * //returns {"envelope" : {"attack" : 0.2, "release" : 0.4}}
		 *  @param {Array=|string|undefined} params the parameters to get, otherwise will return 
		 *  					                  all available.
		 *  @returns {Object}
		 */
	    Tone.prototype.get = function (params) {
	        if (isUndef(params)) {
	            params = this._collectDefaults(this.constructor);
	        } else if (typeof params === 'string') {
	            params = [params];
	        }
	        var ret = {};
	        for (var i = 0; i < params.length; i++) {
	            var attr = params[i];
	            var parent = this;
	            var subRet = ret;
	            if (attr.indexOf('.') !== -1) {
	                var attrSplit = attr.split('.');
	                for (var j = 0; j < attrSplit.length - 1; j++) {
	                    var subAttr = attrSplit[j];
	                    subRet[subAttr] = subRet[subAttr] || {};
	                    subRet = subRet[subAttr];
	                    parent = parent[subAttr];
	                }
	                attr = attrSplit[attrSplit.length - 1];
	            }
	            var param = parent[attr];
	            if (typeof params[attr] === 'object') {
	                subRet[attr] = param.get();
	            } else if (param instanceof Tone.Signal) {
	                subRet[attr] = param.value;
	            } else if (param instanceof AudioParam) {
	                subRet[attr] = param.value;
	            } else if (param instanceof Tone) {
	                subRet[attr] = param.get();
	            } else if (!isFunction(param) && !isUndef(param)) {
	                subRet[attr] = param;
	            }
	        }
	        return ret;
	    };
	    /**
		 *  collect all of the default attributes in one
		 *  @private
		 *  @param {function} constr the constructor to find the defaults from
		 *  @return {Array} all of the attributes which belong to the class
		 */
	    Tone.prototype._collectDefaults = function (constr) {
	        var ret = [];
	        if (!isUndef(constr.defaults)) {
	            ret = Object.keys(constr.defaults);
	        }
	        if (!isUndef(constr._super)) {
	            var superDefs = this._collectDefaults(constr._super);
	            //filter out repeats
	            for (var i = 0; i < superDefs.length; i++) {
	                if (ret.indexOf(superDefs[i]) === -1) {
	                    ret.push(superDefs[i]);
	                }
	            }
	        }
	        return ret;
	    };
	    /**
		 *  Set the preset if it exists. 
		 *  @param {string} presetName the name of the preset
		 *  @returns {Tone} this
		 */
	    Tone.prototype.setPreset = function (presetName) {
	        if (!this.isUndef(this.preset) && this.preset.hasOwnProperty(presetName)) {
	            this.set(this.preset[presetName]);
	        }
	        return this;
	    };
	    /**
		 *  @returns {string} returns the name of the class as a string
		 */
	    Tone.prototype.toString = function () {
	        for (var className in Tone) {
	            var isLetter = className[0].match(/^[A-Z]$/);
	            var sameConstructor = Tone[className] === this.constructor;
	            if (isFunction(Tone[className]) && isLetter && sameConstructor) {
	                return className;
	            }
	        }
	        return 'Tone';
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	CLASS VARS
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  A static pointer to the audio context accessible as Tone.context. 
		 *  @type {AudioContext}
		 */
	    Tone.context = audioContext;
	    /**
		 *  The audio context.
		 *  @type {AudioContext}
		 */
	    Tone.prototype.context = Tone.context;
	    /**
		 *  the default buffer size
		 *  @type {number}
		 *  @static
		 *  @const
		 */
	    Tone.prototype.bufferSize = 2048;
	    /**
		 *  the delay time of a single buffer frame
		 *  @type {number}
		 *  @static
		 *  @const
		 */
	    Tone.prototype.bufferTime = Tone.prototype.bufferSize / Tone.context.sampleRate;
	    ///////////////////////////////////////////////////////////////////////////
	    //	CONNECTIONS
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  disconnect and dispose
		 *  @returns {Tone} this
		 */
	    Tone.prototype.dispose = function () {
	        if (!this.isUndef(this.input)) {
	            if (this.input instanceof AudioNode) {
	                this.input.disconnect();
	            }
	            this.input = null;
	        }
	        if (!this.isUndef(this.output)) {
	            if (this.output instanceof AudioNode) {
	                this.output.disconnect();
	            }
	            this.output = null;
	        }
	        return this;
	    };
	    /**
		 *  a silent connection to the DesinationNode
		 *  which will ensure that anything connected to it
		 *  will not be garbage collected
		 *  
		 *  @private
		 */
	    var _silentNode = null;
	    /**
		 *  makes a connection to ensure that the node will not be garbage collected
		 *  until 'dispose' is explicitly called
		 *
		 *  use carefully. circumvents JS and WebAudio's normal Garbage Collection behavior
		 *  @returns {Tone} this
		 */
	    Tone.prototype.noGC = function () {
	        this.output.connect(_silentNode);
	        return this;
	    };
	    AudioNode.prototype.noGC = function () {
	        this.connect(_silentNode);
	        return this;
	    };
	    /**
		 *  connect the output of a ToneNode to an AudioParam, AudioNode, or ToneNode
		 *  @param  {Tone | AudioParam | AudioNode} unit 
		 *  @param {number} [outputNum=0] optionally which output to connect from
		 *  @param {number} [inputNum=0] optionally which input to connect to
		 *  @returns {Tone} this
		 */
	    Tone.prototype.connect = function (unit, outputNum, inputNum) {
	        if (Array.isArray(this.output)) {
	            outputNum = this.defaultArg(outputNum, 0);
	            this.output[outputNum].connect(unit, 0, inputNum);
	        } else {
	            this.output.connect(unit, outputNum, inputNum);
	        }
	        return this;
	    };
	    /**
		 *  disconnect the output
		 *  @returns {Tone} this
		 */
	    Tone.prototype.disconnect = function (outputNum) {
	        if (Array.isArray(this.output)) {
	            outputNum = this.defaultArg(outputNum, 0);
	            this.output[outputNum].disconnect();
	        } else {
	            this.output.disconnect();
	        }
	        return this;
	    };
	    /**
		 *  connect together all of the arguments in series
		 *  @param {...AudioParam|Tone|AudioNode}
		 *  @returns {Tone} this
		 */
	    Tone.prototype.connectSeries = function () {
	        if (arguments.length > 1) {
	            var currentUnit = arguments[0];
	            for (var i = 1; i < arguments.length; i++) {
	                var toUnit = arguments[i];
	                currentUnit.connect(toUnit);
	                currentUnit = toUnit;
	            }
	        }
	        return this;
	    };
	    /**
		 *  fan out the connection from the first argument to the rest of the arguments
		 *  @param {...AudioParam|Tone|AudioNode}
		 *  @returns {Tone} this
		 */
	    Tone.prototype.connectParallel = function () {
	        var connectFrom = arguments[0];
	        if (arguments.length > 1) {
	            for (var i = 1; i < arguments.length; i++) {
	                var connectTo = arguments[i];
	                connectFrom.connect(connectTo);
	            }
	        }
	        return this;
	    };
	    /**
		 *  Connect the output of this node to the rest of the nodes in series.
		 *  @example
		 *  //connect a node to an effect, panVol and then to the master output
		 *  node.chain(effect, panVol, Tone.Master);
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone} this
		 */
	    Tone.prototype.chain = function () {
	        if (arguments.length > 0) {
	            var currentUnit = this;
	            for (var i = 0; i < arguments.length; i++) {
	                var toUnit = arguments[i];
	                currentUnit.connect(toUnit);
	                currentUnit = toUnit;
	            }
	        }
	        return this;
	    };
	    /**
		 *  connect the output of this node to the rest of the nodes in parallel.
		 *  @param {...AudioParam|Tone|AudioNode}
		 *  @returns {Tone} this
		 */
	    Tone.prototype.fan = function () {
	        if (arguments.length > 0) {
	            for (var i = 0; i < arguments.length; i++) {
	                this.connect(arguments[i]);
	            }
	        }
	        return this;
	    };
	    //give native nodes chain and fan methods
	    AudioNode.prototype.chain = Tone.prototype.chain;
	    AudioNode.prototype.fan = Tone.prototype.fan;
	    ///////////////////////////////////////////////////////////////////////////
	    //	UTILITIES / HELPERS / MATHS
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  if a the given is undefined, use the fallback. 
		 *  if both given and fallback are objects, given
		 *  will be augmented with whatever properties it's
		 *  missing which are in fallback
		 *
		 *  warning: if object is self referential, it will go into an an 
		 *  infinite recursive loop. 
		 *  
		 *  @param  {*} given    
		 *  @param  {*} fallback 
		 *  @return {*}          
		 */
	    Tone.prototype.defaultArg = function (given, fallback) {
	        if (typeof given === 'object' && typeof fallback === 'object') {
	            var ret = {};
	            //make a deep copy of the given object
	            for (var givenProp in given) {
	                ret[givenProp] = this.defaultArg(given[givenProp], given[givenProp]);
	            }
	            for (var prop in fallback) {
	                ret[prop] = this.defaultArg(given[prop], fallback[prop]);
	            }
	            return ret;
	        } else {
	            return isUndef(given) ? fallback : given;
	        }
	    };
	    /**
		 *  returns the args as an options object with given arguments
		 *  mapped to the names provided. 
		 *
		 *  if the args given is an array containing an object, it is assumed
		 *  that that's already the options object and will just return it. 
		 *  
		 *  @param  {Array} values  the 'arguments' object of the function
		 *  @param  {Array} keys the names of the arguments as they
		 *                                 should appear in the options object
		 *  @param {Object=} defaults optional defaults to mixin to the returned 
		 *                            options object                              
		 *  @return {Object}       the options object with the names mapped to the arguments
		 */
	    Tone.prototype.optionsObject = function (values, keys, defaults) {
	        var options = {};
	        if (values.length === 1 && typeof values[0] === 'object') {
	            options = values[0];
	        } else {
	            for (var i = 0; i < keys.length; i++) {
	                options[keys[i]] = values[i];
	            }
	        }
	        if (!this.isUndef(defaults)) {
	            return this.defaultArg(options, defaults);
	        } else {
	            return options;
	        }
	    };
	    /**
		 *  test if the arg is undefined
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is undefined
		 *  @function
		 */
	    Tone.prototype.isUndef = isUndef;
	    /**
		 *  test if the arg is a function
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is a function
		 *  @function
		 */
	    Tone.prototype.isFunction = isFunction;
	    /**
		 *  Make the property not writable. Internal use only. 
		 *  @private
		 *  @param  {string}  property  the property to make not writable
		 */
	    Tone.prototype._readOnly = function (property) {
	        if (Array.isArray(property)) {
	            for (var i = 0; i < property.length; i++) {
	                this._readOnly(property[i]);
	            }
	        } else {
	            Object.defineProperty(this, property, {
	                writable: false,
	                enumerable: true
	            });
	        }
	    };
	    /**
		 *  Make an attribute writeable. Interal use only. 
		 *  @private
		 *  @param  {string}  property  the property to make writable
		 */
	    Tone.prototype._writable = function (property) {
	        if (Array.isArray(property)) {
	            for (var i = 0; i < property.length; i++) {
	                this._writable(property[i]);
	            }
	        } else {
	            Object.defineProperty(this, property, { writable: true });
	        }
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    // GAIN CONVERSIONS
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  equal power gain scale
		 *  good for cross-fading
		 *  @param  {number} percent (0-1)
		 *  @return {number}         output gain (0-1)
		 */
	    Tone.prototype.equalPowerScale = function (percent) {
	        var piFactor = 0.5 * Math.PI;
	        return Math.sin(percent * piFactor);
	    };
	    /**
		 *  convert db scale to gain scale (0-1)
		 *  @param  {number} db
		 *  @return {number}   
		 */
	    Tone.prototype.dbToGain = function (db) {
	        return Math.pow(2, db / 6);
	    };
	    /**
		 *  convert gain scale to decibels
		 *  @param  {number} gain (0-1)
		 *  @return {number}   
		 */
	    Tone.prototype.gainToDb = function (gain) {
	        return 20 * (Math.log(gain) / Math.LN10);
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	TIMING
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  @return {number} the currentTime from the AudioContext
		 */
	    Tone.prototype.now = function () {
	        return this.context.currentTime;
	    };
	    /**
		 *  convert a sample count to seconds
		 *  @param  {number} samples 
		 *  @return {number}         
		 */
	    Tone.prototype.samplesToSeconds = function (samples) {
	        return samples / this.context.sampleRate;
	    };
	    /**
		 *  convert a time into samples
		 *  
		 *  @param  {Tone.time} time
		 *  @return {number}         
		 */
	    Tone.prototype.toSamples = function (time) {
	        var seconds = this.toSeconds(time);
	        return Math.round(seconds * this.context.sampleRate);
	    };
	    /**
		 *  convert time to seconds
		 *
		 *  this is a simplified version which only handles numbers and 
		 *  'now' relative numbers. If the Transport is included this 
		 *  method is overridden to include many other features including 
		 *  notationTime, Frequency, and transportTime
		 *  
		 *  @param  {number=} time 
		 *  @param {number=} now if passed in, this number will be 
		 *                       used for all 'now' relative timings
		 *  @return {number}   	seconds in the same timescale as the AudioContext
		 */
	    Tone.prototype.toSeconds = function (time, now) {
	        now = this.defaultArg(now, this.now());
	        if (typeof time === 'number') {
	            return time;    //assuming that it's seconds
	        } else if (typeof time === 'string') {
	            var plusTime = 0;
	            if (time.charAt(0) === '+') {
	                time = time.slice(1);
	                plusTime = now;
	            }
	            return parseFloat(time) + plusTime;
	        } else {
	            return now;
	        }
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    // FREQUENCY CONVERSION
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  true if the input is in the format number+hz
		 *  i.e.: 10hz
		 *
		 *  @param {number} freq 
		 *  @return {boolean} 
		 *  @function
		 */
	    Tone.prototype.isFrequency = function () {
	        var freqFormat = new RegExp(/\d*\.?\d+hz$/i);
	        return function (freq) {
	            return freqFormat.test(freq);
	        };
	    }();
	    /**
		 *  Convert a frequency into seconds.
		 *  Accepts numbers and strings: i.e. "10hz" or 
		 *  10 both return 0.1. 
		 *  
		 *  @param  {number|string} freq 
		 *  @return {number}      
		 */
	    Tone.prototype.frequencyToSeconds = function (freq) {
	        return 1 / parseFloat(freq);
	    };
	    /**
		 *  Convert a number in seconds to a frequency.
		 *  @param  {number} seconds 
		 *  @return {number}         
		 */
	    Tone.prototype.secondsToFrequency = function (seconds) {
	        return 1 / seconds;
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	INHERITANCE
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  have a child inherit all of Tone's (or a parent's) prototype
		 *  to inherit the parent's properties, make sure to call 
		 *  Parent.call(this) in the child's constructor
		 *
		 *  based on closure library's inherit function
		 *
		 *  @static
		 *  @param  {function} 	child  
		 *  @param  {function=} parent (optional) parent to inherit from
		 *                             if no parent is supplied, the child
		 *                             will inherit from Tone
		 */
	    Tone.extend = function (child, parent) {
	        if (isUndef(parent)) {
	            parent = Tone;
	        }
	        function TempConstructor() {
	        }
	        TempConstructor.prototype = parent.prototype;
	        child.prototype = new TempConstructor();
	        /** @override */
	        child.prototype.constructor = child;
	        child._super = parent;
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	TYPES / STATES
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 * Possible types which a value can take on
		 * @enum {string}
		 */
	    Tone.Type = {
	        /** 
			 *  The default value is a number which can take on any value between [-Infinity, Infinity]
			 */
	        Default: 'number',
	        /**
			 *  Time can be described in a number of ways. Read more [Time](https://github.com/TONEnoTONE/Tone.js/wiki/Time).
			 *
			 *  <ul>
			 *  <li>Numbers, which will be taken literally as the time (in seconds).</li>
			 *  <li>Notation, ("4n", "8t") describes time in BPM and time signature relative values.</li>
			 *  <li>TransportTime, ("4:3:2") will also provide tempo and time signature relative times 
			 *  in the form BARS:QUARTERS:SIXTEENTHS.</li>
			 *  <li>Frequency, ("8hz") is converted to the length of the cycle in seconds.</li>
			 *  <li>Now-Relative, ("+1") prefix any of the above with "+" and it will be interpreted as 
			 *  "the current time plus whatever expression follows".</li>
			 *  <li>Expressions, ("3:0 + 2 - (1m / 7)") any of the above can also be combined 
			 *  into a mathematical expression which will be evaluated to compute the desired time.</li>
			 *  <li>No Argument, for methods which accept time, no argument will be interpreted as 
			 *  "now" (i.e. the currentTime).</li>
			 *  </ul>
			 *  
			 *  @typedef {Time}
			 */
	        Time: 'time',
	        /**
			 *  Frequency can be described similar to time, except ultimately the
			 *  values are converted to frequency instead of seconds. A number
			 *  is taken literally as the value in hertz. Additionally any of the 
			 *  Time encodings can be used. Note names in the form
			 *  of NOTE OCTAVE (i.e. C4) are also accepted and converted to their
			 *  frequency value. 
			 *  @typedef {Frequency}
			 */
	        Frequency: 'frequency',
	        /**
			 * Gain is the ratio between the input and the output value of a signal.
			 *  @typedef {Gain}
			 */
	        Gain: 'gain',
	        /** 
			 *  Normal values are within the range [0, 1].
			 *  @typedef {NormalRange}
			 */
	        NormalRange: 'normalrange',
	        /** 
			 *  AudioRange values are between [-1, 1].
			 *  @typedef {AudioRange}
			 */
	        AudioRange: 'audiorange',
	        /** 
			 *  Decibels are a logarithmic unit of measurement which is useful for volume
			 *  because of the logarithmic way that we perceive loudness. 0 decibels 
			 *  means no change in volume. -10db is approximately half as loud and 10db 
			 *  is twice is loud. 
			 *  @typedef {Decibels}
			 */
	        Decibels: 'db',
	        /** 
			 *  Half-step note increments, i.e. 12 is an octave above the root. and 1 is a half-step up.
			 *  @typedef {Interval}
			 */
	        Interval: 'interval',
	        /** 
			 *  Beats per minute. 
			 *  @typedef {BPM}
			 */
	        BPM: 'bpm',
	        /** 
			 *  The value must be greater than 0.
			 *  @typedef {Positive}
			 */
	        Positive: 'positive',
	        /** 
			 *  A cent is a hundredth of a semitone. 
			 *  @typedef {Cents}
			 */
	        Cents: 'cents',
	        /** 
			 *  Angle between 0 and 360. 
			 *  @typedef {Degrees}
			 */
	        Degrees: 'degrees',
	        /** 
			 *  A number representing a midi note.
			 *  @typedef {MIDI}
			 */
	        MIDI: 'midi',
	        /** 
			 *  A colon-separated representation of time in the form of
			 *  BARS:QUARTERS:SIXTEENTHS. 
			 *  @typedef {TransportTime}
			 */
	        TransportTime: 'transporttime'
	    };
	    /**
		 * Possible play states. 
		 * @enum {string}
		 */
	    Tone.State = {
	        Started: 'started',
	        Stopped: 'stopped',
	        Paused: 'paused'
	    };
	    /**
		 *  An empty function.
		 *  @static
		 */
	    Tone.noOp = function () {
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	CONTEXT
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  array of callbacks to be invoked when a new context is added
		 *  @private 
		 *  @private
		 */
	    var newContextCallbacks = [];
	    /**
		 *  invoke this callback when a new context is added
		 *  will be invoked initially with the first context
		 *  @private 
		 *  @static
		 *  @param {function(AudioContext)} callback the callback to be invoked
		 *                                           with the audio context
		 */
	    Tone._initAudioContext = function (callback) {
	        //invoke the callback with the existing AudioContext
	        callback(Tone.context);
	        //add it to the array
	        newContextCallbacks.push(callback);
	    };
	    /**
		 *  Tone automatically creates a context on init, but if you are working
		 *  with other libraries which also create an AudioContext, it can be
		 *  useful to set your own. If you are going to set your own context, 
		 *  be sure to do it at the start of your code, before creating any objects.
		 *  @static
		 *  @param {AudioContext} ctx The new audio context to set
		 */
	    Tone.setContext = function (ctx) {
	        //set the prototypes
	        Tone.prototype.context = ctx;
	        Tone.context = ctx;
	        //invoke all the callbacks
	        for (var i = 0; i < newContextCallbacks.length; i++) {
	            newContextCallbacks[i](ctx);
	        }
	    };
	    /**
		 *  Bind this to a touchstart event to start the audio on mobile devices. 
		 *  <br>
		 *  http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api/12569290#12569290
		 *  @static
		 */
	    Tone.startMobile = function () {
	        var osc = Tone.context.createOscillator();
	        var silent = Tone.context.createGain();
	        silent.gain.value = 0;
	        osc.connect(silent);
	        silent.connect(Tone.context.destination);
	        var now = Tone.context.currentTime;
	        osc.start(now);
	        osc.stop(now + 1);
	    };
	    //setup the context
	    Tone._initAudioContext(function (audioContext) {
	        //set the bufferTime
	        Tone.prototype.bufferTime = Tone.prototype.bufferSize / audioContext.sampleRate;
	        _silentNode = audioContext.createGain();
	        _silentNode.gain.value = 0;
	        _silentNode.connect(audioContext.destination);
	    });
	    Tone.version = 'r5';
	    console.log('%c * Tone.js ' + Tone.version + ' * ', 'background: #000; color: #fff');
	    return Tone;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Base class for all Signals. Used Internally. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 */
	    Tone.SignalBase = function () {
	    };
	    Tone.extend(Tone.SignalBase);
	    /**
		 *  When signals connect to other signals or AudioParams, 
		 *  they take over the output value of that signal or AudioParam. 
		 *  For all other nodes, the behavior is the same as a default <code>connect</code>. 
		 *
		 *  @override
		 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
		 *  @param {number} [outputNumber=0] The output number to connect from.
		 *  @param {number} [inputNumber=0] The input number to connect to.
		 *  @returns {Tone.SignalBase} this
		 */
	    Tone.SignalBase.prototype.connect = function (node, outputNumber, inputNumber) {
	        //zero it out so that the signal can have full control
	        if (node.constructor === Tone.Signal) {
	            //cancel changes
	            node._value.cancelScheduledValues(0);
	            //reset the value
	            node._value.value = 0;
	            //mark the value as overridden
	            node.overridden = true;
	        } else if (node instanceof AudioParam) {
	            node.cancelScheduledValues(0);
	            node.value = 0;
	        }
	        Tone.prototype.connect.call(this, node, outputNumber, inputNumber);
	        return this;
	    };
	    return Tone.SignalBase;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Wraps the native Web Audio API 
		 *         [WaveShaperNode](http://webaudio.github.io/web-audio-api/#the-waveshapernode-interface).
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {function|Array|Number} mapping The function used to define the values. 
		 *                                    The mapping function should take two arguments: 
		 *                                    the first is the value at the current position 
		 *                                    and the second is the array position. 
		 *                                    If the argument is an array, that array will be
		 *                                    set as the wave shaping function. The input
		 *                                    signal is an AudioRange [-1, 1] value and the output
		 *                                    signal can take on any numerical values. 
		 *                                    
		 *  @param {Number} [bufferLen=1024] The length of the WaveShaperNode buffer.
		 *  @example
		 * var timesTwo = new Tone.WaveShaper(function(val){
		 * 	return val * 2;
		 * }, 2048);
		 *  @example
		 * //a waveshaper can also be constructed with an array of values
		 * var invert = new Tone.WaveShaper([1, -1]);
		 */
	    Tone.WaveShaper = function (mapping, bufferLen) {
	        /**
			 *  the waveshaper
			 *  @type {WaveShaperNode}
			 *  @private
			 */
	        this._shaper = this.input = this.output = this.context.createWaveShaper();
	        /**
			 *  the waveshapers curve
			 *  @type {Float32Array}
			 *  @private
			 */
	        this._curve = null;
	        if (Array.isArray(mapping)) {
	            this.curve = mapping;
	        } else if (isFinite(mapping) || this.isUndef(mapping)) {
	            this._curve = new Float32Array(this.defaultArg(mapping, 1024));
	        } else if (this.isFunction(mapping)) {
	            this._curve = new Float32Array(this.defaultArg(bufferLen, 1024));
	            this.setMap(mapping);
	        }
	    };
	    Tone.extend(Tone.WaveShaper, Tone.SignalBase);
	    /**
		 *  Uses a mapping function to set the value of the curve. 
		 *  @param {function} mapping The function used to define the values. 
		 *                            The mapping function take two arguments: 
		 *                            the first is the value at the current position 
		 *                            which goes from -1 to 1 over the number of elements
		 *                            in the curve array. The second argument is the array position. 
		 *  @returns {Tone.WaveShaper} this
		 *  @example
		 * //map the input signal from [-1, 1] to [0, 10]
		 * shaper.setMap(function(val, index){
		 * 	return (val + 1) * 5;
		 * })
		 */
	    Tone.WaveShaper.prototype.setMap = function (mapping) {
	        for (var i = 0, len = this._curve.length; i < len; i++) {
	            var normalized = i / len * 2 - 1;
	            this._curve[i] = mapping(normalized, i);
	        }
	        this._shaper.curve = this._curve;
	        return this;
	    };
	    /**
		 * The array to set as the waveshaper curve. For linear curves
		 * array length does not make much difference, but for complex curves
		 * longer arrays will provide smoother interpolation. 
		 * @memberOf Tone.WaveShaper#
		 * @type {Array}
		 * @name curve
		 */
	    Object.defineProperty(Tone.WaveShaper.prototype, 'curve', {
	        get: function () {
	            return this._shaper.curve;
	        },
	        set: function (mapping) {
	            //fixes safari WaveShaperNode bug
	            if (this._isSafari()) {
	                var first = mapping[0];
	                mapping.unshift(first);
	            }
	            this._curve = new Float32Array(mapping);
	            this._shaper.curve = this._curve;
	        }
	    });
	    /**
		 * Specifies what type of oversampling (if any) should be used when 
		 * applying the shaping curve. Can either be "none", "2x" or "4x". 
		 * @memberOf Tone.WaveShaper#
		 * @type {string}
		 * @name oversample
		 */
	    Object.defineProperty(Tone.WaveShaper.prototype, 'oversample', {
	        get: function () {
	            return this._shaper.oversample;
	        },
	        set: function (oversampling) {
	            this._shaper.oversample = oversampling;
	        }
	    });
	    /**
		 *  returns true if the browser is safari
		 *  @return  {boolean} 
		 *  @private
		 */
	    Tone.WaveShaper.prototype._isSafari = function () {
	        var ua = navigator.userAgent.toLowerCase();
	        return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.WaveShaper} this
		 */
	    Tone.WaveShaper.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._shaper.disconnect();
	        this._shaper = null;
	        this._curve = null;
	        return this;
	    };
	    return Tone.WaveShaper;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  A signal is an audio-rate value. Tone.Signal is a core component of the library.
		 *          Unlike a number, Signals can be scheduled with sample-level accuracy. Tone.Signal
		 *          has all of the methods available to native Web Audio 
		 *          [AudioParam](http://webaudio.github.io/web-audio-api/#the-audioparam-interface)
		 *          as well as additional conveniences. Read more about working with signals 
		 *          [here](https://github.com/TONEnoTONE/Tone.js/wiki/Signals).
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {Number|AudioParam} [value] Initial value of the signal. If an AudioParam
		 *                                     is passed in, that parameter will be wrapped
		 *                                     and controlled by the Signal. 
		 *  @param {string} [units=Number] unit The units the signal is in. 
		 *  @example
		 * var signal = new Tone.Signal(10);
		 */
	    Tone.Signal = function () {
	        var options = this.optionsObject(arguments, [
	            'value',
	            'units'
	        ], Tone.Signal.defaults);
	        /**
			 * The units of the signal.
			 * @type {string}
			 */
	        this.units = options.units;
	        /**
			 *  When true, converts the set value
			 *  based on the units given. When false,
			 *  applies no conversion and the units
			 *  are merely used as a label. 
			 *  @type  {boolean}
			 */
	        this.convert = options.convert;
	        /**
			 *  True if the signal value is being overridden by 
			 *  a connected signal.
			 *  @readOnly
			 *  @type  {boolean}
			 *  @private
			 */
	        this.overridden = false;
	        /**
			 * The node where the constant signal value is scaled.
			 * @type {GainNode}
			 * @private
			 */
	        this.output = this._scaler = this.context.createGain();
	        /**
			 * The node where the value is set.
			 * @type {AudioParam}
			 * @private
			 */
	        this.input = this._value = this._scaler.gain;
	        if (options.value instanceof AudioParam) {
	            this._scaler.connect(options.value);
	            //zero out the value
	            options.value.value = 0;
	        } else {
	            if (!this.isUndef(options.param)) {
	                this._scaler.connect(options.param);
	                options.param.value = 0;
	            }
	            this.value = options.value;
	        }
	        //connect the constant 1 output to the node output
	        Tone.Signal._constant.chain(this._scaler);
	    };
	    Tone.extend(Tone.Signal, Tone.SignalBase);
	    /**
		 *  The default values
		 *  @type  {Object}
		 *  @static
		 *  @const
		 */
	    Tone.Signal.defaults = {
	        'value': 0,
	        'param': undefined,
	        'units': Tone.Type.Default,
	        'convert': true
	    };
	    /**
		 * The current value of the signal. 
		 * @memberOf Tone.Signal#
		 * @type {Number}
		 * @name value
		 */
	    Object.defineProperty(Tone.Signal.prototype, 'value', {
	        get: function () {
	            return this._toUnits(this._value.value);
	        },
	        set: function (value) {
	            var convertedVal = this._fromUnits(value);
	            //is this what you want?
	            this.cancelScheduledValues(0);
	            this._value.value = convertedVal;
	        }
	    });
	    /**
		 * @private
		 * @param  {*} val the value to convert
		 * @return {number}     the number which the value should be set to
		 */
	    Tone.Signal.prototype._fromUnits = function (val) {
	        if (this.convert || this.isUndef(this.convert)) {
	            switch (this.units) {
	            case Tone.Type.Time:
	                return this.toSeconds(val);
	            case Tone.Type.Frequency:
	                return this.toFrequency(val);
	            case Tone.Type.Decibels:
	                return this.dbToGain(val);
	            case Tone.Type.NormalRange:
	                return Math.min(Math.max(val, 0), 1);
	            case Tone.Type.AudioRange:
	                return Math.min(Math.max(val, -1), 1);
	            case Tone.Type.Positive:
	                return Math.max(val, 0);
	            default:
	                return val;
	            }
	        } else {
	            return val;
	        }
	    };
	    /**
		 * convert to the desired units
		 * @private
		 * @param  {number} val the value to convert
		 * @return {number}
		 */
	    Tone.Signal.prototype._toUnits = function (val) {
	        if (this.convert || this.isUndef(this.convert)) {
	            switch (this.units) {
	            case Tone.Type.Decibels:
	                return this.gainToDb(val);
	            default:
	                return val;
	            }
	        } else {
	            return val;
	        }
	    };
	    /**
		 *  Schedules a parameter value change at the given time.
		 *  @param {*}	value The value to set the signal.
		 *  @param {Time}  time The time when the change should occur.
		 *  @returns {Tone.Signal} this
		 *  @example
		 * //set the frequency to "G4" in exactly 1 second from now. 
		 * freq.setValueAtTime("G4", "+1");
		 */
	    Tone.Signal.prototype.setValueAtTime = function (value, time) {
	        value = this._fromUnits(value);
	        this._value.setValueAtTime(value, this.toSeconds(time));
	        return this;
	    };
	    /**
		 *  Creates a schedule point with the current value at the current time.
		 *  This is useful for creating an automation anchor point in order to 
		 *  schedule changes from the current value. 
		 *
		 *  @param {number=} now (Optionally) pass the now value in. 
		 *  @returns {Tone.Signal} this
		 */
	    Tone.Signal.prototype.setCurrentValueNow = function (now) {
	        now = this.defaultArg(now, this.now());
	        var currentVal = this._value.value;
	        this.cancelScheduledValues(now);
	        this._value.setValueAtTime(currentVal, now);
	        return this;
	    };
	    /**
		 *  Schedules a linear continuous change in parameter value from the 
		 *  previous scheduled parameter value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} endTime 
		 *  @returns {Tone.Signal} this
		 */
	    Tone.Signal.prototype.linearRampToValueAtTime = function (value, endTime) {
	        value = this._fromUnits(value);
	        this._value.linearRampToValueAtTime(value, this.toSeconds(endTime));
	        return this;
	    };
	    /**
		 *  Schedules an exponential continuous change in parameter value from 
		 *  the previous scheduled parameter value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} endTime 
		 *  @returns {Tone.Signal} this
		 */
	    Tone.Signal.prototype.exponentialRampToValueAtTime = function (value, endTime) {
	        value = this._fromUnits(value);
	        value = Math.max(0.00001, value);
	        this._value.exponentialRampToValueAtTime(value, this.toSeconds(endTime));
	        return this;
	    };
	    /**
		 *  Schedules an exponential continuous change in parameter value from 
		 *  the current time and current value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Signal} this
		 *  @example
		 * //exponentially ramp to the value 2 over 4 seconds. 
		 * signal.exponentialRampToValueNow(2, 4);
		 */
	    Tone.Signal.prototype.exponentialRampToValueNow = function (value, rampTime) {
	        var now = this.now();
	        // exponentialRampToValueAt cannot ever ramp from 0, apparently.
	        // More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1125600#c2
	        var currentVal = this.value;
	        this.setValueAtTime(Math.max(currentVal, 0.0001), now);
	        this.exponentialRampToValueAtTime(value, now + this.toSeconds(rampTime));
	        return this;
	    };
	    /**
		 *  Schedules an linear continuous change in parameter value from 
		 *  the current time and current value to the given value at the given time.
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Signal} this
		 *  @example
		 * //linearly ramp to the value 4 over 3 seconds. 
		 * signal.linearRampToValueNow(4, 3);
		 */
	    Tone.Signal.prototype.linearRampToValueNow = function (value, rampTime) {
	        var now = this.now();
	        this.setCurrentValueNow(now);
	        this.linearRampToValueAtTime(value, now + this.toSeconds(rampTime));
	        return this;
	    };
	    /**
		 *  Start exponentially approaching the target value at the given time with
		 *  a rate having the given time constant.
		 *  @param {number} value        
		 *  @param {Time} startTime    
		 *  @param {number} timeConstant 
		 *  @returns {Tone.Signal} this
		 */
	    Tone.Signal.prototype.setTargetAtTime = function (value, startTime, timeConstant) {
	        value = this._fromUnits(value);
	        // The value will never be able to approach without timeConstant > 0.
	        // http://www.w3.org/TR/webaudio/#dfn-setTargetAtTime, where the equation
	        // is described. 0 results in a division by 0.
	        timeConstant = Math.max(0.00001, timeConstant);
	        this._value.setTargetAtTime(value, this.toSeconds(startTime), timeConstant);
	        return this;
	    };
	    /**
		 *  Sets an array of arbitrary parameter values starting at the given time
		 *  for the given duration.
		 *  	
		 *  @param {Array} values    
		 *  @param {Time} startTime 
		 *  @param {Time} duration  
		 *  @returns {Tone.Signal} this
		 */
	    Tone.Signal.prototype.setValueCurveAtTime = function (values, startTime, duration) {
	        for (var i = 0; i < values.length; i++) {
	            values[i] = this._fromUnits(values[i]);
	        }
	        this._value.setValueCurveAtTime(values, this.toSeconds(startTime), this.toSeconds(duration));
	        return this;
	    };
	    /**
		 *  Cancels all scheduled parameter changes with times greater than or 
		 *  equal to startTime.
		 *  
		 *  @param  {Time} startTime
		 *  @returns {Tone.Signal} this
		 */
	    Tone.Signal.prototype.cancelScheduledValues = function (startTime) {
	        this._value.cancelScheduledValues(this.toSeconds(startTime));
	        return this;
	    };
	    /**
		 *  Ramps to the given value over the duration of the rampTime. 
		 *  Automatically selects the best ramp type (exponential or linear)
		 *  depending on the `units` of the signal
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Signal} this
		 *  @example
		 * //ramp to the value either linearly or exponentially 
		 * //depending on the "units" value of the signal
		 * signal.rampTo(0, 10);
		 */
	    Tone.Signal.prototype.rampTo = function (value, rampTime) {
	        rampTime = this.defaultArg(rampTime, 0);
	        if (this.units === Tone.Type.Frequency || this.units === Tone.Type.BPM) {
	            this.exponentialRampToValueNow(value, rampTime);
	        } else {
	            this.linearRampToValueNow(value, rampTime);
	        }
	        return this;
	    };
	    /**
		 *  dispose and disconnect
		 *  @returns {Tone.Signal} this
		 */
	    Tone.Signal.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._value = null;
	        this._scaler = null;
	        return this;
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	STATIC
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  the constant signal generator
		 *  @static
		 *  @private
		 *  @const
		 *  @type {OscillatorNode}
		 */
	    Tone.Signal._generator = null;
	    /**
		 *  the signal generator waveshaper. makes the incoming signal
		 *  only output 1 for all inputs.
		 *  @static
		 *  @private
		 *  @const
		 *  @type {Tone.WaveShaper}
		 */
	    Tone.Signal._constant = null;
	    /**
		 *  initializer function
		 */
	    Tone._initAudioContext(function (audioContext) {
	        Tone.Signal._generator = audioContext.createOscillator();
	        Tone.Signal._constant = new Tone.WaveShaper([
	            1,
	            1
	        ]);
	        Tone.Signal._generator.connect(Tone.Signal._constant);
	        Tone.Signal._generator.start(0);
	        Tone.Signal._generator.noGC();
	    });
	    return Tone.Signal;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Pow applies an exponent to the incoming signal. The incoming signal
		 *         must be AudioRange.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number} exp The exponent to apply to the incoming signal, must be at least 2. 
		 *  @example
		 * var pow = new Tone.Pow(2);
		 * var sig = new Tone.Signal(0.5).connect(pow);
		 * //output of pow is 0.25. 
		 */
	    Tone.Pow = function (exp) {
	        /**
			 * the exponent
			 * @private
			 * @type {number}
			 */
	        this._exp = this.defaultArg(exp, 1);
	        /**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
	        this._expScaler = this.input = this.output = new Tone.WaveShaper(this._expFunc(this._exp), 8192);
	    };
	    Tone.extend(Tone.Pow, Tone.SignalBase);
	    /**
		 * The value of the exponent.
		 * @memberOf Tone.Pow#
		 * @type {number}
		 * @name value
		 */
	    Object.defineProperty(Tone.Pow.prototype, 'value', {
	        get: function () {
	            return this._exp;
	        },
	        set: function (exp) {
	            this._exp = exp;
	            this._expScaler.setMap(this._expFunc(this._exp));
	        }
	    });
	    /**
		 *  the function which maps the waveshaper
		 *  @param   {number} exp
		 *  @return {function}
		 *  @private
		 */
	    Tone.Pow.prototype._expFunc = function (exp) {
	        return function (val) {
	            return Math.pow(Math.abs(val), exp);
	        };
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.Pow} this
		 */
	    Tone.Pow.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._expScaler.dispose();
	        this._expScaler = null;
	        return this;
	    };
	    return Tone.Pow;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Envelope is an [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope)
		 *          envelope generator. Tone.Envelope outputs a signal which 
		 *          can be connected to an AudioParam or Tone.Signal. 
		 *          <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/ADSR_parameter.svg">
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {Time} [attack] The amount of time it takes for the envelope to go from 
		 *                         0 to it's maximum value. 
		 *  @param {Time} [decay]	The period of time after the attack that it takes for the envelope
		 *                       	to fall to the sustain value. 
		 *  @param {NormalRange} [sustain]	The percent of the maximum value that the envelope rests at until
		 *                                	the release is triggered. 
		 *  @param {Time} [release]	The amount of time after the release is triggered it takes to reach 0. 
		 *  @example
		 * //an amplitude envelope
		 * var gainNode = Tone.context.createGain();
		 * var env = new Tone.Envelope({
		 * 	"attack" : 0.1,
		 * 	"decay" : 0.2,
		 * 	"sustain" : 1,
		 * 	"release" : 0.8,
		 * });
		 * env.connect(gainNode.gain);
		 */
	    Tone.Envelope = function () {
	        //get all of the defaults
	        var options = this.optionsObject(arguments, [
	            'attack',
	            'decay',
	            'sustain',
	            'release'
	        ], Tone.Envelope.defaults);
	        /** 
			 *  When triggerAttack is called, the attack time is the amount of
			 *  time it takes for the envelope to reach it's maximum value. 
			 *  @type {Time}
			 */
	        this.attack = options.attack;
	        /**
			 *  After the attack portion of the envelope, the value will fall
			 *  over the duration of the decay time to it's sustain value. 
			 *  @type {Time}
			 */
	        this.decay = options.decay;
	        /**
			 * 	The sustain value is the value 
			 * 	which the envelope rests at after triggerAttack is
			 * 	called, but before triggerRelease is invoked. 
			 *  @type {NormalRange}
			 */
	        this.sustain = options.sustain;
	        /**
			 *  After triggerRelease is called, the envelope's
			 *  value will fall to it's miminum value over the
			 *  duration of the release time. 
			 *  @type {Time}
			 */
	        this.release = options.release;
	        /**
			 *  the next time the envelope is attacked
			 *  @type {number}
			 *  @private
			 */
	        this._nextAttack = Infinity;
	        /**
			 *  the next time the envelope is decayed
			 *  @type {number}
			 *  @private
			 */
	        this._nextDecay = Infinity;
	        /**
			 *  the next time the envelope is sustain
			 *  @type {number}
			 *  @private
			 */
	        this._nextSustain = Infinity;
	        /**
			 *  the next time the envelope is released
			 *  @type {number}
			 *  @private
			 */
	        this._nextRelease = Infinity;
	        /**
			 *  the next time the envelope is at standby
			 *  @type {number}
			 *  @private
			 */
	        this._nextStandby = Infinity;
	        /**
			 *  the next time the envelope is at standby
			 *  @type {number}
			 *  @private
			 */
	        this._attackCurve = Tone.Envelope.Type.Linear;
	        /** 
			 *  the last recorded velocity value
			 *  @type {number}
			 *  @private
			 */
	        this._peakValue = 1;
	        /**
			 *  the minimum output value
			 *  @type {number}
			 *  @private
			 */
	        this._minOutput = 0.0001;
	        /**
			 *  the signal
			 *  @type {Tone.Signal}
			 *  @private
			 */
	        this._sig = this.output = new Tone.Signal(0);
	        //set the attackCurve initially
	        this.attackCurve = options.attackCurve;
	    };
	    Tone.extend(Tone.Envelope);
	    /**
		 *  the default parameters
		 *  @static
		 *  @const
		 */
	    Tone.Envelope.defaults = {
	        'attack': 0.01,
	        'decay': 0.1,
	        'sustain': 0.5,
	        'release': 1,
	        'attackCurve': 'linear'
	    };
	    /**
		 *  the envelope time multipler
		 *  @type {number}
		 *  @private
		 */
	    Tone.Envelope.prototype._timeMult = 0.25;
	    /**
		 * Read the current value of the envelope. Useful for 
		 * syncronizing visual output to the envelope. 
		 * @memberOf Tone.Envelope#
		 * @type {Number}
		 * @name value
		 * @readOnly
		 */
	    Object.defineProperty(Tone.Envelope.prototype, 'value', {
	        get: function () {
	            return this._sig.value;
	        }
	    });
	    /**
		 * The slope of the attack. Either "linear" or "exponential". 
		 * @memberOf Tone.Envelope#
		 * @type {string}
		 * @name attackCurve
		 * @example
		 * env.attackCurve = "linear";
		 */
	    Object.defineProperty(Tone.Envelope.prototype, 'attackCurve', {
	        get: function () {
	            return this._attackCurve;
	        },
	        set: function (type) {
	            if (type === Tone.Envelope.Type.Linear || type === Tone.Envelope.Type.Exponential) {
	                this._attackCurve = type;
	            } else {
	                throw Error('attackCurve must be either "linear" or "exponential". Invalid type: ', type);
	            }
	        }
	    });
	    /**
		 *  Get the phase of the envelope at the specified time.
		 *  @param  {number}  time
		 *  @return  {Tone.Envelope.Phase} 
		 *  @private
		 */
	    Tone.Envelope.prototype._phaseAtTime = function (time) {
	        if (this._nextRelease > time) {
	            if (this._nextAttack <= time && this._nextDecay > time) {
	                return Tone.Envelope.Phase.Attack;
	            } else if (this._nextDecay <= time && this._nextSustain > time) {
	                return Tone.Envelope.Phase.Decay;
	            } else if (this._nextSustain <= time && this._nextRelease > time) {
	                return Tone.Envelope.Phase.Sustain;
	            } else {
	                return Tone.Envelope.Phase.Standby;
	            }
	        } else if (this._nextRelease < time && this._nextStandby > time) {
	            return Tone.Envelope.Phase.Release;
	        } else {
	            return Tone.Envelope.Phase.Standby;
	        }
	    };
	    /**
		 *  https://github.com/jsantell/web-audio-automation-timeline
		 *  MIT License, copyright (c) 2014 Jordan Santell
		 *  @private
		 */
	    Tone.Envelope.prototype._exponentialApproach = function (t0, v0, v1, timeConstant, t) {
	        return v1 + (v0 - v1) * Math.exp(-(t - t0) / timeConstant);
	    };
	    /**
		 *  @private
		 */
	    Tone.Envelope.prototype._linearInterpolate = function (t0, v0, t1, v1, t) {
	        return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
	    };
	    /**
		 *  @private
		 */
	    Tone.Envelope.prototype._exponentialInterpolate = function (t0, v0, t1, v1, t) {
	        return v0 * Math.pow(v1 / v0, (t - t0) / (t1 - t0));
	    };
	    /**
		 *  Get the envelopes value at the given time
		 *  @param  {number}  time
		 *  @param  {number}  velocity
		 *  @return  {number} 
		 *  @private
		 */
	    Tone.Envelope.prototype._valueAtTime = function (time) {
	        var attack = this.toSeconds(this.attack);
	        var decay = this.toSeconds(this.decay);
	        var release = this.toSeconds(this.release);
	        switch (this._phaseAtTime(time)) {
	        case Tone.Envelope.Phase.Attack:
	            if (this._attackCurve === Tone.Envelope.Type.Linear) {
	                return this._linearInterpolate(this._nextAttack, this._minOutput, this._nextAttack + attack, this._peakValue, time);
	            } else {
	                return this._exponentialInterpolate(this._nextAttack, this._minOutput, this._nextAttack + attack, this._peakValue, time);
	            }
	            break;
	        case Tone.Envelope.Phase.Decay:
	            return this._exponentialApproach(this._nextDecay, this._peakValue, this.sustain * this._peakValue, decay * this._timeMult, time);
	        case Tone.Envelope.Phase.Release:
	            return this._exponentialApproach(this._nextRelease, this._peakValue, this._minOutput, release * this._timeMult, time);
	        case Tone.Envelope.Phase.Sustain:
	            return this.sustain * this._peakValue;
	        case Tone.Envelope.Phase.Standby:
	            return this._minOutput;
	        }
	    };
	    /**
		 *  Trigger the attack/decay portion of the ADSR envelope. 
		 *  @param  {Time} [time=now] When the attack should start.
		 *  @param {NormalRange} [velocity=1] The velocity of the envelope scales the vales.
		 *                               number between 0-1
		 *  @returns {Tone.Envelope} this
		 *  @example
		 *  //trigger the attack 0.5 seconds from now with a velocity of 0.2
		 *  env.triggerAttack("+0.5", 0.2);
		 */
	    Tone.Envelope.prototype.triggerAttack = function (time, velocity) {
	        //to seconds
	        time = this.toSeconds(time);
	        var attack = this.toSeconds(this.attack);
	        var decay = this.toSeconds(this.decay);
	        //get the phase and position
	        var valueAtTime = this._valueAtTime(time);
	        var attackPast = valueAtTime * attack;
	        //compute the timing
	        this._nextAttack = time - attackPast;
	        this._nextDecay = this._nextAttack + attack;
	        this._nextSustain = this._nextDecay + decay;
	        this._nextRelease = Infinity;
	        //get the values
	        this._peakValue = this.defaultArg(velocity, 1);
	        var scaledMax = this._peakValue;
	        var sustainVal = this.sustain * scaledMax;
	        //set the curve		
	        this._sig.cancelScheduledValues(time);
	        this._sig.setValueAtTime(valueAtTime, time);
	        if (this._attackCurve === Tone.Envelope.Type.Linear) {
	            this._sig.linearRampToValueAtTime(scaledMax, this._nextDecay);
	        } else {
	            this._sig.exponentialRampToValueAtTime(scaledMax, this._nextDecay);
	        }
	        this._sig.setTargetAtTime(sustainVal, this._nextDecay, decay * this._timeMult);
	        return this;
	    };
	    /**
		 *  Triggers the release of the envelope.
		 *  @param  {Time} [time=now] When the release portion of the envelope should start. 
		 *  @returns {Tone.Envelope} this
		 *  @example
		 *  //trigger release immediately
		 *  env.triggerRelease();
		 */
	    Tone.Envelope.prototype.triggerRelease = function (time) {
	        time = this.toSeconds(time);
	        var phase = this._phaseAtTime(time);
	        var release = this.toSeconds(this.release);
	        //computer the value at the start of the next release
	        var valueAtTime = this._valueAtTime(time);
	        this._peakValue = valueAtTime;
	        this._nextRelease = time;
	        this._nextStandby = this._nextRelease + release;
	        //set the values
	        this._sig.cancelScheduledValues(this._nextRelease);
	        //if the phase is in the attack still, must reschedule the rest of the attack
	        if (phase === Tone.Envelope.Phase.Attack) {
	            this._sig.setCurrentValueNow();
	            if (this.attackCurve === Tone.Envelope.Type.Linear) {
	                this._sig.linearRampToValueAtTime(this._peakValue, this._nextRelease);
	            } else {
	                this._sig.exponentialRampToValueAtTime(this._peakValue, this._nextRelease);
	            }
	        } else {
	            this._sig.setValueAtTime(this._peakValue, this._nextRelease);
	        }
	        this._sig.setTargetAtTime(this._minOutput, this._nextRelease, release * this._timeMult);
	        return this;
	    };
	    /**
		 *  triggerAttackRelease is shorthand for triggerAttack, then waiting
		 *  some duration, then triggerRelease. 
		 *  @param {Time} duration The duration of the sustain.
		 *  @param {Time} [time=now] When the attack should be triggered.
		 *  @param {number} [velocity=1] The velocity of the envelope. 
		 *  @returns {Tone.Envelope} this
		 *  @example
		 * //trigger the attack and then the release after 0.6 seconds.
		 * env.triggerAttackRelease(0.6);
		 */
	    Tone.Envelope.prototype.triggerAttackRelease = function (duration, time, velocity) {
	        time = this.toSeconds(time);
	        this.triggerAttack(time, velocity);
	        this.triggerRelease(time + this.toSeconds(duration));
	        return this;
	    };
	    /**
		 *  Borrows the connect method from Tone.Signal. 
		 *  @function
		 *  @private
		 */
	    Tone.Envelope.prototype.connect = Tone.Signal.prototype.connect;
	    /**
		 *  Disconnect and dispose.
		 *  @returns {Tone.Envelope} this
		 */
	    Tone.Envelope.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._sig.dispose();
	        this._sig = null;
	        return this;
	    };
	    /**
		 *  The phase of the envelope. 
		 *  @enum {string}
		 */
	    Tone.Envelope.Phase = {
	        Attack: 'attack',
	        Decay: 'decay',
	        Sustain: 'sustain',
	        Release: 'release',
	        Standby: 'standby'
	    };
	    /**
		 *  The phase of the envelope. 
		 *  @enum {string}
		 */
	    Tone.Envelope.Type = {
	        Linear: 'linear',
	        Exponential: 'exponential'
	    };
	    return Tone.Envelope;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.AmplitudeEnvelope is a Tone.Envelope connected to a gain node. 
		 *          Unlike Tone.Envelope, which outputs the envelope's value, Tone.AmplitudeEnvelope accepts
		 *          an audio signal as the input and will apply the envelope to the amplitude
		 *          of the signal. Read more about ADSR Envelopes on [Wikipedia](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope).
		 *  
		 *  @constructor
		 *  @extends {Tone.Envelope}
		 *  @param {Time|Object} [attack] The amount of time it takes for the envelope to go from 
		 *                               0 to it's maximum value. 
		 *  @param {Time} [decay]	The period of time after the attack that it takes for the envelope
		 *                       	to fall to the sustain value. 
		 *  @param {NormalRange} [sustain]	The percent of the maximum value that the envelope rests at until
		 *                                	the release is triggered. 
		 *  @param {Time} [release]	The amount of time after the release is triggered it takes to reach 0. 
		 *  @example
		 * var ampEnv = new Tone.AmplitudeEnvelope({
		 * 	"attack": 0.1,
		 * 	"decay": 0.2,
		 * 	"sustain": 1.0,
		 * 	"release": 0.8
		 * }).toMaster();
		 * //create an oscillator and connect it
		 * var osc = new Tone.Oscillator().connect(ampEnv).start();
		 * //trigger the envelopes attack and release "8t" apart
		 * ampEnv.triggerAttackRelease("8t");
		 */
	    Tone.AmplitudeEnvelope = function () {
	        Tone.Envelope.apply(this, arguments);
	        /**
			 *  the input node
			 *  @type {GainNode}
			 *  @private
			 */
	        this.input = this.output = this.context.createGain();
	        this._sig.connect(this.output.gain);
	    };
	    Tone.extend(Tone.AmplitudeEnvelope, Tone.Envelope);
	    return Tone.AmplitudeEnvelope;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Compressor is a thin wrapper around the Web Audio 
		 *         [DynamicsCompressorNode](http://webaudio.github.io/web-audio-api/#the-dynamicscompressornode-interface).
		 *         Compression reduces the volume of loud sounds or amplifies quiet sounds 
		 *         by narrowing or "compressing" an audio signal's dynamic range. 
		 *         Read more on [Wikipedia](https://en.wikipedia.org/wiki/Dynamic_range_compression).
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {Decibels|Object} [threshold] The value above which the compression starts to be applied.
		 *  @param {Positive} [ratio] The gain reduction ratio.
		 *  @example
		 * var comp = new Tone.Compressor(-30, 3);
		 */
	    Tone.Compressor = function () {
	        var options = this.optionsObject(arguments, [
	            'threshold',
	            'ratio'
	        ], Tone.Compressor.defaults);
	        /**
			 *  the compressor node
			 *  @type {DynamicsCompressorNode}
			 *  @private
			 */
	        this._compressor = this.input = this.output = this.context.createDynamicsCompressor();
	        /**
			 *  the threshold vaue
			 *  @type {Decibels}
			 *  @signal
			 */
	        this.threshold = this._compressor.threshold;
	        /**
			 *  The attack parameter
			 *  @type {Time}
			 *  @signal
			 */
	        this.attack = new Tone.Signal(this._compressor.attack, Tone.Type.Time);
	        /**
			 *  The release parameter
			 *  @type {Time}
			 *  @signal
			 */
	        this.release = new Tone.Signal(this._compressor.release, Tone.Type.Time);
	        /**
			 *  The knee parameter
			 *  @type {Decibels}
			 *  @signal
			 */
	        this.knee = this._compressor.knee;
	        /**
			 *  The ratio value
			 *  @type {Number}
			 *  @signal
			 */
	        this.ratio = this._compressor.ratio;
	        //set the defaults
	        this._readOnly([
	            'knee',
	            'release',
	            'attack',
	            'ratio',
	            'threshold'
	        ]);
	        this.set(options);
	    };
	    Tone.extend(Tone.Compressor);
	    /**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.Compressor.defaults = {
	        'ratio': 12,
	        'threshold': -24,
	        'release': 0.25,
	        'attack': 0.003,
	        'knee': 30
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.Compressor} this
		 */
	    Tone.Compressor.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable([
	            'knee',
	            'release',
	            'attack',
	            'ratio',
	            'threshold'
	        ]);
	        this._compressor.disconnect();
	        this._compressor = null;
	        this.attack.dispose();
	        this.attack = null;
	        this.release.dispose();
	        this.release = null;
	        this.threshold = null;
	        this.ratio = null;
	        this.knee = null;
	        return this;
	    };
	    return Tone.Compressor;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Add a signal and a number or two signals. When no value is
		 *         passed into the constructor, Tone.Add will sum <code>input[0]</code>
		 *         and <code>input[1]</code>. If a value is passed into the constructor, 
		 *         the it will be added to the input.
		 *  
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value If no value is provided, Tone.Add will sum the first
		 *                         and second inputs. 
		 *  @example
		 * var signal = new Tone.Signal(2);
		 * var add = new Tone.Add(2);
		 * signal.connect(add);
		 * //the output of add equals 4
		 *  @example
		 * //if constructed with no arguments
		 * //it will add the first and second inputs
		 * var add = new Tone.Add();
		 * var sig0 = new Tone.Signal(3).connect(add, 0, 0);
		 * var sig1 = new Tone.Signal(4).connect(add, 0, 1);
		 * //the output of add equals 7. 
		 */
	    Tone.Add = function (value) {
	        Tone.call(this, 2, 0);
	        /**
			 *  the summing node
			 *  @type {GainNode}
			 *  @private
			 */
	        this._sum = this.input[0] = this.input[1] = this.output = this.context.createGain();
	        /**
			 *  @private
			 *  @type {Tone.Signal}
			 */
	        this._value = this.input[1] = new Tone.Signal(value);
	        this._value.connect(this._sum);
	    };
	    Tone.extend(Tone.Add, Tone.Signal);
	    /**
		 *  Clean up.
		 *  @returns {Tone.Add} this
		 */
	    Tone.Add.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._sum.disconnect();
	        this._sum = null;
	        this._value.dispose();
	        this._value = null;
	        return this;
	    };
	    return Tone.Add;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Multiply two incoming signals. Or, if a number is given in the constructor, 
		 *          multiplies the incoming signal by that value. 
		 *
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value Constant value to multiple. If no value is provided,
		 *                         it will return the product of the first and second inputs
		 *  @example
		 * var mult = new Tone.Multiply();
		 * var sigA = new Tone.Signal(3);
		 * var sigB = new Tone.Signal(4);
		 * sigA.connect(mult, 0, 0);
		 * sigB.connect(mult, 0, 1);
		 * //output of mult is 12.
		 *  @example
		 * var mult = new Tone.Multiply(10);
		 * var sig = new Tone.Signal(2).connect(mult);
		 * //the output of mult is 20. 
		 */
	    Tone.Multiply = function (value) {
	        Tone.call(this, 2, 0);
	        /**
			 *  the input node is the same as the output node
			 *  it is also the GainNode which handles the scaling of incoming signal
			 *  
			 *  @type {GainNode}
			 *  @private
			 */
	        this._mult = this.input[0] = this.output = this.context.createGain();
	        /**
			 *  the scaling parameter
			 *  @type {AudioParam}
			 *  @private
			 */
	        this._value = this.input[1] = this.output.gain;
	        this._value.value = this.defaultArg(value, 0);
	    };
	    Tone.extend(Tone.Multiply, Tone.Signal);
	    /**
		 *  clean up
		 *  @returns {Tone.Multiply} this
		 */
	    Tone.Multiply.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._mult.disconnect();
	        this._mult = null;
	        this._value = null;
	        return this;
	    };
	    return Tone.Multiply;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Negate the incoming signal. i.e. an input signal of 10 will output -10
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 * var neg = new Tone.Negate();
		 * var sig = new Tone.Signal(-2).connect(neg);
		 * //output of neg is positive 2. 
		 */
	    Tone.Negate = function () {
	        /**
			 *  negation is done by multiplying by -1
			 *  @type {Tone.Multiply}
			 *  @private
			 */
	        this._multiply = this.input = this.output = new Tone.Multiply(-1);
	    };
	    Tone.extend(Tone.Negate, Tone.SignalBase);
	    /**
		 *  clean up
		 *  @returns {Tone.Negate} this
		 */
	    Tone.Negate.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._multiply.dispose();
	        this._multiply = null;
	        return this;
	    };
	    return Tone.Negate;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Subtract the signal connected to <code>input[1]</code> from the signal connected 
		 *         to <code>input[0]</code>. If an argument is provided in the constructor, the 
		 *         signals <code>.value</code> will be subtracted from the incoming signal.
		 *
		 *  @extends {Tone.Signal}
		 *  @constructor
		 *  @param {number=} value The value to subtract from the incoming signal. If the value
		 *                         is omitted, it will subtract the second signal from the first.
		 *  @example
		 * var sub = new Tone.Subtract(1);
		 * var sig = new Tone.Signal(4).connect(sub);
		 * //the output of sub is 3. 
		 *  @example
		 * var sub = new Tone.Subtract();
		 * var sigA = new Tone.Signal(10);
		 * var sigB = new Tone.Signal(2.5);
		 * sigA.connect(sub, 0, 0);
		 * sigB.connect(sub, 0, 1);
		 * //output of sub is 7.5
		 */
	    Tone.Subtract = function (value) {
	        Tone.call(this, 2, 0);
	        /**
			 *  the summing node
			 *  @type {GainNode}
			 *  @private
			 */
	        this._sum = this.input[0] = this.output = this.context.createGain();
	        /**
			 *  negate the input of the second input before connecting it
			 *  to the summing node.
			 *  @type {Tone.Negate}
			 *  @private
			 */
	        this._neg = new Tone.Negate();
	        /**
			 *  the node where the value is set
			 *  @private
			 *  @type {Tone.Signal}
			 */
	        this._value = this.input[1] = new Tone.Signal(value);
	        this._value.chain(this._neg, this._sum);
	    };
	    Tone.extend(Tone.Subtract, Tone.Signal);
	    /**
		 *  Clean up.
		 *  @returns {Tone.SignalBase} this
		 */
	    Tone.Subtract.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._neg.dispose();
	        this._neg = null;
	        this._sum.disconnect();
	        this._sum = null;
	        this._value.dispose();
	        this._value = null;
	        return this;
	    };
	    return Tone.Subtract;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  GreaterThanZero outputs 1 when the input is strictly greater than zero
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 * var gt0 = new Tone.GreaterThanZero();
		 * var sig = new Tone.Signal(0.01).connect(gt0);
		 * //the output of gt0 is 1. 
		 * sig.value = 0;
		 * //the output of gt0 is 0. 
		 */
	    Tone.GreaterThanZero = function () {
	        /**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
	        this._thresh = this.output = new Tone.WaveShaper(function (val) {
	            if (val <= 0) {
	                return 0;
	            } else {
	                return 1;
	            }
	        });
	        /**
			 *  scale the first thresholded signal by a large value.
			 *  this will help with values which are very close to 0
			 *  @type {Tone.Multiply}
			 *  @private
			 */
	        this._scale = this.input = new Tone.Multiply(10000);
	        //connections
	        this._scale.connect(this._thresh);
	    };
	    Tone.extend(Tone.GreaterThanZero, Tone.SignalBase);
	    /**
		 *  dispose method
		 *  @returns {Tone.GreaterThanZero} this
		 */
	    Tone.GreaterThanZero.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._scale.dispose();
	        this._scale = null;
	        this._thresh.dispose();
	        this._thresh = null;
	        return this;
	    };
	    return Tone.GreaterThanZero;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  EqualZero outputs 1 when the input is equal to 
		 *          0 and outputs 0 otherwise. 
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 * var eq0 = new Tone.EqualZero();
		 * var sig = new Tone.Signal(0).connect(eq0);
		 * //the output of eq0 is 1. 
		 */
	    Tone.EqualZero = function () {
	        /**
			 *  scale the incoming signal by a large factor
			 *  @private
			 *  @type {Tone.Multiply}
			 */
	        this._scale = this.input = new Tone.Multiply(10000);
	        /**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
	        this._thresh = new Tone.WaveShaper(function (val) {
	            if (val === 0) {
	                return 1;
	            } else {
	                return 0;
	            }
	        }, 128);
	        /**
			 *  threshold the output so that it's 0 or 1
			 *  @type {Tone.GreaterThanZero}
			 *  @private
			 */
	        this._gtz = this.output = new Tone.GreaterThanZero();
	        //connections
	        this._scale.chain(this._thresh, this._gtz);
	    };
	    Tone.extend(Tone.EqualZero, Tone.SignalBase);
	    /**
		 *  Clean up.
		 *  @returns {Tone.EqualZero} this
		 */
	    Tone.EqualZero.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._gtz.dispose();
	        this._gtz = null;
	        this._scale.dispose();
	        this._scale = null;
	        this._thresh.dispose();
	        this._thresh = null;
	        return this;
	    };
	    return Tone.EqualZero;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Output 1 if the signal is equal to the value, otherwise outputs 0. 
		 *          Can accept two signals if connected to inputs 0 and 1.
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number=} value The number to compare the incoming signal to
		 *  @example
		 * var eq = new Tone.Equal(3);
		 * var sig = new Tone.Signal(3).connect(eq);
		 * //the output of eq is 1. 
		 */
	    Tone.Equal = function (value) {
	        Tone.call(this, 2, 0);
	        /**
			 *  subtract the value from the incoming signal
			 *  
			 *  @type {Tone.Add}
			 *  @private
			 */
	        this._sub = this.input[0] = new Tone.Subtract(value);
	        /**
			 *  @type {Tone.EqualZero}
			 *  @private
			 */
	        this._equals = this.output = new Tone.EqualZero();
	        this._sub.connect(this._equals);
	        this.input[1] = this._sub.input[1];
	    };
	    Tone.extend(Tone.Equal, Tone.SignalBase);
	    /**
		 * The value to compare to the incoming signal.
		 * @memberOf Tone.Equal#
		 * @type {number}
		 * @name value
		 */
	    Object.defineProperty(Tone.Equal.prototype, 'value', {
	        get: function () {
	            return this._sub.value;
	        },
	        set: function (value) {
	            this._sub.value = value;
	        }
	    });
	    /**
		 *  Clean up.
		 *  @returns {Tone.Equal} this
		 */
	    Tone.Equal.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._equals.dispose();
	        this._equals = null;
	        this._sub.dispose();
	        this._sub = null;
	        return this;
	    };
	    return Tone.Equal;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Select between any number of inputs, sending the one 
		 *         selected by the gate signal to the output
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [sourceCount=2] the number of inputs the switch accepts
		 *  @example
		 * var sel = new Tone.Select(2);
		 * var sigA = new Tone.Signal(10).connect(sel, 0, 0);
		 * var sigB = new Tone.Signal(20).connect(sel, 0, 1);
		 * sel.gate.value = 0;
		 * //sel outputs 10 (the value of sigA);
		 * sel.gate.value = 1;
		 * //sel outputs 20 (the value of sigB);
		 */
	    Tone.Select = function (sourceCount) {
	        sourceCount = this.defaultArg(sourceCount, 2);
	        Tone.call(this, sourceCount, 1);
	        /**
			 *  the control signal
			 *  @type {Number}
			 *  @signal
			 */
	        this.gate = new Tone.Signal(0);
	        this._readOnly('gate');
	        //make all the inputs and connect them
	        for (var i = 0; i < sourceCount; i++) {
	            var switchGate = new SelectGate(i);
	            this.input[i] = switchGate;
	            this.gate.connect(switchGate.selecter);
	            switchGate.connect(this.output);
	        }
	    };
	    Tone.extend(Tone.Select, Tone.SignalBase);
	    /**
		 *  Open a specific input and close the others.
		 *  @param {number} which The gate to open. 
		 *  @param {Time} [time=now] The time when the switch will open
		 *  @returns {Tone.Select} this
		 *  @example
		 * //open input 1 in a half second from now
		 * sel.select(1, "+0.5");
		 */
	    Tone.Select.prototype.select = function (which, time) {
	        //make sure it's an integer
	        which = Math.floor(which);
	        this.gate.setValueAtTime(which, this.toSeconds(time));
	        return this;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.Select} this
		 */
	    Tone.Select.prototype.dispose = function () {
	        this._writable('gate');
	        this.gate.dispose();
	        this.gate = null;
	        for (var i = 0; i < this.input.length; i++) {
	            this.input[i].dispose();
	            this.input[i] = null;
	        }
	        Tone.prototype.dispose.call(this);
	        return this;
	    };
	    ////////////START HELPER////////////
	    /**
		 *  helper class for Tone.Select representing a single gate
		 *  @constructor
		 *  @extends {Tone}
		 *  @private
		 */
	    var SelectGate = function (num) {
	        /**
			 *  the selector
			 *  @type {Tone.Equal}
			 */
	        this.selecter = new Tone.Equal(num);
	        /**
			 *  the gate
			 *  @type {GainNode}
			 */
	        this.gate = this.input = this.output = this.context.createGain();
	        //connect the selecter to the gate gain
	        this.selecter.connect(this.gate.gain);
	    };
	    Tone.extend(SelectGate);
	    /**
		 *  clean up
		 *  @private
		 */
	    SelectGate.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this.selecter.dispose();
	        this.gate.disconnect();
	        this.selecter = null;
	        this.gate = null;
	    };
	    ////////////END HELPER////////////
	    //return Tone.Select
	    return Tone.Select;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class IfThenElse has three inputs. When the first input (if) is true (i.e. === 1), 
		 *         then it will pass the second input (then) through to the output, otherwise, 
		 *         if it's not true (i.e. === 0) then it will pass the third input (else) 
		 *         through to the output. 
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 * var ifThenElse = new Tone.IfThenElse();
		 * var ifSignal = new Tone.Signal(1).connect(ifThenElse.if);
		 * var pwmOsc = new Tone.PWMOscillator().connect(ifThenElse.then);
		 * var pulseOsc = new Tone.PulseOscillator().connect(ifThenElse.else);
		 * //ifThenElse outputs pwmOsc
		 * signal.value = 0;
		 * //now ifThenElse outputs pulseOsc
		 */
	    Tone.IfThenElse = function () {
	        Tone.call(this, 3, 0);
	        /**
			 *  the selector node which is responsible for the routing
			 *  @type {Tone.Select}
			 *  @private
			 */
	        this._selector = this.output = new Tone.Select(2);
	        //the input mapping
	        this.if = this.input[0] = this._selector.gate;
	        this.then = this.input[1] = this._selector.input[1];
	        this.else = this.input[2] = this._selector.input[0];
	    };
	    Tone.extend(Tone.IfThenElse, Tone.SignalBase);
	    /**
		 *  clean up
		 *  @returns {Tone.IfThenElse} this
		 */
	    Tone.IfThenElse.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._selector.dispose();
	        this._selector = null;
	        this.if = null;
	        this.then = null;
	        this.else = null;
	        return this;
	    };
	    return Tone.IfThenElse;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class [OR](https://en.wikipedia.org/wiki/OR_gate)
		 *         the inputs together. True if at least one of the inputs is true. 
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number} [inputCount=2] the input count
		 *  @example
		 * var or = new Tone.OR(2);
		 * var sigA = new Tone.Signal(0)connect(or, 0, 0);
		 * var sigB = new Tone.Signal(1)connect(or, 0, 1);
		 * //output of or is 1 because at least
		 * //one of the inputs is equal to 1. 
		 */
	    Tone.OR = function (inputCount) {
	        inputCount = this.defaultArg(inputCount, 2);
	        Tone.call(this, inputCount, 0);
	        /**
			 *  a private summing node
			 *  @type {GainNode}
			 *  @private
			 */
	        this._sum = this.context.createGain();
	        /**
			 *  @type {Tone.Equal}
			 *  @private
			 */
	        this._gtz = this.output = new Tone.GreaterThanZero();
	        //make each of the inputs an alias
	        for (var i = 0; i < inputCount; i++) {
	            this.input[i] = this._sum;
	        }
	        this._sum.connect(this._gtz);
	    };
	    Tone.extend(Tone.OR, Tone.SignalBase);
	    /**
		 *  clean up
		 *  @returns {Tone.OR} this
		 */
	    Tone.OR.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._gtz.dispose();
	        this._gtz = null;
	        this._sum.disconnect();
	        this._sum = null;
	        return this;
	    };
	    return Tone.OR;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class [AND](https://en.wikipedia.org/wiki/Logical_conjunction)
		 *         returns 1 when all the inputs are equal to 1 and returns 0 otherwise.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number} [inputCount=2] the number of inputs. NOTE: all inputs are
		 *                                 connected to the single AND input node
		 *  @example
		 * var and = new Tone.AND(2);
		 * var sigA = new Tone.Signal(0).connect(and, 0, 0);
		 * var sigB = new Tone.Signal(1).connect(and, 0, 1);
		 * //the output of and is 0. 
		 */
	    Tone.AND = function (inputCount) {
	        inputCount = this.defaultArg(inputCount, 2);
	        Tone.call(this, inputCount, 0);
	        /**
			 *  @type {Tone.Equal}
			 *  @private
			 */
	        this._equals = this.output = new Tone.Equal(inputCount);
	        //make each of the inputs an alias
	        for (var i = 0; i < inputCount; i++) {
	            this.input[i] = this._equals;
	        }
	    };
	    Tone.extend(Tone.AND, Tone.SignalBase);
	    /**
		 *  clean up
		 *  @returns {Tone.AND} this
		 */
	    Tone.AND.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._equals.dispose();
	        this._equals = null;
	        return this;
	    };
	    return Tone.AND;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Just an alias for Tone.EqualZero, but has the same effect as a NOT operator. 
		 *          Outputs 1 when input equals 0. 
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 * var not = new Tone.NOT();
		 * var sig = new Tone.Signal(1).connect(not);
		 * //output of not equals 0. 
		 * sig.value = 0;
		 * //output of not equals 1.
		 */
	    Tone.NOT = Tone.EqualZero;
	    return Tone.NOT;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Output 1 if the signal is greater than the value, otherwise outputs 0.
		 *          can compare two signals or a signal and a number. 
		 *  
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number} [value=0] the value to compare to the incoming signal
		 *  @example
		 * var gt = new Tone.GreaterThan(2);
		 * var sig = new Tone.Signal(4).connect(gt);
		 * //output of gt is equal 1. 
		 */
	    Tone.GreaterThan = function (value) {
	        Tone.call(this, 2, 0);
	        /**
			 *  subtract the amount from the incoming signal
			 *  @type {Tone.Subtract}
			 *  @private
			 */
	        this._value = this.input[0] = new Tone.Subtract(value);
	        this.input[1] = this._value.input[1];
	        /**
			 *  compare that amount to zero
			 *  @type {Tone.GreaterThanZero}
			 *  @private
			 */
	        this._gtz = this.output = new Tone.GreaterThanZero();
	        //connect
	        this._value.connect(this._gtz);
	    };
	    Tone.extend(Tone.GreaterThan, Tone.Signal);
	    /**
		 *  dispose method
		 *  @returns {Tone.GreaterThan} this
		 */
	    Tone.GreaterThan.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._value.dispose();
	        this._value = null;
	        this._gtz.dispose();
	        this._gtz = null;
	        return this;
	    };
	    return Tone.GreaterThan;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Output 1 if the signal is less than the value, otherwise outputs 0.
		 *          Can compare two signals or a signal and a number. 
		 *  
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value The value to compare to the incoming signal. 
		 *                            If no value is provided, it will compare 
		 *                            <code>input[0]</code> and <code>input[1]</code>
		 *  @example
		 * var lt = new Tone.LessThan(2);
		 * var sig = new Tone.Signal(-1).connect(lt);
		 * //if (sig < 2) lt outputs 1
		 */
	    Tone.LessThan = function (value) {
	        Tone.call(this, 2, 0);
	        /**
			 *  negate the incoming signal
			 *  @type {Tone.Negate}
			 *  @private
			 */
	        this._neg = this.input[0] = new Tone.Negate();
	        /**
			 *  input < value === -input > -value
			 *  @type {Tone.GreaterThan}
			 *  @private
			 */
	        this._gt = this.output = new Tone.GreaterThan();
	        /**
			 *  negate the signal coming from the second input
			 *  @private
			 *  @type {Tone.Negate}
			 */
	        this._rhNeg = new Tone.Negate();
	        /**
			 *  the node where the value is set
			 *  @private
			 *  @type {Tone.Signal}
			 */
	        this._value = this.input[1] = new Tone.Signal(value);
	        //connect
	        this._neg.connect(this._gt);
	        this._value.connect(this._rhNeg);
	        this._rhNeg.connect(this._gt, 0, 1);
	    };
	    Tone.extend(Tone.LessThan, Tone.Signal);
	    /**
		 *  Clean up.
		 *  @returns {Tone.LessThan} this
		 */
	    Tone.LessThan.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._neg.dispose();
	        this._neg = null;
	        this._gt.dispose();
	        this._gt = null;
	        this._rhNeg.dispose();
	        this._rhNeg = null;
	        this._value.dispose();
	        this._value = null;
	        return this;
	    };
	    return Tone.LessThan;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Return the absolute value of an incoming signal. 
		 *  
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 * var signal = new Tone.Signal(-1);
		 * var abs = new Tone.Abs();
		 * signal.connect(abs);
		 * //the output of abs is 1. 
		 */
	    Tone.Abs = function () {
	        Tone.call(this, 1, 0);
	        /**
			 *  @type {Tone.LessThan}
			 *  @private
			 */
	        this._ltz = new Tone.LessThan(0);
	        /**
			 *  @type {Tone.Select}
			 *  @private
			 */
	        this._switch = this.output = new Tone.Select(2);
	        /**
			 *  @type {Tone.Negate}
			 *  @private
			 */
	        this._negate = new Tone.Negate();
	        //two signal paths, positive and negative
	        this.input.connect(this._switch, 0, 0);
	        this.input.connect(this._negate);
	        this._negate.connect(this._switch, 0, 1);
	        //the control signal
	        this.input.chain(this._ltz, this._switch.gate);
	    };
	    Tone.extend(Tone.Abs, Tone.SignalBase);
	    /**
		 *  dispose method
		 *  @returns {Tone.Abs} this
		 */
	    Tone.Abs.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._switch.dispose();
	        this._switch = null;
	        this._ltz.dispose();
	        this._ltz = null;
	        this._negate.dispose();
	        this._negate = null;
	        return this;
	    };
	    return Tone.Abs;
	});
	Module(function (Tone) {
	    
	    /**
		 * 	@class  Outputs the greater of two signals. If a number is provided in the constructor
		 * 	        it will use that instead of the signal. 
		 * 	
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} max Max value if provided. if not provided, it will use the
		 *                       signal value from input 1. 
		 *  @example
		 * var max = new Tone.Max(2);
		 * var sig = new Tone.Signal(3).connect(max);
		 * //max outputs 3
		 * sig.value = 1;
		 * //max outputs 2
		 *  @example
		 * var max = new Tone.Max();
		 * var sigA = new Tone.Signal(3);
		 * var sigB = new Tone.Signal(4);
		 * sigA.connect(max, 0, 0);
		 * sigB.connect(max, 0, 1);
		 * //output of max is 4.
		 */
	    Tone.Max = function (max) {
	        Tone.call(this, 2, 0);
	        this.input[0] = this.context.createGain();
	        /**
			 *  the max signal
			 *  @type {Tone.Signal}
			 *  @private
			 */
	        this._value = this.input[1] = new Tone.Signal(max);
	        /**
			 *  @type {Tone.Select}
			 *  @private
			 */
	        this._ifThenElse = this.output = new Tone.IfThenElse();
	        /**
			 *  @type {Tone.Select}
			 *  @private
			 */
	        this._gt = new Tone.GreaterThan();
	        //connections
	        this.input[0].chain(this._gt, this._ifThenElse.if);
	        this.input[0].connect(this._ifThenElse.then);
	        this._value.connect(this._ifThenElse.else);
	        this._value.connect(this._gt, 0, 1);
	    };
	    Tone.extend(Tone.Max, Tone.Signal);
	    /**
		 * 	Clean up.
		 *  @returns {Tone.Max} this
		 */
	    Tone.Max.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._value.dispose();
	        this._ifThenElse.dispose();
	        this._gt.dispose();
	        this._value = null;
	        this._ifThenElse = null;
	        this._gt = null;
	        return this;
	    };
	    return Tone.Max;
	});
	Module(function (Tone) {
	    
	    /**
		 * 	@class  Outputs the lesser of two signals. If a number is given 
		 * 	        in the constructor, it will use a signal and a number. 
		 * 	
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number} min The minimum to compare to the incoming signal
		 *  @example
		 * var min = new Tone.Min(2);
		 * var sig = new Tone.Signal(3).connect(min);
		 * //min outputs 2
		 * sig.value = 1;
		 * //min outputs 1
		 * 	 @example
		 * var min = new Tone.Min();
		 * var sigA = new Tone.Signal(3);
		 * var sigB = new Tone.Signal(4);
		 * sigA.connect(min, 0, 0);
		 * sigB.connect(min, 0, 1);
		 * //output of min is 3.
		 */
	    Tone.Min = function (min) {
	        Tone.call(this, 2, 0);
	        this.input[0] = this.context.createGain();
	        /**
			 *  @type {Tone.Select}
			 *  @private
			 */
	        this._ifThenElse = this.output = new Tone.IfThenElse();
	        /**
			 *  @type {Tone.Select}
			 *  @private
			 */
	        this._lt = new Tone.LessThan();
	        /**
			 *  the min signal
			 *  @type {Tone.Signal}
			 *  @private
			 */
	        this._value = this.input[1] = new Tone.Signal(min);
	        //connections
	        this.input[0].chain(this._lt, this._ifThenElse.if);
	        this.input[0].connect(this._ifThenElse.then);
	        this._value.connect(this._ifThenElse.else);
	        this._value.connect(this._lt, 0, 1);
	    };
	    Tone.extend(Tone.Min, Tone.Signal);
	    /**
		 *  clean up
		 *  @returns {Tone.Min} this
		 */
	    Tone.Min.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._value.dispose();
	        this._ifThenElse.dispose();
	        this._lt.dispose();
	        this._value = null;
	        this._ifThenElse = null;
	        this._lt = null;
	        return this;
	    };
	    return Tone.Min;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Signal-rate modulo operator. Only works in AudioRange [-1, 1] and for modulus
		 *         values in the NormalRange. 
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {NormalRange} modulus The modulus to apply.
		 *  @example
		 * var mod = new Tone.Modulo(0.2)
		 * var sig = new Tone.Signal(0.5).connect(mod);
		 * //mod outputs 0.1
		 */
	    Tone.Modulo = function (modulus) {
	        Tone.call(this, 1, 1);
	        /**
			 *  A waveshaper gets the integer multiple of 
			 *  the input signal and the modulus.
			 *  @private
			 *  @type {Tone.WaveShaper}
			 */
	        this._shaper = new Tone.WaveShaper(Math.pow(2, 16));
	        /**
			 *  the integer multiple is multiplied by the modulus
			 *  @type  {Tone.Multiply}
			 *  @private
			 */
	        this._multiply = new Tone.Multiply();
	        /**
			 *  and subtracted from the input signal
			 *  @type  {Tone.Subtract}
			 *  @private
			 */
	        this._subtract = this.output = new Tone.Subtract();
	        /**
			 *  the modulus signal
			 *  @type  {Tone.Signal}
			 *  @private
			 */
	        this._modSignal = new Tone.Signal(modulus);
	        //connections
	        this.input.fan(this._shaper, this._subtract);
	        this._modSignal.connect(this._multiply, 0, 0);
	        this._shaper.connect(this._multiply, 0, 1);
	        this._multiply.connect(this._subtract, 0, 1);
	        this._setWaveShaper(modulus);
	    };
	    Tone.extend(Tone.Modulo, Tone.SignalBase);
	    /**
		 *  @param  {number}  mod  the modulus to apply
		 *  @private
		 */
	    Tone.Modulo.prototype._setWaveShaper = function (mod) {
	        this._shaper.setMap(function (val) {
	            var multiple = Math.floor((val + 0.0001) / mod);
	            return multiple;
	        });
	    };
	    /**
		 * The modulus value.
		 * @memberOf Tone.Modulo#
		 * @type {NormalRange}
		 * @name value
		 */
	    Object.defineProperty(Tone.Modulo.prototype, 'value', {
	        get: function () {
	            return this._modSignal.value;
	        },
	        set: function (mod) {
	            this._modSignal.value = mod;
	            this._setWaveShaper(mod);
	        }
	    });
	    /**
		 * clean up
		 *  @returns {Tone.Modulo} this
		 */
	    Tone.Modulo.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._shaper.dispose();
	        this._shaper = null;
	        this._multiply.dispose();
	        this._multiply = null;
	        this._subtract.dispose();
	        this._subtract = null;
	        this._modSignal.dispose();
	        this._modSignal = null;
	        return this;
	    };
	    return Tone.Modulo;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Evaluate an expression at audio rate. <br><br>
		 *         Parsing code modified from https://code.google.com/p/tapdigit/
		 *         Copyright 2011 2012 Ariya Hidayat, New BSD License
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {string} expr the expression to generate
		 *  @example
		 * //adds the signals from input[0] and input[1].
		 * var expr = new Tone.Expr("$0 + $1");
		 */
	    Tone.Expr = function () {
	        var expr = this._replacements(Array.prototype.slice.call(arguments));
	        var inputCount = this._parseInputs(expr);
	        /**
			 *  hold onto all of the nodes for disposal
			 *  @type {Array}
			 *  @private
			 */
	        this._nodes = [];
	        /**
			 *  The inputs. The length is determined by the expression. 
			 *  @type {Array}
			 */
	        this.input = new Array(inputCount);
	        //create a gain for each input
	        for (var i = 0; i < inputCount; i++) {
	            this.input[i] = this.context.createGain();
	        }
	        //parse the syntax tree
	        var tree = this._parseTree(expr);
	        //evaluate the results
	        var result;
	        try {
	            result = this._eval(tree);
	        } catch (e) {
	            this._disposeNodes();
	            throw new Error('Could evaluate expression: ' + expr);
	        }
	        /**
			 *  The output node is the result of the expression
			 *  @type {Tone}
			 */
	        this.output = result;
	    };
	    Tone.extend(Tone.Expr, Tone.SignalBase);
	    //some helpers to cut down the amount of code
	    function applyBinary(Constructor, args, self) {
	        var op = new Constructor();
	        self._eval(args[0]).connect(op, 0, 0);
	        self._eval(args[1]).connect(op, 0, 1);
	        return op;
	    }
	    function applyUnary(Constructor, args, self) {
	        var op = new Constructor();
	        self._eval(args[0]).connect(op, 0, 0);
	        return op;
	    }
	    function getNumber(arg) {
	        return arg ? parseFloat(arg) : undefined;
	    }
	    function literalNumber(arg) {
	        return arg && arg.args ? parseFloat(arg.args) : undefined;
	    }
	    /*
		 *  the Expressions that Tone.Expr can parse.
		 *
		 *  each expression belongs to a group and contains a regexp 
		 *  for selecting the operator as well as that operators method
		 *  
		 *  @type {Object}
		 *  @private
		 */
	    Tone.Expr._Expressions = {
	        //values
	        'value': {
	            'signal': {
	                regexp: /^\d+\.\d+|^\d+/,
	                method: function (arg) {
	                    var sig = new Tone.Signal(getNumber(arg));
	                    return sig;
	                }
	            },
	            'input': {
	                regexp: /^\$\d/,
	                method: function (arg, self) {
	                    return self.input[getNumber(arg.substr(1))];
	                }
	            }
	        },
	        //syntactic glue
	        'glue': {
	            '(': { regexp: /^\(/ },
	            ')': { regexp: /^\)/ },
	            ',': { regexp: /^,/ }
	        },
	        //functions
	        'func': {
	            'abs': {
	                regexp: /^abs/,
	                method: applyUnary.bind(this, Tone.Abs)
	            },
	            'min': {
	                regexp: /^min/,
	                method: applyBinary.bind(this, Tone.Min)
	            },
	            'max': {
	                regexp: /^max/,
	                method: applyBinary.bind(this, Tone.Max)
	            },
	            'if': {
	                regexp: /^if/,
	                method: function (args, self) {
	                    var op = new Tone.IfThenElse();
	                    self._eval(args[0]).connect(op.if);
	                    self._eval(args[1]).connect(op.then);
	                    self._eval(args[2]).connect(op.else);
	                    return op;
	                }
	            },
	            'gt0': {
	                regexp: /^gt0/,
	                method: applyUnary.bind(this, Tone.GreaterThanZero)
	            },
	            'eq0': {
	                regexp: /^eq0/,
	                method: applyUnary.bind(this, Tone.EqualZero)
	            },
	            'mod': {
	                regexp: /^mod/,
	                method: function (args, self) {
	                    var modulus = literalNumber(args[1]);
	                    var op = new Tone.Modulo(modulus);
	                    self._eval(args[0]).connect(op);
	                    return op;
	                }
	            },
	            'pow': {
	                regexp: /^pow/,
	                method: function (args, self) {
	                    var exp = literalNumber(args[1]);
	                    var op = new Tone.Pow(exp);
	                    self._eval(args[0]).connect(op);
	                    return op;
	                }
	            }
	        },
	        //binary expressions
	        'binary': {
	            '+': {
	                regexp: /^\+/,
	                precedence: 1,
	                method: applyBinary.bind(this, Tone.Add)
	            },
	            '-': {
	                regexp: /^\-/,
	                precedence: 1,
	                method: function (args, self) {
	                    //both unary and binary op
	                    if (args.length === 1) {
	                        return applyUnary(Tone.Negate, args, self);
	                    } else {
	                        return applyBinary(Tone.Subtract, args, self);
	                    }
	                }
	            },
	            '*': {
	                regexp: /^\*/,
	                precedence: 0,
	                method: applyBinary.bind(this, Tone.Multiply)
	            },
	            '>': {
	                regexp: /^\>/,
	                precedence: 2,
	                method: applyBinary.bind(this, Tone.GreaterThan)
	            },
	            '<': {
	                regexp: /^</,
	                precedence: 2,
	                method: applyBinary.bind(this, Tone.LessThan)
	            },
	            '==': {
	                regexp: /^==/,
	                precedence: 3,
	                method: applyBinary.bind(this, Tone.Equal)
	            },
	            '&&': {
	                regexp: /^&&/,
	                precedence: 4,
	                method: applyBinary.bind(this, Tone.AND)
	            },
	            '||': {
	                regexp: /^\|\|/,
	                precedence: 5,
	                method: applyBinary.bind(this, Tone.OR)
	            }
	        },
	        //unary expressions
	        'unary': {
	            '-': {
	                regexp: /^\-/,
	                method: applyUnary.bind(this, Tone.Negate)
	            },
	            '!': {
	                regexp: /^\!/,
	                method: applyUnary.bind(this, Tone.NOT)
	            }
	        }
	    };
	    /**
		 *  @param   {string} expr the expression string
		 *  @return  {number}      the input count
		 *  @private
		 */
	    Tone.Expr.prototype._parseInputs = function (expr) {
	        var inputArray = expr.match(/\$\d/g);
	        var inputMax = 0;
	        if (inputArray !== null) {
	            for (var i = 0; i < inputArray.length; i++) {
	                var inputNum = parseInt(inputArray[i].substr(1)) + 1;
	                inputMax = Math.max(inputMax, inputNum);
	            }
	        }
	        return inputMax;
	    };
	    /**
		 *  @param   {Array} args 	an array of arguments
		 *  @return  {string} the results of the replacements being replaced
		 *  @private
		 */
	    Tone.Expr.prototype._replacements = function (args) {
	        var expr = args.shift();
	        for (var i = 0; i < args.length; i++) {
	            expr = expr.replace(/\%/i, args[i]);
	        }
	        return expr;
	    };
	    /**
		 *  tokenize the expression based on the Expressions object
		 *  @param   {string} expr 
		 *  @return  {Object}      returns two methods on the tokenized list, next and peek
		 *  @private
		 */
	    Tone.Expr.prototype._tokenize = function (expr) {
	        var position = -1;
	        var tokens = [];
	        while (expr.length > 0) {
	            expr = expr.trim();
	            var token = getNextToken(expr);
	            tokens.push(token);
	            expr = expr.substr(token.value.length);
	        }
	        function getNextToken(expr) {
	            for (var type in Tone.Expr._Expressions) {
	                var group = Tone.Expr._Expressions[type];
	                for (var opName in group) {
	                    var op = group[opName];
	                    var reg = op.regexp;
	                    var match = expr.match(reg);
	                    if (match !== null) {
	                        return {
	                            type: type,
	                            value: match[0],
	                            method: op.method
	                        };
	                    }
	                }
	            }
	            throw new SyntaxError('Unexpected token ' + expr);
	        }
	        return {
	            next: function () {
	                return tokens[++position];
	            },
	            peek: function () {
	                return tokens[position + 1];
	            }
	        };
	    };
	    /**
		 *  recursively parse the string expression into a syntax tree
		 *  
		 *  @param   {string} expr 
		 *  @return  {Object}
		 *  @private
		 */
	    Tone.Expr.prototype._parseTree = function (expr) {
	        var lexer = this._tokenize(expr);
	        var isUndef = this.isUndef.bind(this);
	        function matchSyntax(token, syn) {
	            return !isUndef(token) && token.type === 'glue' && token.value === syn;
	        }
	        function matchGroup(token, groupName, prec) {
	            var ret = false;
	            var group = Tone.Expr._Expressions[groupName];
	            if (!isUndef(token)) {
	                for (var opName in group) {
	                    var op = group[opName];
	                    if (op.regexp.test(token.value)) {
	                        if (!isUndef(prec)) {
	                            if (op.precedence === prec) {
	                                return true;
	                            }
	                        } else {
	                            return true;
	                        }
	                    }
	                }
	            }
	            return ret;
	        }
	        function parseExpression(precedence) {
	            if (isUndef(precedence)) {
	                precedence = 5;
	            }
	            var expr;
	            if (precedence < 0) {
	                expr = parseUnary();
	            } else {
	                expr = parseExpression(precedence - 1);
	            }
	            var token = lexer.peek();
	            while (matchGroup(token, 'binary', precedence)) {
	                token = lexer.next();
	                expr = {
	                    operator: token.value,
	                    method: token.method,
	                    args: [
	                        expr,
	                        parseExpression(precedence)
	                    ]
	                };
	                token = lexer.peek();
	            }
	            return expr;
	        }
	        function parseUnary() {
	            var token, expr;
	            token = lexer.peek();
	            if (matchGroup(token, 'unary')) {
	                token = lexer.next();
	                expr = parseUnary();
	                return {
	                    operator: token.value,
	                    method: token.method,
	                    args: [expr]
	                };
	            }
	            return parsePrimary();
	        }
	        function parsePrimary() {
	            var token, expr;
	            token = lexer.peek();
	            if (isUndef(token)) {
	                throw new SyntaxError('Unexpected termination of expression');
	            }
	            if (token.type === 'func') {
	                token = lexer.next();
	                return parseFunctionCall(token);
	            }
	            if (token.type === 'value') {
	                token = lexer.next();
	                return {
	                    method: token.method,
	                    args: token.value
	                };
	            }
	            if (matchSyntax(token, '(')) {
	                lexer.next();
	                expr = parseExpression();
	                token = lexer.next();
	                if (!matchSyntax(token, ')')) {
	                    throw new SyntaxError('Expected )');
	                }
	                return expr;
	            }
	            throw new SyntaxError('Parse error, cannot process token ' + token.value);
	        }
	        function parseFunctionCall(func) {
	            var token, args = [];
	            token = lexer.next();
	            if (!matchSyntax(token, '(')) {
	                throw new SyntaxError('Expected ( in a function call "' + func.value + '"');
	            }
	            token = lexer.peek();
	            if (!matchSyntax(token, ')')) {
	                args = parseArgumentList();
	            }
	            token = lexer.next();
	            if (!matchSyntax(token, ')')) {
	                throw new SyntaxError('Expected ) in a function call "' + func.value + '"');
	            }
	            return {
	                method: func.method,
	                args: args,
	                name: name
	            };
	        }
	        function parseArgumentList() {
	            var token, expr, args = [];
	            while (true) {
	                expr = parseExpression();
	                if (isUndef(expr)) {
	                    // TODO maybe throw exception?
	                    break;
	                }
	                args.push(expr);
	                token = lexer.peek();
	                if (!matchSyntax(token, ',')) {
	                    break;
	                }
	                lexer.next();
	            }
	            return args;
	        }
	        return parseExpression();
	    };
	    /**
		 *  recursively evaluate the expression tree
		 *  @param   {Object} tree 
		 *  @return  {AudioNode}      the resulting audio node from the expression
		 *  @private
		 */
	    Tone.Expr.prototype._eval = function (tree) {
	        if (!this.isUndef(tree)) {
	            var node = tree.method(tree.args, this);
	            this._nodes.push(node);
	            return node;
	        }
	    };
	    /**
		 *  dispose all the nodes
		 *  @private
		 */
	    Tone.Expr.prototype._disposeNodes = function () {
	        for (var i = 0; i < this._nodes.length; i++) {
	            var node = this._nodes[i];
	            if (this.isFunction(node.dispose)) {
	                node.dispose();
	            } else if (this.isFunction(node.disconnect)) {
	                node.disconnect();
	            }
	            node = null;
	            this._nodes[i] = null;
	        }
	        this._nodes = null;
	    };
	    /**
		 *  clean up
		 */
	    Tone.Expr.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._disposeNodes();
	    };
	    return Tone.Expr;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Convert an incoming signal between 0, 1 to an equal power gain scale.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 * var eqPowGain = new Tone.EqualPowerGain();
		 */
	    Tone.EqualPowerGain = function () {
	        /**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
	        this._eqPower = this.input = this.output = new Tone.WaveShaper(function (val) {
	            if (Math.abs(val) < 0.001) {
	                //should output 0 when input is 0
	                return 0;
	            } else {
	                return this.equalPowerScale(val);
	            }
	        }.bind(this), 4096);
	    };
	    Tone.extend(Tone.EqualPowerGain, Tone.SignalBase);
	    /**
		 *  clean up
		 *  @returns {Tone.EqualPowerGain} this
		 */
	    Tone.EqualPowerGain.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._eqPower.dispose();
	        this._eqPower = null;
	        return this;
	    };
	    return Tone.EqualPowerGain;
	});
	Module(function (Tone) {
	    
	    /**
		 * @class  Tone.Crossfade provides equal power fading between two inputs. 
		 *         More on crossfading technique [here](https://en.wikipedia.org/wiki/Fade_(audio_engineering)#Crossfading).
		 *
		 * @constructor
		 * @extends {Tone}
		 * @param {NormalRange} [initialFade=0.5]
		 * @example
		 * var crossFade = new Tone.CrossFade(0.5);
		 * //connect effect A to crossfade from
		 * //effect output 0 to crossfade input 0
		 * effectA.connect(crossFade, 0, 0);
		 * //connect effect B to crossfade from
		 * //effect output 0 to crossfade input 1
		 * effectB.connect(crossFade, 0, 1);
		 * crossFade.fade.value = 0;
		 * // ^ only effectA is output
		 * crossFade.fade.value = 1;
		 * // ^ only effectB is output
		 * crossFade.fade.value = 0.5;
		 * // ^ the two signals are mixed equally. 
		 */
	    Tone.CrossFade = function (initialFade) {
	        Tone.call(this, 2, 1);
	        /**
			 *  Alias for <code>input[0]</code>. 
			 *  @type {GainNode}
			 */
	        this.a = this.input[0] = this.context.createGain();
	        /**
			 *  Alias for <code>input[1]</code>. 
			 *  @type {GainNode}
			 */
	        this.b = this.input[1] = this.context.createGain();
	        /**
			 * 	The mix between the two inputs. A fade value of 0
			 * 	will output 100% <code>input[0]</code> and 
			 * 	a value of 1 will output 100% <code>input[1]</code>. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.fade = new Tone.Signal(this.defaultArg(initialFade, 0.5), Tone.Type.NormalRange);
	        /**
			 *  equal power gain cross fade
			 *  @private
			 *  @type {Tone.EqualPowerGain}
			 */
	        this._equalPowerA = new Tone.EqualPowerGain();
	        /**
			 *  equal power gain cross fade
			 *  @private
			 *  @type {Tone.EqualPowerGain}
			 */
	        this._equalPowerB = new Tone.EqualPowerGain();
	        /**
			 *  invert the incoming signal
			 *  @private
			 *  @type {Tone}
			 */
	        this._invert = new Tone.Expr('1 - $0');
	        //connections
	        this.a.connect(this.output);
	        this.b.connect(this.output);
	        this.fade.chain(this._equalPowerB, this.b.gain);
	        this.fade.chain(this._invert, this._equalPowerA, this.a.gain);
	        this._readOnly('fade');
	    };
	    Tone.extend(Tone.CrossFade);
	    /**
		 *  clean up
		 *  @returns {Tone.CrossFade} this
		 */
	    Tone.CrossFade.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable('fade');
	        this._equalPowerA.dispose();
	        this._equalPowerA = null;
	        this._equalPowerB.dispose();
	        this._equalPowerB = null;
	        this.fade.dispose();
	        this.fade = null;
	        this._invert.dispose();
	        this._invert = null;
	        this.a.disconnect();
	        this.a = null;
	        this.b.disconnect();
	        this.b = null;
	        return this;
	    };
	    return Tone.CrossFade;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Filter is a filter which allows for all of the same native methods
		 *          as the [BiquadFilterNode](http://webaudio.github.io/web-audio-api/#the-biquadfilternode-interface). 
		 *          Tone.Filter has the added ability to set the filter rolloff at -12 
		 *          (default), -24 and -48. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {Frequency|Object} [frequency] The cutoff frequency of the filter.
		 *  @param {string=} type The type of filter.
		 *  @param {number=} rolloff The drop in decibels per octave after the cutoff frequency.
		 *                            3 choices: -12, -24, and -48
		 *  @example
		 *  var filter = new Tone.Filter(200, "highpass");
		 */
	    Tone.Filter = function () {
	        Tone.call(this);
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'type',
	            'rolloff'
	        ], Tone.Filter.defaults);
	        /**
			 *  the filter(s)
			 *  @type {Array}
			 *  @private
			 */
	        this._filters = [];
	        /**
			 *  The cutoff frequency of the filter. 
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);
	        /**
			 *  The detune parameter
			 *  @type {Cents}
			 *  @signal
			 */
	        this.detune = new Tone.Signal(0, Tone.Type.Cents);
	        /**
			 *  The gain of the filter, only used in certain filter types
			 *  @type {Gain}
			 *  @signal
			 */
	        this.gain = new Tone.Signal({
	            'value': options.gain,
	            'units': Tone.Type.Decibels,
	            'convert': false
	        });
	        /**
			 *  The Q or Quality of the filter
			 *  @type {Positive}
			 *  @signal
			 */
	        this.Q = new Tone.Signal(options.Q);
	        /**
			 *  the type of the filter
			 *  @type {string}
			 *  @private
			 */
	        this._type = options.type;
	        /**
			 *  the rolloff value of the filter
			 *  @type {number}
			 *  @private
			 */
	        this._rolloff = options.rolloff;
	        //set the rolloff;
	        this.rolloff = options.rolloff;
	        this._readOnly([
	            'detune',
	            'frequency',
	            'gain',
	            'Q'
	        ]);
	    };
	    Tone.extend(Tone.Filter);
	    /**
		 *  the default parameters
		 *
		 *  @static
		 *  @type {Object}
		 */
	    Tone.Filter.defaults = {
	        'type': 'lowpass',
	        'frequency': 350,
	        'rolloff': -12,
	        'Q': 1,
	        'gain': 0
	    };
	    /**
		 * The type of the filter. Types: "lowpass", "highpass", 
		 * "bandpass", "lowshelf", "highshelf", "notch", "allpass", or "peaking". 
		 * @memberOf Tone.Filter#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.Filter.prototype, 'type', {
	        get: function () {
	            return this._type;
	        },
	        set: function (type) {
	            var types = [
	                'lowpass',
	                'highpass',
	                'bandpass',
	                'lowshelf',
	                'highshelf',
	                'notch',
	                'allpass',
	                'peaking'
	            ];
	            if (types.indexOf(type) === -1) {
	                throw new TypeError('Tone.Filter does not have filter type ' + type);
	            }
	            this._type = type;
	            for (var i = 0; i < this._filters.length; i++) {
	                this._filters[i].type = type;
	            }
	        }
	    });
	    /**
		 * The rolloff of the filter which is the drop in db
		 * per octave. Implemented internally by cascading filters.
		 * Only accepts the values -12, -24, and -48.
		 * @memberOf Tone.Filter#
		 * @type {number}
		 * @name rolloff
		 */
	    Object.defineProperty(Tone.Filter.prototype, 'rolloff', {
	        get: function () {
	            return this._rolloff;
	        },
	        set: function (rolloff) {
	            var possibilities = [
	                -12,
	                -24,
	                -48
	            ];
	            var cascadingCount = possibilities.indexOf(rolloff);
	            //check the rolloff is valid
	            if (cascadingCount === -1) {
	                throw new RangeError('Filter rolloff can only be -12, -24, or -48');
	            }
	            cascadingCount++;
	            this._rolloff = rolloff;
	            //first disconnect the filters and throw them away
	            this.input.disconnect();
	            for (var i = 0; i < this._filters.length; i++) {
	                this._filters[i].disconnect();
	                this._filters[i] = null;
	            }
	            this._filters = new Array(cascadingCount);
	            for (var count = 0; count < cascadingCount; count++) {
	                var filter = this.context.createBiquadFilter();
	                filter.type = this._type;
	                this.frequency.connect(filter.frequency);
	                this.detune.connect(filter.detune);
	                this.Q.connect(filter.Q);
	                this.gain.connect(filter.gain);
	                this._filters[count] = filter;
	            }
	            //connect them up
	            var connectionChain = [this.input].concat(this._filters).concat([this.output]);
	            this.connectSeries.apply(this, connectionChain);
	        }
	    });
	    /**
		 *  Clean up. 
		 *  @return {Tone.Filter} this
		 */
	    Tone.Filter.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        for (var i = 0; i < this._filters.length; i++) {
	            this._filters[i].disconnect();
	            this._filters[i] = null;
	        }
	        this._filters = null;
	        this._writable([
	            'detune',
	            'frequency',
	            'gain',
	            'Q'
	        ]);
	        this.frequency.dispose();
	        this.Q.dispose();
	        this.frequency = null;
	        this.Q = null;
	        this.detune.dispose();
	        this.detune = null;
	        this.gain.dispose();
	        this.gain = null;
	        return this;
	    };
	    return Tone.Filter;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Split the incoming signal into three bands (low, mid, high)
		 *         with two crossover frequency controls. 
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {Frequency|Object} [lowFrequency] the low/mid crossover frequency
		 *  @param {Frequency} [highFrequency] the mid/high crossover frequency
		 */
	    Tone.MultibandSplit = function () {
	        var options = this.optionsObject(arguments, [
	            'lowFrequency',
	            'highFrequency'
	        ], Tone.MultibandSplit.defaults);
	        /**
			 *  the input
			 *  @type {GainNode}
			 *  @private
			 */
	        this.input = this.context.createGain();
	        /**
			 *  the outputs
			 *  @type {Array}
			 *  @private
			 */
	        this.output = new Array(3);
	        /**
			 *  The low band. Alias for <code>output[0]</code>
			 *  @type {Tone.Filter}
			 */
	        this.low = this.output[0] = new Tone.Filter(0, 'lowpass');
	        /**
			 *  the lower filter of the mid band
			 *  @type {Tone.Filter}
			 *  @private
			 */
	        this._lowMidFilter = new Tone.Filter(0, 'highpass');
	        /**
			 *  The mid band output. Alias for <code>output[1]</code>
			 *  @type {Tone.Filter}
			 */
	        this.mid = this.output[1] = new Tone.Filter(0, 'lowpass');
	        /**
			 *  The high band output. Alias for <code>output[2]</code>
			 *  @type {Tone.Filter}
			 */
	        this.high = this.output[2] = new Tone.Filter(0, 'highpass');
	        /**
			 *  The low/mid crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.lowFrequency = new Tone.Signal(options.lowFrequency, Tone.Type.Frequency);
	        /**
			 *  The mid/high crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.highFrequency = new Tone.Signal(options.highFrequency, Tone.Type.Frequency);
	        /**
			 *  The quality of all the filters
			 *  @type {Number}
			 *  @signal
			 */
	        this.Q = new Tone.Signal(options.Q);
	        this.input.fan(this.low, this.high);
	        this.input.chain(this._lowMidFilter, this.mid);
	        //the frequency control signal
	        this.lowFrequency.connect(this.low.frequency);
	        this.lowFrequency.connect(this._lowMidFilter.frequency);
	        this.highFrequency.connect(this.mid.frequency);
	        this.highFrequency.connect(this.high.frequency);
	        //the Q value
	        this.Q.connect(this.low.Q);
	        this.Q.connect(this._lowMidFilter.Q);
	        this.Q.connect(this.mid.Q);
	        this.Q.connect(this.high.Q);
	        this._readOnly([
	            'high',
	            'mid',
	            'low',
	            'highFrequency',
	            'lowFrequency'
	        ]);
	    };
	    Tone.extend(Tone.MultibandSplit);
	    /**
		 *  @private
		 *  @static
		 *  @type {Object}
		 */
	    Tone.MultibandSplit.defaults = {
	        'lowFrequency': 400,
	        'highFrequency': 2500,
	        'Q': 1
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.MultibandSplit} this
		 */
	    Tone.MultibandSplit.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable([
	            'high',
	            'mid',
	            'low',
	            'highFrequency',
	            'lowFrequency'
	        ]);
	        this.low.dispose();
	        this.low = null;
	        this._lowMidFilter.dispose();
	        this._lowMidFilter = null;
	        this.mid.dispose();
	        this.mid = null;
	        this.high.dispose();
	        this.high = null;
	        this.lowFrequency.dispose();
	        this.lowFrequency = null;
	        this.highFrequency.dispose();
	        this.highFrequency = null;
	        this.Q.dispose();
	        this.Q = null;
	        return this;
	    };
	    return Tone.MultibandSplit;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.EQ3 is a three band EQ with control over low, mid, and high gain as
		 *         well as the low and high crossover frequencies.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  
		 *  @param {Decibels|Object} [lowLevel] The gain applied to the lows.
		 *  @param {Decibels} [midLevel] The gain applied to the mid.
		 *  @param {Decibels} [highLevel] The gain applied to the high.
		 *  @example
		 * var eq = new Tone.EQ3(-10, 3, -20);
		 */
	    Tone.EQ3 = function () {
	        var options = this.optionsObject(arguments, [
	            'low',
	            'mid',
	            'high'
	        ], Tone.EQ3.defaults);
	        /**
			 *  the output node
			 *  @type {GainNode}
			 *  @private
			 */
	        this.output = this.context.createGain();
	        /**
			 *  the multiband split
			 *  @type {Tone.MultibandSplit}
			 *  @private
			 */
	        this._multibandSplit = this.input = new Tone.MultibandSplit({
	            'lowFrequency': options.lowFrequency,
	            'highFrequency': options.highFrequency
	        });
	        /**
			 *  the low gain
			 *  @type {GainNode}
			 *  @private
			 */
	        this._lowGain = this.context.createGain();
	        /**
			 *  the mid gain
			 *  @type {GainNode}
			 *  @private
			 */
	        this._midGain = this.context.createGain();
	        /**
			 *  the high gain
			 *  @type {GainNode}
			 *  @private
			 */
	        this._highGain = this.context.createGain();
	        /**
			 * The gain in decibels of the low part
			 * @type {Decibels}
			 * @signal
			 */
	        this.low = new Tone.Signal(this._lowGain.gain, Tone.Type.Decibels);
	        /**
			 * The gain in decibels of the mid part
			 * @type {Decibels}
			 * @signal
			 */
	        this.mid = new Tone.Signal(this._midGain.gain, Tone.Type.Decibels);
	        /**
			 * The gain in decibels of the high part
			 * @type {Decibels}
			 * @signal
			 */
	        this.high = new Tone.Signal(this._highGain.gain, Tone.Type.Decibels);
	        /**
			 *  The Q value for all of the filters. 
			 *  @type {Positive}
			 *  @signal
			 */
	        this.Q = this._multibandSplit.Q;
	        /**
			 *  The low/mid crossover frequency. 
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.lowFrequency = this._multibandSplit.lowFrequency;
	        /**
			 *  The mid/high crossover frequency. 
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.highFrequency = this._multibandSplit.highFrequency;
	        //the frequency bands
	        this._multibandSplit.low.chain(this._lowGain, this.output);
	        this._multibandSplit.mid.chain(this._midGain, this.output);
	        this._multibandSplit.high.chain(this._highGain, this.output);
	        //set the gains
	        this.low.value = options.low;
	        this.mid.value = options.mid;
	        this.high.value = options.high;
	        this._readOnly([
	            'low',
	            'mid',
	            'high',
	            'lowFrequency',
	            'highFrequency'
	        ]);
	    };
	    Tone.extend(Tone.EQ3);
	    /**
		 *  the default values
		 */
	    Tone.EQ3.defaults = {
	        'low': 0,
	        'mid': 0,
	        'high': 0,
	        'lowFrequency': 400,
	        'highFrequency': 2500
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.EQ3} this
		 */
	    Tone.EQ3.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable([
	            'low',
	            'mid',
	            'high',
	            'lowFrequency',
	            'highFrequency'
	        ]);
	        this._multibandSplit.dispose();
	        this._multibandSplit = null;
	        this.lowFrequency = null;
	        this.highFrequency = null;
	        this._lowGain.disconnect();
	        this._lowGain = null;
	        this._midGain.disconnect();
	        this._midGain = null;
	        this._highGain.disconnect();
	        this._highGain = null;
	        this.low.dispose();
	        this.low = null;
	        this.mid.dispose();
	        this.mid = null;
	        this.high.dispose();
	        this.high = null;
	        this.Q = null;
	        return this;
	    };
	    return Tone.EQ3;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Performs a linear scaling on an input signal.
		 *          Scales a NormalRange input to between
		 *          outputMin and outputMax.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputMin=0] The output value when the input is 0. 
		 *  @param {number} [outputMax=1]	The output value when the input is 1. 
		 *  @example
		 * var scale = new Tone.Scale(50, 100);
		 * var signal = new Tone.Signal(0.5).connect(scale);
		 * //the output of scale equals 75
		 */
	    Tone.Scale = function (outputMin, outputMax) {
	        /** 
			 *  @private
			 *  @type {number}
			 */
	        this._outputMin = this.defaultArg(outputMin, 0);
	        /** 
			 *  @private
			 *  @type {number}
			 */
	        this._outputMax = this.defaultArg(outputMax, 1);
	        /** 
			 *  @private
			 *  @type {Tone.Multiply}
			 *  @private
			 */
	        this._scale = this.input = new Tone.Multiply(1);
	        /** 
			 *  @private
			 *  @type {Tone.Add}
			 *  @private
			 */
	        this._add = this.output = new Tone.Add(0);
	        this._scale.connect(this._add);
	        this._setRange();
	    };
	    Tone.extend(Tone.Scale, Tone.SignalBase);
	    /**
		 * The minimum output value. This number is output when 
		 * the value input value is 0. 
		 * @memberOf Tone.Scale#
		 * @type {number}
		 * @name min
		 */
	    Object.defineProperty(Tone.Scale.prototype, 'min', {
	        get: function () {
	            return this._outputMin;
	        },
	        set: function (min) {
	            this._outputMin = min;
	            this._setRange();
	        }
	    });
	    /**
		 * The maximum output value. This number is output when 
		 * the value input value is 1. 
		 * @memberOf Tone.Scale#
		 * @type {number}
		 * @name max
		 */
	    Object.defineProperty(Tone.Scale.prototype, 'max', {
	        get: function () {
	            return this._outputMax;
	        },
	        set: function (max) {
	            this._outputMax = max;
	            this._setRange();
	        }
	    });
	    /**
		 *  set the values
		 *  @private
		 */
	    Tone.Scale.prototype._setRange = function () {
	        this._add.value = this._outputMin;
	        this._scale.value = this._outputMax - this._outputMin;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.Scale} this
		 */
	    Tone.Scale.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._add.dispose();
	        this._add = null;
	        this._scale.dispose();
	        this._scale = null;
	        return this;
	    };
	    return Tone.Scale;
	});
	Module(function (Tone) {
	    /**
		 *  @class  Performs an exponential scaling on an input signal.
		 *          Scales a NormalRange value [0,1] exponentially
		 *          to the output range of outputMin to outputMax.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputMin=0] The output value when the input is 0. 
		 *  @param {number} [outputMax=1]	The output value when the input is 1. 
		 *  @param {number} [exponent=2] The exponent which scales the incoming signal.
		 *  @example
		 * var scaleExp = new Tone.ScaleExp(0, 100, 2);
		 * var signal = new Tone.Signal(0.5).connect(scaleExp);
		 */
	    Tone.ScaleExp = function (outputMin, outputMax, exponent) {
	        /**
			 *  scale the input to the output range
			 *  @type {Tone.Scale}
			 *  @private
			 */
	        this._scale = this.output = new Tone.Scale(outputMin, outputMax);
	        /**
			 *  @private
			 *  @type {Tone.Pow}
			 *  @private
			 */
	        this._exp = this.input = new Tone.Pow(this.defaultArg(exponent, 2));
	        this._exp.connect(this._scale);
	    };
	    Tone.extend(Tone.ScaleExp, Tone.SignalBase);
	    /**
		 * Instead of interpolating linearly between the <code>min</code> and 
		 * <code>max</code> values, setting the exponent will interpolate between
		 * the two values with an exponential curve. 
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name exponent
		 */
	    Object.defineProperty(Tone.ScaleExp.prototype, 'exponent', {
	        get: function () {
	            return this._exp.value;
	        },
	        set: function (exp) {
	            this._exp.value = exp;
	        }
	    });
	    /**
		 * The minimum output value. This number is output when 
		 * the value input value is 0. 
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name min
		 */
	    Object.defineProperty(Tone.ScaleExp.prototype, 'min', {
	        get: function () {
	            return this._scale.min;
	        },
	        set: function (min) {
	            this._scale.min = min;
	        }
	    });
	    /**
		 * The maximum output value. This number is output when 
		 * the value input value is 1. 
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name max
		 */
	    Object.defineProperty(Tone.ScaleExp.prototype, 'max', {
	        get: function () {
	            return this._scale.max;
	        },
	        set: function (max) {
	            this._scale.max = max;
	        }
	    });
	    /**
		 *  Clean up.
		 *  @returns {Tone.ScaleExp} this
		 */
	    Tone.ScaleExp.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._scale.dispose();
	        this._scale = null;
	        this._exp.dispose();
	        this._exp = null;
	        return this;
	    };
	    return Tone.ScaleExp;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Comb filters are basic building blocks for physical modeling. Read more
		 *         about comb filters on [CCRMA's website](https://ccrma.stanford.edu/~jos/pasp/Feedback_Comb_Filters.html).
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {Time|Object} [delayTime] The delay time of the filter. 
		 *  @param {NormalRange=} resonance The amount of feedback the filter has. 
		 */
	    Tone.FeedbackCombFilter = function () {
	        Tone.call(this);
	        var options = this.optionsObject(arguments, [
	            'delayTime',
	            'resonance'
	        ], Tone.FeedbackCombFilter.defaults);
	        /**
			 *  The amount of feedback of the delayed signal. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.resonance = new Tone.Signal(options.resonance, Tone.Type.NormalRange);
	        /**
			 *  the delay node
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._delay = this.input = this.output = this.context.createDelay(1);
	        /**
			 *  The amount of delay of the comb filter. 
			 *  @type {Time}
			 *  @signal
			 */
	        this.delayTime = new Tone.Signal(options.delayTime, Tone.Type.Time);
	        /**
			 *  the feedback node
			 *  @type {GainNode}
			 *  @private
			 */
	        this._feedback = this.context.createGain();
	        this._delay.chain(this._feedback, this._delay);
	        this.resonance.connect(this._feedback.gain);
	        this.delayTime.connect(this._delay.delayTime);
	        this._readOnly([
	            'resonance',
	            'delayTime'
	        ]);
	    };
	    Tone.extend(Tone.FeedbackCombFilter);
	    /**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.FeedbackCombFilter.defaults = {
	        'delayTime': 0.1,
	        'resonance': 0.5
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.FeedbackCombFilter} this
		 */
	    Tone.FeedbackCombFilter.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable([
	            'resonance',
	            'delayTime'
	        ]);
	        this._delay.disconnect();
	        this._delay = null;
	        this.delayTime.dispose();
	        this.delayTime = null;
	        this.resonance.dispose();
	        this.resonance = null;
	        this._feedback.disconnect();
	        this._feedback = null;
	        return this;
	    };
	    return Tone.FeedbackCombFilter;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Follower is a  crude envelope follower which will follow 
		 *          the amplitude of an incoming signal. 
		 *          Take care with small (< 0.02) attack or decay values 
		 *          as follower has some ripple which is exaggerated
		 *          at these values. Read more about envelope followers (also known 
		 *          as envelope detectors) on [Wikipedia](https://en.wikipedia.org/wiki/Envelope_detector).
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {Time|Object} [attack] The rate at which the follower rises.
		 *  @param {Time=} release The rate at which the folower falls. 
		 *  @example
		 * var follower = new Tone.Follower(0.2, 0.4);
		 */
	    Tone.Follower = function () {
	        Tone.call(this);
	        var options = this.optionsObject(arguments, [
	            'attack',
	            'release'
	        ], Tone.Follower.defaults);
	        /**
			 *  @type {Tone.Abs}
			 *  @private
			 */
	        this._abs = new Tone.Abs();
	        /**
			 *  the lowpass filter which smooths the input
			 *  @type {BiquadFilterNode}
			 *  @private
			 */
	        this._filter = this.context.createBiquadFilter();
	        this._filter.type = 'lowpass';
	        this._filter.frequency.value = 0;
	        this._filter.Q.value = -100;
	        /**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
	        this._frequencyValues = new Tone.WaveShaper();
	        /**
			 *  @type {Tone.Subtract}
			 *  @private
			 */
	        this._sub = new Tone.Subtract();
	        /**
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._delay = this.context.createDelay();
	        this._delay.delayTime.value = this.bufferTime;
	        /**
			 *  this keeps it far from 0, even for very small differences
			 *  @type {Tone.Multiply}
			 *  @private
			 */
	        this._mult = new Tone.Multiply(10000);
	        /**
			 *  @private
			 *  @type {number}
			 */
	        this._attack = options.attack;
	        /**
			 *  @private
			 *  @type {number}
			 */
	        this._release = options.release;
	        //the smoothed signal to get the values
	        this.input.chain(this._abs, this._filter, this.output);
	        //the difference path
	        this._abs.connect(this._sub, 0, 1);
	        this._filter.chain(this._delay, this._sub);
	        //threshold the difference and use the thresh to set the frequency
	        this._sub.chain(this._mult, this._frequencyValues, this._filter.frequency);
	        //set the attack and release values in the table
	        this._setAttackRelease(this._attack, this._release);
	    };
	    Tone.extend(Tone.Follower);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.Follower.defaults = {
	        'attack': 0.05,
	        'release': 0.5
	    };
	    /**
		 *  sets the attack and release times in the wave shaper
		 *  @param   {Time} attack  
		 *  @param   {Time} release 
		 *  @private
		 */
	    Tone.Follower.prototype._setAttackRelease = function (attack, release) {
	        var minTime = this.bufferTime;
	        attack = this.secondsToFrequency(this.toSeconds(attack));
	        release = this.secondsToFrequency(this.toSeconds(release));
	        attack = Math.max(attack, minTime);
	        release = Math.max(release, minTime);
	        this._frequencyValues.setMap(function (val) {
	            if (val <= 0) {
	                return attack;
	            } else {
	                return release;
	            }
	        });
	    };
	    /**
		 * The attack time.
		 * @memberOf Tone.Follower#
		 * @type {Time}
		 * @name attack
		 */
	    Object.defineProperty(Tone.Follower.prototype, 'attack', {
	        get: function () {
	            return this._attack;
	        },
	        set: function (attack) {
	            this._attack = attack;
	            this._setAttackRelease(this._attack, this._release);
	        }
	    });
	    /**
		 * The release time.
		 * @memberOf Tone.Follower#
		 * @type {Time}
		 * @name release
		 */
	    Object.defineProperty(Tone.Follower.prototype, 'release', {
	        get: function () {
	            return this._release;
	        },
	        set: function (release) {
	            this._release = release;
	            this._setAttackRelease(this._attack, this._release);
	        }
	    });
	    /**
		 *  Borrows the connect method from Signal so that the output can be used
		 *  as a Tone.Signal control signal.
		 *  @function
		 */
	    Tone.Follower.prototype.connect = Tone.Signal.prototype.connect;
	    /**
		 *  dispose
		 *  @returns {Tone.Follower} this
		 */
	    Tone.Follower.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._filter.disconnect();
	        this._filter = null;
	        this._frequencyValues.disconnect();
	        this._frequencyValues = null;
	        this._delay.disconnect();
	        this._delay = null;
	        this._sub.disconnect();
	        this._sub = null;
	        this._abs.dispose();
	        this._abs = null;
	        this._mult.dispose();
	        this._mult = null;
	        this._curve = null;
	        return this;
	    };
	    return Tone.Follower;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Gate only passes a signal through when the incoming 
		 *          signal exceeds a specified threshold. To do this, Gate uses 
		 *          a Tone.Follower to follow the amplitude of the incoming signal. 
		 *          A common implementation of this class is a [Noise Gate](https://en.wikipedia.org/wiki/Noise_gate).
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {Decibels|Object} [threshold] The threshold above which the gate will open. 
		 *  @param {Time=} attack The follower's attack time
		 *  @param {Time=} release The follower's release time
		 *  @example
		 * var gate = new Tone.Gate(-30, 0.2, 0.3).toMaster();
		 * var mic = new Tone.Microphone().connect(gate);
		 * //the gate will only pass through the incoming 
		 * //signal when it's louder than -30db
		 */
	    Tone.Gate = function () {
	        Tone.call(this);
	        var options = this.optionsObject(arguments, [
	            'threshold',
	            'attack',
	            'release'
	        ], Tone.Gate.defaults);
	        /**
			 *  @type {Tone.Follower}
			 *  @private
			 */
	        this._follower = new Tone.Follower(options.attack, options.release);
	        /**
			 *  @type {Tone.GreaterThan}
			 *  @private
			 */
	        this._gt = new Tone.GreaterThan(this.dbToGain(options.threshold));
	        //the connections
	        this.input.connect(this.output);
	        //the control signal
	        this.input.chain(this._gt, this._follower, this.output.gain);
	    };
	    Tone.extend(Tone.Gate);
	    /**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
	    Tone.Gate.defaults = {
	        'attack': 0.1,
	        'release': 0.1,
	        'threshold': -40
	    };
	    /**
		 * The threshold of the gate in decibels
		 * @memberOf Tone.Gate#
		 * @type {Decibels}
		 * @name threshold
		 */
	    Object.defineProperty(Tone.Gate.prototype, 'threshold', {
	        get: function () {
	            return this.gainToDb(this._gt.value);
	        },
	        set: function (thresh) {
	            this._gt.value = this.dbToGain(thresh);
	        }
	    });
	    /**
		 * The attack speed of the gate
		 * @memberOf Tone.Gate#
		 * @type {Time}
		 * @name attack
		 */
	    Object.defineProperty(Tone.Gate.prototype, 'attack', {
	        get: function () {
	            return this._follower.attack;
	        },
	        set: function (attackTime) {
	            this._follower.attack = attackTime;
	        }
	    });
	    /**
		 * The release speed of the gate
		 * @memberOf Tone.Gate#
		 * @type {Time}
		 * @name release
		 */
	    Object.defineProperty(Tone.Gate.prototype, 'release', {
	        get: function () {
	            return this._follower.release;
	        },
	        set: function (releaseTime) {
	            this._follower.release = releaseTime;
	        }
	    });
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Gate} this
		 */
	    Tone.Gate.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._follower.dispose();
	        this._gt.dispose();
	        this._follower = null;
	        this._gt = null;
	        return this;
	    };
	    return Tone.Gate;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  A sample accurate clock which provides a callback at the given rate. 
		 *          While the callback is not sample-accurate (it is still susceptible to
		 *          loose JS timing), the time passed in as the argument to the callback
		 *          is precise. For most applications, it is better to use Tone.Transport
		 *          instead of the clock. 
		 *
		 * 	@constructor
		 * 	@extends {Tone}
		 * 	@param {Frequency} frequency The rate of the callback
		 * 	@param {function} callback The callback to be invoked with the time of the audio event
		 * 	@example
		 * //the callback will be invoked approximately once a second
		 * //and will print the time exactly once a second apart.
		 * var clock = new Tone.Clock(1, function(time){
		 * 	console.log(time);
		 * });
		 */
	    Tone.Clock = function (frequency, callback) {
	        /**
			 *  the oscillator
			 *  @type {OscillatorNode}
			 *  @private
			 */
	        this._oscillator = null;
	        /**
			 *  the script processor which listens to the oscillator
			 *  @type {ScriptProcessorNode}
			 *  @private
			 */
	        this._jsNode = this.context.createScriptProcessor(this.bufferSize, 1, 1);
	        this._jsNode.onaudioprocess = this._processBuffer.bind(this);
	        /**
			 *  The frequency in which the callback will be invoked.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(frequency, Tone.Type.Frequency);
	        /**
			 *  whether the tick is on the up or down
			 *  @type {boolean}
			 *  @private
			 */
	        this._upTick = false;
	        /**
			 *  The callback which is invoked on every tick
			 *  with the time of that tick as the argument
			 *  @type {function(number)}
			 */
	        this.tick = callback;
	        /**
			 * Callback is invoked when the clock is stopped.
			 * @type {function}
			 * @example
			 * clock.onended = function(){
			 * 	console.log("the clock is stopped");
			 * }
			 */
	        this.onended = Tone.noOp;
	        //setup
	        this._jsNode.noGC();
	    };
	    Tone.extend(Tone.Clock);
	    /**
		 *  Start the clock.
		 *  @param {Time} [time=now] the time when the clock should start
		 *  @returns {Tone.Clock} this
		 *  @example
		 * clock.start();
		 */
	    Tone.Clock.prototype.start = function (time) {
	        if (!this._oscillator) {
	            this._oscillator = this.context.createOscillator();
	            this._oscillator.type = 'square';
	            this._oscillator.connect(this._jsNode);
	            //connect it up
	            this.frequency.connect(this._oscillator.frequency);
	            this._upTick = false;
	            var startTime = this.toSeconds(time);
	            this._oscillator.start(startTime);
	        }
	        return this;
	    };
	    /**
		 *  Stop the clock.
		 *  @param {Time} [time=now] The time when the clock should stop.
		 *  @returns {Tone.Clock} this
		 *  @example
		 * clock.stop();
		 */
	    Tone.Clock.prototype.stop = function (time) {
	        if (this._oscillator) {
	            var now = this.now();
	            var stopTime = this.toSeconds(time, now);
	            this._oscillator.stop(stopTime);
	            this._oscillator = null;
	            if (time) {
	                //set a timeout for when it stops
	                setTimeout(this.onended, (stopTime - now) * 1000);
	            } else {
	                this.onended();
	            }
	        }
	        return this;
	    };
	    /**
		 *  @private
		 *  @param  {AudioProcessingEvent} event
		 */
	    Tone.Clock.prototype._processBuffer = function (event) {
	        var now = this.defaultArg(event.playbackTime, this.now());
	        var bufferSize = this._jsNode.bufferSize;
	        var incomingBuffer = event.inputBuffer.getChannelData(0);
	        var upTick = this._upTick;
	        var self = this;
	        for (var i = 0; i < bufferSize; i++) {
	            var sample = incomingBuffer[i];
	            if (sample > 0 && !upTick) {
	                upTick = true;
	                //get the callback out of audio thread
	                setTimeout(function () {
	                    //to account for the double buffering
	                    var tickTime = now + self.samplesToSeconds(i + bufferSize * 2);
	                    return function () {
	                        if (self.tick) {
	                            self.tick(tickTime);
	                        }
	                    };
	                }(), 0);    // jshint ignore:line
	            } else if (sample < 0 && upTick) {
	                upTick = false;
	            }
	        }
	        this._upTick = upTick;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.Clock} this
		 */
	    Tone.Clock.prototype.dispose = function () {
	        this._jsNode.disconnect();
	        this.frequency.dispose();
	        this.frequency = null;
	        if (this._oscillator) {
	            this._oscillator.disconnect();
	            this._oscillator = null;
	        }
	        this._jsNode.onaudioprocess = Tone.noOp;
	        this._jsNode = null;
	        this.tick = null;
	        this.onended = Tone.noOp;
	        return this;
	    };
	    return Tone.Clock;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Oscillator-based transport allows for timing musical events.
		 *          Supports tempo curves and time changes. A single transport is created
		 *          on initialization. Unlike browser-based timing (setInterval, requestAnimationFrame)
		 *          Tone.Transport timing events pass in the exact time of the scheduled event
		 *          in the argument of the callback function. Pass that time value to the object
		 *          you're scheduling. <br><br>
		 *          A single transport is created for you when the library is initialized. 
		 *
		 *  @extends {Tone}
		 *  @singleton
		 *  @example
		 * //repeated event every 8th note
		 * Tone.Transport.setInterval(function(time){
		 * 	//do something with the time
		 * }, "8n");
		 *  @example
		 * //one time event 1 second in the future
		 * Tone.Transport.setTimeout(function(time){
		 * 	//do something with the time
		 * }, 1);
		 *  @example
		 * //event fixed to the Transports timeline. 
		 * Tone.Transport.setTimeline(function(time){
		 * 	//do something with the time
		 * }, "16:0:0");
		 */
	    Tone.Transport = function () {
	        /**
			 *  watches the main oscillator for timing ticks
			 *  initially starts at 120bpm
			 *  
			 *  @private
			 *  @type {Tone.Clock}
			 */
	        this._clock = new Tone.Clock(0, this._processTick.bind(this));
	        this._clock.onended = this._onended.bind(this);
	        /** 
			 * 	If the transport loops or not.
			 *  @type {boolean}
			 */
	        this.loop = false;
	        /**
			 *  The Beats Per Minute of the Transport. 
			 *  @type {BPM}
			 *  @signal
			 *  @example
			 * Tone.Transport.bpm.value = 80;
			 * //ramp the bpm to 120 over 10 seconds
			 * Tone.Transport.bpm.rampTo(120, 10);
			 */
	        this.bpm = new Tone.Signal(120, Tone.Type.BPM);
	        /**
			 *  the signal scalar
			 *  @type {Tone.Multiply}
			 *  @private
			 */
	        this._bpmMult = new Tone.Multiply(1 / 60 * tatum);
	        /**
			 * 	The state of the transport. READ ONLY. 
			 *  @type {Tone.State}
			 */
	        this.state = Tone.State.Stopped;
	        //connect it all up
	        this.bpm.chain(this._bpmMult, this._clock.frequency);
	    };
	    Tone.extend(Tone.Transport);
	    /**
		 *  the defaults
		 *  @type {Object}
		 *  @const
		 *  @static
		 */
	    Tone.Transport.defaults = {
	        'bpm': 120,
	        'swing': 0,
	        'swingSubdivision': '16n',
	        'timeSignature': 4,
	        'loopStart': 0,
	        'loopEnd': '4m'
	    };
	    /** 
		 * @private
		 * @type {number}
		 */
	    var tatum = 12;
	    /** 
		 * @private 
		 * @type {number} 
		 */
	    var timelineTicks = 0;
	    /** 
		 * @private 
		 * @type {number} 
		 */
	    var transportTicks = 0;
	    /**
		 *  Which subdivision the swing is applied to.
		 *  defaults to an 16th note
		 *  @private
		 *  @type {number}
		 */
	    var swingSubdivision = '16n';
	    /**
		 *  controls which beat the swing is applied to
		 *  defaults to an 16th note
		 *  @private
		 *  @type {number}
		 */
	    var swingTatum = 3;
	    /**
		 *  controls which beat the swing is applied to
		 *  @private
		 *  @type {number}
		 */
	    var swingAmount = 0;
	    /** 
		 * @private
		 * @type {number}
		 */
	    var transportTimeSignature = 4;
	    /** 
		 * @private
		 * @type {number}
		 */
	    var loopStart = 0;
	    /** 
		 * @private
		 * @type {number}
		 */
	    var loopEnd = tatum * 4;
	    /** 
		 * @private
		 * @type {Array}
		 */
	    var intervals = [];
	    /** 
		 * @private
		 * @type {Array}
		 */
	    var timeouts = [];
	    /** 
		 * @private
		 * @type {Array}
		 */
	    var transportTimeline = [];
	    /** 
		 * @private
		 * @type {number}
		 */
	    var timelineProgress = 0;
	    /** 
		 *  All of the synced components
		 *  @private 
		 *  @type {Array}
		 */
	    var SyncedSources = [];
	    /** 
		 *  All of the synced Signals
		 *  @private 
		 *  @type {Array}
		 */
	    var SyncedSignals = [];
	    ///////////////////////////////////////////////////////////////////////////////
	    //	TICKS
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  called on every tick
		 *  @param   {number} tickTime clock relative tick time
		 *  @private
		 */
	    Tone.Transport.prototype._processTick = function (tickTime) {
	        if (this.state === Tone.State.Started) {
	            if (swingAmount > 0 && timelineTicks % tatum !== 0 && //not on a downbeat
	                timelineTicks % swingTatum === 0) {
	                //add some swing
	                tickTime += this._ticksToSeconds(swingTatum) * swingAmount;
	            }
	            processIntervals(tickTime);
	            processTimeouts(tickTime);
	            processTimeline(tickTime);
	            transportTicks += 1;
	            timelineTicks += 1;
	            if (this.loop) {
	                if (timelineTicks === loopEnd) {
	                    this._setTicks(loopStart);
	                }
	            }
	        }
	    };
	    /**
		 *  jump to a specific tick in the timeline
		 *  updates the timeline callbacks
		 *  
		 *  @param   {number} ticks the tick to jump to
		 *  @private
		 */
	    Tone.Transport.prototype._setTicks = function (ticks) {
	        timelineTicks = ticks;
	        for (var i = 0; i < transportTimeline.length; i++) {
	            var timeout = transportTimeline[i];
	            if (timeout.callbackTick() >= ticks) {
	                timelineProgress = i;
	                break;
	            }
	        }
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	EVENT PROCESSING
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  process the intervals
		 *  @param  {number} time 
		 */
	    var processIntervals = function (time) {
	        for (var i = 0, len = intervals.length; i < len; i++) {
	            var interval = intervals[i];
	            if (interval.testInterval(transportTicks)) {
	                interval.doCallback(time);
	            }
	        }
	    };
	    /**
		 *  process the timeouts
		 *  @param  {number} time 
		 */
	    var processTimeouts = function (time) {
	        var removeTimeouts = 0;
	        for (var i = 0, len = timeouts.length; i < len; i++) {
	            var timeout = timeouts[i];
	            var callbackTick = timeout.callbackTick();
	            if (callbackTick <= transportTicks) {
	                timeout.doCallback(time);
	                removeTimeouts++;
	            } else if (callbackTick > transportTicks) {
	                break;
	            }
	        }
	        //remove the timeouts off the front of the array after they've been called
	        timeouts.splice(0, removeTimeouts);
	    };
	    /**
		 *  process the transportTimeline events
		 *  @param  {number} time 
		 */
	    var processTimeline = function (time) {
	        for (var i = timelineProgress, len = transportTimeline.length; i < len; i++) {
	            var evnt = transportTimeline[i];
	            var callbackTick = evnt.callbackTick();
	            if (callbackTick === timelineTicks) {
	                timelineProgress = i;
	                evnt.doCallback(time);
	            } else if (callbackTick > timelineTicks) {
	                break;
	            }
	        }
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	INTERVAL
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  Set a callback for a recurring event.
		 *  @param {function} callback
		 *  @param {Time}   interval 
		 *  @return {number} the id of the interval
		 *  @example
		 *  //triggers a callback every 8th note with the exact time of the event
		 *  Tone.Transport.setInterval(function(time){
		 *  	envelope.triggerAttack(time);
		 *  }, "8n");
		 */
	    Tone.Transport.prototype.setInterval = function (callback, interval, ctx) {
	        var tickTime = this._toTicks(interval);
	        var timeout = new TimelineEvent(callback, ctx, tickTime, transportTicks);
	        intervals.push(timeout);
	        return timeout.id;
	    };
	    /**
		 *  Stop and ongoing interval.
		 *  @param  {number} intervalID  The ID of interval to remove. The interval
		 *                               ID is given as the return value in Tone.Transport.setInterval.
		 *  @return {boolean}            	true if the event was removed
		 */
	    Tone.Transport.prototype.clearInterval = function (rmInterval) {
	        for (var i = 0; i < intervals.length; i++) {
	            var interval = intervals[i];
	            if (interval.id === rmInterval) {
	                intervals.splice(i, 1);
	                return true;
	            }
	        }
	        return false;
	    };
	    /**
		 *  Removes all of the intervals that are currently set. 
		 *  @return {boolean}            	true if the event was removed
		 */
	    Tone.Transport.prototype.clearIntervals = function () {
	        var willRemove = intervals.length > 0;
	        intervals = [];
	        return willRemove;
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	TIMEOUT
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  Set a timeout to occur after time from now. NB: the transport must be 
		 *  running for this to be triggered. All timeout events are cleared when the 
		 *  transport is stopped. 
		 *
		 *  @param {function} callback 
		 *  @param {Time}   time    The time (from now) that the callback will be invoked.
		 *  @return {number} The id of the timeout.
		 *  @example
		 *  //trigger an event to happen 1 second from now
		 *  Tone.Transport.setTimeout(function(time){
		 *  	player.start(time);
		 *  }, 1)
		 */
	    Tone.Transport.prototype.setTimeout = function (callback, time, ctx) {
	        var ticks = this._toTicks(time);
	        var timeout = new TimelineEvent(callback, ctx, ticks + transportTicks, 0);
	        //put it in the right spot
	        for (var i = 0, len = timeouts.length; i < len; i++) {
	            var testEvnt = timeouts[i];
	            if (testEvnt.callbackTick() > timeout.callbackTick()) {
	                timeouts.splice(i, 0, timeout);
	                return timeout.id;
	            }
	        }
	        //otherwise push it on the end
	        timeouts.push(timeout);
	        return timeout.id;
	    };
	    /**
		 *  Clear a timeout using it's ID.
		 *  @param  {number} intervalID  The ID of timeout to remove. The timeout
		 *                               ID is given as the return value in Tone.Transport.setTimeout.
		 *  @return {boolean}           true if the timeout was removed
		 */
	    Tone.Transport.prototype.clearTimeout = function (timeoutID) {
	        for (var i = 0; i < timeouts.length; i++) {
	            var testTimeout = timeouts[i];
	            if (testTimeout.id === timeoutID) {
	                timeouts.splice(i, 1);
	                return true;
	            }
	        }
	        return false;
	    };
	    /**
		 *  Removes all of the timeouts that are currently set. 
		 *  @return {boolean}            	true if the event was removed
		 */
	    Tone.Transport.prototype.clearTimeouts = function () {
	        var willRemove = timeouts.length > 0;
	        timeouts = [];
	        return willRemove;
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	TIMELINE
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  Timeline events are synced to the timeline of the Tone.Transport.
		 *  Unlike Timeout, Timeline events will restart after the 
		 *  Tone.Transport has been stopped and restarted. 
		 *
		 *  @param {function} 	callback 	
		 *  @param {Tome.Time}  timeout  
		 *  @return {number} 				the id for clearing the transportTimeline event
		 *  @example
		 *  //trigger the start of a part on the 16th measure
		 *  Tone.Transport.setTimeline(function(time){
		 *  	part.start(time);
		 *  }, "16m");
		 */
	    Tone.Transport.prototype.setTimeline = function (callback, timeout, ctx) {
	        var ticks = this._toTicks(timeout);
	        var timelineEvnt = new TimelineEvent(callback, ctx, ticks, 0);
	        //put it in the right spot
	        for (var i = timelineProgress, len = transportTimeline.length; i < len; i++) {
	            var testEvnt = transportTimeline[i];
	            if (testEvnt.callbackTick() > timelineEvnt.callbackTick()) {
	                transportTimeline.splice(i, 0, timelineEvnt);
	                return timelineEvnt.id;
	            }
	        }
	        //otherwise push it on the end
	        transportTimeline.push(timelineEvnt);
	        return timelineEvnt.id;
	    };
	    /**
		 *  Clear the timeline event.
		 *  @param  {number} timelineID 
		 *  @return {boolean} true if it was removed
		 */
	    Tone.Transport.prototype.clearTimeline = function (timelineID) {
	        for (var i = 0; i < transportTimeline.length; i++) {
	            var testTimeline = transportTimeline[i];
	            if (testTimeline.id === timelineID) {
	                transportTimeline.splice(i, 1);
	                return true;
	            }
	        }
	        return false;
	    };
	    /**
		 *  Remove all events from the timeline.
		 *  @returns {boolean} true if the events were removed
		 */
	    Tone.Transport.prototype.clearTimelines = function () {
	        timelineProgress = 0;
	        var willRemove = transportTimeline.length > 0;
	        transportTimeline = [];
	        return willRemove;
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	TIME CONVERSIONS
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  turns the time into
		 *  @param  {Time} time
		 *  @return {number}   
		 *  @private   
		 */
	    Tone.Transport.prototype._toTicks = function (time) {
	        //get the seconds
	        var seconds = this.toSeconds(time);
	        var quarter = this.notationToSeconds('4n');
	        var quarters = seconds / quarter;
	        var tickNum = quarters * tatum;
	        //quantize to tick value
	        return Math.round(tickNum);
	    };
	    /**
		 *  convert ticks into seconds
		 *  
		 *  @param  {number} ticks 
		 *  @param {number=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {number}               seconds
		 *  @private
		 */
	    Tone.Transport.prototype._ticksToSeconds = function (ticks, bpm, timeSignature) {
	        ticks = Math.floor(ticks);
	        var quater = this.notationToSeconds('4n', bpm, timeSignature);
	        return quater * ticks / tatum;
	    };
	    /**
		 *  Returns the time of the next beat.
		 *  @param  {string} [subdivision="4n"]
		 *  @return {number} 	the time in seconds of the next subdivision
		 */
	    Tone.Transport.prototype.nextBeat = function (subdivision) {
	        subdivision = this.defaultArg(subdivision, '4n');
	        var tickNum = this._toTicks(subdivision);
	        var remainingTicks = transportTicks % tickNum;
	        var nextTick = remainingTicks;
	        if (remainingTicks > 0) {
	            nextTick = tickNum - remainingTicks;
	        }
	        return this._ticksToSeconds(nextTick);
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	START/STOP/PAUSE
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  Start the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now] The time when the transport should start.
		 *  @param  {Time=} offset The timeline offset to start the transport.
		 *  @returns {Tone.Transport} this
		 *  @example
		 * //start the transport in one second starting at beginning of the 5th measure. 
		 * Tone.Transport.start("+1", "4:0:0");
		 */
	    Tone.Transport.prototype.start = function (time, offset) {
	        if (this.state === Tone.State.Stopped || this.state === Tone.State.Paused) {
	            if (!this.isUndef(offset)) {
	                this._setTicks(this._toTicks(offset));
	            }
	            this.state = Tone.State.Started;
	            var startTime = this.toSeconds(time);
	            this._clock.start(startTime);
	            //call start on each of the synced sources
	            for (var i = 0; i < SyncedSources.length; i++) {
	                var source = SyncedSources[i].source;
	                var delay = SyncedSources[i].delay;
	                source.start(startTime + delay);
	            }
	        }
	        return this;
	    };
	    /**
		 *  Stop the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now] The time when the transport should stop. 
		 *  @returns {Tone.Transport} this
		 *  @example
		 * Tone.Transport.stop();
		 */
	    Tone.Transport.prototype.stop = function (time) {
	        if (this.state === Tone.State.Started || this.state === Tone.State.Paused) {
	            var stopTime = this.toSeconds(time);
	            this._clock.stop(stopTime);
	            //call start on each of the synced sources
	            for (var i = 0; i < SyncedSources.length; i++) {
	                var source = SyncedSources[i].source;
	                source.stop(stopTime);
	            }
	        } else {
	            this._onended();
	        }
	        return this;
	    };
	    /**
		 *  invoked when the transport is stopped
		 *  @private
		 */
	    Tone.Transport.prototype._onended = function () {
	        transportTicks = 0;
	        this._setTicks(0);
	        this.clearTimeouts();
	        this.state = Tone.State.Stopped;
	    };
	    /**
		 *  Pause the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now]
		 *  @returns {Tone.Transport} this
		 */
	    Tone.Transport.prototype.pause = function (time) {
	        if (this.state === Tone.State.Started) {
	            this.state = Tone.State.Paused;
	            var stopTime = this.toSeconds(time);
	            this._clock.stop(stopTime);
	            //call pause on each of the synced sources
	            for (var i = 0; i < SyncedSources.length; i++) {
	                var source = SyncedSources[i].source;
	                source.pause(stopTime);
	            }
	        }
	        return this;
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	SETTERS/GETTERS
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  The time signature as just the numerator over 4. 
		 *  For example 4/4 would be just 4 and 6/8 would be 3.
		 *  @memberOf Tone.Transport#
		 *  @type {number}
		 *  @name timeSignature
		 *  @example
		 * //common time
		 * Tone.Transport.timeSignature = 4;
		 * // 7/8
		 * Tone.Transport.timeSignature = 3.5;
		 */
	    Object.defineProperty(Tone.Transport.prototype, 'timeSignature', {
	        get: function () {
	            return transportTimeSignature;
	        },
	        set: function (numerator) {
	            transportTimeSignature = numerator;
	        }
	    });
	    /**
		 * When the Tone.Transport.loop = true, this is the starting position of the loop.
		 * @memberOf Tone.Transport#
		 * @type {Time}
		 * @name loopStart
		 */
	    Object.defineProperty(Tone.Transport.prototype, 'loopStart', {
	        get: function () {
	            return this._ticksToSeconds(loopStart);
	        },
	        set: function (startPosition) {
	            loopStart = this._toTicks(startPosition);
	        }
	    });
	    /**
		 * When the Tone.Transport.loop = true, this is the ending position of the loop.
		 * @memberOf Tone.Transport#
		 * @type {Time}
		 * @name loopEnd
		 */
	    Object.defineProperty(Tone.Transport.prototype, 'loopEnd', {
	        get: function () {
	            return this._ticksToSeconds(loopEnd);
	        },
	        set: function (endPosition) {
	            loopEnd = this._toTicks(endPosition);
	        }
	    });
	    /**
		 *  Set the loop start and stop at the same time. 
		 *  @param {Time} startPosition 
		 *  @param {Time} endPosition   
		 *  @returns {Tone.Transport} this
		 *  @example
		 * //loop over the first measure
		 * Tone.Transport.setLoopPoints(0, "1m");
		 * Tone.Transport.loop = true;
		 */
	    Tone.Transport.prototype.setLoopPoints = function (startPosition, endPosition) {
	        this.loopStart = startPosition;
	        this.loopEnd = endPosition;
	        return this;
	    };
	    /**
		 *  The swing value. Between 0-1 where 1 equal to 
		 *  the note + half the subdivision.
		 *  @memberOf Tone.Transport#
		 *  @type {NormalRange}
		 *  @name swing
		 */
	    Object.defineProperty(Tone.Transport.prototype, 'swing', {
	        get: function () {
	            return swingAmount * 2;
	        },
	        set: function (amount) {
	            //scale the values to a normal range
	            swingAmount = amount * 0.5;
	        }
	    });
	    /**
		 *  Set the subdivision which the swing will be applied to. 
		 *  The default values is a 16th note. Value must be less 
		 *  than a quarter note.
		 *  
		 *  @memberOf Tone.Transport#
		 *  @type {Time}
		 *  @name swingSubdivision
		 */
	    Object.defineProperty(Tone.Transport.prototype, 'swingSubdivision', {
	        get: function () {
	            return swingSubdivision;
	        },
	        set: function (subdivision) {
	            //scale the values to a normal range
	            swingSubdivision = subdivision;
	            swingTatum = this._toTicks(subdivision);
	        }
	    });
	    /**
		 *  The Transport's position in MEASURES:BEATS:SIXTEENTHS.
		 *  Setting the value will jump to that position right away. 
		 *  
		 *  @memberOf Tone.Transport#
		 *  @type {TransportTime}
		 *  @name position
		 */
	    Object.defineProperty(Tone.Transport.prototype, 'position', {
	        get: function () {
	            var quarters = timelineTicks / tatum;
	            var measures = Math.floor(quarters / transportTimeSignature);
	            var sixteenths = Math.floor(quarters % 1 * 4);
	            quarters = Math.floor(quarters) % transportTimeSignature;
	            var progress = [
	                measures,
	                quarters,
	                sixteenths
	            ];
	            return progress.join(':');
	        },
	        set: function (progress) {
	            var ticks = this._toTicks(progress);
	            this._setTicks(ticks);
	        }
	    });
	    ///////////////////////////////////////////////////////////////////////////////
	    //	SYNCING
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  Sync a source to the transport so that 
		 *  @param  {Tone.Source} source the source to sync to the transport
		 *  @param {Time} delay (optionally) start the source with a delay from the transport
		 *  @returns {Tone.Transport} this
		 *  @example
		 * Tone.Transport.syncSource(player, "1m");
		 * Tone.Transport.start();
		 * //the player will start 1 measure after the transport starts
		 */
	    Tone.Transport.prototype.syncSource = function (source, startDelay) {
	        SyncedSources.push({
	            source: source,
	            delay: this.toSeconds(this.defaultArg(startDelay, 0))
	        });
	        return this;
	    };
	    /**
		 *  Unsync the source from the transport. See Tone.Transport.syncSource. 
		 *  
		 *  @param  {Tone.Source} source [description]
		 *  @returns {Tone.Transport} this
		 */
	    Tone.Transport.prototype.unsyncSource = function (source) {
	        for (var i = 0; i < SyncedSources.length; i++) {
	            if (SyncedSources[i].source === source) {
	                SyncedSources.splice(i, 1);
	            }
	        }
	        return this;
	    };
	    /**
		 *  Attaches the signal to the tempo control signal so that 
		 *  any changes in the tempo will change the signal in the same
		 *  ratio. 
		 *  
		 *  @param  {Tone.Signal} signal 
		 *  @param {number=} ratio Optionally pass in the ratio between
		 *                         the two signals. Otherwise it will be computed
		 *                         based on their current values. 
		 *  @returns {Tone.Transport} this
		 */
	    Tone.Transport.prototype.syncSignal = function (signal, ratio) {
	        if (!ratio) {
	            //get the sync ratio
	            if (signal._value.value !== 0) {
	                ratio = signal._value.value / this.bpm.value;
	            } else {
	                ratio = 0;
	            }
	        }
	        var ratioSignal = this.context.createGain();
	        ratioSignal.gain.value = ratio;
	        this.bpm.chain(ratioSignal, signal._value);
	        SyncedSignals.push({
	            'ratio': ratioSignal,
	            'signal': signal,
	            'initial': signal._value.value
	        });
	        signal._value.value = 0;
	        return this;
	    };
	    /**
		 *  Unsyncs a previously synced signal from the transport's control. 
		 *  See Tone.Transport.syncSignal.
		 *  @param  {Tone.Signal} signal 
		 *  @returns {Tone.Transport} this
		 */
	    Tone.Transport.prototype.unsyncSignal = function (signal) {
	        for (var i = 0; i < SyncedSignals.length; i++) {
	            var syncedSignal = SyncedSignals[i];
	            if (syncedSignal.signal === signal) {
	                syncedSignal.ratio.disconnect();
	                syncedSignal.signal._value.value = syncedSignal.initial;
	                SyncedSignals.splice(i, 1);
	            }
	        }
	        return this;
	    };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Transport} this
		 *  @private
		 */
	    Tone.Transport.prototype.dispose = function () {
	        this._clock.dispose();
	        this._clock = null;
	        this.bpm.dispose();
	        this.bpm = null;
	        this._bpmMult.dispose();
	        this._bpmMult = null;
	        return this;
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	TIMELINE EVENT
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  @static
		 *  @type {number}
		 */
	    var TimelineEventIDCounter = 0;
	    /**
		 *  A Timeline event
		 *
		 *  @constructor
		 *  @private
		 *  @param {function(number)} callback   
		 *  @param {Object}   context    
		 *  @param {number}   tickTime
	 	 *  @param {number}   startTicks
		 */
	    var TimelineEvent = function (callback, context, tickTime, startTicks) {
	        this.startTicks = startTicks;
	        this.tickTime = tickTime;
	        this.callback = callback;
	        this.context = context;
	        this.id = TimelineEventIDCounter++;
	    };
	    /**
		 *  invoke the callback in the correct context
		 *  passes in the playback time
		 *  
		 *  @param  {number} playbackTime 
		 */
	    TimelineEvent.prototype.doCallback = function (playbackTime) {
	        this.callback.call(this.context, playbackTime);
	    };
	    /**
		 *  get the tick which the callback is supposed to occur on
		 *  
		 *  @return {number} 
		 */
	    TimelineEvent.prototype.callbackTick = function () {
	        return this.startTicks + this.tickTime;
	    };
	    /**
		 *  test if the tick occurs on the interval
		 *  
		 *  @param  {number} tick 
		 *  @return {boolean}      
		 */
	    TimelineEvent.prototype.testInterval = function (tick) {
	        return (tick - this.startTicks) % this.tickTime === 0;
	    };
	    ///////////////////////////////////////////////////////////////////////////////
	    //	AUGMENT TONE'S PROTOTYPE TO INCLUDE TRANSPORT TIMING
	    ///////////////////////////////////////////////////////////////////////////////
	    /**
		 *  tests if a string is musical notation
		 *  i.e.:
		 *  	4n = quarter note
		 *   	2m = two measures
		 *    	8t = eighth-note triplet
		 *  
		 *  @return {boolean} 
		 *  @method isNotation
		 *  @lends Tone.prototype.isNotation
		 */
	    Tone.prototype.isNotation = function () {
	        var notationFormat = new RegExp(/[0-9]+[mnt]$/i);
	        return function (note) {
	            return notationFormat.test(note);
	        };
	    }();
	    /**
		 *  tests if a string is transportTime
		 *  i.e. :
		 *  	1:2:0 = 1 measure + two quarter notes + 0 sixteenth notes
		 *  	
		 *  @return {boolean} 
		 *
		 *  @method isTransportTime
		 *  @lends Tone.prototype.isTransportTime
		 */
	    Tone.prototype.isTransportTime = function () {
	        var transportTimeFormat = new RegExp(/^\d+(\.\d+)?:\d+(\.\d+)?(:\d+(\.\d+)?)?$/i);
	        return function (transportTime) {
	            return transportTimeFormat.test(transportTime);
	        };
	    }();
	    /**
		 *
		 *  convert notation format strings to seconds
		 *  
		 *  @param  {string} notation     
		 *  @param {number=} bpm 
		 *  @param {number=} timeSignature 
		 *  @return {number} 
		 *                
		 */
	    Tone.prototype.notationToSeconds = function (notation, bpm, timeSignature) {
	        bpm = this.defaultArg(bpm, Tone.Transport.bpm.value);
	        timeSignature = this.defaultArg(timeSignature, transportTimeSignature);
	        var beatTime = 60 / bpm;
	        var subdivision = parseInt(notation, 10);
	        var beats = 0;
	        if (subdivision === 0) {
	            beats = 0;
	        }
	        var lastLetter = notation.slice(-1);
	        if (lastLetter === 't') {
	            beats = 4 / subdivision * 2 / 3;
	        } else if (lastLetter === 'n') {
	            beats = 4 / subdivision;
	        } else if (lastLetter === 'm') {
	            beats = subdivision * timeSignature;
	        } else {
	            beats = 0;
	        }
	        return beatTime * beats;
	    };
	    /**
		 *  convert transportTime into seconds.
		 *  
		 *  ie: 4:2:3 == 4 measures + 2 quarters + 3 sixteenths
		 *
		 *  @param  {string} transportTime 
		 *  @param {number=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {number}               seconds
		 *
		 *  @lends Tone.prototype.transportTimeToSeconds
		 */
	    Tone.prototype.transportTimeToSeconds = function (transportTime, bpm, timeSignature) {
	        bpm = this.defaultArg(bpm, Tone.Transport.bpm.value);
	        timeSignature = this.defaultArg(timeSignature, transportTimeSignature);
	        var measures = 0;
	        var quarters = 0;
	        var sixteenths = 0;
	        var split = transportTime.split(':');
	        if (split.length === 2) {
	            measures = parseFloat(split[0]);
	            quarters = parseFloat(split[1]);
	        } else if (split.length === 1) {
	            quarters = parseFloat(split[0]);
	        } else if (split.length === 3) {
	            measures = parseFloat(split[0]);
	            quarters = parseFloat(split[1]);
	            sixteenths = parseFloat(split[2]);
	        }
	        var beats = measures * timeSignature + quarters + sixteenths / 4;
	        return beats * this.notationToSeconds('4n');
	    };
	    /**
		 *  Convert seconds to the closest transportTime in the form 
		 *  	measures:quarters:sixteenths
		 *
		 *  @method toTransportTime
		 *  
		 *  @param {Time} seconds 
		 *  @param {number=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {string}  
		 *  
		 *  @lends Tone.prototype.toTransportTime
		 */
	    Tone.prototype.toTransportTime = function (time, bpm, timeSignature) {
	        var seconds = this.toSeconds(time, bpm, timeSignature);
	        bpm = this.defaultArg(bpm, Tone.Transport.bpm.value);
	        timeSignature = this.defaultArg(timeSignature, transportTimeSignature);
	        var quarterTime = this.notationToSeconds('4n');
	        var quarters = seconds / quarterTime;
	        var measures = Math.floor(quarters / timeSignature);
	        var sixteenths = Math.floor(quarters % 1 * 4);
	        quarters = Math.floor(quarters) % timeSignature;
	        var progress = [
	            measures,
	            quarters,
	            sixteenths
	        ];
	        return progress.join(':');
	    };
	    /**
		 *  Convert a frequency representation into a number.
		 *  	
		 *  @param  {Frequency} freq 
		 *  @param {number=} 	now 	if passed in, this number will be 
		 *                        		used for all 'now' relative timings
		 *  @return {number}      the frequency in hertz
		 */
	    Tone.prototype.toFrequency = function (freq, now) {
	        if (this.isFrequency(freq)) {
	            return parseFloat(freq);
	        } else if (this.isNotation(freq) || this.isTransportTime(freq)) {
	            return this.secondsToFrequency(this.toSeconds(freq, now));
	        } else {
	            return freq;
	        }
	    };
	    /**
		 *  Convert Time into seconds.
		 *  
		 *  Unlike the method which it overrides, this takes into account 
		 *  transporttime and musical notation.
		 *
		 *  Time : 1.40
		 *  Notation: 4n|1m|2t
		 *  TransportTime: 2:4:1 (measure:quarters:sixteens)
		 *  Now Relative: +3n
		 *  Math: 3n+16n or even very complicated expressions ((3n*2)/6 + 1)
		 *
		 *  @override
		 *  @param  {Time} time       
		 *  @param {number=} 	now 	if passed in, this number will be 
		 *                        		used for all 'now' relative timings
		 *  @return {number} 
		 */
	    Tone.prototype.toSeconds = function (time, now) {
	        now = this.defaultArg(now, this.now());
	        if (typeof time === 'number') {
	            return time;    //assuming that it's seconds
	        } else if (typeof time === 'string') {
	            var plusTime = 0;
	            if (time.charAt(0) === '+') {
	                plusTime = now;
	                time = time.slice(1);
	            }
	            var components = time.split(/[\(\)\-\+\/\*]/);
	            if (components.length > 1) {
	                var originalTime = time;
	                for (var i = 0; i < components.length; i++) {
	                    var symb = components[i].trim();
	                    if (symb !== '') {
	                        var val = this.toSeconds(symb);
	                        time = time.replace(symb, val);
	                    }
	                }
	                try {
	                    //i know eval is evil, but i think it's safe here
	                    time = eval(time);    // jshint ignore:line
	                } catch (e) {
	                    throw new EvalError('problem evaluating Tone.Type.Time: ' + originalTime);
	                }
	            } else if (this.isNotation(time)) {
	                time = this.notationToSeconds(time);
	            } else if (this.isTransportTime(time)) {
	                time = this.transportTimeToSeconds(time);
	            } else if (this.isFrequency(time)) {
	                time = this.frequencyToSeconds(time);
	            } else {
	                time = parseFloat(time);
	            }
	            return time + plusTime;
	        } else {
	            return now;
	        }
	    };
	    var TransportConstructor = Tone.Transport;
	    Tone._initAudioContext(function () {
	        if (typeof Tone.Transport === 'function') {
	            //a single transport object
	            Tone.Transport = new Tone.Transport();
	        } else {
	            //stop the clock
	            Tone.Transport.stop();
	            //get the previous bpm
	            var bpm = Tone.Transport.bpm.value;
	            //destory the old clock
	            Tone.Transport._clock.dispose();
	            //make new Transport insides
	            TransportConstructor.call(Tone.Transport);
	            //set the bpm
	            Tone.Transport.bpm.value = bpm;
	        }
	    });
	    return Tone.Transport;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  A single master output which is connected to the
		 *          AudioDestinationNode (aka your speakers). 
		 *          It provides useful conveniences such as the ability 
		 *          to set the volume and mute the entire application. 
		 *          It also gives you the ability to apply master effects to your application. 
		 *          <br><br>
		 *          Like Tone.Transport, A single Tone.Master is created
		 *          on initialization and you do not need to explicitly construct one.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @singleton
		 *  @example
		 * //the audio will go from the oscillator to the speakers
		 * oscillator.connect(Tone.Master);
		 * //a convenience for connecting to the master output is also provided:
		 * oscillator.toMaster();
		 * //the above two examples are equivalent.
		 */
	    Tone.Master = function () {
	        Tone.call(this);
	        /**
			 * the unmuted volume
			 * @type {number}
			 * @private
			 */
	        this._unmutedVolume = 1;
	        /**
			 *  if the master is muted
			 *  @type {boolean}
			 *  @private
			 */
	        this._muted = false;
	        /**
			 * The volume of the master output.
			 * @type {Decibels}
			 * @signal
			 */
	        this.volume = new Tone.Signal(this.output.gain, Tone.Type.Decibels);
	        //connections
	        this.input.chain(this.output, this.context.destination);
	    };
	    Tone.extend(Tone.Master);
	    /**
		 *  @type {Object}
		 *  @const
		 */
	    Tone.Master.defaults = {
	        'volume': 0,
	        'mute': false
	    };
	    /**
		 * Mute the output. 
		 * @memberOf Tone.Master#
		 * @type {boolean}
		 * @name mute
		 * @example
		 * //mute the output
		 * Tone.Master.mute = true;
		 */
	    Object.defineProperty(Tone.Master.prototype, 'mute', {
	        get: function () {
	            return this._muted;
	        },
	        set: function (mute) {
	            if (!this._muted && mute) {
	                this._unmutedVolume = this.volume.value;
	                //maybe it should ramp here?
	                this.volume.value = -Infinity;
	            } else if (this._muted && !mute) {
	                this.volume.value = this._unmutedVolume;
	            }
	            this._muted = mute;
	        }
	    });
	    /**
		 *  Add a master effects chain. NOTE: this will disconnect any nodes which were previously 
		 *  chained in the master effects chain. 
		 *  @param {AudioNode|Tone...} args All arguments will be connected in a row
		 *                                  and the Master will be routed through it.
		 *  @return  {Tone.Master}  this
		 *  @example
		 * //some overall compression to keep the levels in check
		 * var masterCompressor = new Tone.Compressor({
		 * 	"threshold" : -6,
		 * 	"ratio" : 3,
		 * 	"attack" : 0.5,
		 * 	"release" : 0.1
		 * });
		 * //give a little boost to the lows
		 * var lowBump = new Tone.Filter(200, "lowshelf");
		 * //route everything through the filter 
		 * //and compressor before going to the speakers
		 * Tone.Master.chain(lowBump, masterCompressor);
		 */
	    Tone.Master.prototype.chain = function () {
	        this.input.disconnect();
	        this.input.chain.apply(this.input, arguments);
	        arguments[arguments.length - 1].connect(this.output);
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	AUGMENT TONE's PROTOTYPE
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  Connect 'this' to the master output. Shorthand for this.connect(Tone.Master)
		 *  @returns {Tone} this
		 *  @example
		 * //connect an oscillator to the master output
		 * var osc = new Tone.Oscillator().toMaster();
		 */
	    Tone.prototype.toMaster = function () {
	        this.connect(Tone.Master);
	        return this;
	    };
	    /**
		 *  Also augment AudioNode's prototype to include toMaster
		 *  as a convenience
		 *  @returns {AudioNode} this
		 */
	    AudioNode.prototype.toMaster = function () {
	        this.connect(Tone.Master);
	        return this;
	    };
	    var MasterConstructor = Tone.Master;
	    /**
		 *  initialize the module and listen for new audio contexts
		 */
	    Tone._initAudioContext(function () {
	        //a single master output
	        if (!Tone.prototype.isUndef(Tone.Master)) {
	            Tone.Master = new MasterConstructor();
	        } else {
	            MasterConstructor.prototype.dispose.call(Tone.Master);
	            MasterConstructor.call(Tone.Master);
	        }
	    });
	    return Tone.Master;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Base class for sources. Sources have start/stop methods
		 *          and the ability to be synced to the 
		 *          start/stop of Tone.Transport.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 */
	    Tone.Source = function (options) {
	        //unlike most ToneNodes, Sources only have an output and no input
	        Tone.call(this, 0, 1);
	        options = this.defaultArg(options, Tone.Source.defaults);
	        /**
			 * Callback is invoked when the source is done playing.
			 * @type {function}
			 * @example
			 * source.onended = function(){
			 * 	console.log("the source is done playing");
			 * }
			 */
	        this.onended = options.onended;
	        /**
			 *  the next time the source is started
			 *  @type {number}
			 *  @private
			 */
	        this._nextStart = Infinity;
	        /**
			 *  the next time the source is stopped
			 *  @type {number}
			 *  @private
			 */
	        this._nextStop = Infinity;
	        /**
			 * The volume of the output in decibels.
			 * @type {Decibels}
			 * @signal
			 * @example
			 * source.volume.value = -6;
			 */
	        this.volume = new Tone.Signal({
	            'param': this.output.gain,
	            'value': options.volume,
	            'units': Tone.Type.Decibels
	        });
	        this._readOnly('volume');
	        /**
			 * 	keeps track of the timeout for chaning the state
			 * 	and calling the onended
			 *  @type {number}
			 *  @private
			 */
	        this._timeout = -1;
	        //make the output explicitly stereo
	        this.output.channelCount = 2;
	        this.output.channelCountMode = 'explicit';
	    };
	    Tone.extend(Tone.Source);
	    /**
		 *  The default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.Source.defaults = {
	        'onended': Tone.noOp,
	        'volume': 0
	    };
	    /**
		 *  Returns the playback state of the source, either "started" or "stopped".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.Source#
		 *  @name state
		 */
	    Object.defineProperty(Tone.Source.prototype, 'state', {
	        get: function () {
	            return this._stateAtTime(this.now());
	        }
	    });
	    /**
		 *  Get the state of the source at the specified time.
		 *  @param  {Time}  time
		 *  @return  {Tone.State} 
		 *  @private
		 */
	    Tone.Source.prototype._stateAtTime = function (time) {
	        time = this.toSeconds(time);
	        if (this._nextStart <= time && this._nextStop > time) {
	            return Tone.State.Started;
	        } else if (this._nextStop <= time) {
	            return Tone.State.Stopped;
	        } else {
	            return Tone.State.Stopped;
	        }
	    };
	    /**
		 *  Start the source at the specified time. If no time is given, 
		 *  start the source now.
		 *  @param  {Time} [time=now] When the source should be started.
		 *  @returns {Tone.Source} this
		 *  @example
		 * source.start("+0.5"); //starts the source 0.5 seconds from now
		 */
	    Tone.Source.prototype.start = function (time) {
	        time = this.toSeconds(time);
	        if (this._stateAtTime(time) !== Tone.State.Started || this.retrigger) {
	            this._nextStart = time;
	            this._nextStop = Infinity;
	            this._start.apply(this, arguments);
	        }
	        return this;
	    };
	    /**
		 *  Stop the source at the specified time. If no time is given, 
		 *  stop the source now.
		 *  @param  {Time} [time=now] When the source should be stopped. 
		 *  @returns {Tone.Source} this
		 *  @example
		 * source.stop(); // stops the source immediately
		 */
	    Tone.Source.prototype.stop = function (time) {
	        var now = this.now();
	        time = this.toSeconds(time, now);
	        if (this._stateAtTime(time) === Tone.State.Started) {
	            this._nextStop = this.toSeconds(time);
	            clearTimeout(this._timeout);
	            var diff = time - now;
	            if (diff > 0) {
	                //add a small buffer before invoking the callback
	                this._timeout = setTimeout(this.onended, diff * 1000 + 20);
	            } else {
	                this.onended();
	            }
	            this._stop.apply(this, arguments);
	        }
	        return this;
	    };
	    /**
		 *  Not ready yet. 
	 	 *  @private
	 	 *  @abstract
		 *  @param  {Time} time 
		 *  @returns {Tone.Source} this
		 */
	    Tone.Source.prototype.pause = function (time) {
	        //if there is no pause, just stop it
	        this.stop(time);
	        return this;
	    };
	    /**
		 *  Sync the source to the Transport so that when the transport
		 *  is started, this source is started and when the transport is stopped
		 *  or paused, so is the source. 
		 *
		 *  @param {Time} [delay=0] Delay time before starting the source after the
		 *                               Transport has started. 
		 *  @returns {Tone.Source} this
		 *  @example
		 * //sync the source to start 1 measure after the transport starts
		 * source.sync("1m");
		 * //start the transport. the source will start 1 measure later. 
		 * Tone.Transport.start();
		 */
	    Tone.Source.prototype.sync = function (delay) {
	        Tone.Transport.syncSource(this, delay);
	        return this;
	    };
	    /**
		 *  Unsync the source to the Transport. See Tone.Source.sync
		 *  @returns {Tone.Source} this
		 */
	    Tone.Source.prototype.unsync = function () {
	        Tone.Transport.unsyncSource(this);
	        return this;
	    };
	    /**
		 *	Clean up.
		 *  @return {Tone.Source} this
		 */
	    Tone.Source.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this.stop();
	        clearTimeout(this._timeout);
	        this.onended = Tone.noOp;
	        this._writable('volume');
	        this.volume.dispose();
	        this.volume = null;
	    };
	    return Tone.Source;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Oscillator supports a number of features including
		 *         phase rotation, multiple oscillator types (see Tone.Oscillator.type), 
		 *         and Transport syncing (see Tone.Oscillator.syncFrequency).
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {Frequency} [frequency] Starting frequency
		 *  @param {string} [type] The oscillator type. Read more about type below.
		 *  @example
		 * //make and start a 440hz sine tone
		 * var osc = new Tone.Oscillator(440, "sine").toMaster().start();
		 */
	    Tone.Oscillator = function () {
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'type'
	        ], Tone.Oscillator.defaults);
	        Tone.Source.call(this, options);
	        /**
			 *  the main oscillator
			 *  @type {OscillatorNode}
			 *  @private
			 */
	        this._oscillator = null;
	        /**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);
	        /**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */
	        this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);
	        /**
			 *  the periodic wave
			 *  @type {PeriodicWave}
			 *  @private
			 */
	        this._wave = null;
	        /**
			 *  the phase of the oscillator
			 *  between 0 - 360
			 *  @type {number}
			 *  @private
			 */
	        this._phase = options.phase;
	        /**
			 *  the type of the oscillator
			 *  @type {string}
			 *  @private
			 */
	        this._type = null;
	        //setup
	        this.type = options.type;
	        this.phase = this._phase;
	        this._readOnly([
	            'frequency',
	            'detune'
	        ]);
	    };
	    Tone.extend(Tone.Oscillator, Tone.Source);
	    /**
		 *  the default parameters
		 *  @type {Object}
		 */
	    Tone.Oscillator.defaults = {
	        'type': 'sine',
	        'frequency': 440,
	        'detune': 0,
	        'phase': 0
	    };
	    /**
		 *  start the oscillator
		 *  @param  {Time} [time=now] 
		 *  @private
		 */
	    Tone.Oscillator.prototype._start = function (time) {
	        //new oscillator with previous values
	        this._oscillator = this.context.createOscillator();
	        this._oscillator.setPeriodicWave(this._wave);
	        //connect the control signal to the oscillator frequency & detune
	        this._oscillator.connect(this.output);
	        this.frequency.connect(this._oscillator.frequency);
	        this.detune.connect(this._oscillator.detune);
	        //start the oscillator
	        this._oscillator.start(this.toSeconds(time));
	    };
	    /**
		 *  stop the oscillator
		 *  @private
		 *  @param  {Time} [time=now] (optional) timing parameter
		 *  @returns {Tone.Oscillator} this
		 */
	    Tone.Oscillator.prototype._stop = function (time) {
	        if (this._oscillator) {
	            this._oscillator.stop(this.toSeconds(time));
	            this._oscillator = null;
	        }
	        return this;
	    };
	    /**
		 *  Sync the signal to the Transport's bpm. Any changes to the transports bpm,
		 *  will also affect the oscillators frequency. 
		 *  @returns {Tone.Oscillator} this
		 *  @example
		 * Tone.Transport.bpm.value = 120;
		 * osc.frequency.value = 440;
		 * //the ration between the bpm and the frequency will be maintained
		 * osc.syncFrequency();
		 * Tone.Transport.bpm.value = 240; 
		 * // the frequency of the oscillator is doubled to 880
		 */
	    Tone.Oscillator.prototype.syncFrequency = function () {
	        Tone.Transport.syncSignal(this.frequency);
	        return this;
	    };
	    /**
		 *  Unsync the oscillator's frequency from the Transport. 
		 *  See Tone.Oscillator.syncFrequency
		 *  @returns {Tone.Oscillator} this
		 */
	    Tone.Oscillator.prototype.unsyncFrequency = function () {
	        Tone.Transport.unsyncSignal(this.frequency);
	        return this;
	    };
	    /**
		 * The type of the oscillator: either sine, square, triangle, or sawtooth. Also capable of
		 * setting the first x number of partials of the oscillator. For example: "sine4" would
		 * set be the first 4 partials of the sine wave and "triangle8" would set the first
		 * 8 partials of the triangle wave.
		 * <br><br> 
		 * Uses PeriodicWave internally even for native types so that it can set the phase. 
		 * PeriodicWave equations are from the 
		 * [Webkit Web Audio implementation](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/modules/webaudio/PeriodicWave.cpp&sq=package:chromium).
		 *  
		 * @memberOf Tone.Oscillator#
		 * @type {string}
		 * @name type
		 * @example
		 * //set it to a square wave
		 * osc.type = "square";
		 * @example
		 * //set the first 6 partials of a sawtooth wave
		 * osc.type = "sawtooth6";
		 */
	    Object.defineProperty(Tone.Oscillator.prototype, 'type', {
	        get: function () {
	            return this._type;
	        },
	        set: function (type) {
	            var originalType = type;
	            var fftSize = 4096;
	            var periodicWaveSize = fftSize / 2;
	            var real = new Float32Array(periodicWaveSize);
	            var imag = new Float32Array(periodicWaveSize);
	            var partialCount = 1;
	            var partial = /(sine|triangle|square|sawtooth)(\d+)$/.exec(type);
	            if (partial) {
	                partialCount = parseInt(partial[2]);
	                type = partial[1];
	                partialCount = Math.max(partialCount, 2);
	                periodicWaveSize = partialCount;
	            }
	            var shift = this._phase;
	            for (var n = 1; n < periodicWaveSize; ++n) {
	                var piFactor = 2 / (n * Math.PI);
	                var b;
	                switch (type) {
	                case 'sine':
	                    b = n <= partialCount ? 1 : 0;
	                    break;
	                case 'square':
	                    b = n & 1 ? 2 * piFactor : 0;
	                    break;
	                case 'sawtooth':
	                    b = piFactor * (n & 1 ? 1 : -1);
	                    break;
	                case 'triangle':
	                    if (n & 1) {
	                        b = 2 * (piFactor * piFactor) * (n - 1 >> 1 & 1 ? -1 : 1);
	                    } else {
	                        b = 0;
	                    }
	                    break;
	                default:
	                    throw new TypeError('invalid oscillator type: ' + type);
	                }
	                if (b !== 0) {
	                    real[n] = -b * Math.sin(shift * n);
	                    imag[n] = b * Math.cos(shift * n);
	                } else {
	                    real[n] = 0;
	                    imag[n] = 0;
	                }
	            }
	            var periodicWave = this.context.createPeriodicWave(real, imag);
	            this._wave = periodicWave;
	            if (this._oscillator !== null) {
	                this._oscillator.setPeriodicWave(this._wave);
	            }
	            this._type = originalType;
	        }
	    });
	    /**
		 * The phase of the oscillator in degrees. 
		 * @memberOf Tone.Oscillator#
		 * @type {Degrees}
		 * @name phase
		 * @example
		 * osc.phase = 180; //flips the phase of the oscillator
		 */
	    Object.defineProperty(Tone.Oscillator.prototype, 'phase', {
	        get: function () {
	            return this._phase * (180 / Math.PI);
	        },
	        set: function (phase) {
	            this._phase = phase * Math.PI / 180;
	            //reset the type
	            this.type = this._type;
	        }
	    });
	    /**
		 *  Dispose and disconnect.
		 *  @return {Tone.Oscillator} this
		 */
	    Tone.Oscillator.prototype.dispose = function () {
	        Tone.Source.prototype.dispose.call(this);
	        if (this._oscillator !== null) {
	            this._oscillator.disconnect();
	            this._oscillator = null;
	        }
	        this._wave = null;
	        this._writable([
	            'frequency',
	            'detune'
	        ]);
	        this.frequency.dispose();
	        this.frequency = null;
	        this.detune.dispose();
	        this.detune = null;
	        return this;
	    };
	    return Tone.Oscillator;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class AudioToGain converts an input in AudioRange [-1,1] to NormalRange [0,1]. 
		 *         See Tone.GainToAudio.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 *  var a2g = new Tone.AudioToGain();
		 */
	    Tone.AudioToGain = function () {
	        /**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
	        this._norm = this.input = this.output = new Tone.WaveShaper(function (x) {
	            return (x + 1) / 2;
	        });
	    };
	    Tone.extend(Tone.AudioToGain, Tone.SignalBase);
	    /**
		 *  clean up
		 *  @returns {Tone.AudioToGain} this
		 */
	    Tone.AudioToGain.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._norm.dispose();
	        this._norm = null;
	        return this;
	    };
	    return Tone.AudioToGain;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  LFO stands for low frequency oscillator. Tone.LFO produces an output signal 
		 *          which can be attached to an AudioParam or Tone.Signal 
		 *          in order to modulate that parameter with an oscillator. The LFO can 
		 *          also be synced to the transport to start/stop and change when the tempo changes.
		 *
		 *  @constructor
		 *  @extends {Tone.Oscillator}
		 *  @param {Frequency|Object} [frequency] The frequency of the oscillation. Typically, LFOs will be
		 *                               in the frequency range of 0.1 to 10 hertz. 
		 *  @param {number=} min The minimum output value of the LFO. The LFO starts 
		 *                      at it's minimum value. 
		 *  @param {number=} max The maximum value of the LFO. 
		 *  @example
		 * var lfo = new Tone.LFO("4n", 400, 4000);
		 * lfo.connect(filter.frequency);
		 */
	    Tone.LFO = function () {
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'min',
	            'max'
	        ], Tone.LFO.defaults);
	        /** 
			 *  The oscillator. 
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
	        this.oscillator = new Tone.Oscillator({
	            'frequency': options.frequency,
	            'type': options.type,
	            'phase': options.phase + 90
	        });
	        /**
			 *  the lfo's frequency
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = this.oscillator.frequency;
	        /**
			 * The amplitude of the LFO, which controls the output range between
			 * the min and max output. For example if the min is -10 and the max 
			 * is 10, setting the amplitude to 0.5 would make the LFO modulate
			 * between -5 and 5. 
			 * @type {Number}
			 * @signal
			 */
	        this.amplitude = this.oscillator.volume;
	        this.amplitude.units = Tone.Type.NormalRange;
	        this.amplitude.value = options.amplitude;
	        /**
			 *  @type {Tone.AudioToGain} 
			 *  @private
			 */
	        this._a2g = new Tone.AudioToGain();
	        /**
			 *  @type {Tone.Scale} 
			 *  @private
			 */
	        this._scaler = this.output = new Tone.Scale(options.min, options.max);
	        /**
			 *  the units of the LFO (used for converting)
			 *  @type {string} 
			 *  @private
			 */
	        this._units = Tone.Type.Default;
	        //connect it up
	        this.oscillator.chain(this._a2g, this._scaler);
	        this._readOnly([
	            'amplitude',
	            'frequency',
	            'oscillator'
	        ]);
	    };
	    Tone.extend(Tone.LFO, Tone.Oscillator);
	    /**
		 *  the default parameters
		 *
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.LFO.defaults = {
	        'type': 'sine',
	        'min': 0,
	        'max': 1,
	        'phase': 0,
	        'frequency': '4n',
	        'amplitude': 1
	    };
	    /**
		 *  Start the LFO. 
		 *  @param  {Time} [time=now] the time the LFO will start
		 *  @returns {Tone.LFO} this
		 */
	    Tone.LFO.prototype.start = function (time) {
	        this.oscillator.start(time);
	        return this;
	    };
	    /**
		 *  Stop the LFO. 
		 *  @param  {Time} [time=now] the time the LFO will stop
		 *  @returns {Tone.LFO} this
		 */
	    Tone.LFO.prototype.stop = function (time) {
	        this.oscillator.stop(time);
	        return this;
	    };
	    /**
		 *  Sync the start/stop/pause to the transport 
		 *  and the frequency to the bpm of the transport
		 *
		 *  @param {Time} [delay=0] the time to delay the start of the
		 *                                LFO from the start of the transport
		 *  @returns {Tone.LFO} this
		 *  @example
		 *  lfo.frequency.value = "8n";
		 *  lfo.sync();
		 *  //the rate of the LFO will always be an eighth note, 
		 *  //even as the tempo changes
		 */
	    Tone.LFO.prototype.sync = function (delay) {
	        this.oscillator.sync(delay);
	        this.oscillator.syncFrequency();
	        return this;
	    };
	    /**
		 *  unsync the LFO from transport control
		 *  @returns {Tone.LFO} this
		 */
	    Tone.LFO.prototype.unsync = function () {
	        this.oscillator.unsync();
	        this.oscillator.unsyncFrequency();
	        return this;
	    };
	    /**
		 * The miniumum output of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {number}
		 * @name min
		 */
	    Object.defineProperty(Tone.LFO.prototype, 'min', {
	        get: function () {
	            return this._toUnits(this._scaler.min);
	        },
	        set: function (min) {
	            min = this._fromUnits(min);
	            this._scaler.min = min;
	        }
	    });
	    /**
		 * The maximum output of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {number}
		 * @name max
		 */
	    Object.defineProperty(Tone.LFO.prototype, 'max', {
	        get: function () {
	            return this._toUnits(this._scaler.max);
	        },
	        set: function (max) {
	            max = this._fromUnits(max);
	            this._scaler.max = max;
	        }
	    });
	    /**
		 * The type of the oscillator: sine, square, sawtooth, triangle. 
		 * @memberOf Tone.LFO#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.LFO.prototype, 'type', {
	        get: function () {
	            return this.oscillator.type;
	        },
	        set: function (type) {
	            this.oscillator.type = type;
	        }
	    });
	    /**
		 * The phase of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {number}
		 * @name phase
		 */
	    Object.defineProperty(Tone.LFO.prototype, 'phase', {
	        get: function () {
	            return this.oscillator.phase - 90;
	        },
	        set: function (phase) {
	            this.oscillator.phase = phase + 90;
	        }
	    });
	    /**
		 * The output units of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {Tone.Type}
		 * @name units
		 */
	    Object.defineProperty(Tone.LFO.prototype, 'units', {
	        get: function () {
	            return this._units;
	        },
	        set: function (val) {
	            var currentMin = this.min;
	            var currentMax = this.max;
	            //convert the min and the max
	            this._units = val;
	            this.min = currentMin;
	            this.max = currentMax;
	        }
	    });
	    /**
		 *  Connect the output of a ToneNode to an AudioParam, AudioNode, or Tone Node. 
		 *  will get the units from the connected node.
		 *  @param  {Tone | AudioParam | AudioNode} node 
		 *  @param {number} [outputNum=0] optionally which output to connect from
		 *  @param {number} [inputNum=0] optionally which input to connect to
		 *  @returns {Tone.LFO} this
		 *  @private
		 */
	    Tone.LFO.prototype.connect = function (node) {
	        if (node.constructor === Tone.Signal) {
	            this.convert = node.convert;
	            this.units = node.units;
	        }
	        Tone.Signal.prototype.connect.apply(this, arguments);
	        return this;
	    };
	    /**
		 *  private method borroed from Signal converts 
		 *  units from their destination value
		 *  @function
		 *  @private
		 */
	    Tone.LFO.prototype._fromUnits = Tone.Signal.prototype._fromUnits;
	    /**
		 *  private method borroed from Signal converts 
		 *  units to their destination value
		 *  @function
		 *  @private
		 */
	    Tone.LFO.prototype._toUnits = Tone.Signal.prototype._toUnits;
	    /**
		 *  disconnect and dispose
		 *  @returns {Tone.LFO} this
		 */
	    Tone.LFO.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable([
	            'amplitude',
	            'frequency',
	            'oscillator'
	        ]);
	        this.oscillator.dispose();
	        this.oscillator = null;
	        this._scaler.dispose();
	        this._scaler = null;
	        this._a2g.dispose();
	        this._a2g = null;
	        this.frequency = null;
	        this.amplitude = null;
	        return this;
	    };
	    return Tone.LFO;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Limiter will limit the loudness of an incoming signal. 
		 *         It is composed of a Tone.Compressor with a fast attack 
		 *         and release. Limiters are commonly used to safeguard against 
		 *         signal clipping. Unlike a compressor, limiters do not provide 
		 *         smooth gain reduction and almost completely prevent 
		 *         additional gain above the threshold.
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {number} threshold The theshold above which the limiting is applied. 
		 *  @example
		 *  var limiter = new Tone.Limiter(-6);
		 */
	    Tone.Limiter = function (threshold) {
	        /**
			 *  the compressor
			 *  @private
			 *  @type {Tone.Compressor}
			 */
	        this._compressor = this.input = this.output = new Tone.Compressor({
	            'attack': 0.001,
	            'decay': 0.001,
	            'threshold': threshold
	        });
	        /**
			 * The threshold of of the limiter
			 * @type {Decibel}
			 * @signal
			 */
	        this.threshold = this._compressor.threshold;
	        this._readOnly('threshold');
	    };
	    Tone.extend(Tone.Limiter);
	    /**
		 *  Clean up.
		 *  @returns {Tone.Limiter} this
		 */
	    Tone.Limiter.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._compressor.dispose();
	        this._compressor = null;
	        this._writable('threshold');
	        this.threshold = null;
	        return this;
	    };
	    return Tone.Limiter;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Lowpass is a lowpass feedback comb filter. It is similar to 
		 *         Tone.FeedbackCombFilter, but includes a lowpass filter.
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {Time|Object} [delayTime] The delay time of the comb filter
		 *  @param {NormalRange=} resonance The resonance (feedback) of the comb filter
		 *  @param {Frequency=} dampening The cutoff of the lowpass filter dampens the
		 *                                signal as it is fedback. 
		 */
	    Tone.LowpassCombFilter = function () {
	        Tone.call(this);
	        var options = this.optionsObject(arguments, [
	            'delayTime',
	            'resonance',
	            'dampening'
	        ], Tone.LowpassCombFilter.defaults);
	        /**
			 *  the delay node
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._delay = this.input = this.context.createDelay(1);
	        /**
			 *  The delayTime of the comb filter. 
			 *  @type {Time}
			 *  @signal
			 */
	        this.delayTime = new Tone.Signal(options.delayTime, Tone.Type.Time);
	        /**
			 *  the lowpass filter
			 *  @type  {BiquadFilterNode}
			 *  @private
			 */
	        this._lowpass = this.output = this.context.createBiquadFilter();
	        this._lowpass.Q.value = 0;
	        this._lowpass.type = 'lowpass';
	        /**
			 *  The dampening control of the feedback
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.dampening = new Tone.Signal(this._lowpass.frequency, Tone.Type.Frequency);
	        this.dampening.value = options.dampening;
	        /**
			 *  the feedback gain
			 *  @type {GainNode}
			 *  @private
			 */
	        this._feedback = this.context.createGain();
	        /**
			 *  The amount of feedback of the delayed signal. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.resonance = new Tone.Signal(options.resonance, Tone.Type.NormalRange);
	        //connections
	        this._delay.chain(this._lowpass, this._feedback, this._delay);
	        this.delayTime.connect(this._delay.delayTime);
	        this.resonance.connect(this._feedback.gain);
	        this.dampening.connect(this._lowpass.frequency);
	        this._readOnly([
	            'dampening',
	            'resonance',
	            'delayTime'
	        ]);
	    };
	    Tone.extend(Tone.LowpassCombFilter);
	    /**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.LowpassCombFilter.defaults = {
	        'delayTime': 0.1,
	        'resonance': 0.5,
	        'dampening': 3000
	    };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.LowpassCombFilter} this
		 */
	    Tone.LowpassCombFilter.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable([
	            'dampening',
	            'resonance',
	            'delayTime'
	        ]);
	        this.dampening.dispose();
	        this.dampening = null;
	        this.resonance.dispose();
	        this.resonance = null;
	        this._delay.disconnect();
	        this._delay = null;
	        this._lowpass.disconnect();
	        this._lowpass = null;
	        this._feedback.disconnect();
	        this._feedback = null;
	        this.delayTime.dispose();
	        this.delayTime = null;
	        return this;
	    };
	    return Tone.LowpassCombFilter;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Merge brings two signals into the left and right 
		 *          channels of a single stereo channel.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @example
		 * var merge = new Tone.Merge().toMaster();
		 * //routing a sine tone in the left channel
		 * //and noise in the right channel
		 * var osc = new Tone.Oscillator().connect(merge.left);
		 * var noise = new Tone.Noise().connect(merge.right);
		 * //starting our oscillators
		 * noise.start();
		 * osc.start();
		 */
	    Tone.Merge = function () {
	        Tone.call(this, 2, 0);
	        /**
			 *  The left input channel.
			 *  Alias for <code>input[0]</code>
			 *  @type {GainNode}
			 */
	        this.left = this.input[0] = this.context.createGain();
	        /**
			 *  The right input channel.
			 *  Alias for <code>input[1]</code>.
			 *  @type {GainNode}
			 */
	        this.right = this.input[1] = this.context.createGain();
	        /**
			 *  the merger node for the two channels
			 *  @type {ChannelMergerNode}
			 *  @private
			 */
	        this._merger = this.output = this.context.createChannelMerger(2);
	        //connections
	        this.left.connect(this._merger, 0, 0);
	        this.right.connect(this._merger, 0, 1);
	    };
	    Tone.extend(Tone.Merge);
	    /**
		 *  Clean up.
		 *  @returns {Tone.Merge} this
		 */
	    Tone.Merge.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this.left.disconnect();
	        this.left = null;
	        this.right.disconnect();
	        this.right = null;
	        this._merger.disconnect();
	        this._merger = null;
	        return this;
	    };
	    return Tone.Merge;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Meter gets the [RMS](https://en.wikipedia.org/wiki/Root_mean_square)
		 *          of an input signal with some averaging applied. 
		 *          It can also get the raw value of the signal or the value in dB. For signal 
		 *          processing, it's better to use Tone.Follower which will produce an audio-rate 
		 *          envelope follower instead of needing to poll the Meter to get the output.
		 *          <br><br>
		 *          Meter was inspired by [Chris Wilsons Volume Meter](https://github.com/cwilso/volume-meter/blob/master/volume-meter.js).
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {number} [channels=1] number of channels being metered
		 *  @param {number} [smoothing=0.8] amount of smoothing applied to the volume
		 *  @param {number} [clipMemory=0.5] number in seconds that a "clip" should be remembered
		 *  @example
		 * var meter = new Tone.Meter();
		 * var mic = new Tone.Microphone().start();
		 * //connect mic to the meter
		 * mic.connect(meter);
		 * //use getLevel or getDb 
		 * //to access meter level
		 * meter.getLevel();
		 */
	    Tone.Meter = function (channels, smoothing, clipMemory) {
	        //extends Unit
	        Tone.call(this);
	        /** 
			 *  The channel count
			 *  @type  {number}
			 *  @private
			 */
	        this._channels = this.defaultArg(channels, 1);
	        /** 
			 *  the smoothing value
			 *  @type  {number}
			 *  @private
			 */
	        this._smoothing = this.defaultArg(smoothing, 0.8);
	        /** 
			 *  the amount of time a clip is remember for. 
			 *  @type  {number}
			 *  @private
			 */
	        this._clipMemory = this.defaultArg(clipMemory, 0.5) * 1000;
	        /** 
			 *  the rms for each of the channels
			 *  @private
			 *  @type {Array}
			 */
	        this._volume = new Array(this._channels);
	        /** 
			 *  the raw values for each of the channels
			 *  @private
			 *  @type {Array}
			 */
	        this._values = new Array(this._channels);
	        //zero out the volume array
	        for (var i = 0; i < this._channels; i++) {
	            this._volume[i] = 0;
	            this._values[i] = 0;
	        }
	        /** 
			 *  last time the values clipped
			 *  @private
			 *  @type {number}
			 */
	        this._lastClip = 0;
	        /** 
			 *  @private
			 *  @type {ScriptProcessorNode}
			 */
	        this._jsNode = this.context.createScriptProcessor(this.bufferSize, this._channels, 1);
	        this._jsNode.onaudioprocess = this._onprocess.bind(this);
	        //so it doesn't get garbage collected
	        this._jsNode.noGC();
	        //signal just passes
	        this.input.connect(this.output);
	        this.input.connect(this._jsNode);
	    };
	    Tone.extend(Tone.Meter);
	    /**
		 *  called on each processing frame
		 *  @private
		 *  @param  {AudioProcessingEvent} event 
		 */
	    Tone.Meter.prototype._onprocess = function (event) {
	        var bufferSize = this._jsNode.bufferSize;
	        var smoothing = this._smoothing;
	        for (var channel = 0; channel < this._channels; channel++) {
	            var input = event.inputBuffer.getChannelData(channel);
	            var sum = 0;
	            var total = 0;
	            var x;
	            var clipped = false;
	            for (var i = 0; i < bufferSize; i++) {
	                x = input[i];
	                if (!clipped && x > 0.95) {
	                    clipped = true;
	                    this._lastClip = Date.now();
	                }
	                total += x;
	                sum += x * x;
	            }
	            var average = total / bufferSize;
	            var rms = Math.sqrt(sum / bufferSize);
	            this._volume[channel] = Math.max(rms, this._volume[channel] * smoothing);
	            this._values[channel] = average;
	        }
	    };
	    /**
		 *  Get the rms of the signal.
		 *  @param  {number} [channel=0] which channel
		 *  @return {number}         the value
		 */
	    Tone.Meter.prototype.getLevel = function (channel) {
	        channel = this.defaultArg(channel, 0);
	        var vol = this._volume[channel];
	        if (vol < 0.00001) {
	            return 0;
	        } else {
	            return vol;
	        }
	    };
	    /**
		 *  Get the raw value of the signal. 
		 *  @param  {number=} channel 
		 *  @return {number}         
		 */
	    Tone.Meter.prototype.getValue = function (channel) {
	        channel = this.defaultArg(channel, 0);
	        return this._values[channel];
	    };
	    /**
		 *  Get the volume of the signal in dB
		 *  @param  {number=} channel 
		 *  @return {Decibels}         
		 */
	    Tone.Meter.prototype.getDb = function (channel) {
	        return this.gainToDb(this.getLevel(channel));
	    };
	    /**
		 * @returns {boolean} if the audio has clipped. The value resets
		 *                       based on the clipMemory defined. 
		 */
	    Tone.Meter.prototype.isClipped = function () {
	        return Date.now() - this._lastClip < this._clipMemory;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.Meter} this
		 */
	    Tone.Meter.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._jsNode.disconnect();
	        this._jsNode.onaudioprocess = null;
	        this._volume = null;
	        this._values = null;
	        return this;
	    };
	    return Tone.Meter;
	});
	Module(function (Tone) {
	    
	    /**
		 *	@class  Tone.Split splits an incoming signal into left and right channels.
		 *	
		 *  @constructor
		 *  @extends {Tone}
		 *  @example
		 * var split = new Tone.Split();
		 * stereoSignal.connect(split);
		 */
	    Tone.Split = function () {
	        Tone.call(this, 0, 2);
	        /** 
			 *  @type {ChannelSplitterNode}
			 *  @private
			 */
	        this._splitter = this.input = this.context.createChannelSplitter(2);
	        /** 
			 *  Left channel output. 
			 *  Alias for <code>output[0]</code>
			 *  @type {GainNode}
			 */
	        this.left = this.output[0] = this.context.createGain();
	        /**
			 *  Right channel output.
			 *  Alias for <code>output[1]</code>
			 *  @type {GainNode}
			 */
	        this.right = this.output[1] = this.context.createGain();
	        //connections
	        this._splitter.connect(this.left, 0, 0);
	        this._splitter.connect(this.right, 1, 0);
	    };
	    Tone.extend(Tone.Split);
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Split} this
		 */
	    Tone.Split.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._splitter.disconnect();
	        this.left.disconnect();
	        this.right.disconnect();
	        this.left = null;
	        this.right = null;
	        this._splitter = null;
	        return this;
	    };
	    return Tone.Split;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Mid/Side processing separates the the 'mid' signal 
		 *         (which comes out of both the left and the right channel) 
		 *         and the 'side' (which only comes out of the the side channels). <br><br>
		 *         <code>
		 *         Mid = (Left+Right)/sqrt(2);   // obtain mid-signal from left and right<br>
		 *         Side = (Left-Right)/sqrt(2);   // obtain side-signal from left and righ<br>
		 *         </code>
		 *
		 *  @extends {Tone}
		 *  @constructor
		 */
	    Tone.MidSideSplit = function () {
	        Tone.call(this, 0, 2);
	        /**
			 *  split the incoming signal into left and right channels
			 *  @type  {Tone.Split}
			 *  @private
			 */
	        this._split = this.input = new Tone.Split();
	        /**
			 *  The mid send. Connect to mid processing. Alias for
			 *  <code>output[0]</code>
			 *  @type {Tone.Expr}
			 */
	        this.mid = this.output[0] = new Tone.Expr('($0 + $1) * $2');
	        /**
			 *  The side output. Connect to side processing. Alias for
			 *  <code>output[1]</code>
			 *  @type {Tone.Expr}
			 */
	        this.side = this.output[1] = new Tone.Expr('($0 - $1) * $2');
	        this._split.connect(this.mid, 0, 0);
	        this._split.connect(this.mid, 1, 1);
	        this._split.connect(this.side, 0, 0);
	        this._split.connect(this.side, 1, 1);
	        sqrtTwo.connect(this.mid, 0, 2);
	        sqrtTwo.connect(this.side, 0, 2);
	    };
	    Tone.extend(Tone.MidSideSplit);
	    /**
		 *  a constant signal equal to 1 / sqrt(2)
		 *  @type {Number}
		 *  @signal
		 *  @private
		 *  @static
		 */
	    var sqrtTwo = null;
	    Tone._initAudioContext(function () {
	        sqrtTwo = new Tone.Signal(1 / Math.sqrt(2));
	    });
	    /**
		 *  clean up
		 *  @returns {Tone.MidSideSplit} this
		 */
	    Tone.MidSideSplit.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this.mid.dispose();
	        this.mid = null;
	        this.side.dispose();
	        this.side = null;
	        this._split.dispose();
	        this._split = null;
	        return this;
	    };
	    return Tone.MidSideSplit;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Mid/Side processing separates the the 'mid' signal 
		 *         (which comes out of both the left and the right channel) 
		 *         and the 'side' (which only comes out of the the side channels). 
		 *         MidSideMerge merges the mid and side signal after they've been seperated
		 *         by Tone.MidSideSplit.<br><br>
		 *         <code>
		 *         Left = (Mid+Side)/sqrt(2);   // obtain left signal from mid and side<br>
		 *         Right = (Mid-Side)/sqrt(2);   // obtain right signal from mid and side<br>
		 *         </code>
		 *
		 *  @extends {Tone.StereoEffect}
		 *  @constructor
		 */
	    Tone.MidSideMerge = function () {
	        Tone.call(this, 2, 0);
	        /**
			 *  The mid signal input. Alias for
			 *  <code>input[0]</code>
			 *  @type  {GainNode}
			 */
	        this.mid = this.input[0] = this.context.createGain();
	        /**
			 *  recombine the mid/side into Left
			 *  @type {Tone.Expr}
			 *  @private
			 */
	        this._left = new Tone.Expr('($0 + $1) * $2');
	        /**
			 *  The side signal input. Alias for
			 *  <code>input[1]</code>
			 *  @type  {GainNode}
			 */
	        this.side = this.input[1] = this.context.createGain();
	        /**
			 *  recombine the mid/side into Right
			 *  @type {Tone.Expr}
			 *  @private
			 */
	        this._right = new Tone.Expr('($0 - $1) * $2');
	        /**
			 *  Merge the left/right signal back into a stereo signal.
			 *  @type {Tone.Merge}
			 *  @private
			 */
	        this._merge = this.output = new Tone.Merge();
	        this.mid.connect(this._left, 0, 0);
	        this.side.connect(this._left, 0, 1);
	        this.mid.connect(this._right, 0, 0);
	        this.side.connect(this._right, 0, 1);
	        this._left.connect(this._merge, 0, 0);
	        this._right.connect(this._merge, 0, 1);
	        sqrtTwo.connect(this._left, 0, 2);
	        sqrtTwo.connect(this._right, 0, 2);
	    };
	    Tone.extend(Tone.MidSideMerge);
	    /**
		 *  A constant signal equal to 1 / sqrt(2).
		 *  @type {Number}
		 *  @signal
		 *  @private
		 *  @static
		 */
	    var sqrtTwo = null;
	    Tone._initAudioContext(function () {
	        sqrtTwo = new Tone.Signal(1 / Math.sqrt(2));
	    });
	    /**
		 *  clean up
		 *  @returns {Tone.MidSideMerge} this
		 */
	    Tone.MidSideMerge.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this.mid.disconnect();
	        this.mid = null;
	        this.side.disconnect();
	        this.side = null;
	        this._left.dispose();
	        this._left = null;
	        this._right.dispose();
	        this._right = null;
	        this._merge.dispose();
	        this._merge = null;
	        return this;
	    };
	    return Tone.MidSideMerge;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.MidSideCompressor applies two different compressors to the mid
		 *         and side signal components. See Tone.MidSideSplit. 
		 *
		 *  @extends {Tone}
		 *  @param {Object} options The options that are passed to the mid and side
		 *                          compressors. 
		 *  @constructor
		 */
	    Tone.MidSideCompressor = function (options) {
	        options = this.defaultArg(options, Tone.MidSideCompressor.defaults);
	        /**
			 *  the mid/side split
			 *  @type  {Tone.MidSideSplit}
			 *  @private
			 */
	        this._midSideSplit = this.input = new Tone.MidSideSplit();
	        /**
			 *  the mid/side recombination
			 *  @type  {Tone.MidSideMerge}
			 *  @private
			 */
	        this._midSideMerge = this.output = new Tone.MidSideMerge();
	        /**
			 *  The compressor applied to the mid signal
			 *  @type  {Tone.Compressor}
			 */
	        this.mid = new Tone.Compressor(options.mid);
	        /**
			 *  The compressor applied to the side signal
			 *  @type  {Tone.Compressor}
			 */
	        this.side = new Tone.Compressor(options.side);
	        this._midSideSplit.mid.chain(this.mid, this._midSideMerge.mid);
	        this._midSideSplit.side.chain(this.side, this._midSideMerge.side);
	        this._readOnly([
	            'mid',
	            'side'
	        ]);
	    };
	    Tone.extend(Tone.MidSideCompressor);
	    /**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
	    Tone.MidSideCompressor.defaults = {
	        'mid': {
	            'ratio': 3,
	            'threshold': -24,
	            'release': 0.03,
	            'attack': 0.02,
	            'knee': 16
	        },
	        'side': {
	            'ratio': 6,
	            'threshold': -30,
	            'release': 0.25,
	            'attack': 0.03,
	            'knee': 10
	        }
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.MidSideCompressor} this
		 */
	    Tone.MidSideCompressor.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable([
	            'mid',
	            'side'
	        ]);
	        this.mid.dispose();
	        this.mid = null;
	        this.side.dispose();
	        this.side = null;
	        this._midSideSplit.dispose();
	        this._midSideSplit = null;
	        this._midSideMerge.dispose();
	        this._midSideMerge = null;
	        return this;
	    };
	    return Tone.MidSideCompressor;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Mono coerces the incoming mono or stereo signal into a mono signal
		 *         where both left and right channels have the same value. This can be useful 
		 *         for [stereo imaging](https://en.wikipedia.org/wiki/Stereo_imaging).
		 *
		 *  @extends {Tone}
		 *  @constructor
		 */
	    Tone.Mono = function () {
	        Tone.call(this, 1, 0);
	        /**
			 *  merge the signal
			 *  @type {Tone.Merge}
			 *  @private
			 */
	        this._merge = this.output = new Tone.Merge();
	        this.input.connect(this._merge, 0, 0);
	        this.input.connect(this._merge, 0, 1);
	        this.input.gain.value = this.dbToGain(-10);
	    };
	    Tone.extend(Tone.Mono);
	    /**
		 *  clean up
		 *  @returns {Tone.Mono} this
		 */
	    Tone.Mono.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._merge.dispose();
	        this._merge = null;
	        return this;
	    };
	    return Tone.Mono;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class A compressor with seperate controls over low/mid/high dynamics
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {Object} options The low/mid/high compressor settings.
		 *  @example
		 *  var multiband = new Tone.MultibandCompressor({
		 *  	"lowFrequency" : 200,
		 *  	"highFrequency" : 1300
		 *  	"low" : {
		 *  		"threshold" : -12
		 *  	}
		 *  })
		 */
	    Tone.MultibandCompressor = function (options) {
	        options = this.defaultArg(arguments, Tone.MultibandCompressor.defaults);
	        /**
			 *  split the incoming signal into high/mid/low
			 *  @type {Tone.MultibandSplit}
			 *  @private
			 */
	        this._splitter = this.input = new Tone.MultibandSplit({
	            'lowFrequency': options.lowFrequency,
	            'highFrequency': options.highFrequency
	        });
	        /**
			 *  low/mid crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.lowFrequency = this._splitter.lowFrequency;
	        /**
			 *  mid/high crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.highFrequency = this._splitter.highFrequency;
	        /**
			 *  the output
			 *  @type {GainNode}
			 *  @private
			 */
	        this.output = this.context.createGain();
	        /**
			 *  The compressor applied to the low frequencies.
			 *  @type {Tone.Compressor}
			 */
	        this.low = new Tone.Compressor(options.low);
	        /**
			 *  The compressor applied to the mid frequencies.
			 *  @type {Tone.Compressor}
			 */
	        this.mid = new Tone.Compressor(options.mid);
	        /**
			 *  The compressor applied to the high frequencies.
			 *  @type {Tone.Compressor}
			 */
	        this.high = new Tone.Compressor(options.high);
	        //connect the compressor
	        this._splitter.low.chain(this.low, this.output);
	        this._splitter.mid.chain(this.mid, this.output);
	        this._splitter.high.chain(this.high, this.output);
	        this._readOnly([
	            'high',
	            'mid',
	            'low',
	            'highFrequency',
	            'lowFrequency'
	        ]);
	    };
	    Tone.extend(Tone.MultibandCompressor);
	    /**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
	    Tone.MultibandCompressor.defaults = {
	        'low': Tone.Compressor.defaults,
	        'mid': Tone.Compressor.defaults,
	        'high': Tone.Compressor.defaults,
	        'lowFrequency': 250,
	        'highFrequency': 2000
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.MultibandCompressor} this
		 */
	    Tone.MultibandCompressor.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._splitter.dispose();
	        this._writable([
	            'high',
	            'mid',
	            'low',
	            'highFrequency',
	            'lowFrequency'
	        ]);
	        this.low.dispose();
	        this.mid.dispose();
	        this.high.dispose();
	        this._splitter = null;
	        this.low = null;
	        this.mid = null;
	        this.high = null;
	        this.lowFrequency = null;
	        this.highFrequency = null;
	        return this;
	    };
	    return Tone.MultibandCompressor;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Maps a NormalRange [0, 1] to an AudioRange [-1, 1]. 
		 *         See also Tone.AudioToGain. 
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 * var g2a = new Tone.GainToAudio();
		 */
	    Tone.GainToAudio = function () {
	        /**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
	        this._norm = this.input = this.output = new Tone.WaveShaper(function (x) {
	            return Math.abs(x) * 2 - 1;
	        });
	    };
	    Tone.extend(Tone.GainToAudio, Tone.SignalBase);
	    /**
		 *  clean up
		 *  @returns {Tone.GainToAudio} this
		 */
	    Tone.GainToAudio.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._norm.dispose();
	        this._norm = null;
	        return this;
	    };
	    return Tone.GainToAudio;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Panner is an equal power Left/Right Panner and does not
		 *  support 3D. Panner uses the StereoPannerNode when available. 
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {NormalRange} [initialPan=0.5] The initail panner value (defaults to 0.5 = center)
		 *  @example
		 *  //pan the input signal hard right. 
		 *  var panner = new Tone.Panner(1);
		 */
	    Tone.Panner = function (initialPan) {
	        Tone.call(this);
	        /**
			 *  indicates if the panner is using the new StereoPannerNode internally
			 *  @type  {boolean}
			 *  @private
			 */
	        this._hasStereoPanner = this.isFunction(this.context.createStereoPanner);
	        if (this._hasStereoPanner) {
	            /**
				 *  the panner node
				 *  @type {StereoPannerNode}
				 *  @private
				 */
	            this._panner = this.input = this.output = this.context.createStereoPanner();
	            /**
				 *  The pan control. 0 = hard left, 1 = hard right. 
				 *  @type {NormalRange}
				 *  @signal
				 */
	            this.pan = new Tone.Signal(0, Tone.Type.NormalRange);
	            /**
				 *  scale the pan signal to between -1 and 1
				 *  @type {Tone.WaveShaper}
				 *  @private
				 */
	            this._scalePan = new Tone.GainToAudio();
	            //connections
	            this.pan.chain(this._scalePan, this._panner.pan);
	        } else {
	            /**
				 *  the dry/wet knob
				 *  @type {Tone.CrossFade}
				 *  @private
				 */
	            this._crossFade = new Tone.CrossFade();
	            /**
				 *  @type {Tone.Merge}
				 *  @private
				 */
	            this._merger = this.output = new Tone.Merge();
	            /**
				 *  @type {Tone.Split}
				 *  @private
				 */
	            this._splitter = this.input = new Tone.Split();
	            /**
				 *  The pan control. 0 = hard left, 1 = hard right. 
				 *  @type {NormalRange}
				 *  @signal
				 */
	            this.pan = this._crossFade.fade;
	            //CONNECTIONS:
	            //left channel is a, right channel is b
	            this._splitter.connect(this._crossFade, 0, 0);
	            this._splitter.connect(this._crossFade, 1, 1);
	            //merge it back together
	            this._crossFade.a.connect(this._merger, 0, 0);
	            this._crossFade.b.connect(this._merger, 0, 1);
	        }
	        //initial value
	        this.pan.value = this.defaultArg(initialPan, 0.5);
	        this._readOnly('pan');
	    };
	    Tone.extend(Tone.Panner);
	    /**
		 *  Clean up.
		 *  @returns {Tone.Panner} this
		 */
	    Tone.Panner.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable('pan');
	        if (this._hasStereoPanner) {
	            this._panner.disconnect();
	            this._panner = null;
	            this.pan.dispose();
	            this.pan = null;
	            this._scalePan.dispose();
	            this._scalePan = null;
	        } else {
	            this._crossFade.dispose();
	            this._crossFade = null;
	            this._splitter.dispose();
	            this._splitter = null;
	            this._merger.dispose();
	            this._merger = null;
	            this.pan = null;
	        }
	        return this;
	    };
	    return Tone.Panner;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Volume is a simple volume node, useful for creating a volume fader. 
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {Decibels} [volume=0] the initial volume
		 *  @example
		 * var vol = new Tone.Volume(-12);
		 * instrument.chain(vol, Tone.Master);
		 */
	    Tone.Volume = function (volume) {
	        /**
			 * the output node
			 * @type {GainNode}
			 * @private
			 */
	        this.output = this.input = this.context.createGain();
	        /**
			 *  The volume control in decibels. 
			 *  @type {Decibels}
			 *  @signal
			 */
	        this.volume = new Tone.Signal(this.output.gain, Tone.Type.Decibels);
	        this.volume.value = this.defaultArg(volume, 0);
	        this._readOnly('volume');
	    };
	    Tone.extend(Tone.Volume);
	    /**
		 *  clean up
		 *  @returns {Tone.Volume} this
		 */
	    Tone.Volume.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable('volume');
	        this.volume.dispose();
	        this.volume = null;
	        return this;
	    };
	    return Tone.Volume;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.PanVol is a Tone.Panner and Tone.Volume in one.
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {NormalRange} pan the initial pan
		 *  @param {number} volume The output volume. 
		 *  @example
		 * //pan the incoming signal left and drop the volume
		 * var panVol = new Tone.PanVol(0.25, -12);
		 */
	    Tone.PanVol = function (pan, volume) {
	        /**
			 *  The panning node
			 *  @type {Tone.Panner}
			 *  @private
			 */
	        this._panner = this.input = new Tone.Panner(pan);
	        /**
			 *  The L/R panning control.
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.pan = this._panner.pan;
	        /**
			 * The volume object. 
			 * @type {Tone.Volume}
			 * @signal
			 * @private
			 */
	        this._volume = this.output = new Tone.Volume(volume);
	        /**
			 *  The volume control in decibels. 
			 *  @type {Decibels}
			 *  @signal
			 */
	        this.volume = this._volume.volume;
	        //connections
	        this._panner.connect(this._volume);
	        this._readOnly([
	            'pan',
	            'volume'
	        ]);
	    };
	    Tone.extend(Tone.PanVol);
	    /**
		 *  clean up
		 *  @returns {Tone.PanVol} this
		 */
	    Tone.PanVol.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable([
	            'pan',
	            'volume'
	        ]);
	        this._panner.dispose();
	        this._panner = null;
	        this._volume.dispose();
	        this._volume = null;
	        this.pan = null;
	        this.volume = null;
	        return this;
	    };
	    return Tone.PanVol;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.ScaledEnvelop is an envelope which can be scaled 
		 *         to any range. It's useful for applying an envelope 
		 *         to a frequency or any other non-NormalRange signal 
		 *         parameter. 
		 *
		 *  @extends {Tone.Envelope}
		 *  @constructor
		 *  @param {Time|Object} [attack]	the attack time in seconds
		 *  @param {Time} [decay]	the decay time in seconds
		 *  @param {number} [sustain] 	a percentage (0-1) of the full amplitude
		 *  @param {Time} [release]	the release time in seconds
		 *  @example
		 *  var scaledEnv = new Tone.ScaledEnvelope({
		 *  	"attack" : 0.2,
		 *  	"min" : 200,
		 *  	"max" : 2000
		 *  });
		 *  scaledEnv.connect(oscillator.frequency);
		 */
	    Tone.ScaledEnvelope = function () {
	        //get all of the defaults
	        var options = this.optionsObject(arguments, [
	            'attack',
	            'decay',
	            'sustain',
	            'release'
	        ], Tone.Envelope.defaults);
	        Tone.Envelope.call(this, options);
	        options = this.defaultArg(options, Tone.ScaledEnvelope.defaults);
	        /** 
			 *  scale the incoming signal by an exponent
			 *  @type {Tone.Pow}
			 *  @private
			 */
	        this._exp = this.output = new Tone.Pow(options.exponent);
	        /**
			 *  scale the signal to the desired range
			 *  @type {Tone.Multiply}
			 *  @private
			 */
	        this._scale = this.output = new Tone.Scale(options.min, options.max);
	        this._sig.chain(this._exp, this._scale);
	    };
	    Tone.extend(Tone.ScaledEnvelope, Tone.Envelope);
	    /**
		 *  the default parameters
		 *  @static
		 */
	    Tone.ScaledEnvelope.defaults = {
	        'min': 0,
	        'max': 1,
	        'exponent': 1
	    };
	    /**
		 * The envelope's min output value. This is the value which it
		 * starts at. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name min
		 */
	    Object.defineProperty(Tone.ScaledEnvelope.prototype, 'min', {
	        get: function () {
	            return this._scale.min;
	        },
	        set: function (min) {
	            this._scale.min = min;
	        }
	    });
	    /**
		 * The envelope's max output value. In other words, the value
		 * at the peak of the attack portion of the envelope. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name max
		 */
	    Object.defineProperty(Tone.ScaledEnvelope.prototype, 'max', {
	        get: function () {
	            return this._scale.max;
	        },
	        set: function (max) {
	            this._scale.max = max;
	        }
	    });
	    /**
		 * The envelope's exponent value. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name exponent
		 */
	    Object.defineProperty(Tone.ScaledEnvelope.prototype, 'exponent', {
	        get: function () {
	            return this._exp.value;
	        },
	        set: function (exp) {
	            this._exp.value = exp;
	        }
	    });
	    /**
		 *  clean up
		 *  @returns {Tone.ScaledEnvelope} this
		 */
	    Tone.ScaledEnvelope.prototype.dispose = function () {
	        Tone.Envelope.prototype.dispose.call(this);
	        this._scale.dispose();
	        this._scale = null;
	        this._exp.dispose();
	        this._exp = null;
	        return this;
	    };
	    return Tone.ScaledEnvelope;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Buffer loading and storage. Tone.Buffer is used internally by all 
		 *          classes that make requests for audio files such as Tone.Player,
		 *          Tone.Sampler and Tone.Convolver.
		 *          <br><br>
		 *          Aside from load callbacks from individual buffers, Tone.Buffer 
		 *  		provides static methods which keep track of the loading progress 
		 *  		of all of the buffers. These methods are Tone.Buffer.onload, Tone.Buffer.onprogress,
		 *  		and Tone.Buffer.onerror. 
		 *
		 *  @constructor 
		 *  @extends {Tone}
		 *  @param {AudioBuffer|string} url The url to load, or the audio buffer to set. 
		 *  @param {function=} onload A callback which is invoked after the buffer is loaded. 
		 *                            It's recommended to use Tone.Buffer.onload instead 
		 *                            since it will give you a callback when ALL buffers are loaded.
		 *  @example
		 * var buffer = new Tone.Buffer("path/to/sound.mp3", function(){
		 * 	//the buffer is now available.
		 * 	var buff = buffer.get();
		 * });
		 */
	    Tone.Buffer = function () {
	        var options = this.optionsObject(arguments, [
	            'url',
	            'onload'
	        ], Tone.Buffer.defaults);
	        /**
			 *  stores the loaded AudioBuffer
			 *  @type {AudioBuffer}
			 *  @private
			 */
	        this._buffer = null;
	        /**
			 *  indicates if the buffer should be reversed or not
			 *  @type {boolean}
			 *  @private
			 */
	        this._reversed = options.reverse;
	        /**
			 *  The url of the buffer. <code>undefined</code> if it was 
			 *  constructed with a buffer
			 *  @type {string}
			 *  @readOnly
			 */
	        this.url = undefined;
	        /**
			 *  Indicates if the buffer is loaded or not. 
			 *  @type {boolean}
			 *  @readOnly
			 */
	        this.loaded = false;
	        /**
			 *  The callback to invoke when everything is loaded. 
			 *  @type {function}
			 */
	        this.onload = options.onload.bind(this, this);
	        if (options.url instanceof AudioBuffer) {
	            this._buffer.set(options.url);
	            this.onload(this);
	        } else if (typeof options.url === 'string') {
	            this.url = options.url;
	            Tone.Buffer._addToQueue(options.url, this);
	        }
	    };
	    Tone.extend(Tone.Buffer);
	    /**
		 *  the default parameters
		 *  @type {Object}
		 */
	    Tone.Buffer.defaults = {
	        'url': undefined,
	        'onload': Tone.noOp,
	        'reverse': false
	    };
	    /**
		 *  Pass in an AudioBuffer or Tone.Buffer to set the value
		 *  of this buffer.
		 *  @param {AudioBuffer|Tone.Buffer} buffer the buffer
		 *  @returns {Tone.Buffer} this
		 */
	    Tone.Buffer.prototype.set = function (buffer) {
	        if (buffer instanceof Tone.Buffer) {
	            this._buffer = buffer.get();
	        } else {
	            this._buffer = buffer;
	        }
	        this.loaded = true;
	        return this;
	    };
	    /**
		 *  @return {AudioBuffer} The audio buffer stored in the object.
		 */
	    Tone.Buffer.prototype.get = function () {
	        return this._buffer;
	    };
	    /**
		 *  Load url into the buffer. 
		 *  @param {String} url The url to load
		 *  @param {Function=} callback The callback to invoke on load. 
		 *                              don't need to set if `onload` is
		 *                              already set.
		 *  @returns {Tone.Buffer} this
		 */
	    Tone.Buffer.prototype.load = function (url, callback) {
	        this.url = url;
	        this.onload = this.defaultArg(callback, this.onload);
	        Tone.Buffer._addToQueue(url, this);
	        return this;
	    };
	    /**
		 *  dispose and disconnect
		 *  @returns {Tone.Buffer} this
		 */
	    Tone.Buffer.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        Tone.Buffer._removeFromQueue(this);
	        this._buffer = null;
	        this.onload = Tone.Buffer.defaults.onload;
	        return this;
	    };
	    /**
		 * The duration of the buffer. 
		 * @memberOf Tone.Buffer#
		 * @type {number}
		 * @name duration
		 * @readOnly
		 */
	    Object.defineProperty(Tone.Buffer.prototype, 'duration', {
	        get: function () {
	            if (this._buffer) {
	                return this._buffer.duration;
	            } else {
	                return 0;
	            }
	        }
	    });
	    /**
		 *  Reverse the buffer.
		 *  @private
		 *  @return {Tone.Buffer} this
		 */
	    Tone.Buffer.prototype._reverse = function () {
	        if (this.loaded) {
	            for (var i = 0; i < this._buffer.numberOfChannels; i++) {
	                Array.prototype.reverse.call(this._buffer.getChannelData(i));
	            }
	        }
	        return this;
	    };
	    /**
		 * Reverse the buffer.
		 * @memberOf Tone.Buffer#
		 * @type {boolean}
		 * @name reverse
		 */
	    Object.defineProperty(Tone.Buffer.prototype, 'reverse', {
	        get: function () {
	            return this._reversed;
	        },
	        set: function (rev) {
	            if (this._reversed !== rev) {
	                this._reversed = rev;
	                this._reverse();
	            }
	        }
	    });
	    ///////////////////////////////////////////////////////////////////////////
	    // STATIC METHODS
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *  the static queue for all of the xhr requests
		 *  @type {Array}
		 *  @private
		 */
	    Tone.Buffer._queue = [];
	    /**
		 *  the array of current downloads
		 *  @type {Array}
		 *  @private
		 */
	    Tone.Buffer._currentDownloads = [];
	    /**
		 *  the total number of downloads
		 *  @type {number}
		 *  @private
		 */
	    Tone.Buffer._totalDownloads = 0;
	    /**
		 *  the maximum number of simultaneous downloads
		 *  @static
		 *  @type {number}
		 */
	    Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS = 6;
	    /**
		 *  Adds a file to be loaded to the loading queue
		 *  @param   {string}   url      the url to load
		 *  @param   {function} callback the callback to invoke once it's loaded
		 *  @private
		 */
	    Tone.Buffer._addToQueue = function (url, buffer) {
	        Tone.Buffer._queue.push({
	            url: url,
	            Buffer: buffer,
	            progress: 0,
	            xhr: null
	        });
	        this._totalDownloads++;
	        Tone.Buffer._next();
	    };
	    /**
		 *  Remove an object from the queue's (if it's still there)
		 *  Abort the XHR if it's in progress
		 *  @param {Tone.Buffer} buffer the buffer to remove
		 *  @private
		 */
	    Tone.Buffer._removeFromQueue = function (buffer) {
	        var i;
	        for (i = 0; i < Tone.Buffer._queue.length; i++) {
	            var q = Tone.Buffer._queue[i];
	            if (q.Buffer === buffer) {
	                Tone.Buffer._queue.splice(i, 1);
	            }
	        }
	        for (i = 0; i < Tone.Buffer._currentDownloads.length; i++) {
	            var dl = Tone.Buffer._currentDownloads[i];
	            if (dl.Buffer === buffer) {
	                Tone.Buffer._currentDownloads.splice(i, 1);
	                dl.xhr.abort();
	                dl.xhr.onprogress = null;
	                dl.xhr.onload = null;
	                dl.xhr.onerror = null;
	            }
	        }
	    };
	    /**
		 *  load the next buffer in the queue
		 *  @private
		 */
	    Tone.Buffer._next = function () {
	        if (Tone.Buffer._queue.length > 0) {
	            if (Tone.Buffer._currentDownloads.length < Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS) {
	                var next = Tone.Buffer._queue.shift();
	                Tone.Buffer._currentDownloads.push(next);
	                next.xhr = Tone.Buffer.load(next.url, function (buffer) {
	                    //remove this one from the queue
	                    var index = Tone.Buffer._currentDownloads.indexOf(next);
	                    Tone.Buffer._currentDownloads.splice(index, 1);
	                    next.Buffer.set(buffer);
	                    if (next.Buffer._reversed) {
	                        next.Buffer._reverse();
	                    }
	                    next.Buffer.onload(next.Buffer);
	                    Tone.Buffer._onprogress();
	                    Tone.Buffer._next();
	                });
	                next.xhr.onprogress = function (event) {
	                    next.progress = event.loaded / event.total;
	                    Tone.Buffer._onprogress();
	                };
	                next.xhr.onerror = Tone.Buffer.onerror;
	            }
	        } else if (Tone.Buffer._currentDownloads.length === 0) {
	            Tone.Buffer.onload();
	            //reset the downloads
	            Tone.Buffer._totalDownloads = 0;
	        }
	    };
	    /**
		 *  internal progress event handler
		 *  @private
		 */
	    Tone.Buffer._onprogress = function () {
	        var curretDownloadsProgress = 0;
	        var currentDLLen = Tone.Buffer._currentDownloads.length;
	        var inprogress = 0;
	        if (currentDLLen > 0) {
	            for (var i = 0; i < currentDLLen; i++) {
	                var dl = Tone.Buffer._currentDownloads[i];
	                curretDownloadsProgress += dl.progress;
	            }
	            inprogress = curretDownloadsProgress;
	        }
	        var currentDownloadProgress = currentDLLen - inprogress;
	        var completed = Tone.Buffer._totalDownloads - Tone.Buffer._queue.length - currentDownloadProgress;
	        Tone.Buffer.onprogress(completed / Tone.Buffer._totalDownloads);
	    };
	    /**
		 *  Makes an xhr reqest for the selected url then decodes
		 *  the file as an audio buffer. Invokes
		 *  the callback once the audio buffer loads.
		 *  @param {string} url The url of the buffer to load.
		 *                      filetype support depends on the
		 *                      browser.
		 *  @param {function} callback The function to invoke when the url is loaded. 
		 *  @returns {XMLHttpRequest} returns the XHR
		 */
	    Tone.Buffer.load = function (url, callback) {
	        var request = new XMLHttpRequest();
	        request.open('GET', url, true);
	        request.responseType = 'arraybuffer';
	        // decode asynchronously
	        request.onload = function () {
	            Tone.context.decodeAudioData(request.response, function (buff) {
	                if (!buff) {
	                    throw new Error('could not decode audio data:' + url);
	                }
	                callback(buff);
	            });
	        };
	        //send the request
	        request.send();
	        return request;
	    };
	    /**
		 *  Callback when all of the buffers in the queue have loaded
		 *  @static
		 *  @function
		 *  @example
		 * //invoked when all of the queued samples are done loading
		 * Tone.Buffer.onload = function(){
		 * 	console.log("everything is loaded");
		 * };
		 */
	    Tone.Buffer.onload = Tone.noOp;
	    /**
		 *  Callback function is invoked with the progress of all of the loads in the queue. 
		 *  The value passed to the callback is between 0-1.
		 *  @static
		 *  @param {Number} percent The progress between 0 and 1. 
		 *  @function
		 *  @example
		 * Tone.Buffer.onprogress = function(percent){
		 * 	console.log("progress:" + (percent * 100).toFixed(1) + "%");
		 * };
		 */
	    Tone.Buffer.onprogress = Tone.noOp;
	    /**
		 *  Callback if one of the buffers in the queue encounters an error. The error
		 *  is passed in as the argument. 
		 *  @static
		 *  @param {Error} err
		 *  @function
		 *  @example
		 * Tone.Buffer.onerror = function(e){
		 * 	console.log("there was an error while loading the buffers: "+e);
		 * }
		 */
	    Tone.Buffer.onerror = Tone.noOp;
	    return Tone.Buffer;
	});
	Module(function (Tone) {
	    
	    /**
		 *  buses are another way of routing audio
		 *
		 *  augments Tone.prototype to include send and recieve
		 */
	    /**
		  *  All of the routes
		  *  
		  *  @type {Object}
		  *  @static
		  *  @private
		  */
	    var Buses = {};
	    /**
		 *  Send this signal to the channel name. 
		 *  @param  {string} channelName A named channel to send the signal to.
		 *  @param  {Decibels} amount The amount of the source to send to the bus. 
		 *  @return {GainNode} The gain node which connects this node to the desired channel. 
		 *                     Can be used to adjust the levels of the send.
		 *  @example
		 * source.send("reverb", -12);
		 */
	    Tone.prototype.send = function (channelName, amount) {
	        if (!Buses.hasOwnProperty(channelName)) {
	            Buses[channelName] = this.context.createGain();
	        }
	        var sendKnob = this.context.createGain();
	        sendKnob.gain.value = this.dbToGain(this.defaultArg(amount, 1));
	        this.output.chain(sendKnob, Buses[channelName]);
	        return sendKnob;
	    };
	    /**
		 *  Recieve the input from the desired channelName to the input
		 *
		 *  @param  {string} channelName A named channel to send the signal to.
		 *  @param {AudioNode} [input] If no input is selected, the
		 *                                         input of the current node is
		 *                                         chosen. 
		 *  @returns {Tone} this
		 *  @example
		 * reverbEffect.receive("reverb");
		 */
	    Tone.prototype.receive = function (channelName, input) {
	        if (!Buses.hasOwnProperty(channelName)) {
	            Buses[channelName] = this.context.createGain();
	        }
	        if (this.isUndef(input)) {
	            input = this.input;
	        }
	        Buses[channelName].connect(input);
	        return this;
	    };
	    return Tone;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  A timed note. Creating a note will register a callback 
		 *          which will be invoked on the channel at the time with
		 *          whatever value was specified. 
		 *
		 *  @constructor
		 *  @param {number|string} channel the channel name of the note
		 *  @param {Time} time the time when the note will occur
		 *  @param {string|number|Object|Array} value the value of the note
		 */
	    Tone.Note = function (channel, time, value) {
	        /**
			 *  the value of the note. This value is returned
			 *  when the channel callback is invoked.
			 *  
			 *  @type {string|number|Object}
			 */
	        this.value = value;
	        /**
			 *  the channel name or number
			 *  
			 *  @type {string|number}
			 *  @private
			 */
	        this._channel = channel;
	        /**
			 *  an internal reference to the id of the timeline
			 *  callback which is set. 
			 *  
			 *  @type {number}
			 *  @private
			 */
	        this._timelineID = Tone.Transport.setTimeline(this._trigger.bind(this), time);
	    };
	    /**
		 *  invoked by the timeline
		 *  @private
		 *  @param {number} time the time at which the note should play
		 */
	    Tone.Note.prototype._trigger = function (time) {
	        //invoke the callback
	        channelCallbacks(this._channel, time, this.value);
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.Note} this
		 */
	    Tone.Note.prototype.dispose = function () {
	        Tone.Tranport.clearTimeline(this._timelineID);
	        this.value = null;
	        return this;
	    };
	    /**
		 *  @private
		 *  @static
		 *  @type {Object}
		 */
	    var NoteChannels = {};
	    /**
		 *  invoke all of the callbacks on a specific channel
		 *  @private
		 */
	    function channelCallbacks(channel, time, value) {
	        if (NoteChannels.hasOwnProperty(channel)) {
	            var callbacks = NoteChannels[channel];
	            for (var i = 0, len = callbacks.length; i < len; i++) {
	                var callback = callbacks[i];
	                if (Array.isArray(value)) {
	                    callback.apply(window, [time].concat(value));
	                } else {
	                    callback(time, value);
	                }
	            }
	        }
	    }
	    /**
		 *  listen to a specific channel, get all of the note callbacks
		 *  @static
		 *  @param {string|number} channel the channel to route note events from
		 *  @param {function(*)} callback callback to be invoked when a note will occur
		 *                                        on the specified channel
		 */
	    Tone.Note.route = function (channel, callback) {
	        if (NoteChannels.hasOwnProperty(channel)) {
	            NoteChannels[channel].push(callback);
	        } else {
	            NoteChannels[channel] = [callback];
	        }
	    };
	    /**
		 *  Remove a previously routed callback from a channel. 
		 *  @static
		 *  @param {string|number} channel The channel to unroute note events from
		 *  @param {function(*)} callback Callback which was registered to the channel.
		 */
	    Tone.Note.unroute = function (channel, callback) {
	        if (NoteChannels.hasOwnProperty(channel)) {
	            var channelCallback = NoteChannels[channel];
	            var index = channelCallback.indexOf(callback);
	            if (index !== -1) {
	                NoteChannels[channel].splice(index, 1);
	            }
	        }
	    };
	    /**
		 *  Parses a score and registers all of the notes along the timeline. 
		 *  <br><br>
		 *  Scores are a JSON object with instruments at the top level
		 *  and an array of time and values. The value of a note can be 0 or more 
		 *  parameters. 
		 *  <br><br>
		 *  The only requirement for the score format is that the time is the first (or only)
		 *  value in the array. All other values are optional and will be passed into the callback
		 *  function registered using `Note.route(channelName, callback)`.
		 *  <br><br>
		 *  To convert MIDI files to score notation, take a look at utils/MidiToScore.js
		 *
		 *  @example
		 * //an example JSON score which sets up events on channels
		 * var score = { 
		 * 	"synth"  : [["0", "C3"], ["0:1", "D3"], ["0:2", "E3"], ... ],
		 * 	"bass"  : [["0", "C2"], ["1:0", "A2"], ["2:0", "C2"], ["3:0", "A2"], ... ],
		 * 	"kick"  : ["0", "0:2", "1:0", "1:2", "2:0", ... ],
		 * 	//...
		 * };
		 * //parse the score into Notes
		 * Tone.Note.parseScore(score);
		 * //route all notes on the "synth" channel
		 * Tone.Note.route("synth", function(time, note){
		 * 	//trigger synth
		 * });
		 *  @static
		 *  @param {Object} score
		 *  @return {Array} an array of all of the notes that were created
		 */
	    Tone.Note.parseScore = function (score) {
	        var notes = [];
	        for (var inst in score) {
	            var part = score[inst];
	            if (inst === 'tempo') {
	                Tone.Transport.bpm.value = part;
	            } else if (inst === 'timeSignature') {
	                Tone.Transport.timeSignature = part[0] / (part[1] / 4);
	            } else if (Array.isArray(part)) {
	                for (var i = 0; i < part.length; i++) {
	                    var noteDescription = part[i];
	                    var note;
	                    if (Array.isArray(noteDescription)) {
	                        var time = noteDescription[0];
	                        var value = noteDescription.slice(1);
	                        note = new Tone.Note(inst, time, value);
	                    } else {
	                        note = new Tone.Note(inst, noteDescription);
	                    }
	                    notes.push(note);
	                }
	            } else {
	                throw new TypeError('score parts must be Arrays');
	            }
	        }
	        return notes;
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    //	MUSIC NOTES
	    //	
	    //	Augments Tone.prototype to include note methods
	    ///////////////////////////////////////////////////////////////////////////
	    var noteToIndex = {
	        'c': 0,
	        'c#': 1,
	        'db': 1,
	        'd': 2,
	        'd#': 3,
	        'eb': 3,
	        'e': 4,
	        'f': 5,
	        'f#': 6,
	        'gb': 6,
	        'g': 7,
	        'g#': 8,
	        'ab': 8,
	        'a': 9,
	        'a#': 10,
	        'bb': 10,
	        'b': 11
	    };
	    var noteIndexToNote = [
	        'C',
	        'C#',
	        'D',
	        'D#',
	        'E',
	        'F',
	        'F#',
	        'G',
	        'G#',
	        'A',
	        'A#',
	        'B'
	    ];
	    var middleC = 261.6255653005986;
	    /**
		 *  Convert a note name to frequency. 
		 *  @param  {string} note
		 *  @return {number}     
		 *  @example
		 * var freq = tone.noteToFrequency("A4"); //returns 440
		 */
	    Tone.prototype.noteToFrequency = function (note) {
	        //break apart the note by frequency and octave
	        var parts = note.split(/(\d+)/);
	        if (parts.length === 3) {
	            var index = noteToIndex[parts[0].toLowerCase()];
	            var octave = parts[1];
	            var noteNumber = index + parseInt(octave, 10) * 12;
	            return Math.pow(2, (noteNumber - 48) / 12) * middleC;
	        } else {
	            return 0;
	        }
	    };
	    /**
		 *  Test if a string is in note format: i.e. "C4". 
		 *  @param  {string|number}  note The note to test
		 *  @return {boolean}      true if it's in the form of a note
		 *  @method isNotation
		 *  @lends Tone.prototype.isNote
		 *  @function
		 */
	    Tone.prototype.isNote = function () {
	        var noteFormat = new RegExp(/[a-g]{1}([b#]{1}|[b#]{0})[0-9]+$/i);
	        return function (note) {
	            if (typeof note === 'string') {
	                note = note.toLowerCase();
	            }
	            return noteFormat.test(note);
	        };
	    }();
	    /**
		 *  A pointer to the previous toFrequency method
		 *  @private
		 *  @function
		 */
	    Tone.prototype._overwrittenToFrequency = Tone.prototype.toFrequency;
	    /**
		 *  A method which accepts frequencies in the form
		 *  of notes (`"C#4"`), frequencies as strings ("49hz"), frequency numbers,
		 *  or Time and converts them to their frequency as a number in hertz.
		 *  @param  {Frequency} note the note name or notation
		 *  @param {number=} 	now 	if passed in, this number will be 
		 *                        		used for all 'now' relative timings
		 *  @return {number}      the frequency as a number
		 */
	    Tone.prototype.toFrequency = function (note, now) {
	        if (this.isNote(note)) {
	            note = this.noteToFrequency(note);
	        }
	        return this._overwrittenToFrequency(note, now);
	    };
	    /**
		 *  Convert a frequency to a note name (i.e. A4, C#5).
		 *  @param  {number} freq
		 *  @return {string}         
		 */
	    Tone.prototype.frequencyToNote = function (freq) {
	        var log = Math.log(freq / middleC) / Math.LN2;
	        var noteNumber = Math.round(12 * log) + 48;
	        var octave = Math.floor(noteNumber / 12);
	        var noteName = noteIndexToNote[noteNumber % 12];
	        return noteName + octave.toString();
	    };
	    /**
		 *  Convert an interval (in semitones) to a frequency ratio.
		 *
		 *  @param  {Interval} interval the number of semitones above the base note
		 *  @return {number}          the frequency ratio
		 *  @example
		 * tone.intervalToFrequencyRatio(0); // returns 1
		 * tone.intervalToFrequencyRatio(12); // returns 2
		 */
	    Tone.prototype.intervalToFrequencyRatio = function (interval) {
	        return Math.pow(2, interval / 12);
	    };
	    /**
		 *  Convert a midi note number into a note name. 
		 *
		 *  @param  {MIDI} midiNumber the midi note number
		 *  @return {string}            the note's name and octave
		 *  @example
		 * tone.midiToNote(60); // returns "C3"
		 */
	    Tone.prototype.midiToNote = function (midiNumber) {
	        var octave = Math.floor(midiNumber / 12) - 2;
	        var note = midiNumber % 12;
	        return noteIndexToNote[note] + octave;
	    };
	    /**
		 *  Convert a note to it's midi value. 
		 *
		 *  @param  {string} note the note name (i.e. "C3")
		 *  @return {MIDI} the midi value of that note
		 *  @example
		 * tone.noteToMidi("C3"); // returns 60
		 */
	    Tone.prototype.noteToMidi = function (note) {
	        //break apart the note by frequency and octave
	        var parts = note.split(/(\d+)/);
	        if (parts.length === 3) {
	            var index = noteToIndex[parts[0].toLowerCase()];
	            var octave = parts[1];
	            return index + (parseInt(octave, 10) + 2) * 12;
	        } else {
	            return 0;
	        }
	    };
	    return Tone.Note;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.PulseOscillator is a pulse oscillator with control over pulse width,
		 *         also known as the duty cycle. At 50% duty cycle (width = 0.5) the wave is 
		 *         a square and only odd-numbered harmonics are present. At all other widths 
		 *         even-numbered harmonics are present. Read more 
		 *         [here](https://wigglewave.wordpress.com/2014/08/16/pulse-waveforms-and-harmonics/).
		 *
		 *  @constructor
		 *  @extends {Tone.Oscillator}
		 *  @param {Frequency} [frequency] The frequency of the oscillator
		 *  @param {NormalRange} [width] The width of the pulse
		 *  @example
		 * var pulse = new Tone.PulseOscillator("E5", 0.4).toMaster().start();
		 */
	    Tone.PulseOscillator = function () {
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'width'
	        ], Tone.Oscillator.defaults);
	        Tone.Source.call(this, options);
	        /**
			 *  The width of the pulse. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.width = new Tone.Signal(options.width, Tone.Type.NormalRange);
	        /**
			 *  gate the width amount
			 *  @type {GainNode}
			 *  @private
			 */
	        this._widthGate = this.context.createGain();
	        /**
			 *  the sawtooth oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
	        this._sawtooth = new Tone.Oscillator({
	            frequency: options.frequency,
	            detune: options.detune,
	            type: 'sawtooth',
	            phase: options.phase
	        });
	        /**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = this._sawtooth.frequency;
	        /**
			 *  The detune in cents. 
			 *  @type {Cents}
			 *  @signal
			 */
	        this.detune = this._sawtooth.detune;
	        /**
			 *  Threshold the signal to turn it into a square
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
	        this._thresh = new Tone.WaveShaper(function (val) {
	            if (val < 0) {
	                return -1;
	            } else {
	                return 1;
	            }
	        });
	        //connections
	        this._sawtooth.chain(this._thresh, this.output);
	        this.width.chain(this._widthGate, this._thresh);
	        this._readOnly([
	            'width',
	            'frequency',
	            'detune'
	        ]);
	    };
	    Tone.extend(Tone.PulseOscillator, Tone.Oscillator);
	    /**
		 *  The default parameters.
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.PulseOscillator.defaults = {
	        'frequency': 440,
	        'detune': 0,
	        'phase': 0,
	        'width': 0.2
	    };
	    /**
		 *  start the oscillator
		 *  @param  {Time} time 
		 *  @private
		 */
	    Tone.PulseOscillator.prototype._start = function (time) {
	        time = this.toSeconds(time);
	        this._sawtooth.start(time);
	        this._widthGate.gain.setValueAtTime(1, time);
	    };
	    /**
		 *  stop the oscillator
		 *  @param  {Time} time 
		 *  @private
		 */
	    Tone.PulseOscillator.prototype._stop = function (time) {
	        time = this.toSeconds(time);
	        this._sawtooth.stop(time);
	        //the width is still connected to the output. 
	        //that needs to be stopped also
	        this._widthGate.gain.setValueAtTime(0, time);
	    };
	    /**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.PulseOscillator#
		 * @type {Degrees}
		 * @name phase
		 */
	    Object.defineProperty(Tone.PulseOscillator.prototype, 'phase', {
	        get: function () {
	            return this._sawtooth.phase;
	        },
	        set: function (phase) {
	            this._sawtooth.phase = phase;
	        }
	    });
	    /**
		 * The type of the oscillator. Always returns "pulse".
		 * @readOnly
		 * @memberOf Tone.PulseOscillator#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.PulseOscillator.prototype, 'type', {
	        get: function () {
	            return 'pulse';
	        }
	    });
	    /**
		 *  Clean up method.
		 *  @return {Tone.PulseOscillator} this
		 */
	    Tone.PulseOscillator.prototype.dispose = function () {
	        Tone.Source.prototype.dispose.call(this);
	        this._sawtooth.dispose();
	        this._sawtooth = null;
	        this._writable([
	            'width',
	            'frequency',
	            'detune'
	        ]);
	        this.width.dispose();
	        this.width = null;
	        this._widthGate.disconnect();
	        this._widthGate = null;
	        this._widthGate = null;
	        this._thresh.disconnect();
	        this._thresh = null;
	        this.frequency = null;
	        this.detune = null;
	        return this;
	    };
	    return Tone.PulseOscillator;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.PWMOscillator modulates the width of a Tone.PulseOscillator 
		 *         at the modulationFrequency. This has the effect of continuously
		 *         changing the timbre of the oscillator by altering the harmonics 
		 *         generated.
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator. 
		 *  @param {Frequency} modulationFrequency The modulation frequency of the width of the pulse. 
		 *  @example
		 *  var pwm = new Tone.PWMOscillator("Ab3", 0.3).toMaster().start();
		 */
	    Tone.PWMOscillator = function () {
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'modulationFrequency'
	        ], Tone.PWMOscillator.defaults);
	        Tone.Source.call(this, options);
	        /**
			 *  the pulse oscillator
			 *  @type {Tone.PulseOscillator}
			 *  @private
			 */
	        this._pulse = new Tone.PulseOscillator(options.modulationFrequency);
	        //change the pulse oscillator type
	        this._pulse._sawtooth.type = 'sine';
	        /**
			 *  the modulator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
	        this._modulator = new Tone.Oscillator({
	            'frequency': options.frequency,
	            'detune': options.detune
	        });
	        /**
			 *  Scale the oscillator so it doesn't go silent 
			 *  at the extreme values.
			 *  @type {Tone.Multiply}
			 *  @private
			 */
	        this._scale = new Tone.Multiply(1.01);
	        /**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = this._modulator.frequency;
	        /**
			 *  The detune of the oscillator.
			 *  @type {Cents}
			 *  @signal
			 */
	        this.detune = this._modulator.detune;
	        /**
			 *  The modulation rate of the oscillator. 
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.modulationFrequency = this._pulse.frequency;
	        //connections
	        this._modulator.chain(this._scale, this._pulse.width);
	        this._pulse.connect(this.output);
	        this._readOnly([
	            'modulationFrequency',
	            'frequency',
	            'detune'
	        ]);
	    };
	    Tone.extend(Tone.PWMOscillator, Tone.Oscillator);
	    /**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
	    Tone.PWMOscillator.defaults = {
	        'frequency': 440,
	        'detune': 0,
	        'modulationFrequency': 0.4
	    };
	    /**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */
	    Tone.PWMOscillator.prototype._start = function (time) {
	        time = this.toSeconds(time);
	        this._modulator.start(time);
	        this._pulse.start(time);
	    };
	    /**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */
	    Tone.PWMOscillator.prototype._stop = function (time) {
	        time = this.toSeconds(time);
	        this._modulator.stop(time);
	        this._pulse.stop(time);
	    };
	    /**
		 * The type of the oscillator. Always returns "pwm".
		 * @readOnly
		 * @memberOf Tone.PWMOscillator#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.PWMOscillator.prototype, 'type', {
	        get: function () {
	            return 'pwm';
	        }
	    });
	    /**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.PWMOscillator#
		 * @type {number}
		 * @name phase
		 */
	    Object.defineProperty(Tone.PWMOscillator.prototype, 'phase', {
	        get: function () {
	            return this._modulator.phase;
	        },
	        set: function (phase) {
	            this._modulator.phase = phase;
	        }
	    });
	    /**
		 *  Clean up.
		 *  @return {Tone.PWMOscillator} this
		 */
	    Tone.PWMOscillator.prototype.dispose = function () {
	        Tone.Source.prototype.dispose.call(this);
	        this._pulse.dispose();
	        this._pulse = null;
	        this._scale.dispose();
	        this._scale = null;
	        this._modulator.dispose();
	        this._modulator = null;
	        this._writable([
	            'modulationFrequency',
	            'frequency',
	            'detune'
	        ]);
	        this.frequency = null;
	        this.detune = null;
	        this.modulationFrequency = null;
	        return this;
	    };
	    return Tone.PWMOscillator;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.OmniOscillator aggregates Tone.Oscillator, Tone.PulseOscillator,
		 *         and Tone.PWMOscillator into one class, allowing it to have the 
		 *         types: sine, square, triangle, sawtooth, pulse or pwm. Additionally,
		 *         OmniOscillator is capable of setting the first x number of partials 
		 *         of the oscillator. For example: "sine4" would set be the first 4 
		 *         partials of the sine wave and "triangle8" would set the first 
		 *         8 partials of the triangle wave. 
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {Frequency} frequency The initial frequency of the oscillator.
		 *  @param {string} type The type of the oscillator.
		 *  @example
		 *  var omniOsc = new Tone.OmniOscillator("C#4", "pwm");
		 */
	    Tone.OmniOscillator = function () {
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'type'
	        ], Tone.OmniOscillator.defaults);
	        Tone.Source.call(this, options);
	        /**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);
	        /**
			 *  The detune control
			 *  @type {Cents}
			 *  @signal
			 */
	        this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);
	        /**
			 *  the type of the oscillator source
			 *  @type {string}
			 *  @private
			 */
	        this._sourceType = undefined;
	        /**
			 *  the oscillator
			 *  @type {Tone.Oscillator|Tone.PWMOscillator|Tone.PulseOscillator}
			 *  @private
			 */
	        this._oscillator = null;
	        //set the oscillator
	        this.type = options.type;
	        this._readOnly([
	            'frequency',
	            'detune'
	        ]);
	    };
	    Tone.extend(Tone.OmniOscillator, Tone.Oscillator);
	    /**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
	    Tone.OmniOscillator.defaults = {
	        'frequency': 440,
	        'detune': 0,
	        'type': 'sine',
	        'width': 0.4,
	        //only applies if the oscillator is set to "pulse",
	        'modulationFrequency': 0.4
	    };
	    /**
		 *  @enum {string}
		 *  @private
		 */
	    var OmniOscType = {
	        PulseOscillator: 'PulseOscillator',
	        PWMOscillator: 'PWMOscillator',
	        Oscillator: 'Oscillator'
	    };
	    /**
		 *  start the oscillator
		 *  @param {Time} [time=now] the time to start the oscillator
		 *  @private
		 */
	    Tone.OmniOscillator.prototype._start = function (time) {
	        this._oscillator.start(time);
	    };
	    /**
		 *  start the oscillator
		 *  @param {Time} [time=now] the time to start the oscillator
		 *  @private
		 */
	    Tone.OmniOscillator.prototype._stop = function (time) {
	        this._oscillator.stop(time);
	    };
	    /**
		 * The type of the oscillator. sine, square, triangle, sawtooth, pwm, or pulse. 
		 * @memberOf Tone.OmniOscillator#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.OmniOscillator.prototype, 'type', {
	        get: function () {
	            return this._oscillator.type;
	        },
	        set: function (type) {
	            if (type.indexOf('sine') === 0 || type.indexOf('square') === 0 || type.indexOf('triangle') === 0 || type.indexOf('sawtooth') === 0) {
	                if (this._sourceType !== OmniOscType.Oscillator) {
	                    this._sourceType = OmniOscType.Oscillator;
	                    this._createNewOscillator(Tone.Oscillator);
	                }
	                this._oscillator.type = type;
	            } else if (type === 'pwm') {
	                if (this._sourceType !== OmniOscType.PWMOscillator) {
	                    this._sourceType = OmniOscType.PWMOscillator;
	                    this._createNewOscillator(Tone.PWMOscillator);
	                }
	            } else if (type === 'pulse') {
	                if (this._sourceType !== OmniOscType.PulseOscillator) {
	                    this._sourceType = OmniOscType.PulseOscillator;
	                    this._createNewOscillator(Tone.PulseOscillator);
	                }
	            } else {
	                throw new TypeError('Tone.OmniOscillator does not support type ' + type);
	            }
	        }
	    });
	    /**
		 *  connect the oscillator to the frequency and detune signals
		 *  @private
		 */
	    Tone.OmniOscillator.prototype._createNewOscillator = function (OscillatorConstructor) {
	        //short delay to avoid clicks on the change
	        var now = this.now() + this.bufferTime;
	        if (this._oscillator !== null) {
	            var oldOsc = this._oscillator;
	            oldOsc.stop(now);
	            oldOsc.onended = function () {
	                oldOsc.dispose();
	                oldOsc = null;
	            };
	        }
	        this._oscillator = new OscillatorConstructor();
	        this.frequency.connect(this._oscillator.frequency);
	        this.detune.connect(this._oscillator.detune);
	        this._oscillator.connect(this.output);
	        if (this.state === Tone.State.Started) {
	            this._oscillator.start(now);
	        }
	    };
	    /**
		 * The phase of the oscillator in degrees. 
		 * @memberOf Tone.OmniOscillator#
		 * @type {Degrees}
		 * @name phase
		 */
	    Object.defineProperty(Tone.OmniOscillator.prototype, 'phase', {
	        get: function () {
	            return this._oscillator.phase;
	        },
	        set: function (phase) {
	            this._oscillator.phase = phase;
	        }
	    });
	    /**
		 * The width of the oscillator (only if the oscillator is set to pulse)
		 * @memberOf Tone.OmniOscillator#
		 * @type {NormalRange}
		 * @signal
		 * @name width
		 * @example
		 * var omniOsc = new Tone.OmniOscillator(440, "pulse");
		 * //can access the width attribute only if type === "pulse"
		 * omniOsc.width.value = 0.2; 
		 */
	    Object.defineProperty(Tone.OmniOscillator.prototype, 'width', {
	        get: function () {
	            if (this._sourceType === OmniOscType.PulseOscillator) {
	                return this._oscillator.width;
	            }
	        }
	    });
	    /**
		 * The modulationFrequency Signal of the oscillator 
		 * (only if the oscillator type is set to pwm).
		 * @memberOf Tone.OmniOscillator#
		 * @type {Frequency}
		 * @signal
		 * @name modulationFrequency
		 * @example
		 * var omniOsc = new Tone.OmniOscillator(440, "pwm");
		 * //can access the modulationFrequency attribute only if type === "pwm"
		 * omniOsc.modulationFrequency.value = 0.2; 
		 */
	    Object.defineProperty(Tone.OmniOscillator.prototype, 'modulationFrequency', {
	        get: function () {
	            if (this._sourceType === OmniOscType.PWMOscillator) {
	                return this._oscillator.modulationFrequency;
	            }
	        }
	    });
	    /**
		 *  Clean up.
		 *  @return {Tone.OmniOscillator} this
		 */
	    Tone.OmniOscillator.prototype.dispose = function () {
	        Tone.Source.prototype.dispose.call(this);
	        this._writable([
	            'frequency',
	            'detune'
	        ]);
	        this.detune.dispose();
	        this.detune = null;
	        this.frequency.dispose();
	        this.frequency = null;
	        this._oscillator.dispose();
	        this._oscillator = null;
	        this._sourceType = null;
	        return this;
	    };
	    return Tone.OmniOscillator;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Base-class for all instruments
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 */
	    Tone.Instrument = function (options) {
	        //get the defaults
	        options = this.defaultArg(options, Tone.Instrument.defaults);
	        /**
			 *  the output
			 *  @type {GainNode}
			 *  @private
			 */
	        this.output = this.context.createGain();
	        /**
			 * The volume of the instrument.
			 * @type {Decibels}
			 * @signal
			 */
	        this.volume = new Tone.Signal({
	            'param': this.output.gain,
	            'units': Tone.Type.Decibels,
	            'value': options.volume
	        });
	        this._readOnly(['volume']);
	    };
	    Tone.extend(Tone.Instrument);
	    /**
		 *  the default attributes
		 *  @type {object}
		 */
	    Tone.Instrument.defaults = {
	        /** the volume of the output in decibels */
	        'volume': 0
	    };
	    /**
		 *  @abstract
		 *  @param {string|number} note the note to trigger
		 *  @param {Time} [time=now] the time to trigger the ntoe
		 *  @param {number} [velocity=1] the velocity to trigger the note
		 */
	    Tone.Instrument.prototype.triggerAttack = Tone.noOp;
	    /**
		 *  @abstract
		 *  @param {Time} [time=now] when to trigger the release
		 */
	    Tone.Instrument.prototype.triggerRelease = Tone.noOp;
	    /**
		 *  Trigger the attack and then the release after the duration. 
		 *  @param  {Frequency} note     The note to trigger.
		 *  @param  {Time} duration How long the note should be held for before
		 *                          triggering the release.
		 *  @param {Time} [time=now]  When the note should be triggered.
		 *  @param  {NormalRange} [velocity=1] The velocity the note should be triggered at.
		 *  @returns {Tone.Instrument} this
		 *  @example
		 * //trigger "C4" for the duration of an 8th note
		 * synth.triggerAttackRelease("C4", "8n");
		 */
	    Tone.Instrument.prototype.triggerAttackRelease = function (note, duration, time, velocity) {
	        time = this.toSeconds(time);
	        duration = this.toSeconds(duration);
	        this.triggerAttack(note, time, velocity);
	        this.triggerRelease(time + duration);
	        return this;
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.Instrument} this
		 */
	    Tone.Instrument.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable(['volume']);
	        this.volume.dispose();
	        this.volume = null;
	        return this;
	    };
	    return Tone.Instrument;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  This is a base class for monophonic instruments. 
		 *
		 *  @constructor
		 *  @abstract
		 *  @extends {Tone.Instrument}
		 */
	    Tone.Monophonic = function (options) {
	        //get the defaults
	        options = this.defaultArg(options, Tone.Monophonic.defaults);
	        Tone.Instrument.call(this, options);
	        /**
			 *  The glide time between notes. 
			 *  @type {Time}
			 */
	        this.portamento = options.portamento;
	    };
	    Tone.extend(Tone.Monophonic, Tone.Instrument);
	    /**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.Monophonic.defaults = { 'portamento': 0 };
	    /**
		 *  Trigger the attack of the note optionally with a given velocity. 
		 *  
		 *  
		 *  @param  {Frequency} note     The note to trigger.
		 *  @param  {Time} [time=now]     When the note should start.
		 *  @param  {number} [velocity=1] velocity The velocity scaler 
		 *                                determines how "loud" the note 
		 *                                will be triggered.
		 *  @returns {Tone.Monophonic} this
		 *  @example
		 * synth.triggerAttack("C4");
		 *  @example
		 * //trigger the note a half second from now at half velocity
		 * synth.triggerAttack("C4", "+0.5", 0.5);
		 */
	    Tone.Monophonic.prototype.triggerAttack = function (note, time, velocity) {
	        time = this.toSeconds(time);
	        this._triggerEnvelopeAttack(time, velocity);
	        this.setNote(note, time);
	        return this;
	    };
	    /**
		 *  Trigger the release portion of the envelope
		 *  @param  {Time} [time=now] If no time is given, the release happens immediatly
		 *  @returns {Tone.Monophonic} this
		 *  @example
		 * synth.triggerRelease();
		 */
	    Tone.Monophonic.prototype.triggerRelease = function (time) {
	        this._triggerEnvelopeRelease(time);
	        return this;
	    };
	    /**
		 *  override this method with the actual method
		 *  @abstract
		 *  @private
		 */
	    Tone.Monophonic.prototype._triggerEnvelopeAttack = function () {
	    };
	    /**
		 *  override this method with the actual method
		 *  @abstract
		 *  @private
		 */
	    Tone.Monophonic.prototype._triggerEnvelopeRelease = function () {
	    };
	    /**
		 *  Set the note at the given time. If no time is given, the note
		 *  will set immediately. 
		 *  @param {Frequency} note The note to change to.
		 *  @param  {Time} [time=now] The time when the note should be set. 
		 *  @returns {Tone.Monophonic} this
		 * @example
		 * //change to F#6 in one quarter note from now.
		 * synth.setNote("F#6", "+4n");
		 * @example
		 * //change to Bb4 right now
		 * synth.setNote("Bb4");
		 */
	    Tone.Monophonic.prototype.setNote = function (note, time) {
	        time = this.toSeconds(time);
	        if (this.portamento > 0) {
	            var currentNote = this.frequency.value;
	            this.frequency.setValueAtTime(currentNote, time);
	            var portTime = this.toSeconds(this.portamento);
	            this.frequency.exponentialRampToValueAtTime(note, time + portTime);
	        } else {
	            this.frequency.setValueAtTime(note, time);
	        }
	        return this;
	    };
	    return Tone.Monophonic;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.MonoSynth is composed of one oscillator, one filter, and two envelopes.
		 *          The amplitude of the Tone.Oscillator and the cutoff frequency of the 
		 *          Tone.Filter are controlled by Tone.Envelopes. 
		 *          <img src="https://docs.google.com/drawings/d/1gaY1DF9_Hzkodqf8JI1Cg2VZfwSElpFQfI94IQwad38/pub?w=924&h=240">
		 *          
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.MonoSynth({
		 * 	"oscillator" : {
		 * 		"type" : "square"
		 *  },
		 *  "envelope" : {
		 *  	"attack" : 0.1
		 *  }
		 * }).toMaster();
		 * synth.triggerAttackRelease("C4", "8n");
		 */
	    Tone.MonoSynth = function (options) {
	        //get the defaults
	        options = this.defaultArg(options, Tone.MonoSynth.defaults);
	        Tone.Monophonic.call(this, options);
	        /**
			 *  The oscillator.
			 *  @type {Tone.OmniOscillator}
			 */
	        this.oscillator = new Tone.OmniOscillator(options.oscillator);
	        /**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = this.oscillator.frequency;
	        /**
			 *  The detune control.
			 *  @type {Cents}
			 *  @signal
			 */
	        this.detune = this.oscillator.detune;
	        /**
			 *  The filter.
			 *  @type {Tone.Filter}
			 */
	        this.filter = new Tone.Filter(options.filter);
	        /**
			 *  The filter envelope.
			 *  @type {Tone.ScaledEnvelope}
			 */
	        this.filterEnvelope = new Tone.ScaledEnvelope(options.filterEnvelope);
	        /**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */
	        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
	        //connect the oscillators to the output
	        this.oscillator.chain(this.filter, this.envelope, this.output);
	        //start the oscillators
	        this.oscillator.start();
	        //connect the filter envelope
	        this.filterEnvelope.connect(this.filter.frequency);
	        this._readOnly([
	            'oscillator',
	            'frequency',
	            'detune',
	            'filter',
	            'filterEnvelope',
	            'envelope'
	        ]);
	    };
	    Tone.extend(Tone.MonoSynth, Tone.Monophonic);
	    /**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
	    Tone.MonoSynth.defaults = {
	        'frequency': 'C4',
	        'detune': 0,
	        'oscillator': { 'type': 'square' },
	        'filter': {
	            'Q': 6,
	            'type': 'lowpass',
	            'rolloff': -24
	        },
	        'envelope': {
	            'attack': 0.005,
	            'decay': 0.1,
	            'sustain': 0.9,
	            'release': 1
	        },
	        'filterEnvelope': {
	            'attack': 0.06,
	            'decay': 0.2,
	            'sustain': 0.5,
	            'release': 2,
	            'min': 20,
	            'max': 4000,
	            'exponent': 2
	        }
	    };
	    /**
		 *  start the attack portion of the envelope
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {NormalRange} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.MonoSynth} this
		 *  @private
		 */
	    Tone.MonoSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
	        //the envelopes
	        this.envelope.triggerAttack(time, velocity);
	        this.filterEnvelope.triggerAttack(time);
	        return this;
	    };
	    /**
		 *  start the release portion of the envelope
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.MonoSynth} this
		 *  @private
		 */
	    Tone.MonoSynth.prototype._triggerEnvelopeRelease = function (time) {
	        this.envelope.triggerRelease(time);
	        this.filterEnvelope.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.MonoSynth} this
		 */
	    Tone.MonoSynth.prototype.dispose = function () {
	        Tone.Monophonic.prototype.dispose.call(this);
	        this._writable([
	            'oscillator',
	            'frequency',
	            'detune',
	            'filter',
	            'filterEnvelope',
	            'envelope'
	        ]);
	        this.oscillator.dispose();
	        this.oscillator = null;
	        this.envelope.dispose();
	        this.envelope = null;
	        this.filterEnvelope.dispose();
	        this.filterEnvelope = null;
	        this.filter.dispose();
	        this.filter = null;
	        this.frequency = null;
	        this.detune = null;
	        return this;
	    };
	    return Tone.MonoSynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  AMSynth uses the output of one Tone.MonoSynth to modulate the
		 *          amplitude of another Tone.MonoSynth. The harmonicity (the ratio between
		 *          the two signals) affects the timbre of the output signal the most.
		 *          Read more about Amplitude Modulation Synthesis on 
		 *          [SoundOnSound](http://www.soundonsound.com/sos/mar00/articles/synthsecrets.htm).
		 *          <img src="https://docs.google.com/drawings/d/1TQu8Ed4iFr1YTLKpB3U1_hur-UwBrh5gdBXc8BxfGKw/pub?w=1009&h=457">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                            see defaults below
		 *  @example
		 * var synth = new Tone.AMSynth().toMaster();
		 * synth.triggerAttackRelease("C4", "4n");
		 */
	    Tone.AMSynth = function (options) {
	        options = this.defaultArg(options, Tone.AMSynth.defaults);
	        Tone.Monophonic.call(this, options);
	        /**
			 *  The carrier voice. 
			 *  @type {Tone.MonoSynth}
			 */
	        this.carrier = new Tone.MonoSynth(options.carrier);
	        this.carrier.volume.value = -10;
	        /**
			 *  The modulator voice. 
			 *  @type {Tone.MonoSynth}
			 */
	        this.modulator = new Tone.MonoSynth(options.modulator);
	        this.modulator.volume.value = -10;
	        /**
			 *  The frequency.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
	        /**
			 *  Harmonicity is the ratio between the two voices. A harmonicity of
			 *  1 is no change. Harmonicity = 2 means a change of an octave. 
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch voice1 an octave below voice0
			 * synth.harmonicity.value = 0.5;
			 */
	        this.harmonicity = new Tone.Multiply(options.harmonicity);
	        this.harmonicity.units = Tone.Type.Positive;
	        /**
			 *  convert the -1,1 output to 0,1
			 *  @type {Tone.AudioToGain}
			 *  @private
			 */
	        this._modulationScale = new Tone.AudioToGain();
	        /**
			 *  the node where the modulation happens
			 *  @type {GainNode}
			 *  @private
			 */
	        this._modulationNode = this.context.createGain();
	        //control the two voices frequency
	        this.frequency.connect(this.carrier.frequency);
	        this.frequency.chain(this.harmonicity, this.modulator.frequency);
	        this.modulator.chain(this._modulationScale, this._modulationNode.gain);
	        this.carrier.chain(this._modulationNode, this.output);
	        this._readOnly([
	            'carrier',
	            'modulator',
	            'frequency',
	            'harmonicity'
	        ]);
	    };
	    Tone.extend(Tone.AMSynth, Tone.Monophonic);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.AMSynth.defaults = {
	        'harmonicity': 3,
	        'carrier': {
	            'volume': -10,
	            'oscillator': { 'type': 'sine' },
	            'envelope': {
	                'attack': 0.01,
	                'decay': 0.01,
	                'sustain': 1,
	                'release': 0.5
	            },
	            'filterEnvelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5,
	                'min': 20000,
	                'max': 20000
	            },
	            'filter': {
	                'Q': 6,
	                'type': 'lowpass',
	                'rolloff': -24
	            }
	        },
	        'modulator': {
	            'volume': -10,
	            'oscillator': { 'type': 'square' },
	            'envelope': {
	                'attack': 2,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            },
	            'filterEnvelope': {
	                'attack': 4,
	                'decay': 0.2,
	                'sustain': 0.5,
	                'release': 0.5,
	                'min': 20,
	                'max': 1500
	            },
	            'filter': {
	                'Q': 6,
	                'type': 'lowpass',
	                'rolloff': -24
	            }
	        }
	    };
	    /**
		 *  trigger the attack portion of the note
		 *  
		 *  @param  {Time} [time=now] the time the note will occur
		 *  @param {NormalRange} [velocity=1] the velocity of the note
		 *  @private
		 *  @returns {Tone.AMSynth} this
		 */
	    Tone.AMSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
	        //the port glide
	        time = this.toSeconds(time);
	        //the envelopes
	        this.carrier.envelope.triggerAttack(time, velocity);
	        this.modulator.envelope.triggerAttack(time);
	        this.carrier.filterEnvelope.triggerAttack(time);
	        this.modulator.filterEnvelope.triggerAttack(time);
	        return this;
	    };
	    /**
		 *  trigger the release portion of the note
		 *  
		 *  @param  {Time} [time=now] the time the note will release
		 *  @private
		 *  @returns {Tone.AMSynth} this
		 */
	    Tone.AMSynth.prototype._triggerEnvelopeRelease = function (time) {
	        this.carrier.triggerRelease(time);
	        this.modulator.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.AMSynth} this
		 */
	    Tone.AMSynth.prototype.dispose = function () {
	        Tone.Monophonic.prototype.dispose.call(this);
	        this._writable([
	            'carrier',
	            'modulator',
	            'frequency',
	            'harmonicity'
	        ]);
	        this.carrier.dispose();
	        this.carrier = null;
	        this.modulator.dispose();
	        this.modulator = null;
	        this.frequency.dispose();
	        this.frequency = null;
	        this.harmonicity.dispose();
	        this.harmonicity = null;
	        this._modulationScale.dispose();
	        this._modulationScale = null;
	        this._modulationNode.disconnect();
	        this._modulationNode = null;
	        return this;
	    };
	    return Tone.AMSynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.DrumSynth makes kick and tom sounds using a single oscillator
		 *          with an amplitude envelope and frequency ramp. A Tone.Oscillator
		 *          is routed through a Tone.AmplitudeEnvelope to the output. The drum
		 *          quality of the sound comes from the frequency envelope applied
		 *          during during Tone.DrumSynth.triggerAttack(note). The frequency
		 *          envelope starts at <code>note * .octaves</code> and ramps to 
		 *          <code>note</code> over the duration of <code>.pitchDecay</code>. 
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.DrumSynth().toMaster();
		 * synth.triggerAttackRelease("C2", "8n");
		 */
	    Tone.DrumSynth = function (options) {
	        options = this.defaultArg(options, Tone.DrumSynth.defaults);
	        Tone.Instrument.call(this, options);
	        /**
			 *  The oscillator.
			 *  @type {Tone.Oscillator}
			 */
	        this.oscillator = new Tone.Oscillator(options.oscillator).start();
	        /**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */
	        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
	        /**
			 *  The number of octaves the pitch envelope ramps.
			 *  @type {Positive}
			 */
	        this.octaves = options.octaves;
	        /**
			 *  The amount of time the frequency envelope takes. 
			 *  @type {Time}
			 */
	        this.pitchDecay = options.pitchDecay;
	        this.oscillator.chain(this.envelope, this.output);
	        this._readOnly([
	            'oscillator',
	            'envelope'
	        ]);
	    };
	    Tone.extend(Tone.DrumSynth, Tone.Instrument);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.DrumSynth.defaults = {
	        'pitchDecay': 0.05,
	        'octaves': 10,
	        'oscillator': { 'type': 'sine' },
	        'envelope': {
	            'attack': 0.001,
	            'decay': 0.4,
	            'sustain': 0.01,
	            'release': 1.4,
	            'attackCurve': 'exponential'
	        }
	    };
	    /**
		 *  Trigger the note at the given time with the given velocity. 
		 *  
		 *  @param  {Frequency} note     the note
		 *  @param  {Time} [time=now]     the time, if not given is now
		 *  @param  {number} [velocity=1] velocity defaults to 1
		 *  @returns {Tone.DrumSynth} this
		 *  @example
		 *  kick.triggerAttack(60);
		 */
	    Tone.DrumSynth.prototype.triggerAttack = function (note, time, velocity) {
	        time = this.toSeconds(time);
	        note = this.toFrequency(note);
	        var maxNote = note * this.octaves;
	        this.oscillator.frequency.setValueAtTime(maxNote, time);
	        this.oscillator.frequency.exponentialRampToValueAtTime(note, time + this.toSeconds(this.pitchDecay));
	        this.envelope.triggerAttack(time, velocity);
	        return this;
	    };
	    /**
		 *  Trigger the release portion of the note.
		 *  
		 *  @param  {Time} [time=now] the time the note will release
		 *  @returns {Tone.DrumSynth} this
		 */
	    Tone.DrumSynth.prototype.triggerRelease = function (time) {
	        this.envelope.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.DrumSynth} this
		 */
	    Tone.DrumSynth.prototype.dispose = function () {
	        Tone.Instrument.prototype.dispose.call(this);
	        this._writable([
	            'oscillator',
	            'envelope'
	        ]);
	        this.oscillator.dispose();
	        this.oscillator = null;
	        this.envelope.dispose();
	        this.envelope = null;
	        return this;
	    };
	    return Tone.DrumSynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.DuoSynth is a monophonic synth composed of two 
		 *          MonoSynths run in parallel with control over the 
		 *          frequency ratio between the two voices and vibrato effect.
		 *          <img src="https://docs.google.com/drawings/d/1bL4GXvfRMMlqS7XyBm9CjL9KJPSUKbcdBNpqOlkFLxk/pub?w=1012&h=448">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var duoSynth = new Tone.DuoSynth().toMaster();
		 * duoSynth.triggerAttackRelease("C4", "2n");
		 */
	    Tone.DuoSynth = function (options) {
	        options = this.defaultArg(options, Tone.DuoSynth.defaults);
	        Tone.Monophonic.call(this, options);
	        /**
			 *  the first voice
			 *  @type {Tone.MonoSynth}
			 */
	        this.voice0 = new Tone.MonoSynth(options.voice0);
	        this.voice0.volume.value = -10;
	        /**
			 *  the second voice
			 *  @type {Tone.MonoSynth}
			 */
	        this.voice1 = new Tone.MonoSynth(options.voice1);
	        this.voice1.volume.value = -10;
	        /**
			 *  The vibrato LFO. 
			 *  @type {Tone.LFO}
			 *  @private
			 */
	        this._vibrato = new Tone.LFO(options.vibratoRate, -50, 50);
	        this._vibrato.start();
	        /**
			 * the vibrato frequency
			 * @type {Frequency}
			 * @signal
			 */
	        this.vibratoRate = this._vibrato.frequency;
	        /**
			 *  the vibrato gain
			 *  @type {GainNode}
			 *  @private
			 */
	        this._vibratoGain = this.context.createGain();
	        /**
			 * The amount of vibrato
			 * @type {Gain}
			 * @signal
			 */
	        this.vibratoAmount = new Tone.Signal(this._vibratoGain.gain, Tone.Type.Gain);
	        this.vibratoAmount.value = options.vibratoAmount;
	        /**
			 *  the delay before the vibrato starts
			 *  @type {number}
			 *  @private
			 */
	        this._vibratoDelay = this.toSeconds(options.vibratoDelay);
	        /**
			 *  the frequency control
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
	        /**
			 *  Harmonicity is the ratio between the two voices. A harmonicity of
			 *  1 is no change. Harmonicity = 2 means a change of an octave. 
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch voice1 an octave below voice0
			 * duoSynth.harmonicity.value = 0.5;
			 */
	        this.harmonicity = new Tone.Multiply(options.harmonicity);
	        this.harmonicity.units = Tone.Type.Positive;
	        //control the two voices frequency
	        this.frequency.connect(this.voice0.frequency);
	        this.frequency.chain(this.harmonicity, this.voice1.frequency);
	        this._vibrato.connect(this._vibratoGain);
	        this._vibratoGain.fan(this.voice0.detune, this.voice1.detune);
	        this.voice0.connect(this.output);
	        this.voice1.connect(this.output);
	        this._readOnly([
	            'voice0',
	            'voice1',
	            'frequency',
	            'vibratoAmount',
	            'vibratoRate'
	        ]);
	    };
	    Tone.extend(Tone.DuoSynth, Tone.Monophonic);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.DuoSynth.defaults = {
	        'vibratoAmount': 0.5,
	        'vibratoRate': 5,
	        'vibratoDelay': 1,
	        'harmonicity': 1.5,
	        'voice0': {
	            'volume': -10,
	            'portamento': 0,
	            'oscillator': { 'type': 'sine' },
	            'filterEnvelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            },
	            'envelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            }
	        },
	        'voice1': {
	            'volume': -10,
	            'portamento': 0,
	            'oscillator': { 'type': 'sine' },
	            'filterEnvelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            },
	            'envelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            }
	        }
	    };
	    /**
		 *  start the attack portion of the envelopes
		 *  
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {NormalRange} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.DuoSynth} this
		 *  @private
		 */
	    Tone.DuoSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
	        time = this.toSeconds(time);
	        this.voice0.envelope.triggerAttack(time, velocity);
	        this.voice1.envelope.triggerAttack(time, velocity);
	        this.voice0.filterEnvelope.triggerAttack(time);
	        this.voice1.filterEnvelope.triggerAttack(time);
	        return this;
	    };
	    /**
		 *  start the release portion of the envelopes
		 *  
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.DuoSynth} this
		 *  @private
		 */
	    Tone.DuoSynth.prototype._triggerEnvelopeRelease = function (time) {
	        this.voice0.triggerRelease(time);
	        this.voice1.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.DuoSynth} this
		 */
	    Tone.DuoSynth.prototype.dispose = function () {
	        Tone.Monophonic.prototype.dispose.call(this);
	        this._writable([
	            'voice0',
	            'voice1',
	            'frequency',
	            'vibratoAmount',
	            'vibratoRate'
	        ]);
	        this.voice0.dispose();
	        this.voice0 = null;
	        this.voice1.dispose();
	        this.voice1 = null;
	        this.frequency.dispose();
	        this.frequency = null;
	        this._vibrato.dispose();
	        this._vibrato = null;
	        this._vibratoGain.disconnect();
	        this._vibratoGain = null;
	        this.harmonicity.dispose();
	        this.harmonicity = null;
	        this.vibratoAmount.dispose();
	        this.vibratoAmount = null;
	        this.vibratoRate = null;
	        return this;
	    };
	    return Tone.DuoSynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  FMSynth is composed of two Tone.MonoSynths where one Tone.MonoSynth modulates
		 *          the frequency of a second Tone.MonoSynth. A lot of spectral content 
		 *          can be explored using the modulationIndex parameter. Read more about
		 *          frequency modulation synthesis on [SoundOnSound](http://www.soundonsound.com/sos/apr00/articles/synthsecrets.htm).
		 *          <img src="https://docs.google.com/drawings/d/1h0PUDZXPgi4Ikx6bVT6oncrYPLluFKy7lj53puxj-DM/pub?w=902&h=462">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var fmSynth = new Tone.FMSynth().toMaster();
		 * fmSynth.triggerAttackRelease("C5", "4n");
		 */
	    Tone.FMSynth = function (options) {
	        options = this.defaultArg(options, Tone.FMSynth.defaults);
	        Tone.Monophonic.call(this, options);
	        /**
			 *  The carrier voice.
			 *  @type {Tone.MonoSynth}
			 */
	        this.carrier = new Tone.MonoSynth(options.carrier);
	        this.carrier.volume.value = -10;
	        /**
			 *  The modulator voice.
			 *  @type {Tone.MonoSynth}
			 */
	        this.modulator = new Tone.MonoSynth(options.modulator);
	        this.modulator.volume.value = -10;
	        /**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
	        /**
			 *  Harmonicity is the ratio between the two voices. A harmonicity of
			 *  1 is no change. Harmonicity = 2 means a change of an octave. 
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch voice1 an octave below voice0
			 * synth.harmonicity.value = 0.5;
			 */
	        this.harmonicity = new Tone.Multiply(options.harmonicity);
	        this.harmonicity.units = Tone.Type.Positive;
	        /**
			 *  The modulation index which essentially the depth or amount of the modulation. It is the 
			 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the 
			 *  modulating signal (ma) -- as in ma/mf. 
			 *	@type {Positive}
			 *	@signal
			 */
	        this.modulationIndex = new Tone.Multiply(options.modulationIndex);
	        this.modulationIndex.units = Tone.Type.Positive;
	        /**
			 *  the node where the modulation happens
			 *  @type {GainNode}
			 *  @private
			 */
	        this._modulationNode = this.context.createGain();
	        //control the two voices frequency
	        this.frequency.connect(this.carrier.frequency);
	        this.frequency.chain(this.harmonicity, this.modulator.frequency);
	        this.frequency.chain(this.modulationIndex, this._modulationNode);
	        this.modulator.connect(this._modulationNode.gain);
	        this._modulationNode.gain.value = 0;
	        this._modulationNode.connect(this.carrier.frequency);
	        this.carrier.connect(this.output);
	        this._readOnly([
	            'carrier',
	            'modulator',
	            'frequency',
	            'harmonicity',
	            'modulationIndex'
	        ]);
	    };
	    Tone.extend(Tone.FMSynth, Tone.Monophonic);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.FMSynth.defaults = {
	        'harmonicity': 3,
	        'modulationIndex': 10,
	        'carrier': {
	            'volume': -10,
	            'portamento': 0,
	            'oscillator': { 'type': 'sine' },
	            'envelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            },
	            'filterEnvelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5,
	                'min': 20000,
	                'max': 20000
	            }
	        },
	        'modulator': {
	            'volume': -10,
	            'portamento': 0,
	            'oscillator': { 'type': 'triangle' },
	            'envelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            },
	            'filterEnvelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5,
	                'min': 20000,
	                'max': 20000
	            }
	        }
	    };
	    /**
		 * 	trigger the attack portion of the note
		 *  
		 *  @param  {Time} [time=now] the time the note will occur
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.FMSynth} this
		 *  @private
		 */
	    Tone.FMSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
	        //the port glide
	        time = this.toSeconds(time);
	        //the envelopes
	        this.carrier.envelope.triggerAttack(time, velocity);
	        this.modulator.envelope.triggerAttack(time);
	        this.carrier.filterEnvelope.triggerAttack(time);
	        this.modulator.filterEnvelope.triggerAttack(time);
	        return this;
	    };
	    /**
		 *  trigger the release portion of the note
		 *  
		 *  @param  {Time} [time=now] the time the note will release
		 *  @returns {Tone.FMSynth} this
		 *  @private
		 */
	    Tone.FMSynth.prototype._triggerEnvelopeRelease = function (time) {
	        this.carrier.triggerRelease(time);
	        this.modulator.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.FMSynth} this
		 */
	    Tone.FMSynth.prototype.dispose = function () {
	        Tone.Monophonic.prototype.dispose.call(this);
	        this._writable([
	            'carrier',
	            'modulator',
	            'frequency',
	            'harmonicity',
	            'modulationIndex'
	        ]);
	        this.carrier.dispose();
	        this.carrier = null;
	        this.modulator.dispose();
	        this.modulator = null;
	        this.frequency.dispose();
	        this.frequency = null;
	        this.modulationIndex.dispose();
	        this.modulationIndex = null;
	        this.harmonicity.dispose();
	        this.harmonicity = null;
	        this._modulationNode.disconnect();
	        this._modulationNode = null;
	        return this;
	    };
	    return Tone.FMSynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Noise is a noise generator. It uses looped noise buffers to save on performance.
		 *          Tone.Noise supports the noise types: "pink", "white", and "brown". Read more about
		 *          colors of noise on [Wikipedia](https://en.wikipedia.org/wiki/Colors_of_noise).
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {string} type the noise type (white|pink|brown)
		 *  @example
		 * //initialize the noise and start
		 * var noise = new Tone.Noise("pink").start();
		 * 
		 * //make an autofilter to shape the noise
		 * var autoFilter = new Tone.AutoFilter({
		 * 	"frequency" : "8m", 
		 * 	"min" : 800, 
		 * 	"max" : 15000
		 * }).connect(Tone.Master);
		 * 
		 * //connect the noise
		 * noise.connect(autoFilter);
		 * //start the autofilter LFO
		 * autoFilter.start()
		 */
	    Tone.Noise = function () {
	        var options = this.optionsObject(arguments, ['type'], Tone.Noise.defaults);
	        Tone.Source.call(this, options);
	        /**
			 *  @private
			 *  @type {AudioBufferSourceNode}
			 */
	        this._source = null;
	        /**
			 *  the buffer
			 *  @private
			 *  @type {AudioBuffer}
			 */
	        this._buffer = null;
	        this.type = options.type;
	    };
	    Tone.extend(Tone.Noise, Tone.Source);
	    /**
		 *  the default parameters
		 *
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.Noise.defaults = { 'type': 'white' };
	    /**
		 * The type of the noise. Can be "white", "brown", or "pink". 
		 * @memberOf Tone.Noise#
		 * @type {string}
		 * @name type
		 * @example
		 * noise.type = "white";
		 */
	    Object.defineProperty(Tone.Noise.prototype, 'type', {
	        get: function () {
	            if (this._buffer === _whiteNoise) {
	                return 'white';
	            } else if (this._buffer === _brownNoise) {
	                return 'brown';
	            } else if (this._buffer === _pinkNoise) {
	                return 'pink';
	            }
	        },
	        set: function (type) {
	            if (this.type !== type) {
	                switch (type) {
	                case 'white':
	                    this._buffer = _whiteNoise;
	                    break;
	                case 'pink':
	                    this._buffer = _pinkNoise;
	                    break;
	                case 'brown':
	                    this._buffer = _brownNoise;
	                    break;
	                default:
	                    this._buffer = _whiteNoise;
	                }
	                //if it's playing, stop and restart it
	                if (this.state === Tone.State.Started) {
	                    var now = this.now() + this.bufferTime;
	                    //remove the listener
	                    this._source.onended = undefined;
	                    this._stop(now);
	                    this._start(now);
	                }
	            }
	        }
	    });
	    /**
		 *  internal start method
		 *
		 *  @param {Time} time
		 *  @private
		 */
	    Tone.Noise.prototype._start = function (time) {
	        this._source = this.context.createBufferSource();
	        this._source.buffer = this._buffer;
	        this._source.loop = true;
	        this.connectSeries(this._source, this.output);
	        this._source.start(this.toSeconds(time));
	        this._source.onended = this.onended;
	    };
	    /**
		 *  internal stop method
		 *
		 *  @param {Time} time
		 *  @private
		 */
	    Tone.Noise.prototype._stop = function (time) {
	        if (this._source) {
	            this._source.stop(this.toSeconds(time));
	        }
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.Noise} this
		 */
	    Tone.Noise.prototype.dispose = function () {
	        Tone.Source.prototype.dispose.call(this);
	        if (this._source !== null) {
	            this._source.disconnect();
	            this._source = null;
	        }
	        this._buffer = null;
	        return this;
	    };
	    ///////////////////////////////////////////////////////////////////////////
	    // THE BUFFERS
	    // borrowed heavily from http://noisehack.com/generate-noise-web-audio-api/
	    ///////////////////////////////////////////////////////////////////////////
	    /**
		 *	static noise buffers
		 *
		 *  @static
		 *  @private
		 *  @type {AudioBuffer}
		 */
	    var _pinkNoise = null, _brownNoise = null, _whiteNoise = null;
	    Tone._initAudioContext(function (audioContext) {
	        var sampleRate = audioContext.sampleRate;
	        //four seconds per buffer
	        var bufferLength = sampleRate * 4;
	        //fill the buffers
	        _pinkNoise = function () {
	            var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
	            for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++) {
	                var channel = buffer.getChannelData(channelNum);
	                var b0, b1, b2, b3, b4, b5, b6;
	                b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0;
	                for (var i = 0; i < bufferLength; i++) {
	                    var white = Math.random() * 2 - 1;
	                    b0 = 0.99886 * b0 + white * 0.0555179;
	                    b1 = 0.99332 * b1 + white * 0.0750759;
	                    b2 = 0.969 * b2 + white * 0.153852;
	                    b3 = 0.8665 * b3 + white * 0.3104856;
	                    b4 = 0.55 * b4 + white * 0.5329522;
	                    b5 = -0.7616 * b5 - white * 0.016898;
	                    channel[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
	                    channel[i] *= 0.11;
	                    // (roughly) compensate for gain
	                    b6 = white * 0.115926;
	                }
	            }
	            return buffer;
	        }();
	        _brownNoise = function () {
	            var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
	            for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++) {
	                var channel = buffer.getChannelData(channelNum);
	                var lastOut = 0;
	                for (var i = 0; i < bufferLength; i++) {
	                    var white = Math.random() * 2 - 1;
	                    channel[i] = (lastOut + 0.02 * white) / 1.02;
	                    lastOut = channel[i];
	                    channel[i] *= 3.5;    // (roughly) compensate for gain
	                }
	            }
	            return buffer;
	        }();
	        _whiteNoise = function () {
	            var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
	            for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++) {
	                var channel = buffer.getChannelData(channelNum);
	                for (var i = 0; i < bufferLength; i++) {
	                    channel[i] = Math.random() * 2 - 1;
	                }
	            }
	            return buffer;
	        }();
	    });
	    return Tone.Noise;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.NoiseSynth is composed of a noise generator (Tone.Noise), one filter (Tone.Filter), 
		 *          and two envelopes (Tone.Envelop). One envelope controls the amplitude
		 *          of the noise and the other is controls the cutoff frequency of the filter. 
		 *          <img src="https://docs.google.com/drawings/d/1rqzuX9rBlhT50MRvD2TKml9bnZhcZmzXF1rf_o7vdnE/pub?w=918&h=242">
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 * @example
		 * var noiseSynth = new Tone.NoiseSynth().toMaster();
		 * noiseSynth.triggerAttackRelease("8n");
		 */
	    Tone.NoiseSynth = function (options) {
	        //get the defaults
	        options = this.defaultArg(options, Tone.NoiseSynth.defaults);
	        Tone.Instrument.call(this, options);
	        /**
			 *  The noise source.
			 *  @type {Tone.Noise}
			 *  @example
			 * noiseSynth.set("noise.type", "brown");
			 */
	        this.noise = new Tone.Noise();
	        /**
			 *  The filter. 
			 *  @type {Tone.Filter}
			 */
	        this.filter = new Tone.Filter(options.filter);
	        /**
			 *  The filter envelope. 
			 *  @type {Tone.ScaledEnvelope}
			 */
	        this.filterEnvelope = new Tone.ScaledEnvelope(options.filterEnvelope);
	        /**
			 *  The amplitude envelope. 
			 *  @type {Tone.AmplitudeEnvelope}
			 */
	        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
	        //connect the noise to the output
	        this.noise.chain(this.filter, this.envelope, this.output);
	        //start the noise
	        this.noise.start();
	        //connect the filter envelope
	        this.filterEnvelope.connect(this.filter.frequency);
	        this._readOnly([
	            'noise',
	            'filter',
	            'filterEnvelope',
	            'envelope'
	        ]);
	    };
	    Tone.extend(Tone.NoiseSynth, Tone.Instrument);
	    /**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
	    Tone.NoiseSynth.defaults = {
	        'noise': { 'type': 'white' },
	        'filter': {
	            'Q': 6,
	            'type': 'highpass',
	            'rolloff': -24
	        },
	        'envelope': {
	            'attack': 0.005,
	            'decay': 0.1,
	            'sustain': 0
	        },
	        'filterEnvelope': {
	            'attack': 0.06,
	            'decay': 0.2,
	            'sustain': 0,
	            'release': 2,
	            'min': 20,
	            'max': 4000,
	            'exponent': 2
	        }
	    };
	    /**
		 *  Start the attack portion of the envelopes. Unlike other 
		 *  instruments, Tone.NoiseSynth doesn't have a note. 
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {number} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.NoiseSynth} this
		 *  @example
		 * noiseSynth.triggerAttack();
		 */
	    Tone.NoiseSynth.prototype.triggerAttack = function (time, velocity) {
	        //the envelopes
	        this.envelope.triggerAttack(time, velocity);
	        this.filterEnvelope.triggerAttack(time);
	        return this;
	    };
	    /**
		 *  Start the release portion of the envelopes.
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.NoiseSynth} this
		 */
	    Tone.NoiseSynth.prototype.triggerRelease = function (time) {
	        this.envelope.triggerRelease(time);
	        this.filterEnvelope.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  Trigger the attack and then the release. 
		 *  @param  {Time} duration the duration of the note
		 *  @param  {Time} [time=now]     the time of the attack
		 *  @param  {number} [velocity=1] the velocity
		 *  @returns {Tone.NoiseSynth} this
		 */
	    Tone.NoiseSynth.prototype.triggerAttackRelease = function (duration, time, velocity) {
	        time = this.toSeconds(time);
	        duration = this.toSeconds(duration);
	        this.triggerAttack(time, velocity);
	        this.triggerRelease(time + duration);
	        return this;
	    };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.NoiseSynth} this
		 */
	    Tone.NoiseSynth.prototype.dispose = function () {
	        Tone.Instrument.prototype.dispose.call(this);
	        this._writable([
	            'noise',
	            'filter',
	            'filterEnvelope',
	            'envelope'
	        ]);
	        this.noise.dispose();
	        this.noise = null;
	        this.envelope.dispose();
	        this.envelope = null;
	        this.filterEnvelope.dispose();
	        this.filterEnvelope = null;
	        this.filter.dispose();
	        this.filter = null;
	        return this;
	    };
	    return Tone.NoiseSynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Karplus-String string synthesis. Often out of tune. 
		 *         Will change when the AudioWorkerNode is available across
		 *         browsers. 
		 *  
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} [options] see the defaults
		 *  @example
		 * var plucky = new Tone.PluckSynth().toMaster();
		 * plucky.triggerAttack("C4");
		 */
	    Tone.PluckSynth = function (options) {
	        options = this.defaultArg(options, Tone.PluckSynth.defaults);
	        Tone.Instrument.call(this, options);
	        /**
			 *  @type {Tone.Noise}
			 *  @private
			 */
	        this._noise = new Tone.Noise('pink');
	        /**
			 *  The amount of noise at the attack. 
			 *  Nominal range of [0.1, 20]
			 *  @type {number}
			 */
	        this.attackNoise = 1;
	        /**
			 *  the LFCF
			 *  @type {Tone.LowpassCombFilter}
			 *  @private
			 */
	        this._lfcf = new Tone.LowpassCombFilter({
	            'resonance': options.resonance,
	            'dampening': options.dampening
	        });
	        /**
			 *  The resonance control. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.resonance = this._lfcf.resonance;
	        /**
			 *  The dampening control. i.e. the lowpass filter frequency of the comb filter
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.dampening = this._lfcf.dampening;
	        //connections
	        this._noise.connect(this._lfcf);
	        this._lfcf.connect(this.output);
	        this._readOnly([
	            'resonance',
	            'dampening'
	        ]);
	    };
	    Tone.extend(Tone.PluckSynth, Tone.Instrument);
	    /**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.PluckSynth.defaults = {
	        'attackNoise': 1,
	        'dampening': 4000,
	        'resonance': 0.9
	    };
	    /**
		 *  Trigger the note. 
		 *  @param {Frequency} note The note to trigger.
		 *  @param {Time} [time=now] When the note should be triggered.
		 *  @returns {Tone.PluckSynth} this
		 */
	    Tone.PluckSynth.prototype.triggerAttack = function (note, time) {
	        note = this.toFrequency(note);
	        time = this.toSeconds(time);
	        var delayAmount = 1 / note;
	        this._lfcf.delayTime.setValueAtTime(delayAmount, time);
	        this._noise.start(time);
	        this._noise.stop(time + delayAmount * this.attackNoise);
	        return this;
	    };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.PluckSynth} this
		 */
	    Tone.PluckSynth.prototype.dispose = function () {
	        Tone.Instrument.prototype.dispose.call(this);
	        this._noise.dispose();
	        this._lfcf.dispose();
	        this._noise = null;
	        this._lfcf = null;
	        this._writable([
	            'resonance',
	            'dampening'
	        ]);
	        this.dampening = null;
	        this.resonance = null;
	        return this;
	    };
	    return Tone.PluckSynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.PolySynth handles voice creation and allocation for any
		 *          instruments passed in as the second paramter. PolySynth is 
		 *          not a synthesizer by itself, it merely manages voices of 
		 *          one of the other types of synths, allowing any of the 
		 *          monophonic synthesizers to be polyphonic. 
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {number|Object} [polyphony=4] The number of voices to create
		 *  @param {function} [voice=Tone.MonoSynth] The constructor of the voices
		 *                                            uses Tone.MonoSynth by default. 
		 *  @example
		 * //a polysynth composed of 6 Voices of MonoSynth
		 * var synth = new Tone.PolySynth(6, Tone.MonoSynth).toMaster();
		 * //set the attributes using the set interface
		 * synth.set("detune", -1200);
		 * //play a chord
		 * synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
		 */
	    Tone.PolySynth = function () {
	        Tone.Instrument.call(this);
	        var options = this.optionsObject(arguments, [
	            'polyphony',
	            'voice'
	        ], Tone.PolySynth.defaults);
	        /**
			 *  the array of voices
			 *  @type {Array}
			 */
	        this.voices = new Array(options.polyphony);
	        /**
			 *  the queue of free voices
			 *  @private
			 *  @type {Array}
			 */
	        this._freeVoices = [];
	        /**
			 *  keeps track of which notes are down
			 *  @private
			 *  @type {Object}
			 */
	        this._activeVoices = {};
	        //create the voices
	        for (var i = 0; i < options.polyphony; i++) {
	            var v = new options.voice(arguments[2], arguments[3]);
	            this.voices[i] = v;
	            v.connect(this.output);
	        }
	        //make a copy of the voices
	        this._freeVoices = this.voices.slice(0);    //get the prototypes and properties
	    };
	    Tone.extend(Tone.PolySynth, Tone.Instrument);
	    /**
		 *  the defaults
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
	    Tone.PolySynth.defaults = {
	        'polyphony': 4,
	        'voice': Tone.MonoSynth
	    };
	    /**
		 *  Trigger the attack portion of the note
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} [time=now]  The start time of the note.
		 *  @param {number} [velocity=1] The velocity of the note.
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * //trigger a chord immediately with a velocity of 0.2
		 * poly.triggerAttack(["Ab3", "C4", "F5"], undefined, 0.2);
		 */
	    Tone.PolySynth.prototype.triggerAttack = function (notes, time, velocity) {
	        if (!Array.isArray(notes)) {
	            notes = [notes];
	        }
	        for (var i = 0; i < notes.length; i++) {
	            var val = notes[i];
	            var stringified = JSON.stringify(val);
	            if (this._activeVoices[stringified]) {
	                this._activeVoices[stringified].triggerAttack(val, time, velocity);
	            } else if (this._freeVoices.length > 0) {
	                var voice = this._freeVoices.shift();
	                voice.triggerAttack(val, time, velocity);
	                this._activeVoices[stringified] = voice;
	            }
	        }
	        return this;
	    };
	    /**
		 *  Trigger the attack and release after the specified duration
		 *  
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} duration the duration of the note
		 *  @param  {Time} [time=now]     if no time is given, defaults to now
		 *  @param  {number} [velocity=1] the velocity of the attack (0-1)
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * //trigger a chord for a duration of a half note 
		 * poly.triggerAttackRelease(["Eb3", "G4", "C5"], "2n");
		 */
	    Tone.PolySynth.prototype.triggerAttackRelease = function (notes, duration, time, velocity) {
	        time = this.toSeconds(time);
	        this.triggerAttack(notes, time, velocity);
	        this.triggerRelease(notes, time + this.toSeconds(duration));
	        return this;
	    };
	    /**
		 *  Trigger the release of the note. Unlike monophonic instruments, 
		 *  a note (or array of notes) needs to be passed in as the first argument.
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} [time=now]  When the release will be triggered. 
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * poly.triggerAttack(["Ab3", "C4", "F5"]);
		 */
	    Tone.PolySynth.prototype.triggerRelease = function (notes, time) {
	        if (!Array.isArray(notes)) {
	            notes = [notes];
	        }
	        for (var i = 0; i < notes.length; i++) {
	            //get the voice
	            var stringified = JSON.stringify(notes[i]);
	            var voice = this._activeVoices[stringified];
	            if (voice) {
	                voice.triggerRelease(time);
	                this._freeVoices.push(voice);
	                delete this._activeVoices[stringified];
	                voice = null;
	            }
	        }
	        return this;
	    };
	    /**
		 *  Set a member/attribute of the voices. 
		 *  @param {Object|string} params
		 *  @param {number=} value
		 *  @param {Time=} rampTime
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * poly.set({
		 * 	"filter" : {
		 * 		"type" : "highpass"
		 * 	},
		 * 	"envelope" : {
		 * 		"attack" : 0.25
		 * 	}
		 * });
		 */
	    Tone.PolySynth.prototype.set = function (params, value, rampTime) {
	        for (var i = 0; i < this.voices.length; i++) {
	            this.voices[i].set(params, value, rampTime);
	        }
	        return this;
	    };
	    /**
		 *  Get the synth's attributes. Given no arguments get
		 *  will return all available object properties and their corresponding
		 *  values. Pass in a single attribute to retrieve or an array
		 *  of attributes. The attribute strings can also include a "."
		 *  to access deeper properties.
		 *  @param {Array=} params the parameters to get, otherwise will return 
		 *  					   all available.
		 */
	    Tone.PolySynth.prototype.get = function (params) {
	        return this.voices[0].get(params);
	    };
	    /**
		 *  @param {string} presetName the preset name
		 *  @returns {Tone.PolySynth} this
		 *  @private
		 */
	    Tone.PolySynth.prototype.setPreset = function (presetName) {
	        for (var i = 0; i < this.voices.length; i++) {
	            this.voices[i].setPreset(presetName);
	        }
	        return this;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.PolySynth} this
		 */
	    Tone.PolySynth.prototype.dispose = function () {
	        Tone.Instrument.prototype.dispose.call(this);
	        for (var i = 0; i < this.voices.length; i++) {
	            this.voices[i].dispose();
	            this.voices[i] = null;
	        }
	        this.voices = null;
	        this._activeVoices = null;
	        this._freeVoices = null;
	        return this;
	    };
	    return Tone.PolySynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Player is an audio file player with start, loop, and stop functions.
		 *  
		 *  @constructor
		 *  @extends {Tone.Source} 
		 *  @param {string|AudioBuffer} url Either the AudioBuffer or the url from
		 *                                  which to load the AudioBuffer
		 *  @param {function=} onload The function to invoke when the buffer is loaded. 
		 *                            Recommended to use Tone.Buffer.onload instead.
		 *  @example
		 * var player = new Tone.Player("./path/to/sample.mp3").toMaster();
		 * Tone.Buffer.onload = function(){
		 * 	player.start();
		 * }
		 */
	    Tone.Player = function () {
	        var options = this.optionsObject(arguments, [
	            'url',
	            'onload'
	        ], Tone.Player.defaults);
	        Tone.Source.call(this, options);
	        /**
			 *  @private
			 *  @type {AudioBufferSourceNode}
			 */
	        this._source = null;
	        /**
			 *  If the file should play as soon
			 *  as the buffer is loaded. 
			 *  @type {boolean}
			 *  @example
			 * //will play as soon as it's loaded
			 * var player = new Tone.Player({
			 * 	"url" : "./path/to/sample.mp3",
			 * 	"autostart" : true,
			 * }).toMaster();
			 */
	        this.autostart = options.autostart;
	        /**
			 *  the buffer
			 *  @private
			 *  @type {Tone.Buffer}
			 */
	        this._buffer = new Tone.Buffer({
	            'url': options.url,
	            'onload': this._onload.bind(this, options.onload),
	            'reverse': options.reverse
	        });
	        /**
			 *  if the buffer should loop once it's over
			 *  @type {boolean}
			 *  @private
			 */
	        this._loop = options.loop;
	        /**
			 *  if 'loop' is true, the loop will start at this position
			 *  @type {Time}
			 *  @private
			 */
	        this._loopStart = options.loopStart;
	        /**
			 *  if 'loop' is true, the loop will end at this position
			 *  @type {Time}
			 *  @private
			 */
	        this._loopEnd = options.loopEnd;
	        /**
			 *  the playback rate
			 *  @private
			 *  @type {number}
			 */
	        this._playbackRate = options.playbackRate;
	        /**
			 *  Enabling retrigger will allow a player to be restarted
			 *  before the the previous 'start' is done playing. Otherwise, 
			 *  successive calls to Tone.Player.start will only start
			 *  the sample if it had played all the way through. 
			 *  @type {boolean}
			 */
	        this.retrigger = options.retrigger;
	    };
	    Tone.extend(Tone.Player, Tone.Source);
	    /**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.Player.defaults = {
	        'onload': Tone.noOp,
	        'playbackRate': 1,
	        'loop': false,
	        'autostart': false,
	        'loopStart': 0,
	        'loopEnd': 0,
	        'retrigger': false,
	        'reverse': false
	    };
	    /**
		 *  Load the audio file as an audio buffer.
		 *  Decodes the audio asynchronously and invokes
		 *  the callback once the audio buffer loads. 
		 *  Note: this does not need to be called, if a url
		 *  was passed in to the constructor. Only use this
		 *  if you want to manually load a new url. 
		 * @param {string} url The url of the buffer to load.
		 *                     Filetype support depends on the
		 *                     browser.
		 *  @param  {function=} callback The function to invoke once
		 *                               the sample is loaded.
		 *  @returns {Tone.Player} this
		 */
	    Tone.Player.prototype.load = function (url, callback) {
	        this._buffer.load(url, this._onload.bind(this, callback));
	        return this;
	    };
	    /**
		 * Internal callback when the buffer is loaded.
		 * @private
		 */
	    Tone.Player.prototype._onload = function (callback) {
	        callback(this);
	        if (this.autostart) {
	            this.start();
	        }
	    };
	    /**
		 *  play the buffer between the desired positions
		 *  
		 *  @private
		 *  @param  {Time} [startTime=now] when the player should start.
		 *  @param  {Time} [offset=0] the offset from the beginning of the sample
		 *                                 to start at. 
		 *  @param  {Time=} duration how long the sample should play. If no duration
		 *                                is given, it will default to the full length 
		 *                                of the sample (minus any offset)
		 *  @returns {Tone.Player} this
		 */
	    Tone.Player.prototype._start = function (startTime, offset, duration) {
	        if (this._buffer.loaded) {
	            //if it's a loop the default offset is the loopstart point
	            if (this._loop) {
	                offset = this.defaultArg(offset, this._loopStart);
	            } else {
	                //otherwise the default offset is 0
	                offset = this.defaultArg(offset, 0);
	            }
	            offset = this.toSeconds(offset);
	            duration = this.defaultArg(duration, this._buffer.duration - offset);
	            //the values in seconds
	            startTime = this.toSeconds(startTime);
	            duration = this.toSeconds(duration);
	            //make the source
	            this._source = this.context.createBufferSource();
	            this._source.buffer = this._buffer.get();
	            //set the looping properties
	            if (this._loop) {
	                this._source.loop = this._loop;
	                this._source.loopStart = this.toSeconds(this._loopStart);
	                this._source.loopEnd = this.toSeconds(this._loopEnd);
	                // this fixes a bug in chrome 42 that breaks looping
	                // https://code.google.com/p/chromium/issues/detail?id=457099
	                duration = 65536;
	            } else {
	                this._nextStop = startTime + duration;
	            }
	            //and other properties
	            this._source.playbackRate.value = this._playbackRate;
	            this._source.onended = this.onended;
	            this._source.connect(this.output);
	            //start it
	            this._source.start(startTime, offset, duration);
	        } else {
	            throw Error('tried to start Player before the buffer was loaded');
	        }
	        return this;
	    };
	    /**
		 *  Stop playback.
		 *  @private
		 *  @param  {Time} [time=now]
		 *  @returns {Tone.Player} this
		 */
	    Tone.Player.prototype._stop = function (time) {
	        if (this._source) {
	            this._source.stop(this.toSeconds(time));
	            this._source = null;
	        }
	        return this;
	    };
	    /**
		 *  Set the loop start and end. Will only loop if loop is 
		 *  set to true. 
		 *  @param {Time} loopStart The loop end time
		 *  @param {Time} loopEnd The loop end time
		 *  @returns {Tone.Player} this
		 *  @example
		 * //loop 0.1 seconds of the file. 
		 * player.setLoopPoints(0.2, 0.3);
		 * player.loop = true;
		 */
	    Tone.Player.prototype.setLoopPoints = function (loopStart, loopEnd) {
	        this.loopStart = loopStart;
	        this.loopEnd = loopEnd;
	        return this;
	    };
	    /**
		 * If loop is true, the loop will start at this position. 
		 * @memberOf Tone.Player#
		 * @type {Time}
		 * @name loopStart
		 */
	    Object.defineProperty(Tone.Player.prototype, 'loopStart', {
	        get: function () {
	            return this._loopStart;
	        },
	        set: function (loopStart) {
	            this._loopStart = loopStart;
	            if (this._source) {
	                this._source.loopStart = this.toSeconds(loopStart);
	            }
	        }
	    });
	    /**
		 * If loop is true, the loop will end at this position.
		 * @memberOf Tone.Player#
		 * @type {Time}
		 * @name loopEnd
		 */
	    Object.defineProperty(Tone.Player.prototype, 'loopEnd', {
	        get: function () {
	            return this._loopEnd;
	        },
	        set: function (loopEnd) {
	            this._loopEnd = loopEnd;
	            if (this._source) {
	                this._source.loopEnd = this.toSeconds(loopEnd);
	            }
	        }
	    });
	    /**
		 * The audio buffer belonging to the player. 
		 * @memberOf Tone.Player#
		 * @type {AudioBuffer}
		 * @name buffer
		 */
	    Object.defineProperty(Tone.Player.prototype, 'buffer', {
	        get: function () {
	            return this._buffer;
	        },
	        set: function (buffer) {
	            this._buffer.set(buffer);
	        }
	    });
	    /**
		 * If the buffer should loop once it's over. 
		 * @memberOf Tone.Player#
		 * @type {boolean}
		 * @name loop
		 */
	    Object.defineProperty(Tone.Player.prototype, 'loop', {
	        get: function () {
	            return this._loop;
	        },
	        set: function (loop) {
	            this._loop = loop;
	            if (this._source) {
	                this._source.loop = loop;
	            }
	        }
	    });
	    /**
		 * The playback speed. 1 is normal speed. 
		 * Note that this is not a Tone.Signal because of a bug in Blink. 
		 * Please star [this issue](https://code.google.com/p/chromium/issues/detail?id=311284)
		 * if this an important thing to you.
		 * @memberOf Tone.Player#
		 * @type {number}
		 * @name playbackRate
		 */
	    Object.defineProperty(Tone.Player.prototype, 'playbackRate', {
	        get: function () {
	            return this._playbackRate;
	        },
	        set: function (rate) {
	            this._playbackRate = rate;
	            if (this._source) {
	                this._source.playbackRate.value = rate;
	            }
	        }
	    });
	    /**
		 * The direction the buffer should play in
		 * @memberOf Tone.Player#
		 * @type {boolean}
		 * @name reverse
		 */
	    Object.defineProperty(Tone.Player.prototype, 'reverse', {
	        get: function () {
	            return this._buffer.reverse;
	        },
	        set: function (rev) {
	            this._buffer.reverse = rev;
	        }
	    });
	    /**
		 *  Dispose and disconnect.
		 *  @return {Tone.Player} this
		 */
	    Tone.Player.prototype.dispose = function () {
	        Tone.Source.prototype.dispose.call(this);
	        if (this._source !== null) {
	            this._source.disconnect();
	            this._source = null;
	        }
	        this._buffer.dispose();
	        this._buffer = null;
	        return this;
	    };
	    return Tone.Player;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class A sampler instrument which plays an audio buffer 
		 *         through an amplitude envelope and a filter envelope. The sampler takes
		 *         an Object in the constructor which maps a sample name to the URL 
		 *         of the sample. Nested Objects will be flattened and can be accessed using
		 *         a dot notation (see the example).
		 *         <img src="https://docs.google.com/drawings/d/1UK-gi_hxzKDz9Dh4ByyOptuagMOQxv52WxN12HwvtW8/pub?w=931&h=241">
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object|string} urls the urls of the audio file
		 *  @param {Object} [options] the options object for the synth
		 *  @example
		 * var sampler = new Sampler({
		 * 	A : {
		 * 		1 : {"./audio/casio/A1.mp3",
		 * 		2 : "./audio/casio/A2.mp3",
		 * 	},
		 * 	"B.1" : "./audio/casio/B1.mp3",
		 * }).toMaster();
		 * 
		 * //listen for when all the samples have loaded
		 * Tone.Buffer.onload = function(){
		 * 	sampler.triggerAttack("A.1", time, velocity);
		 * };
		 */
	    Tone.Sampler = function (urls, options) {
	        options = this.defaultArg(options, Tone.Sampler.defaults);
	        Tone.Instrument.call(this, options);
	        /**
			 *  The sample player.
			 *  @type {Tone.Player}
			 */
	        this.player = new Tone.Player(options.player);
	        this.player.retrigger = true;
	        /**
			 *  the buffers
			 *  @type {Object}
			 *  @private
			 */
	        this._buffers = {};
	        /**
			 *  The amplitude envelope. 
			 *  @type {Tone.AmplitudeEnvelope}
			 */
	        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
	        /**
			 *  The filter envelope. 
			 *  @type {Tone.ScaledEnvelope}
			 */
	        this.filterEnvelope = new Tone.ScaledEnvelope(options.filterEnvelope);
	        /**
			 *  The name of the current sample. 
			 *  @type {string}
			 *  @private
			 */
	        this._sample = options.sample;
	        /**
			 * the private reference to the pitch
			 * @type {number}
			 * @private
			 */
	        this._pitch = options.pitch;
	        /**
			 *  The filter.
			 *  @type {Tone.Filter}
			 */
	        this.filter = new Tone.Filter(options.filter);
	        //connections / setup
	        this._loadBuffers(urls);
	        this.pitch = options.pitch;
	        this.player.chain(this.filter, this.envelope, this.output);
	        this.filterEnvelope.connect(this.filter.frequency);
	        this._readOnly([
	            'player',
	            'filterEnvelope',
	            'envelope',
	            'filter'
	        ]);
	    };
	    Tone.extend(Tone.Sampler, Tone.Instrument);
	    /**
		 *  the default parameters
		 *  @static
		 */
	    Tone.Sampler.defaults = {
	        'sample': 0,
	        'pitch': 0,
	        'player': { 'loop': false },
	        'envelope': {
	            'attack': 0.001,
	            'decay': 0,
	            'sustain': 1,
	            'release': 0.1
	        },
	        'filterEnvelope': {
	            'attack': 0.001,
	            'decay': 0.001,
	            'sustain': 1,
	            'release': 0.5,
	            'min': 20,
	            'max': 20000,
	            'exponent': 2
	        },
	        'filter': { 'type': 'lowpass' }
	    };
	    /**
		 *  load the buffers
		 *  @param   {Object} urls   the urls
		 *  @private
		 */
	    Tone.Sampler.prototype._loadBuffers = function (urls) {
	        if (typeof urls === 'string') {
	            this._buffers['0'] = new Tone.Buffer(urls, function () {
	                this.sample = '0';
	            }.bind(this));
	        } else {
	            urls = this._flattenUrls(urls);
	            for (var buffName in urls) {
	                this._sample = buffName;
	                var urlString = urls[buffName];
	                this._buffers[buffName] = new Tone.Buffer(urlString);
	            }
	        }
	    };
	    /**
		 *  Flatten an object into a single depth object. 
		 *  thanks to https://gist.github.com/penguinboy/762197
		 *  @param   {Object} ob 	
		 *  @return  {Object}    
		 *  @private
		 */
	    Tone.Sampler.prototype._flattenUrls = function (ob) {
	        var toReturn = {};
	        for (var i in ob) {
	            if (!ob.hasOwnProperty(i))
	                continue;
	            if (typeof ob[i] == 'object') {
	                var flatObject = this._flattenUrls(ob[i]);
	                for (var x in flatObject) {
	                    if (!flatObject.hasOwnProperty(x))
	                        continue;
	                    toReturn[i + '.' + x] = flatObject[x];
	                }
	            } else {
	                toReturn[i] = ob[i];
	            }
	        }
	        return toReturn;
	    };
	    /**
		 *  Start the sample and simultaneously trigger the envelopes. 
		 *  @param {string=} sample The name of the sample to trigger, defaults to
		 *                          the last sample used. 
		 *  @param {Time} [time=now] The time when the sample should start
		 *  @param {number} [velocity=1] The velocity of the note
		 *  @returns {Tone.Sampler} this
		 *  @example
		 * sampler.triggerAttack("B.1");
		 */
	    Tone.Sampler.prototype.triggerAttack = function (name, time, velocity) {
	        time = this.toSeconds(time);
	        if (name) {
	            this.sample = name;
	        }
	        this.player.start(time);
	        this.envelope.triggerAttack(time, velocity);
	        this.filterEnvelope.triggerAttack(time);
	        return this;
	    };
	    /**
		 *  Start the release portion of the sample. Will stop the sample once the 
		 *  envelope has fully released. 
		 *  
		 *  @param {Time} [time=now] The time when the note should release
		 *  @returns {Tone.Sampler} this
		 *  @example
		 * sampler.triggerRelease();
		 */
	    Tone.Sampler.prototype.triggerRelease = function (time) {
	        time = this.toSeconds(time);
	        this.filterEnvelope.triggerRelease(time);
	        this.envelope.triggerRelease(time);
	        this.player.stop(this.toSeconds(this.envelope.release) + time);
	        return this;
	    };
	    /**
		 * The name of the sample to trigger.
		 * @memberOf Tone.Sampler#
		 * @type {number|string}
		 * @name sample
		 * @example
		 * //set the sample to "A.2" for next time the sample is triggered
		 * sampler.sample = "A.2";
		 */
	    Object.defineProperty(Tone.Sampler.prototype, 'sample', {
	        get: function () {
	            return this._sample;
	        },
	        set: function (name) {
	            if (this._buffers.hasOwnProperty(name)) {
	                this._sample = name;
	                this.player.buffer = this._buffers[name];
	            } else {
	                throw new Error('Sampler does not have a sample named ' + name);
	            }
	        }
	    });
	    /**
		 * The direction the buffer should play in
		 * @memberOf Tone.Sampler#
		 * @type {boolean}
		 * @name reverse
		 */
	    Object.defineProperty(Tone.Sampler.prototype, 'reverse', {
	        get: function () {
	            for (var i in this._buffers) {
	                return this._buffers[i].reverse;
	            }
	        },
	        set: function (rev) {
	            for (var i in this._buffers) {
	                this._buffers[i].reverse = rev;
	            }
	        }
	    });
	    /**
		 * Repitch the sampled note by some interval (measured
		 * in semi-tones). 
		 * @memberOf Tone.Sampler#
		 * @type {Interval}
		 * @name pitch
		 * @example
		 * sampler.pitch = -12; //down one octave
		 * sampler.pitch = 7; //up a fifth
		 */
	    Object.defineProperty(Tone.Sampler.prototype, 'pitch', {
	        get: function () {
	            return this._pitch;
	        },
	        set: function (interval) {
	            this._pitch = interval;
	            this.player.playbackRate = this.intervalToFrequencyRatio(interval);
	        }
	    });
	    /**
		 *  Clean up.
		 *  @returns {Tone.Sampler} this
		 */
	    Tone.Sampler.prototype.dispose = function () {
	        Tone.Instrument.prototype.dispose.call(this);
	        this._writable([
	            'player',
	            'filterEnvelope',
	            'envelope',
	            'filter'
	        ]);
	        this.player.dispose();
	        this.filterEnvelope.dispose();
	        this.envelope.dispose();
	        this.filter.dispose();
	        this.player = null;
	        this.filterEnvelope = null;
	        this.envelope = null;
	        this.filter = null;
	        for (var sample in this._buffers) {
	            this._buffers[sample].dispose();
	            this._buffers[sample] = null;
	        }
	        this._buffers = null;
	        return this;
	    };
	    return Tone.Sampler;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.SimpleSynth is composed simply of a Tone.OmniOscillator
		 *          routed through a Tone.AmplitudeEnvelope. 
		 *          <img src="https://docs.google.com/drawings/d/1-1_0YW2Z1J2EPI36P8fNCMcZG7N1w1GZluPs4og4evo/pub?w=1163&h=231">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.SimpleSynth().toMaster();
		 * synth.triggerAttackRelease("C4", "8n");
		 */
	    Tone.SimpleSynth = function (options) {
	        //get the defaults
	        options = this.defaultArg(options, Tone.SimpleSynth.defaults);
	        Tone.Monophonic.call(this, options);
	        /**
			 *  The oscillator.
			 *  @type {Tone.OmniOscillator}
			 */
	        this.oscillator = new Tone.OmniOscillator(options.oscillator);
	        /**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = this.oscillator.frequency;
	        /**
			 *  The detune control.
			 *  @type {Cents}
			 *  @signal
			 */
	        this.detune = this.oscillator.detune;
	        /**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */
	        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
	        //connect the oscillators to the output
	        this.oscillator.chain(this.envelope, this.output);
	        //start the oscillators
	        this.oscillator.start();
	        this._readOnly([
	            'oscillator',
	            'frequency',
	            'detune',
	            'envelope'
	        ]);
	    };
	    Tone.extend(Tone.SimpleSynth, Tone.Monophonic);
	    /**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
	    Tone.SimpleSynth.defaults = {
	        'oscillator': { 'type': 'triangle' },
	        'envelope': {
	            'attack': 0.005,
	            'decay': 0.1,
	            'sustain': 0.3,
	            'release': 1
	        }
	    };
	    /**
		 *  start the attack portion of the envelope
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {number} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.SimpleSynth} this
		 *  @private
		 */
	    Tone.SimpleSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
	        //the envelopes
	        this.envelope.triggerAttack(time, velocity);
	        return this;
	    };
	    /**
		 *  start the release portion of the envelope
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.SimpleSynth} this
		 *  @private
		 */
	    Tone.SimpleSynth.prototype._triggerEnvelopeRelease = function (time) {
	        this.envelope.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.SimpleSynth} this
		 */
	    Tone.SimpleSynth.prototype.dispose = function () {
	        Tone.Monophonic.prototype.dispose.call(this);
	        this._writable([
	            'oscillator',
	            'frequency',
	            'detune',
	            'envelope'
	        ]);
	        this.oscillator.dispose();
	        this.oscillator = null;
	        this.envelope.dispose();
	        this.envelope = null;
	        this.frequency = null;
	        this.detune = null;
	        return this;
	    };
	    return Tone.SimpleSynth;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class   AMSynth uses the output of one Tone.SimpleSynth to modulate the
		 *          amplitude of another Tone.SimpleSynth. The harmonicity (the ratio between
		 *          the two signals) affects the timbre of the output signal the most.
		 *          Read more about Amplitude Modulation Synthesis on [SoundOnSound](http://www.soundonsound.com/sos/mar00/articles/synthsecrets.htm).
		 *          <img src="https://docs.google.com/drawings/d/1p_os_As-N1bpnK8u55gXlgVw3U7BfquLX0Wj57kSZXY/pub?w=1009&h=457">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.SimpleAM().toMaster();
		 * synth.triggerAttackRelease("C4", "8n");
		 */
	    Tone.SimpleAM = function (options) {
	        options = this.defaultArg(options, Tone.SimpleAM.defaults);
	        Tone.Monophonic.call(this, options);
	        /**
			 *  The carrier voice. 
			 *  @type {Tone.SimpleSynth}
			 */
	        this.carrier = new Tone.SimpleSynth(options.carrier);
	        /**
			 *  The modulator voice. 
			 *  @type {Tone.SimpleSynth}
			 */
	        this.modulator = new Tone.SimpleSynth(options.modulator);
	        /**
			 *  the frequency control
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
	        /**
			 *  The ratio between the carrier and the modulator frequencies. A value of 1
			 *  makes both voices in unison, a value of 0.5 puts the modulator an octave below
			 *  the carrier.
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //set the modulator an octave above the carrier frequency
			 * simpleAM.harmonicity.value = 2;
			 */
	        this.harmonicity = new Tone.Multiply(options.harmonicity);
	        this.harmonicity.units = Tone.Type.Positive;
	        /**
			 *  convert the -1,1 output to 0,1
			 *  @type {Tone.AudioToGain}
			 *  @private
			 */
	        this._modulationScale = new Tone.AudioToGain();
	        /**
			 *  the node where the modulation happens
			 *  @type {GainNode}
			 *  @private
			 */
	        this._modulationNode = this.context.createGain();
	        //control the two voices frequency
	        this.frequency.connect(this.carrier.frequency);
	        this.frequency.chain(this.harmonicity, this.modulator.frequency);
	        this.modulator.chain(this._modulationScale, this._modulationNode.gain);
	        this.carrier.chain(this._modulationNode, this.output);
	        this._readOnly([
	            'carrier',
	            'modulator',
	            'frequency',
	            'harmonicity'
	        ]);
	    };
	    Tone.extend(Tone.SimpleAM, Tone.Monophonic);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.SimpleAM.defaults = {
	        'harmonicity': 3,
	        'carrier': {
	            'volume': -10,
	            'portamento': 0,
	            'oscillator': { 'type': 'sine' },
	            'envelope': {
	                'attack': 0.01,
	                'decay': 0.01,
	                'sustain': 1,
	                'release': 0.5
	            }
	        },
	        'modulator': {
	            'volume': -10,
	            'portamento': 0,
	            'oscillator': { 'type': 'sine' },
	            'envelope': {
	                'attack': 0.5,
	                'decay': 0.1,
	                'sustain': 1,
	                'release': 0.5
	            }
	        }
	    };
	    /**
		 *  trigger the attack portion of the note
		 *  
		 *  @param  {Time} [time=now] the time the note will occur
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.SimpleAM} this
		 *  @private
		 */
	    Tone.SimpleAM.prototype._triggerEnvelopeAttack = function (time, velocity) {
	        //the port glide
	        time = this.toSeconds(time);
	        //the envelopes
	        this.carrier.envelope.triggerAttack(time, velocity);
	        this.modulator.envelope.triggerAttack(time);
	        return this;
	    };
	    /**
		 *  trigger the release portion of the note
		 *  
		 *  @param  {Time} [time=now] the time the note will release
		 *  @returns {Tone.SimpleAM} this
		 *  @private
		 */
	    Tone.SimpleAM.prototype._triggerEnvelopeRelease = function (time) {
	        this.carrier.triggerRelease(time);
	        this.modulator.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.SimpleAM} this
		 */
	    Tone.SimpleAM.prototype.dispose = function () {
	        Tone.Monophonic.prototype.dispose.call(this);
	        this._writable([
	            'carrier',
	            'modulator',
	            'frequency',
	            'harmonicity'
	        ]);
	        this.carrier.dispose();
	        this.carrier = null;
	        this.modulator.dispose();
	        this.modulator = null;
	        this.frequency.dispose();
	        this.frequency = null;
	        this.harmonicity.dispose();
	        this.harmonicity = null;
	        this._modulationScale.dispose();
	        this._modulationScale = null;
	        this._modulationNode.disconnect();
	        this._modulationNode = null;
	        return this;
	    };
	    return Tone.SimpleAM;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  SimpleFM is composed of two Tone.SimpleSynths where one Tone.SimpleSynth modulates
		 *          the frequency of a second Tone.SimpleSynth. A lot of spectral content 
		 *          can be explored using the Tone.FMSynth.modulationIndex parameter. Read more about
		 *          frequency modulation synthesis on [SoundOnSound](http://www.soundonsound.com/sos/apr00/articles/synthsecrets.htm).
		 *          <img src="https://docs.google.com/drawings/d/1hSU25lLjDk_WJ59DSitQm6iCRpcMWVEAYqBjwmqtRVw/pub?w=902&h=462">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var fmSynth = new Tone.SimpleFM().toMaster();
		 * fmSynth.triggerAttackRelease("C4", "8n");
		 */
	    Tone.SimpleFM = function (options) {
	        options = this.defaultArg(options, Tone.SimpleFM.defaults);
	        Tone.Monophonic.call(this, options);
	        /**
			 *  The carrier voice. 
			 *  @type {Tone.SimpleSynth}
			 */
	        this.carrier = new Tone.SimpleSynth(options.carrier);
	        this.carrier.volume.value = -10;
	        /**
			 *  The modulator voice. 
			 *  @type {Tone.SimpleSynth}
			 */
	        this.modulator = new Tone.SimpleSynth(options.modulator);
	        this.modulator.volume.value = -10;
	        /**
			 *  the frequency control
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
	        /**
			 *  Harmonicity is the ratio between the two voices. A harmonicity of
			 *  1 is no change. Harmonicity = 2 means a change of an octave. 
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch voice1 an octave below voice0
			 * synth.harmonicity.value = 0.5;
			 */
	        this.harmonicity = new Tone.Multiply(options.harmonicity);
	        this.harmonicity.units = Tone.Type.Positive;
	        /**
			 *  The modulation index which is in essence the depth or amount of the modulation. In other terms it is the 
			 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the 
			 *  modulating signal (ma) -- as in ma/mf. 
			 *	@type {Positive}
			 *	@signal
			 */
	        this.modulationIndex = new Tone.Multiply(options.modulationIndex);
	        this.modulationIndex.units = Tone.Type.Positive;
	        /**
			 *  the node where the modulation happens
			 *  @type {GainNode}
			 *  @private
			 */
	        this._modulationNode = this.context.createGain();
	        //control the two voices frequency
	        this.frequency.connect(this.carrier.frequency);
	        this.frequency.chain(this.harmonicity, this.modulator.frequency);
	        this.frequency.chain(this.modulationIndex, this._modulationNode);
	        this.modulator.connect(this._modulationNode.gain);
	        this._modulationNode.gain.value = 0;
	        this._modulationNode.connect(this.carrier.frequency);
	        this.carrier.connect(this.output);
	        this._readOnly([
	            'carrier',
	            'modulator',
	            'frequency',
	            'harmonicity',
	            'modulationIndex'
	        ]);
	        ;
	    };
	    Tone.extend(Tone.SimpleFM, Tone.Monophonic);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.SimpleFM.defaults = {
	        'harmonicity': 3,
	        'modulationIndex': 10,
	        'carrier': {
	            'volume': -10,
	            'portamento': 0,
	            'oscillator': { 'type': 'sine' },
	            'envelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            }
	        },
	        'modulator': {
	            'volume': -10,
	            'portamento': 0,
	            'oscillator': { 'type': 'triangle' },
	            'envelope': {
	                'attack': 0.01,
	                'decay': 0,
	                'sustain': 1,
	                'release': 0.5
	            }
	        }
	    };
	    /**
		 *  trigger the attack portion of the note
		 *  
		 *  @param  {Time} [time=now] the time the note will occur
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.SimpleFM} this
		 *  @private
		 */
	    Tone.SimpleFM.prototype._triggerEnvelopeAttack = function (time, velocity) {
	        //the port glide
	        time = this.toSeconds(time);
	        //the envelopes
	        this.carrier.envelope.triggerAttack(time, velocity);
	        this.modulator.envelope.triggerAttack(time);
	        return this;
	    };
	    /**
		 *  trigger the release portion of the note
		 *  
		 *  @param  {Time} [time=now] the time the note will release
		 *  @returns {Tone.SimpleFM} this
		 *  @private
		 */
	    Tone.SimpleFM.prototype._triggerEnvelopeRelease = function (time) {
	        this.carrier.triggerRelease(time);
	        this.modulator.triggerRelease(time);
	        return this;
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.SimpleFM} this
		 */
	    Tone.SimpleFM.prototype.dispose = function () {
	        Tone.Monophonic.prototype.dispose.call(this);
	        this._writable([
	            'carrier',
	            'modulator',
	            'frequency',
	            'harmonicity',
	            'modulationIndex'
	        ]);
	        this.carrier.dispose();
	        this.carrier = null;
	        this.modulator.dispose();
	        this.modulator = null;
	        this.frequency.dispose();
	        this.frequency = null;
	        this.modulationIndex.dispose();
	        this.modulationIndex = null;
	        this.harmonicity.dispose();
	        this.harmonicity = null;
	        this._modulationNode.disconnect();
	        this._modulationNode = null;
	        return this;
	    };
	    return Tone.SimpleFM;
	});
	Module(function (Tone) {
	    
	    /**
		 * 	@class  Tone.Effect is the base class for effects. Connect the effect between
		 * 	        the effectSend and effectReturn GainNodes, then control the amount of
		 * 	        effect which goes to the output using the wet control.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {NormalRange|Object} [wet] The starting wet value. 
		 */
	    Tone.Effect = function () {
	        Tone.call(this);
	        //get all of the defaults
	        var options = this.optionsObject(arguments, ['wet'], Tone.Effect.defaults);
	        /**
			 *  the drywet knob to control the amount of effect
			 *  @type {Tone.CrossFade}
			 *  @private
			 */
	        this._dryWet = new Tone.CrossFade(options.wet);
	        /**
			 *  The wet control is how much of the effected
			 *  will pass through to the output. 1 = 100% effected
			 *  signal, 0 = 100% dry signal. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.wet = this._dryWet.fade;
	        /**
			 *  connect the effectSend to the input of hte effect
			 *  @type {GainNode}
			 *  @private
			 */
	        this.effectSend = this.context.createGain();
	        /**
			 *  connect the output of the effect to the effectReturn
			 *  @type {GainNode}
			 *  @private
			 */
	        this.effectReturn = this.context.createGain();
	        //connections
	        this.input.connect(this._dryWet.a);
	        this.input.connect(this.effectSend);
	        this.effectReturn.connect(this._dryWet.b);
	        this._dryWet.connect(this.output);
	        this._readOnly(['wet']);
	    };
	    Tone.extend(Tone.Effect);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.Effect.defaults = { 'wet': 1 };
	    /**
		 *  chains the effect in between the effectSend and effectReturn
		 *  @param  {Tone} effect
		 *  @private
		 *  @returns {Tone.Effect} this
		 */
	    Tone.Effect.prototype.connectEffect = function (effect) {
	        this.effectSend.chain(effect, this.effectReturn);
	        return this;
	    };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Effect} this
		 */
	    Tone.Effect.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._dryWet.dispose();
	        this._dryWet = null;
	        this.effectSend.disconnect();
	        this.effectSend = null;
	        this.effectReturn.disconnect();
	        this.effectReturn = null;
	        this._writable(['wet']);
	        this.wet = null;
	        return this;
	    };
	    return Tone.Effect;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.AutoFilter is a Tone.Filter with a Tone.LFO connected to the filter cutoff frequency.
		 *         Setting the LFO rate and depth allows for control over the filter modulation rate 
		 *         and depth.
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {Time|Object} [frequency] The rate of the LFO.
		 *  @param {Frequency} [min] The lower value of the LFOs oscillation
	 	 *  @param {Frequency} [max] The upper value of the LFOs oscillation. 
		 *  @example
		 * //create an autofilter and start it's LFO
		 * var autoFilter = new Tone.AutoFilter("4n").toMaster().start();
		 * //route an oscillator through the filter and start it
		 * var oscillator = new Tone.Oscillator().connect(autoFilter).start();
		 */
	    Tone.AutoFilter = function () {
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'min',
	            'max'
	        ], Tone.AutoFilter.defaults);
	        Tone.Effect.call(this, options);
	        /**
			 *  the lfo which drives the filter cutoff
			 *  @type {Tone.LFO}
			 *  @private
			 */
	        this._lfo = new Tone.LFO({
	            'frequency': options.frequency,
	            'amplitude': options.depth,
	            'min': options.min,
	            'max': options.max
	        });
	        /**
			 * The range of the filter modulating between the min and max frequency. 
			 * 0 = no modulation. 1 = full modulation.
			 * @type {NormalRange}
			 * @signal
			 */
	        this.depth = this._lfo.amplitude;
	        /**
			 * How fast the filter modulates between min and max. 
			 * @type {Frequency}
			 * @signal
			 */
	        this.frequency = this._lfo.frequency;
	        /**
			 *  The filter node
			 *  @type {Tone.Filter}
			 */
	        this.filter = new Tone.Filter(options.filter);
	        //connections
	        this.connectEffect(this.filter);
	        this._lfo.connect(this.filter.frequency);
	        this.type = options.type;
	        this._readOnly([
	            'frequency',
	            'depth'
	        ]);
	    };
	    //extend Effect
	    Tone.extend(Tone.AutoFilter, Tone.Effect);
	    /**
		 *  defaults
		 *  @static
		 *  @type {Object}
		 */
	    Tone.AutoFilter.defaults = {
	        'frequency': 1,
	        'type': 'sine',
	        'depth': 1,
	        'min': 200,
	        'max': 1200,
	        'filter': {
	            'type': 'lowpass',
	            'rolloff': -12,
	            'Q': 1
	        }
	    };
	    /**
		 * Start the effect.
		 * @param {Time} [time=now] When the LFO will start. 
		 * @returns {Tone.AutoFilter} this
		 */
	    Tone.AutoFilter.prototype.start = function (time) {
	        this._lfo.start(time);
	        return this;
	    };
	    /**
		 * Stop the effect.
		 * @param {Time} [time=now] When the LFO will stop. 
		 * @returns {Tone.AutoFilter} this
		 */
	    Tone.AutoFilter.prototype.stop = function (time) {
	        this._lfo.stop(time);
	        return this;
	    };
	    /**
		 * Sync the filter to the transport.
		 * @param {Time} [delay=0] Delay time before starting the effect after the
		 *                               Transport has started. 
		 * @returns {Tone.AutoFilter} this
		 */
	    Tone.AutoFilter.prototype.sync = function (delay) {
	        this._lfo.sync(delay);
	        return this;
	    };
	    /**
		 * Unsync the filter from the transport.
		 * @returns {Tone.AutoFilter} this
		 */
	    Tone.AutoFilter.prototype.unsync = function () {
	        this._lfo.unsync();
	        return this;
	    };
	    /**
		 * Type of oscillator attached to the AutoFilter. 
		 * Possible values: "sine", "square", "triangle", "sawtooth".
		 * @memberOf Tone.AutoFilter#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.AutoFilter.prototype, 'type', {
	        get: function () {
	            return this._lfo.type;
	        },
	        set: function (type) {
	            this._lfo.type = type;
	        }
	    });
	    /**
		 * The minimum value of the LFO attached to the cutoff frequency of the filter.
		 * @memberOf Tone.AutoFilter#
		 * @type {Frequency}
		 * @name min
		 */
	    Object.defineProperty(Tone.AutoFilter.prototype, 'min', {
	        get: function () {
	            return this._lfo.min;
	        },
	        set: function (min) {
	            this._lfo.min = min;
	        }
	    });
	    /**
		 * The minimum value of the LFO attached to the cutoff frequency of the filter.
		 * @memberOf Tone.AutoFilter#
		 * @type {Frequency}
		 * @name max
		 */
	    Object.defineProperty(Tone.AutoFilter.prototype, 'max', {
	        get: function () {
	            return this._lfo.max;
	        },
	        set: function (max) {
	            this._lfo.max = max;
	        }
	    });
	    /**
		 *  Clean up. 
		 *  @returns {Tone.AutoFilter} this
		 */
	    Tone.AutoFilter.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._lfo.dispose();
	        this._lfo = null;
	        this.filter.dispose();
	        this.filter = null;
	        this._writable([
	            'frequency',
	            'depth'
	        ]);
	        this.frequency = null;
	        this.depth = null;
	        return this;
	    };
	    return Tone.AutoFilter;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.AutoPanner is a Tone.Panner with an LFO connected to the pan amount. 
		 *         More on using autopanners [here](https://www.ableton.com/en/blog/autopan-chopper-effect-and-more-liveschool/).
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {Frequency|Object} [frequency] Rate of left-right oscillation. 
		 *  @example
		 * //create an autopanner and start it's LFO
		 * var autoPanner = new Tone.AutoPanner("4n").toMaster().start();
		 * //route an oscillator through the panner and start it
		 * var oscillator = new Tone.Oscillator().connect(autoPanner).start();
		 */
	    Tone.AutoPanner = function () {
	        var options = this.optionsObject(arguments, ['frequency'], Tone.AutoPanner.defaults);
	        Tone.Effect.call(this, options);
	        /**
			 *  the lfo which drives the panning
			 *  @type {Tone.LFO}
			 *  @private
			 */
	        this._lfo = new Tone.LFO({
	            'frequency': options.frequency,
	            'amplitude': options.depth,
	            'min': 0,
	            'max': 1,
	            //start at the middle of the cycle
	            'phase': 90
	        });
	        /**
			 * The amount of panning between left and right. 
			 * 0 = always center. 1 = full range between left and right. 
			 * @type {NormalRange}
			 * @signal
			 */
	        this.depth = this._lfo.amplitude;
	        /**
			 *  the panner node which does the panning
			 *  @type {Tone.Panner}
			 *  @private
			 */
	        this._panner = new Tone.Panner();
	        /**
			 * How fast the panner modulates between left and right. 
			 * @type {Frequency}
			 * @signal
			 */
	        this.frequency = this._lfo.frequency;
	        //connections
	        this.connectEffect(this._panner);
	        this._lfo.connect(this._panner.pan);
	        this.type = options.type;
	        this._readOnly([
	            'depth',
	            'frequency'
	        ]);
	    };
	    //extend Effect
	    Tone.extend(Tone.AutoPanner, Tone.Effect);
	    /**
		 *  defaults
		 *  @static
		 *  @type {Object}
		 */
	    Tone.AutoPanner.defaults = {
	        'frequency': 1,
	        'type': 'sine',
	        'depth': 1
	    };
	    /**
		 * Start the effect.
		 * @param {Time} [time=now] When the LFO will start. 
		 * @returns {Tone.AutoPanner} this
		 */
	    Tone.AutoPanner.prototype.start = function (time) {
	        this._lfo.start(time);
	        return this;
	    };
	    /**
		 * Stop the effect.
		 * @param {Time} [time=now] When the LFO will stop. 
		 * @returns {Tone.AutoPanner} this
		 */
	    Tone.AutoPanner.prototype.stop = function (time) {
	        this._lfo.stop(time);
	        return this;
	    };
	    /**
		 * Sync the panner to the transport.
		 * @param {Time} [delay=0] Delay time before starting the effect after the
		 *                               Transport has started. 
		 * @returns {Tone.AutoPanner} this
		 */
	    Tone.AutoPanner.prototype.sync = function (delay) {
	        this._lfo.sync(delay);
	        return this;
	    };
	    /**
		 * Unsync the panner from the transport
		 * @returns {Tone.AutoPanner} this
		 */
	    Tone.AutoPanner.prototype.unsync = function () {
	        this._lfo.unsync();
	        return this;
	    };
	    /**
		 * Type of oscillator attached to the AutoFilter. 
		 * Possible values: "sine", "square", "triangle", "sawtooth".
		 * @memberOf Tone.AutoFilter#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.AutoPanner.prototype, 'type', {
	        get: function () {
	            return this._lfo.type;
	        },
	        set: function (type) {
	            this._lfo.type = type;
	        }
	    });
	    /**
		 *  clean up
		 *  @returns {Tone.AutoPanner} this
		 */
	    Tone.AutoPanner.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._lfo.dispose();
	        this._lfo = null;
	        this._panner.dispose();
	        this._panner = null;
	        this._writable([
	            'depth',
	            'frequency'
	        ]);
	        this.frequency = null;
	        this.depth = null;
	        return this;
	    };
	    return Tone.AutoPanner;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.AutoWah connects a Tone.Follower to a bandpass filter (Tone.Filter).
		 *          The frequency of the filter is adjusted proportionally to the 
		 *          incoming signal's amplitude. Inspiration from [Tuna.js](https://github.com/Dinahmoe/tuna).
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {Frequency|Object} [baseFrequency] The frequency the filter is set 
		 *                                            to at the low point of the wah
		 *  @param {Positive} [octaves] The number of octaves above the baseFrequency
		 *                                the filter will sweep to when fully open
		 *  @param {Decibels} [sensitivity] The decibel threshold sensitivity for 
		 *                                   the incoming signal. Normal range of -40 to 0. 
		 *  @example
		 * var autoWah = new Tone.AutoWah(50, 6, -30).toMaster();
		 * //initialize the synth and connect to autowah
		 * var synth = new SimpleSynth.connect(autoWah);
		 * //Q value influences the effect of the wah - default is 2
		 * autoWah.Q.value = 6;
		 * //more audible on higher notes
		 * synth.triggerAttackRelease("C4", "8n")
		 */
	    Tone.AutoWah = function () {
	        var options = this.optionsObject(arguments, [
	            'baseFrequency',
	            'octaves',
	            'sensitivity'
	        ], Tone.AutoWah.defaults);
	        Tone.Effect.call(this, options);
	        /**
			 *  The envelope follower. Set the attack/release
			 *  timing to adjust how the envelope is followed. 
			 *  @type {Tone.Follower}
			 *  @private
			 */
	        this.follower = new Tone.Follower(options.follower);
	        /**
			 *  scales the follower value to the frequency domain
			 *  @type {Tone}
			 *  @private
			 */
	        this._sweepRange = new Tone.ScaleExp(0, 1, 0.5);
	        /**
			 *  @type {number}
			 *  @private
			 */
	        this._baseFrequency = options.baseFrequency;
	        /**
			 *  @type {number}
			 *  @private
			 */
	        this._octaves = options.octaves;
	        /**
			 *  the input gain to adjust the sensitivity
			 *  @type {GainNode}
			 *  @private
			 */
	        this._inputBoost = this.context.createGain();
	        /**
			 *  @type {BiquadFilterNode}
			 *  @private
			 */
	        this._bandpass = new Tone.Filter({
	            'rolloff': -48,
	            'frequency': 0,
	            'Q': options.Q
	        });
	        /**
			 *  @type {Tone.Filter}
			 *  @private
			 */
	        this._peaking = new Tone.Filter(0, 'peaking');
	        this._peaking.gain.value = options.gain;
	        /**
			 * The gain of the filter.
			 * @type {Gain}
			 * @signal
			 */
	        this.gain = this._peaking.gain;
	        /**
			 * The quality of the filter.
			 * @type {Positive}
			 * @signal
			 */
	        this.Q = this._bandpass.Q;
	        //the control signal path
	        this.effectSend.chain(this._inputBoost, this.follower, this._sweepRange);
	        this._sweepRange.connect(this._bandpass.frequency);
	        this._sweepRange.connect(this._peaking.frequency);
	        //the filtered path
	        this.effectSend.chain(this._bandpass, this._peaking, this.effectReturn);
	        //set the initial value
	        this._setSweepRange();
	        this.sensitivity = options.sensitivity;
	        this._readOnly([
	            'gain',
	            'Q'
	        ]);
	    };
	    Tone.extend(Tone.AutoWah, Tone.Effect);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.AutoWah.defaults = {
	        'baseFrequency': 100,
	        'octaves': 6,
	        'sensitivity': 0,
	        'Q': 2,
	        'gain': 2,
	        'follower': {
	            'attack': 0.3,
	            'release': 0.5
	        }
	    };
	    /**
		 * The number of octaves that the filter will sweep above the 
		 * baseFrequency. 
		 * @memberOf Tone.AutoWah#
		 * @type {Number}
		 * @name octaves
		 */
	    Object.defineProperty(Tone.AutoWah.prototype, 'octaves', {
	        get: function () {
	            return this._octaves;
	        },
	        set: function (octaves) {
	            this._octaves = octaves;
	            this._setSweepRange();
	        }
	    });
	    /**
		 * The base frequency from which the sweep will start from.
		 * @memberOf Tone.AutoWah#
		 * @type {Frequency}
		 * @name baseFrequency
		 */
	    Object.defineProperty(Tone.AutoWah.prototype, 'baseFrequency', {
	        get: function () {
	            return this._baseFrequency;
	        },
	        set: function (baseFreq) {
	            this._baseFrequency = baseFreq;
	            this._setSweepRange();
	        }
	    });
	    /**
		 * The sensitivity to control how responsive to the input signal the filter is. 
		 * @memberOf Tone.AutoWah#
		 * @type {Decibels}
		 * @name sensitivity
		 */
	    Object.defineProperty(Tone.AutoWah.prototype, 'sensitivity', {
	        get: function () {
	            return this.gainToDb(1 / this._inputBoost.gain.value);
	        },
	        set: function (sensitivy) {
	            this._inputBoost.gain.value = 1 / this.dbToGain(sensitivy);
	        }
	    });
	    /**
		 *  sets the sweep range of the scaler
		 *  @private
		 */
	    Tone.AutoWah.prototype._setSweepRange = function () {
	        this._sweepRange.min = this._baseFrequency;
	        this._sweepRange.max = Math.min(this._baseFrequency * Math.pow(2, this._octaves), this.context.sampleRate / 2);
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.AutoWah} this
		 */
	    Tone.AutoWah.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this.follower.dispose();
	        this.follower = null;
	        this._sweepRange.dispose();
	        this._sweepRange = null;
	        this._bandpass.dispose();
	        this._bandpass = null;
	        this._peaking.dispose();
	        this._peaking = null;
	        this._inputBoost.disconnect();
	        this._inputBoost = null;
	        this._writable([
	            'gain',
	            'Q'
	        ]);
	        this.gain = null;
	        this.Q = null;
	        return this;
	    };
	    return Tone.AutoWah;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Bitcrusher downsamples the incoming signal to a different bitdepth. 
		 *         Lowering the bitdepth of the signal creates distortion. Read more about Bitcrushing
		 *         on [Wikipedia](https://en.wikipedia.org/wiki/Bitcrusher).
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {Number} bits The number of bits to downsample the signal. Nominal range
		 *                       of 1 to 8. 
		 *  @example
		 * //initialize crusher and route a synth through it
		 * var crusher = new Tone.BitCrusher(4).toMaster();
		 * var synth = new Tone.MonoSynth().connect(crusher);
		 */
	    Tone.BitCrusher = function () {
	        var options = this.optionsObject(arguments, ['bits'], Tone.BitCrusher.defaults);
	        Tone.Effect.call(this, options);
	        var invStepSize = 1 / Math.pow(2, options.bits - 1);
	        /**
			 *  Subtract the input signal and the modulus of the input signal
			 *  @type {Tone.Subtract}
			 *  @private
			 */
	        this._subtract = new Tone.Subtract();
	        /**
			 *  The mod function
			 *  @type  {Tone.Modulo}
			 *  @private
			 */
	        this._modulo = new Tone.Modulo(invStepSize);
	        /**
			 *  keeps track of the bits
			 *  @type {number}
			 *  @private
			 */
	        this._bits = options.bits;
	        //connect it up
	        this.effectSend.fan(this._subtract, this._modulo);
	        this._modulo.connect(this._subtract, 0, 1);
	        this._subtract.connect(this.effectReturn);
	    };
	    Tone.extend(Tone.BitCrusher, Tone.Effect);
	    /**
		 *  the default values
		 *  @static
		 *  @type {Object}
		 */
	    Tone.BitCrusher.defaults = { 'bits': 4 };
	    /**
		 * The bit depth of the effect. Nominal range of 1-8. 
		 * @memberOf Tone.BitCrusher#
		 * @type {number}
		 * @name bits
		 */
	    Object.defineProperty(Tone.BitCrusher.prototype, 'bits', {
	        get: function () {
	            return this._bits;
	        },
	        set: function (bits) {
	            this._bits = bits;
	            var invStepSize = 1 / Math.pow(2, bits - 1);
	            this._modulo.value = invStepSize;
	        }
	    });
	    /**
		 *  Clean up. 
		 *  @returns {Tone.BitCrusher} this
		 */
	    Tone.BitCrusher.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._subtract.dispose();
	        this._subtract = null;
	        this._modulo.dispose();
	        this._modulo = null;
	        return this;
	    };
	    return Tone.BitCrusher;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.ChebyShev is a Chebyshev waveshaper, an effect which is good 
		 *         for making different types of distortion sounds.
		 *         Note that odd orders sound very different from even ones, 
		 *         and order = 1 is no change. 
		 *         Read more at [music.columbia.edu](http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_06.php).
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {Positive|Object} [order] The order of the chebyshev polynomial. Normal range between 1-100. 
		 *  @example
		 * //create a new cheby
		 * var cheby = new Tone.Chebyshev(50);
		 * //create a monosynth connected to our cheby
		 * synth = new Tone.MonoSynth().connect(cheby);
		 */
	    Tone.Chebyshev = function () {
	        var options = this.optionsObject(arguments, ['order'], Tone.Chebyshev.defaults);
	        Tone.Effect.call(this);
	        /**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
	        this._shaper = new Tone.WaveShaper(4096);
	        /**
			 * holds onto the order of the filter
			 * @type {number}
			 * @private
			 */
	        this._order = options.order;
	        this.connectEffect(this._shaper);
	        this.order = options.order;
	        this.oversample = options.oversample;
	    };
	    Tone.extend(Tone.Chebyshev, Tone.Effect);
	    /**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.Chebyshev.defaults = {
	        'order': 1,
	        'oversample': 'none'
	    };
	    /**
		 *  get the coefficient for that degree
		 *  @param {number} x the x value
		 *  @param   {number} degree 
		 *  @param {Object} memo memoize the computed value. 
		 *                       this speeds up computation greatly. 
		 *  @return  {number}       the coefficient 
		 *  @private
		 */
	    Tone.Chebyshev.prototype._getCoefficient = function (x, degree, memo) {
	        if (memo.hasOwnProperty(degree)) {
	            return memo[degree];
	        } else if (degree === 0) {
	            memo[degree] = 0;
	        } else if (degree === 1) {
	            memo[degree] = x;
	        } else {
	            memo[degree] = 2 * x * this._getCoefficient(x, degree - 1, memo) - this._getCoefficient(x, degree - 2, memo);
	        }
	        return memo[degree];
	    };
	    /**
		 * The order of the Chebyshev polynomial which creates
		 * the equation which is applied to the incoming 
		 * signal through a Tone.WaveShaper. The equations
		 * are in the form:<br>
		 * order 2: 2x^2 + 1<br>
		 * order 3: 4x^3 + 3x <br>
		 * @memberOf Tone.Chebyshev#
		 * @type {Positive}
		 * @name order
		 */
	    Object.defineProperty(Tone.Chebyshev.prototype, 'order', {
	        get: function () {
	            return this._order;
	        },
	        set: function (order) {
	            this._order = order;
	            var curve = new Array(4096);
	            var len = curve.length;
	            for (var i = 0; i < len; ++i) {
	                var x = i * 2 / len - 1;
	                if (x === 0) {
	                    //should output 0 when input is 0
	                    curve[i] = 0;
	                } else {
	                    curve[i] = this._getCoefficient(x, order, {});
	                }
	            }
	            this._shaper.curve = curve;
	        }
	    });
	    /**
		 * The oversampling of the effect. Can either be "none", "2x" or "4x".
		 * @memberOf Tone.Chebyshev#
		 * @type {string}
		 * @name oversample
		 */
	    Object.defineProperty(Tone.Chebyshev.prototype, 'oversample', {
	        get: function () {
	            return this._shaper.oversample;
	        },
	        set: function (oversampling) {
	            this._shaper.oversample = oversampling;
	        }
	    });
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Chebyshev} this
		 */
	    Tone.Chebyshev.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._shaper.dispose();
	        this._shaper = null;
	        return this;
	    };
	    return Tone.Chebyshev;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Base class for Stereo effects. Provides effectSendL/R and effectReturnL/R. 
		 *
		 *	@constructor
		 *	@extends {Tone.Effect}
		 */
	    Tone.StereoEffect = function () {
	        Tone.call(this);
	        //get the defaults
	        var options = this.optionsObject(arguments, ['wet'], Tone.Effect.defaults);
	        /**
			 *  the drywet knob to control the amount of effect
			 *  @type {Tone.CrossFade}
			 *  @private
			 */
	        this._dryWet = new Tone.CrossFade(options.wet);
	        /**
			 *  The wet control, i.e. how much of the effected
			 *  will pass through to the output. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.wet = this._dryWet.fade;
	        /**
			 *  then split it
			 *  @type {Tone.Split}
			 *  @private
			 */
	        this._split = new Tone.Split();
	        /**
			 *  the effects send LEFT
			 *  @type {GainNode}
			 *  @private
			 */
	        this.effectSendL = this._split.left;
	        /**
			 *  the effects send RIGHT
			 *  @type {GainNode}
			 *  @private
			 */
	        this.effectSendR = this._split.right;
	        /**
			 *  the stereo effect merger
			 *  @type {Tone.Merge}
			 *  @private
			 */
	        this._merge = new Tone.Merge();
	        /**
			 *  the effect return LEFT
			 *  @type {GainNode}
			 *  @private
			 */
	        this.effectReturnL = this._merge.left;
	        /**
			 *  the effect return RIGHT
			 *  @type {GainNode}
			 *  @private
			 */
	        this.effectReturnR = this._merge.right;
	        //connections
	        this.input.connect(this._split);
	        //dry wet connections
	        this.input.connect(this._dryWet, 0, 0);
	        this._merge.connect(this._dryWet, 0, 1);
	        this._dryWet.connect(this.output);
	        this._readOnly(['wet']);
	    };
	    Tone.extend(Tone.StereoEffect, Tone.Effect);
	    /**
		 *  Clean up. 
		 *  @returns {Tone.StereoEffect} this
		 */
	    Tone.StereoEffect.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._dryWet.dispose();
	        this._dryWet = null;
	        this._split.dispose();
	        this._split = null;
	        this._merge.dispose();
	        this._merge = null;
	        this.effectSendL = null;
	        this.effectSendR = null;
	        this.effectReturnL = null;
	        this.effectReturnR = null;
	        this._writable(['wet']);
	        this.wet = null;
	        return this;
	    };
	    return Tone.StereoEffect;
	});
	Module(function (Tone) {
	    
	    /**
		 * 	@class  Tone.FeedbackEffect provides a loop between an 
		 * 	        audio source and its own output. This is a base-class
		 * 	        for feedback effects. 
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {NormalRange|Object} [feedback] The initial feedback value.
		 */
	    Tone.FeedbackEffect = function () {
	        var options = this.optionsObject(arguments, ['feedback']);
	        options = this.defaultArg(options, Tone.FeedbackEffect.defaults);
	        Tone.Effect.call(this, options);
	        /**
			 *  The amount of signal which is fed back into the effect input. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.feedback = new Tone.Signal(options.feedback, Tone.Type.NormalRange);
	        /**
			 *  the gain which controls the feedback
			 *  @type {GainNode}
			 *  @private
			 */
	        this._feedbackGain = this.context.createGain();
	        //the feedback loop
	        this.effectReturn.chain(this._feedbackGain, this.effectSend);
	        this.feedback.connect(this._feedbackGain.gain);
	        this._readOnly(['feedback']);
	    };
	    Tone.extend(Tone.FeedbackEffect, Tone.Effect);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.FeedbackEffect.defaults = { 'feedback': 0.125 };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.FeedbackEffect} this
		 */
	    Tone.FeedbackEffect.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._writable(['feedback']);
	        this.feedback.dispose();
	        this.feedback = null;
	        this._feedbackGain.disconnect();
	        this._feedbackGain = null;
	        return this;
	    };
	    return Tone.FeedbackEffect;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Just like a stereo feedback effect, but the feedback is routed from left to right
		 *         and right to left instead of on the same channel.
		 *
		 *	@constructor
		 *	@extends {Tone.FeedbackEffect}
		 */
	    Tone.StereoXFeedbackEffect = function () {
	        var options = this.optionsObject(arguments, ['feedback'], Tone.FeedbackEffect.defaults);
	        Tone.StereoEffect.call(this, options);
	        /**
			 *  The amount of feedback from the output
			 *  back into the input of the effect (routed
			 *  across left and right channels).
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.feedback = new Tone.Signal(options.feedback, Tone.Type.NormalRange);
	        /**
			 *  the left side feeback
			 *  @type {GainNode}
			 *  @private
			 */
	        this._feedbackLR = this.context.createGain();
	        /**
			 *  the right side feeback
			 *  @type {GainNode}
			 *  @private
			 */
	        this._feedbackRL = this.context.createGain();
	        //connect it up
	        this.effectReturnL.chain(this._feedbackLR, this.effectSendR);
	        this.effectReturnR.chain(this._feedbackRL, this.effectSendL);
	        this.feedback.fan(this._feedbackLR.gain, this._feedbackRL.gain);
	        this._readOnly(['feedback']);
	    };
	    Tone.extend(Tone.StereoXFeedbackEffect, Tone.FeedbackEffect);
	    /**
		 *  clean up
		 *  @returns {Tone.StereoXFeedbackEffect} this
		 */
	    Tone.StereoXFeedbackEffect.prototype.dispose = function () {
	        Tone.StereoEffect.prototype.dispose.call(this);
	        this._writable(['feedback']);
	        this.feedback.dispose();
	        this.feedback = null;
	        this._feedbackLR.disconnect();
	        this._feedbackLR = null;
	        this._feedbackRL.disconnect();
	        this._feedbackRL = null;
	        return this;
	    };
	    return Tone.StereoXFeedbackEffect;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Chorus is a stereo chorus effect with feedback composed of 
		 *         a left and right delay with a Tone.LFO applied to the delayTime of each channel. 
		 *         Inspiration from [Tuna.js](https://github.com/Dinahmoe/tuna/blob/master/tuna.js).
		 *         Read more on the chorus effect on [SoundOnSound](http://www.soundonsound.com/sos/jun04/articles/synthsecrets.htm).
		 *
		 *	@constructor
		 *	@extends {Tone.StereoXFeedbackEffect}
		 *	@param {Frequency|Object} [frequency] The frequency of the LFO.
		 *	@param {Number} [delayTime] The delay of the chorus effect in ms. 
		 *	@param {NormalRange} [depth] The depth of the chorus.
		 *	@example
		 * var chorus = new Tone.Chorus(4, 2.5, 0.5);
		 * var synth = new Tone.PolySynth(4, Tone.MonoSynth).connect(chorus);
		 * synth.triggerAttackRelease(["C3","E3","G3"], "8n");
		 */
	    Tone.Chorus = function () {
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'delayTime',
	            'depth'
	        ], Tone.Chorus.defaults);
	        Tone.StereoXFeedbackEffect.call(this, options);
	        /**
			 *  the depth of the chorus
			 *  @type {number}
			 *  @private
			 */
	        this._depth = options.depth;
	        /**
			 *  the delayTime
			 *  @type {number}
			 *  @private
			 */
	        this._delayTime = options.delayTime / 1000;
	        /**
			 *  the lfo which controls the delayTime
			 *  @type {Tone.LFO}
			 *  @private
			 */
	        this._lfoL = new Tone.LFO(options.rate, 0, 1);
	        /**
			 *  another LFO for the right side with a 180 degree phase diff
			 *  @type {Tone.LFO}
			 *  @private
			 */
	        this._lfoR = new Tone.LFO(options.rate, 0, 1);
	        this._lfoR.phase = 180;
	        /**
			 *  delay for left
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._delayNodeL = this.context.createDelay();
	        /**
			 *  delay for right
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._delayNodeR = this.context.createDelay();
	        /**
			 * The frequency of the LFO which modulates the delayTime. 
			 * @type {Frequency}
			 * @signal
			 */
	        this.frequency = this._lfoL.frequency;
	        //connections
	        this.connectSeries(this.effectSendL, this._delayNodeL, this.effectReturnL);
	        this.connectSeries(this.effectSendR, this._delayNodeR, this.effectReturnR);
	        //and pass through to make the detune apparent
	        this.input.connect(this.output);
	        //lfo setup
	        this._lfoL.connect(this._delayNodeL.delayTime);
	        this._lfoR.connect(this._delayNodeR.delayTime);
	        //start the lfo
	        this._lfoL.start();
	        this._lfoR.start();
	        //have one LFO frequency control the other
	        this._lfoL.frequency.connect(this._lfoR.frequency);
	        //set the initial values
	        this.depth = this._depth;
	        this.frequency.value = options.frequency;
	        this.type = options.type;
	        this._readOnly(['frequency']);
	    };
	    Tone.extend(Tone.Chorus, Tone.StereoXFeedbackEffect);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.Chorus.defaults = {
	        'frequency': 1.5,
	        'delayTime': 3.5,
	        'depth': 0.7,
	        'feedback': 0.1,
	        'type': 'sine'
	    };
	    /**
		 * The depth of the effect. A depth of 1 makes the delayTime
		 * modulate between 0 and 2*delayTime (centered around the delayTime). 
		 * @memberOf Tone.Chorus#
		 * @type {NormalRange}
		 * @name depth
		 */
	    Object.defineProperty(Tone.Chorus.prototype, 'depth', {
	        get: function () {
	            return this._depth;
	        },
	        set: function (depth) {
	            this._depth = depth;
	            var deviation = this._delayTime * depth;
	            this._lfoL.min = Math.max(this._delayTime - deviation, 0);
	            this._lfoL.max = this._delayTime + deviation;
	            this._lfoR.min = Math.max(this._delayTime - deviation, 0);
	            this._lfoR.max = this._delayTime + deviation;
	        }
	    });
	    /**
		 * The delayTime in milliseconds of the chorus. A larger delayTime
		 * will give a more pronounced effect. Nominal range a delayTime
		 * is between 2 and 20ms. 
		 * @memberOf Tone.Chorus#
		 * @type {Number}
		 * @name delayTime
		 */
	    Object.defineProperty(Tone.Chorus.prototype, 'delayTime', {
	        get: function () {
	            return this._delayTime * 1000;
	        },
	        set: function (delayTime) {
	            this._delayTime = delayTime / 1000;
	            this.depth = this._depth;
	        }
	    });
	    /**
		 * The oscillator type of the LFO. 
		 * @memberOf Tone.Chorus#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.Chorus.prototype, 'type', {
	        get: function () {
	            return this._lfoL.type;
	        },
	        set: function (type) {
	            this._lfoL.type = type;
	            this._lfoR.type = type;
	        }
	    });
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Chorus} this
		 */
	    Tone.Chorus.prototype.dispose = function () {
	        Tone.StereoXFeedbackEffect.prototype.dispose.call(this);
	        this._lfoL.dispose();
	        this._lfoL = null;
	        this._lfoR.dispose();
	        this._lfoR = null;
	        this._delayNodeL.disconnect();
	        this._delayNodeL = null;
	        this._delayNodeR.disconnect();
	        this._delayNodeR = null;
	        this._writable('frequency');
	        this.frequency = null;
	        return this;
	    };
	    return Tone.Chorus;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Convolver is a wrapper around the Native Web Audio 
		 *          [ConvolverNode](http://webaudio.github.io/web-audio-api/#the-convolvernode-interface).
		 *          Convolution is useful for reverb and filter emulation. Read more about convolution reverb on
		 *          [Wikipedia](https://en.wikipedia.org/wiki/Convolution_reverb).
		 *  
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {string|Tone.Buffer|Object} [url] The URL of the impulse response or the Tone.Buffer
		 *                                           contianing the impulse response. 
		 *  @example
		 * //initializing the convolver with an impulse response
		 * var convolver = new Tone.Convolver("./path/to/ir.wav");
		 * convolver.toMaster();
		 * //after the buffer has loaded
		 * Tone.Buffer.onload = function(){
		 * 	//testing out convolution with a noise burst
		 * 	var burst = new Tone.NoiseSynth().connect(convolver);
		 * 	burst.triggerAttackRelease("16n");
		 * };
		 */
	    Tone.Convolver = function () {
	        var options = this.optionsObject(arguments, ['url'], Tone.Convolver.defaults);
	        Tone.Effect.call(this, options);
	        /**
			 *  convolver node
			 *  @type {ConvolverNode}
			 *  @private
			 */
	        this._convolver = this.context.createConvolver();
	        /**
			 *  the convolution buffer
			 *  @type {Tone.Buffer}
			 *  @private
			 */
	        this._buffer = new Tone.Buffer(options.url, function (buffer) {
	            this.buffer = buffer;
	            options.onload();
	        }.bind(this));
	        this.connectEffect(this._convolver);
	    };
	    Tone.extend(Tone.Convolver, Tone.Effect);
	    /**
		 *  @static
		 *  @const
		 *  @type  {Object}
		 */
	    Tone.Convolver.defaults = {
	        'url': '',
	        'onload': Tone.noOp
	    };
	    /**
		 *  The convolver's buffer
		 *  @memberOf Tone.Convolver#
		 *  @type {AudioBuffer}
		 *  @name buffer
		 */
	    Object.defineProperty(Tone.Convolver.prototype, 'buffer', {
	        get: function () {
	            return this._buffer.get();
	        },
	        set: function (buffer) {
	            this._buffer.set(buffer);
	            this._convolver.buffer = this._buffer.get();
	        }
	    });
	    /**
		 *  Load an impulse response url as an audio buffer.
		 *  Decodes the audio asynchronously and invokes
		 *  the callback once the audio buffer loads.
		 *  @param {string} url The url of the buffer to load.
		 *                      filetype support depends on the
		 *                      browser.
		 *  @param  {function=} callback
		 *  @returns {Tone.Convolver} this
		 */
	    Tone.Convolver.prototype.load = function (url, callback) {
	        this._buffer.load(url, function (buff) {
	            this.buffer = buff;
	            if (callback) {
	                callback();
	            }
	        }.bind(this));
	        return this;
	    };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Convolver} this
		 */
	    Tone.Convolver.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._convolver.disconnect();
	        this._convolver = null;
	        this._buffer.dispose();
	        this._buffer = null;
	        return this;
	    };
	    return Tone.Convolver;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Distortion is a simple distortion effect using Tone.WaveShaper.
		 *         Algorithm from [a stackoverflow answer](http://stackoverflow.com/a/22313408).
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {Number|Object} [distortion] The amount of distortion (nominal range of 0-1)
		 *  @example
		 * var dist = new Tone.Distortion(0.8).toMaster();
		 * var fm = new Tone.SimpleFM().connect(dist);
		 * //this sounds good on bass notes
		 * fm.triggerAttackRelease("A1", "8n");
		 */
	    Tone.Distortion = function () {
	        var options = this.optionsObject(arguments, ['distortion'], Tone.Distortion.defaults);
	        Tone.Effect.call(this, options);
	        /**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
	        this._shaper = new Tone.WaveShaper(4096);
	        /**
			 * holds the distortion amount
			 * @type {number}
			 * @private
			 */
	        this._distortion = options.distortion;
	        this.connectEffect(this._shaper);
	        this.distortion = options.distortion;
	        this.oversample = options.oversample;
	    };
	    Tone.extend(Tone.Distortion, Tone.Effect);
	    /**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.Distortion.defaults = {
	        'distortion': 0.4,
	        'oversample': 'none'
	    };
	    /**
		 * The amount of distortion. Range between 0-1. 
		 * @memberOf Tone.Distortion#
		 * @type {number}
		 * @name distortion
		 */
	    Object.defineProperty(Tone.Distortion.prototype, 'distortion', {
	        get: function () {
	            return this._distortion;
	        },
	        set: function (amount) {
	            this._distortion = amount;
	            var k = amount * 100;
	            var deg = Math.PI / 180;
	            this._shaper.setMap(function (x) {
	                if (Math.abs(x) < 0.001) {
	                    //should output 0 when input is 0
	                    return 0;
	                } else {
	                    return (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
	                }
	            });
	        }
	    });
	    /**
		 * The oversampling of the effect. Can either be "none", "2x" or "4x".
		 * @memberOf Tone.Distortion#
		 * @type {string}
		 * @name oversample
		 */
	    Object.defineProperty(Tone.Distortion.prototype, 'oversample', {
	        get: function () {
	            return this._shaper.oversample;
	        },
	        set: function (oversampling) {
	            this._shaper.oversample = oversampling;
	        }
	    });
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Distortion} this
		 */
	    Tone.Distortion.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._shaper.dispose();
	        this._shaper = null;
	        return this;
	    };
	    return Tone.Distortion;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.FeedbackDelay is a DelayNode in which part of output
		 *          signal is fed back into the delay. 
		 *
		 *  @constructor
		 *  @extends {Tone.FeedbackEffect}
		 *  @param {Time|Object} [delayTime] The delay applied to the incoming signal. 
		 *  @param {NormalRange=} feedback The amount of the effected signal which 
		 *                            is fed back through the delay.
		 *  @example
		 * var feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toMaster();
		 * var tom = new Tone.DrumSynth({
		 * 	"octaves" : 4,
		 * 	"pitchDecay" : 0.1
		 * }).connect(feedbackDelay);
		 * tom.triggerAttackRelease("A2","32n");
		 */
	    Tone.FeedbackDelay = function () {
	        var options = this.optionsObject(arguments, [
	            'delayTime',
	            'feedback'
	        ], Tone.FeedbackDelay.defaults);
	        Tone.FeedbackEffect.call(this, options);
	        /**
			 *  The delayTime of the DelayNode. 
			 *  @type {Time}
			 *  @signal
			 */
	        this.delayTime = new Tone.Signal(options.delayTime, Tone.Type.Time);
	        /**
			 *  the delay node
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._delayNode = this.context.createDelay(4);
	        // connect it up
	        this.connectEffect(this._delayNode);
	        this.delayTime.connect(this._delayNode.delayTime);
	        this._readOnly(['delayTime']);
	    };
	    Tone.extend(Tone.FeedbackDelay, Tone.FeedbackEffect);
	    /**
		 *  The default values. 
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
	    Tone.FeedbackDelay.defaults = { 'delayTime': 0.25 };
	    /**
		 *  clean up
		 *  @returns {Tone.FeedbackDelay} this
		 */
	    Tone.FeedbackDelay.prototype.dispose = function () {
	        Tone.FeedbackEffect.prototype.dispose.call(this);
	        this.delayTime.dispose();
	        this._delayNode.disconnect();
	        this._delayNode = null;
	        this._writable(['delayTime']);
	        this.delayTime = null;
	        return this;
	    };
	    return Tone.FeedbackDelay;
	});
	Module(function (Tone) {
	    
	    /**
		 *  an array of comb filter delay values from Freeverb implementation
		 *  @static
		 *  @private
		 *  @type {Array}
		 */
	    var combFilterTunings = [
	        1557 / 44100,
	        1617 / 44100,
	        1491 / 44100,
	        1422 / 44100,
	        1277 / 44100,
	        1356 / 44100,
	        1188 / 44100,
	        1116 / 44100
	    ];
	    /**
		 *  an array of allpass filter frequency values from Freeverb implementation
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
	    var allpassFilterFrequencies = [
	        225,
	        556,
	        441,
	        341
	    ];
	    /**
		 *  @class Tone.Freeverb is a reverb based on [Freeverb](https://ccrma.stanford.edu/~jos/pasp/Freeverb.html).
		 *         Read more on reverb on [SoundOnSound](http://www.soundonsound.com/sos/may00/articles/reverb.htm).
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {NormalRange|Object} [roomSize] Correlated to the decay time. 
		 *  @param {Frequency} [dampening] The cutoff frequency of a lowpass filter as part 
		 *                                 of the reverb. 
		 *  @example
		 * var freeverb = new Tone.Freeverb().toMaster();
		 * freeverb.dampening.value = 1000;
		 * //routing synth through the reverb
		 * var synth = new Tone.AMSynth().connect(freeverb);
		 */
	    Tone.Freeverb = function () {
	        var options = this.optionsObject(arguments, [
	            'roomSize',
	            'dampening'
	        ], Tone.Freeverb.defaults);
	        Tone.StereoEffect.call(this, options);
	        /**
			 *  The roomSize value between. A larger roomSize
			 *  will result in a longer decay. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.roomSize = new Tone.Signal(options.roomSize, Tone.Type.NormalRange);
	        /**
			 *  The amount of dampening of the reverberant signal. 
			 *  @type {Frequency}
			 *  @signal
			 */
	        this.dampening = new Tone.Signal(options.dampening, Tone.Type.Frequency);
	        /**
			 *  the comb filters
			 *  @type {Array}
			 *  @private
			 */
	        this._combFilters = [];
	        /**
			 *  the allpass filters on the left
			 *  @type {Array}
			 *  @private
			 */
	        this._allpassFiltersL = [];
	        /**
			 *  the allpass filters on the right
			 *  @type {Array}
			 *  @private
			 */
	        this._allpassFiltersR = [];
	        //make the allpass filters on teh right
	        for (var l = 0; l < allpassFilterFrequencies.length; l++) {
	            var allpassL = this.context.createBiquadFilter();
	            allpassL.type = 'allpass';
	            allpassL.frequency.value = allpassFilterFrequencies[l];
	            this._allpassFiltersL.push(allpassL);
	        }
	        //make the allpass filters on the left
	        for (var r = 0; r < allpassFilterFrequencies.length; r++) {
	            var allpassR = this.context.createBiquadFilter();
	            allpassR.type = 'allpass';
	            allpassR.frequency.value = allpassFilterFrequencies[r];
	            this._allpassFiltersR.push(allpassR);
	        }
	        //make the comb filters
	        for (var c = 0; c < combFilterTunings.length; c++) {
	            var lfpf = new Tone.LowpassCombFilter(combFilterTunings[c]);
	            if (c < combFilterTunings.length / 2) {
	                this.effectSendL.chain(lfpf, this._allpassFiltersL[0]);
	            } else {
	                this.effectSendR.chain(lfpf, this._allpassFiltersR[0]);
	            }
	            this.roomSize.connect(lfpf.resonance);
	            this.dampening.connect(lfpf.dampening);
	            this._combFilters.push(lfpf);
	        }
	        //chain the allpass filters togetehr
	        this.connectSeries.apply(this, this._allpassFiltersL);
	        this.connectSeries.apply(this, this._allpassFiltersR);
	        this._allpassFiltersL[this._allpassFiltersL.length - 1].connect(this.effectReturnL);
	        this._allpassFiltersR[this._allpassFiltersR.length - 1].connect(this.effectReturnR);
	        this._readOnly([
	            'roomSize',
	            'dampening'
	        ]);
	    };
	    Tone.extend(Tone.Freeverb, Tone.StereoEffect);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.Freeverb.defaults = {
	        'roomSize': 0.7,
	        'dampening': 3000
	    };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.Freeverb} this
		 */
	    Tone.Freeverb.prototype.dispose = function () {
	        Tone.StereoEffect.prototype.dispose.call(this);
	        for (var al = 0; al < this._allpassFiltersL.length; al++) {
	            this._allpassFiltersL[al].disconnect();
	            this._allpassFiltersL[al] = null;
	        }
	        this._allpassFiltersL = null;
	        for (var ar = 0; ar < this._allpassFiltersR.length; ar++) {
	            this._allpassFiltersR[ar].disconnect();
	            this._allpassFiltersR[ar] = null;
	        }
	        this._allpassFiltersR = null;
	        for (var cf = 0; cf < this._combFilters.length; cf++) {
	            this._combFilters[cf].dispose();
	            this._combFilters[cf] = null;
	        }
	        this._combFilters = null;
	        this._writable([
	            'roomSize',
	            'dampening'
	        ]);
	        this.roomSize.dispose();
	        this.roomSize = null;
	        this.dampening.dispose();
	        this.dampening = null;
	        return this;
	    };
	    return Tone.Freeverb;
	});
	Module(function (Tone) {
	    
	    /**
		 *  an array of the comb filter delay time values
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
	    var combFilterDelayTimes = [
	        1687 / 25000,
	        1601 / 25000,
	        2053 / 25000,
	        2251 / 25000
	    ];
	    /**
		 *  the resonances of each of the comb filters
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
	    var combFilterResonances = [
	        0.773,
	        0.802,
	        0.753,
	        0.733
	    ];
	    /**
		 *  the allpass filter frequencies
		 *  @private
		 *  @static
		 *  @type {Array}
		 */
	    var allpassFilterFreqs = [
	        347,
	        113,
	        37
	    ];
	    /**
		 *  @class Tone.JCReverb is a simple [Schroeder Reverberator](https://ccrma.stanford.edu/~jos/pasp/Schroeder_Reverberators.html)
		 *         tuned by John Chowning in 1970.
		 *         It is made up of three allpass filters and four Tone.FeedbackCombFilter. 
		 *         
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {NormalRange|Object} [roomSize] Coorelates to the decay time.
		 *  @example
		 * var reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
		 * var delay = new Tone.FeedbackDelay(0.5); 
		 * //connecting the synth to reverb through delay
		 * var synth = new Tone.DuoSynth().chain(delay, reverb);
		 * synth.triggerAttackRelease("A4","8n");
		 */
	    Tone.JCReverb = function () {
	        var options = this.optionsObject(arguments, ['roomSize'], Tone.JCReverb.defaults);
	        Tone.StereoEffect.call(this, options);
	        /**
			 *  room size control values between [0,1]
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.roomSize = new Tone.Signal(options.roomSize, Tone.Type.NormalRange);
	        /**
			 *  scale the room size
			 *  @type {Tone.Scale}
			 *  @private
			 */
	        this._scaleRoomSize = new Tone.Scale(-0.733, 0.197);
	        /**
			 *  a series of allpass filters
			 *  @type {Array}
			 *  @private
			 */
	        this._allpassFilters = [];
	        /**
			 *  parallel feedback comb filters
			 *  @type {Array}
			 *  @private
			 */
	        this._feedbackCombFilters = [];
	        //make the allpass filters
	        for (var af = 0; af < allpassFilterFreqs.length; af++) {
	            var allpass = this.context.createBiquadFilter();
	            allpass.type = 'allpass';
	            allpass.frequency.value = allpassFilterFreqs[af];
	            this._allpassFilters.push(allpass);
	        }
	        //and the comb filters
	        for (var cf = 0; cf < combFilterDelayTimes.length; cf++) {
	            var fbcf = new Tone.FeedbackCombFilter(combFilterDelayTimes[cf], 0.1);
	            this._scaleRoomSize.connect(fbcf.resonance);
	            fbcf.resonance.value = combFilterResonances[cf];
	            this._allpassFilters[this._allpassFilters.length - 1].connect(fbcf);
	            if (cf < combFilterDelayTimes.length / 2) {
	                fbcf.connect(this.effectReturnL);
	            } else {
	                fbcf.connect(this.effectReturnR);
	            }
	            this._feedbackCombFilters.push(fbcf);
	        }
	        //chain the allpass filters together
	        this.roomSize.connect(this._scaleRoomSize);
	        this.connectSeries.apply(this, this._allpassFilters);
	        this.effectSendL.connect(this._allpassFilters[0]);
	        this.effectSendR.connect(this._allpassFilters[0]);
	        this._readOnly(['roomSize']);
	    };
	    Tone.extend(Tone.JCReverb, Tone.StereoEffect);
	    /**
		 *  the default values
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.JCReverb.defaults = { 'roomSize': 0.5 };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.JCReverb} this
		 */
	    Tone.JCReverb.prototype.dispose = function () {
	        Tone.StereoEffect.prototype.dispose.call(this);
	        for (var apf = 0; apf < this._allpassFilters.length; apf++) {
	            this._allpassFilters[apf].disconnect();
	            this._allpassFilters[apf] = null;
	        }
	        this._allpassFilters = null;
	        for (var fbcf = 0; fbcf < this._feedbackCombFilters.length; fbcf++) {
	            this._feedbackCombFilters[fbcf].dispose();
	            this._feedbackCombFilters[fbcf] = null;
	        }
	        this._feedbackCombFilters = null;
	        this._writable(['roomSize']);
	        this.roomSize.dispose();
	        this.roomSize = null;
	        this._scaleRoomSize.dispose();
	        this._scaleRoomSize = null;
	        return this;
	    };
	    return Tone.JCReverb;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Mid/Side processing separates the the 'mid' signal 
		 *         (which comes out of both the left and the right channel) 
		 *         and the 'side' (which only comes out of the the side channels) 
		 *         and effects them separately before being recombined.
		 *         Applies a Mid/Side seperation and recombination.
		 *         Algorithm found in [kvraudio forums](http://www.kvraudio.com/forum/viewtopic.php?t=212587).
		 *         <br><br>
		 *         This is a base-class for Mid/Side Effects. 
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 */
	    Tone.MidSideEffect = function () {
	        Tone.Effect.call(this);
	        /**
			 *  The mid/side split
			 *  @type  {Tone.MidSideSplit}
			 *  @private
			 */
	        this._midSideSplit = new Tone.MidSideSplit();
	        /**
			 *  The mid/side merge
			 *  @type  {Tone.MidSideMerge}
			 *  @private
			 */
	        this._midSideMerge = new Tone.MidSideMerge();
	        /**
			 *  The mid send. Connect to mid processing
			 *  @type {Tone.Expr}
			 *  @private
			 */
	        this.midSend = this._midSideSplit.mid;
	        /**
			 *  The side send. Connect to side processing
			 *  @type {Tone.Expr}
			 *  @private
			 */
	        this.sideSend = this._midSideSplit.side;
	        /**
			 *  The mid return connection
			 *  @type {GainNode}
			 *  @private
			 */
	        this.midReturn = this._midSideMerge.mid;
	        /**
			 *  The side return connection
			 *  @type {GainNode}
			 *  @private
			 */
	        this.sideReturn = this._midSideMerge.side;
	        //the connections
	        this.effectSend.connect(this._midSideSplit);
	        this._midSideMerge.connect(this.effectReturn);
	    };
	    Tone.extend(Tone.MidSideEffect, Tone.Effect);
	    /**
		 *  Clean up. 
		 *  @returns {Tone.MidSideEffect} this
		 */
	    Tone.MidSideEffect.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._midSideSplit.dispose();
	        this._midSideSplit = null;
	        this._midSideMerge.dispose();
	        this._midSideMerge = null;
	        this.midSend = null;
	        this.sideSend = null;
	        this.midReturn = null;
	        this.sideReturn = null;
	        return this;
	    };
	    return Tone.MidSideEffect;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Phaser is a phaser effect. Phasers work by changing the phase
		 *         of different frequency components of an incoming signal. Read more on 
		 *         [Wikipedia](https://en.wikipedia.org/wiki/Phaser_(effect)). 
		 *         Inspiration for this phaser comes from [Tuna.js](https://github.com/Dinahmoe/tuna/).
		 *
		 *	@extends {Tone.StereoEffect}
		 *	@constructor
		 *	@param {Frequency|Object} [frequency] The speed of the phasing. 
		 *	@param {number} [depth] The depth of the effect. 
		 *	@param {Frequency} [baseFrequency] The base frequency of the filters. 
		 *	@example
		 * var phaser = new Tone.Phaser({
		 * 	"frequency" : 15, 
		 * 	"depth" : 5, 
		 * 	"baseFrequency" : 1000
		 * }).toMaster();
		 * var synth = new Tone.FMSynth().connect(phaser);
		 * synth.triggerAttackRelease("E3", "2n");
		 */
	    Tone.Phaser = function () {
	        //set the defaults
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'depth',
	            'baseFrequency'
	        ], Tone.Phaser.defaults);
	        Tone.StereoEffect.call(this, options);
	        /**
			 *  the lfo which controls the frequency on the left side
			 *  @type {Tone.LFO}
			 *  @private
			 */
	        this._lfoL = new Tone.LFO(options.frequency, 0, 1);
	        /**
			 *  the lfo which controls the frequency on the right side
			 *  @type {Tone.LFO}
			 *  @private
			 */
	        this._lfoR = new Tone.LFO(options.frequency, 0, 1);
	        this._lfoR.phase = 180;
	        /**
			 *  the base modulation frequency
			 *  @type {number}
			 *  @private
			 */
	        this._baseFrequency = options.baseFrequency;
	        /**
			 *  the depth of the phasing
			 *  @type {number}
			 *  @private
			 */
	        this._depth = options.depth;
	        /**
			 *  The quality factor of the filters
			 *  @type {Positive}
			 *  @signal
			 */
	        this.Q = new Tone.Signal(options.Q, Tone.Type.Positive);
	        /**
			 *  the array of filters for the left side
			 *  @type {Array}
			 *  @private
			 */
	        this._filtersL = this._makeFilters(options.stages, this._lfoL, this.Q);
	        /**
			 *  the array of filters for the left side
			 *  @type {Array}
			 *  @private
			 */
	        this._filtersR = this._makeFilters(options.stages, this._lfoR, this.Q);
	        /**
			 * the frequency of the effect
			 * @type {Tone.Signal}
			 */
	        this.frequency = this._lfoL.frequency;
	        this.frequency.value = options.frequency;
	        //connect them up
	        this.effectSendL.connect(this._filtersL[0]);
	        this.effectSendR.connect(this._filtersR[0]);
	        this._filtersL[options.stages - 1].connect(this.effectReturnL);
	        this._filtersR[options.stages - 1].connect(this.effectReturnR);
	        //control the frequency with one LFO
	        this._lfoL.frequency.connect(this._lfoR.frequency);
	        //set the options
	        this.baseFrequency = options.baseFrequency;
	        this.depth = options.depth;
	        //start the lfo
	        this._lfoL.start();
	        this._lfoR.start();
	        this._readOnly([
	            'frequency',
	            'Q'
	        ]);
	    };
	    Tone.extend(Tone.Phaser, Tone.StereoEffect);
	    /**
		 *  defaults
		 *  @static
		 *  @type {object}
		 */
	    Tone.Phaser.defaults = {
	        'frequency': 0.5,
	        'depth': 10,
	        'stages': 10,
	        'Q': 10,
	        'baseFrequency': 350
	    };
	    /**
		 *  @param {number} stages
		 *  @returns {Array} the number of filters all connected together
		 *  @private
		 */
	    Tone.Phaser.prototype._makeFilters = function (stages, connectToFreq, Q) {
	        var filters = new Array(stages);
	        //make all the filters
	        for (var i = 0; i < stages; i++) {
	            var filter = this.context.createBiquadFilter();
	            filter.type = 'allpass';
	            Q.connect(filter.Q);
	            connectToFreq.connect(filter.frequency);
	            filters[i] = filter;
	        }
	        this.connectSeries.apply(this, filters);
	        return filters;
	    };
	    /**
		 * The depth of the effect. 
		 * @memberOf Tone.Phaser#
		 * @type {number}
		 * @name depth
		 */
	    Object.defineProperty(Tone.Phaser.prototype, 'depth', {
	        get: function () {
	            return this._depth;
	        },
	        set: function (depth) {
	            this._depth = depth;
	            var max = this._baseFrequency + this._baseFrequency * depth;
	            this._lfoL.max = max;
	            this._lfoR.max = max;
	        }
	    });
	    /**
		 * The the base frequency of the filters. 
		 * @memberOf Tone.Phaser#
		 * @type {number}
		 * @name baseFrequency
		 */
	    Object.defineProperty(Tone.Phaser.prototype, 'baseFrequency', {
	        get: function () {
	            return this._baseFrequency;
	        },
	        set: function (freq) {
	            this._baseFrequency = freq;
	            this._lfoL.min = freq;
	            this._lfoR.min = freq;
	            this.depth = this._depth;
	        }
	    });
	    /**
		 *  clean up
		 *  @returns {Tone.Phaser} this
		 */
	    Tone.Phaser.prototype.dispose = function () {
	        Tone.StereoEffect.prototype.dispose.call(this);
	        this._writable([
	            'frequency',
	            'Q'
	        ]);
	        this.Q.dispose();
	        this.Q = null;
	        this._lfoL.dispose();
	        this._lfoL = null;
	        this._lfoR.dispose();
	        this._lfoR = null;
	        for (var i = 0; i < this._filtersL.length; i++) {
	            this._filtersL[i].disconnect();
	            this._filtersL[i] = null;
	        }
	        this._filtersL = null;
	        for (var j = 0; j < this._filtersR.length; j++) {
	            this._filtersR[j].disconnect();
	            this._filtersR[j] = null;
	        }
	        this._filtersR = null;
	        this.frequency = null;
	        return this;
	    };
	    return Tone.Phaser;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.PingPongDelay is a feedback delay effect where the echo is heard
		 *          first in one channel and next in the opposite channel. In a stereo
		 *          system these are the right and left channels.
		 *          PingPongDelay in more simplified terms is two Tone.FeedbackDelays 
		 *          with independent delay values. Each delay is routed to one channel
		 *          (left or right), and the channel triggered second will always 
		 *          trigger at the same interval after the first.
		 *
		 * 	@constructor
		 * 	@extends {Tone.StereoXFeedbackEffect}
		 *  @param {Time|Object} [delayTime] The delayTime between consecutive echos.
		 *  @param {NormalRange=} feedback The amount of the effected signal which 
		 *                                 is fed back through the delay.
		 *  @example
		 * var pingPong = new Tone.PingPongDelay("4n", 0.2).toMaster();
		 * var drum = new Tone.DrumSynth().connect(pingPong);
		 * drum.triggerAttackRelease("C4", "32n");
		 */
	    Tone.PingPongDelay = function () {
	        var options = this.optionsObject(arguments, [
	            'delayTime',
	            'feedback'
	        ], Tone.PingPongDelay.defaults);
	        Tone.StereoXFeedbackEffect.call(this, options);
	        /**
			 *  the delay node on the left side
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._leftDelay = this.context.createDelay(options.maxDelayTime);
	        /**
			 *  the delay node on the right side
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._rightDelay = this.context.createDelay(options.maxDelayTime);
	        /**
			 *  the predelay on the right side
			 *  @type {DelayNode}
			 *  @private
			 */
	        this._rightPreDelay = this.context.createDelay(options.maxDelayTime);
	        /**
			 *  the delay time signal
			 *  @type {Time}
			 *  @signal
			 */
	        this.delayTime = new Tone.Signal(options.delayTime, Tone.Type.Time);
	        //connect it up
	        this.effectSendL.chain(this._leftDelay, this.effectReturnL);
	        this.effectSendR.chain(this._rightPreDelay, this._rightDelay, this.effectReturnR);
	        this.delayTime.fan(this._leftDelay.delayTime, this._rightDelay.delayTime, this._rightPreDelay.delayTime);
	        //rearranged the feedback to be after the rightPreDelay
	        this._feedbackLR.disconnect();
	        this._feedbackLR.connect(this._rightDelay);
	        this._readOnly(['delayTime']);
	    };
	    Tone.extend(Tone.PingPongDelay, Tone.StereoXFeedbackEffect);
	    /**
		 *  @static
		 *  @type {Object}
		 */
	    Tone.PingPongDelay.defaults = {
	        'delayTime': 0.25,
	        'maxDelayTime': 1
	    };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.PingPongDelay} this
		 */
	    Tone.PingPongDelay.prototype.dispose = function () {
	        Tone.StereoXFeedbackEffect.prototype.dispose.call(this);
	        this._leftDelay.disconnect();
	        this._leftDelay = null;
	        this._rightDelay.disconnect();
	        this._rightDelay = null;
	        this._rightPreDelay.disconnect();
	        this._rightPreDelay = null;
	        this._writable(['delayTime']);
	        this.delayTime.dispose();
	        this.delayTime = null;
	        return this;
	    };
	    return Tone.PingPongDelay;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Base class for stereo feedback effects where the effectReturn
		 *         is fed back into the same channel. 
		 *
		 *	@constructor
		 *	@extends {Tone.FeedbackEffect}
		 */
	    Tone.StereoFeedbackEffect = function () {
	        var options = this.optionsObject(arguments, ['feedback'], Tone.FeedbackEffect.defaults);
	        Tone.StereoEffect.call(this, options);
	        /**
			 *  controls the amount of feedback
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.feedback = new Tone.Signal(options.feedback, Tone.Type.NormalRange);
	        /**
			 *  the left side feeback
			 *  @type {GainNode}
			 *  @private
			 */
	        this._feedbackL = this.context.createGain();
	        /**
			 *  the right side feeback
			 *  @type {GainNode}
			 *  @private
			 */
	        this._feedbackR = this.context.createGain();
	        //connect it up
	        this.effectReturnL.chain(this._feedbackL, this.effectSendL);
	        this.effectReturnR.chain(this._feedbackR, this.effectSendR);
	        this.feedback.fan(this._feedbackL.gain, this._feedbackR.gain);
	        this._readOnly(['feedback']);
	    };
	    Tone.extend(Tone.StereoFeedbackEffect, Tone.FeedbackEffect);
	    /**
		 *  clean up
		 *  @returns {Tone.StereoFeedbackEffect} this
		 */
	    Tone.StereoFeedbackEffect.prototype.dispose = function () {
	        Tone.StereoEffect.prototype.dispose.call(this);
	        this._writable(['feedback']);
	        this.feedback.dispose();
	        this.feedback = null;
	        this._feedbackL.disconnect();
	        this._feedbackL = null;
	        this._feedbackR.disconnect();
	        this._feedbackR = null;
	        return this;
	    };
	    return Tone.StereoFeedbackEffect;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Applies a width factor to the mid/side seperation. 
		 *         0 is all mid and 1 is all side.
		 *         Algorithm found in [kvraudio forums](http://www.kvraudio.com/forum/viewtopic.php?t=212587).
		 *         <br><br>
		 *         <code>
		 *         Mid *= 2*(1-width)<br>
		 *         Side *= 2*width
		 *         </code>
		 *
		 *  @extends {Tone.MidSideEffect}
		 *  @constructor
		 *  @param {NormalRange|Object} [width] The stereo width. A width of 0 is mono and 1 is stereo. 0.5 is no change.
		 */
	    Tone.StereoWidener = function () {
	        var options = this.optionsObject(arguments, ['width'], Tone.StereoWidener.defaults);
	        Tone.MidSideEffect.call(this, options);
	        /**
			 *  The width control. 0 = 100% mid. 1 = 100% side. 0.5 = no change. 
			 *  @type {NormalRange}
			 *  @signal
			 */
	        this.width = new Tone.Signal(0.5, Tone.Type.NormalRange);
	        /**
			 *  Mid multiplier
			 *  @type {Tone.Expr}
			 *  @private
			 */
	        this._midMult = new Tone.Expr('$0 * ($1 * (1 - $2))');
	        /**
			 *  Side multiplier
			 *  @type {Tone.Expr}
			 *  @private
			 */
	        this._sideMult = new Tone.Expr('$0 * ($1 * $2)');
	        /**
			 *  constant output of 2
			 *  @type {Tone}
			 *  @private
			 */
	        this._two = new Tone.Signal(2);
	        //the mid chain
	        this._two.connect(this._midMult, 0, 1);
	        this.width.connect(this._midMult, 0, 2);
	        //the side chain
	        this._two.connect(this._sideMult, 0, 1);
	        this.width.connect(this._sideMult, 0, 2);
	        //connect it to the effect send/return
	        this.midSend.chain(this._midMult, this.midReturn);
	        this.sideSend.chain(this._sideMult, this.sideReturn);
	        this._readOnly(['width']);
	    };
	    Tone.extend(Tone.StereoWidener, Tone.MidSideEffect);
	    /**
		 *  the default values
		 *  @static
		 *  @type {Object}
		 */
	    Tone.StereoWidener.defaults = { 'width': 0.5 };
	    /**
		 *  Clean up. 
		 *  @returns {Tone.StereoWidener} this
		 */
	    Tone.StereoWidener.prototype.dispose = function () {
	        Tone.MidSideEffect.prototype.dispose.call(this);
	        this._writable(['width']);
	        this.width.dispose();
	        this.width = null;
	        this._midMult.dispose();
	        this._midMult = null;
	        this._sideMult.dispose();
	        this._sideMult = null;
	        this._two.dispose();
	        this._two = null;
	        return this;
	    };
	    return Tone.StereoWidener;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Tone.Tremelo modulates the amplitude of an incoming signal using a Tone.LFO. 
		 *         The type, frequency, and depth of the LFO is controllable. 
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {Frequency|Object} [frequency] The rate of the effect. 
		 *  @param {NormalRange} [depth] The depth of the wavering.
		 *  @example
		 * //create an tremolo and start it's LFO
		 * var tremolo = new Tone.Tremolo(9, 0.75).toMaster().start();
		 * //route an oscillator through the tremolo and start it
		 * var oscillator = new Tone.Oscillator().connect(tremolo).start();
		 */
	    Tone.Tremolo = function () {
	        var options = this.optionsObject(arguments, [
	            'frequency',
	            'depth'
	        ], Tone.Tremolo.defaults);
	        Tone.Effect.call(this, options);
	        /**
			 *  The tremelo LFO
			 *  @type  {Tone.LFO}
			 *  @private
			 */
	        this._lfo = new Tone.LFO({
	            'frequency': options.frequency,
	            'amplitude': options.depth,
	            'min': 1,
	            'max': 0
	        });
	        /**
			 *  Where the gain is multiplied
			 *  @type  {GainNode}
			 *  @private
			 */
	        this._amplitude = this.context.createGain();
	        /**
			 *  The frequency of the tremolo.	
			 *  @type  {Frequency}
			 *  @signal
			 */
	        this.frequency = this._lfo.frequency;
	        /**
			 *  The depth of the effect. A depth of 0, has no effect
			 *  on the amplitude, and a depth of 1 makes the amplitude
			 *  modulate fully between 0 and 1. 
			 *  @type  {NormalRange}
			 *  @signal
			 */
	        this.depth = this._lfo.amplitude;
	        this._readOnly([
	            'frequency',
	            'depth'
	        ]);
	        this.connectEffect(this._amplitude);
	        this._lfo.connect(this._amplitude.gain);
	        this.type = options.type;
	    };
	    Tone.extend(Tone.Tremolo, Tone.Effect);
	    /**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
	    Tone.Tremolo.defaults = {
	        'frequency': 10,
	        'type': 'sine',
	        'depth': 0.5
	    };
	    /**
		 * Start the tremolo.
		 * @param {Time} [time=now] When the tremolo begins.
		 * @returns {Tone.Tremolo} this
		 */
	    Tone.Tremolo.prototype.start = function (time) {
	        this._lfo.start(time);
	        return this;
	    };
	    /**
		 * Stop the tremolo.
		 * @param {Time} [time=now] When the tremolo stops.
		 * @returns {Tone.Tremolo} this
		 */
	    Tone.Tremolo.prototype.stop = function (time) {
	        this._lfo.stop(time);
	        return this;
	    };
	    /**
		 * Sync the effect to the transport.
		 * @param {Time} [delay=0] Delay time before starting the effect after the
		 *                              Transport has started. 
		 * @returns {Tone.AutoFilter} this
		 */
	    Tone.Tremolo.prototype.sync = function (delay) {
	        this._lfo.sync(delay);
	        return this;
	    };
	    /**
		 * Unsync the filter from the transport
		 * @returns {Tone.Tremolo} this
		 */
	    Tone.Tremolo.prototype.unsync = function () {
	        this._lfo.unsync();
	        return this;
	    };
	    /**
		 * Type of oscillator attached to the Tremolo.
		 * @memberOf Tone.Tremolo#
		 * @type {string}
		 * @name type
		 */
	    Object.defineProperty(Tone.Tremolo.prototype, 'type', {
	        get: function () {
	            return this._lfo.type;
	        },
	        set: function (type) {
	            this._lfo.type = type;
	        }
	    });
	    /**
		 *  clean up
		 *  @returns {Tone.Tremolo} this
		 */
	    Tone.Tremolo.prototype.dispose = function () {
	        Tone.Effect.prototype.dispose.call(this);
	        this._writable([
	            'frequency',
	            'depth'
	        ]);
	        this._lfo.dispose();
	        this._lfo = null;
	        this._amplitude.disconnect();
	        this._amplitude = null;
	        this.frequency = null;
	        this.depth = null;
	        return this;
	    };
	    return Tone.Tremolo;
	});
	Module(function (Tone) {
	    
	    /**
		 * 	@class  Clip the incoming signal so that the output is always between min and max.
		 * 	
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} min the minimum value of the outgoing signal
		 *  @param {number} max the maximum value of the outgoing signal
		 *  @example
		 * var clip = new Tone.Clip(0.5, 1);
		 * var osc = new Tone.Oscillator().connect(clip);
		 * //clips the output of the oscillator to between 0.5 and 1.
		 */
	    Tone.Clip = function (min, max) {
	        //make sure the args are in the right order
	        if (min > max) {
	            var tmp = min;
	            min = max;
	            max = tmp;
	        }
	        /**
			 *  The min clip value
			 *  @type {Number}
			 *  @signal
			 */
	        this.min = this.input = new Tone.Min(max);
	        this._readOnly('min');
	        /**
			 *  The max clip value
			 *  @type {Number}
			 *  @signal
			 */
	        this.max = this.output = new Tone.Max(min);
	        this._readOnly('max');
	        this.min.connect(this.max);
	    };
	    Tone.extend(Tone.Clip, Tone.SignalBase);
	    /**
		 *  clean up
		 *  @returns {Tone.Clip} this
		 */
	    Tone.Clip.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable('min');
	        this.min.dispose();
	        this.min = null;
	        this._writable('max');
	        this.max.dispose();
	        this.max = null;
	        return this;
	    };
	    return Tone.Clip;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Normalize takes an input min and max and maps it linearly to NormalRange [0,1]
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number} inputMin the min input value
		 *  @param {number} inputMax the max input value
		 *  @example
		 * var norm = new Tone.Normalize(2, 4);
		 * var sig = new Tone.Signal(3).connect(norm);
		 * //output of norm is 0.5. 
		 */
	    Tone.Normalize = function (inputMin, inputMax) {
	        /**
			 *  the min input value
			 *  @type {number}
			 *  @private
			 */
	        this._inputMin = this.defaultArg(inputMin, 0);
	        /**
			 *  the max input value
			 *  @type {number}
			 *  @private
			 */
	        this._inputMax = this.defaultArg(inputMax, 1);
	        /**
			 *  subtract the min from the input
			 *  @type {Tone.Add}
			 *  @private
			 */
	        this._sub = this.input = new Tone.Add(0);
	        /**
			 *  divide by the difference between the input and output
			 *  @type {Tone.Multiply}
			 *  @private
			 */
	        this._div = this.output = new Tone.Multiply(1);
	        this._sub.connect(this._div);
	        this._setRange();
	    };
	    Tone.extend(Tone.Normalize, Tone.SignalBase);
	    /**
		 * The minimum value the input signal will reach.
		 * @memberOf Tone.Normalize#
		 * @type {number}
		 * @name min
		 */
	    Object.defineProperty(Tone.Normalize.prototype, 'min', {
	        get: function () {
	            return this._inputMin;
	        },
	        set: function (min) {
	            this._inputMin = min;
	            this._setRange();
	        }
	    });
	    /**
		 * The maximum value the input signal will reach.
		 * @memberOf Tone.Normalize#
		 * @type {number}
		 * @name max
		 */
	    Object.defineProperty(Tone.Normalize.prototype, 'max', {
	        get: function () {
	            return this._inputMax;
	        },
	        set: function (max) {
	            this._inputMax = max;
	            this._setRange();
	        }
	    });
	    /**
		 *  set the values
		 *  @private
		 */
	    Tone.Normalize.prototype._setRange = function () {
	        this._sub.value = -this._inputMin;
	        this._div.value = 1 / (this._inputMax - this._inputMin);
	    };
	    /**
		 *  clean up
		 *  @returns {Tone.Normalize} this
		 */
	    Tone.Normalize.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._sub.dispose();
	        this._sub = null;
	        this._div.dispose();
	        this._div = null;
	        return this;
	    };
	    return Tone.Normalize;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class Route a single input to the specified output. 
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputCount=2] the number of inputs the switch accepts
		 *  @example
		 * var route = new Tone.Route(4);
		 * var signal = new Tone.Signal(3).connect(route);
		 * route.select(0);
		 * //signal is routed through output 0
		 * route.select(3);
		 * //signal is now routed through output 3
		 */
	    Tone.Route = function (outputCount) {
	        outputCount = this.defaultArg(outputCount, 2);
	        Tone.call(this, 1, outputCount);
	        /**
			 *  The control signal.
			 *  @type {Number}
			 *  @signal
			 */
	        this.gate = new Tone.Signal(0);
	        this._readOnly('gate');
	        //make all the inputs and connect them
	        for (var i = 0; i < outputCount; i++) {
	            var routeGate = new RouteGate(i);
	            this.output[i] = routeGate;
	            this.gate.connect(routeGate.selecter);
	            this.input.connect(routeGate);
	        }
	    };
	    Tone.extend(Tone.Route, Tone.SignalBase);
	    /**
		 *  Routes the signal to one of the outputs and close the others.
		 *  @param {number} [which=0] Open one of the gates (closes the other).
		 *  @param {Time} [time=now] The time when the switch will open.
		 *  @returns {Tone.Route} this
		 */
	    Tone.Route.prototype.select = function (which, time) {
	        //make sure it's an integer
	        which = Math.floor(which);
	        this.gate.setValueAtTime(which, this.toSeconds(time));
	        return this;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.Route} this
		 */
	    Tone.Route.prototype.dispose = function () {
	        this._writable('gate');
	        this.gate.dispose();
	        this.gate = null;
	        for (var i = 0; i < this.output.length; i++) {
	            this.output[i].dispose();
	            this.output[i] = null;
	        }
	        Tone.prototype.dispose.call(this);
	        return this;
	    };
	    ////////////START HELPER////////////
	    /**
		 *  helper class for Tone.Route representing a single gate
		 *  @constructor
		 *  @extends {Tone}
		 *  @private
		 */
	    var RouteGate = function (num) {
	        /**
			 *  the selector
			 *  @type {Tone.Equal}
			 */
	        this.selecter = new Tone.Equal(num);
	        /**
			 *  the gate
			 *  @type {GainNode}
			 */
	        this.gate = this.input = this.output = this.context.createGain();
	        //connect the selecter to the gate gain
	        this.selecter.connect(this.gate.gain);
	    };
	    Tone.extend(RouteGate);
	    /**
		 *  clean up
		 *  @private
		 */
	    RouteGate.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this.selecter.dispose();
	        this.selecter = null;
	        this.gate.disconnect();
	        this.gate = null;
	    };
	    ////////////END HELPER////////////
	    //return Tone.Route
	    return Tone.Route;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  When the gate is set to 0, the input signal does not pass through to the output. 
		 *          If the gate is set to 1, the input signal passes through.
		 *          the gate is initially closed.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {Boolean} [open=false] If the gate is initially open or closed.
		 *  @example
		 * var sigSwitch = new Tone.Switch();
		 * var signal = new Tone.Signal(2).connect(sigSwitch);
		 * //initially no output from sigSwitch
		 * sigSwitch.gate.value = 1;
		 * //open the switch and allow the signal through
		 * //the output of sigSwitch is now 2. 
		 */
	    Tone.Switch = function (open) {
	        open = this.defaultArg(open, false);
	        Tone.call(this);
	        /**
			 *  The control signal for the switch.
			 *  When this value is 0, the input signal will NOT pass through,
			 *  when it is high (1), the input signal will pass through.
			 *  
			 *  @type {Number}
			 *  @signal
			 */
	        this.gate = new Tone.Signal(0);
	        this._readOnly('gate');
	        /**
			 *  thresh the control signal to either 0 or 1
			 *  @type {Tone.GreaterThan}
			 *  @private
			 */
	        this._thresh = new Tone.GreaterThan(0.5);
	        this.input.connect(this.output);
	        this.gate.chain(this._thresh, this.output.gain);
	        //initially open
	        if (open) {
	            this.open();
	        }
	    };
	    Tone.extend(Tone.Switch, Tone.SignalBase);
	    /**
		 *  Open the switch at a specific time. 
		 *
		 *  @param {Time} [time=now] The time when the switch will be open. 
		 *  @returns {Tone.Switch} this
		 *  @example
		 *  //open the switch to let the signal through
		 *  sigSwitch.open();
		 */
	    Tone.Switch.prototype.open = function (time) {
	        this.gate.setValueAtTime(1, this.toSeconds(time));
	        return this;
	    };
	    /**
		 *  Close the switch at a specific time. 
		 *
		 *  @param {Time} [time=now] The time when the switch will be closed.
		 *  @returns {Tone.Switch} this
		 *  @example
		 *  //close the switch a half second from now
		 *  sigSwitch.close("+0.5");
		 */
	    Tone.Switch.prototype.close = function (time) {
	        this.gate.setValueAtTime(0, this.toSeconds(time));
	        return this;
	    };
	    /**
		 *  Clean up.
		 *  @returns {Tone.Switch} this
		 */
	    Tone.Switch.prototype.dispose = function () {
	        Tone.prototype.dispose.call(this);
	        this._writable('gate');
	        this.gate.dispose();
	        this.gate = null;
	        this._thresh.dispose();
	        this._thresh = null;
	        return this;
	    };
	    return Tone.Switch;
	});
	Module(function (Tone) {
	    
	    /**
		 *  @class  Tone.Microphone is a WebRTC Microphone. Check 
		 *          [Media Stream API Support](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_API)
		 *          to see which browsers are supported. 
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {number} [inputNum=0] If multiple inputs are present, select the input number.
		 *  @example
		 * //mic will feedback if played through master
		 * var mic = new Tone.Microphone();
		 * mic.start();
		 */
	    Tone.Microphone = function (inputNum) {
	        Tone.Source.call(this);
	        /**
			 *  @type {MediaStreamAudioSourceNode}
			 *  @private
			 */
	        this._mediaStream = null;
	        /**
			 *  @type {LocalMediaStream}
			 *  @private
			 */
	        this._stream = null;
	        /**
			 *  @type {Object}
			 *  @private
			 */
	        this._constraints = { 'audio': true };
	        //get the option
	        var self = this;
	        MediaStreamTrack.getSources(function (media_sources) {
	            if (inputNum < media_sources.length) {
	                self.constraints.audio = { optional: [{ sourceId: media_sources[inputNum].id }] };
	            }
	        });
	    };
	    Tone.extend(Tone.Microphone, Tone.Source);
	    /**
		 *  start the stream. 
		 *  @private
		 */
	    Tone.Microphone.prototype._start = function () {
	        navigator.getUserMedia(this._constraints, this._onStream.bind(this), this._onStreamError.bind(this));
	    };
	    /**
		 *  stop the stream. 
		 *  @private
		 */
	    Tone.Microphone.prototype._stop = function () {
	        this._stream.stop();
	        return this;
	    };
	    /**
		 *  called when the stream is successfully setup
		 *  @param   {LocalMediaStream} stream 
		 *  @private
		 */
	    Tone.Microphone.prototype._onStream = function (stream) {
	        this._stream = stream;
	        // Wrap a MediaStreamSourceNode around the live input stream.
	        this._mediaStream = this.context.createMediaStreamSource(stream);
	        this._mediaStream.connect(this.output);
	    };
	    /**
		 *  called on error
		 *  @param   {Error} e 
		 *  @private
		 */
	    Tone.Microphone.prototype._onStreamError = function (e) {
	        console.error(e);
	    };
	    /**
		 *  Clean up.
		 *  @return {Tone.Microphone} this
		 */
	    Tone.Microphone.prototype.dispose = function () {
	        Tone.Source.prototype.dispose.call(this);
	        if (this._mediaStream) {
	            this._mediaStream.disconnect();
	            this._mediaStream = null;
	        }
	        this._stream = null;
	        this._constraints = null;
	        return this;
	    };
	    //polyfill
	    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	    return Tone.Microphone;
	});

	//UMD
	if ( typeof define === "function" && define.amd ) {
		define( "Tone", [], function() {
			return Tone;
		});
	} else if (typeof module === "object") {
		module.exports = Tone;
 	} else {
		root.Tone = Tone;
	}
} (this));
},{}],42:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],43:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []
  var i = 0

  for (; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (leadSurrogate) {
        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        } else {
          // valid surrogate pair
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      } else {
        // no lead yet

        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else {
          // valid lead
          leadSurrogate = codePoint
          continue
        }
      }
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":44,"ieee754":45,"is-array":46}],44:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],45:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],46:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}]},{},[4]);
