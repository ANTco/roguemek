package roguemek.game

import roguemek.model.Equipment
import roguemek.model.Mech;

/**
 * Represents the owned mech that can be taken into battle
 */
class BattleMech extends BattleUnit {

	Mech mech
	
	// Storing Mech's armor, internals, and crits which can take damage during battle
	Short[] armor
	Short[] internals
	
	List crits
	static hasMany = [crits: long]
	
	// static location indices
	public static final HEAD = Mech.HEAD;
	public static final LEFT_ARM = Mech.LEFT_ARM;
	public static final LEFT_TORSO = Mech.LEFT_TORSO;
	public static final CENTER_TORSO = Mech.CENTER_TORSO;
	public static final RIGHT_TORSO = Mech.RIGHT_TORSO;
	public static final RIGHT_ARM = Mech.RIGHT_ARM;
	public static final LEFT_LEG = Mech.LEFT_LEG;
	public static final RIGHT_LEG = Mech.RIGHT_LEG;
	public static final LEFT_REAR = Mech.LEFT_REAR;
	public static final CENTER_REAR = Mech.CENTER_REAR;
	public static final RIGHT_REAR = Mech.RIGHT_REAR;
	
    static constraints = {
		mech nullable: false
		
		armor size: 11..11
		internals size: 8..8
		
		crits size: 78..78
    }
	
	def beforeValidate() {

		if(mech != null 
				&& armor == null && internals == null && crits == null){
			// armor, internals, and crits needs to be initialized the first time from the Mech associated with it
			armor = mech.armor
			internals = mech.internals
			
			// initialize the displayed image
			image = BattleMech.initMechImage(mech)
			
			// convert Equipment to BattleEquipment to store in crits
			def counter = 0
			crits = new long[78]
			
			// keep track of equipment with >1 crit slots so they can point to the same id
			BattleEquipment prevCritEquip;
			int prevCritNum = 1;
			
			mech.crits.each { equipId ->
				Equipment thisEquip = Equipment.get(equipId)
				
				if(prevCritEquip != null && prevCritEquip.equipment.id == equipId &&
						thisEquip.crits > 1 && thisEquip.crits > prevCritNum) {
					// this crit is a continuation of the same equipment before it
					prevCritNum ++
					crits[counter++] = prevCritEquip.id
				}
				else {
					BattleEquipment bEquip = new BattleEquipment(ownerPilot: pilot, equipment: Equipment.get(equipId));
					bEquip.save flush:true
					
					prevCritEquip = bEquip
					prevCritNum = 1
					
					crits[counter++] = bEquip.id
				}
			}
		}
	}
	
	public void testDamage(int damage){
		log.info "before damage: "+armor[CENTER_TORSO]
		
		armor[CENTER_TORSO] = armor[CENTER_TORSO] - damage
		
		log.info "after damage: "+armor[CENTER_TORSO]
		
		save flush:true
	}
	
	private static String imagesBasePath = "units/mechs/"
	private static String imagesTestPath = "grails-app/assets/images/units/mechs/"
	private static String imagesExtension = ".gif"
	
	/**
	 * Used during creation of the BattleMech to determine the image to be used
	 * @param mech
	 * @return
	 */
	private static String initMechImage(Mech mech) {
		String mechImage = "";
		if(mech == null) return mechImage;
		
		// If no specific image found, use a default based on the mech's weight class
		String weightClass = mech.getWeightClass()
		mechImage = "default_"+weightClass+".gif"
		
		// TODO: for now just matching by mech name (all lower case, no spaces), but should also extend to try chassis+variant first
		String testImage = mech.name.toLowerCase().replaceAll(" ", "") + imagesExtension
		File imageFile = new File(imagesTestPath + testImage)
		
		if(imageFile.exists()) {
			mechImage = testImage
		}
		
		return imagesBasePath + mechImage
	}
	
	public static int getCritSectionStart(int critSectionIndex) {
		return Mech.getCritSectionStart(critSectionIndex)
	}
	
	public static int getCritSectionEnd(int critSectionIndex) {
		return Mech.getCritSectionEnd(critSectionIndex)
	}
	
	public BattleEquipment getEquipmentAt(int critIndex) {
		def thisCritId = this.crits.getAt(critIndex)
		return (thisCritId != null) ? BattleEquipment.read(thisCritId) : null
	}
	
	/**
	 * Gets the BattleEquipment array representing the crits array of just the given section
	 * @param critSectionIndex
	 * @return
	 */
	public BattleEquipment[] getCritSection(int critSectionIndex) {
		int critSectionStart = BattleMech.getCritSectionStart(critSectionIndex)
		int critSectionEnd = BattleMech.getCritSectionEnd(critSectionIndex)
		
		def critSection = []
		
		if(critSectionStart >= 0 && critSectionEnd < 78) {
			for(int i=critSectionStart; i<=critSectionEnd; i++) {
				critSection.add(this.getEquipmentAt(i))
			}
		}
		
		return critSection
	}
	
	@Override
	public String toString() {
		return mech?.name +" "+ mech?.chassis+"-"+mech?.variant
	}
}
