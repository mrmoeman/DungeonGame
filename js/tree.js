class Tree extends WorldObject {

  constructor(x, z, id) {
    super(x, z, true, id);
    this.mymeshtwo;
    this.mymaterialtwo;
  }

  drawObject(){
    this.mymaterial = new THREE.MeshPhongMaterial( {
      specular: 0xffffff, shininess: 2,
      side: THREE.FrontSide, shadowSide: THREE.DoubleSide, name: 'worldObjectMaterial' + this.id,
    } );
     this.mymaterialtwo = new THREE.MeshPhongMaterial( {
      specular: 0xffffff, shininess: 2,
      side: THREE.FrontSide, shadowSide: THREE.DoubleSide, name: 'worldObjectMaterial' + this.id,
    } );


  	var geometry = new THREE.BoxBufferGeometry( 0.2, 0.8, 0.2 );
    this.mymesh = new THREE.Mesh( geometry, this.mymaterial );
  	this.mymesh.castShadow = true;
    this.mymesh.receiveShadow = true;
  	this.mymesh.name = "worldObjectMesh" + this.id;
    this.mymesh.position.x = this.xpos + 0.5;
    this.mymesh.position.z = this.zpos + 0.5;
    this.mymesh.position.y = 0.4;
    this.mymesh.material.color = new THREE.Color("rgb(83, 49, 24)");
    scene.add( this.mymesh );

    var geometry = new THREE.BoxBufferGeometry( 0.6, 0.7, 0.6 );
    this.mymeshtwo = new THREE.Mesh( geometry, this.mymaterialtwo );
    this.mymeshtwo.castShadow = true;
    this.mymeshtwo.receiveShadow = true;
    this.mymeshtwo.name = "worldObjectMeshTwo" + this.id;
    this.mymeshtwo.position.x = this.xpos + 0.5;
    this.mymeshtwo.position.z = this.zpos + 0.5;
    this.mymeshtwo.position.y = 0.9;
    this.mymeshtwo.material.color = new THREE.Color("rgb(77, 168, 59)");
    scene.add( this.mymeshtwo );

  }

	removeObject(){
		removeEntity(this.mymaterial);
    removeEntity(this.mymaterialtwo);
		removeEntity(this.mymesh);
    removeEntity(this.mymeshtwo);
  }
}