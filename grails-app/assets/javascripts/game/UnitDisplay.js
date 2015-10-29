/**
 * Class for displaying each Unit
 */
(function() {
"use strict";

// TODO: add option for turning caching on for better framerate on slower devices
var cacheUnits = false;

function UnitDisplay(unit) {
	this.Container_constructor();
	
	this.unit = unit;
	this.id = unit.id;
	
	var imageArr = this.unit.image;
	if(imageArr != null) {
		// render the Image from the byte array
		var base64 = _arrayBufferToBase64(imageArr);
		  
		var img = new Image();
		img.src = "data:image/gif;base64," + base64;
		  
		this.image = img;
	}
	
	this.rotateContainer = null;
	this.indicator = null;
	this.header = null;
	
	this.unitImage = null;
	this.shadowUnitImage = null;
	
	this.alphaUnitImage = null;
	
	this.jumpJetSprite = null;
	
	this.statusImages = null;
}
var c = createjs.extend(UnitDisplay, createjs.Container);

// declaring some static statuses
c.STATUS_DOWN = "STATUS_DOWN";

c.init = function() {
	// TODO: scale differently based on mech tonnage/weight class also?
	var scale = 0.8 * hexScale;
	
	this.removeAllChildren();
	this.unitImage = null;
	this.shadowUnitImage = null;
	this.statusImages = [];
	
	// add container which will handle any objects that need rotation
	this.rotateContainer = new createjs.Container();
	this.addChild(this.rotateContainer);
	
	this.drawImage(scale);
	this.drawShadowImage();
	
	if(this.unit.jumpJets > 0) {
		// only load jump jet sprite if the unit has jump jets
		this.loadJumpJets();
	}
	
	// create hit area (it never needs to be added to display)
	var hit = new createjs.Shape();
	hit.graphics.beginFill("#000000").drawCircle(0, 0, hexWidth/3).endStroke();
	this.hitArea = hit;
}

c.update = function() {
	this.uncache();
	
	this.x = this.getUpdatedDisplayX(this.unit.coords);
	this.y = this.getUpdatedDisplayY(this.unit.coords);
	this.rotateContainer.rotation = this.getUpdatedDisplayRotation(this.unit.heading);
	this.shadowUnitImage.rotation = this.rotateContainer.rotation;
	
	this.updateHeadingIndicator();
	
	this.resetStatusIcons();
	if(!this.unit.isDestroyed()) {
		// determine any statuses that still need to appear
		if(this.unit.prone) {
			this.addStatusIcon(this.STATUS_DOWN);
		}
		if(this.unit.shutdown) {
			this.addStatusIcon(this.STATUS_DOWN);
		}
	}
	
	this.updateUnitIndicator();
}

/**
 * Updates the display of the unit only if its position requires a change in display
 */
c.positionUpdate = function(callFunction) {
	if(this.unit == null) return;
	this.uncache();
	this.unitImage.uncache();
	if(this.alphaUnitImage != null) this.alphaUnitImage.uncache();
	
	var hex = this.unit.getHex();
	
	var aTime = 250;
	
	var showUnitImage = false;
	var showAlphaImage = false;
	var showJumpShadow = false;
	var showJumpJets = false;
	
	var chkWaterTerrain = hex.getTerrain(Terrain.WATER);
	
	if(this.unit.jumping) {
		showUnitImage = true;
		showJumpShadow = true;
		showJumpJets = true;
	}
	else if(chkWaterTerrain != null && chkWaterTerrain.getLevel() >= 2) {
		// hide unit image and show alpha image instead to appear as fully submerged in water
		this.drawAlphaImage();
		
		showAlphaImage = true;
	}
	else{
		showUnitImage = true;
	}
	
	if(this.unitImage != null) {
		this.unitImage.visible = showUnitImage;
	}
	
	if(this.shadowUnitImage != null) {
		this.shadowUnitImage.visible = showUnitImage;
		
		if(showUnitImage) {
			if(showJumpShadow) {
				// show the shadow and unit image in different locations to convey being above ground
				var rotateContainerY = -hexHeight/4;
				var shadowUnitImageY = hexHeight/8;
				
				if(this.rotateContainer.y != rotateContainerY){
					createjs.Tween.get(this.rotateContainer)
							.to({y: rotateContainerY}, aTime)
							.call(function() {
								update = true;
							})
							.addEventListener("change", function() {
								update = true;
							});
					
					createjs.Tween.get(this.shadowUnitImage)
							.to({y: shadowUnitImageY, scaleX: this.unitImage.scaleX * 0.75, scaleY: this.unitImage.scaleY * 0.75}, aTime)
							.call(function() {
								update = true;
							})
							.addEventListener("change", function() {
								update = true;
							});
				}
			}
			else{
				var rotateContainerY = 0;
				var shadowUnitImageY = 3;
				
				if(this.rotateContainer.y != rotateContainerY){
					createjs.Tween.get(this.rotateContainer)
							.to({y: rotateContainerY}, aTime)
							.call(function() {
								update = true;
							})
							.addEventListener("change", function() {
								update = true;
							});
			
					createjs.Tween.get(this.shadowUnitImage)
							.to({y: shadowUnitImageY, scaleX: this.unitImage.scaleX * 1.0, scaleY: this.unitImage.scaleY * 1.0}, aTime)
							.call(function() {
								update = true;
							})
							.addEventListener("change", function() {
								update = true;
							});
				}
			}
		}
	}
	
	if(this.alphaUnitImage != null) {
		this.alphaUnitImage.visible = showAlphaImage;
	}
	
	if(this.jumpJetSprite != null) {
		
		this.jumpJetSprite.paused = !showJumpJets;
		
		var toAlpha = showJumpJets ? 1.0 : 0;
		
		if(this.jumpJetSprite.alpha != toAlpha) {
			// animate the jump jets becoming visible or not visible
			createjs.Tween.get(this.jumpJetSprite)
					.to({alpha: toAlpha}, aTime)
					.call(function() {
						update = true;
					})
					.addEventListener("change", function() {
						update = true;
					});
		}
	}
	
	if(callFunction) {
		var self = this;
		
		setTimeout(function() {
			callFunction(self);
		}, aTime);
	}
	
	if(!isTurnUnit(this.unit)) {
		this.doCache();
	}
}

c.getUnit = function() {
	return this.unit;
}

c.getImage = function() {
	return this.image;
}

c.drawImage = function(scale) {
	if(this.unitImage == null) {
		if(this.unit.isDestroyed()) {
			// load the wreck image as a Bitmap
			var wreckImage = queue.getResult("wreck.mech."+getUnitClassSize(this.unit));
			this.unitImage = new createjs.Bitmap(wreckImage);
		}
		else{
			// load the unit image as a Bitmap
			this.unitImage = new createjs.Bitmap(this.image);
		}
		
		this.rotateContainer.addChild(this.unitImage);
	}
	
	// make the unit image just a bit smaller since it currently is same size as the hex
	this.unitImage.scaleX = scale;
	this.unitImage.scaleY = scale;
	// adjust the rotation around its own center (which also adjusts its x/y reference point)
	this.unitImage.regX = this.image.width/2;
	this.unitImage.regY = this.image.height/2;
	this.unitImage.cache(0, 0, this.image.width, this.image.height);
}

c.drawShadowImage = function() {
	if(this.shadowUnitImage == null) {
		this.shadowUnitImage = new createjs.Bitmap(this.image);
		//load the unit image again and apply alpha color filter
		this.shadowUnitImage.filters = [
		    new createjs.ColorFilter(0,0,0,0.5, 
		    						 0,0,0,0)
		];
		this.addChildAt(this.shadowUnitImage, 0);
	}
	
	this.shadowUnitImage.alpha = 0.75;
	this.shadowUnitImage.scaleX = this.unitImage.scaleX;
	this.shadowUnitImage.scaleY = this.unitImage.scaleY;
	this.shadowUnitImage.regX = this.unitImage.regX;
	this.shadowUnitImage.regY = this.unitImage.regY;
	this.shadowUnitImage.rotation = this.rotateContainer.rotation;
	this.shadowUnitImage.cache(0, 0, this.image.width, this.image.height);
}

c.drawAlphaImage = function() {
	if(this.alphaUnitImage == null) {
		this.alphaUnitImage = new createjs.Bitmap(this.image);
		//load the unit image again and apply alpha color filter
		this.alphaUnitImage.filters = [
		    new createjs.ColorFilter(0,0,0,0.5, 
		    						 0,0,0,0)
		];
		this.rotateContainer.addChild(this.alphaUnitImage);
	}
	
	this.alphaUnitImage.scaleX = this.unitImage.scaleX;
	this.alphaUnitImage.scaleY = this.unitImage.scaleY;
	this.alphaUnitImage.regX = this.unitImage.regX;
	this.alphaUnitImage.regY = this.unitImage.regY;
	this.alphaUnitImage.cache(0, 0, this.image.width, this.image.height);
}

c.loadJumpJets = function() {
	var spriteSheet = new createjs.SpriteSheet({
		framerate: 10,
		"images": [queue.getResult("jumpjet")],
		"frames": {"regX": 57, "regY": 0, "width": 114, "height": 160, "count": 7},
		"animations": {
			jet: [0, 6, "jet", 1.0]
		}
	});
	this.jumpJetSprite = new createjs.Sprite(spriteSheet, "jet");
	this.jumpJetSprite.alpha = 0;
	this.jumpJetSprite.scaleX = this.jumpJetSprite.scaleY = 25/114;
	this.jumpJetSprite.x = 0;
	this.jumpJetSprite.y = -hexHeight/4;
	this.addChildAt(this.jumpJetSprite, 1);
	// do not cache animated sprites
}

/**
 * Add a status icon to the status list and show on the display
 */
c.addStatusIcon = function(status) {
	// declare icon width and height for all status icons
	var iW = 12;
	var iH = 10;
	
	var numStatuses = this.statusImages.length;
	
	if(this.STATUS_DOWN == status) {
		var thisStatus = new createjs.Shape();
		thisStatus.x = hexWidth/4 - iW;
		thisStatus.y = hexHeight/3 - iH - (numStatuses*iH/3);
		
		// TODO: allow customization of the status icon color
		var color = "#FF0000";
		var outlineColor = "#FFFFFF";
		
		thisStatus.graphics.setStrokeStyle(1, "square").beginStroke(outlineColor).beginFill(color)
				.moveTo(iW/2, iH)
				.lineTo(0, iH/2)
				.lineTo(1*iW/3, iH/2)
				.lineTo(iW/2, 0)
				.lineTo(2*iW/3, iH/2)
				.lineTo(iW, iH/2)
				.lineTo(iW/2, iH)
				.endStroke();
		
		this.addChild(thisStatus);
		this.statusImages.push(thisStatus);
	}
}

/**
 * Remove and clear any status icons currently shown on the display
 */
c.resetStatusIcons = function() {
	for(var n=0; n<this.statusImages.length; n++) {
		var thisStatus = this.statusImages[n];
		this.removeChild(thisStatus);
		delete this.statusImages[n];
	}
	
	this.statusImages = [];
}

c.getUpdatedDisplayX = function(coords) {
	return coords.x * (3 * hexWidth / 4) + (hexWidth / 2);
}
c.getUpdatedDisplayY = function(coords) {
	
	var displayY = 0;
	if(coords.isXOdd()){
		displayY = (hexHeight / 2) + (coords.y * hexHeight) + (hexHeight / 2);
	}
	else{
		displayY = coords.y * hexHeight + (hexHeight / 2);
	}
	
	if(useIsometric) {
		// shift the Y value up (negative) to match the displayed elevation for isometric view
		// by finding the Hex object and use its elevation to offset
		if(hexMap != null) {
			var thisHexRow = hexMap[coords.y];
			if(thisHexRow != null) {
				var thisHex = thisHexRow[coords.x];
				if(thisHex != null) {
					displayY -= (elevationHeight * thisHex.getElevation());
				}
			}
		}
	}
	
	return displayY;
}
c.getUpdatedDisplayRotation = function(heading) {
	return HEADING_ANGLE[heading];
}
c.animateUpdateDisplay = function(coords, heading, callFunction) {
	var newX = this.getUpdatedDisplayX(coords);
	var newY = this.getUpdatedDisplayY(coords);
	var actualRot = this.getUpdatedDisplayRotation(heading);
	
	var newRot = actualRot;
	if(this.rotateContainer.rotation == HEADING_ANGLE[HEADING_N] && newRot == HEADING_ANGLE[HEADING_NW]) {
		// fixes the issue where it tries to rotate the long way to go from N to NW (0->300)
		newRot = -60;
	}
	else if(this.rotateContainer.rotation == HEADING_ANGLE[HEADING_NW] && newRot == HEADING_ANGLE[HEADING_N]) {
		// fixes the issue where it tries to rotate the long way to go from NW to N (300->0)
		newRot = 360;
	}
	
	// use consistent animation time across the Tweens
	var aTime = 250;
	
	var self = this;
	createjs.Tween.get(this)
		.to({x: newX, y: newY}, aTime)
		.call(function() {
			// updating the UnitDisplay position only, since the rotation belongs to a container inside
			update = true;
			
			if(callFunction) {
				callFunction(self);
			}
		})
		.addEventListener("change", function() {
			update = true;
		});
	
	createjs.Tween.get(this.rotateContainer)
		.to({rotation: newRot}, aTime)
		.call(function() {
			// put the actual angle in after animated so it doesn't rotate the long way at a different angle
			this.rotation = actualRot;
			update = true;
		})
		.addEventListener("change", function() {
			update = true;
		});
	
	if(this.shadowUnitImage != null 
			&& this.shadowUnitImage.visible) {
		createjs.Tween.get(this.shadowUnitImage)
		.to({rotation: newRot}, aTime)
		.call(function() {
			// put the actual angle in after animated so it doesn't rotate the long way at a different angle
			this.rotation = actualRot;
			update = true;
		})
		.addEventListener("change", function() {
			update = true;
		});
	}
}

c.setUnitIndicatorVisible = function(visible) {
	this.uncache();
	if(this.indicator != null) {
		this.indicator.visible = visible;
	}
	
	this.doCache();
}

c.updateHeadingIndicator = function() {
	if(this.unit.isDestroyed()) {
		if(this.header != null) {
			this.header.visible = false;
			delete this.header;
		}
		
		return;
	}
	
	// draw heading indicator
	if(this.header == null) {
		this.header = new createjs.Shape();
		this.header.x = 0;
		this.header.y = 0;
		this.rotateContainer.addChildAt(this.header, 0);
	}
	this.header.graphics.clear();
	
	// TODO: allow customization of the unit heading color
	var color = null;
	if(isPlayerUnit(this.unit)) {
		color = "#3399FF";
	}
	else{
		color = "#FF0000";
	}
	
	var glowColor = shadeColor(color, 0.5);
	this.header.graphics.setStrokeStyle(2, "square").beginStroke(color).beginFill(glowColor)
			.moveTo(-5, -hexHeight/2 + 5)
			.lineTo(0, -hexHeight/2)
			.lineTo(5, -hexHeight/2 + 5)
			.endStroke();
	this.header.shadow = new createjs.Shadow(glowColor, 0, 0, 5);
}

c.updateUnitIndicator = function() {
	this.uncache();
	
	if(this.indicator != null) {
		createjs.Tween.removeTweens(this.indicator);
		this.rotateContainer.removeChild(this.indicator);
	}
	
	if(this.unit.isDestroyed()) {
		if(this.indicator != null) {
			this.indicator.visible = false;
			delete this.indicator;
			
			this.doCache();
		}
	}
	else if(isTurnUnit(this.unit)) {
		this.showTurnDisplay();
		
		// do not cache the object when using the animated turn indicator
	}
	else {
		this.indicator = new createjs.Shape();
		
		// TODO: allow customization of the unit indicator color
		var color = null;
		if(isPlayerUnit(this.unit)) {
			color = "#3399FF";
			this.indicator.graphics.setStrokeStyle(3, "round").beginStroke(color).drawCircle(0, 0, hexWidth/3-2).endStroke();
		}
		else{
			color = "#FF0000";
			this.indicator.graphics.setStrokeStyle(3, "round").beginStroke(color).drawPolyStar(0, 0, hexWidth/3, 4, 0.5, -90).endStroke();
		}
		
		// give the indicator a glow
		var glowColor = shadeColor(color, 0.75);
		this.indicator.shadow = new createjs.Shadow(glowColor, 0, 0, 5);
		
		this.rotateContainer.addChildAt(this.indicator, 1);
		
		this.doCache();
	}
}

c.showTurnDisplay = function(show) {
	
	this.indicator = new createjs.Shape();
	
	var color = null;
	if(isPlayerUnit(this.unit)) {
		color = "#3399FF";
		this.indicator.graphics.setStrokeStyle(2, "round").beginStroke(color).drawCircle(0, 0 ,hexWidth/10).endStroke();
	}
	else {
		color = "#FF0000";
		this.indicator.graphics.setStrokeStyle(2, "round").beginStroke(color).drawPolyStar(0, 0, hexWidth/8, 4, 0.5, -90).endStroke();
	}
	
	// give the indicator a glow
	var glowColor = shadeColor(color, 0.75);
	this.indicator.shadow = new createjs.Shadow(glowColor, 0, 0, 5);
	
	this.rotateContainer.addChildAt(this.indicator, 1);
	
	createjs.Tween.get(this.indicator, { loop: true})
		.to({alpha: 0.75, scaleX: 2.5, scaleY: 2.5}, 750)
		.to({alpha: 0.25, scaleX: 3.5, scaleY: 3.5}, 500)
		.addEventListener("change", function() {
			update = true;
		});
}

c.doCache = function() {
	if(cacheUnits) this.cache(-hexWidth/2-5,-hexHeight/2-5, hexWidth+5,hexHeight+5);
}

c.toString = function() {
	return "[UnitDisplay@"+this.x+","+this.y+": "+this.unit+"]";
}

window.UnitDisplay = createjs.promote(UnitDisplay, "Container");
}());