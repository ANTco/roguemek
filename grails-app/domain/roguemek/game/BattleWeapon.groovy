package roguemek.game

/**
 * Represents the owned Weapon that can be taken into battle and be fired
 */
class BattleWeapon extends BattleEquipment {

	Integer cooldown = 0
	
    static constraints = {
		cooldown nullable:false, min: 0
    }
	
	public int getDamage() {
		return this.equipment.damage;
	}
	
	public int getHeat() {
		return this.equipment.heat;
	}
	
	public int getCycle() {
		return this.equipment.cycle;
	}
	
	public int getProjectiles() {
		return this.equipment.projectiles;
	}
	
	public int getMinRange() {
		return this.equipment.minRange;
	}
	
	public int getShortRange() {
		return this.equipment.shortRange;
	}
	
	public int getMediumRange() {
		return this.equipment.mediumRange;
	}
	
	public int getLongRange() {
		return this.equipment.longRange;
	}
}
