function enhancedDetailInit() {
	if ( ! ( document.querySelector( '.detail__content' ) && document.querySelector( '.detail__content--container' ) ) ) return
	if ( 'IntersectionObserver' in window ) {
		enhancedDetail()
	} else {
		fallbackDetail()
	}
}

function enhancedDetail() {
	const contentElements = document.querySelectorAll( '.detail__content--container' )
	const config = {
		rootMargin: '0px 0px 0px 0px',
		threshold: 0.25
	}
	
	const contentObserver = new IntersectionObserver( ( entries, self ) => {
		entries.forEach( entry => {
			if ( entry.isIntersecting ) {
				preloadContent( entry.target )
				self.unobserve( entry.target )
			} 
		} )
	}, config )

	contentElements.forEach( content => {
		contentObserver.observe( content )
	} )

	function preloadContent( content ) {
		const element = content.querySelector( '.detail__content' )
		element.classList.add( 'visible' )
	}
}


function fallbackDetail() {
	const element = document.querySelectorAll( '.detail__content' )
	for ( const [ i ] of element.entries() ) {
		element[ i ].classList.add( 'visible' ) 
	}
}


export {
	enhancedDetailInit
}