/**
 * player_ui.js - Methods that handle the canvas player UI
 */

// Close enough...
var PI = 3.14;

// variables for updating the stage on demand
var update = true;
var firstUpdate = true;
var lastUpdate = 0;

//all hex images are the same size
var hexScale = 1.0;

var defHexWidth = 84;
var defHexHeight = 72;
var hexWidth = defHexWidth * hexScale;
var hexHeight = defHexHeight * hexScale;

// variables for isometric view
var useIsometric = true;
var isometricPadding = 0;
var defElevationHeight = 15;
var elevationHeight = defElevationHeight * hexScale;

//variable to show level (elevation/depth/etc.)
var showLevels = true;

var apDisplaying, jpDisplaying;

function initPlayerUI() {
	// TODO: initialize new canvas based UI overlay
}

/**
 * Intended to be called back from Tweens when the object is ready to remove itself from teh stage
 */
function removeThisFromStage() {
	stage.removeChild(this);
}

function setPlayerInfo(unitName, playerName) {
	//TODO: display player name and battle unit name
}

function setActionPoints(apRemaining) {
	apDisplaying = apRemaining;
	
	if(apRemaining == 0){
		// TODO: hide the END button when out of AP
	}

	updateUnitStatsDisplay();
}

function setJumpPoints(jpRemaining) {
	jpDisplaying = jpRemaining;
	
	if(jpRemaining == null) {
		// TODO: null means no jump jets, hide the JP display and JUMP Button
	}
	
	updateUnitStatsDisplay();
}

function updateUnitStatsDisplay() {
	// TODO: update AP and JP display
}

function setArmorDisplay(armor, internals) {
	// TODO: HTAL graph display
	// TODO: HTAL paper doll display
	
	/*var line1 = "HD:"+armor[HEAD]+"("+internals[HEAD]+")";
	var line2 = "LA:"+armor[LEFT_ARM]+"("+internals[LEFT_ARM]+")" +"          "+ "RA:"+armor[RIGHT_ARM]+"("+internals[RIGHT_ARM]+")";
	var line3 = "LT:"+armor[LEFT_TORSO]+"("+internals[LEFT_TORSO]+")" +" "+ "CT:"+armor[CENTER_TORSO]+"("+internals[CENTER_TORSO]+")" +" "+ "RT:"+armor[RIGHT_TORSO]+"("+internals[RIGHT_TORSO]+")";
	var line4 = "LTR:"+armor[LEFT_REAR] +"    "+ "CTR:"+armor[CENTER_REAR] +"    "+ "RTR:"+armor[RIGHT_REAR];
	var line5 = "LL:"+armor[LEFT_LEG]+"("+internals[LEFT_LEG]+")" +"          "+ "RL:"+armor[RIGHT_LEG]+"("+internals[RIGHT_LEG]+")";
	unitArmorDisplay.innerHTML = 
			"<p><pre>"+line1+"</pre></p>" +
			"<p><pre>"+line2+"</pre></p>" +
			"<p><pre>"+line3+"</pre></p>" +
			"<p><pre>"+line4+"</pre></p>" +
			"<p><pre>"+line5+"</pre></p>";*/
}


function setHeatDisplay(heat, heatGen, heatDiss) {
	// TODO: update unit heat, heat generation, heat dissipation
	
	// TODO: Heat meter with indicators of heat that weapons will generate and where the heat penalties are
}

function updateWeaponsDisplay() {
	var weapons = playerUnit.weapons;
	playerWeapons = [];
	
	// TESTING
	var testingStr = "";
	
	var i = 1;
	$.each(weapons, function(key, w) {
		playerWeapons[i-1] = w;
		
		var weaponNum = i;
		if(weaponNum == 10){
			weaponNum = 0
		}
		else if(weaponNum > 10){
			// TODO: support > 10 weapons?
			return;
		}
		
		var locationStr = getLocationText(w.location);
		
		// TODO: if the weapon is destroyed/damaged, add class "disabled"
		var weaponClassStr = "weapon";
		
		// show actual calculated TO-HIT
		var toHitAsPercent = "  --";
		if(w.toHit != null) {
			toHitAsPercent = w.toHit+"%";
		}
		
		var weaponInfo = w.shortName;
		if(w.ammo) {
			// show total remaining ammo
			var ammoRemaining = 0;
			$.each(w.ammo, function(key, ammoObj) {
				ammoRemaining += ammoObj.ammoRemaining;
			});
			weaponInfo += "["+ammoRemaining+"]";
			
			if(ammoRemaining <= 0) {
				weaponClassStr += " disabled";
			}
		}
		
		var weaponStr = "<div class='"+weaponClassStr+"' id='"+w.id+"'>" +
							"<div class='weaponNumber'>"+weaponNum+"</div>" +
							"<div class='weaponLocation'>"+locationStr+"</div>" +
							"<div class='weaponIcon' id='"+w.weaponType+"'>"+"</div>" +
							"<div class='weaponInfo'>"+weaponInfo+"</div>" +
							"<div class='weaponHit'>"+toHitAsPercent+"</div>" +
						"</div>";
		
		testingStr += weaponStr;
		i++;
	});
	
	// TODO: update weapons display
	
	// update the initial cooldown display for each weapon
	updateWeaponsCooldown();
	
	/*$(".weapon").click(function() {
		// TODO: move to events.js
		if(playerUnit == turnUnit 
				&& !$(this).hasClass("cooldown") 
				&& !$(this).hasClass("disabled")){
			// only allow weapons to be selected that aren't on cooldown
			// TODO: only allow weapons to be selected that have >0% chance to hit
			$(this).toggleClass("selected");
			updateSelectedWeapons();
		}
	});*/
	
	/*var actionStr;
	if(playerUnit.id == turnUnit.id) {
		// TESTING (button will eventually need to switch between 'action_fire' and 'action_end' based on whether weapons are selected to fire)
		actionStr = "<div class='action_fire hidden'>Fire</div>"+
					"<div class='action_end'>End<br/>Turn</div>"+
					"<div class='action_wait hidden'>Wait</div>";
	}
	else {
		actionStr = "<div class='action_fire hidden'>Fire</div>"+
					"<div class='action_end hidden'>End<br/>Turn</div>"+
					"<div class='action_wait'>Wait</div>";
	}*/
	
	
	/*$(".action_fire").click(function() {
		// TODO: combine to a single method that is also called by the key press equivalent
		var selectedWeapons = getSelectedWeapons();
		fire_weapons(selectedWeapons);
	});*/
	
	/*$(".action_end").click(function() {
		skip();
	});*/
}

