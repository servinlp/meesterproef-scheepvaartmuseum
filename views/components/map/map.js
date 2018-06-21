function setUpMap() { 
	if ( !document.querySelectorAll( 'body > .map' )[0] ) return
	
	const mapContainer = document.querySelector( '.map__svg' )
	const sizes = mapContainer.viewBox.baseVal
	const svgViewboxWidth = sizes.width
	const svgViewboxHeight = sizes.height
	const playButton = document.querySelector( '.play-button' )
	const pauseButton = document.querySelector( '.pause-button' )
	// Global variable that changes to current active button
	let currentActiveYear = document.querySelector( 'button[data-state="active"]' )
	// Timeline of the boat
	const boatTl = new TimelineMax( { repeat: 0, delay: 2 } )
	// Timeline of the line
	const lineTl = new TimelineMax( { repeat: 0, delay: 2 } )
	// All "year" buttons
	const toggleYearButtons = document.querySelectorAll( '[data-year]' )

	sizeMap()

	window.addEventListener( 'optimizedResize', sizeMap )
	pauseButton.addEventListener( 'click', pauseAnimation )
	playButton.addEventListener( 'click', playAnimation )

	function sizeMap() {
		TweenMax.set( mapContainer, { attr:{width: window.innerWidth, height: ( window.innerWidth / ( svgViewboxWidth / svgViewboxHeight ) )} } )
	}

	// Sets the boat on the middle of the route line
	TweenMax.set( '[href="#boat"]', { xPercent: -50, yPercent: -50 } )
	TweenMax.set( playButton, {autoAlpha: 0} )

	function pauseAnimation( ) {
		boatTl.pause()
		lineTl.pause()
		
		togglePauseButton()
		playButton.focus()
	}
	function playAnimation( ) {
		boatTl.play()
		lineTl.play()

		togglePlayButton()
		pauseButton.focus()
	}
	function togglePlayButton(){
		TweenMax.set( playButton, {autoAlpha: 0} )
		TweenMax.set( pauseButton, {autoAlpha: 1} )
		pauseButton.dataset.pressed = 'false'
		playButton.dataset.pressed = 'true'
	}
	function togglePauseButton(){
		TweenMax.set( pauseButton, {autoAlpha: 0} )
		TweenMax.set( playButton, {autoAlpha: 1} )
		playButton.dataset.pressed = 'false'
		pauseButton.dataset.pressed = 'true'
	}

	// Toggles the next animation
	function nextAnimation( event ) {
		let newActiveYear
		// If toggled by click event
		if ( event ) {
			newActiveYear = event.target
		}
		// Toggled by onComplete
		else {
			const nextButtonParent = currentActiveYear.parentNode.nextElementSibling
			if( nextButtonParent ) {
				newActiveYear = nextButtonParent.querySelector( 'button' )
			}
			else {
				const newActiveYearListItem = document.querySelectorAll( '.map__year--list li' )[0]
				newActiveYear = newActiveYearListItem.querySelector( 'button' )
			}
		}
		swapStates( newActiveYear )
		// Clears the timeline of any previous animations
		clearTimelines()
		// Start animation
		addMapFunctionality()
	}

	function swapStates( newActive ) {
		// Set current to inactive
		currentActiveYear.dataset.state = 'inactive'
		// New to active
		newActive.dataset.state = 'active'
		// Current parent to inactive
		currentActiveYear.parentElement.dataset.state = 'inactive'
		// Current parent to active
		newActive.parentElement.dataset.state = 'active'
		// Change global variable to new active button
		currentActiveYear = newActive

		console.log( playButton.dataset.pressed )
		if( playButton.dataset.pressed === 'false' ) {
			console.log( 'play button is pressed state' )
			togglePlayButton()
		}
	}

	function clearTimelines(){
		boatTl.clear()
		lineTl.clear()
	}

	// Add click functionality to year buttons
	toggleYearButtons.forEach( button => { 
		button.addEventListener( 'click', nextAnimation )
	} )

	initializeMap()

	function initializeMap(){ 
		const allPaths = document.querySelectorAll( '[id^="year19"] > g > path' )
		allPaths.forEach( path => { 
			const lastPathIndex = path.parentNode.querySelectorAll( 'path' ).length - 1

			// If this is the last for cycle add Anchor end
			if( path === path.parentNode.querySelectorAll( 'path' )[lastPathIndex] && !path.classList.contains( 'path-clone' ) ) { 
				addSVGAnchorEnd( path )
			}

			addSVGAnchors( path )

			addPathClone( path )

		} )

		function addSVGAnchors( elem ){ 
			elem.insertAdjacentHTML( 'afterend', `
			<svg class="anchor" x="${elem.getPointAtLength( 0 ).x - 15}" y="${elem.getPointAtLength( 0 ).y - 15}" width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 300.187 300.187">
			<path style="stroke-dasharray: 0; stroke: black; fill: white;" d="M284.255,187.297c-1.772-1.761-4.304-2.521-6.756-2.033l-71.478,14.296c-2.292,0.459-4.239,1.96-5.267,4.06  s-1.017,4.559,0.029,6.648l10.424,20.85l-25.753,8.557l-12.152-124.986h48.484c0.008,0.001,0.015,0,0.02,0  c4.143,0,7.5-3.357,7.5-7.5c0-1.419-0.394-2.745-1.077-3.876l-14.058-27.534c-1.281-2.51-3.861-4.09-6.68-4.09h-18.914  c4.862-7.313,7.703-16.08,7.703-25.5C196.281,20.72,175.562,0,150.093,0c-25.468,0-46.188,20.72-46.188,46.188  c0,9.42,2.841,18.187,7.703,25.5H92.694c-2.818,0-5.398,1.58-6.68,4.09l-14.296,28c-1.188,2.325-1.08,5.1,0.283,7.326  s3.786,3.584,6.396,3.584h48.484L114.73,239.669l-25.753-8.57l10.425-20.84c1.046-2.091,1.057-4.55,0.029-6.65  c-1.026-2.101-2.975-3.602-5.267-4.06l-71.478-14.29c-2.45-0.488-4.982,0.272-6.756,2.033c-1.772,1.76-2.552,4.288-2.079,6.741  l13.862,71.913c0.445,2.312,1.951,4.28,4.065,5.315s4.592,1.019,6.692-0.047l25.655-13.018l82.395,41.197  c1.057,0.528,2.205,0.792,3.354,0.792c1.145,0,2.289-0.262,3.341-0.785l82.832-41.207l25.664,13.023  c2.098,1.065,4.577,1.082,6.692,0.047c2.114-1.035,3.62-3.004,4.065-5.315l13.862-71.911  C286.807,191.585,286.027,189.057,284.255,187.297z M150.093,30c8.927,0,16.188,7.262,16.188,16.188s-7.262,16.188-16.188,16.188  c-8.926,0-16.188-7.262-16.188-16.188S141.167,30,150.093,30z"/>
			</svg>
			` )
		}

		// Add last Anchor
		function addSVGAnchorEnd( elem ){ 
			elem.insertAdjacentHTML( 'afterend', `
			<svg class="anchor" x="${elem.getPointAtLength( elem.getTotalLength() ).x - 15}" y="${elem.getPointAtLength( elem.getTotalLength() ).y - 15}" width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 300.187 300.187">
			<path style="stroke-dasharray: 0; stroke: black; fill: white;" d="M284.255,187.297c-1.772-1.761-4.304-2.521-6.756-2.033l-71.478,14.296c-2.292,0.459-4.239,1.96-5.267,4.06  s-1.017,4.559,0.029,6.648l10.424,20.85l-25.753,8.557l-12.152-124.986h48.484c0.008,0.001,0.015,0,0.02,0  c4.143,0,7.5-3.357,7.5-7.5c0-1.419-0.394-2.745-1.077-3.876l-14.058-27.534c-1.281-2.51-3.861-4.09-6.68-4.09h-18.914  c4.862-7.313,7.703-16.08,7.703-25.5C196.281,20.72,175.562,0,150.093,0c-25.468,0-46.188,20.72-46.188,46.188  c0,9.42,2.841,18.187,7.703,25.5H92.694c-2.818,0-5.398,1.58-6.68,4.09l-14.296,28c-1.188,2.325-1.08,5.1,0.283,7.326  s3.786,3.584,6.396,3.584h48.484L114.73,239.669l-25.753-8.57l10.425-20.84c1.046-2.091,1.057-4.55,0.029-6.65  c-1.026-2.101-2.975-3.602-5.267-4.06l-71.478-14.29c-2.45-0.488-4.982,0.272-6.756,2.033c-1.772,1.76-2.552,4.288-2.079,6.741  l13.862,71.913c0.445,2.312,1.951,4.28,4.065,5.315s4.592,1.019,6.692-0.047l25.655-13.018l82.395,41.197  c1.057,0.528,2.205,0.792,3.354,0.792c1.145,0,2.289-0.262,3.341-0.785l82.832-41.207l25.664,13.023  c2.098,1.065,4.577,1.082,6.692,0.047c2.114-1.035,3.62-3.004,4.065-5.315l13.862-71.911  C286.807,191.585,286.027,189.057,284.255,187.297z M150.093,30c8.927,0,16.188,7.262,16.188,16.188s-7.262,16.188-16.188,16.188  c-8.926,0-16.188-7.262-16.188-16.188S141.167,30,150.093,30z"/>
			</svg>
			` )
		}

		function addPathClone( elem ){ 
			const pathClone = elem.cloneNode( true )
			pathClone.classList.add( 'path-clone' )
			TweenMax.set( pathClone, { drawSVG: '0%', strokeDasharray: '20, 5' } )
			elem.insertAdjacentElement( 'afterend', pathClone )
		}

		// init
		addMapFunctionality()
	}

	// Happens on change of year
	function addMapFunctionality() { 
		// The <g> with all the routes
		const map = document.querySelector( '#map-routes' )
		
		// This array will contain the formed animation paths from the routes
		const allBezierRoutes = []
		const pathLengths = []

		// Hides all routes that contain "year19..." as an ID
		map.querySelectorAll( '[id^="year19"]' ).forEach( route => { 
			TweenMax.set( route, {autoAlpha: 0} )
		} )
		// Displays current active route
		const currentActiveRoute = map.querySelector( `[id^="year${ currentActiveYear.dataset.year }"]` )
		TweenMax.set( currentActiveRoute, {autoAlpha: 1} )

		// Get the path of the currently active year
		const pathsOfActiveYear = document.querySelectorAll( `#year${ currentActiveYear.dataset.year } > g > path` )

		pathsOfActiveYear.forEach( path => { 
			// Show current path
			path.style = 'fill-opacity: 1 stroke-opacity: .8'
			path.nextSibling.style = 'fill-opacity: 1 stroke-opacity: .8'
			// For every path that is not a clone
			if( !path.classList.contains( 'path-clone' ) ){ 
				// Form all animation routes and align the boat
				allBezierRoutes.push( MorphSVGPlugin.pathDataToBezier( path, { 
					align: '[href="#boat"]'
				} ) )
				const pathLength = path.getTotalLength()
				// PathLengths gets filled with all the lengths of the paths in pixels
				pathLengths.push( pathLength )
			}
		} )

		// Creates every animation and adds them to the boat timeline
		const boat = document.querySelector( '[href="#boat"]' )
		TweenMax.set( mapContainer, {attr:{viewBox: '0 200 170 174'}} )
		// Function for 
		const animationDurations = pathLengths.map( length => {
			const time = Number( length ) / 40
			const fixedTime = Number( time.toFixed( 2 ) )
			// remove magic numbers
			// Math.max(3, otherNum)
			return fixedTime < 3 ? 3 : fixedTime
		} )

		const boatStartX = allBezierRoutes[0][0].x
		const boatStartY = allBezierRoutes[0][0].y
		TweenMax.set( '[href="#boat"]', {x: boatStartX, y: boatStartY} )
		TweenMax.set( mapContainer, {
			attr:{viewBox: `0 ${200 + ( boat._gsTransform.y / 2 ) } ${170 + boat._gsTransform.x} ${274 + ( boat._gsTransform.y / 4 )}`}
		} )
		allBezierRoutes.forEach( ( arr, i ) => {
			const boatFollowsLine = TweenMax.to( '[href="#boat"]', animationDurations[i], { 
				bezier: { 
					values: arr,
					type: 'cubic',
					ease: Power1.easeInOut,
				},
				onUpdate: () => {
					TweenMax.set( mapContainer, {
						attr:{viewBox: `0 ${200 + ( boat._gsTransform.y / 2 ) } ${170 + boat._gsTransform.x} ${274 + ( boat._gsTransform.y / 2 )}`}
					} )
				},
				ease: Power1.easeInOut
			} )

			boatTl.add( boatFollowsLine )

			const currentYearPath = document.querySelectorAll( `#year${ currentActiveYear.dataset.year } > g > .path-clone` )

			// Creates an animation where the finished path gets another style
			TweenMax.set( `#year${ currentActiveYear.dataset.year } > g > .path-clone`, {
				drawSVG: '0% 0%',
				stroke: 'red'
			} )
			const drawProgressLine = TweenMax.to( currentYearPath[i], animationDurations[i], 
				{
					drawSVG: '0% 100%', 
					stroke: 'red',
					immediateRender:false,
					ease: Power1.easeInOut
				},
			)
			lineTl.add( drawProgressLine )
		} )

		// Start animations
		boatTl
			.play()
			.eventCallback( 'onComplete', () => {
				// Adds a delay before playing the next animation
				setTimeout( () => {
					nextAnimation()
				}, 2000 )
			} )
		lineTl.play()

	}
}

export default setUpMap