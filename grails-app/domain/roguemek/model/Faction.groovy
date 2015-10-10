package roguemek.model

import java.io.File

import org.grails.plugins.csv.CSVMapReader
import roguemek.assets.ContextHelper

class Faction {
	
	String name
	String description

    static constraints = {
		name blank: false
		description nullable: true
    }
	
	static void init() {
		def defaultFaction = Faction.findByName("Lone Wolf")
		if(defaultFaction != null) {
			return
		}
		
		// Create all factions for the game from csv
		new CSVMapReader(new InputStreamReader(ContextHelper.getContextSource("csv/Factions.csv"))).eachLine { map ->
			def faction = new Faction(map)
			
			if(!faction.validate()) {
				log.error("Errors with faction "+faction.name+":\n")
				faction.errors.allErrors.each {
					log.error(it)
				}
			}
			else {
				faction.save()
				log.info("Created faction "+faction.name)
			}
		}
		
	}
}
