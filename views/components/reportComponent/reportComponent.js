
function initReportComponent() {

	const container = document.querySelector( '.report--container' )

	if ( !container ) return

	const formInputs = Array.from( container.querySelectorAll( 'input' ) )

	formInputs.forEach( el => {

		setCorrectChecked( el )
		el.addEventListener( 'change', updateReport )

	} )

}

function updateReport( e ) {

	const input = e.target,
		name = input.getAttribute( 'name' ),

		form = input.parentNode.parentNode,
		action = form.getAttribute( 'action' )

	fetch( action, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify( {
			js: true,
			[ name ]: input.checked ? 'on' : 'off'
		} )
	} ).then( res => res.json() )
		.then( res => {

			console.log( res )

		} )
		.catch( err => console.error( err ) )

}

/**
 * Because browsers tent to "remember" what it was. Even if it was from a different page...
*/
function setCorrectChecked( el ) {

	if ( el.getAttribute( 'checked' ) === 'false' && el.checked ) {

		el.checked = false

	} else if ( el.getAttribute( 'checked' ) === 'true' && !el.checked ) {

		el.checked = true

	}

}

export default initReportComponent