// import THREE from 'three'
import math from './math'
import projectToUV from './project-to-uv'
import electricMaterial from './electric-material'
import hotspotMaterial from './hotspot-material'
import sensingMaterial from './sensing-material'
import events from './pointer-events'
import facingMaterial from './mesh-facing-material'
import text from './text'
import createGeometry from 'three-bmfont-text'
import Shader from './sdf'
import detector from './detector'
import sounds from './sounds'
import isMobile from 'ismobilejs'


// DETECTOR
	
	if ( !detector.webgl ) {

		document.querySelector( '#error' ).style.display = 'inherit';

	}else {


// INITIALISE



	// Constants
	let container = document.querySelector( '.gl' ),
		EXPANDED_HOTSPOT_SIZE = 50;

	let contBounds = container.getBoundingClientRect()
	// let cW = size.width,
	// 	cH = size.height

	let isLandscape = Math.abs(window.orientation) == 90;//screen.width > screen.height
	let chromeHeight = screen.availHeight - window.innerHeight
	// console.log( screen, chromeHeight, isLandscape )
	let WIDTH  = !isMobile.any ? contBounds.width  : isLandscape ? screen.height : window.innerWidth,
		HEIGHT = !isMobile.any ? contBounds.height : isLandscape ? window.innerWidth - chromeHeight : window.innerHeight



	// Params
	let expandedState = 0,
		interactionState = 0,
		hotspotPos = [ 0, 0 ]
		


// INITIALISE RENDERER


	let canvas = document.createElement('canvas'), 
		renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias: true, premultipliedAlpha:true}),
		camera = new THREE.PerspectiveCamera( 35, WIDTH / HEIGHT),
		scene = new THREE.Scene()


	container.appendChild( canvas )
	renderer.setSize( WIDTH, HEIGHT )
	renderer.setClearColor( 0x0 )



// INITIALISE TOGGLE

	

	let toggle = document.querySelector( '#toggle' )
	let infoOverlay = document.querySelector( '#info' )
	let infoButton = document.querySelector( '#info-button' )

	toggle.addEventListener( 'pointerdown', ( e ) => {
		e.stopPropagation();
		expandedState = expandedState === 1.0 ? 0.0 : 1.0;
		if( expandedState === 1.0 ) sounds.openSound() 
		else sounds.closeSound()
	}, true )


	document.querySelector( '#info-button' ).addEventListener( 'pointerdown', ( e ) => {
		e.stopPropagation();
		infoOverlay.style.display = 'inherit'
	}, true )


	document.querySelector( '#close-button' ).addEventListener( 'pointerdown', ( e ) => {
		e.stopPropagation();
		infoOverlay.style.display = 'none'
	}, true )







// POSITION CAMERA

	camera.position.z = 100;

	// Get plane dimensions that fit to the viewport
	// let fov = camera.fov * Math.PI/ 180
	let height = 2 * Math.tan( camera.fov * Math.PI / 360 ) * camera.position.z,
		width  = height * camera.aspect


