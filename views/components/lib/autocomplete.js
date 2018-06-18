import config from './config.js'
import { capitalizeFirstLetter } from './helpers.js'

function autocompleteFromApiInit() {

	const autocomplete = Array.from( document.querySelectorAll( '.autocomplete input' ) )
	
	// Uses fetch so disable if fetch is not supported
	if ( !autocomplete[ 0 ] || !( 'fetch' in window ) ) return

	autocomplete.forEach( el => {

		el.addEventListener( 'input', autocompleteFromApi )

	} )

}

async function autocompleteFromApi( e ) {

	const el = e.target,
		parent = el.parentNode,

		value = el.value.toLowerCase(),
		
		lastIndexComma = value.lastIndexOf( ',' ),
		lastIndexSpace = value.lastIndexOf( ' ' ),
		lastIndex = ( lastIndexComma > lastIndexSpace ? lastIndexComma : lastIndexSpace ) + 1,

		apiType = parent.getAttribute( 'data-search' ),
		api = config.api[ parent.getAttribute( 'data-search' ) ],
		substr = value.substr( lastIndex, value.length ),
		str = apiType === 'tags' ? substr : value

	if ( str.length >= 3 ) {

		try {

			// To first clear the old ul
			destroyList( parent )

			const data = await getDataFromApi( `${ api }?search=${ str }` ),
				ul = createList( data )

			parent.appendChild( ul )

		} catch( err ) {

			console.error( err )

		}
		
	} else {

		destroyList( parent )

	}

}

function createList( data ) {

	const ul = document.createElement( 'ul' )

	// If data.length === 0
	if ( !data.length ) {

		const li = document.createElement( 'li' )
		li.textContent = 'No matches'
		ul.appendChild( li )

	} else {

		const fragment = document.createDocumentFragment()

		data.forEach( el => {

			const li = document.createElement( 'li' )
			li.textContent = capitalizeFirstLetter( el )

			li.addEventListener( 'click', selectTag )

			fragment.appendChild( li )

		} )

		ul.appendChild( fragment )

	}

	return ul

}

function destroyList( parent ) {

	const ul = parent.querySelector( 'ul' )

	if ( !ul ) return

	const lis = Array.from( ul.querySelectorAll( 'li' ) )

	lis.forEach( li => {

		li.removeEventListener( 'click', selectTag )

	} )

	ul.remove()

}

function selectTag( e ) {

	const target = e.target,
		parent = target.parentNode.parentNode,
		input = parent.querySelector( 'input' ),

		inputValue = input.value,
		value = target.textContent

	// If first tag
	if ( !inputValue.includes( ',' ) && !inputValue.includes( ' ' ) ) {

		input.value = value

	} else {

		const lastIndexComma = inputValue.lastIndexOf( ',' ),
			lastIndexSpace = inputValue.lastIndexOf( ' ' ),
			lastIndex = ( lastIndexComma > lastIndexSpace ? lastIndexComma : lastIndexSpace ) + 1,

			cutInputValue = inputValue.substr( 0, lastIndex )
		
		input.value = cutInputValue + value

	}

	destroyList( parent )

}

function getDataFromApi( api ) {

	return new Promise( ( resolve, reject ) => {

		fetch( api )
			.then( res => res.json() )
			.then( res => {

				if ( res.succes ) {

					resolve( res.data )

				} else {

					reject( res.message )

				}

			} )
			.catch( err => reject( err ) )

	} )

}

export default autocompleteFromApiInit