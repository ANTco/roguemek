package roguemek.game

import java.util.ArrayList;

import grails.transaction.Transactional
import roguemek.model.*

@Transactional
class GameService {
	
	/**
	 * Starts the game so it is ready to play the first turn
	 */
	public def initializeGame(Game game) {
		if(game.gameState != Game.GAME_INIT) return
		
		game.gameState = Game.GAME_ACTIVE
		game.gameTurn = 0
		
		// TODO: perform initiative roll on first and every 4 turns after to change up the order of the units turn
		// game.units...
		game.unitTurn = 0
		
		// get the first unit ready for its turn
		initializeTurnUnit(game)
		
		game.save flush: true
	}
	
	/**
	 * Starts the next unit's turn
	 * @return
	 */
	public def initializeNextTurn(Game game) {
		game.unitTurn ++
		// TODO: account for destroyed units
		
		if(game.unitTurn >= game.units.size()) {
			game.gameTurn ++
			game.unitTurn = 0
		}
		
		// update the next unit for its new turn
		initializeTurnUnit(game)
		
		game.save flush: true
		
		// TODO: return and add game message about the next unit's turn
		BattleUnit turnUnit = game.units.get(game.unitTurn)
		def data = [
			turnUnit: turnUnit.id,
			actionPoints: turnUnit.actionPoints,
		]
		
		Date update = GameMessage.addMessageUpdate(game, "New turn for Unit "+turnUnit, data)
		
		return data
	}
	
	/**
	 * Initializes the unit for its next turn (updates AP, heat, etc.)
	 * @return
	 */
	private def initializeTurnUnit(Game game) {
		BattleUnit unit = game.units.get(game.unitTurn)
		// TODO: generate actual amount of AP/JP per turn
		unit.actionPoints = 3
		unit.jumpPoints = 0
		
		// TODO: update unit.heat value based on heat sinks and current heat amount
		// unit.heat = ...
		
		unit.damageTakenThisTurn = 0
		
		unit.save flush: true
	}
	
	/**
	 * Gets all applicable data for the board HexMap object that can be turned into JSON for initializing the client
	 * @return
	 */
	public def getHexMapRender(Game game) {
		HexMap board = game?.board
		
		def hexList = []
		board.hexMap?.each { hexId ->
			Hex h = Hex.get(hexId)
			hexList.add(h?.getHexRender())
		}
		
		def hexMapRender = [
			numCols: board.numCols,
			numRows: board.numRows,
			hexMap: hexList
		]
		
		return hexMapRender
	}
	
	/**
	 * Gets all applicable data for all units that can be turned into JSON for initializing the client
	 * @return
	 */
	public def getUnitsRender(Game game) {
		def unitsRender = []
		
		game.units?.each { BattleUnit u ->
			
			def armor = null
			def internals = null
			def chassisVariant = null
			def crits = null
			
			if(u instanceof BattleMech) {
				Mech m = u.mech
				chassisVariant = (m == null) ?: m.chassis+"-"+m.variant
				
				armor = []
				if(u.armor != null) {
					int armorSize = u.armor.size();
					for(int i=0; i<armorSize; i++) {
						armor[i] = u.armor[i]
					}
				}
				
				internals = []
				if(u.internals != null) {
					int internalSize = u.internals.size()
					for(int i=0; i<internalSize; i++) {
						internals[i] = u.internals[i]
					}
				}
				
				crits = getCritsRender(u)
			}
			
			def uRender = [
				unit: u.id,
				callsign: u.pilot?.ownerUser?.callsign,
				name: u.mech?.name,
				chassisVariant: chassisVariant,
				mass: u.mech?.mass,
				x: u.x,
				y: u.y,
				heading: u.heading,
				status: String.valueOf(u.status),
				actionPoints: u.actionPoints,
				jumpPoints: u.jumpPoints,
				heat: u.heat,
				armor: armor,
				internals: internals,
				crits: crits,
				image: u.image,
				rgb: [u.rgb[0], u.rgb[1], u.rgb[2]]
			]
			
			unitsRender.add(uRender)
		}
		
		return unitsRender
	}
	
	/**
	 * Gets each critical slot into a form that can be turned into JSON for the client
	 * @return
	 */
	public def getCritsRender(BattleUnit u) {
		if(u == null) return null
		
		def critsRender = []
		if(u instanceof BattleMech) {
			for(int i=0; i<u.crits.size(); i++) {
				critsRender[i] = getEquipmentRender(BattleEquipment.get(u.crits[i]))
			}
		}
		
		return critsRender
	}
	
