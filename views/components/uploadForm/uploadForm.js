function uploadForm() {

	const form = document.querySelector( '.upload-form' )

	if ( !form ) return

	const dataAdd = Array.from( document.querySelectorAll( '[data-add]' ) )

	dataAdd.forEach( el => {

		el.addEventListener( 'click', addComponent )

	} )
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
	textarea.setAttribute( 'placeholder', 'Jouw nieuwe alinea' )

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
	TweenMax.set( input, {autoAlpha: 0, y: -10} )
	fieldset.insertBefore( input, buttonContainer )
	TweenMax.to( input, .4, {autoAlpha: 1, y: 0} )

	if ( window.formData !== undefined ) return
	input.addEventListener( 'change', addFiles )

	function addFiles( event ) {
		const files = event.target.files
		for ( const file in files ) {
			if ( files.hasOwnProperty( file ) ) {
				const fileNum = files[file]
				const type = fileNum.type

				if ( type.includes( 'image' ) ) {
					addImage( fileNum, event.target )

				} else if ( type.includes( 'audio' ) ) {

					addAudio( fileNum, event.target )

				}

			}
		}

	}

	function addImage( file, target ) {
		const image = document.createElement( 'img' )

		image.classList.add( 'previewImage' )

		image.src = URL.createObjectURL( file )

		const fileInput = target
		fileInput.insertAdjacentElement( 'afterEnd', image )

	}

	function addAudio( file, target ) {
		const audio = document.createElement( 'audio' )
		const source = document.createElement( 'source' )
		audio.appendChild( source )

		audio.setAttribute( 'controls', '' )

		audio.classList.add( 'previewAudio' )

		source.src = URL.createObjectURL( file )

		const fileInput = target
		fileInput.insertAdjacentElement( 'afterEnd', audio )

	}

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
			input.setAttribute( 'placeholder', '(Optioneel) Subtitel' )
			break
		case 'videolink':
			input.setAttribute( 'placeholder', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' )
			break
		default:
	}


	fieldset.insertBefore( input, buttonContainer )
	input.focus()


	function videoPreview() {
		const iframeLink = input.value
		if ( ! iframeLink.indexOf( 'https://youtube.com/' ) ) return
		if ( iframeLink.indexOf( '/watch?v=' ) ) {
			const replacedLink = iframeLink.replace( '/watch?v=', '/embed/' )
			const iframe = document.createElement( 'iframe' )
			iframe.classList.add( 'videoPreview' )
			iframe.src = replacedLink
			event.target.insertAdjacentElement( 'afterEnd', iframe )
		} else if ( iframeLink.indexOf( '/embed/' ) ) {
			const iframe = document.createElement( 'iframe' )
			iframe.classList.add( 'videoPreview' )
			iframe.src = iframeLink
			event.target.insertAdjacentElement( 'afterEnd', iframe )
		}
	}

	input.addEventListener( 'change',  videoPreview )
}

function progressiveDiscloseForm() {
	const form = document.querySelector( '.upload-form' )

	if ( !form ) return
	// Gets all parts of the upload form
	const parts = document.querySelectorAll( '[data-disclose="form"]' )
	// Progressive enhancement
	const finishStoryButton = document.querySelector( '[data-finish="story"]' )
	finishStoryButton.style = 'display: block;'
	// Hides form elements
	TweenMax.set( [ parts, '.upload-form__story', '.upload-form__finalize' ], { autoAlpha: 0 } )
	// Show first form element
	TweenMax.set( parts[0], { autoAlpha: 1 } )

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
		TweenMax.to( '[data-disclose="done"]', .5, { autoAlpha: 1, onComplete: () => {
			document.querySelector( '.upload-form__finalize input' ).focus()
		} } )
		TweenMax.to( finishStoryButton, .1, { autoAlpha: 0, height: 0, padding: 0, margin: 0 } )
	} )

	function uploadFormInputEvent( input, i, part ) {
		const length = input.value.length
		// Shows the next element
		if ( length >= 3 ) {
			const nextElement = parts[i+1] || part.closest( '[data-disclose="form"]' )
			TweenMax.to( nextElement, .8, { autoAlpha: 1 }, .2 )
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
			TweenMax.to( nextElement, .8, { autoAlpha: 1 } )
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

		return ( lResult.width + 20 )
	}
}

export default uploadForm
