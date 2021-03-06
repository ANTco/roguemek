
<%@ page import="roguemek.game.BattleMech" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'battleMech.label', default: 'BattleMech')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#list-battleMech" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>

		<div id="list-battleMech" class="content scaffold-list" role="main">
			<h1><g:message code="default.list.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
				<div class="message" role="status">${flash.message}</div>
			</g:if>
			<table>
			<thead>
					<tr>
					
						<th><g:message code="battleMech.mech.label" default="Mech" /></th>
						
						<th><g:message code="battleMech.owner.label" default="Owner" /></th>
					
						<th><g:message code="battleMech.pilot.label" default="Pilot" /></th>
					
					</tr>
				</thead>
				<tbody>
				<g:each in="${battleMechInstanceList}" status="i" var="battleMechInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
					
						<td><g:link action="show" id="${battleMechInstance.id}">${battleMechInstance?.mech?.name +" "+battleMechInstance?.mech?.chassis+"-"+battleMechInstance?.mech?.variant}</g:link></td>
					
						<td>${battleMechInstance?.owner?.toString()}</td>
					
						<td>${battleMechInstance?.pilot?.toString()}</td>
					
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${battleMechInstanceCount ?: 0}" />
			</div>
		</div>
	</body>
</html>
