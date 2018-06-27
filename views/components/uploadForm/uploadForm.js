import progressiveDiscloseForm from './progressiveDisclose.js'

function uploadForm() {

	const form = document.querySelector( '.upload-form' )

	if ( !form ) return

	const dataAdd = Array.from( document.querySelectorAll( '[data-add]' ) ),
		removeElement = document.querySelector( '.remove-element' )

	dataAdd.forEach( el => {

		el.addEventListener( 'click', addComponent )

	} )

	removeElement.addEventListener( 'click', removeComponent )

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
	
		textareaContainer = document.createElement( 'div' ),
		textarea = document.createElement( 'textarea' )

	// data-index so that we can see what index there at
	textarea.setAttribute( 'data-index', allInputElements.length )
	// Need to add the data-index here as well to be able to tell on the backend what index there at
	textarea.setAttribute( 'name', `storyText-${ allTextareas.length + 1 }-${ allInputElements.length }` )
	textarea.setAttribute( 'placeholder', 'Jouw nieuwe alinea' )

	textareaContainer.classList.add( 'element-container' )

	textareaContainer.appendChild( removeComponentButton( textarea ) )
	textareaContainer.appendChild( textarea )

	TweenMax.set( textareaContainer, {autoAlpha: 0, y: -10} )
	fieldset.insertBefore( textareaContainer, buttonContainer ) 	
	TweenMax.to( textareaContainer, .4, {autoAlpha: 1, y: 0, clearProps: 'all' } )

}

function addFileInput() {

	const fieldset = document.querySelector( '.upload-form .upload-form__story' ),
		buttonContainer = document.querySelector( '.upload-form__story--button-container' ),
		allInputElements = fieldset.querySelectorAll( '[data-index]' ),
		allFileInputs = fieldset.querySelectorAll( '[type="file"]' ),
	
		inputContainer = document.createElement( 'div' ),
		input = document.createElement( 'input' )
	const label = document.createElement( 'Label' )
	label.innerHTML = 'Bestand toevoegen'
	label.classList.add( 'labelFileInput' )

	input.setAttribute( 'type', 'file' )
	input.setAttribute( 'multiple', true )
	input.setAttribute( 'data-index', allInputElements.length )
	input.setAttribute( 'name', `upload-${ allFileInputs.length + 1 }-${ allInputElements.length }` )

	inputContainer.classList.add( 'element-container' )

	inputContainer.appendChild( removeComponentButton( input ) )
	inputContainer.appendChild( label )
	label.appendChild( input )
	label.insertAdjacentHTML( 'beforeend', `
	<svg xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
		<path d="M0 0h24v24H0z" fill="none"/>
	</svg>
	` )

	TweenMax.set( inputContainer, {autoAlpha: 0, y: -10} )
	fieldset.insertBefore( inputContainer, buttonContainer ) 	
	TweenMax.to( inputContainer, .4, {autoAlpha: 1, y: 0, clearProps: 'all' } )

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

		const fileInput = target.parentNode
		TweenMax.set( image, {autoAlpha: 0, y: -10} )
		fileInput.insertAdjacentElement( 'afterend', image )
		TweenMax.to( image, .4, {autoAlpha: 1, y: 0, clearProps: 'all' } )
	}

	function addAudio( file, target ) {
		const audio = document.createElement( 'audio' )
		const source = document.createElement( 'source' )
		audio.appendChild( source )

		audio.setAttribute( 'controls', '' )

		audio.classList.add( 'previewAudio' )

		source.src = URL.createObjectURL( file )

		const fileInput = target.parentNode

		TweenMax.set( audio, {autoAlpha: 0, y: -10} )
		fileInput.insertAdjacentElement( 'afterend', audio )
		TweenMax.to( audio, .4, {autoAlpha: 1, y: 0, clearProps: 'all' } )

	}

}


