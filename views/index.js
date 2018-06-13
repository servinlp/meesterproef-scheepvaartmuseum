import header from './components/header/header.js'
import setUpMap from './components/map/map.js'
import toggleToolButton from './components/storyAddItemButton/storyAddItemButton.js'
// import animateSearchAndSort from './components/searchAndSort/searchAndSort.js'
import { enhancedDetail, fallbackDetail } from './components/enhancedDetail/enhancedDetail.js'

( function IIFE () {

	if( !( document.documentElement.classList && document.querySelectorAll ) ) return

	TweenMax.staggerFrom('header + *', 1, { autoAlpha: 0, y: -20 }, 0.1)
	TweenMax.set(['[class*="card"] h2', '[class*="card"] p'], {autoAlpha: 0, y: -20} )
	TweenMax.staggerFrom('[class*="card"]', 1, { delay: .4, autoAlpha: 0, x: -20, onComplete: () => {
		TweenMax.staggerTo(['[class*="card"] h2', '[class*="card"] p'], 1, {autoAlpha: 1, y: 0, onComplete: () => {
			TweenMax.set(['[class*="card"] h2', '[class*="card"] p', '[class*="card"]', 'header + *'], { clearProps: 'all' } )
		}}, 0.1 )
	} }, 0.2)

	header()
	toggleToolButton()
	// animateSearchAndSort()
	if (document.querySelector('main > .map')) {
		setUpMap()
	}

	if ( 'IntersectionObserver' in window) {
		enhancedDetail()
	} else {
		fallbackDetail()
	}

	

} )()