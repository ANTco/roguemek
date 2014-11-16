/**
 * animations.js - Animation related methods for the UI
 */

/**
 * handles the display of animated projectiles and related animated messages from weapon fire
 * @param hit set true if the weapon hit
 */
function animateWeaponFire(srcUnit, weapon, tgtUnit, hitLocations) {
	
	var thisHitLocation;
	if(hitLocations != null) {
		$.each(hitLocations, function(loc, damage) {
			if(damage != null && damage > 0) {
				thisHitLocation = loc;
			}
		});
	}
	
	if(weapon.isClusterWeapon()) {
		animateClusterProjectile(srcUnit, weapon, tgtUnit, hitLocations);
	}
	else if(weapon.isBallisticWeapon()) {
		animateBurstProjectile(srcUnit, weapon, tgtUnit, thisHitLocation);
	}
	else {
		animateProjectile(srcUnit, weapon, tgtUnit, thisHitLocation);
	}
}

/**
 * Creates multiple projectiles with slight variations on the target position for effect
 */
function animateClusterProjectile(srcUnit, weapon, tgtUnit, hitLocations){
	// spawn off more projectiles in slightly different target locations
	var numProjectiles = weapon.getProjectiles();
	
	// TODO: determine actual location for each projectile
	var thisHitLocation;
	if(hitLocations != null) {
		$.each(hitLocations, function(loc, damage) {
			if(damage != null && damage > 0) {
				thisHitLocation = loc;
			}
		});
	}
	
	for(var i=0; i<numProjectiles; i++){
		// TODO: determine actual number that hit or missed
		
		var initialDelay = 0;
		// only add in small delay for LRM launches
		if(weapon.isLRM()) {
			initialDelay = i * 50;
		}
		
		lastAnimationIndex = animateProjectile(srcUnit, weapon, tgtUnit, thisHitLocation, initialDelay);
	}
}

/**
 * Creates multiple projectiles which follow each other in the same linear path for effect
 */
function animateBurstProjectile(srcUnit, weapon, tgtUnit, hitLocation){
	var burstProjectiles = 3;

	for(var i=0; i<burstProjectiles; i++){
		var initialDelay = i * 100;
		lastAnimationIndex = animateProjectile(srcUnit, weapon, tgtUnit, hitLocation, initialDelay);
	}
}

/**
 * Animates a single weapon projectile to be fired at the target
 * @param srcUnit
 * @param weapon
 * @param tgtUnit
 * @param hitLocation
 */
