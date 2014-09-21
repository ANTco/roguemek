package roguemek.game

import org.apache.commons.logging.LogFactory
import org.apache.commons.logging.Log
import roguemek.game.Coords

/**
 * Represents the owned unit that can be taken into battle as a base class for BattleMech, BattleTank, etc
 */
class BattleUnit {
	private static Log log = LogFactory.getLog(this)

	Pilot pilot	// pilot can be a Pilot other than the owner of the unit
	
	Integer x = 0
	Integer y = 0
	Integer heading = 0
	Integer actionPoints = 0
	Integer jumpPoints = 0
	Integer heat = 0
	
	Integer damageTakenThisTurn = 0
	Boolean shutdown = false
	Boolean prone = false
	
	Character status = STATUS_ACTIVE
	
	String image
	
	// STATIC value mappings
	public static final Character STATUS_ACTIVE = 'A'
	public static final Character STATUS_DESTROYED = 'D'
	
	// STATIC variables
	public static final Integer HEADING_N = 0;
	public static final Integer HEADING_NE = 1;
	public static final Integer HEADING_SE = 2;
	public static final Integer HEADING_S = 3;
	public static final Integer HEADING_SW = 4;
	public static final Integer HEADING_NW = 5;
	
	static mapping = {
		// All extending classes will get their own tables
		tablePerHierarchy false
	}
	
    static constraints = {
		pilot nullable: true
		
		x nullable: true
		y nullable: true
		heading nullable: true
		actionPoints min: 0
		jumpPoints min: 0
		heat min: 0
		
		damageTakenThisTurn min: 0
		shutdown nullable: false
		prone nullable: false
		
		image nullable: false
		
		status inList: [STATUS_ACTIVE, STATUS_DESTROYED]
    }
	
	public static void setLocation(BattleUnit unit, Coords location) {
		unit.x = location?.x
		unit.y = location?.y
	}
	
	public Coords getLocation() {
		if(this.x == null || this.y == null) {
			return null
		}
		return new Coords(this.x, this.y)
	}
	
	@Override
	public String toString() {
		return "Unit piloted by "+pilot?.toString()
	}
}
