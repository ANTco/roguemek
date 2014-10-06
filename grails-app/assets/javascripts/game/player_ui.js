/**
 * player_ui.js - Methods that handle the non-canvas player UI
 */

var mapDisplay, playerInfoDisplay, unitStatsDisplay, unitArmorDisplay, unitHeatDisplay, weaponsContainer, weaponsDisplay, targetContainer, targetDisplay;

// X direction offset for the Board due to the player display bar
var xBoardOffset = 200;

// Y direction offset for the Weapon display
var yWeaponsOffset = -100;

var apDisplaying, jpDisplaying;

function initPlayerUI() {
	mapDisplay = document.getElementById("mapDiv");
	mapDisplay.innerHTML = "map";	// TODO: a map
	
	playerInfoDisplay = document.getElementById("infoDiv");
	unitStatsDisplay = document.getElementById("statsDiv");
	unitArmorDisplay = document.getElementById("htalDiv");
	unitHeatDisplay = document.getElementById("heatDiv");
	
	weaponsContainer = new createjs.Container();
	// Create an alpha background for the weapons display
	var weaponsBackground = new createjs.Shape();
	weaponsBackground.graphics.beginFill("#000000").drawRect(0, 0, stage.canvas.width, 100);
	weaponsBackground.alpha = 0.5;
	// Get the div container for the weapons display
	weaponsDisplay = new createjs.DOMElement(document.getElementById("weaponsDiv"));
	weaponsContainer.addChild(weaponsBackground);
	weaponsContainer.addChild(weaponsDisplay);
    
    targetContainer = new createjs.Container();
    // Create and alpha background for the target display
	var targetBackground = new createjs.Shape();
	var targetWidth = 200;
	var targetHeight = 300;
	targetBackground.graphics.beginFill("#000000").drawRect(0, 0, targetWidth, targetHeight);
	targetBackground.alpha = 0.5;
	// Create an 'X' as an icon to close the weapons display
	var targetClose = new createjs.Shape();
	targetClose.graphics.s("#FFFFFF").ss(2,"round").mt(targetWidth-2, 0).lt(targetWidth-12, 10).mt(targetWidth-12, 0).lt(targetWidth-2, 10);
	targetClose.alpha = 0.75;
	var targetCloseHit = new createjs.Shape();
	targetCloseHit.graphics.beginFill("#000000").drawRect(targetWidth-12, 0, 10, 10);
	targetClose.hitArea = targetCloseHit;
	targetClose.on("click", handleTargetCloseClick);
	// Get the div container for the target display
	targetDisplay = new createjs.DOMElement(document.getElementById("targetDiv"));
	targetContainer.addChild(targetBackground);
	targetContainer.addChild(targetClose);
	targetContainer.addChild(targetDisplay);
}

function setPlayerInfo(unitName, playerName) {
	playerInfoDisplay.innerHTML = 
			"<p>"+unitName+"</p>"+
			"<p>"+playerName+"</p>";
}

function setActionPoints(actionPoints) {
	apDisplaying = actionPoints;
	
	if(actionPoints == 0){
		// TODO: hide the END button when out of AP
	}

	updateUnitStatsDisplay();
}

function setJumpPoints(jumpPoints) {
	jpDisplaying = jumpPoints;
	
	if(jumpPoints == null) {
		// TODO: null means no jump jets, hide the JP display and JUMP Button
	}
	
	updateUnitStatsDisplay();
}

function updateUnitStatsDisplay() {
	var statsString = "";
	
	if(apDisplaying != null) {
		statsString += "<p>AP "+apDisplaying+"</p>";
	}
	
	if(jpDisplaying != null) {
		statsString += "<p>JP "+jpDisplaying+"</p>";
	}
	
	unitStatsDisplay.innerHTML = statsString;
}

