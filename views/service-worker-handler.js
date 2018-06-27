function initSW(){
	if ( 'serviceWorker' in navigator ) {
		// window.addEventListener( 'load', () => {
		// 	navigator.serviceWorker.register( '/lib/service-worker.js' ).then( registration => {
		// 	// Registration was successful
		// 		console.log( 'ServiceWorker registration successful with scope: ', registration.scope )
		// 	}, err => {
		// 	// registration failed :(
		// 		console.log( 'ServiceWorker registration failed: ', err )
		// 	} )
		// } )
	}
}

export default initSW