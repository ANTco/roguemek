/**
 * Class for displaying a scrolling messages and chat area
 */
(function() {
"use strict";

var DEFAULT_WIDTH = 1000;
var DEFAULT_HEIGHT = 75;

function MessagingDisplay() {
	this.Container_constructor();
	
	this.width = DEFAULT_WIDTH;
	this.height = DEFAULT_HEIGHT;
	
	this.background = null;
	this.messagingElement = null;
}
var c = createjs.extend(MessagingDisplay, createjs.Container);

c.init = function() {
	this.background = new createjs.Shape();
	this.background.alpha = 0.75;
	this.addChild(this.background);
	
	this.messagingElement = this.makeTextArea("messagingArea");
	
	this.update()
}

c.makeTextArea = function(id) {
	// create and populate element
	var e = document.getElementById(id);
	e.readOnly = true;
	e.style.left = 0;
	e.style.top = 0;
	e.style.overflow = "auto";
	e.style.overflowX = "hidden";
	// attach element to stage
	document.body.appendChild(e);
	
	var content = new createjs.DOMElement(e);
	
	return this.addChild(content);
}

c.update = function() {
	this.width = DEFAULT_WIDTH;
	this.height = DEFAULT_HEIGHT;
	if(canvas.width < this.width) {
		this.width = canvas.width;
	}
	
	this.x = canvas.width - this.width;
	this.y = 0;
	
	this.background.graphics.clear();
	this.background.graphics.beginFill("#404040")
			.drawRect(0, 0, this.width, this.height);
	
	this.messagingElement.htmlElement.style.width = this.width + "px";
	this.messagingElement.htmlElement.style.height = this.height + "px";
	
	// Do NOT cache this object, it causes massive frameloss on slow tablets 
	//this.cache(0,0, this.width,this.height);
}

c.addMessage = function(message, scrollToBottom) {
	if(message != null && message.length > 0) { 
		this.messagingElement.htmlElement.innerHTML += "&#13;&#10;"+message;
	}
	
	if(scrollToBottom) {
		this.messagingElement.htmlElement.scrollTop = this.messagingElement.htmlElement.scrollHeight;
	}
}

window.MessagingDisplay = createjs.promote(MessagingDisplay, "Container");
}());