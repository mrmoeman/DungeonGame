class GameInstance {
  constructor() {
    this.width = 120;
    this.depth = 120;
    this.cameraX = this.width / 2;
    this.cameraY = 80;
    this.cameraZ = this.depth / 2;
    this.cameraRotX = 270;
    this.cameraRotY = 0;
    this.cameraRotZ = 0;

    this.delta = 1;
    this.lastTime = 0;
    this.currentTime = 0;
    this.CurrentWorldInstance = new worldInstance(this.width, this.depth, false);
    this.count = 0;

    this.paused = false
    this.cameraSetting = 0;
    this.fadeToBlackFlag = false;
  }

  drawWorld(){
    this.CurrentWorldInstance.createMesh();
  }

  processInputRelease(event){
    var keyCode = event.keyCode;
    if(this.cameraSetting == 3){
      if(keyCode == 38 || keyCode == 87){
        buttonup = false;
      }
      //down
      if(keyCode == 40 || keyCode == 83){
        buttondown = false;
      }
      //right
      if(keyCode == 39 || keyCode == 68){
        buttonright = false;
      }
      //left
      if(keyCode == 37 || keyCode == 65){
        buttonleft = false;
      }
      if(keyCode == 69){
        buttonturnleft = false;
      }
      if(keyCode == 81){
        buttonturnright = false;
      }
      if(keyCode == 32){
        spacebutton = false;
        this.CurrentWorldInstance.removeMeshFromScene();
        this.CurrentWorldInstance = new worldInstance(this.width, this.depth, false);
        this.CurrentWorldInstance.setPlayer();
        this.CurrentWorldInstance.updateLighting();
        this.drawWorld();
      }
    }
  }

  processInput(event){
    //console.log(event.keyCode);

    var keyCode = event.keyCode;
    //up
    if(this.cameraSetting == 0){
      if(keyCode == 38 || keyCode == 87){
        this.cameraZ = this.cameraZ - 40 * this.delta;
      }
      //down
      if(keyCode == 40 || keyCode == 83){
        this.cameraZ = this.cameraZ + 40 * this.delta;
      }
      //right
      if(keyCode == 39 || keyCode == 68){
        this.cameraX = this.cameraX + 40 * this.delta;
      }
      //left
      if(keyCode == 37 || keyCode == 65){
        this.cameraX = this.cameraX - 40 * this.delta;
      }
      if(keyCode == 69){
        this.cameraRotZ = this.cameraRotZ + 100 * this.delta;
      }
      if(keyCode == 81){
        this.cameraRotZ = this.cameraRotZ - 100 * this.delta;
      }
    }

    if(this.cameraSetting == 3){
      if(keyCode == 38 || keyCode == 87){
        buttonup = true;
      }
      //down
      if(keyCode == 40 || keyCode == 83){
        buttondown = true;
      }
      //right
      if(keyCode == 39 || keyCode == 68){
        buttonright = true;
      }
      //left
      if(keyCode == 37 || keyCode == 65){
        buttonleft = true;
      }
      if(keyCode == 69){
        buttonturnleft = true;
      }
      if(keyCode == 81){
        buttonturnright = true;
      }
    }

    if(keyCode == 32){
      this.paused = !this.paused;
    }
  }

  processWheel(event){
    var scrollamount = event.deltaY;
    if(this.cameraSetting == 0){
      this.cameraY = this.cameraY + 100 * (scrollamount/100) * this.delta;
      if(this.cameraY < 5){
        this.cameraY = 5;
      }
    }
  }

  updateMainLoop(){
    this.currentTime = performance.now();
    this.delta = (this.currentTime - this.lastTime)/1000;
    this.lastTime = this.currentTime;
    //setHTMLContentsById('FPS: ' + Math.floor(1/this.delta), 'FPS-BOX');
    //debug setting
    if(this.cameraSetting == 0){
      this.CurrentWorldInstance.update(this.delta, this.cameraRotY);
      if(this.paused == false){
        this.count = this.count + (100 * this.delta);
      }
      if(this.count > 200){
        this.CurrentWorldInstance.removeMeshFromScene();
        this.CurrentWorldInstance = new worldInstance(this.width, this.depth, false);
        this.CurrentWorldInstance.updateLighting();
        this.drawWorld();
        this.count = 0;
      }
    }

    //rotate start screen
    if(this.cameraSetting == 1){
      if(startGameFlag == true){
        this.cameraSetting = 2;
        this.fadeToBlackFlag = true;
      }
      this.CurrentWorldInstance.update(this.delta);
      this.cameraRotY = this.cameraRotY + 30 * this.delta;
      if(this.cameraRotY > 360){
        this.fadeToBlackFlag = true;
      }
      var oldX = 20;
      var oldZ = 20;
      this.cameraX = (oldX * Math.cos(Math.radians(this.cameraRotY)) - oldZ * Math.sin(Math.radians(this.cameraRotY)));
      this.cameraZ = (oldZ * Math.cos(Math.radians(this.cameraRotY)) + oldX * Math.sin(Math.radians(this.cameraRotY)));
      if(this.fadeToBlackFlag == true){
        if(fadeToBlack(this.delta) == true){
          this.fadeToBlackFlag = false;
          this.cameraRotY = 0;
          this.CurrentWorldInstance.removeMeshFromScene();
          this.CurrentWorldInstance = new worldInstance(this.width, this.depth, false);
          this.CurrentWorldInstance.updateLighting();
          this.drawWorld();
          //sleep(200);
        }
      }else{
        fadeBackIn(this.delta);
      }
    }
    //transitition to player camera
    if(this.cameraSetting == 2){
      this.CurrentWorldInstance.update(this.delta);
      this.cameraRotY = this.cameraRotY + 30 * this.delta;
      if(this.cameraRotY > 360){
        this.fadeToBlackFlag = true;
      }
      var oldX = 20;
      var oldZ = 20;
      this.cameraX = (oldX * Math.cos(Math.radians(this.cameraRotY)) - oldZ * Math.sin(Math.radians(this.cameraRotY)));
      this.cameraZ = (oldZ * Math.cos(Math.radians(this.cameraRotY)) + oldX * Math.sin(Math.radians(this.cameraRotY)));
      if(this.fadeToBlackFlag == true){
        if(fadeToBlack(this.delta) == true){
          this.fadeToBlackFlag = false;
          this.beginPlayer();
        }
      }
    }

    //player camera
    if(this.cameraSetting == 3){
      this.processCameraPlayerUpdate();
      this.cameraX = (5 * Math.cos(Math.radians(this.cameraRotY)) - 5 * Math.sin(Math.radians(this.cameraRotY))) + GamePlayer.getCameraPosXOffset();
      this.cameraZ = (5 * Math.cos(Math.radians(this.cameraRotY)) + 5 * Math.sin(Math.radians(this.cameraRotY))) + GamePlayer.getCameraPosZOffset();
      this.CurrentWorldInstance.update(this.delta, this.cameraRotY);
      if(this.fadeToBlackFlag == false){
        fadeBackIn(this.delta);
      }
    }
  }

  setCameraToRotate(){
    this.cameraSetting = 1;
    this.cameraX = this.width/2 - 30;
    this.cameraY = 30;
    this.cameraZ = this.width/2 - 30;
  }

  updateLighting(){
    this.CurrentWorldInstance.updateLighting();
  }

  updateCamera(camera){
    if(this.cameraSetting == 0){
      camera.position.x = this.cameraX;
      camera.position.y = this.cameraY;
      camera.position.z = this.cameraZ;

      camera.rotation.x = Math.radians(this.cameraRotX);
      camera.rotation.y = Math.radians(this.cameraRotY);
      camera.rotation.z = Math.radians(this.cameraRotZ);
    } else if(this.cameraSetting == 1 || this.cameraSetting == 2){
      camera.position.x = this.cameraX + this.width/2;
      camera.position.y = this.cameraY;
      camera.position.z = this.cameraZ + this.depth/2;

      var point = new THREE.Vector3(this.width/2, 0, this.depth/2);
      camera.lookAt( point );
    }
    else if(this.cameraSetting == 3){
      camera.position.x = this.cameraX;
      camera.position.y = this.cameraY;
      camera.position.z = this.cameraZ;
      var point = new THREE.Vector3(GamePlayer.getCameraPosXOffset(), GamePlayer.ypos, GamePlayer.getCameraPosZOffset());
      camera.lookAt( point );
    }

  }

  beginPlayer(){
    this.cameraSetting = 3;
    this.CurrentWorldInstance.removeMeshFromScene();
    this.CurrentWorldInstance = new worldInstance(this.width, this.depth, 2);
    this.CurrentWorldInstance.updateLighting();
    this.drawWorld();
    this.CurrentWorldInstance.setPlayer();
    GamePlayer.drawObject();
    this.moveCameraToPlayer();
    hideById('START-BOX');
    showById('NAME-BOX');
  }

  moveCameraToPlayer(){
    this.cameraRotY = 45;
    this.cameraX = ((GamePlayer.xpos) * Math.cos(Math.radians(this.cameraRotY)) - (GamePlayer.zpos - 5) * Math.sin(Math.radians(this.cameraRotY)));
    this.cameraZ = ((GamePlayer.zpos - 5) * Math.cos(Math.radians(this.cameraRotY)) + (GamePlayer.xpos) * Math.sin(Math.radians(this.cameraRotY)));
    this.cameraY = 10;
  }

  processCameraPlayerUpdate(){
    if(buttonturnright == true){
      this.cameraRotY = this.cameraRotY + 100 * this.delta;
    }
    if(buttonturnleft == true){
      this.cameraRotY = this.cameraRotY - 100 * this.delta;
    }
    if(this.cameraRotY > 360){
      this.cameraRotY = this.cameraRotY - 360;
    } if(this.cameraRotY < 0){
      this.cameraRotY = this.cameraRotY + 360;
    }
  }

}