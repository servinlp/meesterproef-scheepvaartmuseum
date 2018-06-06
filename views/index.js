import header from './components/header/header.js'
import toggleToolButton from './components/addstory/addstory.js'

( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return

	header()
	toggleToolButton()

} )()