// LAYERS

	let layers = new THREE.Object3D()
	let layerThickness = 1.0;

	let dashedLine = new THREE.Line( 
		new THREE.Geometry(), 
		new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 2, gapSize: 2.0, transparent:true } ),
		THREE.LinePieces );

	let cpuLine = new THREE.Line( 
		new THREE.Geometry(), 
		new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 2, gapSize: 2.0, transparent:true } ),
		THREE.LinePieces );

	let cpuActionLine = new THREE.Line( 
		new THREE.Geometry(), 
		new THREE.LineBasicMaterial({ color: 0xffffff }),
		THREE.LinePieces );


	cpuActionLine.geometry.vertices = [
		new THREE.Vector3( 0, -10, 0 ),
		new THREE.Vector3( 0, -33, 0 )
	]


	let l = 30
	while ( l-- > 0 ) dashedLine.geometry.vertices.push( new THREE.Vector3( 0, 0, l ))


	l = 40	
	while ( l-- > 0 ) cpuLine.geometry.vertices.push( new THREE.Vector3( 0, 0, l ))



	let hotspotLayer = new THREE.Mesh( 
		new THREE.PlaneGeometry( width+2, height+2 ),
		hotspotMaterial( new THREE.Vector2( WIDTH, HEIGHT )))

	
	let electricLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width+2, height+2, layerThickness ),
		electricMaterial( new THREE.Vector2( WIDTH, HEIGHT )))


	let sensingLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width+2, height+2, layerThickness ),
		sensingMaterial( new THREE.Vector2( WIDTH, HEIGHT )))


	let processorLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width * 0.5, width * 0.5, layerThickness ),
		facingMaterial( new THREE.MeshBasicMaterial({
			transparent: true,
			map: THREE.ImageUtils.loadTexture('img/processor.jpg')
		})))


	// TEXT
	
	let textMesh = (text, material, font ) => {

		let mesh = new THREE.Mesh(createGeometry({
			text: text,
		    font: font,
		    align: 'left',
    	}), material )
    	mesh.font = font

		mesh.rotation.x = Math.PI;
    	// mesh.scale.set( 0.2, 0.2, 0.2 )

    	mesh.position.x = -mesh.geometry.layout.width/2
		//origin uses bottom left of last line
		//so we need to move it down a fair bit 
		mesh.position.y = mesh.geometry.layout.height * 1.035

		//scale it down so it fits in our 3D units
		var textAnchor = new THREE.Object3D()
		textAnchor.scale.multiplyScalar(0.12)
		textAnchor.add(mesh)
		textAnchor.font = font

    	return textAnchor

	}


	let processorText,
		sensingText,
		electricText,
		locText

	text( {font:'fonts/DejaVu-sdf.fnt', image:'fonts/DejaVu-sdf.png'}, function( font, texture ){

		var maxAni = renderer.getMaxAnisotropy()

		//setup our texture with some nice mipmapping etc
		texture.needsUpdate = true
		texture.minFilter = THREE.LinearMipMapLinearFilter
		texture.magFilter = THREE.LinearFilter
		texture.generateMipmaps = true
		texture.anisotropy = maxAni

		
    	let textMaterial = new THREE.ShaderMaterial(Shader({
			map: texture,
			smooth: 1/32, //the smooth value for SDF
			side: THREE.DoubleSide,
			transparent: true,
			color: 'rgb(230, 230, 230)'
		}))


		processorLayer.add( processorText = textMesh( 'Processor', textMaterial, font ))
		sensingLayer.add( sensingText = textMesh( 'Sensing layer', textMaterial, font ))
		electricLayer.add( electricText = textMesh( 'Electric layer', textMaterial, font ))
		electricLayer.add( locText = textMesh( '(0, 0)', textMaterial, font ))

		processorText.position.y = -42;
		sensingText.position.y = -height * 0.64;
		sensingText.position.x = 3
		electricText.position.y = height * 0.5;
		locText.position.z = layerThickness * 2;


	})

	layers.add( electricLayer )
	layers.add( sensingLayer )
	layers.add( processorLayer )
	layers.add( hotspotLayer )
	layers.add( dashedLine )
	layers.add( cpuLine )
	processorLayer.add( cpuActionLine )


// PROCESSOR


// ADD TO SCENE

// scene.add( electricLayer )
scene.add( layers )


// DEFINE ANIMATION STATE


	let expandedAnimation = [

		// Properties and values in the collapsed states
		new Map([
			[ camera.position, 			new THREE.Vector3( 0, 0, 100 )],
			[ layers.rotation, 			new THREE.Euler( 0, 0, 0 )],
			[ electricLayer.position, 	new THREE.Vector3( 0, 0, 1 )],
			[ processorLayer.position, 	new THREE.Vector3( 0, 0, -10 )],
			[ hotspotLayer.position, 	new THREE.Vector3( 0, 0, 2 )]
		]),

		// Properties and values in the expanded states
		new Map([
			[ camera.position, 			new THREE.Vector3( 4, -6, 200 )],
			[ layers.rotation, 			new THREE.Euler( -.3, .4, .12 )],
			[ electricLayer.position, 	new THREE.Vector3( 0, 0, 30 )],
			[ processorLayer.position, 	new THREE.Vector3( 0, 0, -40 )],
			[ hotspotLayer.position, 	new THREE.Vector3( 0, 0, 1 )]
		])
	]


