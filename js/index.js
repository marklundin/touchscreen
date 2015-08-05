import THREE from 'three'
import math from './math'
import createProjector from './projector'
import electricMaterial from './electric-material'
import events from './pointer-events'
import facingMaterial from './mesh-facing-material'


window.THREE = THREE

// INITIALISE


	// Constants
	let container = document.querySelector( '.gl' ),
		EXPANDED_HOTSPOT_SIZE = 80,
		WIDTH = container.getBoundingClientRect().width,
		HEIGHT = container.getBoundingClientRect().height



	// Params
	let expandedState = 0,
		interactionState = 0,
		hotspotPos = [ 0, 0 ]
		


// INITIALISE RENDERER


	let canvas = document.createElement('canvas'), 
		renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias: true, premultipliedAlpha:true}),
		camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT),
		scene = new THREE.Scene(),
		project = createProjector( camera )


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



// LAYERS

	let layers = new THREE.Object3D()
	let layerThickness = 1.0;

	
	let electricLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width, height, layerThickness ),
		electricMaterial( new THREE.Vector2( WIDTH, HEIGHT )))


	let sensingLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width, height, layerThickness ),
		electricMaterial( new THREE.Vector2( WIDTH, HEIGHT )))


	let processorLayer = new THREE.Mesh( 
		new THREE.BoxGeometry( width * 0.5, width * 0.5, layerThickness ),
		facingMaterial( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture('img/processor.jpg')
		})))


	layers.add( electricLayer )
	// layers.add( sensingLayer )
	layers.add( processorLayer )


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
			[ electricLayer.position, 	new THREE.Vector3( 0, 0, 0 )],
			[ processorLayer.position, 	new THREE.Vector3( 0, 0, -1 )]
		]),

		// Properties and values in the expanded states
		new Map([
			[ camera.position, 			new THREE.Vector3( 0, 0, 200 )],
			[ layers.rotation, 			new THREE.Euler( -.3, .8, 0 )],
			[ electricLayer.position, 	new THREE.Vector3( 0, 0, 30 )],
			[ processorLayer.position, 	new THREE.Vector3( 0, 0, -30 )]
		])
	]


// TRANSITION


	// Performs a naive transition, sliding 'a' towards 'b'
	let slideTo = ( a, b ) => ( b - a ) * 0.08+ a


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
		electricLayer.material.materials[4].uniforms.uOrigin.value.fromArray( hotspotPos )


		electricLayer.material.materials[4].uniforms.uRadius.value = slideTo( 
				electricLayer.material.materials[4].uniforms.uRadius.value,
				interactionState * EXPANDED_HOTSPOT_SIZE )


		electricLayer.material.materials[4].uniforms.uOpacity.value = slideTo( 
				electricLayer.material.materials[4].uniforms.uOpacity.value,
				math.mix( expandedState, 1.0, 0.5 ))


		sensingLayer.material.opacity = electricLayer.material.materials[4].uniforms.uOpacity.value


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
			y = bounds.height - ( evt.clientY - bounds.top )

		x = math.clamp( x, 0, bounds.width )
		y = math.clamp( y, 0, bounds.height )

		hotspotPos = [ x, y ];
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


