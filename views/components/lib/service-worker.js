const CACHE = 'cache-v1',
	STATIC_CACHE = 'static-cache-v1'

self.addEventListener( 'install', event => {

	event.waitUntil(
		caches.open( STATIC_CACHE )
			.then( cache => cache.addAll( [
				// '/scripts/TweenMax.min.js',
				// '/scripts/MorphSVG.min.js',
				// '/scripts/DrawSVG.min.js',
				// '/scripts/colorThief.js',
			] ) )
			.then( self.skipWaiting() )
			.catch( e => console.error( 'SW STATIC_CACHE error:', e ) )
	)

} )

self.addEventListener( 'fetch', event => {
	event.respondWith(
		fetch( event.request )
			.then( response => toPageCache( event.request, response ) )
			.catch( () => fromPageCache( event.request ) )
			.catch( () => fetchCoreFile( '/offline/' ) )
	)
} )

function fromPageCache( request ) {

	return caches.open( STATIC_CACHE )
		.then( cache => cache.match( request ) )
		.then( cacheRes => {

			// First check if it's in statuc cache
			if ( cacheRes ) {

				return cacheRes

			} else {

				return caches.open( CACHE )
					.then( cache => cache.match( request ) )
					.then( response => response ? response : Promise.reject() )

			}

		} )

}

function toPageCache( request, response ) {

	const clone = response.clone()

	return caches.open( STATIC_CACHE )
		.then( cache => cache.match( request.url ) )
		.then( cacheRes => {

			// First check if it's in static cache
			if ( cacheRes ) {

				return cacheRes

			} else {

				caches.open( CACHE )
					.then( cache => cache.put( request, clone ) )
					.catch( e => console.error( 'SW error:', e ) )

				return response

			}

		} )

}

function fetchCoreFile( url ) {

	return caches.open( STATIC_CACHE )
		.then( cache => cache.match( url ) )
		.then( response => response ? response : Promise.reject() )
        
}