// TRANSITION


	// Performs a naive transition, sliding 'a' towards 'b'
	let slideTo = ( a, b ) => ( b - a ) * 0.12 + a


	let slideToVec3 = ( b, a ) => {

		let aArr = a.toArray(),
			bArr = b.toArray();

		return a.fromArray( aArr.map(( v, i ) => ( typeof v === 'number' ) ? slideTo( v, bArr[i] ) : v ))

	}

	// A dictionary that maps object types to methods of interpolation
	let lerpDict = new Map()
	lerpDict.set( Number, slideTo )
	lerpDict.set( THREE.Vector3, slideToVec3 )
	lerpDict.set( THREE.Euler, slideToVec3 )


	
	let transition = ( item, value ) => lerpDict.get( item.constructor )( item, value )

	let dir = new THREE.Vector3()
	let update = ( t ) => {



		// Update the button to reflect the current state
		toggle.className = 'puck ' + ( expandedState === 1.0  ? 'expanded' : 'collapsed' )
		toggle.style.visibility = infoOverlay.style.display === 'inherit' ? 'hidden' : 'visible'


		// Update elements of the expand animation
		expandedAnimation[expandedState].forEach( transition )


		
		// Set opacity of processor			
		processorLayer.material.materials[4].opacity = slideTo( 
			processorLayer.material.materials[4].opacity,
			expandedState )


		// Set position of hotspots
		electricLayer.material.materials[4].uniforms.uOrigin.value.fromArray( hotspotPos )
		hotspotLayer.material.uniforms.uOrigin.value.fromArray( hotspotPos )


		// Position dashed line
		dashedLine.position.x = math.map( hotspotPos[0], 0, WIDTH, -width*0.5, width*0.5 )
		dashedLine.position.y = math.map( hotspotPos[1], 0, HEIGHT, -height * 0.5, height * 0.5 )


		// Position CPU line
		let l = 40
		dir.set( 0, 0, -40 ).sub( dashedLine.position )//.multiplyScalar( 1/30 );
		while ( l-- > 0 ) cpuLine.geometry.vertices[l].copy( dir ).multiplyScalar( l/-40 );
		cpuLine.geometry.verticesNeedUpdate = true
		cpuLine.position.z = -40


		if( locText ) {
			locText.position.x = dashedLine.position.x - 7
			locText.position.y = dashedLine.position.y + ( dashedLine.position.y + 5 > 20 ? -20 : 5 ); 
			locText.position.z = 6
			locText.children[0].geometry.update({
				text: '('+parseFloat(Math.round(dashedLine.position.x * 100) / 100).toFixed(1)+','+parseFloat(Math.round(dashedLine.position.y * 100) / 100).toFixed(1)+')',
			    font: locText.font,
			    align: 'left',
			})

			locText.visible = 
				expandedState === 1 && 
				interactionState === 1 &&
				dashedLine.position.x > -width*0.5 && dashedLine.position.x < width*0.5 &&
				dashedLine.position.y > -height*0.5 && dashedLine.position.y < height*0.5
				? true : false

		}

		infoButton.style.display = expandedState === 0.0 ||	
			infoOverlay.style.display === 'inherit' ? 'none' : 'inherit'




		// set radius of electric layer
		electricLayer.material.materials[4].uniforms.uRadius.value = slideTo( 
			electricLayer.material.materials[4].uniforms.uRadius.value,
			interactionState * EXPANDED_HOTSPOT_SIZE )

		// set radius of sensing layer
		
		let radius = electricLayer.material.materials[4].uniforms.uRadius.value + ( Math.sin( t*0.004 ) * 4 * interactionState )
		hotspotLayer.material.uniforms.uRadius.value = math.mix( expandedState, radius, radius * 0.4 );
			

		// set opacity of electric layer
		electricLayer.material.materials[4].uniforms.uOpacity.value = slideTo( 
				electricLayer.material.materials[4].uniforms.uOpacity.value,
				math.mix( expandedState, 1.0, 0.5 ))


		// set opacity of sensing layer
		sensingLayer.material.materials[4].uniforms.uOpacity.value = slideTo( 
				sensingLayer.material.materials[4].uniforms.uOpacity.value,
				math.mix( expandedState, 1.0, 0.5 ))


		// set opacity of text
		if( locText ){

			locText.children[0].material.opacity = expandedState//slideTo( 
					// locText.children[0].material.opacity,
					// expandedState )

			sensingText.children[0].material.opacity = locText.children[0].material.opacity
			electricText.children[0].material.opacity = locText.children[0].material.opacity

		}


		cpuLine.material.visible = dashedLine.material.visible = 
			expandedState === 1 && 
			interactionState === 1 &&
			dashedLine.position.x > -width*0.5 && dashedLine.position.x < width*0.5 &&
			dashedLine.position.y > -height*0.5 && dashedLine.position.y < height*0.5


	}

