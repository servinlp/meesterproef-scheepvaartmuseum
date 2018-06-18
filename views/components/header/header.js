function header () { 

	const nav = document.querySelector( '.navigation' )
	if ( !nav ) return
	const button = document.querySelector( '.header--container button' )
	const gradient = document.querySelector( '.gradient' )
	const header = document.querySelector( '.header' )

	nav.classList.add( 'nav--hide' )
	nav.classList.add( 'nav--progressive' )
	header.classList.add( 'header--fixed' )

	button.addEventListener( 'click', hamburgerToggle )
	gradient.addEventListener( 'click', gradientToggle ) 

	function hamburgerToggle (){
		gradient.classList.toggle( 'gradient--show' )
		nav.classList.toggle( 'nav--hide' )
		document.body.classList.toggle( 'overflow--hidden' )

		if ( button.innerHTML === '☰' ) {
			button.innerHTML = '╳'
		} else {
			button.innerHTML = '☰'
		}
	}

	function gradientToggle (){
		nav.classList.toggle( 'nav--hide' )
		document.body.classList.toggle( 'overflow--hidden' )
		gradient.classList.toggle( 'gradient--show' )

		if ( button.innerHTML === '☰' ) {
			button.innerHTML = '╳'
		} else {
			button.innerHTML = '☰'
		}
	}
}

export default header 