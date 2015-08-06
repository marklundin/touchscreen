/*
	Returns a 2d uv coord at the intersection 
	of a plane and a 2d screen coordinate 
	projected into the scene
*/

import THREE from 'three'

var vector = new THREE.Vector3();
var raycaster = new THREE.Raycaster();
var plane = new THREE.Plane()
var facing = new THREE.Vector3( 0, 0, -1 )
var matObjWorldInv = new THREE.Matrix4();
let intersection = new THREE.Vector3();
let coplanarPoint = new THREE.Vector3( 10, 10, 1 )


export default ( camera, screenCoord, object ) => {
	facing.set( 0, 0, -1 ).transformDirection( object.matrixWorld )
	coplanarPoint.set( 10, 10, 1 ).applyMatrix4( object.matrixWorld )

	plane.setFromNormalAndCoplanarPoint( facing, coplanarPoint )
	vector.set( screenCoord[0], screenCoord[1], 0.5 );
	vector.unproject( camera );
	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

	raycaster.ray.intersectPlane( plane, intersection );
		matObjWorldInv.getInverse( object.matrixWorld )
		return intersection.applyMatrix4( matObjWorldInv )

}
