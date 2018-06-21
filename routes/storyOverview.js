const express = require( 'express' ),
	router = express.Router(),
	pool = require( '../lib/mysql' ),
	getThumbnailContent = require( '../lib/getThumbnailContent' ),

	LIMITPERPAGE = 2

router.get( '/', async ( req, res ) => {

	try {

		let pageIndex = 1

		if ( req.query.index )
			pageIndex = parseInt( req.query.index )

		const [ numberOfStories, AllStories ] = await Promise.all( [
				pool.query( 'SELECT ID FROM stories' ),
				pool.query( 'SELECT ID, title, components FROM stories LIMIT ?, ?', [ ( pageIndex - 1 ) * LIMITPERPAGE, LIMITPERPAGE ] )
			] ),
			storiesWithContent = await getThumbnailContent( AllStories )

		res.render( 'storyOverview', {
			pageIndex,
			numOfPages: Math.ceil( numberOfStories.length / LIMITPERPAGE ),
			content: storiesWithContent,
			path: '/story-overview'
		} )

	} catch ( error ) {

		console.error( error )
		res.render( 'storyOverview', {
			content: [],
			path: '/story-overview'
		} )

	}

} )

module.exports = router