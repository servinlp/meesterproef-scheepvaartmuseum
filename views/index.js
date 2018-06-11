import header from './components/header/header.js'
import toggleToolButton from './components/storyAddItemButton/storyAddItemButton.js'

( function iife() {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return

	header()
	toggleToolButton()

} )()
