function uploadForm() {

	const form = document.querySelector( '.upload-form' )

	if ( !form ) return

	const dataAdd = Array.from( document.querySelectorAll( '[data-add]' ) )

	dataAdd.forEach( el => {

		el.addEventListener( 'click', addComponent )

	} )

}

function addComponent( e ) {

	const element = e.target,
		toAdd = element.getAttribute( 'data-add' )

	switch( toAdd ) {
		case 'textarea':
			addTextarea()
			break
		case 'file':
			addFileInput()
			break
		case 'subtitle':
			addInput( 'subtitle' )
			break
		case 'videolink':
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
	textarea.setAttribute( 'placeholder', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tristique nulla sed elit hendrerit gravida. Vivamus nunc neque, pharetra et elementum blandit, lacinia vitae turpis. Suspendisse laoreet sem vitae dui rhoncus euismod. Donec in vehicula ante, non tincidunt turpis. Vestibulum erat velit, bibendum in quam eu, iaculis placerat lacus. Sed consequat hendrerit sodales. Vestibulum laoreet ornare ultricies. Aenean pulvinar neque id ipsum ultricies luctus. Donec ornare in sapien quis sodales. In ac lacinia risus. Cras facilisis enim et volutpat rhoncus. Donec dapibus dolor leo, et volutpat mi porta quis. Morbi fringilla scelerisque consequat. Phasellus vel sem iaculis, vulputate nisi eget, ullamcorper metus. Ut maximus ullamcorper magna, eu viverra risus feugiat vehicula. ' )

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
	input.setAttribute( 'placeholder', 'Insert here' )

	fieldset.insertBefore( input, buttonContainer )

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
			} )
			input.addEventListener( 'change', () => {
				const length = input.value.length
				if( input.tagName === 'INPUT' ) {
					TweenMax.to( input, .5, {width: `${measureText( input.value, inputFontsize, inputFontFamily )}px`} )
				}
				if ( length >= 1 ) {
					const nextElement = parts[i+1] || part.closest( '[data-disclose="form"]' )
					TweenMax.to( nextElement, .8, { autoAlpha: 1 } )
				}
			} )
		}
	} )
	finishStoryButton.addEventListener( 'click', () => {
		TweenMax.to( '[data-disclose="done"]', .8, { autoAlpha: 1 } )
	} )
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

function addTagSuggestions() {
	const form = document.querySelector( '.upload-form' )

	if ( !form ) return

	const tagInput = document.querySelector( '[name="tags"]' )
	/* Do a SQL querie here
	 */
	const results = [ 'tag', 'oranje', 'paars', 'blauw', 'walvis' ]
	results.forEach( result => {
		const suggestion = document.createElement( 'button' )
		suggestion.type = 'button'
		suggestion.classList.add( 'upload-form__tag-suggestion' )
		suggestion.textContent = result
		suggestion.dataset.tag = result
		tagInput.insertAdjacentElement( 'afterend', suggestion )
		addEvents( suggestion )
	} )
	function addEvents( elem ) {
		elem.addEventListener( 'click', () => {
			console.log( tagInput )
			console.log( tagInput.value )
			if( tagInput.value === '' ) {
				console.log( 'adding tag' )
				console.log( event.target.dataset.tag )
				tagInput.value += event.target.dataset.tag
			}
			else {
				console.log( 'adding tag with comma' )
				tagInput.value += `, ${event.target.dataset.tag}`
			}
		} )
	}
}

export {
	uploadForm,
	autoScaleInput,
	progressiveDiscloseForm,
	addTagSuggestions
}