class Tile {
  constructor(x, z) {
    this.xpos = x;
    this.zpos = z;
    this.type = 0;
    this.parentx = -1;
    this.parentz = -1;
  }

  outputcoordinates(){
  	
  }

  doesTileHaveCollision(){
    switch(this.type) {
      case 0:
          return true;
          break;
      case 1:
          return false;
          break;
      case 2:
          return true;
          break;
      case 3:
          return false;
          break;
      case 4:
          return false;
          break;
      case 5:
          return false;
          break;
      case 6:
          return true;
          break;
      case 7:
          return true;
          break;
      case 8:
          return false;
          break;
      case 9:
          return true;
          break;
      case 10:
          return false;
          break;
      default:
          return true;
    }
  }

  drawFlatTiles(worldVertices, worldNormals, worldColors, surroundings){
  	var r, g, b;
  	if(this.type == 0){
  		r = 0;
  		g = 0;
  		b = 255;
  	} else if(this.type == 1){
  		r = 37;
      g = 50;
      b = 22;
  	} else if(this.type == 2){
  		r = 71;
  		g = 28;
  		b = 1;
  	} else if(this.type == 3){
  		r = 255;
  		g = 255;
  		b = 255;
  	} else if(this.type == 4){
  		r = 255;
  		g = 255;
  		b = 0;
  	} else if(this.type == 5){
  		r = 168;
      g = 119;
      b = 90;
  	} else if(this.type == 6){
  		r = 215;
      g = 186;
      b = 137;
  	} else if(this.type == 7){
      r = 64;
      g = 164;
      b = 223;
    } else if(this.type == 8){
      r = 126;
      g = 0;
      b = 126;
    } else if(this.type == 9){
      r = 47;
      g = 79;
      b = 79;
    } else if(this.type == 10){
      r = 112;
      g = 128;
      b = 144;
    } else if(this.type == 11){
      r = 0;
      g = 70;
      b = 70;
    } else {
  		r = Math.floor((Math.random() * 255));
  		g = Math.floor((Math.random() * 255));
  		b = Math.floor((Math.random() * 255));
  	}

  	worldVertices.push(this.xpos, 0, this.zpos);
  	worldVertices.push(this.xpos + 1, 0, this.zpos);
  	worldVertices.push(this.xpos, 0, this.zpos + 1);

  	worldVertices.push(this.xpos + 1, 0, this.zpos + 1);
  	worldVertices.push(this.xpos + 1, 0, this.zpos);
  	worldVertices.push(this.xpos, 0, this.zpos + 1);
  	worldNormals.push(0, 1, 0);
  	worldNormals.push(0, 1, 0);
  	worldNormals.push(0, 1, 0);

  	worldNormals.push(0, 1, 0);
  	worldNormals.push(0, 1, 0);
  	worldNormals.push(0, 1, 0);

  	worldColors.push(r/255, g/255, b/255);
  	worldColors.push(r/255, g/255, b/255);
  	worldColors.push(r/255, g/255, b/255);

  	worldColors.push(r/255, g/255, b/255);
  	worldColors.push(r/255, g/255, b/255);
  	worldColors.push(r/255, g/255, b/255);
  }

