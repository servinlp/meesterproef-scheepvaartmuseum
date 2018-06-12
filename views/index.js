import header from './components/header/header.js'
import uploadFormTest from './components/uploadForm/uploadForm.js'

( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return

	header()
	uploadFormTest()

} )()