function animateProjectile(srcUnit, weapon, tgtUnit, hitLocation, initialDelay) {
	var hit = (hitLocation != null);
	
	if(initialDelay == null || initialDelay < 0) {
		initialDelay = 0;
	}
	
	var wName = weapon.shortName;
	
	var srcPoint = new Point(srcUnit.displayUnit.x, srcUnit.displayUnit.y);
	var weaponPoint = getPositionFromLocationAngle(srcPoint, srcUnit.heading, weapon.location);
	
	var targetPoint = new Point(tgtUnit.displayUnit.x, tgtUnit.displayUnit.y);
	
	if(weapon.isClusterWeapon()){
		// give cluster projectiles a tiny variation in the source and target pixel position for effect
		var randomPosNegX = (getDieRollTotal(1, 2) == 1) ? 1 : -1;
		var randomPosNegY = (getDieRollTotal(1, 2) == 1) ? 1 : -1;

		var randomOffsetX = getDieRollTotal(1, 4) * randomPosNegX;
		var randomOffsetY = getDieRollTotal(1, 4) * randomPosNegY;
		
		weaponPoint.x += randomOffsetX;
		weaponPoint.y += randomOffsetY;
	
		// now for the target variation
		randomPosNegX = (getDieRollTotal(1, 2) == 1) ? 1 : -1;
		randomPosNegY = (getDieRollTotal(1, 2) == 1) ? 1 : -1;

		randomOffsetX = getDieRollTotal(1, 16) * randomPosNegX;
		randomOffsetY = getDieRollTotal(1, 16) * randomPosNegY;
		
		targetPoint.x += randomOffsetX;
		targetPoint.y += randomOffsetY;
	}
	
	// determine the end point of the projectile based on whether it hit or missed
	var weaponEndPoint;
	if(hit) {
		weaponEndPoint = getPositionFromLocationAngle(targetPoint, tgtUnit.heading, hitLocation);
	}
	else{
		// randomize the angle and distance of a miss
		var randomPosNegAngle = (getDieRollTotal(1, 2) == 1) ? 1 : -1;
		
		var randomAngleOffset = getDieRollTotal(1, 12) * randomPosNegAngle;
		var randomDistanceOffset = getDieRollTotal(4, 20);
		
		var distance = getDistanceToTarget(weaponPoint.x, weaponPoint.y, targetPoint.x, targetPoint.y) + randomDistanceOffset;
		var angle = getAngleToTarget(weaponPoint.x, weaponPoint.y, targetPoint.x, targetPoint.y) + randomAngleOffset;
		
		weaponEndPoint = getMovementDestination(weaponPoint.x, weaponPoint.y, distance, angle);
	}
	
	if(weapon.isEnergyWeapon()) {
		if(wName == WeaponSLAS 
				|| wName == WeaponMLAS 
				|| wName == WeaponLLAS ){
			// create a laser beam
			var laser = new Projectile(weaponPoint.x, weaponPoint.y);
			laser.visible = false;
			laser.graphics.setStrokeStyle(3).beginStroke("#FF0000").moveTo(0, 0).lineTo(weaponEndPoint.x-laser.x, weaponEndPoint.y-laser.y).endStroke();
			laser.graphics.setStrokeStyle(1).beginStroke("#990000").moveTo(0, 0).lineTo(weaponEndPoint.x-laser.x, weaponEndPoint.y-laser.y).endStroke();
			stage.addChild(laser);
			
			createjs.Tween.get(laser).wait(initialDelay).to({visible:true}).wait(400).to({alpha:0}, 200).call(removeThisFromStage, null, laser);
		}
		else if(wName == WeaponPPC) {
			// create a PPC projectile as lightning
			var lightning = new Lightning();
			lightning.show(weaponPoint.x, weaponPoint.y, weaponEndPoint.x, weaponEndPoint.y);
			stage.addChild(lightning);
			
			createjs.Tween.get(lightning).to({visible:true}).wait(400).to({alpha:0}, 200).call(removeThisFromStage, null, lightning);
		}
		else if(wName == WeaponFlamer) {
			// TODO: Flamer projectile from http://thecodeplayer.com/walkthrough/html5-canvas-experiment-a-cool-flame-fire-effect-using-particles
			/*
			 	window.onload = function(){
				var canvas = document.getElementById("canvas");
				var ctx = canvas.getContext("2d");
				
				//Make the canvas occupy the full page
				var W = window.innerWidth, H = window.innerHeight;
				canvas.width = W;
				canvas.height = H;
				
				var particles = [];
				var mouse = {};
				
				//Lets create some particles now
				var particle_count = 100;
				for(var i = 0; i < particle_count; i++)
				{
					particles.push(new particle());
				}
				
				//finally some mouse tracking
				canvas.addEventListener('mousemove', track_mouse, false);
				
				function track_mouse(e)
				{
					//since the canvas = full page the position of the mouse 
					//relative to the document will suffice
					mouse.x = e.pageX;
					mouse.y = e.pageY;
				}
				
				function particle()
				{
					//speed, life, location, life, colors
					//speed.x range = -2.5 to 2.5 
					//speed.y range = -15 to -5 to make it move upwards
					//lets change the Y speed to make it look like a flame
					this.speed = {x: -Math.random()*5, y: 0};
					//location = mouse coordinates
					//Now the flame follows the mouse coordinates
					if(mouse.x && mouse.y)
					{
						this.location = {x: mouse.x, y: mouse.y};
					}
					else
					{
						this.location = {x: W/2, y: H/2};
					}
					//radius range = 10-30
					this.radius = 10+Math.random()*20;
					//life range = 20-30
					this.life = 20+Math.random()*10;
					this.remaining_life = this.life;
					//colors
					this.r = Math.round(Math.random()*255);
					this.g = Math.round(Math.random()*25);
					this.b = Math.round(Math.random()*5);
				}
				
				function draw()
				{
					//Painting the canvas black
					//Time for lighting magic
					//particles are painted with "lighter"
					//In the next frame the background is painted normally without blending to the 
					//previous frame
					ctx.globalCompositeOperation = "source-over";
					ctx.fillStyle = "black";
					ctx.fillRect(0, 0, W, H);
					ctx.globalCompositeOperation = "lighter";
					
					for(var i = 0; i < particles.length; i++)
					{
						var p = particles[i];
						ctx.beginPath();
						//changing opacity according to the life.
						//opacity goes to 0 at the end of life of a particle
						p.opacity = Math.round(p.remaining_life/p.life*100)/100
						//a gradient instead of white fill
						var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
						gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
						gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
						gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
						ctx.fillStyle = gradient;
						ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
						ctx.fill();
						
						//lets move the particles
						p.remaining_life--;
						p.radius--;
						p.location.x += p.speed.x;
						p.location.y += p.speed.y;
						
						//regenerate particles
						if(p.remaining_life < 0 || p.radius < 0)
						{
							//a brand new particle replacing the dead one
							particles[i] = new particle();
						}
					}
				}
				
				setInterval(draw, 33);
			}
			 */
		}
	}
	else if(weapon.isBallisticWeapon()) {
		
		var projectileWidth = 1;
		var projectileLength = 1;
		
		if(wName == WeaponAC20 
				|| wName == WeaponAC10 
				|| wName == WeaponAC5
				|| wName == WeaponAC2
				|| wName == WeaponMGUN){
			// for ACs and Machine guns use lines of a given width and length as tracers
			if(wName == WeaponAC20){
				projectileWidth = 3;
				projectileLength = 20;
			}
			else if(wName == WeaponAC10){
				projectileWidth = 2.5;
				projectileLength = 15;
			}
			else if(wName == WeaponAC5){
				projectileWidth = 2;
				projectileLength = 10;
			}
			else if(wName == WeaponAC2){
				projectileWidth = 1;
				projectileLength = 10;
			}
			else if(wName == WeaponMGUN){
				projectileWidth = 1;
				projectileLength = 5;
			}
			
			var angle = getAngleToTarget(weaponPoint.x, weaponPoint.y, weaponEndPoint.x, weaponEndPoint.y);
			var point = getMovementDestination(0, 0, projectileLength, angle);
			var projectile = new Projectile(weaponPoint.x, weaponPoint.y);
			projectile.visible = false;
			projectile.graphics.setStrokeStyle(projectileWidth).beginStroke("#FFD700").moveTo(0, 0).lineTo(point.x, point.y).endStroke();
			stage.addChild(projectile);
			
			createjs.Tween.get(projectile).wait(initialDelay).to({visible:true}).to({x:weaponEndPoint.x, y:weaponEndPoint.y}, 500).call(removeThisFromStage, null, projectile);
		}
	}
	else if(weapon.isMissileWeapon()) {
		var isLRM = weapon.isLRM();
		var isSRM = weapon.isSRM();
		
		var projectileRadius = 1;
		
		if(isLRM) {
			projectileRadius = 1.25;
		}
		else if(isSRM) {
			projectileRadius = 1.5;
		}
		
		var missile = new Projectile(weaponPoint.x, weaponPoint.y);
		missile.visible = false;
		missile.graphics.beginStroke("#FFFFFF").beginFill("#FFFFFF").drawCircle(0, 0, projectileRadius).endStroke();
		stage.addChild(missile);
		
		createjs.Tween.get(missile).wait(initialDelay).to({visible:true}).to({x:weaponEndPoint.x, y:weaponEndPoint.y}, 500).call(removeThisFromStage, null, missile);
	}
}