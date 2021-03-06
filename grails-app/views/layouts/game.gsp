<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"><!--<![endif]-->
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title><g:layoutTitle default="RogueMek"/></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<link rel="shortcut icon" href="${assetPath(src: 'marauder.ico')}" type="image/x-icon">
		<link rel="apple-touch-icon" href="${assetPath(src: 'marauder-touch-icon.png')}">
		<link rel="apple-touch-icon" sizes="100x100" href="${assetPath(src: 'marauder-touch-icon-retina.png')}">
		
  		<asset:stylesheet src="game.css"/>
		<asset:javascript src="game.js"/>
		
		<tz:detect />
		
		<g:layoutHead/>
	</head>
	<body>
		
		<g:layoutBody/>
		
		<div id="spinner" class="spinner" style="display:none;"><g:message code="spinner.alt" default="Loading&hellip;"/></div>
		
		<asset:deferredScripts/>
	</body>
</html>
