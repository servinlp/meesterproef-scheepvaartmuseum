
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


export {
	capitalizeFirstLetter,
	optimizedResize,
	animateOnIntersect
}