  drawCubeTiles(worldVertices, worldNormals, worldColors, surroundings){
    if(this.type == 0){
      return false;
    }

    var r, g, b;
    if(this.type == 0){
      r = 0;
      g = 0;
      b = 255;
    } else if(this.type == 1){
      r = 37;
      g = 50;
      b = 22;
    } else if(this.type == 2){
      r = 71;
      g = 28;
      b = 1;
    } else if(this.type == 3){
      r = 255;
      g = 255;
      b = 255;
    } else if(this.type == 4){
      r = 255;
      g = 255;
      b = 0;
    } else if(this.type == 5){
      r = 168;
      g = 119;
      b = 90;
    } else if(this.type == 6){
      r = 215;
      g = 186;
      b = 137;
    } else if(this.type == 7 || this.type == 8){
      r = 64;
      g = 164;
      b = 223;
    } else if(this.type == 9){
      r = 47;
      g = 79;
      b = 79;
    } else if(this.type == 10){
      r = 112;
      g = 128;
      b = 144;
    } else if(this.type == 11){
      r = 0;
      g = 70;
      b = 70;
    } else {
      r = Math.floor((Math.random() * 255));
      g = Math.floor((Math.random() * 255));
      b = Math.floor((Math.random() * 255));
    }

    //0 - nothing - nothing at all
    //1 - greenery - open bottom cube at ground
    //2 - map edge  - open bottom cub=oid at 2 above ground
    //3 - paths - open bottom cube at ground
    //4 - door - open bottom cube at ground
    //5 - building floors - open bottom cube at ground
    //6 - building walls - open bottom cube at 1 above ground
    //7 - water - open bottom cube at 0.5 beflow ground
    //8 - bridge
    //9 - stone edge
    //10 - stone floor
    //11 - brickw all

    var y = 0;
    var bottomY = -1;
    if(this.type == 2){
      y = 2;
      bottomY = -1;
    } else if(this.type == 6 || this.type == 9 || this.type == 11){
      y = 1;
      bottomY = -1;
    }
     else if(this.type == 7 || this.type == 8){
      y = -0.5;
      bottomY = -1.5
    }

    //top
    worldVertices.push(this.xpos, y, this.zpos);
    worldVertices.push(this.xpos, y, this.zpos + 1);
    worldVertices.push(this.xpos + 1, y, this.zpos);
    worldVertices.push(this.xpos + 1, y, this.zpos + 1);
    worldVertices.push(this.xpos + 1, y, this.zpos);
    worldVertices.push(this.xpos, y, this.zpos + 1);
    worldNormals.push(0, 1, 0);
    worldNormals.push(0, 1, 0);
    worldNormals.push(0, 1, 0);
    worldNormals.push(0, 1, 0);
    worldNormals.push(0, 1, 0);
    worldNormals.push(0, 1, 0);
    worldColors.push(r/255, g/255, b/255);
    worldColors.push(r/255, g/255, b/255);
    worldColors.push(r/255, g/255, b/255);
    worldColors.push(r/255, g/255, b/255);
    worldColors.push(r/255, g/255, b/255);
    worldColors.push(r/255, g/255, b/255);
    if(this.type == 8){
      worldVertices.push(this.xpos, 0, this.zpos);
      worldVertices.push(this.xpos, 0, this.zpos + 1);
      worldVertices.push(this.xpos + 1, 0, this.zpos);
      worldVertices.push(this.xpos + 1, 0, this.zpos + 1);
      worldVertices.push(this.xpos + 1, 0, this.zpos);
      worldVertices.push(this.xpos, 0, this.zpos + 1);
      worldNormals.push(0, 1, 0);
      worldNormals.push(0, 1, 0);
      worldNormals.push(0, 1, 0);
      worldNormals.push(0, 1, 0);
      worldNormals.push(0, 1, 0);
      worldNormals.push(0, 1, 0);
      worldColors.push(168/255, 128/255, 100/255);
      worldColors.push(168/255, 128/255, 100/255);
      worldColors.push(168/255, 128/255, 100/255);
      worldColors.push(168/255, 128/255, 100/255);
      worldColors.push(168/255, 128/255, 100/255);
      worldColors.push(168/255, 128/255, 100/255);
    }
    //+x side
    if(surroundings[4] != this.type){
      worldVertices.push(this.xpos + 1, y, this.zpos);
      worldVertices.push(this.xpos + 1, bottomY, this.zpos + 1);
      worldVertices.push(this.xpos + 1, bottomY, this.zpos);
      worldVertices.push(this.xpos + 1, y, this.zpos);
      worldVertices.push(this.xpos + 1, y, this.zpos + 1);
      worldVertices.push(this.xpos + 1, bottomY, this.zpos + 1);
      worldNormals.push(1, 0, 0);
      worldNormals.push(1, 0, 0);
      worldNormals.push(1, 0, 0);
      worldNormals.push(1, 0, 0);
      worldNormals.push(1, 0, 0);
      worldNormals.push(1, 0, 0);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
    }
    //-x side
    if(surroundings[3] != this.type){
      worldVertices.push(this.xpos, y, this.zpos);
      worldVertices.push(this.xpos, bottomY, this.zpos);
      worldVertices.push(this.xpos, bottomY, this.zpos + 1);
      worldVertices.push(this.xpos, y, this.zpos);
      worldVertices.push(this.xpos, bottomY, this.zpos + 1);
      worldVertices.push(this.xpos, y, this.zpos + 1);
      worldNormals.push(-1, 0, 0);
      worldNormals.push(-1, 0, 0);
      worldNormals.push(-1, 0, 0);
      worldNormals.push(-1, 0, 0);
      worldNormals.push(-1, 0, 0);
      worldNormals.push(-1, 0, 0);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
    }
    //+z side
    if(surroundings[6] != this.type){
      worldVertices.push(this.xpos, y, this.zpos + 1);
      worldVertices.push(this.xpos, bottomY, this.zpos + 1);
      worldVertices.push(this.xpos + 1, bottomY, this.zpos + 1);
      worldVertices.push(this.xpos, y, this.zpos + 1);
      worldVertices.push(this.xpos + 1, bottomY, this.zpos + 1);
      worldVertices.push(this.xpos + 1, y, this.zpos + 1);
      worldNormals.push(0, 0, 1);
      worldNormals.push(0, 0, 1);
      worldNormals.push(0, 0, 1);
      worldNormals.push(0, 0, 1);
      worldNormals.push(0, 0, 1);
      worldNormals.push(0, 0, 1);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
    }
    //-z side
    if(surroundings[1] != this.type){
      worldVertices.push(this.xpos, y, this.zpos);
      worldVertices.push(this.xpos + 1, bottomY, this.zpos);
      worldVertices.push(this.xpos, bottomY, this.zpos);
      worldVertices.push(this.xpos, y, this.zpos);
      worldVertices.push(this.xpos + 1, y, this.zpos);
      worldVertices.push(this.xpos + 1, bottomY, this.zpos);
      worldNormals.push(0, 0, -1);
      worldNormals.push(0, 0, -1);
      worldNormals.push(0, 0, -1);
      worldNormals.push(0, 0, -1);
      worldNormals.push(0, 0, -1);
      worldNormals.push(0, 0, -1);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
      worldColors.push(r/255, g/255, b/255);
    }
  }
}