	/**
	 * Gets a JSON compatible form of Equipment data for the client
	 * @param equip
	 * @return
	 */
	public def getEquipmentRender(BattleEquipment equip) {
		if(equip == null) return null
		
		Equipment e = equip.equipment
		
		// Basic Equipment stuff first
		def equipRender = [
			id: equip.id,	// TODO: BattleEquipment initialization will need to be changed so equipment taking >1 slots point to same id
			name: e.name,
			shortName: e.shortName,
			location: equip.location,
			status: String.valueOf(equip.status),
			type: "Equipment"
		]
		
		if(e instanceof HeatSink) {
			equipRender.type = "HeatSink"
			equipRender.dissipation = e.dissipation
		}
		
		if(e instanceof Ammo) {
			equipRender.type = "Ammo"
			equipRender.ammoPerTon = e.ammoPerTon
			equipRender.ammoExplosive = e.explosive
		}
		if(equip instanceof BattleAmmo) {
			equipRender.ammoRemaining = equip.ammoRemaining
		}
		
		if(e instanceof Weapon) {
			equipRender.type = "Weapon"
			equipRender.weaponType = e.weaponType;
			equipRender.damage = e.damage
			equipRender.heat = e.heat
			equipRender.cycle = e.cycle
			equipRender.projectiles = e.projectiles
			equipRender.minRange = e.minRange
			equipRender.shortRange = e.shortRange
			equipRender.mediumRange = e.mediumRange
			equipRender.longRange = e.longRange
			// TODO: model e.ammoTypes as something the client can associate or determine ammoRemains by Weapon instead?
		}
		if(equip instanceof BattleWeapon) {
			equipRender.cooldown = equip.cooldown
		}
		
		if(e instanceof JumpJet) {
			equipRender.type = "JumpJet"
		}
		
		return equipRender
	}
	
	/**
	 * Moves the unit in a forward/backward direction
	 * @param unit
	 * @param forward
	 * @param jumping
	 * @return
	 */
	public def move(Game game, BattleUnit unit, boolean forward, boolean jumping) {
		if(unit.actionPoints == 0) return
		
		// TODO: make sure it is the unit's turn first, otherwise issue return a message with no action
		
		// TODO: make sure the terrain can be entered and use proper amount of actionPoints
		unit.actionPoints -= 1
				
		def moveHeading = forward ? unit.heading : ((unit.heading + 3) % 6)
		
		// When ready to move, set the new location of the unit
		BattleUnit.setLocation(unit, GameService.getForwardCoords(game, unit.getLocation(), moveHeading))
		// deepValidate needs to be false otherwise it thinks a subclass like BattleMech is missing its requirements
		unit.save flush: true, deepValidate: false
		
		def data = [
			unit: unit.id,
			x: unit.x,
			y: unit.y,
			actionPoints: unit.actionPoints
		]
		
		Date update = GameMessage.addMessageUpdate(game, "Unit "+unit+" moved to "+unit.x+","+unit.y, data)
		
		if(unit.actionPoints == 0) {
			// automatically end the unit's turn if it has run out of AP
			this.initializeNextTurn(game)
		}
		
		return data
	}
	
	/**
	 * Rotates the unit to the given heading
	 * @param unit
	 * @param newHeading
	 * @param jumping
	 * @return
	 */
	public def rotateHeading(Game game, BattleUnit unit, int newHeading, boolean jumping){
		if(unit.actionPoints == 0) return
		
		// TODO: make sure it is the unit's turn first, otherwise issue return a message with no action
		
		// use an actionPoint
		unit.actionPoints -= 1
		
		// When ready to rotate, set the new location of the unit
		unit.setHeading(newHeading);
		// deepValidate needs to be false otherwise it thinks a subclass like BattleMech is missing its requirements
		unit.save flush: true, deepValidate: false
		
		def data = [
			unit: unit.id,
			heading: unit.heading,
			actionPoints: unit.actionPoints
		]
		
		Date update = GameMessage.addMessageUpdate(game, "Unit "+unit+" rotated to heading "+unit.heading, data)
		
		if(unit.actionPoints == 0) {
			// automatically end the unit's turn if it has run out of AP
			this.initializeNextTurn(game)
		}
		
		return data
	}
	
	/**
	 * Rotates the given unit's heading Clockwise
	 * @param unit
	 * @param jumping
	 * @return
	 */
	public def rotateHeadingCW(Game game, BattleUnit unit, boolean jumping){
		return this.rotateHeading(game, unit, GameService.getRotateHeadingCW(unit.heading), jumping);
	}
	
	/**
	 * Returns the Clockwise heading relative to the given heading
	 * @param heading
	 * @return
	 */
	public static int getRotateHeadingCW(heading){
		return (heading + 1) % 6;
	}
	
	/**
	 * Rotates the given unit's heading Counter Clockwise
	 * @param unit
	 * @param jumping
	 * @return
	 */
	public def rotateHeadingCCW(Game game, BattleUnit unit, boolean jumping){
		return this.rotateHeading(game, unit, GameService.getRotateHeadingCCW(unit.heading), jumping);
	}
	
