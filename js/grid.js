class Grid {
	constructor(xcount, zcount, worldType) {
	    this.tiles = [];
	    this.xtotal = xcount;
	    this.ztotal = zcount;
	    this.lightingType = 0;
	    this.objects = [];
	    this.playerX = 0;
	    this.playerZ = 0;
	    for(var x = 0; x < xcount; x++){
	    	for(var z = 0; z < zcount; z++){
	    		this.tiles[x + z * zcount] = new Tile(x,z);
	    	}
	    }
	    if(worldType == false){
	    	this.worldType = Math.floor(Math.random() * 4) + 1;
		} else {
			this.worldType = worldType;
		}
	    //this.worldType = 2;
	    if(this.worldType == 1){
	    	this.generateMaze();
	    	this.lightingType = 2;
		}
		if(this.worldType == 2){
	    	this.generateOpenWorld();
	    	this.lightingType = 0;
		}
		if(this.worldType == 3){
			this.generatePlains();
			this.lightingType = 0;
		}
		if(this.worldType == 4){
			this.generateCave();
			this.lightingType = 1;
		}
		this.decorateWithObjects();

		setHTMLContentsById(getWorldName(this.worldType), 'NAME-BOX');
	}

	getObjectCollsion(){
		var collisionArray = [];
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
					collisionArray.push(0);
			}
		}
		for(var i = 0; i < this.objects.length; i++){
			var temp = this.objects[i].getCollisionArray();
			for(var j = 0; j < temp.length; j+=2){
				collisionArray[this.turnXZIntoValue(temp[j], temp[j+1])] = 1;
			}
		}
		return collisionArray;
	}

  	outputTiles(){
	  	this.tiles.forEach(function(tile) {
	  		tile.outputcoordinates();
		});
  	}

  	processTileGeometry(worldVertices, worldNormals, worldColors){
  		//tiles
		for(var x = 0; x < this.xtotal; x++){
	    	for(var z = 0; z < this.ztotal; z++){
	    		var surroundings = this.getSurroundingArray(x, z);
	    		this.getTile(x,z).drawCubeTiles(worldVertices, worldNormals, worldColors, surroundings);
	    		//this.getTile(x,z).drawFlatTiles(worldVertices, worldNormals, worldColors, surroundings);
	    	}
	    }

	    //objects
	    for(var i = 0; i < this.objects.length; i++){
	    	this.objects[i].drawObject();
	    }
  	}

  	scrapObjectMeshes(){
  		for(var i = 0; i < this.objects.length; i++){
	    	this.objects[i].removeObject();
	    }
  	}

	getTile(x, z){
	  	if(x < 0 || z < 0 || x >= this.xtotal || z >= this.ztotal){
	  		return false;
	  	}
	  	return this.tiles[this.turnXZIntoValue(x,z)];
	}

  	generateMaze(){
  		//0 - nothing
		//1 - greenery
		//2 - map edgde
		//3 - paths
		//4 - door
		//5 - building floors
		//6 - building walls
		//7 - water
		//8 - bridge
		//9 - stone edge
		//10 - stone wall
		//11 - brickw all
		var worldGenerated = false;
  		while(worldGenerated == false){
  			this.ResetAll(0);
		  	this.lineEdge(2,16);
		  	this.generateRandomPath(0,1);
		  	this.RimDetection(1,6,0);
		  	this.RimDetection(1,6,2);
		  	this.ReplaceAll(2,0);
		  	for(var i = 0; i < 12; i++){
		  		this.removeDeadEnds(1,6);
			}
		  	this.addPatches(3, 5, 6, 1, 0.3);
			this.ReplaceAll(0,6);
			this.floodGrid(1,6);
			this.lineEdge(-1,1);
			this.addConnectionsBetween(6, 1, 10);
			this.recenterWorld(1, 6);
			this.attemptToPlaceDungeonRooms(1, 6, 2, 16, 16, 6, 6, 8);
			this.addDoorsBetween(1, 2, 4, 100);
			this.ReplaceAll(2,9);
			this.ReplaceAll(-1,6);
			this.ReplaceAll(1,3);
			this.RimDetection(6,2,3);
			this.attemptToGenerateBuildings(3, 7, 7, 7, 8, 8, 3, 3, 8, 2, 0);
			this.ReplaceAll(2,10);
			this.ReplaceAll(6,1);
			this.ReplaceAll(9,6);
			this.ReplaceAll(1,9);
			this.ReplaceAll(6,11);
			worldGenerated = true;
			this.pickPlayerSpot(3);
		}
  	}

  	generateOpenWorld(){
  		var worldGenerated = false;
  		while(worldGenerated == false){
  			//0 - nothing
  			//1 - greenery
  			//2 - map edgde
  			//3 - paths
  			//4 - door
  			//5 - building floors
  			//6 - building walls
  			this.ResetAll(0);
	  		this.lineEdge(2,16);
	  		this.StartCellSimulation(1,3,0,8);
	  		this.SimulationStep(1, 3, 4, 4);
	  		this.SimulationStep(1,3, 4, 4);
	  		this.SimulationStep(1,3, 5, 5);
	  		this.SimulationStep(1,3, 5, 5);
	  		this.floodGrid(1,3);
	  		this.ReplaceAll(2,3);
	  		this.SmoothEdges(1,3);
	  		this.lineEdge(2,1);
	  		this.floodGrid(3,1);
	  		this.ReplaceAll(2,3);
	  		this.ReplaceAll(3,0);
	  		this.recenterWorld(1, 0);
	  		this.RimDetection(0,3,1);
	  		var buildResult = this.attemptToGenerateBuildings(1, 6, 5, 4, 15, 15, 6, 6, 20, 3, 2);
	  		this.ReplaceAll(3,1);
	  		this.RimDetection(1,2,0);
	  		this.drawPaths(4, 3, 1);
	  		this.ReplaceAll(0,2);

	  		if(buildResult == true){
	  			this.pickPlayerSpot(5);
	  			worldGenerated = true;
	  		}
	  	}
  	}

  	generatePlains(){
  		//0 - nothing
		//1 - greenery
		//2 - map edgde
		//3 - paths
		//4 - door
		//5 - building floors
		//6 - building walls
		//7 - water
		//8 - bridge
		var worldGenerated = false;
  		while(worldGenerated == false){
  			this.ResetAll(0);
  			this.lineEdge(6,16);
  			this.StartCellSimulation(1,3,0,8);
  			this.lineEdge(1,16);
  			this.lineEdge(6,2);
	  		this.SimulationStep(1, 3, 4, 4);
	  		this.SimulationStep(1,3, 2, 6);
	  		this.SimulationStep(1,3, 2, 6);
	  		this.RimDetection(1,2,3);
	  		this.ReplaceAll(2,1);
  			this.floodGrid(1,3);
  			this.floodGrid(3,1);
  			this.SmoothEdges(3,1);
  			this.SmoothEdges(3,1);
  			this.ReplaceAll(3,2);
  			this.ReplaceAll(6,2);
  			this.generateRiver(1,2,7);
  			this.addRiverCrossings(7, 1, 8, 4, 3);
  			this.RimDetection(7, -1, 1);
  			this.RimDetection(7, -1, 2);
  			this.ReplaceAll(-1,7);
  			this.trimRiverCrossing(8,1,2);
  			var TempBridge = this.temporaryReplaceAll(8,1);
  			this.floodGrid(1,2);
  			this.restorefromTempReplace(8,1,TempBridge, false);
  			this.pickPlayerSpot(1);
  			worldGenerated = true;
  		}
  	}

  	generateCave(){
  		//0 - nothing
		//1 - greenery
		//2 - map edgde
		//3 - paths
		//4 - door
		//5 - building floors
		//6 - building walls
		//7 - water
		//8 - bridge
		//9 - stone edge
		//10 - stone floor
		var worldGenerated = false;
  		while(worldGenerated == false){
  			this.ResetAll(0);
  			this.lineEdge(6,16);
  			this.StartCellSimulation(1,3,0,8);
  			this.lineEdge(1,16);
  			this.lineEdge(6,2);
	  		this.SimulationStep(1, 3, 3, 3);
	  		this.SimulationStep(1, 3, 3, 3);
	  		this.SimulationStep(1, 3, 5, 5);
	  		this.SimulationStep(1, 3, 5, 5);
	  		this.SimulationStep(1, 3, 5, 5);
	  		this.floodGrid(1,3);
	  		this.RimDetection(1,2,3);
	  		this.ReplaceAll(2,1);
	  		this.RimDetection(1,2,3);
	  		this.ReplaceAll(2,1);
	  		this.recenterWorld(1, 2);
	  		var result = this.generateRiver(1,2,7);
	  		if(result == true){
		  		this.addRiverCrossings(7, 1, 8, 5, 5);
	  			this.RimDetection(7, -1, 1);
	  			this.RimDetection(7, -1, 2);
	  			this.ReplaceAll(-1,7);
	  			this.trimRiverCrossing(8,1,2);
	  			var TempBridge = this.temporaryReplaceAll(8,1);
	  			this.floodGrid(1,2);
	  			this.restorefromTempReplace(8,1,TempBridge, false);
	  			this.ReplaceAll(2,9);
	  			this.ReplaceAll(1,10);
	  			this.pickPlayerSpot(10);
		  		worldGenerated = true;
		  	}
  		}
  	}

  	generateRandomPath(oldType, newType){
    	
		var CurrentX = -1;
		var CurrentZ = -1;
		var nextX = 0;
		var nextZ = 0;
		var PathDone = false;
		
		while(CurrentX == - 1 && CurrentZ == -1){
			var x = Math.floor((Math.random() * (this.xtotal - 2))) + 1;
			var z = Math.floor((Math.random() * (this.ztotal - 2))) + 1;
			var myTile = this.getTile(x, z);
			if(myTile.type == oldType){
				CurrentX = x;
				CurrentZ = z;
				myTile.type = newType;
			}
	   	}
	   	while(PathDone == false){
	   		var directionChosen = 0;
	   		var direction = 0;
	   		while(directionChosen == 0){
	   			var direction = Math.floor(Math.random() * Math.floor(4)) + 1;
	   			if(direction == 1){
	   				if(this.getTile(CurrentX - 2, CurrentZ).type == oldType){//negative X direction
	   					directionChosen = 1;
	   					this.getTile(CurrentX - 2, CurrentZ).type = newType;
	   					this.getTile(CurrentX - 1, CurrentZ).type = newType;
	   					nextX = CurrentX - 2;
	   					nextZ = CurrentZ;
	   				}
	   			}
	   			if(direction == 2){
	   				if(this.getTile(CurrentX + 2, CurrentZ).type == oldType){//positive X direction
	   					directionChosen = 1;
	   					this.getTile(CurrentX + 2, CurrentZ).type = newType;
	   					this.getTile(CurrentX + 1, CurrentZ).type = newType;
	   					nextX = CurrentX + 2;
	   					nextZ = CurrentZ;
	   				}
	   			}
	   			if(direction == 3){
	   				if(this.getTile(CurrentX, CurrentZ + 2).type == oldType){//positive Z direction
	   					directionChosen = 1;
	   					this.getTile(CurrentX, CurrentZ + 2).type = newType;
	   					this.getTile(CurrentX, CurrentZ + 1).type = newType;
	   					nextX = CurrentX;
	   					nextZ = CurrentZ + 2;
	   				}
	   			}
	   			if(direction == 4){
	   				if(this.getTile(CurrentX, CurrentZ - 2).type == oldType){//negative Z direction
	   					directionChosen = 1;
	   					this.getTile(CurrentX, CurrentZ - 2).type = newType;
	   					this.getTile(CurrentX, CurrentZ - 1).type = newType;
	   					nextX = CurrentX;
	   					nextZ = CurrentZ - 2;
	   				}
	   			}
				if(directionChosen == 0){
					if(this.doesTileHasValidSidesForPath(CurrentX, CurrentZ, oldType) == false){
						directionChosen = 2;
						PathDone = true;
					}
	   			}
	   		}
	   		if(nextX == 0 && nextZ == 0){
	   			PathDone = true;
	   			console.log('BORKED');
	   		} else {
	   			if(PathDone == false){
		   			this.getTile(nextX, nextZ).parentx = CurrentX;
		   			this.getTile(nextX, nextZ).parentz = CurrentZ;
		   			CurrentX = nextX;
		    		CurrentZ = nextZ;
		    	}

	    	}

	   	}

	   	var mazeDone = false;
    	while(mazeDone == false){
    		var currentTile = this.getTile(CurrentX, CurrentZ);
    		//console.log('A', CurrentX, CurrentZ, currentTile.parentx, currentTile.parentz);
    		if(currentTile.parentx != -1 || currentTile.parentz != -1){
    			//console.log('B');
    			if(this.doesTileHasValidSidesForPath(CurrentX, CurrentZ, oldType) == false){
    				//console.log('C');
    				CurrentX = currentTile.parentx;
    				CurrentZ = currentTile.parentz;
    			} else {
    				//console.log('D');
    				this.spreadRandomPath(oldType, newType, CurrentX, CurrentZ);
    				CurrentX = currentTile.parentx;
    				CurrentZ = currentTile.parentz;

    			}
    		} else {
    			if(this.doesTileHasValidSidesForPath(CurrentX, CurrentZ, oldType) == false){
    				mazeDone = true;
    			} else {
    				this.spreadRandomPath(oldType, newType, CurrentX, CurrentZ);
    			}
    		}
    	}
  	}

  	spreadRandomPath(oldType, newType, startX, startZ){
  		var CurrentX = startX;
		var CurrentZ = startZ;
		var nextX = 0;
		var nextZ = 0;
		var PathDone = false;


		while(PathDone == false){
	   		var directionChosen = 0;
	   		var direction = 0;
	   		while(directionChosen == 0){
	   			var direction = Math.floor(Math.random() * Math.floor(4)) + 1;
	   			if(direction == 1){
	   				if(this.getTile(CurrentX - 2, CurrentZ).type == oldType){//negative X direction
	   					directionChosen = 1;
	   					this.getTile(CurrentX - 2, CurrentZ).type = newType;
	   					this.getTile(CurrentX - 1, CurrentZ).type = newType;
	   					nextX = CurrentX - 2;
	   					nextZ = CurrentZ;
	   				}
	   			}
	   			if(direction == 2){
	   				if(this.getTile(CurrentX + 2, CurrentZ).type == oldType){//positive X direction
	   					directionChosen = 1;
	   					this.getTile(CurrentX + 2, CurrentZ).type = newType;
	   					this.getTile(CurrentX + 1, CurrentZ).type = newType;
	   					nextX = CurrentX + 2;
	   					nextZ = CurrentZ;
	   				}
	   			}
	   			if(direction == 3){
	   				if(this.getTile(CurrentX, CurrentZ + 2).type == oldType){//positive Z direction
	   					directionChosen = 1;
	   					this.getTile(CurrentX, CurrentZ + 2).type = newType;
	   					this.getTile(CurrentX, CurrentZ + 1).type = newType;
	   					nextX = CurrentX;
	   					nextZ = CurrentZ + 2;
	   				}
	   			}
	   			if(direction == 4){
	   				if(this.getTile(CurrentX, CurrentZ - 2).type == oldType){//negative Z direction
	   					directionChosen = 1;
	   					this.getTile(CurrentX, CurrentZ - 2).type = newType;
	   					this.getTile(CurrentX, CurrentZ - 1).type = newType;
	   					nextX = CurrentX;
	   					nextZ = CurrentZ - 2;
	   				}
	   			}
				if(directionChosen == 0){
					if(this.doesTileHasValidSidesForPath(CurrentX, CurrentZ, oldType) == false){
						directionChosen = 2;
						PathDone = true;
					}
	   			}
	   		}
	   		if(nextX == 0 && nextZ == 0){
	   			PathDone = true;
	   			console.log('BORKED');
	   		} else {
	   			if(PathDone == false){
		   			this.getTile(nextX, nextZ).parentx = CurrentX;
		   			this.getTile(nextX, nextZ).parentz = CurrentZ;
		   			CurrentX = nextX;
		    		CurrentZ = nextZ;
		    	}
	    	}

	   	}

	   	var mazeDone = false;
    	while(mazeDone == false){
    		var currentTile = this.getTile(CurrentX, CurrentZ);
    		if(CurrentX >= 0 && CurrentZ >= 0){
	    		//console.log('A', CurrentX, CurrentZ, currentTile.parentx, currentTile.parentz);
	    		if(currentTile.parentx != startX || currentTile.parentz != startX){
	    			//console.log('B');
	    			if(this.doesTileHasValidSidesForPath(CurrentX, CurrentZ, oldType) == false){
	    				//console.log('C');
	    				CurrentX = currentTile.parentx;
	    				CurrentZ = currentTile.parentz;
	    			} else {
	    				//console.log('D');
	    				this.spreadRandomPath(oldType, newType, CurrentX, CurrentZ);
	    				CurrentX = currentTile.parentx;
	    				CurrentZ = currentTile.parentz;

	    			}
	    		} else {
	    			mazeDone = true;
	    		}
    		} else {
	    		mazeDone = true;
	    	}
    	}
  	}

  	StartCellSimulation(hollowType, SolidType, Checktype, cellFreeBarrier){
	  	for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				var currentTile = this.getTile(x, z);
	    		if(currentTile.type == Checktype){
	    			var Chance = Math.floor(Math.random() * Math.floor(100))
	    			if(Chance > 45){
	    				currentTile.type = SolidType;
	    			}
	    			else{
	    				if(x > cellFreeBarrier && z > cellFreeBarrier && this.xtotal - x > cellFreeBarrier && this.ztotal > cellFreeBarrier){
	    					currentTile.type = hollowType;
	    				} else {
	    					currentTile.type = SolidType;
	    				}
	    			}
	    		}
    		}
    	}
    }

    SimulationStep(hollowType, SolidType, birthLimit, deathLimit){
    	var TempArray = [];
    	for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				var currentTile = this.getTile(x, z);
				if(currentTile.type != SolidType && currentTile.type != hollowType){
					TempArray[this.turnXZIntoValue(x,z)] = currentTile.type;
				} else {
					var solids = this.countNeighboursofType(x, z, SolidType);
					if(currentTile.type == hollowType && solids <= birthLimit){
						TempArray[this.turnXZIntoValue(x,z)] = SolidType;
					} else {
						TempArray[this.turnXZIntoValue(x,z)] = hollowType;
					}

					if(currentTile.type == SolidType && solids >= deathLimit){
						TempArray[this.turnXZIntoValue(x,z)] = hollowType;
					} else {
						TempArray[this.turnXZIntoValue(x,z)] = SolidType;
					}
				}
			}
		}
		this.replaceTypesWithArray(TempArray);
    }

  	doesTileHasValidSidesForPath(x, z, notType){
  		var count = 0;
  		if(this.getTile(x, z + 2).type != notType){
  			count ++;
  		}
  		if(this.getTile(x, z - 2).type != notType){
  			count ++;
  		}
  		if(this.getTile(x + 2, z).type != notType){
  			count ++;
  		}
  		if(this.getTile(x - 2, z).type != notType){
  			count ++;
  		}
  		if(count == 4){
  			return false;
  		} else {
  			return true;
  		}
  	}

  	countNeighboursofType(x, z, checkType){
  		var typeCount = 0;
  		if(this.getTile(x + 1, z) != false && this.getTile(x + 1, z).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x + 1, z + 1) != false && this.getTile(x + 1, z + 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x + 1, z - 1) != false && this.getTile(x + 1, z - 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x - 1, z) != false && this.getTile(x - 1, z).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x - 1, z + 1) != false && this.getTile(x - 1, z + 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x - 1, z - 1) != false && this.getTile(x - 1, z - 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x, z + 1) != false && this.getTile(x , z + 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x, z - 1) != false && this.getTile(x , z - 1).type == checkType){
  			typeCount++;
  		}
  		return typeCount;
  	}

  	countDiagonalNeighboursofType(x, z, checkType){
  		var typeCount = 0;
  		if(this.getTile(x + 1, z + 1) != false && this.getTile(x + 1, z + 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x + 1, z - 1) != false && this.getTile(x + 1, z - 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x - 1, z + 1) != false && this.getTile(x - 1, z + 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x - 1, z - 1) != false && this.getTile(x - 1, z - 1).type == checkType){
  			typeCount++;
  		}
  		return typeCount;
  	}

  	countNonDiagonalNeighboursofType(x, z, checkType){
  		var typeCount = 0;
  		if(this.getTile(x + 1, z) != false && this.getTile(x + 1, z).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x - 1, z) != false && this.getTile(x - 1, z).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x, z + 1) != false && this.getTile(x , z + 1).type == checkType){
  			typeCount++;
  		}
  		if(this.getTile(x, z - 1) != false && this.getTile(x , z - 1).type == checkType){
  			typeCount++;
  		}
  		return typeCount;
  	}

  	getDirectionofType(x, z, checkType){
  		var typeCount = 0;
  		var direction = 0;
  		if(this.getTile(x - 1, z) != false && this.getTile(x + 1, z).type == checkType){//left
  			typeCount++;
  			direction = 1;
  		}
  		if(this.getTile(x + 1, z) != false && this.getTile(x - 1, z).type == checkType){//right
  			typeCount++;
  			direction = 2;
  		}
  		if(this.getTile(x, z + 1) != false && this.getTile(x , z + 1).type == checkType){//down
  			typeCount++;
  			direction = 3;
  		}
  		if(this.getTile(x, z - 1) != false && this.getTile(x , z - 1).type == checkType){//up
  			typeCount++;
  			direction = 4;
  		}
  		if(typeCount > 1){
  			direction = 0;
  		}
  		return direction;
  	}

  	ResetParents(){
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				var currentTile = this.getTile(x, z);
				currentTile.parentx = -1;
				currentTile.parenty = -1;
			}
		}
  	}

  	replaceTypesWithArray(newTypes){
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				this.getTile(x, z).type = newTypes[this.turnXZIntoValue(x,z)];
			}
		}
  	}

  	replaceAllInArray(arrayin, oldType, newType){
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(arrayin[this.turnXZIntoValue(x,z)] == oldType){
					arrayin[this.turnXZIntoValue(x,z)] = newType;
				}
			}
		}
		return arrayin;
  	}

  	countInArray(arrayin, countType){
  		var count = 0;
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(arrayin[this.turnXZIntoValue(x, z)] == countType){
					count++;
				}
			}
		}
		return count;
  	}

  	turnXZIntoValue(x,z){
  		return (x + z * this.ztotal);
  	}

  	floodGrid(hollowType, SolidType){
  		var largestFlood = 0;

  		//setup temp flood array
  		var tempFloodArray = [];
  		var tempCheckedArray = [];
  		var tempParentArray = [];
  		var tempNumberArray = [];
    	for(var x = 0; x < this.ztotal*this.xtotal; x++){
    		tempFloodArray[x] = 0; //GridCollisionArray[TempFloodPosition]
    		tempNumberArray[x] = 0; //PathCalcArray[f].PositionY
    		tempParentArray[x] = 0; // PathCalcArray[FloodNumber].ParentArrayPosition
    		tempCheckedArray[x] = false; //PathCalcArray[FloodNumber].Real
    	}

    	

    	for(var i = 0; i < this.ztotal*this.xtotal; i++){
    		if(this.tiles[i].type == hollowType && tempFloodArray[i] == 0){
    			var FloodNumber = 0;
    			var FloodPosition = 0;

    			tempCheckedArray[FloodNumber] = true;
    			tempParentArray[FloodNumber] = i;
    			tempFloodArray[i] = 1;
    			FloodNumber++;

    			for(var f = 0; f < FloodNumber; f++){
    				if(tempCheckedArray[f] == true){
    					var TempFloodPosition = tempParentArray[f] - this.ztotal;
    					//up
    					if(this.tiles[TempFloodPosition].type == hollowType && tempFloodArray[TempFloodPosition] == 0){
    						tempParentArray[FloodNumber] = TempFloodPosition;
    						tempCheckedArray[FloodNumber] = true;
    						tempFloodArray[TempFloodPosition] = 1;
    						FloodNumber++;
    					}
    					//down
    					TempFloodPosition = tempParentArray[f] + this.ztotal;
    					if(this.tiles[TempFloodPosition].type == hollowType && tempFloodArray[TempFloodPosition] == 0){
    						tempParentArray[FloodNumber] = TempFloodPosition;
    						tempCheckedArray[FloodNumber] = true;
    						tempFloodArray[TempFloodPosition] = 1;
    						FloodNumber++;
    					}
    					//left
    					TempFloodPosition = tempParentArray[f] -1;
    					if(this.tiles[TempFloodPosition].type == hollowType && tempFloodArray[TempFloodPosition] == 0){
    						tempParentArray[FloodNumber] = TempFloodPosition;
    						tempCheckedArray[FloodNumber] = true;
    						tempFloodArray[TempFloodPosition] = 1;
    						FloodNumber++;
    					}
    					//right
    					TempFloodPosition = tempParentArray[f] +1;
    					if(this.tiles[TempFloodPosition].type == hollowType && tempFloodArray[TempFloodPosition] == 0){
    						tempParentArray[FloodNumber] = TempFloodPosition;
    						tempCheckedArray[FloodNumber] = true;
    						tempFloodArray[TempFloodPosition] = 1;
    						FloodNumber++;
    					}
    				}
    			}


    			for(var f = 0; f < FloodNumber; f++){
    				tempNumberArray[tempParentArray[f]] = FloodNumber;
    				tempCheckedArray[f] = false;
    			}

    			if(FloodNumber > largestFlood){
    				largestFlood = FloodNumber;
    			}
    			FloodNumber = 0;


    		}
    	}

    	for(var i = 0; i < this.ztotal*this.xtotal; i++){
    		if(tempNumberArray[i] < largestFlood && this.tiles[i].type == hollowType){
    			this.tiles[i].type = SolidType;
    		}
    	}
  	}

  	SmoothEdges(typeA, typeB){
  		var tempSmoothArray = [];
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				tempSmoothArray[this.turnXZIntoValue(x,z)] = -1;
			}
		}

		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x,z).type == typeA){
					if(this.countNonDiagonalNeighboursofType(x, z, typeA) <=1){
						tempSmoothArray[this.turnXZIntoValue(x,z)] = typeB;
					}
				}
				if(this.getTile(x,z).type == typeB){
					if(this.countNonDiagonalNeighboursofType(x, z, typeB) <=1){
						tempSmoothArray[this.turnXZIntoValue(x,z)] = typeA;
					}
				}
			}
		}

		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(tempSmoothArray[this.turnXZIntoValue(x,z)] == typeA || tempSmoothArray[this.turnXZIntoValue(x,z)] == typeB){
					var currentTile = this.getTile(x,z);
					if(currentTile != false){
						currentTile.type = tempSmoothArray[this.turnXZIntoValue(x,z)];
					}
				}
			}
		}
  	}

  	attemptToGenerateBuildings(allowedBuildingType, wallType, floorType, doorType, maxWidth, maxBreadth, minWidth, minBreadth, buildCount, minBuildCount, maxAdditonalRooms){
  		var tempLength = [];
  		var tempBreadth = [];
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				tempLength[this.turnXZIntoValue(x,z)] = 0;
				tempBreadth[this.turnXZIntoValue(x,z)] = 0;
			}
		}

		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				tempLength[this.turnXZIntoValue(x,z)] = this.getMaxPathForTile(x,z,allowedBuildingType, 2);
				tempBreadth[this.turnXZIntoValue(x,z)] = this.getMaxPathForTile(x,z,allowedBuildingType, 3);
			}
		}

		var CurrentBuildCount = 0;
		for(var i = 0; i < buildCount; i++){
			var buildingdone = false;
			var attempts = 0;
			while(buildingdone == false && attempts < 100){
				var myx = Math.floor((Math.random() * this.xtotal));
				var myz = Math.floor((Math.random() * this.ztotal));
				var checkTile = this.getTile(myx, myz);
				if(checkTile != false && (checkTile.type == allowedBuildingType || checkTile.type == wallType)){
					if(tempLength[this.turnXZIntoValue(myx,myz)] >= minWidth && tempBreadth[this.turnXZIntoValue(myx,myz)] >= minBreadth){
						if(this.generateBuilding(myx, myz, allowedBuildingType, wallType, floorType, doorType, maxWidth, maxBreadth, minWidth, minBreadth, tempLength, tempBreadth, maxAdditonalRooms)){
							buildingdone = true;
							CurrentBuildCount++;
							for(var z = 0; z < this.ztotal; z++){
								for(var x = 0; x < this.xtotal; x++){
									tempLength[this.turnXZIntoValue(x,z)] = this.getMaxPathForTile(x,z,allowedBuildingType, 2);
									tempBreadth[this.turnXZIntoValue(x,z)] = this.getMaxPathForTile(x,z,allowedBuildingType, 3);
								}
							}
						}
					} else{
						attempts++;
					}
				} else{
					attempts++;
				}
			}
		}

		if(CurrentBuildCount < minBuildCount){
			return false;
		} else {
			return true;
		}
  	}

  	generateBuilding(x, z, allowedType, wallType, floorType, doorType, maxLength, maxBreadth, minLength, minBreadth, lengthArray, breadthArray, maxAdditonalRooms){
  		var myMaxLength = 0;
  		var myMaxBreadth = 0;
  		if(lengthArray[this.turnXZIntoValue(x,z)] > maxLength){
  			myMaxLength = maxLength;
  		} else {
  			myMaxLength = lengthArray[this.turnXZIntoValue(x,z)];
  		}

  		if(breadthArray[this.turnXZIntoValue(x,z)] > maxBreadth){
  			myMaxBreadth = maxBreadth;
  		} else {
  			myMaxBreadth = breadthArray[this.turnXZIntoValue(x,z)];
  		}
  		var myLength = Math.floor((Math.random() * (myMaxLength - minLength))) + minLength;
  		var myBreadth = Math.floor((Math.random() * (myMaxBreadth - minBreadth))) + minBreadth;

  		for(var myz = 0; myz < myBreadth; myz++){
			for(var myx = 0; myx < myLength; myx++){
				var checkTile = this.getTile(x + myx, z + myz);
				if(myz == 0 || myx == 0 || myz == myBreadth - 1 || myx == myLength - 1){
					if(this.doesTileHasNonDiagonalNeighbourType(x + myx, z + myz, doorType)){
						return false;
					}
				}
				if(checkTile != false && (checkTile.type == wallType || checkTile.type == allowedType)){

				} else {
					return false;
				}
			}
		}

		var acceptableDoorX = [];
		var acceptableDoorZ = [];
  		for(var myz = 0; myz < myBreadth; myz++){
			for(var myx = 0; myx < myLength; myx++){
				if(myz == 0 || myx == 0 || myz == myBreadth - 1 || myx == myLength - 1){
					this.getTile(x + myx, z + myz).type = wallType;
				} else {
					this.getTile(x + myx, z + myz).type = floorType;
				}
			}
		}
		for(var myz = 0; myz < myBreadth; myz++){
			for(var myx = 0; myx < myLength; myx++){
				if(myz == 0 || myx == 0 || myz == myBreadth - 1 || myx == myLength - 1){
					var floorTotal = this.countNonDiagonalNeighboursofType(x + myx, z + myz, floorType);
					var acceptableTotal = this.countNonDiagonalNeighboursofType(x + myx, z + myz, allowedType);
					var cornerCriteria = 0;
					if(myz == 0){
						cornerCriteria++;
					}
					if(myx == 0){
						cornerCriteria++;
					}
					if(myz == myBreadth - 1){
						cornerCriteria++;
					}
					if(myx == myLength - 1){
						cornerCriteria++;
					}

					if(floorTotal + acceptableTotal == 2 && cornerCriteria < 2){
						acceptableDoorX.push(x + myx);
						acceptableDoorZ.push(z + myz);
					}
				}
			}
		}
		if(doorType != floorType){
			var door = Math.floor((Math.random() * acceptableDoorZ.length));
			this.getTile(acceptableDoorX[door], acceptableDoorZ[door]).type = doorType;
		}
		var myAdditonalRooms = Math.floor(Math.random() * maxAdditonalRooms);
		for(var i = 0; i < myAdditonalRooms; i++){
			var attempts = 0;
			var built = false;
			while(built == false && attempts < 50){
				var which = Math.floor((Math.random() * acceptableDoorZ.length));
				var result = this.generateRoom(acceptableDoorX[which], acceptableDoorZ[which], allowedType, wallType, floorType, doorType, maxLength, maxBreadth, minLength, minBreadth);
				if(result == false){
					attempts++;
				} else{
					built = true;
				}
			}
		}

		return true;
  	}

  	generateRoom(doorX, doorZ, allowedType, wallType, floorType, doorType, maxLength, maxBreadth, minLength, minBreadth){
  		var roomArray = [];
  		var direction = this.getDirectionofType(doorX, doorZ, allowedType);
  		if(direction == 0){
  			return false;
  		}
  		if(this.getTile(doorX, doorZ).type == doorType){
  			return false;
  		}
  		var myLength = Math.floor((Math.floor((Math.random() * (maxLength - minLength))) + minLength)/2)*2;
  		var myBreadth = Math.floor((Math.floor((Math.random() * (maxBreadth - minBreadth))) + minBreadth)/2)*2;

  		var startX;
  		var startZ;
  		if(direction == 1){//door left side
  			startZ = doorZ - Math.floor(myBreadth/2);
  			startX = doorX;
  		} else if(direction == 2){//door is right side
  			startZ = doorZ - Math.floor(myBreadth/2);
  			startX = doorX - myLength + 1;
  		} else if(direction == 3){//door top side
  			startZ = doorZ;
  			startX = doorX - Math.floor(myLength/2);
  		} else if(direction == 4){//door bottom side
  			startZ = doorZ - myBreadth + 1;
  			startX = doorX - Math.floor(myLength/2);
  		}
  		for(var myx = 0; myx < myLength; myx++){
  			for(var myz = 0; myz < myBreadth; myz++){
  				roomArray.push(this.turnXZIntoValue(startX + myx, startZ + myz));
  			}
  		}
  		var allowedPlacements = [allowedType, wallType];
  		if(this.doesArrayFit(roomArray, allowedPlacements)){

  		} else {
  			return false;
  		}
  		for(var x = 0; x < myLength; x++){
  			for(var z = 0; z < myBreadth; z++){
  				if(z == 0 || x == 0 || z == myBreadth - 1 || x == myLength - 1){
					this.getTile(startX + x, startZ + z).type = wallType;
				} else {
					this.getTile(startX + x, startZ + z).type = floorType;
				}
  			}
  		}
  		this.getTile(doorX, doorZ).type = doorType;

  		return true;
  	}

  	doesArrayFit(placeArray, allowedTypes){
  		for(var i = 0; i < placeArray.length; i++){
  			if(placeArray[i] > 0 && placeArray[i] < this.xtotal * this.ztotal){
  				if(!allowedTypes.includes(this.tiles[placeArray[i]].type)){
  					return false;
  				}
  			} else {
  				return false;
  			}
  		}
  		return true;
  	}

  	getMaxPathForTile(x, z, checkType, direction){
  		if(this.getTile(x,z).type == checkType){
  			var pathCalculated = false;
  			var count = 0;
  			while(pathCalculated == false){
  				var checkTile;
  				if(direction == 1){//up
  					checkTile = this.getTile(x + count,z);
  				} else if(direction == 2){//down
  					checkTile = this.getTile(x - count,z);
  				} else if(direction == 3){//left
  					checkTile = this.getTile(x ,z - count);
  				} else {//right
  					checkTile = this.getTile(x ,z + count);
  				}

  				if(checkTile != false && checkTile.type == checkType){
  					count++;
  				} else {
  					pathCalculated = true;
  				}
  			}
  			return count - 1;
  		} else {
  			return 0;
  		}
  	}

  	RimDetection(checkType, newType, oldType){
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				var currentTile = this.getTile(x, z);
				if((oldType < 0 || currentTile.type == oldType) && currentTile.type != newType){
					if(this.doesTileHasNeighbourType(x, z, checkType) == true){
						currentTile.type = newType;
					}
				}
			}
		}
  	}

  	ReplaceAll(oldType, newType){
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				var currentTile = this.getTile(x, z);
				if(currentTile.type == oldType){
					currentTile.type = newType;
				}
			}
		}
  	}

  	ResetAll(resetType){
  		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				this.getTile(x, z).type = resetType;
			}
		}
  	}

  	doesTileHasNeighbourType(x, z, type){
  		if(this.getTile(x + 1, z) != false && this.getTile(x + 1, z).type == type){
  			return true;
  		}
  		if(this.getTile(x + 1, z + 1) != false && this.getTile(x + 1, z + 1).type == type){
  			return true;
  		}
  		if(this.getTile(x + 1, z - 1) != false && this.getTile(x + 1, z - 1).type == type){
  			return true;
  		}
  		if(this.getTile(x - 1, z) != false && this.getTile(x - 1, z).type == type){
  			return true;
  		}
  		if(this.getTile(x - 1, z + 1) != false && this.getTile(x - 1, z + 1).type == type){
  			return true;
  		}
  		if(this.getTile(x - 1, z - 1) != false && this.getTile(x - 1, z - 1).type == type){
  			return true;
  		}
  		if(this.getTile(x, z + 1) != false && this.getTile(x , z + 1).type == type){
  			return true;
  		}
  		if(this.getTile(x, z - 1) != false && this.getTile(x , z - 1).type == type){
  			return true;
  		}
  		return false
  	}

  	doesTileHasNonDiagonalNeighbourType(x, z, type){
  		if(this.getTile(x + 1, z) != false && this.getTile(x + 1, z).type == type){
  			return true;
  		}
  		if(this.getTile(x - 1, z) != false && this.getTile(x - 1, z).type == type){
  			return true;
  		}
  		if(this.getTile(x, z + 1) != false && this.getTile(x , z + 1).type == type){
  			return true;
  		}
  		if(this.getTile(x, z - 1) != false && this.getTile(x , z - 1).type == type){
  			return true;
  		}
  		return false
  	}

  	lineEdge(newType, thickness){
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(x <= thickness || this.xtotal - x <= thickness || z <= thickness || this.ztotal - z <= thickness){
					this.getTile(x, z).type = newType;
				}
			}
		}
	}

	drawPaths(pathPointType, pathType, allowedType){
		var doorArrayX = [];
		var doorArrayZ = [];

		var collisionArray = [];

		for(var x = 0; x < this.xtotal; x++){
			for(var z = 0; z < this.ztotal; z++){
				var currentTile = this.getTile(x, z);
				//console.log(currentTile.type);
				if(currentTile.type == pathPointType){
					if(this.doesTileHasNeighbourType(x,z, allowedType)){
						doorArrayX.push(x);
						doorArrayZ.push(z);
						collisionArray[this.turnXZIntoValue(x, z)] = 0;
					} else {
						collisionArray[this.turnXZIntoValue(x, z)] = 1;
					}
				}
				else if(currentTile.type == allowedType){
					collisionArray[this.turnXZIntoValue(x, z)] = 0;
				} else {
					collisionArray[this.turnXZIntoValue(x, z)] = 1;
				}
			}
		}

		for(var i = 0; i < doorArrayX.length; i++){
			var startX = doorArrayX[i];
			var startZ = doorArrayZ[i];

			var which = i;
			while(which == i){
				which = Math.floor((Math.random() * doorArrayX.length));
			}

			var endX = doorArrayX[which];
			var endZ = doorArrayZ[which];
			
			var myPath = new Path(startX, startZ, endX, endZ, collisionArray, this.xtotal, this.ztotal);
			var pathArray = myPath.buildPath();
			if(pathArray != false){
				var myPathXArray = pathArray[0];
				var myPathZArray = pathArray[1];
				for(var j = 0; j < myPathXArray.length; j++){
					var CurrentTile = this.getTile(myPathXArray[j], myPathZArray[j]);
					if(CurrentTile.type == allowedType){
						CurrentTile.type = pathType;
					}
				}
			}
		}

		//second Path Pass using current paths only
		doorArrayX = [];
		doorArrayZ = [];
		collisionArray = [];
		for(var x = 0; x < this.xtotal; x++){
			for(var z = 0; z < this.ztotal; z++){
				var currentTile = this.getTile(x, z);
				//console.log(currentTile.type);
				if(currentTile.type == pathPointType){
					if(this.doesTileHasNeighbourType(x,z, pathType)){
						doorArrayX.push(x);
						doorArrayZ.push(z);
						collisionArray[this.turnXZIntoValue(x, z)] = 0;
					} else {
						collisionArray[this.turnXZIntoValue(x, z)] = 1;
					}
				}
				else if(currentTile.type == pathType){
					collisionArray[this.turnXZIntoValue(x, z)] = 0;
				} else {
					collisionArray[this.turnXZIntoValue(x, z)] = 1;
				}
			}
		}
		for(var i = 0; i < doorArrayX.length; i++){
			var startX = doorArrayX[i];
			var startZ = doorArrayZ[i];

			var which = i;
			while(which == i){
				which = Math.floor((Math.random() * doorArrayX.length));
			}

			var endX = doorArrayX[which];
			var endZ = doorArrayZ[which];
			
			var myPath = new Path(startX, startZ, endX, endZ, collisionArray, this.xtotal, this.ztotal);
			var pathArray = myPath.buildPath();
			if(pathArray != false){
				var myPathXArray = pathArray[0];
				var myPathZArray = pathArray[1];
				for(var j = 0; j < myPathXArray.length; j++){
					var CurrentTile = this.getTile(myPathXArray[j], myPathZArray[j]);
					if(CurrentTile.type == pathType){
						CurrentTile.type = -1;
					}
				}
			}
			if(doorArrayX.length == 2){
				i = 9;
			}
		}
		this.ReplaceAll(pathType, allowedType);
		this.ReplaceAll(-1, pathType);

		var trimDone = false;
		while(trimDone == false){
			trimDone = true;
			for(var x = 0; x < this.xtotal; x++){
				for(var z = 0; z < this.ztotal; z++){
					if(this.getTile(x,z).type == allowedType){
						var sideCount = this.countNonDiagonalNeighboursofType(x,z, pathType);
						var diagonalCount = this.countDiagonalNeighboursofType(x,z, pathType);
						if(sideCount + diagonalCount >= 5){
							this.getTile(x,z).type = pathType;
							trimDone = false;
						}
					}
				}
			}
		}	
	}

	doesTileFitSimpleArray(x,z, arrayIn){
		if(this.getTile(x - 1, z - 1).type != arrayIn[0]){
			return false;
		}
		if(this.getTile(x, z - 1).type != arrayIn[1]){
			return false;
		}
		if(this.getTile(x + 1, z - 1).type != arrayIn[2]){
			return false;
		}
		if(this.getTile(x - 1, z).type != arrayIn[3]){
			return false;
		}
		if(this.getTile(x + 1, z).type != arrayIn[5]){
			return false;
		}
		if(this.getTile(x - 1, z + 1).type != arrayIn[6]){
			return false;
		}
		if(this.getTile(x, z + 1).type != arrayIn[7]){
			return false;
		}
		if(this.getTile(x + 1, z + 1).type != arrayIn[8]){
			return false;
		}
		return true;
	}

	removeDeadEnds(oldType, newType){
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x, z).type == oldType){
					if(this.countNonDiagonalNeighboursofType(x,z, oldType) == 1){
						this.getTile(x,z).type = newType;
					}
				}
			}
		}
	}

	addPatches(minPatchSize, maxPatchSize, patchType, oldType, patchChance){
		var patchPointXArray = [];
		var patchPointZArray = [];
		var patchPointPointArray = [];
		var patchStageArray = [];
		var patchSizeArray = [];

		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x, z).type == oldType){
					if(Math.random() * 100 <= patchChance){
						var size = Math.floor(Math.random() * (maxPatchSize - minPatchSize)) + minPatchSize;
						patchPointXArray.push(x);
						patchPointZArray.push(z);
						patchStageArray.push(0);
						patchSizeArray.push(size);
						patchPointZArray.push(this.turnXZIntoValue(x,z));
					}
				}
			}
		}
		for(var i = 0; i < patchPointXArray.length; i++){
			//if(this.getTile(patchPointXArray[i], patchPointZArray[i]).type == oldType){
			if(this.getTile(patchPointXArray[i], patchPointZArray[i])!=false){
				this.getTile(patchPointXArray[i], patchPointZArray[i]).type = 0;
			}
			if(patchStageArray[i] < patchSizeArray[i]){
				//up
				var NextX = patchPointXArray[i];
				var NextZ = patchPointZArray[i] - 1;
				var nextpoint = this.turnXZIntoValue(NextX, NextZ);
				if(!patchPointPointArray.includes(nextpoint)){
					patchPointXArray.push(NextX);
					patchPointZArray.push(NextZ);
					patchPointPointArray.push(patchPointPointArray);
					patchSizeArray.push(patchSizeArray[i]);
					patchStageArray.push(patchStageArray[i] + 1);
				}
				//down
				NextX = patchPointXArray[i];
				NextZ = patchPointZArray[i] + 1;
				nextpoint = this.turnXZIntoValue(NextX, NextZ);
				if(!patchPointPointArray.includes(nextpoint)){
					patchPointXArray.push(NextX);
					patchPointZArray.push(NextZ);
					patchPointPointArray.push(patchPointPointArray);
					patchSizeArray.push(patchSizeArray[i]);
					patchStageArray.push(patchStageArray[i] + 1);
				}
				//left
				NextX = patchPointXArray[i] - 1;
				NextZ = patchPointZArray[i];
				nextpoint = this.turnXZIntoValue(NextX, NextZ);
				if(!patchPointPointArray.includes(nextpoint)){
					patchPointXArray.push(NextX);
					patchPointZArray.push(NextZ);
					patchPointPointArray.push(patchPointPointArray);
					patchSizeArray.push(patchSizeArray[i]);
					patchStageArray.push(patchStageArray[i] + 1);
				}
				//right
				//left
				NextX = patchPointXArray[i] + 1;
				NextZ = patchPointZArray[i];
				nextpoint = this.turnXZIntoValue(NextX, NextZ);
				if(!patchPointPointArray.includes(nextpoint)){
					patchPointXArray.push(NextX);
					patchPointZArray.push(NextZ);
					patchPointPointArray.push(patchPointPointArray);
					patchSizeArray.push(patchSizeArray[i]);
					patchStageArray.push(patchStageArray[i] + 1);
				}
			}
		}
	}

	addConnectionsBetween(oldType, newType, connectionChance){
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x, z).type == oldType){
					var sideCount = this.countNonDiagonalNeighboursofType(x,z,newType);
					if(sideCount == 2){
						if(Math.random() * 100 <= connectionChance){
							this.getTile(x, z).type = newType;
						}
					}
				}
			}
		}
	}

	trimRiverCrossing(crossingType, groundType, edgeType){
		var acceptable = [groundType, edgeType];
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x, z).type == crossingType){
					if(acceptable.includes(this.getTile(x + 1, z).type) && acceptable.includes(this.getTile(x - 1, z).type)){
							this.getTile(x, z).type = groundType;
					}
					if(acceptable.includes(this.getTile(x, z + 1).type) && acceptable.includes(this.getTile(x, z - 1).type)){
							this.getTile(x, z).type = groundType;
					}
				}
			}
		}
	}

	addDoorsBetween(oldType, checkType, doorType, connectionChance){
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x, z).type == oldType){
					if(this.getTile(x + 1, z).type == checkType && this.getTile(x - 1, z).type == checkType){
						if(!this.doesTileHasNonDiagonalNeighbourType(x,z, doorType) && this.countNonDiagonalNeighboursofType(x,z,oldType) == 2){
							if(Math.random() * 100 <= connectionChance){
								this.getTile(x, z).type = doorType;
							}
						}
					}
					if(this.getTile(x, z + 1).type == checkType && this.getTile(x, z - 1).type == checkType){
						if(!this.doesTileHasNonDiagonalNeighbourType(x,z, doorType) && this.countNonDiagonalNeighboursofType(x,z,oldType) == 2){
							if(Math.random() * 100 <= connectionChance){
								this.getTile(x, z).type = doorType;
							}
						}
					}
				}
			}
		}
	}

	addRiverCrossings(waterType, groundType, crossingType, connectionChance, minQuota){
		var count = 0;
		var attempts = 0;
		while(count < minQuota && attempts < 100 * minQuota){
			for(var z = 0; z < this.ztotal; z++){
				for(var x = 0; x < this.xtotal; x++){
					if(this.getTile(x, z).type == waterType){
						if(this.getTile(x + 1, z).type == groundType && this.getTile(x - 1, z).type == groundType){
							if(!this.doesTileHasNonDiagonalNeighbourType(x,z, crossingType) && this.countNonDiagonalNeighboursofType(x,z,waterType) == 2){
								if(Math.random() * 100 <= connectionChance){
									this.getTile(x + 1, z).type = crossingType;
									this.getTile(x - 1, z).type = crossingType;
									this.getTile(x + 2, z).type = crossingType;
									this.getTile(x - 2, z).type = crossingType;
									this.getTile(x, z).type = crossingType;
									count++;
								}
							}
						}
						if(this.getTile(x, z + 1).type == groundType && this.getTile(x, z - 1).type == groundType){
							if(!this.doesTileHasNonDiagonalNeighbourType(x,z, crossingType) && this.countNonDiagonalNeighboursofType(x,z,waterType) == 2){
								if(Math.random() * 100 <= connectionChance){
									this.getTile(x, z + 1).type = crossingType;
									this.getTile(x, z - 1).type = crossingType;
									this.getTile(x, z + 2).type = crossingType;
									this.getTile(x, z - 2).type = crossingType;
									this.getTile(x, z).type = crossingType;
									count++;
								}
							}
						}
					}
				}
			}
			attempts++;
		}
	}

	countType(type){
		var count = 0;
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x, z).type == type){
					count++;
				}
			}
		}
		return count;
	}

	attemptToPlaceDungeonRooms(floorType, wallType, edgeType, maxWidth, maxBreadth, minWidth, minBreadth, buildCount){
		var floorArrayX = [];
		var floorArrayZ = [];
		for(var x = 0; x < this.xtotal; x++){
  			for(var z = 0; z < this.ztotal; z++){
				if(this.getTile(x,z).type == floorType){
					floorArrayX.push(x);
					floorArrayZ.push(z);
				}
			}
		}

		for(var i = 0; i < buildCount; i++){
			var BuildingDone = false;
			var attempts = 0;
			while(BuildingDone == false && attempts < 20){
				var which = Math.floor(Math.random() * floorArrayX.length);
				var myWidth = Math.floor((Math.random() * (maxWidth - minWidth))) + minWidth;
				var myBreadth = Math.floor((Math.random() * (maxBreadth - minBreadth))) + minBreadth;
				if(this.generateDungeonRoom(floorType, wallType, edgeType, myWidth, myBreadth, floorArrayX[which], floorArrayZ[which])){
					BuildingDone = true;
				}
				attempts++;
			}
		}
	}

	generateDungeonRoom(floorType, wallType, edgeType, width, breadth, x, z){
		var roomArray = [];
		for(var myx = 0; myx < width; myx++){
  			for(var myz = 0; myz < breadth; myz++){
  				roomArray.push(this.turnXZIntoValue(x + myx - Math.floor(width/2), z + myz + Math.floor(breadth/2)));
  			}
  		}

  		var allowedPlacements = [floorType, wallType];
  		if(!this.doesArrayFit(roomArray, allowedPlacements)){
  			return false;
  		}

  		var floorFound = false;
  		for(var myx = 0; myx < width; myx++){
  			for(var myz = 0; myz < breadth; myz++){
  				if(myz == 0 || myx == 0 || myz == breadth - 1 || myx == width - 1){
  					if(this.getTile(x + myx - Math.floor(width/2), z + myz + Math.floor(breadth/2)).type == floorType){
						floorFound = true;
					}
				}
  			}
  		}
  		if(floorFound == false){
  			return false;
  		}

  		for(var myx = 0; myx < width; myx++){
  			for(var myz = 0; myz < breadth; myz++){
  				if(myz == 0 || myx == 0 || myz == breadth - 1 || myx == width - 1){
  					if(this.getTile(x + myx - Math.floor(width/2), z + myz + Math.floor(breadth/2)).type != floorType){
						this.getTile(x + myx - Math.floor(width/2), z + myz + Math.floor(breadth/2)).type = edgeType;
					}
				} else {
					this.getTile(x + myx - Math.floor(width/2), z + myz + Math.floor(breadth/2)).type = floorType;
				}
  			}
  		}
  		return true;
	}

	getSurroundingArray(x, z){
		var surroundings = [];
		if(this.getTile(x-1,z-1) != false){
			surroundings.push(this.getTile(x-1,z-1).type);
		} else {
			surroundings.push(0);
		}
		if(this.getTile(x,z-1) != false){
			surroundings.push(this.getTile(x,z-1).type);
		} else {
			surroundings.push(0);
		}
		if(this.getTile(x+1,z-1) != false){
			surroundings.push(this.getTile(x+1,z-1).type);
		} else {
			surroundings.push(0);
		}

		if(this.getTile(x-1,z) != false){
			surroundings.push(this.getTile(x-1,z).type);
		} else {
			surroundings.push(0);
		}
		if(this.getTile(x+1,z) != false){
			surroundings.push(this.getTile(x+1,z).type);
		} else {
			surroundings.push(0);
		}

		if(this.getTile(x-1,z+1) != false){
			surroundings.push(this.getTile(x-1,z+1).type);
		} else {
			surroundings.push(0);
		}
		if(this.getTile(x,z+1) != false){
			surroundings.push(this.getTile(x,z+1).type);
		} else {
			surroundings.push(0);
		}
		if(this.getTile(x+1,z+1) != false){
			surroundings.push(this.getTile(x+1,z+1).type);
		} else {
			surroundings.push(0);
		}
		return surroundings;
	}

	generateRiver(groundType, edgeType, waterType){
		var riverDone = false
		var attempts = 0;
		while(riverDone == false && attempts < 100){
			var direction = Math.floor(Math.random() * 2);
			if(direction == 0){
				var topFound = false;
				var xTop = Math.floor(Math.random() * this.xtotal);
				var zTop = 0;
				for(var z = 0; z < 30 && topFound == false; z++){
					if(this.getTile(xTop, z).type == groundType){
						topFound = true;
						zTop = z;
					}
				}
				var bottomFound = false;
				var xBot = Math.floor(Math.random() * this.xtotal);
				var zBot = 0;
				for(var z = 0; z < 30 && bottomFound == false; z++){
					if(this.getTile(xBot, this.ztotal - z).type == groundType){
						bottomFound = true;
						zBot = this.ztotal - z;
					}
				}
				if(topFound == true && bottomFound == true && (xTop - xBot > 40 || xTop - xBot < -40)){
					this.getTile(xBot, zBot).type = waterType;
					this.getTile(xTop, zTop).type = waterType;
					this.drawPaths(waterType, 999, groundType);
					this.ReplaceAll(999, waterType);
					for(var z = zTop; z >= 0; z--){
						this.getTile(xTop, z).type = waterType;
					}
					for(var z = zBot; z < this.ztotal; z++){
						this.getTile(xBot, z).type = waterType;
					}
					riverDone = true;
				}
			} else{
				var leftFound = false;
				var zTop = Math.floor(Math.random() * this.ztotal);
				var xTop = 0;
				for(var x = 0; x < 30 && leftFound == false; x++){
					if(this.getTile(x, zTop).type == groundType){
						leftFound = true;
						xTop = x;
					}
				}
				var rightFound = false;
				var zBot = Math.floor(Math.random() * this.xtotal);
				var xBot = 0;
				for(var x = 0; x < 30 && rightFound == false; x++){
					if(this.getTile(this.xtotal - x, zBot).type == groundType){
						rightFound = true;
						xBot = this.xtotal - x;
					}
				}
				if(leftFound == true && rightFound == true && (zTop - zBot > 40 || zTop - zBot < -40)){
					this.getTile(xBot, zBot).type = waterType;
					this.getTile(xTop, zTop).type = waterType;
					this.drawPaths(waterType, 999, groundType);
					this.ReplaceAll(999, waterType);
					for(var x = xTop; x >= 0; x--){
						this.getTile(x, zTop).type = waterType;
					}
					for(var x = xBot; x < this.xtotal; x++){
						this.getTile(x, zBot).type = waterType;
					}
					riverDone = true;
				}
			}
			attempts++;
		}

		return riverDone;
	}

	temporaryReplaceAll(oldType, newType){
		var oldArray = [];
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				var currentTile = this.getTile(x, z);
				if(currentTile.type == oldType){
					oldArray.push(this.turnXZIntoValue(x,z));
					currentTile.type = newType;
				}
			}
		}
		return oldArray;
	}

	restorefromTempReplace(originalType, replacedType, replaceArray, requiresNoChange){
		for(var i = 0; i < replaceArray.length; i++){
			if((this.tiles[replaceArray[i]].type == replacedType && requiresNoChange == true) || requiresNoChange == false){
				this.tiles[replaceArray[i]].type = originalType;
			}
		}
	}

	recenterWorld(checkType, replaceType){
		var checkArrayX = [];
		var checkArrayZ = [];
		var top = this.ztotal;
		var bottom = -1;
		var left = this.xtotal;
		var right = -1;

		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				var currentTile = this.getTile(x, z);
				if(currentTile.type == checkType){
					checkArrayX.push(x);
					checkArrayZ.push(z);
					if(z < top){
						top = z;
					}
					if(z > bottom){
						bottom = z;
					}
					if(x < left){
						left = x;
					}
					if(x > right){
						right = x;
					}
				}
			}
		}

		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				this.getTile(x, z).type = replaceType;
			}
		}

		var xAdjust = left - Math.floor((this.xtotal - (right - left))/2);
		var zAdjust = top - Math.floor((this.ztotal - (bottom - top))/2);
		for(var i = 0; i < checkArrayX.length; i++){
			if(this.getTile(checkArrayX[i] - xAdjust, checkArrayZ[i] - zAdjust) != false){
				this.getTile(checkArrayX[i] - xAdjust, checkArrayZ[i] - zAdjust).type = checkType;
			}
		}

	}

	buildCollisionArray(){
		var collisionArray = [];
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x,z) != false){
					collisionArray.push(this.getTile(x,z).doesTileHaveCollision());
				} else {
					collisionArray.push(1);
				}
			}
		}
		return collisionArray;
	}

	decorateWithObjects(){
		if(this.worldType == 1){
			this.decorateDungeon();
		}
		if(this.worldType == 2){
			this.decorateOpenWorld();
		}
		if(this.worldType == 3){
			this.decoratePlains();
		}
		if(this.worldType == 4){
			this.decorateCave();
		}
	}

	decorateCave(){
		var LightPlaces = []
		var LightPlacesX = []
		var LightPlacesZ = []
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x,z).type == 10){
					if(this.countNonDiagonalNeighboursofType(x,z, 10) == 4 && x != this.playerX && z != this.playerZ){
						LightPlaces.push(LightPlaces.length);
						LightPlacesX.push(x);
						LightPlacesZ.push(z);
					}
				}
			}
		}
		LightPlaces = shuffleArray(LightPlaces);
		for(var i = 0; i < 5; i++){
			var x = LightPlacesX[LightPlaces[i]];
			var z = LightPlacesZ[LightPlaces[i]];
			this.objects.push(new LightCrystal(x,z, this.objects.length));
		}
	}

	decorateDungeon(){
		var LightPlaces = []
		var LightPlacesX = []
		var LightPlacesZ = []
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x,z).type == 3){
					if(this.countNonDiagonalNeighboursofType(x,z, 3) == 2 && this.countNonDiagonalNeighboursofType(x,z, 11) == 2 && x != this.playerX && z != this.playerZ){
						LightPlaces.push(LightPlaces.length);
						LightPlacesX.push(x);
						LightPlacesZ.push(z);
					}
				}
			}
		}
		LightPlaces = shuffleArray(LightPlaces);
		for(var i = 0; i < 10; i++){
			var x = LightPlacesX[LightPlaces[i]];
			var z = LightPlacesZ[LightPlaces[i]];
			this.objects.push(new DungeonLight(x,z, this.objects.length));
		}
	}

	decorateOpenWorld(){
		var Places = []
		var PlacesX = []
		var PlacesZ = []
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x,z).type == 1){
					if(this.countNonDiagonalNeighboursofType(x,z, 1) + this.countNonDiagonalNeighboursofType(x,z, 3) == 4 && x != this.playerX && z != this.playerZ){
						Places.push(Places.length);
						PlacesX.push(x);
						PlacesZ.push(z);
					}
				}
			}
		}
		Places = shuffleArray(Places);
		for(var i = 0; i < 60 && i < Places.length ; i++){
			var x = PlacesX[Places[i]];
			var z = PlacesZ[Places[i]];
			this.objects.push(new Tree(x,z, this.objects.length));
		}
	}

	decoratePlains(){
		var Places = []
		var PlacesX = []
		var PlacesZ = []
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x,z).type == 1){
					if(this.countNonDiagonalNeighboursofType(x,z, 1) + this.countNonDiagonalNeighboursofType(x,z, 7) == 4 && x != this.playerX && z != this.playerZ){
						Places.push(Places.length);
						PlacesX.push(x);
						PlacesZ.push(z);
					}
				}
			}
		}
		Places = shuffleArray(Places);
		for(var i = 0; i < 60 && i < Places.length ; i++){
			var x = PlacesX[Places[i]];
			var z = PlacesZ[Places[i]];
			this.objects.push(new Tree(x,z, this.objects.length));
		}
	}

	pickPlayerSpot(type){
		var Places = []
		var PlacesX = []
		var PlacesZ = []
		for(var z = 0; z < this.ztotal; z++){
			for(var x = 0; x < this.xtotal; x++){
				if(this.getTile(x,z).type == type){
					Places.push(Places.length);
					PlacesX.push(x);
					PlacesZ.push(z);
				}
			}
		}
		Places = shuffleArray(Places);
		this.playerX = PlacesX[Places[0]];
		this.playerZ = PlacesZ[Places[0]];
	}

	setPlayer(){
		GamePlayer.xpos = this.playerX;
		GamePlayer.zpos = this.playerZ;
		GamePlayer.nextxpos = this.playerX;
		GamePlayer.nextzpos = this.playerZ;
	}
}