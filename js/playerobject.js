var buttonup = false;
var buttondown = false;
var buttonleft = false;
var buttonright = false;
var buttonturnleft = false;
var buttonturnright = false;
var spacebutton = false;

class PlayerObject {
	constructor() {
		this.xpos = 0;
		this.zpos = 0;
		this.ypos = 0;
		this.mymaterial;
		this.mymesh;

		this.nextxpos = 0;
		this.nextzpos = 0;

		this.offsetX = 0;
		this.offsetZ = 0;
	}

	getCollisionArray(){
		var myCollision = [];
		myCollision.push(this.xpos, this.zpos);
		myCollision.push(this.nextxpos, this.nextzpos);
		return myCollision;
	}

	getCameraPosXOffset(){
		return this.xpos + 0.5 + this.offsetX;
	}

	getCameraPosZOffset(){
		return this.zpos + 0.5 + this.offsetZ;
	}

	updatePlayer(delta, collisionArray, rotY, depth){

		if(this.nextxpos == this.xpos && this.nextzpos == this.zpos && this.offsetX == 0 && this.offsetZ == 0){
			//up
			var movementDecided = false;
			var checkPos = new THREE.Vector2(0,0);
			if(buttonup == true && movementDecided == false){
				if(rotY >= 0  && rotY < 90){
					checkPos.x = this.xpos;
					checkPos.y = this.zpos - 1;
				}
				if(rotY >= 90  && rotY < 180){
					checkPos.x = this.xpos + 1;
					checkPos.y = this.zpos;
				}
				if(rotY >= 180  && rotY < 270){
					checkPos.x = this.xpos;
					checkPos.y = this.zpos + 1;
				}
				if(rotY >= 270  && rotY < 360){
					checkPos.x = this.xpos - 1;
					checkPos.y = this.zpos;
				}
				if(collisionArray[this.turnXZIntoValue(checkPos.x, checkPos.y, depth)] == false){
					this.nextxpos = checkPos.x;
					this.nextzpos = checkPos.y;
					movementDecided = true;
				}
			}
			//down
			if(buttondown == true && movementDecided == false){
				if(rotY >= 0  && rotY < 90){
					checkPos.x = this.xpos;
					checkPos.y = this.zpos + 1;
				}
				if(rotY >= 90  && rotY < 180){
					checkPos.x = this.xpos - 1;
					checkPos.y = this.zpos;
				}
				if(rotY >= 180  && rotY < 270){
					checkPos.x = this.xpos;
					checkPos.y = this.zpos - 1;
				}
				if(rotY >= 270  && rotY < 360){
					checkPos.x = this.xpos + 1;
					checkPos.y = this.zpos;
				}
				if(collisionArray[this.turnXZIntoValue(checkPos.x, checkPos.y, depth)] == false){
					this.nextxpos = checkPos.x;
					this.nextzpos = checkPos.y;
					movementDecided = true;
				}
			}
			//left
			if(buttonleft == true && movementDecided == false){
				if(rotY >= 0  && rotY < 90){
					checkPos.x = this.xpos - 1;
					checkPos.y = this.zpos;
				}
				if(rotY >= 90  && rotY < 180){
					checkPos.x = this.xpos;
					checkPos.y = this.zpos - 1;
				}
				if(rotY >= 180  && rotY < 270){
					checkPos.x = this.xpos + 1;
					checkPos.y = this.zpos;
				}
				if(rotY >= 270  && rotY < 360){
					checkPos.x = this.xpos;
					checkPos.y = this.zpos + 1;
				}
				if(collisionArray[this.turnXZIntoValue(checkPos.x, checkPos.y, depth)] == false){
					this.nextxpos = checkPos.x;
					this.nextzpos = checkPos.y;
					movementDecided = true;
				}
			}
			//right
			if(buttonright == true && movementDecided == false){
				if(rotY >= 0  && rotY < 90){
					checkPos.x = this.xpos + 1;
					checkPos.y = this.zpos;
				}
				if(rotY >= 90  && rotY < 180){
					checkPos.x = this.xpos;
					checkPos.y = this.zpos + 1;
				}
				if(rotY >= 180  && rotY < 270){
					checkPos.x = this.xpos - 1;
					checkPos.y = this.zpos;
				}
				if(rotY >= 270  && rotY < 360){
					checkPos.x = this.xpos;
					checkPos.y = this.zpos - 1;
				}
				if(collisionArray[this.turnXZIntoValue(checkPos.x, checkPos.y, depth)] == false){
					this.nextxpos = checkPos.x;
					this.nextzpos = checkPos.y;
					movementDecided = true;
				}
			}
		}
		//movementoffset
		if((this.nextxpos != this.xpos || this.nextzpos != this.zpos) && this.nextxpos != 0){
	        this.offsetX = this.offsetX + (this.nextxpos - this.xpos) * (2 *delta);
	        this.offsetZ = this.offsetZ + (this.nextzpos - this.zpos) * (2 *delta);
	      } else {
	        if(this.offsetX > 0){
	          this.offsetX = this.offsetX - (2 *delta);
	          if(this.offsetX < 0){
	            this.offsetX = 0;
	          }
	        }
	        if(this.offsetZ > 0){
	          this.offsetZ = this.offsetZ - (2 *delta);
	          if(this.offsetZ < 0){
	            this.offsetZ = 0;
	          }
	        }
	        if(this.offsetX < 0){
	          this.offsetX = this.offsetX + (2 *delta);
	          if(this.offsetX > 0){
	            this.offsetX = 0;
	          }
	        }
	        if(this.offsetZ < 0){
	          this.offsetZ = this.offsetZ + (2 *delta);
	          if(this.offsetZ > 0){
	            this.offsetZ = 0;
	          }
	        }
	      }

		//movementSwitching
	    if(this.offsetX >= 0.5 || this.offsetZ >= 0.5 || this.offsetX <= -0.5 || this.offsetZ <= -0.5){
	      	this.xpos = this.nextxpos;
	      	this.zpos = this.nextzpos;
	      	this.offsetZ = this.offsetZ * -1;
	      	this.offsetX = this.offsetX * -1;
	      	if(this.offsetX < 0){
	      	  this.offsetX = -0.5;
	      	}
	      	if(this.offsetX > 0){
	        	this.offsetX = 0.5;
	      	}
	      	if(this.offsetZ < 0){
	        	this.offsetZ = -0.5;
	      		}
	      	if(this.offsetZ > 0){
	       		this.offsetZ = 0.5;
	      	}
	    }

		if(this.xpos != 0){
			this.mymesh.position.x = this.xpos + 0.5 + this.offsetX;
	    	this.mymesh.position.z = this.zpos + 0.5 + this.offsetZ;
	    	this.mymesh.position.y = this.ypos + 0.5;
		}
	}

	drawObject(){
	  	var geometry = new THREE.BoxBufferGeometry( 0.5, 0.5, 0.5 );
	    var color = new THREE.Color("rgb(0, 0, 70)");
	    this.mymaterial = new THREE.MeshPhongMaterial( {
	      color: 0xffff00, specular: 0xffffff, shininess: 2,
	      side: THREE.FrontSide, shadowSide: THREE.DoubleSide, name: 'PlayerMaterial',
	    } );
	    this.mymesh = new THREE.Mesh( geometry, this.mymaterial );

		this.mymesh.castShadow = true; //default is false
	  	this.mymesh.receiveShadow = true; //default
		this.mymesh.name = "PlayerMesh";
	    this.mymesh.position.x = this.xpos + 0.5;
	    this.mymesh.position.z = this.zpos + 0.5;
	    this.mymesh.position.y = this.ypos + 0.5;
	    this.mymesh.material.color = color;
		scene.add( this.mymesh );
 	}

	removeObject(){
		removeEntity(this.mymaterial);
		removeEntity(this.mymesh);
	}

	turnXZIntoValue(x,z, depth){
    	return (x + z * depth);
  	}
}