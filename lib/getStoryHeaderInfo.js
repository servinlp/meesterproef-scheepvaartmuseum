
/**
 * @param {Object} el - the story object with content ( el.content )
*/
function getStoryHeaderInfo( el ) {

	// If el.content exists (some stories don't have content...)
	// Check for the type (l.type === 'text')
	const text = el.content && el.content.filter( l => l.type === 'text' )[ 0 ],
		image = el.content && el.content.filter( l => l.type.includes( 'image' ) )[ 0 ]

	if ( text ) {

		// Only return the first 50 characters
		el.text = text.text.substr( 0, 50 ) + '...'

	}

	if ( image )
		el.image = image.link

}

module.exports = getStoryHeaderInfo