import header from './components/header/header.js'
import uploadForm from './components/uploadForm/uploadForm.js'
import setUpMap from './components/map/map.js'
import toggleToolButton from './components/storyAddItemButton/storyAddItemButton.js'
import animateStoryOverview from './components/storyGrid/storyGrid.js'
import autocompleteFromApiInit from './components/lib/autocomplete.js'

( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return
	animateStoryOverview()
	header()
	uploadForm()
	toggleToolButton()
	setUpMap()
	autocompleteFromApiInit()

} )()
