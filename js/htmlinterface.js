function setHTMLContentsById(newContents, id){
	var element = document.getElementById(id);
	element.innerHTML = newContents;
}

function hideById(id){
	var element = document.getElementById(id);
	element.style.display = "none";
}

function showById(id){
	var element = document.getElementById(id);
	element.style.display = "block";
}

var fadeAmount = 0;
var startGameFlag = false;

function fadeToBlack(delta){
	fadeAmount = fadeAmount + 0.7 * delta;
	if(fadeAmount >= 1){
		fadeAmount = 1;
	}

	var element = document.getElementById("FADE-BOX");
	element.style.opacity = fadeAmount;

	if(fadeAmount >= 1){
		return true;
	} else {
		return false;
	}
}

function fadeBackIn(delta){
	fadeAmount = fadeAmount - 0.7 * delta;
	if(fadeAmount <= 0){
		fadeAmount = 0;
	}

	var element = document.getElementById("FADE-BOX");
	element.style.opacity = fadeAmount;

	if(fadeAmount == 0){
		return true;
	} else {
		return false;
	}
}

function startGame(){
	startGameFlag = true;
	var element = document.getElementById("START-BOX");
	element.style.opacity = 0;
}