
function progressiveDiscloseForm() {
	const form = document.querySelector( '.upload-form' )

	if ( !form ) return
	// Gets all parts of the upload form
	const parts = document.querySelectorAll( '[data-disclose="form"]' )
	// Progressive enhancement
	const finishStoryButton = document.querySelector( '[data-finish="story"]' )
	finishStoryButton.style = 'display: block;'
	// Show first form element
	TweenMax.set( parts[0], { autoAlpha: 1, height: '100%' } )

	// For measureText function
	const inputElement = parts[0].querySelector( 'input' )
	const inputFontsize = parseInt( window.getComputedStyle( inputElement, null ).getPropertyValue( 'font-size' ) )
	const inputFontFamily = 'Open Sans'

	// For every part of the form that we want to disclose
	parts.forEach( ( part, i ) => {
		const input = part.querySelector( 'input' ) || part.querySelector( 'textarea' )
		
		if ( input !== null ) {
			// Sets the width to the width of the placeholder with measureText
			input.style = `width: ${measureText( input.getAttribute( 'placeholder' ), inputFontsize, inputFontFamily ) }px`
			// Update width on input
			input.addEventListener( 'input', event => {
				uploadFormInputEvent( event.target, i, part )
			} )
			// Update width on change (for pasting and autocomplete)
			input.addEventListener( 'change', event => {
				uploadFormChangeEvent( event.target, i, part )
			} )
		}
	} )
	// Shows section after story is finished
	finishStoryButton.addEventListener( 'click', () => {
		TweenMax.to( '[data-disclose="done"]', .5, { autoAlpha: 1, height: '100%', onComplete: () => {
			document.querySelector( '.upload-form__finalize input' ).focus()
		} } )
		TweenMax.to( finishStoryButton, .1, { autoAlpha: 0, height: 0, padding: 0, margin: 0 } )
	} )

	function uploadFormInputEvent( input, i, part ) {
		const length = input.value.length
		// Shows the next element
		if ( length >= 3 ) {
			const nextElement = parts[i+1] || part.closest( '[data-disclose="form"]' )
			TweenMax.to( nextElement, .8, { autoAlpha: 1, height: '100%' } )
		}
		// Dynamic input width change
		if( length > input.getAttribute( 'placeholder' ).length && input.tagName === 'INPUT' ) {
			input.style = `width: ${measureText( input.value, inputFontsize, inputFontFamily ) }px`
		}
		else {
			// Dynamic input width change
			input.style = `width: ${measureText( input.getAttribute( 'placeholder' ), inputFontsize, inputFontFamily )}px`
		}
	}

	function uploadFormChangeEvent( input, i, part ) {
		const length = input.value.length
		// Dynamic input width change
		if( input.tagName === 'INPUT' ) {
			TweenMax.to( input, .5, {width: `${measureText( input.value, inputFontsize, inputFontFamily )}px`} )
		}
		// Shows the next element
		if ( length >= 1 ) {
			const nextElement = parts[i+1] || part.closest( '[data-disclose="form"]' )
			TweenMax.to( nextElement, .8, { autoAlpha: 1, height: '100%' } )
		}
	}

	// Measures rendered text
	function measureText( pText, pFontSize, pFontFam ) {
		let lDiv = document.createElement( 'span' )

		document.body.appendChild( lDiv )

		lDiv.style.display = 'block'
		lDiv.style.fontFamily = pFontFam
		lDiv.style.fontSize = '' + pFontSize + 'px'
		lDiv.style.position = 'absolute'
		lDiv.style.left = -1000
		lDiv.style.top = -1000

		lDiv.innerHTML = pText

		const lResult = {
			width: lDiv.getBoundingClientRect().width,
			height: lDiv.clientHeight
		}

		document.body.removeChild( lDiv )
		lDiv = null

		return ( lResult.width + 30 )
	}
}

export default progressiveDiscloseForm