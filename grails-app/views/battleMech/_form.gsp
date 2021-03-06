<%@ page import="roguemek.game.BattleMech" %>



<div class="fieldcontain ${hasErrors(bean: battleMechInstance, field: 'mech', 'error')} required">
	<label for="mech">
		<g:message code="battleMech.mech.label" default="Mech" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="mech" name="mech.id" from="${roguemek.model.Mech.list()}" optionKey="id" required="" optionValue="${{it?.name+" "+it?.chassis+"-"+it?.variant}}" value="${battleMechInstance?.mech?.id}" class="many-to-one"/>

</div>

<div class="fieldcontain ${hasErrors(bean: battleMechInstance, field: 'pilot', 'error')} required">
	<label for="pilot">
		<g:message code="battleMech.pilot.label" default="Owner Pilot" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="pilot" name="pilot.id" from="${roguemek.game.Pilot.list()}" optionKey="id" required="" optionValue="${{it?.firstName+" \""+it?.ownerUser?.callsign+"\" "+it?.lastName}}" value="${battleMechInstance?.pilot?.id}" class="many-to-one"/>

</div>

