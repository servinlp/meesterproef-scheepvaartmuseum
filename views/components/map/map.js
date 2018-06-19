function setUpMap() { 
	if ( !document.querySelectorAll( 'main > .map' )[0] ) return
		
	// Set SVG Width and Height
	TweenMax.set( '.map__svg', { attr:{width: window.innerWidth, height: ( window.innerWidth / ( 610 / 574 ) )} } )
	window.addEventListener( 'resize', () => {
		TweenMax.set( '.map__svg', { attr:{width: window.innerWidth, height: ( window.innerWidth / ( 610 / 574 ) )} } )
	} )
	// Sets the boat on the middle of the route line
	TweenMax.set( '[href="#boat"]', { xPercent: -50, yPercent: -50 } )

	// Global variable that changes to current active button
	let currentActiveYear = document.querySelector( '[data-state="active"]' )
	// Timeline of the boat
	const boatTl = new TimelineMax( { repeat: 0 } )
	// Timeline of the line
	const lineTl = new TimelineMax( { repeat: 0 } )
	// All "year" buttons
	const toggleYearButtons = document.querySelectorAll( '[data-year]' )

	// Add click functionality to year buttons
	toggleYearButtons.forEach( button => { 
		button.addEventListener( 'click', () => { 
			// Change state
			currentActiveYear.dataset.state = 'inactive'
			button.dataset.state = 'active'
			currentActiveYear = button
			// Clears the timeline of any previous animations
			boatTl.clear()
			lineTl.clear()
			// Start animation
			addMapFunctionality()
		} )
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
			<svg class="anchor" x="${elem.getPointAtLength( 0 ).x - 12}" y="${elem.getPointAtLength( 0 ).y - 12}" width="1.5rem" height="1.5rem" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 300.187 300.187" style="enable-background:new 0 0 300.187 300.187;" xml:space="preserve">
			<path style="stroke-dasharray: 0; stroke: black; fill: white;" d="M284.255,187.297c-1.772-1.761-4.304-2.521-6.756-2.033l-71.478,14.296c-2.292,0.459-4.239,1.96-5.267,4.06  s-1.017,4.559,0.029,6.648l10.424,20.85l-25.753,8.557l-12.152-124.986h48.484c0.008,0.001,0.015,0,0.02,0  c4.143,0,7.5-3.357,7.5-7.5c0-1.419-0.394-2.745-1.077-3.876l-14.058-27.534c-1.281-2.51-3.861-4.09-6.68-4.09h-18.914  c4.862-7.313,7.703-16.08,7.703-25.5C196.281,20.72,175.562,0,150.093,0c-25.468,0-46.188,20.72-46.188,46.188  c0,9.42,2.841,18.187,7.703,25.5H92.694c-2.818,0-5.398,1.58-6.68,4.09l-14.296,28c-1.188,2.325-1.08,5.1,0.283,7.326  s3.786,3.584,6.396,3.584h48.484L114.73,239.669l-25.753-8.57l10.425-20.84c1.046-2.091,1.057-4.55,0.029-6.65  c-1.026-2.101-2.975-3.602-5.267-4.06l-71.478-14.29c-2.45-0.488-4.982,0.272-6.756,2.033c-1.772,1.76-2.552,4.288-2.079,6.741  l13.862,71.913c0.445,2.312,1.951,4.28,4.065,5.315s4.592,1.019,6.692-0.047l25.655-13.018l82.395,41.197  c1.057,0.528,2.205,0.792,3.354,0.792c1.145,0,2.289-0.262,3.341-0.785l82.832-41.207l25.664,13.023  c2.098,1.065,4.577,1.082,6.692,0.047c2.114-1.035,3.62-3.004,4.065-5.315l13.862-71.911  C286.807,191.585,286.027,189.057,284.255,187.297z M150.093,30c8.927,0,16.188,7.262,16.188,16.188s-7.262,16.188-16.188,16.188  c-8.926,0-16.188-7.262-16.188-16.188S141.167,30,150.093,30z"/>
			</svg>
			` )
		}

		// Add last Anchor
		function addSVGAnchorEnd( elem ){ 
			elem.insertAdjacentHTML( 'afterend', `
			<svg class="anchor" x="${elem.getPointAtLength( elem.getTotalLength() ).x - 12}" y="${elem.getPointAtLength( elem.getTotalLength() ).y - 12}" width="1.5rem" height="1.5rem" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 300.187 300.187" style="enable-background:new 0 0 300.187 300.187;" xml:space="preserve">
			<path style="stroke-dasharray: 0; stroke: black; fill: white;" d="M284.255,187.297c-1.772-1.761-4.304-2.521-6.756-2.033l-71.478,14.296c-2.292,0.459-4.239,1.96-5.267,4.06  s-1.017,4.559,0.029,6.648l10.424,20.85l-25.753,8.557l-12.152-124.986h48.484c0.008,0.001,0.015,0,0.02,0  c4.143,0,7.5-3.357,7.5-7.5c0-1.419-0.394-2.745-1.077-3.876l-14.058-27.534c-1.281-2.51-3.861-4.09-6.68-4.09h-18.914  c4.862-7.313,7.703-16.08,7.703-25.5C196.281,20.72,175.562,0,150.093,0c-25.468,0-46.188,20.72-46.188,46.188  c0,9.42,2.841,18.187,7.703,25.5H92.694c-2.818,0-5.398,1.58-6.68,4.09l-14.296,28c-1.188,2.325-1.08,5.1,0.283,7.326  s3.786,3.584,6.396,3.584h48.484L114.73,239.669l-25.753-8.57l10.425-20.84c1.046-2.091,1.057-4.55,0.029-6.65  c-1.026-2.101-2.975-3.602-5.267-4.06l-71.478-14.29c-2.45-0.488-4.982,0.272-6.756,2.033c-1.772,1.76-2.552,4.288-2.079,6.741  l13.862,71.913c0.445,2.312,1.951,4.28,4.065,5.315s4.592,1.019,6.692-0.047l25.655-13.018l82.395,41.197  c1.057,0.528,2.205,0.792,3.354,0.792c1.145,0,2.289-0.262,3.341-0.785l82.832-41.207l25.664,13.023  c2.098,1.065,4.577,1.082,6.692,0.047c2.114-1.035,3.62-3.004,4.065-5.315l13.862-71.911  C286.807,191.585,286.027,189.057,284.255,187.297z M150.093,30c8.927,0,16.188,7.262,16.188,16.188s-7.262,16.188-16.188,16.188  c-8.926,0-16.188-7.262-16.188-16.188S141.167,30,150.093,30z"/>
			</svg>
			` )
		}

		function addPathClone( elem ){ 
			const pathClone = elem.cloneNode( true )
			const pathCloneId = pathClone.getAttribute( 'id' )
			pathClone.setAttribute( 'id', `${ pathCloneId }-clone` )
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
			route.style = 'display: none'
		} )
		// Displays current active route
		map.querySelector( `[id^="year${ currentActiveYear.dataset.year }"]` ).style = 'display: block'

		// Get the path of the currently active year
		const pathsOfActiveYear = document.querySelectorAll( `#year${ currentActiveYear.dataset.year } > g > path` )

		pathsOfActiveYear.forEach( path => { 
			// Show current path
			path.style = 'fill-opacity: 1 stroke-opacity: .8'
			path.nextSibling.style = 'fill-opacity: 1 stroke-opacity: .8'
			
			if( !path.classList.contains( 'path-clone' ) ){ 
				// Form all animation routes and align the boat
				allBezierRoutes.push( MorphSVGPlugin.pathDataToBezier( path, { 
					align: '[href="#boat"]'
				} ) )
				const pathLength = path.getTotalLength()
				pathLengths.push( pathLength )
			}
		} )
		console.log( pathLengths )

		// Creates every animation and adds them to the boat timeline
		const boat = document.querySelector( '[href="#boat"]' )
		TweenMax.set( '.map__svg', {attr:{viewBox: '0 200 170 174'}} )
		
		const animationDurations = pathLengths.map( length => {
			const time = Number( length ) / 40
			const fixedTime = Number( time.toFixed( 2 ) )
			return fixedTime < 3 ? 3 : fixedTime
		} )
		
		allBezierRoutes.forEach( ( arr, i ) => {
			const boatFollowsLine = TweenMax.to( '[href="#boat"]', animationDurations[i], { 
				bezier: { 
					values: arr,
					type: 'cubic',
					ease: Power1.easeInOut,
				},
				onUpdate: () => {
					TweenMax.set( '.map__svg', {
						attr:{viewBox: `0 ${200 + ( boat._gsTransform.y / 2 ) } ${170 + boat._gsTransform.x} ${274 + ( boat._gsTransform.y / 4 )}`}
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
		boatTl.play()
		lineTl.play()
	}
}

export default setUpMap