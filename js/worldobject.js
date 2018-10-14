class WorldObject {
	constructor(x, z, hasCollision, id) {
		this.xpos = x;
		this.zpos = z;
		this.ypos = 0;
		this.id = id;
		this.hasCollision = hasCollision;
		this.mymesh;
	}

	getCollisionArray(){
		var myCollision = [];
		if(this.hasCollision == true){
		  myCollision.push(this.xpos, this.zpos);
		}
		return myCollision;
	}

	updateObject(delta, collisionArray){

	}

	drawObject(){
	  	var geometry = new THREE.BoxBufferGeometry( 0.5, 0.5, 0.5 );
	    var color = new THREE.Color("rgb(255, 255, 0)");
	    this.mymaterial = new THREE.MeshPhongMaterial( {
	      color: 0xffff00, specular: 0xffffff, shininess: 2,
	      side: THREE.FrontSide, shadowSide: THREE.DoubleSide, name: 'worldObjectMaterial + id',
	    } );
	    this.mymesh = new THREE.Mesh( geometry, this.mymaterial );

		//this.mymesh.castShadow = true; //default is false
	  	//this.mymesh.receiveShadow = true; //default
		this.mymesh.name = "worldObjectMesh" + this.id;
	    this.mymesh.position.x = this.xpos;
	    this.mymesh.position.z = this.zpos;
	    this.mymesh.position.y = this.ypos;
	    this.mymesh.material.color = color;
		scene.add( this.mymesh );
 	}

	removeObject(){
		removeEntity(this.mymaterial);
		removeEntity(this.mymesh);
	}
}