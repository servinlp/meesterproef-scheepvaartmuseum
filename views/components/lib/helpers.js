
// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter( string ) {

	return string.charAt( 0 ).toUpperCase() + string.slice( 1 )

}

const optimizedResize = () => {
	const throttle = function( type, name, obj ) {
		obj = obj || window
		let running = false
		const func = function() {
			if ( running ) { return }
			running = true
			requestAnimationFrame( () => {
				obj.dispatchEvent( new CustomEvent( name ) )
				running = false
			} )
		}
		obj.addEventListener( type, func )
	}

	/* init - you can init any event */
	throttle( 'resize', 'optimizedResize' )
}

function animateOnIntersect() {
	if ( !window.IntersectionObserver ) return
	const elements = document.querySelectorAll( '[data-intersect]' )
	
	TweenMax.set( elements, { autoAlpha: .25, y: 100 } )

	const config = {
		rootMargin: '0px 0px 0px 0px',
		threshold: 0.25
	}

	const contentObserver = new IntersectionObserver( ( entries, self ) => {
		entries.forEach( entry => {
			if ( entry.isIntersecting ) {
				preloadContent( entry.target )
				self.unobserve( entry.target )
			}
		} )
	}, config )

	elements.forEach( content => {
		contentObserver.observe( content )
	} )

	function preloadContent( content ) {
		TweenMax.to( content, .6, { autoAlpha: 1, y: 0, clearProps: 'all', ease: Power1.easeOut, onComplete() {
			content.classList.add( 'show' )
		} }, .25 )
	}
}

function fireInstallPrompt(){
	let deferredPrompt

	window.addEventListener( 'beforeinstallprompt', e => {
		console.log( 'beforeinstallprompt Event fired' )
		e.preventDefault()
				
		// Stash the event so it can be triggered later.
		deferredPrompt = e
		
		return false
	} )

	if ( document.querySelector( '.detailpage--main' ) ) {
		setTimeout( addListener, 6000 )
	}
	function addListener(){
		if ( deferredPrompt !== undefined ) {
			// The user has had a postive interaction with our app and Chrome
			// has tried to prompt previously, so let's show the prompt.
			deferredPrompt.prompt()
					
			// Follow what the user has selected.
			deferredPrompt.userChoice.then( choiceResult => {
							
				if ( choiceResult.outcome === 'dismissed' ) {
					console.log( 'User cancelled homescreen install' )
				}
				else {
					console.log( 'User added to homescreen' )
				}
				
				// We no longer need the prompt.  Clear it up.
				deferredPrompt = null
			} )
		}
	}
}


export {
	capitalizeFirstLetter,
	optimizedResize,
	animateOnIntersect,
	fireInstallPrompt
}