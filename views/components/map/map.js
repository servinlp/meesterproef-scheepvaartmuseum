function setUpMap() { 
	if ( !document.querySelectorAll( 'main > .map' )[0] ) return
		
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

	const svgNS = 'http://www.w3.org/2000/svg'
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
		allPaths.forEach( ( path, i ) => { 
			const lastPathIndex = path.parentNode.querySelectorAll( 'path' ).length - 1

			// If this is the last for cycle add circle end
			if( path === path.parentNode.querySelectorAll( 'path' )[lastPathIndex] && !path.classList.contains( 'path-clone' ) ) { 
				addSVGCircleEnd( path )
			}

			addSVGCircles( path )

			addPathClone( path )

			// If this is the last for cycle add circle end
			// Because of a bug we had to duplicate this statement
			if( i === allPaths.length - 1 ) { 
				addSVGCircleEvents()
			}

		} )

		function addSVGCircles( elem ){ 
			const circleStart = document.createElementNS( svgNS, 'circle' )
			circleStart.setAttribute( 'cx', elem.getPointAtLength( 0 ).x )
			circleStart.setAttribute( 'cy', elem.getPointAtLength( 0 ).y )
			addSVGCircleAttributes( circleStart )
			elem.insertAdjacentElement( 'afterend', circleStart )
		}

		// Add last circle
		function addSVGCircleEnd( elem ){ 
			const circleEnd = document.createElementNS( svgNS, 'circle' )
			circleEnd.setAttribute( 'cx', elem.getPointAtLength( elem.getTotalLength() ).x )
			circleEnd.setAttribute( 'cy', elem.getPointAtLength( elem.getTotalLength() ).y )
			addSVGCircleAttributes( circleEnd )
			elem.insertAdjacentElement( 'afterend', circleEnd )
		}

		function addSVGCircleAttributes( elem ) { 
			elem.setAttribute( 'fill', 'rgba( 255, 255, 255, .5 )' )
			elem.setAttribute( 'stroke', 'rgba( 0, 0, 0, .5 )' )
			elem.setAttribute( 'stroke-width', '.15rem' )
			elem.setAttribute( 'r', 10 )
			elem.classList.add( 'pathCircle' )
		}

		function addPathClone( elem ){ 
			const pathClone = elem.cloneNode( true )
			const pathCloneId = pathClone.getAttribute( 'id' )
			pathClone.setAttribute( 'id', `${ pathCloneId }-clone` )
			pathClone.classList.add( 'path-clone' )
			TweenMax.set( pathClone, { drawSVG: '0%', strokeDasharray: '20, 5' } )
			elem.insertAdjacentElement( 'afterend', pathClone )
		}
		// Add clicks and hovers to circles and links
		function addSVGCircleEvents() { 
			const circles = document.querySelectorAll( '.pathCircle' )
			const locationList = document.querySelectorAll( '.map__location--container li a' )

			circles.forEach( ( circle, i ) => { 
				circle.addEventListener( 'mouseover', () => { 
					TweenMax.to( circle, .3, { transformOrigin: 'center', scaleX: 1.5, scaleY: 1.5 } )
				} )
				circle.addEventListener( 'click', () => { 
					window.location.href = locationList[i].href
				} )
				circle.addEventListener( 'mouseout', () => { 
					TweenMax.to( circle, .3, { transformOrigin: 'center', scaleX: 1, scaleY: 1 } )
				} )
			} )
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
			}

		} )

		// Creates every animation and adds them to the boat timeline
		allBezierRoutes.forEach( arr => { 
			const boatFollowsLine = TweenMax.to( '[href="#boat"]', 5, { 
				bezier: { 
					values: arr,
					type: 'cubic',
					ease: Power0.easeNone,
				}
			} )

			boatTl.add( boatFollowsLine )
		} )

		// Creates an animation where the finished path gets another style
		const drawProgressLine = TweenMax.staggerFromTo( `#year${ currentActiveYear.dataset.year } > g > .path-clone`, 5, 
			{ 
				drawSVG: '0% 0%'
			}, { 
				drawSVG: '0% 100%', 
				stroke: 'red',
				immediateRender:false,
			},
			5
		)
		lineTl.add( drawProgressLine )
		// Start animations
		boatTl.play()
		lineTl.play()
	}
}

export default setUpMap