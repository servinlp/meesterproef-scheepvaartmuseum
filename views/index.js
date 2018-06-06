import header from './components/header/header.js'

( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return

	header()

} )()