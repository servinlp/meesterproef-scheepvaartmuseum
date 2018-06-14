function animateStoryOverview() {
	const storyGridTl = new TimelineMax()

	TweenMax.set( [ '[class*="card"] h2', '[class*="card"] p' ], { autoAlpha: 0, y: -20 } )
	storyGridTl
		.staggerFrom( 'header + *', .6, { autoAlpha: 0, y: -20 }, 0.1 )
		.staggerFrom( '[class*="card"]', .4, { autoAlpha: 0, x: -20 }, .1 )
		.staggerTo( [ '[class*="card"] h2', '[class*="card"] p' ], .6, { autoAlpha: 1, y: 0 }, .1 )
		.set( [ '[class*="card"] h2', '[class*="card"] p', '[class*="card"]', 'header + *' ], { clearProps: 'all' } )
	
	storyGridTl
		.play()
}

export default animateStoryOverview