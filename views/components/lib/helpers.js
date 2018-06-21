
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

export {
	capitalizeFirstLetter,
	optimizedResize
}