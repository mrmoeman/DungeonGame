class worldInstance {
  constructor(width, depth, worldType) {
    this.width = width;
    this.depth = depth;
    this.gridobject = new Grid(width,depth, worldType);
    this.collision = this.gridobject.buildCollisionArray();

    //enemies
    this.enemies = [];
    this.spawnEnemies(this.collision);

    this.worldGeometry = new THREE.BufferGeometry();
    this.worldVertices = [];
    this.worldNormals = [];
    this.worldColors = [];
    this.mesh;
    this.material;
    this.shadowLight;
    this.ambient;
  }

  update(delta, rotY){
    var TempCollision = [];
    for(var i = 0; i < this.collision.length; i++){
      TempCollision[i] = this.collision[i];
    }
    for(var i = 0; i < this.enemies.length; i++){
      var temp = this.enemies[i].getCollisionArray();
      for(var j = 0; j < temp.length; j += 2){
        TempCollision[this.turnXZIntoValue(temp[j], temp[j+1])] = 1;
      }
    }
    var objectCollision = this.gridobject.getObjectCollsion();
    for(var i = 0; i < objectCollision.length; i++){
      if(objectCollision[i] == 1){
        TempCollision[i] = 1;
      }
    }

    GamePlayer.updatePlayer(delta, TempCollision, rotY, this.depth);

    var temp = GamePlayer.getCollisionArray();
    for(var j = 0; j < temp.length; j += 2){
      TempCollision[this.turnXZIntoValue(temp[j], temp[j+1])] = 1;
    }

    for(var i = 0; i < this.enemies.length; i++){
      this.enemies[i].updateObject(delta, TempCollision);
      var temp = this.enemies[i].getCollisionArray();
      for(var j = 0; j < temp.length; j += 2){
        TempCollision[this.turnXZIntoValue(temp[j], temp[j+1])] = 1;
      }
    }
  }

  createMesh(){
    this.material = new THREE.MeshPhongMaterial( {
      color: 0xaaaaaa, specular: 0xffffff, shininess: 2,
      side: THREE.FrontSide, vertexColors: THREE.VertexColors, shadowSide: THREE.DoubleSide, name: 'myMaterial',
    } );

    this.gridobject.processTileGeometry(this.worldVertices, this.worldNormals, this.worldColors);
    //this.gridobject.outputTiles();
    function disposeArray() { this.array = null; }
    this.worldGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( this.worldVertices, 3 ).onUpload( disposeArray ) );
    this.worldGeometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( this.worldNormals, 3 ).onUpload( disposeArray ) );
    this.worldGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( this.worldColors, 3 ).onUpload( disposeArray ) );
    this.worldGeometry.computeBoundingSphere();

    this.mesh = new THREE.Mesh( this.worldGeometry, this.material );
    this.mesh.castShadow = true; //default is false
    this.mesh.receiveShadow = true; //default
    this.mesh.name = "myMesh";
    scene.add( this.mesh );

    for(var i = 0; i < this.enemies.length; i++){
      this.enemies[i].drawObject();
    }
  }

  removeMeshFromScene(){
    removeEntity(this.mesh);
    removeEntity(this.material);
    removeEntity(this.shadowLight);
    removeEntity(this.ambient);

    this.gridobject.scrapObjectMeshes();

    for(var i = 0; i < this.enemies.length; i++){
      this.enemies[i].removeObject();
    }
  }

  spawnEnemies(collisionArray){
    var spawnablePlacements = [];
    var myorder = [];
    for(var z = 0; z < this.depth; z++){
      for(var x = 0; x < this.width; x++){
        if(collisionArray[this.turnXZIntoValue(x,z)] == false){
          spawnablePlacements.push(new THREE.Vector2(x, z));
          myorder.push(spawnablePlacements.length - 1);
        }
      }
    }
    collisionArray[this.turnXZIntoValue(GamePlayer.xpos,GamePlayer.zpos)] = 1;
    myorder = shuffleArray(myorder);
    for(var i = 0; i < spawnablePlacements.length * 0.015 && i < myorder.length; i++){
      this.enemies.push(new enemyObject(spawnablePlacements[myorder[i]].x, spawnablePlacements[myorder[i]].y, 1, i, this.depth));
    }
  }

  updateLighting(){
    if(this.gridobject.lightingType == 0){
      //Create a PointLight and turn on shadows for the light
      this.shadowLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      this.shadowLight.position.set( 80, 80, 80);
      this.shadowLight.castShadow = true;            // default false
      //Set up shadow properties for the light
      this. shadowLight.shadow.mapSize.width = 4096;  // default
      this.shadowLight.shadow.mapSize.height = 4096; // default
      this.shadowLight.shadow.camera.near = 10;    // default
      this.shadowLight.shadow.camera.far = 200;     // default
      this.shadowLight.shadow.camera.fov = 200;     // default
      this.shadowLight.shadow.camera.left = -100;
      this.shadowLight.shadow.camera.right = 100;
      this.shadowLight.shadow.camera.top = 100;
      this.shadowLight.shadow.camera.bottom = -100;
      this.shadowLight.shadow.bias = -0.001;
      this.shadowLight.name = "shadowLight";
      scene.add( this.shadowLight );

      //ambient
      this.ambient = new THREE.AmbientLight( 0x444444 );
      this.ambient.name = "ambientLight";
      scene.add( this.ambient );
    } else if(this.gridobject.lightingType == 1){
      //Create a PointLight and turn on shadows for the light
      this.shadowLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
      this.shadowLight.position.set( 80, 80, 80);
      this.shadowLight.castShadow = true;            // default false
      //Set up shadow properties for the light
      this. shadowLight.shadow.mapSize.width = 4096;  // default
      this.shadowLight.shadow.mapSize.height = 4096; // default
      this.shadowLight.shadow.camera.near = 10;    // default
      this.shadowLight.shadow.camera.far = 200;     // default
      this.shadowLight.shadow.camera.fov = 200;     // default
      this.shadowLight.shadow.camera.left = -100;
      this.shadowLight.shadow.camera.right = 100;
      this.shadowLight.shadow.camera.top = 100;
      this.shadowLight.shadow.camera.bottom = -100;
      this.shadowLight.shadow.bias = -0.001;
      this.shadowLight.name = "shadowLight";
      scene.add( this.shadowLight );

      //ambient
      this.ambient = new THREE.AmbientLight( 0x444444, 0);
      this.ambient.name = "ambientLight";
      scene.add( this.ambient );
    } else if(this.gridobject.lightingType == 2){
      //Create a PointLight and turn on shadows for the light
      this.shadowLight = new THREE.DirectionalLight( 0xffffff, 0.1);
      this.shadowLight.position.set( 80, 80, 80);
      this.shadowLight.castShadow = false;            // default false
      //Set up shadow properties for the light
      this. shadowLight.shadow.mapSize.width = 4096;  // default
      this.shadowLight.shadow.mapSize.height = 4096; // default
      this.shadowLight.shadow.camera.near = 10;    // default
      this.shadowLight.shadow.camera.far = 200;     // default
      this.shadowLight.shadow.camera.fov = 200;     // default
      this.shadowLight.shadow.camera.left = -100;
      this.shadowLight.shadow.camera.right = 100;
      this.shadowLight.shadow.camera.top = 100;
      this.shadowLight.shadow.camera.bottom = -100;
      this.shadowLight.shadow.bias = -0.001;
      this.shadowLight.name = "shadowLight";
      //scene.add( this.shadowLight );

      //ambient
      this.ambient = new THREE.AmbientLight( 0x444444, 0.4);
      this.ambient.name = "ambientLight";
      scene.add( this.ambient );
    }
  }

  turnXZIntoValue(x,z){
    return (x + z * this.depth);
  }

  setPlayer(){
    this.gridobject.setPlayer();
  }
}