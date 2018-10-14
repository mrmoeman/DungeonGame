class Path {
  constructor(startPointX, startPointZ, endPointX, endPointZ, collisionArray, width, breadth) {
    this.startX = startPointX;
    this.startZ = startPointZ;
    this.endX = endPointX;
    this.endZ = endPointZ;
    this.collision = collisionArray;
    this.width = width;
    this.breadth = breadth;
    this.StartPosition = this.turnXZIntoValue(startPointX, startPointZ);
    this.EndPosition = this.turnXZIntoValue(endPointX, endPointZ);
  }

  buildPath(){
    //setup data for calculating Path
    var directions = [1, 2, 3, 4];
    var calculationDataArray = [];
    var PathFound = false;
    var pathEndCheckedArrayPosition;
    //calculationDataArray.push(new PathCalcData(false, -1, 0, this.StartPosition));
    for(var i = 0; i < this.collision.length; i++){
      calculationDataArray[i] = new PathCalcData(this.collision[i], -1, i, 0);
    }
    var CheckedArray = [];
    CheckedArray.push(this.StartPosition);

    //mark starting point as checked
    calculationDataArray[this.StartPosition].checked = true;

    //start checking for path
    var PathSearchCount = 0;
    for(var i = 0; i < CheckedArray.length && PathFound == false && PathSearchCount < calculationDataArray.length; i++){
      var DirectionOrder = shuffleArray(directions);
      for(var c = 0; c < DirectionOrder.length && PathFound == false; c++){
        var myDirection = DirectionOrder[c];
        var nextPosition;
        //pick next position to be checked
        if(myDirection == 1){ // up
          nextPosition = CheckedArray[i] - this.breadth;
        } else if(myDirection == 2){ // down
          nextPosition = CheckedArray[i] + this.breadth;
        } else if(myDirection == 3){ // left
          nextPosition = CheckedArray[i] + 1;
        } else if(myDirection == 4){ // right
          nextPosition = CheckedArray[i] - 1;
        }
        if(calculationDataArray[nextPosition].checked == false){
          CheckedArray.push(nextPosition);
          calculationDataArray[nextPosition].checked = true;
          calculationDataArray[nextPosition].parentPosition = CheckedArray[i];
        }
        if(nextPosition == this.EndPosition){
          PathFound = true;
          pathEndCheckedArrayPosition = nextPosition;
        }
      }
      PathSearchCount++;
    }

    var finalPathArrayX = [];
    var finalPathArrayZ = [];
    var pathBuilt = false;
    var nextpathBuilt = pathEndCheckedArrayPosition;
    while(pathBuilt == false && nextpathBuilt >= 0){
      var myZ = Math.floor(nextpathBuilt/this.breadth);
      var myX = nextpathBuilt - myZ * this.breadth;
      finalPathArrayX.push(myX);
      finalPathArrayZ.push(myZ);
      nextpathBuilt = calculationDataArray[nextpathBuilt].parentPosition;
      if(nextpathBuilt == this.StartPosition){
        pathBuilt = true;
      }
    }

    if(pathBuilt == false){
      return false;
    }

    var pathArray = [finalPathArrayX.reverse(), finalPathArrayZ.reverse()];
    return pathArray;

  }

  buildPathToAnyCollision(){
    //setup data for calculating Path
    var directions = [1, 2, 3, 4];
    var calculationDataArray = [];
    var PathFound = false;
    var pathEndCheckedArrayPosition;
    //calculationDataArray.push(new PathCalcData(false, -1, 0, this.StartPosition));
    for(var i = 0; i < this.collision.length; i++){
      if(this.collision[i] == 0){
        calculationDataArray[i] = new PathCalcData(false, -1, i, this.collision[i]);
      } else {
        calculationDataArray[i] = new PathCalcData(true, -1, i, this.collision[i]);
      }
    }
    var CheckedArray = [];
    CheckedArray.push(this.StartPosition);

    //mark starting point as checked
    calculationDataArray[this.StartPosition].checked = true;

    //start checking for path
    var PathSearchCount = 0;
    for(var i = 0; i < CheckedArray.length && PathFound == false && PathSearchCount < calculationDataArray.length; i++){
      var DirectionOrder = this.shuffleArray(directions);
      for(var c = 0; c < DirectionOrder.length && PathFound == false; c++){
        var myDirection = DirectionOrder[c];
        var nextPosition;
        //pick next position to be checked
        if(myDirection == 1){ // up
          nextPosition = CheckedArray[i] - this.breadth;
        } else if(myDirection == 2){ // down
          nextPosition = CheckedArray[i] + this.breadth;
        } else if(myDirection == 3){ // left
          nextPosition = CheckedArray[i] + 1;
        } else if(myDirection == 4){ // right
          nextPosition = CheckedArray[i] - 1;
        }
        if(calculationDataArray[nextPosition].checked == false){
          CheckedArray.push(nextPosition);
          calculationDataArray[nextPosition].checked = true;
          calculationDataArray[nextPosition].parentPosition = CheckedArray[i];
        } else {
          if(calculationDataArray[nextPosition].ignore == 1){
            pathEndCheckedArrayPosition = nextPosition;
          }
        }
        /*if(nextPosition == this.EndPosition){
          PathFound = true;
          pathEndCheckedArrayPosition = nextPosition;
        }*/
      }
      PathSearchCount++;
    }

    var finalPathArrayX = [];
    var finalPathArrayZ = [];
    var pathBuilt = false;
    var nextpathBuilt = pathEndCheckedArrayPosition;
    while(pathBuilt == false && nextpathBuilt >= 0){
      var myZ = Math.floor(nextpathBuilt/this.breadth);
      var myX = nextpathBuilt - myZ * this.breadth;
      finalPathArrayX.push(myX);
      finalPathArrayZ.push(myZ);
      nextpathBuilt = calculationDataArray[nextpathBuilt].parentPosition;
      if(nextpathBuilt == this.StartPosition){
        pathBuilt = true;
      }
    }

    if(pathBuilt == false){
      return false;
    }

    var pathArray = [finalPathArrayX.reverse(), finalPathArrayZ.reverse()];
    return pathArray;

  }

  getcollision(x, z){
      if(x < 0 || z < 0 || x >= this.width || z >= this.breadth){
        return 1;
      }
      return this.collision[this.turnXZIntoValue(x,z)];
  }

  turnXZIntoValue(x,z){
    return (x + z * this.breadth);
  }

  
}