function addInput( type ) {

	const fieldset = document.querySelector( '.upload-form .upload-form__story' ),
		buttonContainer = document.querySelector( '.upload-form__story--button-container' ),
		allInputElements = fieldset.querySelectorAll( '[data-index]' ),
		allTextInputs = fieldset.querySelectorAll( `[type='text'][name^='${ type }']` ),
	
		inputContainer = document.createElement( 'div' ),
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

	inputContainer.classList.add( 'element-container' )

	inputContainer.appendChild( removeComponentButton( input ) )
	inputContainer.appendChild( input )

	TweenMax.set( inputContainer, {autoAlpha: 0, y: -10} )
	fieldset.insertBefore( inputContainer, buttonContainer )
	TweenMax.to( inputContainer, .4, {autoAlpha: 1, y: 0, clearProps: 'all' } )

	input.focus()


	function videoPreview() {
		const iframeLink = input.value
		if ( ! iframeLink.indexOf( 'https://youtube.com/' ) ) return
		if ( iframeLink.indexOf( '/watch?v=' ) ) {
			const replacedLink = iframeLink.replace( '/watch?v=', '/embed/' )
			const iframe = document.createElement( 'iframe' )
			iframe.classList.add( 'videoPreview' )
			iframe.src = replacedLink
			TweenMax.set( iframe, {autoAlpha: 0, y: -10} )
			event.target.insertAdjacentElement( 'afterEnd', iframe )
			TweenMax.to( iframe, .4, {autoAlpha: 1, y: 0, clearProps: 'all' } )
		
		} else if ( iframeLink.indexOf( '/embed/' ) ) {
			const iframe = document.createElement( 'iframe' )
			iframe.classList.add( 'videoPreview' )
			iframe.src = iframeLink
			TweenMax.set( iframe, {autoAlpha: 0, y: -10} )
			event.target.insertAdjacentElement( 'afterEnd', iframe )
			TweenMax.to( iframe, .4, {autoAlpha: 1, y: 0, clearProps: 'all' } )
		}
	}

	input.addEventListener( 'change',  videoPreview )
	
}

