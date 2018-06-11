import header from './components/header/header.js'

( function iife() {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return

	header()

} )()