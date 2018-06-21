const express = require( 'express' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' ),
	getThumbnailContent = require( '../lib/getThumbnailContent' )

router.get( '/', async ( req, res ) => {

	try {

		const featuredStories = await pool.query( 'SELECT ID, title, components FROM stories WHERE featured = 1' ),
			storiesWithContent = await getThumbnailContent( featuredStories )

		res.render( 'index', {
			content: storiesWithContent
		} )

	} catch ( error ) {

		console.error( error )
		res.render( 'index', {
			content: []
		} )

	}

} )

module.exports = router