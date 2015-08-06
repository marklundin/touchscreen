import THREE from 'three'
import facingMaterial from './mesh-facing-material'

export default ( resolution ) => {
	return facingMaterial(
		new THREE.ShaderMaterial({

			uniforms: {

				uResolution: { type: "v2", value: resolution },
				uOrigin: { type: "v2", value: new THREE.Vector2( resolution.x*0.5, resolution.y*0.5) },
				uRadius: { type: "f", value: 0 },
				uOpacity: { type: "f", value: 1.0 }

			},
			
			fragmentShader : `

				#ifdef GL_OES_standard_derivatives
					#extension GL_OES_standard_derivatives : enable
				#endif

				varying vec2 vUv;

				uniform vec2 uResolution;
				uniform vec2 uOrigin;
				uniform float uOpacity;
				uniform float uRadius;

				float aastep(float threshold, float value) {
					#ifdef GL_OES_standard_derivatives
						float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
						return smoothstep(threshold-afwidth, threshold+afwidth, value);
					#else
						return step(threshold, value);
					#endif  
				}


				// float aastep( float threshold, float distance ){
				// 	#ifdef GL_OES_standard_derivatives
				// 	    float d  = (distance - 0.5); // distance rebias 0..1 --> -0.5 .. +0.5
				// 	    float aa = 0.75*length( vec2( dFdx( d ), dFdy( d ))); // anti-alias
				// 	    return smoothstep( -aa, aa, d );
				// 	#else
				// 	    const float w = 0.25; // fallback to smoothstep( 0.25, 0.75, distance ) if texture gradients not available
				// 	    return smoothstep( threshold-w, threshold+w, distance ); 
				// 	#endif
				// }


				float line( vec2 p, float thickness ){
					return aastep( thickness, abs( p.y ));
				}


				float circle( vec2 p, float radius ){
					return aastep( radius, length( p ));
				}


				float lines( vec2 p, vec2 c, float thickness ){
					vec2 q = mod( p, c ) - 0.5 * c;
					return line( q, thickness );
				}


				float pinch( vec2 p, vec2 o, float radius, float power, float verticalShape ){
					vec2 delta = p - o;
					delta.y *= verticalShape;
					return 1.0 - pow( smoothstep( .0, radius, length( delta )), power );
				}

				void main(){


					// COORDS
					vec2 p = vUv * uResolution;
					vec4 col = vec4(0.0);



					// DEFINE LINE STYLES
					float lineThickness = 2.0;
					float lineSpacing = 30.0;
					vec3 lineColor = vec3( 0.1, 0.9, 1.0 );
					vec3 focusColor = vec3( 1.0, 0.0, 1.0 );



					// DISTORT COORDINATES AT HOTSPOT
					float distortionFactor = pinch( p, uOrigin, uRadius * 1.8, 1.2, 0.5 );
					vec2 distortion = ( p - uOrigin ) * distortionFactor * 0.9;



					// CALCULATE LINES				
					float value = lines( p + distortion, vec2( 0.0, lineSpacing ), lineThickness );





					col.rgb = mix( lineColor, focusColor, distortionFactor );
					// col.rgb = mix( col.rgb, vec3( 1.0 ), value );
					col.a = 1.0 - value;//1.0;//1.0 - value + uOpacity;

					

					gl_FragColor = col;

				}

			`,
			// blending: THREE.MultiplyBlending,
			transparent: true,
			vertexShader: defaultVertexShader
		})
	)
}


// Standard vertex shader
let defaultVertexShader = `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`