function updateSelectedWeapons() {
	// TODO: use this method to store selected weapons in an array then update the UI to reflect
	// instead of directly using the "selected" class to store that info
	var hasSelected = false;
	
	var weaponHeatTotal = 0
	
	// TODO: store selected weapons
	
	/*$.each(playerWeapons, function(key, w) {
		if($("#"+w.id).hasClass("selected")) {
			hasSelected = true;
			
			weaponHeatTotal += w.heat;
		}
	});
	
	if(hasSelected) {
		$('.action_fire').removeClass("hidden");
		$('.action_end').addClass("hidden");
		
		setHeatDisplay(playerUnit.heat, weaponHeatTotal, false);
	}
	else{
		$('.action_fire').addClass("hidden");
		$('.action_end').removeClass("hidden");
		
		setHeatDisplay(playerUnit.heat, false, false);
	}*/
}

/**
 * Gets an array of the player weapons that have been selected on the UI to fire
 * @returns {Array}
 */
function getSelectedWeapons() {
	var selectedWeapons = [];
	
	// TODO: determine weapons that are selected to fire
	/*$.each(playerWeapons, function(key, w) {
		if($("#"+w.id).hasClass("selected")) {
			selectedWeapons.push(w);
		}
	});*/
	
	return selectedWeapons;
}

/**
 * Deselects any currently selected players weapons on the UI
 */
function deselectWeapons() {
	var hasSelected = false;
	// TODO: deselect all weapons currently selected
	/*$.each(playerWeapons, function(key, w) {
		if($("#"+w.id).hasClass("selected")) {
			hasSelected = true;
			$('#'+w.id).toggleClass("selected");
		}
	});
	
	if(hasSelected) {
		$('.action_fire').addClass("hidden");
		$('.action_end').removeClass("hidden");
	}*/
}

/**
 * Resets the toHit value for all player weapons
 * @param weapon
 */
function resetWeaponsToHit() {
	// TODO: reset the to hit value displayed for displayed weapons
	/*$.each(playerWeapons, function(key, w) {
		w.toHit = null;
	});*/
}

/**
 * Updates the player weapons' cooldown display as needed
 */
function updateWeaponsCooldown() {
	// TODO: update cooldown displayed for each weapon
	/*$.each(playerWeapons, function(key, w) {
		if(w.cooldown > 0) {
			var cooldownAsPercent = ""+100 * w.cooldown/w.cycle+"% 100%";
			
			$("#"+w.id).addClass("cooldown").css({"background-size":cooldownAsPercent});
			$("#"+w.id+" .weaponNumber").addClass("disabled");
		}
		else{
			$("#"+w.id).removeClass("cooldown");
			
			// TODO: if a weapon is destroyed or out of ammo, do not remove its disabled state
			$("#"+w.id+" .weaponNumber").removeClass("disabled");
		}
	});*/
}

/**
 * Updates the target info display
 */
function updateTargetDisplay() {
	if(playerTarget == null) return;
	
	var targetDisplayUnit = playerTarget.displayUnit;
	
	// TESTING
	console.log(targetDisplayUnit.toString());
	
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
	
	// TODO: show the target info display
	
	/*targetContainer.alpha = 0;
	targetContainer.x = targetDisplayUnit.x + hexWidth/3;
	targetContainer.y = targetDisplayUnit.y - hexHeight/2;
	targetDisplay.htmlElement.innerHTML = testingStr;
	stage.addChild(targetContainer);
	
	//create the target bracket over the target image
	targetBracket.alpha = 0;
	targetBracket.x = targetDisplayUnit.x;
	targetBracket.y = targetDisplayUnit.y;
	stage.addChild(targetBracket);
	
	createjs.Tween.get(targetContainer).to({alpha: 1}, 500);
	createjs.Tween.get(targetBracket).to({alpha: 1}, 500);*/
	
	/*// Just played around with Timeline a bit
	var bracketTween = new createjs.Tween(targetBracket);
	var timeline = new createjs.Timeline(null, null, {loop: true});
	timeline.addTween(bracketTween.to({alpha: 1}, 500));
	timeline.addTween(bracketTween.to({alpha: 0}, 1000));
	*/
}

