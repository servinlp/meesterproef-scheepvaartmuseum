const express = require( 'express' ),
	moment = require( 'moment' ),
	router = 	express.Router(),
	pool = 		require( '../lib/mysql' )

router.get( '/', ( req, res ) => {

	res.render( 'detail' )

} )

router.post( '/comment', ( req, res ) => {
	const commentMeta = {
		storyID: 55,
		text: req.body.reaction,
		timestamp: moment.now(),
		name: req.body.name ? req.body.name : 'Anoniem'
	}
	pool.query( 'INSERT INTO reactions SET ?' , commentMeta )
	res.send( 'ok' )
} )

module.exports = router