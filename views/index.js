import header from './components/header/header.js'
import uploadForm from './components/uploadForm/uploadForm.js'
import setUpMap from './components/map/map.js'
import toggleToolButton from './components/storyAddItemButton/storyAddItemButton.js'
import { enhancedDetailInit } from './components/enhancedDetail/enhancedDetail.js'
import animateStoryOverview from './components/storyGrid/storyGrid.js'

( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return

	enhancedDetailInit()
	header()
	uploadForm()
	toggleToolButton()
	animateStoryOverview()
	setUpMap()
	
} )()