function setArmorDisplay(armor, internals) {
	// TODO: HTAL graph display
	// TODO: HTAL paper doll display
	
	var line1 = "HD:"+armor[HEAD]+"("+internals[HEAD]+")";
	var line2 = "LA:"+armor[LEFT_ARM]+"("+internals[LEFT_ARM]+")" +"          "+ "RA:"+armor[RIGHT_ARM]+"("+internals[RIGHT_ARM]+")";
	var line3 = "LT:"+armor[LEFT_TORSO]+"("+internals[LEFT_TORSO]+")" +" "+ "CT:"+armor[CENTER_TORSO]+"("+internals[CENTER_TORSO]+")" +" "+ "RT:"+armor[RIGHT_TORSO]+"("+internals[RIGHT_TORSO]+")";
	var line4 = "LTR:"+armor[LEFT_REAR] +"    "+ "CTR:"+armor[CENTER_REAR] +"    "+ "RTR:"+armor[RIGHT_REAR];
	var line5 = "LL:"+armor[LEFT_LEG]+"("+internals[LEFT_LEG]+")" +"          "+ "RL:"+armor[RIGHT_LEG]+"("+internals[RIGHT_LEG]+")";
	unitArmorDisplay.innerHTML = 
			"<p><pre>"+line1+"</pre></p>" +
			"<p><pre>"+line2+"</pre></p>" +
			"<p><pre>"+line3+"</pre></p>" +
			"<p><pre>"+line4+"</pre></p>" +
			"<p><pre>"+line5+"</pre></p>";
}


function setHeatDisplay(heat) {
	unitHeatDisplay.innerHTML = "<p>Heat "+heat+"</p>";
}

function updateWeaponsDisplay() {
	var weapons = playerUnit.weapons;
	playerWeapons = [];
	
	// TESTING
	var testingStr = "";
	
	var i = 1;
	$.each(weapons, function(key, w) {
		playerWeapons[i-1] = w;
		
		var locationStr = getLocationText(w.location);
		testingStr += (i++)+"."+locationStr+"-"+w.shortName + " ";
	});
	
	weaponsContainer.alpha = 0;
	weaponsContainer.x = -stage.x + xBoardOffset;
    weaponsContainer.y = -stage.y + stage.canvas.height + yWeaponsOffset;
	weaponsDisplay.htmlElement.innerHTML = testingStr;
	stage.addChild(weaponsContainer);
}

function updateTargetDisplay() {
	if(playerTarget == null) return;
	
	// TESTING
	console.log(playerTarget.toString());
	
	var testingStr = "";
	
	// TODO: HTAL graph display
	// TODO: HTAL paper doll display
	
	var armor = playerTarget.armor;
	var internals = playerTarget.internals;
	var line1 = "         "+"HD:"+armor[HEAD]+"("+internals[HEAD]+")";
	var line2 = "LA:"+armor[LEFT_ARM]+"("+internals[LEFT_ARM]+")" +"          "+ "RA:"+armor[RIGHT_ARM]+"("+internals[RIGHT_ARM]+")";
	var line3 = "LT:"+armor[LEFT_TORSO]+"("+internals[LEFT_TORSO]+")" +" "+ "CT:"+armor[CENTER_TORSO]+"("+internals[CENTER_TORSO]+")" +" "+ "RT:"+armor[RIGHT_TORSO]+"("+internals[RIGHT_TORSO]+")";
	var line4 = "LTR:"+armor[LEFT_REAR] +"    "+ "CTR:"+armor[CENTER_REAR] +"    "+ "RTR:"+armor[RIGHT_REAR];
	var line5 = "LL:"+armor[LEFT_LEG]+"("+internals[LEFT_LEG]+")" +"          "+ "RL:"+armor[RIGHT_LEG]+"("+internals[RIGHT_LEG]+")";
	testingStr += 
			"<p><pre>"+line1+"</pre></p>" +
			"<p><pre>"+line2+"</pre></p>" +
			"<p><pre>"+line3+"</pre></p>" +
			"<p><pre>"+line4+"</pre></p>" +
			"<p><pre>"+line5+"</pre></p>" + "<br/>";
	
	var i = 1;
	$.each(playerTarget.weapons, function(key, w) {
		var locationStr = getLocationText(w.location);
		testingStr += locationStr+"-"+w.shortName + "<br/>";
	});
	
	targetContainer.alpha = 0;
	targetContainer.x = playerTarget.x + hexWidth/3;
	targetContainer.y = playerTarget.y - hexHeight/2;
	targetDisplay.htmlElement.innerHTML = testingStr;
	stage.addChild(targetContainer);
	
	createjs.Tween.get(weaponsContainer).to({alpha: 1}, 500);
	createjs.Tween.get(targetContainer).to({alpha: 1}, 500);
}