
function colorThief (){
	const image = document.querySelector( '.story--container-image img' )
	if ( !image ) return
	const xhr = new XMLHttpRequest()
	xhr.responseType = 'arraybuffer'
	xhr.onload = function () {
		 let contentType = xhr.getResponseHeader( 'content-type' ),
			 blob = new Blob( [ xhr.response ], {type: contentType} ),
			 img = document.createElement( 'img' )
		 img.src = window.URL.createObjectURL( blob )
		 img.onload = function() {
			const colorThief = new ColorThief()
			const color = colorThief.getColor( img )
			console.log( 'rgb('+color+')' )
			const colorRGB = 'rgb('+color+')'
			const background = document.querySelector( '.story--container' )
			console.log( background )
			background.style.background = colorRGB
	
			//window.URL.revokeObjectURL(img.src) // Use this after you're done with the image and no longer needed
		  }
	}
	// image.crossOrigin = 'Anonymous'
	// image.src = 'https://www.hetscheepvaartmuseum.nl/sites/default/files/2018-02/2309_0.jpg'
	console.log( image.src )
	xhr.open( 'GET', image.src )
	xhr.send()
} 

export default colorThief
