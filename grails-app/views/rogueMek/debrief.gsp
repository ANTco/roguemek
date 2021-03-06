<%@ page import="roguemek.game.Game"
		 import="roguemek.game.BattleMech"
		 import="roguemek.stats.WinLoss"
		 import="roguemek.stats.KillDeath" 
		 import="roguemek.chat.ChatMessage"
 %>

<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<asset:stylesheet src="debrief.css"/>
		<asset:javascript src="debrief.js"/>
		<title><g:message code="game.over.debriefing.label" /></title>
	</head>
	<body>
		
		<div id="show-game" class="content scaffold-show" role="main">
			<h1><g:message code="game.over.debriefing.label" /> - ${gameInstance?.description}</h1>
			
			<div id="teams">
				<g:each in="${usersByTeam}" var="entry">
					<g:set var="teamNum" value="${entry.key}" />
					<g:set var="teamUsers" value="${entry.value}" />
					
					<div class="team">
					    <div class="team-header">
					        <g:if test="${(teamNum >= 0)}">
					            <h2>Team ${teamNum}</h2>
					        </g:if>
					    </div>
					
						<g:each in="${teamUsers}" var="thisUser">
							<div class="player">
								<ol class="property-list game">
									
									<h3>
										${thisUser.callsign}
										<g:if test="${winners.contains(thisUser.id)}">
											<span class="just-icon ui-icon ui-icon-star"></span>
										</g:if>
									</h3>
								
				                	<g:set var="unitList" value="${unitsByUser[thisUser.id]}" />
				                	
				                	<li class="fieldcontain">
				                		<span id="units-label" class="property-label"><g:message code="game.status.label" default="Status" /></span>
				                		
				                		<g:each in="${unitList}" var="unit">
				                			<g:set var="pilot" value="${unit.pilot}" />
				                			<span class="property-value" aria-labelledby="units-label">
				                				${unit.getHealthPercentage().round()}% : ${unit?.encodeAsHTML()} - ${pilot?.encodeAsHTML()}
				               				</span>
				                		</g:each>
				                	</li>
									
									<g:if test="${killMap[thisUser.id]}">
					                	<li class="fieldcontain">
					                		<span id="kills-label" class="property-label"><g:message code="game.kill.label" default="Kills" /></span>
					                		
					                		<g:each in="${killMap[thisUser.id]}" var="thisKD">
					                			<span class="property-value" aria-labelledby="kills-label">
					                				${thisKD.victimUnit} (${thisKD.victim})
					               				</span>
					                		</g:each>
					                	</li>
				                	</g:if>
								</ol>
							</div>
						</g:each>
					</div>
				</g:each>
			</div>
		</div>
		
		<div id="chat-area" class="content">
			<h1><g:message code="game.battle.log.label" default="Combat Log" /></h1>
			<div id="chat-window">
				<%-- show previous chat from database --%>
				<g:if test="${chatMessages}">
					<g:each in="${chatMessages}" var="thisChat">
						<div class="chat-line">
							<%-- TODO: figure out showing in the locale time style like Date.toLocaleTimeString in javascript --%>
							<span class="chat-time">[<g:formatDate format="h:mm:ss a" date="${thisChat.time}"/>]</span>
							<g:if test="${thisChat.user}"><span class="chat-user">${thisChat.user}:</span></g:if>
							<span class="chat-message">${thisChat.message}</span>
						</div>
					</g:each>
				</g:if>
			</div>
		</div>
	</body>
</html>
