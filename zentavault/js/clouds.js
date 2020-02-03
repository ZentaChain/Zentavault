			var container; 
			var camera, scene, renderer;
			var mesh, geometry, material;

			var mouseX = 0, mouseY = 0;
			var start_time = Date.now();

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			(function($) {
				$(function() {
					init();				
				});
			})(jQuery);

			
			function init() {

				if ( $("html").hasClass('no-webgl') || $("body").hasClass("no-webgl") ) {
					//Detector.addGetWebGLMessage();
					$("body").addClass("no-webgl");
					return;
				}

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				// Bg gradient

				var canvas = document.createElement( 'canvas' );
				canvas.width = 32;
				canvas.height = window.innerHeight;

				var context = canvas.getContext( '2d' );

				var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
				gradient.addColorStop(0, "#1e4877");
				gradient.addColorStop(0.5, "#4584b4");

				context.fillStyle = gradient;
				context.fillRect(0, 0, canvas.width, canvas.height);

			

				camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
				camera.position.z = 6000;

				scene = new THREE.Scene();

				geometry = new THREE.Geometry();

				var texture = THREE.ImageUtils.loadTexture( 'clouds/20.png', null, animate );
				texture.magFilter = THREE.LinearMipMapLinearFilter;
				texture.minFilter = THREE.LinearMipMapLinearFilter;

				var fog = new THREE.Fog( "#ddd", - 100, 3000 );

				material = new THREE.ShaderMaterial( {

					uniforms: {

						"map": { type: "t", value: texture },
						"fogColor" : { type: "c", value: fog.color },
						"fogNear" : { type: "f", value: fog.near },
						"fogFar" : { type: "f", value: fog.far },

					},
					vertexShader: document.getElementById( 'vs' ).textContent,
					fragmentShader: document.getElementById( 'fs' ).textContent,
					depthWrite: false,
					depthTest: false,
					transparent: true

				} );

				var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

				for ( var i = 0; i < 8000; i++ ) {

					plane.position.x = Math.random() * 2000 - 1000;
					plane.position.y = - Math.random() * Math.random() * 200 - 15;
					plane.position.z = i;
					plane.rotation.z = Math.random() * Math.PI;
					plane.scale.x = plane.scale.y = Math.random() * Math.random() * 3 + 0.5;

					THREE.GeometryUtils.merge( geometry, plane );

				}

				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

				mesh = new THREE.Mesh( geometry, material );
				mesh.position.z = - 8000;
				scene.add( mesh );

				renderer = new THREE.WebGLRenderer( { antialias: false } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				window.addEventListener( 'resize', onWindowResize, false );

				
				rotationZ = 0;
				function onDocumentMouseMove( event ) {

					mouseX = ( event.clientX - windowHalfX ) * 0.25;
					mouseY = ( event.clientY - windowHalfY ) * 0.15;

					rotationZ =  (( event.clientX - windowHalfX) / windowHalfX ) / 8;
				
				}

				function onWindowResize( event ) {

					camera.aspect = window.innerWidth / window.innerHeight;
					camera.updateProjectionMatrix();

					renderer.setSize( window.innerWidth, window.innerHeight );

				}

				var loaded = false;
				var firstFrame = true;


				position = 0;
				cameraSpeed = 1;

				function animate() {
					if ( !loaded && !firstFrame) {
						loaded = true;
						//setTimeout(function(){
							$("body").addClass("loaded");						
						//}, 500);

					}
					firstFrame = false;


					requestAnimationFrame( animate );

					position += cameraSpeed / 3;
					if ( position > 7500 ) position = 0;
					//position = ( ( Date.now() - start_time ) * 0.03 ) % 8000;

					camera.position.x += ( mouseX - camera.position.x ) * (0.005 * Math.max(1,cameraSpeed / 3));
					camera.position.y += ( - mouseY - camera.position.y ) * (0.005 * Math.max(1,cameraSpeed / 3));
					camera.position.z = - position + 8000;

					camera.rotation.z += ( - rotationZ - camera.rotation.z ) * (0.005 * Math.max(1,cameraSpeed / 3));


					renderer.render( scene, camera );

				}

			}