// RENDER

	function render(t){
		update(t)
		renderer.render( scene, camera )
		requestAnimationFrame( render )	

	}

	render()


// INTERACTION

	// Prevents default OS page scroll events
	document.body.addEventListener('touchmove', (e) => e.preventDefault() , false); 

	let getScreenCoords = ( x, y ) => {

		let bounds = canvas.getBoundingClientRect()

		x -= bounds.left,
		y -= bounds.top;


		let screenCoord = [( x / bounds.width ) * 2 - 1, - ( y / bounds.height ) * 2 + 1]
		let p = projectToUV( camera, screenCoord, electricLayer )

		return [
			math.map( p.x, -width*0.5, width*0.5, 0, WIDTH ),
			math.map( p.y, -height*0.5, height*0.5, 0, HEIGHT ),
		]	

	}

	let updateHotSpotPosition = ( evt ) => {
		hotspotPos = getScreenCoords( evt.clientX, evt.clientY )
	}


	let onInteractionUpdate = ( evt ) => {

		let bounds = canvas.getBoundingClientRect()
		let p = getScreenCoords( evt.clientX, evt.clientY )

		let lastInteractionState = interactionState;
		interactionState = 	p[0] > 0 && p[0] < bounds.width &&
							p[1] > 0 && p[1] < bounds.height ? 1.0 : 0.0

		if( interactionState !== lastInteractionState ){
		 	if( interactionState === 0.0 ) sounds.stopInteraction()
		 	else sounds.triggerInteraction()
		}	

		updateHotSpotPosition( evt )

	}


	let onInteractionStart = ( evt ) => {

		let bounds = canvas.getBoundingClientRect()
		let pos = getScreenCoords( evt.clientX, evt.clientY )	
		

		if( !(infoOverlay.style.display == 'inherit') &&
			pos[0] > 0 && pos[0] < bounds.width &&
			pos[1] > 0 && pos[1] < bounds.height ){			

			interactionState = 1
			updateHotSpotPosition( evt )

			sounds.triggerInteraction()
			sounds.tapSound()

			document.addEventListener( 'pointermove', onInteractionUpdate )		
			document.addEventListener( 'pointerup', onInteractionEnd )
			document.addEventListener( 'pointerleave', onInteractionEnd )

		}
	}


	let onInteractionEnd = () => {
		interactionState = 0

		sounds.stopInteraction()

		document.removeEventListener( 'pointermove', onInteractionUpdate )
		document.removeEventListener( 'pointerup', onInteractionEnd )
		document.removeEventListener( 'pointerleave', onInteractionEnd )
		
	}


	document.addEventListener( 'pointerdown', onInteractionStart )


}