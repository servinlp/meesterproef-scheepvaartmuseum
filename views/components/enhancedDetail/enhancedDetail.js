function enhancedDetail() {
	console.log('enhanced')
	const loadContentElement = function() {
	const contentElements = document.querySelectorAll('.detail__content')
	const config = {
		rootMargin: '0px 0px 0px 0px',
		treshold: 0
	}
	
	let contentObserver = new IntersectionObserver(function(entries, self) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				console.log('in Viewport')
				preloadContent(entry.target)
				self.unobserve(entry.target)
			} 
		})
	}, config )

	contentElements.forEach(content => {
		contentObserver.observe(content)
	})

	function preloadContent(content) {
		const element = content.querySelector('.detail__content--container')
		element.classList.add('visible')

	}

} 

loadContentElement()
}


function fallbackDetail() {
	console.log('fallback')
	const element = document.querySelectorAll('.detail__content--container')
	for (let [i] of element.entries()) {
    	element[i].classList.add('visible') 
	}
	}


export {
	enhancedDetail, fallbackDetail
}