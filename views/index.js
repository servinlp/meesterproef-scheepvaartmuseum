import header from './components/header/header.js'
import './components/map/map.js'
( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return

	header()

} )()