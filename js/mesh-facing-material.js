import THREE from 'three'

let edgeMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF})

export default ( facingMaterial ) => {
	return new THREE.MeshFaceMaterial([
		edgeMaterial,
		edgeMaterial,
		edgeMaterial,		
		edgeMaterial,
		facingMaterial,
		edgeMaterial
	])
}
