import THREE from 'three'
import math from './math'
import projectToUV from './project-to-uv'
import electricMaterial from './electric-material'
import hotspotMaterial from './hotspot-material'
import sensingMaterial from './sensing-material'
import events from './pointer-events'
import facingMaterial from './mesh-facing-material'

//window.THREE = THREE


// INITIALISE


	// Constants
	let container = document.querySelector( '.gl' ),
		EXPANDED_HOTSPOT_SIZE = 50,
		WIDTH = container.getBoundingClientRect().width,
		HEIGHT = container.getBoundingClientRect().height



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
	toggle.addEventListener( 'pointerdown', ( e ) => {
		e.stopPropagation();
		expandedState = expandedState === 1.0 ? 0.0 : 1.0
	}, true )






// POSITION CAMERA

	camera.position.z = 100;

	// Get plane dimensions that fit to the viewport
	// let fov = camera.fov * Math.PI/ 180
	let height = 2 * Math.tan( camera.fov * Math.PI / 360 ) * camera.position.z,
		width  = height * camera.aspect


	console.log( width, height );


// LAYERS

	let layers = new THREE.Object3D()
	let layerThickness = 1.0;


	let hotspotLayer = new THREE.Mesh( 
		new THREE.PlaneGeometry( width, height ),
		hotspotMaterial( new THREE.Vector2( WIDTH, HEIGHT )))

	
	let electricLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width, height, layerThickness ),
		electricMaterial( new THREE.Vector2( WIDTH, HEIGHT )))


	let sensingLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width, height, layerThickness ),
		sensingMaterial( new THREE.Vector2( WIDTH, HEIGHT )))


	let processorLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width * 0.5, width * 0.5, layerThickness ),
		facingMaterial( new THREE.MeshBasicMaterial({
			transparent: true,
			map: THREE.ImageUtils.loadTexture('img/processor.jpg')
		})))


	layers.add( electricLayer )
	layers.add( sensingLayer )
	layers.add( processorLayer )
	layers.add( hotspotLayer )


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
			[ camera.position, 			new THREE.Vector3( 0, 0, 200 )],
			[ layers.rotation, 			new THREE.Euler( -.35, .5, .12 )],
			[ electricLayer.position, 	new THREE.Vector3( 0, 0, 30 )],
			[ processorLayer.position, 	new THREE.Vector3( 0, 0, -40 )],
			[ hotspotLayer.position, 	new THREE.Vector3( 0, 0, 2 )]
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


	let update = () => {


		// Update the button to reflect the current state
		toggle.className = 'puck ' + ( expandedState === 1.0  ? 'expanded' : 'collapsed' )


		// Update elements of the expand animation
		expandedAnimation[expandedState].forEach( transition )


		
		// Set Uniforms			
		processorLayer.material.materials[4].opacity = slideTo( 
				processorLayer.material.materials[4].opacity,
				expandedState )

		electricLayer.material.materials[4].uniforms.uOrigin.value.fromArray( hotspotPos )
		hotspotLayer.material.uniforms.uOrigin.value.fromArray( hotspotPos )


		electricLayer.material.materials[4].uniforms.uRadius.value = slideTo( 
				electricLayer.material.materials[4].uniforms.uRadius.value,
				interactionState * EXPANDED_HOTSPOT_SIZE )

		let radius = electricLayer.material.materials[4].uniforms.uRadius.value
		hotspotLayer.material.uniforms.uRadius.value = math.mix( expandedState, radius, radius * 0.3 );
			


		electricLayer.material.materials[4].uniforms.uOpacity.value = slideTo( 
				electricLayer.material.materials[4].uniforms.uOpacity.value,
				math.mix( expandedState, 1.0, 0.5 ))


		sensingLayer.material.materials[4].uniforms.uOpacity.value = slideTo( 
				sensingLayer.material.materials[4].uniforms.uOpacity.value,
				math.mix( expandedState, 1.0, 0.5 ))



	}

// RENDER

	function render(){

		update()
		renderer.render( scene, camera )
		requestAnimationFrame( render )	

	}

	render()


// INTERACTION

	// Prevents default OS page scroll events
	document.body.addEventListener('touchmove', (e) => e.preventDefault() , false); 



	let updateHotSpotPosition = ( evt ) => {

		let bounds = canvas.getBoundingClientRect()

		let x = evt.clientX - bounds.left,
			y = evt.clientY - bounds.top;


		let screenCoord = [( x / bounds.width ) * 2 - 1, - ( y / bounds.height ) * 2 + 1]
		let p = projectToUV( camera, screenCoord, electricLayer )



		hotspotPos = [ 
			math.map( p.x, -width*0.5, width*0.5, 0, WIDTH ),
			math.map( p.y, -height*0.5, height*0.5, 0, HEIGHT ),
		]	

	}


	let onInteractionUpdate = updateHotSpotPosition


	let onInteractionStart = ( evt ) => {	
		interactionState = 1
		updateHotSpotPosition( evt )

		document.addEventListener( 'pointermove', onInteractionUpdate )		
		document.addEventListener( 'pointerup', onInteractionEnd )
	}


	let onInteractionEnd = () => {
		interactionState = 0

		document.removeEventListener( 'pointermove', onInteractionUpdate )
		document.removeEventListener( 'pointerup', onInteractionEnd )
	}


	document.addEventListener( 'pointerdown', onInteractionStart )


