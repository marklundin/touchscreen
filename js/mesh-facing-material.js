// import THREE from 'three'

let edgeMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF, transparent:true, opacity:0})

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
