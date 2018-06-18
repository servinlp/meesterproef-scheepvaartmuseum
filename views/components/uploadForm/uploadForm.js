function uploadForm() {

	const form = document.querySelector( '.upload-form' )

	if ( !form ) return

	const dataAdd = Array.from( document.querySelectorAll( '[data-add]' ) )

	dataAdd.forEach( el => {

		el.addEventListener( 'click', addComponent )

	} )
	autoScaleInput()
	progressiveDiscloseForm()
}

function addComponent( e ) {

	const element = e.target,
		toAdd = element.getAttribute( 'data-add' )

	switch( toAdd ) {
		case 'textarea':
			addInput( 'subtitle' )
			addTextarea()
			break
		case 'file':
			addInput( 'subtitle' )
			addFileInput()
			break
		case 'videolink':
			addInput( 'subtitle' )	
			addInput( 'videolink' )
			break
		default:
	}
}

function addTextarea() {
	
	const fieldset = document.querySelector( '.upload-form .upload-form__story' ),
		buttonContainer = document.querySelector( '.upload-form__story--button-container' ),
		allInputElements = fieldset.querySelectorAll( '[data-index]' ),
		allTextareas = fieldset.querySelectorAll( 'textarea' ), 
	
		textarea = document.createElement( 'textarea' )

	// data-index so that we can see what index there at
	textarea.setAttribute( 'data-index', allInputElements.length )
	// Need to add the data-index here as well to be able to tell on the backend what index there at
	textarea.setAttribute( 'name', `storyText-${ allTextareas.length + 1 }-${ allInputElements.length }` )
	textarea.setAttribute( 'placeholder', 'Uw nieuwe alinea' )

	fieldset.insertBefore( textarea, buttonContainer )

}

function addFileInput() {

	const fieldset = document.querySelector( '.upload-form .upload-form__story' ),
		buttonContainer = document.querySelector( '.upload-form__story--button-container' ),
		allInputElements = fieldset.querySelectorAll( '[data-index]' ),
		allFileInputs = fieldset.querySelectorAll( '[type="file"]' ),
	
		input = document.createElement( 'input' )

	input.setAttribute( 'type', 'file' )
	input.setAttribute( 'multiple', true )
	input.setAttribute( 'data-index', allInputElements.length )
	input.setAttribute( 'name', `upload-${ allFileInputs.length + 1 }-${ allInputElements.length }` )

	fieldset.insertBefore( input, buttonContainer )

}

function addInput( type ) {

	const fieldset = document.querySelector( '.upload-form .upload-form__story' ),
		buttonContainer = document.querySelector( '.upload-form__story--button-container' ),
		allInputElements = fieldset.querySelectorAll( '[data-index]' ),
		allTextInputs = fieldset.querySelectorAll( `[type="text"][name^="${ type }"]` ),
	
		input = document.createElement( 'input' )

	input.setAttribute( 'type', 'text' )
	input.setAttribute( 'data-index', allInputElements.length )
	input.setAttribute( 'name', `${ type }-${ allTextInputs.length + 1 }-${ allInputElements.length }` )
	
	switch( type ) {
		case 'subtitle':
			input.setAttribute( 'placeholder', 'Ondertitel' )
			break
		case 'videolink':
			input.setAttribute( 'placeholder', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' )	
			break
		default:
	}


	fieldset.insertBefore( input, buttonContainer )
	input.focus()
}

function autoScaleInput(){
	const form = document.querySelector( '.upload-form' )

	if ( !form ) return

	const inputs = document.querySelectorAll( '.upload-form--natural-form input' )

	inputs.forEach( input => {
		input.addEventListener( 'input', () => {
			const length = input.value.length
			if( length > 10 ) {
				input.style = `width: ${length}px`
			}
			else {
				input.style = `width: ${input.getAttribute( 'placeholder' ).length}px`
			}
		} )
		input.style = `width: ${input.getAttribute( 'placeholder' ).length}px`
	} )
}

function progressiveDiscloseForm() {
	const form = document.querySelector( '.upload-form' )

	if ( !form ) return
	// Gets all parts of the upload form
	const parts = document.querySelectorAll( '[data-disclose="form"]' )
	const finishStoryButton = document.querySelector( '[data-finish="story"]' )
	finishStoryButton.style = 'display: block;'

	TweenMax.set( [ parts, '.upload-form__story', '.upload-form__finalize' ], { autoAlpha: 0 } )
	TweenMax.set( parts[0], { autoAlpha: 1 } )

	const inputElement = parts[0].querySelector( 'input' )
	const inputFontsize = parseInt( window.getComputedStyle( inputElement, null ).getPropertyValue( 'font-size' ) )
	const inputFontFamily = 'Open Sans'

	parts.forEach( ( part, i ) => {
		const input = part.querySelector( 'input' ) || part.querySelector( 'textarea' )
		
		if ( input !== null ) {
			input.style = `width: ${measureText( input.getAttribute( 'placeholder' ), inputFontsize, inputFontFamily ) }px`
			input.addEventListener( 'input', () => {
				uploadFormInputEvent( event.target, i, part )
			} )
			input.addEventListener( 'change', () => {
				uploadFormChangeEvent( event.target, i, part )
			} )
		}
	} )
	
	finishStoryButton.addEventListener( 'click', () => {
		TweenMax.to( '[data-disclose="done"]', .5, { autoAlpha: 1, onComplete: () => {
			document.querySelector( '[name="tags"]' ).focus()
		} } )
		TweenMax.to( finishStoryButton, .1, { autoAlpha: 0, height: 0, padding: 0, margin: 0 } )
	} )

	function uploadFormInputEvent( input, i, part ) {
		const length = input.value.length
		if ( length >= 3 ) {
			const nextElement = parts[i+1] || part.closest( '[data-disclose="form"]' )
			TweenMax.to( nextElement, .8, { autoAlpha: 1 }, .2 )
		}
		if( length > input.getAttribute( 'placeholder' ).length && input.tagName === 'INPUT' ) {
			input.style = `width: ${measureText( input.value, inputFontsize, inputFontFamily ) }px`
		}
		else {
			input.style = `width: ${measureText( input.getAttribute( 'placeholder' ), inputFontsize, inputFontFamily )}px`
		}
	}

	function uploadFormChangeEvent( input, i, part ) {
		const length = input.value.length
		if( input.tagName === 'INPUT' ) {
			TweenMax.to( input, .5, {width: `${measureText( input.value, inputFontsize, inputFontFamily )}px`} )
		}
		if ( length >= 1 ) {
			const nextElement = parts[i+1] || part.closest( '[data-disclose="form"]' )
			TweenMax.to( nextElement, .8, { autoAlpha: 1 } )
		}
	}

	// Handy JavaScript to meature the size taken to render the supplied text;
	// you can supply additional style information too if you have it.
	function measureText( pText, pFontSize, pFontFam ) {
		let lDiv = document.createElement( 'span' )

		document.body.appendChild( lDiv )

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

		return lResult.width
	}
}

export default uploadForm