var enemyState = {"Stateless":0, "Wander":1, "Chase":2,}
Object.freeze(enemyState)

class enemyObject {

	constructor(x, z, type, id, depth) {
		this.xpos = x;
		this.zpos = z;
		this.type = type;
		this.mesh;
		this.mymaterial;
		this.id = id;
    this.depth = depth;
    this.state = enemyState.Statless;

    this.nextX = 0;
    this.nextZ = 0;
    this.xOffset = 0;
    this.zOffset = 0;
	}

  getCollisionArray(){
    var myCollision = [];
    myCollision.push(this.xpos, this.zpos);
    if(this.nextX != this.xpos || this.nextZ != this.zpos){
      myCollision.push(this.nextX, this.nextZ);
    }
    return myCollision;
  }

	updateObject(delta, collisionArray){
		if(this.state == enemyState.Statless){
      this.state = enemyState.Wander;
    }

    if(this.state == enemyState.Wander){
      this.wander(delta, collisionArray);
    }


    //movementSwitching
    if(this.xOffset > 0.5 || this.zOffset > 0.5 || this.xOffset < -0.5 || this.zOffset < -0.5){
      this.xpos = this.nextX;
      this.zpos = this.nextZ;
      this.zOffset = this.zOffset * -1;
      this.xOffset = this.xOffset * -1;
      if(this.xOffset < 0){
        this.xOffset = -0.5;
      }
      if(this.xOffset > 0){
        this.xOffset = 0.5;
      }
      if(this.zOffset < 0){
        this.zOffset = -0.5;
      }
      if(this.zOffset > 0){
        this.zOffset = 0.5;
      }
    }

    this.mesh.position.x = this.xpos + 0.5 + this.xOffset;
    this.mesh.position.z = this.zpos + 0.5 + this.zOffset;
    this.mesh.position.y = 0.25;
	}

  wander(delta, collisionArray){
    var direction = 0;
      if(this.zOffset == 0 && this.xOffset == 0){
        direction = Math.floor(Math.random() * 4) + 1;
      }
      
      if(direction == 1){//up
        if(collisionArray[this.turnXZIntoValue(this.xpos, this.zpos - 1)] == false){
          this.nextX = this.xpos;
          this.nextZ = this.zpos - 1;
        }
      }
      if(direction == 2){//down
        if(collisionArray[this.turnXZIntoValue(this.xpos, this.zpos + 1)] == false){
          this.nextX = this.xpos;
          this.nextZ = this.zpos + 1;
        }
      }
      if(direction == 3){//left
        if(collisionArray[this.turnXZIntoValue(this.xpos - 1, this.zpos)] == false){
          this.nextX = this.xpos - 1;
          this.nextZ = this.zpos;
        }
      }
      if(direction == 4){//left
        if(collisionArray[this.turnXZIntoValue(this.xpos + 1, this.zpos)] == false){
          this.nextX = this.xpos + 1;
          this.nextZ = this.zpos;
        }
      }
      if(this.nextX != this.xpos || this.nextZ != this.zpos){
        this.xOffset = this.xOffset + (this.nextX - this.xpos) * delta;
        this.zOffset = this.zOffset + (this.nextZ - this.zpos) * delta;
      } else {
        if(this.xOffset > 0){
          this.xOffset = this.xOffset - delta;
          if(this.xOffset < 0){
            this.xOffset = 0;
          }
        }
        if(this.zOffset > 0){
          this.zOffset = this.zOffset - delta;
          if(this.zOffset < 0){
            this.zOffset = 0;
          }
        }
        if(this.xOffset < 0){
          this.xOffset = this.xOffset + delta;
          if(this.xOffset > 0){
            this.xOffset = 0;
          }
        }
        if(this.zOffset < 0){
          this.zOffset = this.zOffset + delta;
          if(this.zOffset > 0){
            this.zOffset = 0;
          }
        }
      }
  }

	drawObject(){
  	var geometry = new THREE.BoxBufferGeometry( 0.5, 0.5, 0.5 );
    var color = new THREE.Color("rgb(255, 255, 0)");
    this.mymaterial = new THREE.MeshPhongMaterial( {
      color: 0xffff00, specular: 0xffffff, shininess: 2,
      side: THREE.FrontSide, shadowSide: THREE.DoubleSide, name: 'enemyMaterial + id',
    } );
    this.mesh = new THREE.Mesh( geometry, this.mymaterial );

		this.mesh.castShadow = true; //default is false
  	this.mesh.receiveShadow = true; //default
	  this.mesh.name = "enemyMesh" + this.id;
    this.mesh.position.x = this.xpos + 0.5 + this.xOffset;
    this.mesh.position.z = this.zpos + 0.5 + this.zOffset;
    this.mesh.position.y = 0.25;
    this.mesh.material.color = color;
	  scene.add( this.mesh );
 }

	removeObject(){
		removeEntity(this.mymaterial);
		removeEntity(this.mesh);
	}

  turnXZIntoValue(x,z){
    return (x + z * this.depth);
  }
}