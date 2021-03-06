/**
 * Class for displaying each Unit in a displayed list
 */
(function() {
"use strict";

var BORDER_WIDTH = 3;

function ListUnitDisplay(unitDisplay) {
	this.Container_constructor();
	
	this.unitDisplay = unitDisplay;
	this.unit = unitDisplay.getUnit();
	this.image = unitDisplay.getImage();
	
	this.background = null;
	this.foreground = null;
	this.armorBar = null;
	this.scale = 0.5;
	
	this.isTargetDisplay = false;
}
var c = createjs.extend(ListUnitDisplay, createjs.Container);

c.init = function() {
	this.scaleX = this.scale;
	this.scaleY = this.scale;
	
	// create background shape with color
	this.background = new createjs.Shape();
	this.background.alpha = Settings.get(Settings.UI_OPACITY);
	this.addChild(this.background);
	
	// create foreground shape for the outline
	this.foreground = new createjs.Shape();
	this.addChild(this.foreground);
	
	// load the unit image as a Bitmap
	var unitImg = new createjs.Bitmap(this.image);
	this.addChild(unitImg);
	
	// create armor bar with total percent of armor/internals remaining
	this.armorBar = new createjs.Shape();
	this.armorBar.x = 0;
	this.armorBar.y = 0;
	this.addChild(this.armorBar);
	
	this.setSelected(isTurnUnit(this.unit));
	this.update();
}

c.update = function() {
	this.updateArmorBar(false);
}

c.updateArmorBar = function(doAnimate) {
	if(this.unit == null || this.unit.initialArmor == null) return;
	
	this.uncache();
	this.armorBar.graphics.clear();
	
	var currentArmor = 0;
	var totalArmor = 0;
	
	for(var index=0; index<this.unit.initialArmor.length; index++){
		var initialArmor = this.unit.initialArmor[index];
		var thisArmor = this.unit.armor[index];
		
		currentArmor += thisArmor;
		totalArmor += initialArmor;
	}
	
	for(var index=0; index<this.unit.initialInternals.length; index++){
		var initialInternal = this.unit.initialInternals[index];
		var thisInternal = this.unit.internals[index];
		
		currentArmor += thisInternal;
		totalArmor += initialInternal;
	}
	
	var borderColor = Settings.get(Settings.UI_FG_COLOR);
	if(this.unit.isDestroyed()) {
		// unit is destroyed, show 0% and red outline
		currentArmor = 0;
		borderColor = "#FF0000";
	}
	
	var percentArmor = (currentArmor/totalArmor);
	
	// use different color as percent changes
	var barColor = "#3498DB";
	if(percentArmor <= 0.35) {
		barColor = "#FF0000"
	}
	else if(percentArmor <= 0.65) {
		barColor = "#5D79CA"
	}
	
	this.armorBar.graphics.beginFill(barColor)
			.drawRect(this.image.width/8, 10*this.image.height/12, percentArmor * (6*this.image.width/8), this.image.height/8)
			.endFill()
			.setStrokeStyle(2, "round").beginStroke(borderColor)
			.drawRect(this.image.width/8, 10*this.image.height/12, 6*this.image.width/8, this.image.height/8)
			.endStroke();
	
	createjs.Tween.removeTweens(this);
	if(doAnimate && percentArmor > 0 && percentArmor < 1) {
		createjs.Tween.get(this)
				.to({alpha: 0.5}, 250)
				.to({alpha: 1.0}, 250)
				.to({alpha: 0.5}, 250)
				.to({alpha: 1.0}, 250)
				.to({alpha: 0.5}, 250)
				.to({alpha: 1.0}, 250)
				.call(callDoCache, null, this)
				.addEventListener("change", function() {
					update = true;
				});
	}
}

c.setSelected = function(selected, isOtherUnit, surroundSelect) {
	this.uncache();
	this.foreground.graphics.clear();
	this.background.graphics.clear();
	
	this.background.alpha = Settings.get(Settings.UI_OPACITY);
	
	var strokeColor;
	if(isPlayerUnit(this.unit)){
		strokeColor = Settings.get(Settings.UI_PLAYER_COLOR);
	}
	else if(isTeamUnit(this.unit)) {
		strokeColor = Settings.get(Settings.UI_FRIENDLY_COLOR);
	}
	else {
		strokeColor = Settings.get(Settings.UI_ENEMY_COLOR);
	}
	
	if(selected){
		if(surroundSelect) {
			// draw a selection border around entire display square
			this.background.graphics.beginFill(Settings.get(Settings.UI_BG_COLOR))
					.drawRect(0, 0, this.image.width, this.image.height)
					.endFill();
			this.foreground.graphics.setStrokeStyle(BORDER_WIDTH*3, "square").beginStroke(strokeColor)
					.drawRect(0, 0, this.image.width, this.image.height)
					.endStroke();
		}
		else {
			// draw a selection border only for the left and top display corner
			this.background.graphics.beginFill(Settings.get(Settings.UI_BG_COLOR))
					.drawRect(0, 0, this.image.width, this.image.height)
					.endFill();
			this.foreground.graphics.setStrokeStyle(BORDER_WIDTH*3, "square").beginStroke(strokeColor)
					.moveTo(0, this.image.height - BORDER_WIDTH*3/2)
					.lineTo(0, 0)
					.lineTo(this.image.width - BORDER_WIDTH*3/2, 0)
					.endStroke();
		}
		
	}
	else{
		this.background.graphics.setStrokeStyle(BORDER_WIDTH, "square").beginStroke(Settings.get(Settings.UI_FG_COLOR))
				.drawRect(0, 0, this.image.width, this.image.height);
				
		if(surroundSelect) {
			// draw a line just on top to indicate player/friendly/enemy
			this.foreground.graphics.setStrokeStyle(BORDER_WIDTH*2, "square").beginStroke(strokeColor)
					.moveTo(BORDER_WIDTH, 0)
					.lineTo(this.image.width - BORDER_WIDTH, 0)
					.endStroke();
		}
	}
	
	this.doCache();
}

c.getDisplayWidth = function() {
	return this.image.width * this.scale;
}

c.getDisplayHeight = function() {
	return this.image.height * this.scale;
}

c.doCache = function() {
	if(Settings.get(Settings.GFX_CACHING) < Settings.GFX_QUALITY) {
		// no caching at only the highest quality setting
		this.cache(-BORDER_WIDTH, -BORDER_WIDTH, 
				3*BORDER_WIDTH + this.image.width, 3*BORDER_WIDTH + this.image.height);
	}
}

c.getUnitId = function() {
	if(this.unit != null) {
		return this.unit.id;
	}
	return null;
}

c.toString = function() {
	return "[ListUnitDisplay@"+this.x+","+this.y+"]";
}

window.ListUnitDisplay = createjs.promote(ListUnitDisplay, "Container");
}());
