// import THREE from 'three'
import facingMaterial from './mesh-facing-material'

export default ( resolution ) => {
	return new THREE.ShaderMaterial({

		uniforms: {

			uResolution: { type: "v2", value: resolution },
			uOrigin: { type: "v2", value: new THREE.Vector2( resolution.x*0.5, resolution.y*0.5) },
			uRadius: { type: "f", value: 0 },

		},
		
		fragmentShader : `

			#ifdef GL_OES_standard_derivatives
				#extension GL_OES_standard_derivatives : enable
			#endif

			varying vec2 vUv;

			uniform vec2 uResolution;
			uniform vec2 uOrigin;
			uniform float uRadius;
			


			float aastep(float threshold, float value) {
				#ifdef GL_OES_standard_derivatives
					float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
					return smoothstep(threshold-afwidth, threshold+afwidth, value);
				#else
					return step(threshold, value);
				#endif  
			}


			float circle( vec2 p, float radius ){
				return aastep( radius, length( p ));
			}



			void main(){


				// COORDS
				vec2 p = vUv * uResolution;
				vec4 col = vec4( 0.9, 0.22, 0.64, 1.0 );
				vec4 reticuleCol = vec4( 0.9, 0.8, 0.2, 1.0 );


				// CIRCLE SDF
				float value = circle( abs( p - uOrigin ), uRadius );
				

				// float retX = aastep( 5.0, p.x - uOrigin.x );
				// float retY = aastep( 5.0, p.y - uOrigin.y );
				// float value = min( retX, retY );

				// col.rgb = mix( lineColor, focusColor, distortionFactor );
				// col.rgb = col;
				col.a = 1.0 - value;
				
				gl_FragColor = col;

			}

		`,
		// blending: THREE.MultiplyBlending,
		transparent: true,
		vertexShader: defaultVertexShader
	})
}


// Standard vertex shader
let defaultVertexShader = `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`