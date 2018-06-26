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
			<?xml version="1.0" encoding="UTF-8"?>
			<svg class="anchor-marker" x="${elem.getPointAtLength( 0 ).x - 15}" y="${elem.getPointAtLength( 0 ).y - 27}" width="30px" height="30px" viewBox="0 0 690 689" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink">
				<g stroke="none" stroke-width="0" fill="none" fill-rule="evenodd">
					<path d="M344.5353,654.7629 C339.5983,646.8599 334.8383,639.4319 330.2643,631.8889 C296.7813,576.6619 262.8443,521.7029 230.0383,466.0759 C205.1533,423.8789 183.6073,379.8969 163.8953,335.0029 C155.5143,315.9169 147.8373,296.7939 143.9793,276.2119 C123.0143,164.3769 200.3643,55.2309 312.7993,38.1639 C413.0613,22.9449 507.7883,80.9579 538.8763,177.3629 C554.4223,225.5729 552.0513,273.5149 532.0773,320.1209 C515.4383,358.9439 497.2023,397.0339 477.0883,434.2139 C444.6273,494.2139 408.7653,552.1829 372.6263,609.9909 C364.1993,623.4719 355.7903,636.9629 347.3643,650.4439 C346.5513,651.7449 345.6833,653.0129 344.5353,654.7629" class="marker" fill="#000000"></path>
					<path d="M495.8643,239.6466 C495.8593,322.8916 427.8233,390.7686 344.3923,390.7646 C261.3883,390.7596 193.4343,322.6526 193.5363,239.5676 C193.6383,155.8166 261.4753,88.2976 345.3523,88.4646 C428.1923,88.6286 495.8693,156.6066 495.8643,239.6466" class="white-ring" fill="#FFFFFF"></path>
					<path d="M344.3013,378.1403 C267.3143,377.7933 205.8223,315.6953 206.1803,238.6563 C206.5353,161.9763 268.9243,100.6953 346.2363,101.0863 C422.3783,101.4713 483.5053,164.1913 483.0503,241.4653 C482.6083,316.8633 420.0533,378.4833 344.3013,378.1403" class="inside-fill" fill="#000000"></path>
					<path d="M353.9736,159.1054 C360.9766,155.9524 364.9176,147.4734 363.1086,139.4534 C361.0836,130.4834 353.1616,124.1674 344.1876,124.3664 C335.3516,124.5624 327.8556,131.0474 326.1636,139.9604 C324.6496,147.9424 328.7496,156.3204 335.5126,159.0604 C336.5076,151.2754 339.2416,148.0134 344.7426,148.0484 C350.0996,148.0834 352.7696,151.2814 353.9736,159.1054 M246.8816,267.8824 C252.0706,273.2954 256.9956,278.8494 262.3586,283.9414 C273.8886,294.8914 287.7296,301.4874 303.2926,304.3854 C317.6136,307.0514 327.5816,301.8124 331.4256,287.7734 C334.4956,276.5574 336.2926,264.7714 336.8866,253.1484 C337.7776,235.7354 337.1186,218.2444 337.1186,200.0124 C332.0136,200.9204 327.2156,198.1934 322.6406,201.9924 C321.4436,202.9854 318.7476,202.5864 316.8556,202.2264 C314.3586,201.7504 312.0096,200.5494 309.5346,199.8974 C306.0746,198.9864 303.3126,195.6784 303.2856,192.0904 C303.2566,188.0734 306.0666,184.8334 310.1246,183.8764 C312.3456,183.3544 314.4356,182.2194 316.6666,181.8154 C318.5856,181.4684 321.3326,180.9414 322.4786,181.9284 C326.5316,185.4164 330.9396,182.9934 335.8166,184.0134 C335.8166,179.4204 336.0456,175.3134 335.6566,171.2654 C335.5586,170.2514 333.5736,169.2514 332.2906,168.5464 C321.6466,162.6984 315.9786,153.8064 316.4926,141.6064 C316.9746,130.1324 324.9316,120.1794 335.7536,116.5714 C349.1616,112.1024 364.0526,118.4774 370.1136,131.2814 C376.2466,144.2424 371.7276,160.1744 359.0736,167.1244 C354.3296,169.7284 352.9246,172.6254 353.5156,177.4504 C353.7516,179.3864 353.5546,181.3754 353.5546,183.8604 C358.4136,183.1574 362.7326,185.0564 367.0646,181.8754 C370.1456,179.6124 382.8146,184.5394 384.7966,187.9904 C387.6576,192.9694 384.5166,199.1144 378.8026,200.0514 C376.8546,200.3704 375.0566,201.5784 373.1096,201.9374 C371.0686,202.3124 368.1066,203.0784 366.9806,202.0704 C362.5826,198.1364 357.7066,201.0784 352.6616,199.7784 C352.3966,205.5244 352.0666,210.7514 351.9316,215.9844 C351.3946,236.9014 350.9376,257.8444 355.1426,278.4844 C356.2416,283.8764 358.2526,289.2304 360.7286,294.1594 C364.4606,301.5894 371.0646,305.3294 379.3716,304.8694 C397.7016,303.8544 413.3736,296.3074 426.7846,284.0834 C432.3316,279.0254 437.2356,273.2604 442.6756,267.5624 C439.4336,288.8604 430.2856,306.2504 411.5936,317.3334 C403.0116,322.4214 393.8266,326.5484 384.7166,330.6764 C368.5636,337.9974 353.5566,346.5934 345.2386,362.7654 C340.2796,357.1524 336.1066,350.7894 330.4146,346.3934 C322.9056,340.5954 314.3666,336.0414 305.9716,331.5064 C296.7906,326.5474 286.9716,322.7344 277.9596,317.5104 C259.4166,306.7614 250.2046,289.6334 246.6776,269.0184 C246.6166,268.6644 246.8066,268.2684 246.8816,267.8824" class="anchor" fill="#FFFFFF"></path>
				</g>
			</svg>

			` )
		}

		// Add last Anchor
		function addSVGAnchorEnd( elem ){ 
			elem.insertAdjacentHTML( 'afterend', `
			<?xml version="1.0" encoding="UTF-8"?>
			<svg class="anchor-marker" x="${elem.getPointAtLength( elem.getTotalLength() ).x - 15}" y="${elem.getPointAtLength( elem.getTotalLength() ).y - 27}" width="30px" height="30px" viewBox="0 0 690 689" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink">
				<g stroke="none" stroke-width="0" fill="none" fill-rule="evenodd">
					<path d="M344.5353,654.7629 C339.5983,646.8599 334.8383,639.4319 330.2643,631.8889 C296.7813,576.6619 262.8443,521.7029 230.0383,466.0759 C205.1533,423.8789 183.6073,379.8969 163.8953,335.0029 C155.5143,315.9169 147.8373,296.7939 143.9793,276.2119 C123.0143,164.3769 200.3643,55.2309 312.7993,38.1639 C413.0613,22.9449 507.7883,80.9579 538.8763,177.3629 C554.4223,225.5729 552.0513,273.5149 532.0773,320.1209 C515.4383,358.9439 497.2023,397.0339 477.0883,434.2139 C444.6273,494.2139 408.7653,552.1829 372.6263,609.9909 C364.1993,623.4719 355.7903,636.9629 347.3643,650.4439 C346.5513,651.7449 345.6833,653.0129 344.5353,654.7629" class="marker" fill="#000000"></path>
					<path d="M495.8643,239.6466 C495.8593,322.8916 427.8233,390.7686 344.3923,390.7646 C261.3883,390.7596 193.4343,322.6526 193.5363,239.5676 C193.6383,155.8166 261.4753,88.2976 345.3523,88.4646 C428.1923,88.6286 495.8693,156.6066 495.8643,239.6466" class="white-ring" fill="#FFFFFF"></path>
					<path d="M344.3013,378.1403 C267.3143,377.7933 205.8223,315.6953 206.1803,238.6563 C206.5353,161.9763 268.9243,100.6953 346.2363,101.0863 C422.3783,101.4713 483.5053,164.1913 483.0503,241.4653 C482.6083,316.8633 420.0533,378.4833 344.3013,378.1403" class="inside-fill" fill="#000000"></path>
					<path d="M353.9736,159.1054 C360.9766,155.9524 364.9176,147.4734 363.1086,139.4534 C361.0836,130.4834 353.1616,124.1674 344.1876,124.3664 C335.3516,124.5624 327.8556,131.0474 326.1636,139.9604 C324.6496,147.9424 328.7496,156.3204 335.5126,159.0604 C336.5076,151.2754 339.2416,148.0134 344.7426,148.0484 C350.0996,148.0834 352.7696,151.2814 353.9736,159.1054 M246.8816,267.8824 C252.0706,273.2954 256.9956,278.8494 262.3586,283.9414 C273.8886,294.8914 287.7296,301.4874 303.2926,304.3854 C317.6136,307.0514 327.5816,301.8124 331.4256,287.7734 C334.4956,276.5574 336.2926,264.7714 336.8866,253.1484 C337.7776,235.7354 337.1186,218.2444 337.1186,200.0124 C332.0136,200.9204 327.2156,198.1934 322.6406,201.9924 C321.4436,202.9854 318.7476,202.5864 316.8556,202.2264 C314.3586,201.7504 312.0096,200.5494 309.5346,199.8974 C306.0746,198.9864 303.3126,195.6784 303.2856,192.0904 C303.2566,188.0734 306.0666,184.8334 310.1246,183.8764 C312.3456,183.3544 314.4356,182.2194 316.6666,181.8154 C318.5856,181.4684 321.3326,180.9414 322.4786,181.9284 C326.5316,185.4164 330.9396,182.9934 335.8166,184.0134 C335.8166,179.4204 336.0456,175.3134 335.6566,171.2654 C335.5586,170.2514 333.5736,169.2514 332.2906,168.5464 C321.6466,162.6984 315.9786,153.8064 316.4926,141.6064 C316.9746,130.1324 324.9316,120.1794 335.7536,116.5714 C349.1616,112.1024 364.0526,118.4774 370.1136,131.2814 C376.2466,144.2424 371.7276,160.1744 359.0736,167.1244 C354.3296,169.7284 352.9246,172.6254 353.5156,177.4504 C353.7516,179.3864 353.5546,181.3754 353.5546,183.8604 C358.4136,183.1574 362.7326,185.0564 367.0646,181.8754 C370.1456,179.6124 382.8146,184.5394 384.7966,187.9904 C387.6576,192.9694 384.5166,199.1144 378.8026,200.0514 C376.8546,200.3704 375.0566,201.5784 373.1096,201.9374 C371.0686,202.3124 368.1066,203.0784 366.9806,202.0704 C362.5826,198.1364 357.7066,201.0784 352.6616,199.7784 C352.3966,205.5244 352.0666,210.7514 351.9316,215.9844 C351.3946,236.9014 350.9376,257.8444 355.1426,278.4844 C356.2416,283.8764 358.2526,289.2304 360.7286,294.1594 C364.4606,301.5894 371.0646,305.3294 379.3716,304.8694 C397.7016,303.8544 413.3736,296.3074 426.7846,284.0834 C432.3316,279.0254 437.2356,273.2604 442.6756,267.5624 C439.4336,288.8604 430.2856,306.2504 411.5936,317.3334 C403.0116,322.4214 393.8266,326.5484 384.7166,330.6764 C368.5636,337.9974 353.5566,346.5934 345.2386,362.7654 C340.2796,357.1524 336.1066,350.7894 330.4146,346.3934 C322.9056,340.5954 314.3666,336.0414 305.9716,331.5064 C296.7906,326.5474 286.9716,322.7344 277.9596,317.5104 C259.4166,306.7614 250.2046,289.6334 246.6776,269.0184 C246.6166,268.6644 246.8066,268.2684 246.8816,267.8824" class="anchor" fill="#FFFFFF"></path>
				</g>
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
			attr:{viewBox: `0 ${100 + ( boat._gsTransform.y / 2 ) } ${170 + boat._gsTransform.x} ${274 + ( boat._gsTransform.y / 8 )}`}
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
						attr:{viewBox: `0 ${100 + ( boat._gsTransform.y / 2 ) } ${170 + boat._gsTransform.x} ${274 + ( boat._gsTransform.y / 8 )}`}
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
				TweenMax.delayedCall( 2, nextAnimation )
			} )
		lineTl.play()

	}
}

export default setUpMap