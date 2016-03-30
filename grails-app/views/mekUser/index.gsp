
<%@ page import="roguemek.MekUser" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#list-user" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		
		<sec:ifAnyGranted roles="ROLE_ADMIN">
		<div class="nav" role="navigation">
			<ul>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		</sec:ifAnyGranted>
		
		<div id="list-user" class="content scaffold-list" role="main">
			<h1><g:message code="default.list.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
				<div class="message" role="status">${flash.message}</div>
			</g:if>
			<table>
			<thead>
					<tr>
					
						<g:sortableColumn property="callsign" title="${message(code: 'user.callsign.label', default: 'Callsign')}" />
					
						<sec:ifAnyGranted roles="ROLE_ADMIN">
							<g:sortableColumn property="username" title="${message(code: 'user.username.label', default: 'Username')}" />
							
							<g:sortableColumn property="accountExpired" title="${message(code: 'user.accountExpired.label', default: 'Account Expired')}" />
					
							<g:sortableColumn property="accountLocked" title="${message(code: 'user.accountLocked.label', default: 'Account Locked')}" />
						
							<g:sortableColumn property="enabled" title="${message(code: 'user.enabled.label', default: 'Enabled')}" />
						</sec:ifAnyGranted>
						
					</tr>
				</thead>
				<tbody>
				<g:each in="${mekUserInstanceList}" status="i" var="mekUserInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
					
						<td><g:link mapping="userDetails" params='[callsign:"${mekUserInstance?.callsign}"]'>${mekUserInstance?.callsign}</g:link></td>
					
						<sec:ifAnyGranted roles="ROLE_ADMIN">
							<td><g:link action="show" id="${mekUserInstance.id}">${fieldValue(bean: mekUserInstance, field: "username")}</g:link></td>
							
							<td><g:formatBoolean boolean="${mekUserInstance.accountExpired}" /></td>
						
							<td><g:formatBoolean boolean="${mekUserInstance.accountLocked}" /></td>
						
							<td><g:formatBoolean boolean="${mekUserInstance.enabled}" /></td>
						</sec:ifAnyGranted>
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${userInstanceCount ?: 0}" />
			</div>
		</div>
	</body>
</html>