function removeComponentButton( targ ) {

	/*
	<?xml version='1.0' encoding='iso-8859-1'?>
	<svg version='1.1' id='Capa_1' xmlns='https://www.w3.org/2000/svg' xmlns:xlink='https://www.w3.org/1999/xlink' x='0px' y='0px'
		viewBox='0 0 486.4 486.4' style='enable-background:new 0 0 486.4 486.4;' xml:space='preserve'>
	<g>
		<g>
			<path d='M446,70H344.8V53.5c0-29.5-24-53.5-53.5-53.5h-96.2c-29.5,0-53.5,24-53.5,53.5V70H40.4c-7.5,0-13.5,6-13.5,13.5
				S32.9,97,40.4,97h24.4v317.2c0,39.8,32.4,72.2,72.2,72.2h212.4c39.8,0,72.2-32.4,72.2-72.2V97H446c7.5,0,13.5-6,13.5-13.5
				S453.5,70,446,70z M168.6,53.5c0-14.6,11.9-26.5,26.5-26.5h96.2c14.6,0,26.5,11.9,26.5,26.5V70H168.6V53.5z M394.6,414.2
				c0,24.9-20.3,45.2-45.2,45.2H137c-24.9,0-45.2-20.3-45.2-45.2V97h302.9v317.2H394.6z'/>
			<path d='M243.2,411c7.5,0,13.5-6,13.5-13.5V158.9c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v238.5
				C229.7,404.9,235.7,411,243.2,411z'/>
			<path d='M155.1,396.1c7.5,0,13.5-6,13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v208.9
				C141.6,390.1,147.7,396.1,155.1,396.1z'/>
			<path d='M331.3,396.1c7.5,0,13.5-6,13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v208.9
				C317.8,390.1,323.8,396.1,331.3,396.1z'/>
		</g>
	</g>
	</svg>

	<svg xmlns='https://www.w3.org/2000/svg' viewBox='0 0 486.4 486.4'><path d='M446 70H344.8V53.5c0-29.5-24-53.5-53.5-53.5h-96.2c-29.5 0-53.5 24-53.5 53.5V70H40.4c-7.5 0-13.5 6-13.5 13.5S32.9 97 40.4 97h24.4v317.2c0 39.8 32.4 72.2 72.2 72.2h212.4c39.8 0 72.2-32.4 72.2-72.2V97H446c7.5 0 13.5-6 13.5-13.5S453.5 70 446 70zM168.6 53.5c0-14.6 11.9-26.5 26.5-26.5h96.2c14.6 0 26.5 11.9 26.5 26.5V70H168.6V53.5zm226 360.7c0 24.9-20.3 45.2-45.2 45.2H137c-24.9 0-45.2-20.3-45.2-45.2V97h302.9v317.2h-.1z'/><path d='M243.2 411c7.5 0 13.5-6 13.5-13.5V158.9c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v238.5c0 7.5 6 13.6 13.5 13.6zM155.1 396.1c7.5 0 13.5-6 13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v208.9c0 7.5 6.1 13.5 13.5 13.5zM331.3 396.1c7.5 0 13.5-6 13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v208.9c0 7.5 6 13.5 13.5 13.5z'/></svg>
	*/

	const svgButton = document.createElement( 'button' ),
		svgNS = 'https://www.w3.org/2000/svg',
		svg = document.createElementNS( svgNS, 'svg' ),
		path = document.createElementNS( svgNS, 'path' ),
		stripes = document.createElementNS( svgNS, 'path' )

	svgButton.classList.add( 'remove-element' )

	svg.setAttribute( 'viewBox', '0 0 486.4 486.4' )

	path.setAttribute( 'd', 'M446 70H344.8V53.5c0-29.5-24-53.5-53.5-53.5h-96.2c-29.5 0-53.5 24-53.5 53.5V70H40.4c-7.5 0-13.5 6-13.5 13.5S32.9 97 40.4 97h24.4v317.2c0 39.8 32.4 72.2 72.2 72.2h212.4c39.8 0 72.2-32.4 72.2-72.2V97H446c7.5 0 13.5-6 13.5-13.5S453.5 70 446 70zM168.6 53.5c0-14.6 11.9-26.5 26.5-26.5h96.2c14.6 0 26.5 11.9 26.5 26.5V70H168.6V53.5zm226 360.7c0 24.9-20.3 45.2-45.2 45.2H137c-24.9 0-45.2-20.3-45.2-45.2V97h302.9v317.2h-.1z' )
	stripes.setAttribute( 'd', 'M243.2 411c7.5 0 13.5-6 13.5-13.5V158.9c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v238.5c0 7.5 6 13.6 13.5 13.6zM155.1 396.1c7.5 0 13.5-6 13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v208.9c0 7.5 6.1 13.5 13.5 13.5zM331.3 396.1c7.5 0 13.5-6 13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v208.9c0 7.5 6 13.5 13.5 13.5z' )


	svg.appendChild( path )
	svg.appendChild( stripes )
	svgButton.textContent = `Remove ${targ.name}`
	svgButton.appendChild( svg )
	console.log( targ.name, targ.id )
	svgButton.setAttribute( 'aria-controls', targ.id )

	svgButton.addEventListener( 'click', removeComponent )

	return svgButton

}

function removeComponent( e ) {

	const svg = e.target.tagName === 'path' ? e.target.parentNode : e.target,
		container = svg.parentNode

	svg.removeEventListener( 'click', removeComponent )

	container.remove()

}

/*
 * Prevents default behavior of pushing enter button. This method doesn't work,
 * if bind it to the 'onkeydown' of the document|form, or to the 'onkeypress' of
 * the input. So method should be attached directly to the input 'onkeydown'
 */
function preventEnterKey( e ) {
	// W3C (Chrome|FF) || IE
	e = e || window.event
	const keycode = e.which || e.keyCode
	if ( keycode === 13 ) { // Key code of enter button
		// Cancel default action
		if ( e.preventDefault ) { // W3C
			e.preventDefault()
		} else { // IE
			e.returnValue = false
		}
		// Cancel visible action
		if ( e.stopPropagation ) { // W3C
			e.stopPropagation()
		} else { // IE
			e.cancelBubble = true
		}
		// We don't need anything else
		return false
	}
}

/* Disable enter key for all inputs of the document */
function disableAllInputs() {
	const inputs = document.querySelectorAll( '.upload-form input' )
	if ( inputs ) {
		for ( let i = 0; i < inputs.length; i++ ) {
			inputs[i].onkeydown = preventEnterKey
		}
	}
}

export {
	uploadForm, 
	disableAllInputs
}
