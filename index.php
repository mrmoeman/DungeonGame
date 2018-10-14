<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>Dungeon Generator Test</title>
		<link href="https://fonts.googleapis.com/css?family=MedievalSharp" rel="stylesheet">
		<style>
			body { margin: 0; overflow:hidden;}
			canvas { width: 100%; height: 100% }
			p { font-family: 'MedievalSharp', cursive; }
		</style>
	</head>
	<body style="position:absolute;">
		<div style="float:left; color:white; position:absolute; padding-left: 50px;">
			<p id="FPS-BOX"></p>
		</div>
		<div style="color:white; position:absolute; bottom:50%; width: 100%; text-align:center; z-index: 99;" id="START-BOX">
			<p><span style="font-size: 2.5em;">Amazing Dungeon Game</span><br>
			A Game by Sarah Anderson</p>
			<p><a onclick="startGame()" style="cursor:pointer; font-size: 2em; transition: 1s;">Start Game</a></p>
			<p><a style="font-size: 1em; transition: 1s;text-decoration: underline">Controls</a></p>
			<p><a style="font-size: 1em; transition: 1s;">W A S D - Move<br>Q E - Rotate Camera<br>SPACE - New World</a></p>
		</div>
		<p style="position:absolute; bottom:0; color:white; padding-left: 50px; font-size: 2em; display: none;" id="NAME-BOX"></p>
		<div style="position:absolute; width: 100%; height: 100%; background-color:black;opacity:0;" id ="FADE-BOX">
		</div>
		<script src="https://threejs.org/build/three.js"></script>
		<script src="js/namelist.js"></script>
		<script src="js/grid.js"></script>
		<script src="js/tile.js"></script>
		<script src="js/gameinstance.js"></script>
		<script src="js/path.js"></script>
		<script src="js/pathcalcdata.js"></script>
		<script src="js/worldinstance.js"></script>
		<script src="js/htmlinterface.js"></script>
		<script src="js/enemyobject.js"></script>
		<script src="js/worldobject.js"></script>
		<script src="js/lightcrystal.js"></script>
		<script src="js/dungeonlight.js"></script>
		<script src="js/tree.js"></script>
		<script src="js/playerobject.js"></script>
		<script>
			// Converts from degrees to radians.
			Math.radians = function(degrees) {
			  return degrees * Math.PI / 180;
			};
			// Converts from radians to degrees.
			Math.degrees = function(radians) {
			  return radians * 180 / Math.PI;
			};

			var GamePlayer = new PlayerObject();
			var currentInstance = new GameInstance();

			document.addEventListener('keydown', function(event) {
				currentInstance.processInput(event);
			});
			document.addEventListener('keyup', function(event) {
				currentInstance.processInputRelease(event);
			});
			document.addEventListener('wheel', function(event) {
				currentInstance.processWheel(event);
			});

			function sleep(milliseconds) {
			  var start = new Date().getTime();
			  for (var i = 0; i < 1e7; i++) {
			    if ((new Date().getTime() - start) > milliseconds){
			      break;
			    }
			  }
			} 

			function shuffleArray(arrayIn){
			    var ArrayInCopy = [];
			    for(var i = 0; i < arrayIn.length; i++){
			      ArrayInCopy[i] = arrayIn[i];
			    }
			    var arrayOut = [];

			    while(arrayOut.length != arrayIn.length){
			      which = Math.floor((Math.random() * ArrayInCopy.length));
			      arrayOut.push(ArrayInCopy[which]);
			      ArrayInCopy.splice(which, 1);

			    }
			    return arrayOut;
			}

			window.addEventListener( 'resize', onWindowResize, false );
			function onWindowResize(){
			    camera.aspect = window.innerWidth / window.innerHeight;
			    camera.updateProjectionMatrix();
			    renderer.setSize( window.innerWidth, window.innerHeight );
			}

			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );


			//shadow settings
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


			//shadow helper
			//const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
			//scene.add(cameraHelper);

			currentInstance.drawWorld();
			currentInstance.setCameraToRotate();
			currentInstance.updateLighting();

			function animate() {
				renderer.clear();
				requestAnimationFrame( animate );
				var time = Date.now() * 0.001;
				currentInstance.updateMainLoop();
				currentInstance.updateCamera(camera);
				currentInstance.updateCamera(camera);
				renderer.render( scene, camera );
			}

			function removeEntity(object) {
			    var selectedObject = scene.getObjectByName(object.name);
			    scene.remove( selectedObject );
			}

			animate();
		</script>
	</body>
</html>