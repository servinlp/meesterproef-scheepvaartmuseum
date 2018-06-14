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
	
	const fieldset = document.querySelector( '.upload-form fieldset' ),
		allInputElements = fieldset.querySelectorAll( '[data-index]' ),
		allTextareas = fieldset.querySelectorAll( 'textarea' ), 
	
		textarea = document.createElement( 'textarea' )

	// data-index so that we can see what index there at
	textarea.setAttribute( 'data-index', allInputElements.length )
	// Need to add the data-index here as well to be able to tell on the backend what index there at
	textarea.setAttribute( 'name', `storyText-${ allTextareas.length + 1 }-${ allInputElements.length }` )
	textarea.setAttribute( 'placeholder', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tristique nulla sed elit hendrerit gravida. Vivamus nunc neque, pharetra et elementum blandit, lacinia vitae turpis. Suspendisse laoreet sem vitae dui rhoncus euismod. Donec in vehicula ante, non tincidunt turpis. Vestibulum erat velit, bibendum in quam eu, iaculis placerat lacus. Sed consequat hendrerit sodales. Vestibulum laoreet ornare ultricies. Aenean pulvinar neque id ipsum ultricies luctus. Donec ornare in sapien quis sodales. In ac lacinia risus. Cras facilisis enim et volutpat rhoncus. Donec dapibus dolor leo, et volutpat mi porta quis. Morbi fringilla scelerisque consequat. Phasellus vel sem iaculis, vulputate nisi eget, ullamcorper metus. Ut maximus ullamcorper magna, eu viverra risus feugiat vehicula. ' )

	fieldset.appendChild( textarea )

}

function addFileInput() {

	const fieldset = document.querySelector( '.upload-form fieldset' ),
		allInputElements = fieldset.querySelectorAll( '[data-index]' ),
		allFileInputs = fieldset.querySelectorAll( '[type="file"]' ),
	
		input = document.createElement( 'input' )

	input.setAttribute( 'type', 'file' )
	input.setAttribute( 'multiple', true )
	input.setAttribute( 'data-index', allInputElements.length )
	input.setAttribute( 'name', `upload-${ allFileInputs.length + 1 }-${ allInputElements.length }` )

	fieldset.appendChild( input )

}

function addInput( type ) {

	const fieldset = document.querySelector( '.upload-form fieldset' ),
		allInputElements = fieldset.querySelectorAll( '[data-index]' ),
		allTextInputs = fieldset.querySelectorAll( `[type="text"][name^="${ type }"]` ),
	
		input = document.createElement( 'input' )

	input.setAttribute( 'type', 'text' )
	input.setAttribute( 'data-index', allInputElements.length )
	input.setAttribute( 'name', `${ type }-${ allTextInputs.length + 1 }-${ allInputElements.length }` )
	input.setAttribute( 'placeholder', 'Insert here' )

	fieldset.appendChild( input )

}

export default uploadForm