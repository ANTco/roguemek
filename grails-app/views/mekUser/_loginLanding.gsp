
<g:if test="${params.action == 'register'}">
	<%-- Hide login box while registering --%>
</g:if>
<g:else>
		<div class="nav logout" role="navigation" style="float:right;">
			<li><%-- <g:link controller="mekUser" action="profile">Profile</g:link> | --%><g:link controller="logout">Logout</g:link></li>
		</div>
		
		<%-- You own (${session?.user?.ownedMechs?.size() ?: 0}) Mechs.<br> --%>
		<%--
		<g:each var="mech" in="${session?.user?.ownedMechs?}">
			<span class="mech">${mech.name}</span>
		</g:each>
		 --%>
</g:else>

<div class="nav" role="navigation">
	<g:if test="${params.action == 'register'}">
		<%-- Hide user box while registering --%>
	</g:if>
	
	<ul>
	<sec:ifLoggedIn>
		<li><a class="dropship" href="${createLink(uri: '/dropship')}"><g:message code="dropship.home.label" default="Dropship"/></a></li>
	</sec:ifLoggedIn>
	
	<sec:ifAnyGranted roles="ROLE_ADMIN">
	   
	   <li><g:link controller="mekUserRole"
                action="index">Roles</g:link></li>
       
       <li><g:link controller="mekUser"
                action="index">Users</g:link></li>
       
       <li><g:link controller="pilot"
                action="index">Pilots</g:link></li>
       
	   <li><g:link controller="battleMech"
                action="index">BattleMechs</g:link></li>
       
       <li><g:link controller="mech"
                action="index">Mech List</g:link></li>
       
       <li><g:link controller="game"
                action="list">Games</g:link></li>
    </sec:ifAnyGranted>
    </ul>
</div>
