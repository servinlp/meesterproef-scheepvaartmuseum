import notification from '../notification/notification.js'

function removeStoryInit() {

	const removeStoryLists = Array.from( document.querySelectorAll( '.remove-story' ) )

	if ( !removeStoryLists ) return

	removeStoryLists.forEach( l => {

		const el = l.querySelector( 'form' )

		el.addEventListener( 'submit', callPrompt )

	} )

}

function callPrompt( e ) {

	e.preventDefault()

	notification( 'Are you sure you want to remove this story?' )
		.then( () => {

			e.target.submit()

		} )
		.catch( () => {} )


}

export default removeStoryInit