import header from './components/header/header.js'
import uploadFormTest from './components/uploadForm/uploadForm.js'
import setUpMap from './components/map/map.js'
import toggleToolButton from './components/storyAddItemButton/storyAddItemButton.js'
import { enhancedDetailInit } from './components/enhancedDetail/enhancedDetail.js'

( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return
	
	enhancedDetailInit()	
	header()
	uploadFormTest()
	toggleToolButton()
	
	setUpMap()

	toggleToolButton()
} )()