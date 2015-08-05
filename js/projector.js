/*
	Returns a 3d point at the intersection 
	of a plane and a 2d screen coordinate 
	projected into the scene
*/

import THREE from 'three'

let ray = new THREE.Vector3();

export default ( camera ) => {
	
	return ( point, plane ) => {

		// ray.direction.set( 0, 0,)
		ray.set( point[0], point[1], 0.5 )
			.unproject( camera )
			// .subSelf( camera.position )
			// .normalize()

		console.log( ray )

		// // var vector = new THREE.Vector3();
		// // var projector = new THREE.Projector();
		// projector.projectVector( vector.setFromMatrixPosition( object.matrixWorld ), camera );

		// vector.x = ( vector.x * widthHalf ) + widthHalf;
		// vector.y = - ( vector.y * heightHalf ) + heightHalf;

	}

}	