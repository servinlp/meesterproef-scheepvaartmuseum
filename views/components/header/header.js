function header () { 

	const nav = document.querySelector( '.navigation #menu' )
	const navContainer = document.querySelector( '.navigation' )
	const navItems = document.querySelectorAll( '.navigation #menu li' )
	if ( !nav ) return
	const button = document.querySelector( '.header--container #toggle' )
	const gradient = document.querySelector( '.gradient' )
	const header = document.querySelector( '.header' )

	navContainer.classList.add( 'nav--progressive' )
	header.classList.add( 'header--fixed' )

	window.addEventListener( 'optimizedResize', sizeHeader )

	function sizeHeader(){
		if ( window.matchMedia( '(min-width: 48rem)' ).matches ) {
		/* the viewport is at least 48rem wide */
			TweenMax.set( nav, { autoAlpha: 1, scaleY: 1} )
			TweenMax.set( button, { autoAlpha: 0} )
			TweenMax.set( navItems, {autoAlpha: 1, x: 0} )
		} else {
		/* the viewport is less than 48rem wide */
			TweenMax.set( nav, { autoAlpha: 0, scaleY: 0, transformOrigin: 'top center'} )
			TweenMax.set( button, { autoAlpha: 1 } )
			TweenMax.set( navItems, {autoAlpha: 0, x: 100, ease: Power1.easeIn} )
		}		
	}
	sizeHeader()

	if ( document.querySelector( 'main' ) ) {
		document.querySelector( 'main' ).style='margin-top: 3rem;'
	}

	button.addEventListener( 'click', hamburgerToggle )
	gradient.addEventListener( 'click', hamburgerToggle ) 
	
	function hamburgerToggle() {
		gradient.classList.toggle( 'gradient--show' )

		if ( button.getAttribute( 'aria-expanded' ) === 'true' ) {
			button.setAttribute( 'aria-expanded', 'false' )
			TweenMax.to( nav, .2, {autoAlpha: 0, scaleY: 0, onComplete: () => {
				TweenMax.staggerTo( navItems, .1, {autoAlpha: 0, x: 100}, .05 )
			}} )
		} else {
			button.setAttribute( 'aria-expanded', 'true' )
			TweenMax.to( nav, .2, {autoAlpha: 1, scaleY: 1, onComplete: () => {
				TweenMax.staggerTo( navItems, .1, {autoAlpha: 1, x: 0}, .05 )
			}} )
		}
		if ( button.innerHTML === 'Menu' ) {
			button.innerHTML = 'Sluiten'
		} else {
			button.innerHTML = 'Menu'
		}
	}
}

export default header 