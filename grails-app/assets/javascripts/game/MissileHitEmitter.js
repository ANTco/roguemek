/**
 * Creates a proton particle emitter for the effect of being hit by a missile
 */
(function() {
"use strict";

function MissileHitEmitter(impactPoint, msDuration) {
	this.Container_constructor();
	
	this.duration = (msDuration/1000);
	
	this.x = impactPoint.x;
	this.y = impactPoint.y;
	this.proton = null;
	this.emitter = null;
	
	this.setup();
}
var c = createjs.extend(MissileHitEmitter, createjs.Container);

c.setup = function() {
	
	stage.addChild(this);
	
	var colors = [
  	    new createjs.Bitmap(queue.getResult("particle-red")),
  	    new createjs.Bitmap(queue.getResult("particle-orange")),
  	    new createjs.Bitmap(queue.getResult("particle-yellow"))
  	];
	
	var proton = new Proton();
	var emitter = new Proton.Emitter();
	//set Rate
	emitter.rate = new Proton.Rate(Proton.getSpan(5, 10), 0.01);
	//add Initialize
	emitter.addInitialize(new Proton.ImageTarget(colors));
	emitter.addInitialize(new Proton.Life(0.35, 0.75));
	emitter.addInitialize(new Proton.Velocity(0.4, Proton.getSpan(0, 360), 'polar'));
	//add Behaviour
	emitter.addBehaviour(new Proton.Alpha(1, 0.75));
	emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.3, 0.4), 0.1));
	
	//set emitter position
	emitter.p.x = 0;
	emitter.p.y = 0;
	emitter.emit(this.duration);
	//add emitter to the proton
	proton.addEmitter(emitter);
	// add canvas renderer
	var renderer = new Proton.Renderer('easeljs', proton, this);
	renderer.start();
	
	this.proton = proton;
	this.emitter = emitter;
	
	this.on("tick", this.update);
};

c.update = function() {
	if(this.proton) {
		this.proton.update();
	}
};

window.MissileHitEmitter = createjs.promote(MissileHitEmitter, "Container");
}());
