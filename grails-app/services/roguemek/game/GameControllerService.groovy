package roguemek.game

import grails.transaction.Transactional

@Transactional
class GameControllerService {
	GameService gameService
	
	/**
	 * Handles the constant long polling from each client to await updates to the game.
	 * @return The map of messages to be converted to JSON at the controller back to the client.
	 */
	public def performPoll(Game game, Pilot pilot) {
		Date lastUpdate = pilot.lastUpdate
		
		int tries = 0
		
		while(true) {
			if(tries >= 50) {
				// give up and respond with no data after so many tries otherwise
				// the client will assume the worst and start a new poll thread
				break
			}
			
			ArrayList updates = GameMessage.getMessageUpdates(lastUpdate, game)
			
			// set the pilot last update time to the last message's time
			if(updates != null && !updates.isEmpty()) {
				log.info("UPDATES: "+updates)
				
				lastUpdate = new Date(updates.last().getTime())
				pilot.lastUpdate = lastUpdate
				pilot.save flush: true
				
				return [date: lastUpdate, updates: updates]
			}
			
			tries ++
			Thread.sleep(500)
		}
		
		return [date: lastUpdate]
	}
	
	/**
	 * Calls the method by the name of the action set in the params.perform of the request.
	 * @return The map of data to be converted to JSON at the controller back to the client.
	 */
	public def performAction(Game game, Pilot pilot, BattleUnit unit, Map params) {
		String action = params.perform
		if(action == null) return
		
		// TODO: only allow certain actions during another player's turn (do not allow move, rotate, skip when not their turn)
		return this."$action"(game, pilot, unit, params)
	}
	
	/**
	 * Handles the case where the action called to be performed does not exist as a method.
	 * @param name
	 * @param args
	 * @return
	 */
	private def methodMissing(String name, args) {
		log.error("Missing action name="+name+", args="+args)
		
		// TODO: return with some error game message about missing action
	}
	
	/**
	 * Request from the client to move the unit forward/backward
	 * @return
	 */
	private def move(Game game, Pilot pilot, BattleUnit unit, Map params) {
		if(unit == null) return
		
		boolean forward = params.boolean('forward')
		boolean jumping = params.boolean('jumping')
		
		return gameService.move(game, unit, forward, jumping)
	}
	
	/**
	 * Request from the client to rotate the unit CW/CCW
	 * @return
	 */
	private def rotate(Game game, Pilot pilot, BattleUnit unit, Map params) {
		if(unit == null) return
		
		boolean rotation = params.boolean('rotation')
		boolean jumping = params.boolean('jumping')
		
		if(rotation) {
			return gameService.rotateHeadingCW(game, unit, jumping)
		}
		else {
			return gameService.rotateHeadingCCW(game, unit, jumping)
		}
	}
	
	/**
	 * Request from the client to fire a weapons at the target
	 * @return
	 */
	private def fire_weapons(Game game, Pilot pilot, BattleUnit unit, Map params) {
		if(unit == null) return
		
		String targetId = params.target_id
		BattleUnit target = BattleUnit.get(targetId)
		
		ArrayList weapons = new ArrayList()
		for(id in params.list('weapon_ids[]')) {
			BattleWeapon w = BattleWeapon.get(id)
			log.info("Firing "+w+" @ "+target)
			
			weapons.add(w)
		}
		
		
		if(weapons == null || target == null) {
			return
		}
		
		return gameService.fireWeaponsAtUnit(game, unit, weapons, target);
	}
	
	/**
	 * Request from the client to skip the remainder of their turn
	 * @return
	 */
	private def skip(Game game, Pilot pilot, BattleUnit unit, Map params) {
		if(unit == null) return
		
		return gameService.initializeNextTurn(game)
	}
}