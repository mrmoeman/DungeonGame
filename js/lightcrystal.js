class LightCrystal extends WorldObject {

  constructor(x, z, id) {
    super(x, z, true, id);
    this.color = new THREE.Color("rgb(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ")");
    this.mylight;
  }

  drawObject(){
  	var geometry = new THREE.BoxBufferGeometry( 0.5, 0.5, 0.5 );
    this.mymaterial = new THREE.MeshPhongMaterial( {
      specular: 0xffffff, shininess: 2,
      side: THREE.FrontSide, shadowSide: THREE.DoubleSide, name: 'worldObjectMaterial' + this.id, transparent: true, opacity: 0.7,
    } );
    this.mymesh = new THREE.Mesh( geometry, this.mymaterial );

  	this.mymesh.castShadow = false;
    this.mymesh.receiveShadow = false;
  	this.mymesh.name = "worldObjectMesh" + this.id;
    this.mymesh.position.x = this.xpos + 0.5;
    this.mymesh.position.z = this.zpos + 0.5;
    this.mymesh.position.y = 0.25;
    this.mymesh.material.color = this.color;
    scene.add( this.mymesh );

    this.mylight = new THREE.PointLight( this.color, 0.5, 10);
    this.mylight.position.set( this.xpos + 0.5, this.ypos + 0.5, this.zpos + 0.5);
    this.mylight.castShadow = false;  
    scene.add( this.mylight );
  }

	removeObject(){
		removeEntity(this.mymaterial);
		removeEntity(this.mymesh);
    scene.remove(this.mylight);
	}
}