	/**
	 * Returns the Counter Clockwise heading relative to the given heading
	 * @param heading
	 * @return
	 */
	public static int getRotateHeadingCCW(heading){
		return (heading + 5) % 6;
	}
	
	/**
	 * Gets the coordinate of the hex that would be in front of the given coordinates+heading
	 * @param fromCoords
	 * @param heading
	 * @return
	 */
	public static Coords getForwardCoords(Game game, Coords fromCoords, int heading) {
		HexMap board = game?.board;
		if(board == null) return null
		
		def x = fromCoords.x;
		def y = fromCoords.y;
		
		def newXY = new Coords(x, y);
		switch(heading){
			case BattleUnit.HEADING_N:
				if(y > 0){
					newXY = new Coords(x,y-1);
				}
				break;
				
			case BattleUnit.HEADING_NE:
				if(x % 2 == 0 && x < board.numCols - 1 && y > 0){
					newXY = new Coords(x+1,y-1);
				}
				else if(x % 2 != 0 && x < board.numCols - 1){
					newXY = new Coords(x+1,y);
				}
				break;
				
			case BattleUnit.HEADING_SE:
				if(x % 2 == 0 && x < board.numCols - 1){
					newXY = new Coords(x+1,y);
				}
				else if(x % 2 != 0 && x < board.numCols - 1 && y < board.numRows - 1){
					newXY = new Coords(x+1,y+1);
				}
				break;
				
			case BattleUnit.HEADING_S:
				if(y < board.numRows - 1){
					newXY = new Coords(x,y+1);
				}
				break;
				
			case BattleUnit.HEADING_SW:
				if(x % 2 == 0 && x > 0){
					newXY = new Coords(x-1,y);
				}
				else if(x % 2 != 0 && x > 0 && y < board.numRows - 1){
					newXY = new Coords(x-1,y+1);
				}
				break;
				
			case BattleUnit.HEADING_NW:
				if(x % 2 == 0 && x > 0 && y > 0){
					newXY = new Coords(x-1,y-1);
				}
				else if(x % 2 != 0 && x > 0){
					newXY = new Coords(x-1,y);
				}
				break;
		}
		
		return newXY;
	}
	
	/**
	 * Fires a weapon at the target
	 * @param unit
	 * @param weapon
	 * @param target
	 * @return
	 */
	public def fireWeaponsAtUnit(Game game, BattleUnit unit, ArrayList weapons, BattleUnit target) {
		if(unit.actionPoints == 0) return
		
		// TODO: make sure it is the unit's turn first, otherwise issue return a message with no action
		
		// use an actionPoint
		unit.actionPoints -= 1
		
		def data
		
		for(BattleWeapon weapon in weapons) {
			// TODO: determine toHit using unit, weapon, and target combat variables
			boolean weaponHit = true
			
			String message
			data = [
				unit: unit.id,
				target: target.id,
				actionPoints: unit.actionPoints,
				weaponHit: weaponHit
			]
			
			if(weaponHit) {
				data.armorHit = []
				
				// TODO: determine hit location based on relative position of the attack on the target
				int hitLocation = Mech.FRONT_HIT_LOCATIONS[new Random().nextInt(12)]
				
				if(target instanceof BattleMech) {
					BattleMech t = BattleMech.get(target.id)
					
					int armorRemains = t.armor[hitLocation]
					armorRemains -= weapon.getDamage()
					
					if(armorRemains < 0) {
						// internals take leftover damage
						data.internalsHit = []
						
						// TODO: handle internal damage transfer from REAR hit locations
						int internalRemains = t.internals[hitLocation]
						internalRemains += armorRemains
						
						armorRemains = 0
						if(internalRemains < 0) {
							// TODO: implement damage transfer from hit locations that are already destroyed internally
							internalRemains = 0
						}
						
						t.internals[hitLocation] = internalRemains
						
						// add the response location and remaining points of the hit internal section
						data.internalsHit[hitLocation] = internalRemains
					}
					
					t.armor[hitLocation] = armorRemains
					
					// add the response location and remaining points of the hit armor section
					data.armorHit[hitLocation] = armorRemains
					
					t.save flush:true
					
					// set the message of the result
					message = ""+unit+" hit "+target+" with "+weapon.getShortName()+" for "+weapon.getDamage();
				}
			}
			else {
				// set the message of the result
				message = ""+unit+" missed "+target+" with "+weapon.getShortName()
			}
			
			// TODO: if applicable, consume ammo
			
			Date update = GameMessage.addMessageUpdate(game, message, data)
		}
		
		// automatically end the unit's turn after firing
		this.initializeNextTurn(game)
		
		// TODO: handle returning all of the individual data arrays instead of just the last
		return data
	}
}