/**
 * Adds the given message to the end of the message display and scrolls to the bottom for it
 * @param message
 */
function addMessageUpdate(message) {
	// TODO: add message to the UI and scroll to it
	/*if(messagingArea == null) {
		messagingArea = new createjs.DOMElement(document.getElementById("messagingArea"));
	}
	
	if(message != null && message.length > 0) { 
		messagingArea.htmlElement.innerHTML += "&#13;&#10;"+message;
		messagingArea.htmlElement.scrollTop = messagingArea.htmlElement.scrollHeight;
	}*/
}

/**
 * Gets the display X,Y coordinates of an object moving a number of pixels at the given angle
 * @returns Point
 */
function getMovementDestination(sourceX, sourceY, distance, angle){
	var oppSide = Math.sin(angle * PI/180) * distance;
	var adjSide = Math.cos(angle * PI/180) * distance;
	
	var p = new Point();
	p.x = sourceX + oppSide;
	p.y = sourceY - adjSide;
	
	return p;
}

/**
 * Calculates the distance between two x,y points in space
 */
function getDistanceToTarget(sourceX, sourceY, targetX, targetY){
	// C^2 = A^2 + B^2
	return Math.sqrt(Math.pow(Math.abs(sourceX - targetX), 2) + Math.pow(Math.abs(sourceY - targetY), 2));
}

/**
 * Gets the angle to the target
 */
function getAngleToTarget(sourceX, sourceY, targetX, targetY){
	var quadrant = 0;
	var addedAngle = 0;
	if(targetX >= sourceX && targetY < sourceY){
		quadrant = 1;
		addedAngle = 0;
	}
	else if(targetX >= sourceX && targetY >= sourceY){
		quadrant = 2;
		addedAngle = 90;
	}
	else if(targetX < sourceX && targetY >= sourceY){
		quadrant = 3;
		addedAngle = 180;
	}
	else{
		quadrant = 4;
		addedAngle = 270;
	}
	
	var oppSide = 0;
	var adjSide = 0;
	switch(quadrant){
		case 1:
			oppSide = targetX - sourceX;
			adjSide = sourceY - targetY;
			break;
			
		case 2:
			oppSide = targetY - sourceY;
			adjSide = targetX - sourceX;
			break;
			
		case 3:
			oppSide = sourceX - targetX;
			adjSide = targetY - sourceY;
			break;
			
		case 4:
			oppSide = sourceY - targetY;
			adjSide = sourceX - targetX;
			break;
	}
	
	// calculate new angle based on pointer position, each angle is calculated from X axis where Urbie is origin point
	var angle = addedAngle + Math.atan((oppSide) / (adjSide)) * (180 / PI);
	return angle;
}

/** 
 * Using the Point object of center reference, mech heading, and a mech limb location will return the Point on screen from where it should be.
 * e.g. to display the weapon fire coming from the left arm, it should be 90 degrees counter clockwise from the heading
 */ 
function getPositionFromLocationAngle(p, heading, location){
	// TODO: determine radius based on size of mech image
	var radius = 15;
	var headingAngle = 0;
	var locationAngle = 0;
	
	switch(heading){
		case 0: //"N"
			headingAngle = 270;
			break;
			
		case 1: //"NE"
			headingAngle = 330;
			break;
			
		case 2: //"SE"
			headingAngle = 30;
			break;
			
		case 3: //"S"
			headingAngle = 90;
			break;
			
		case 4: //"SW"
			headingAngle = 150;
			break;
			
		case 5: //"NW"
			headingAngle = 210;
			break;
	}
	
	switch(location){
		case LEFT_ARM:
			locationAngle = -90;
			break;
			
		case LEFT_TORSO:
		case LEFT_LEG:
			locationAngle = -60;
			break;
		
		case RIGHT_ARM:
			locationAngle = 90;
			break;
			
		case RIGHT_TORSO:
		case RIGHT_LEG:
			locationAngle = 60;
			break;
			
		case LEFT_REAR:
			locationAngle = 210;
			break;
			
		case RIGHT_REAR:
			locationAngle = 150;
			break;
			
		case CENTER_REAR:
			locationAngle = 180;
			break;
			
		default: break;
	}
	
	var angleInRadians = (headingAngle + locationAngle) * Math.PI / 180;
	
	var x = p.x + Math.cos(angleInRadians) * radius;
	var y = p.y + Math.sin(angleInRadians) * radius;
	
	return new Point(x, y);
}
