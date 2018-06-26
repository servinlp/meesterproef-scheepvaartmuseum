
function notification( message ) {

	return new Promise( ( resolve, reject ) => {

		const container = document.createElement( 'div' ),
			p = document.createElement( 'p' ),
			buttonContainer = document.createElement( 'div' ),
			cancel = document.createElement( 'button' ),
			accept = document.createElement( 'button' ),
			bg = document.createElement( 'div' )

		p.textContent = message

		bg.classList.add( 'bg' )

		cancel.textContent = 'Cancel'
		cancel.addEventListener( 'click', rejectFunction )
		cancel.classList.add( 'button--secondary' )
		bg.addEventListener( 'click', rejectFunction )

		accept.textContent = 'Accept'
		accept.classList.add( 'button--primary' )
		accept.addEventListener( 'click', resolveFunction )

		container.classList.add( 'notification' )
		buttonContainer.classList.add( 'button-container' )

		container.appendChild( p )
		buttonContainer.appendChild( cancel )
		buttonContainer.appendChild( accept )
		container.appendChild( buttonContainer )

		document.body.appendChild( container )
		document.body.appendChild( bg )

		function rejectFunction() {

			cancel.removeEventListener( 'click', rejectFunction )
			bg.removeEventListener( 'click', rejectFunction )
			accept.removeEventListener( 'click', resolveFunction )

			bg.remove()
			container.remove()

			reject()

		}

		function resolveFunction() {

			cancel.removeEventListener( 'click', rejectFunction )
			bg.removeEventListener( 'click', rejectFunction )
			accept.removeEventListener( 'click', resolveFunction )

			bg.remove()
			container.remove()

			resolve()

		}

	} )

}

export default notification