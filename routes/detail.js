const express = require( 'express' ),
	moment = require( 'moment' ),
	router = 	express.Router(),
	pool = 		require( '../lib/mysql' )

router.get( '/', ( req, res ) => {
	res.redirect( '/story-overview' )
} )

router.get( '/:storyID', async ( req, res ) => {
	console.log( req.params.storyID )

	const reactions = await pool.query( `SELECT * FROM reactions WHERE storyID = ${ req.params.storyID }` )
		.then( x => x )
	console.log( reactions )

	res.render( 'detail', {
		storyID: req.params.storyID,
		reactions
	} )
} )

router.post( '/:storyID/comment', ( req, res ) => {
	const commentMeta = {
		storyID: req.params.storyID,
		text: req.body.reaction,
		timestamp: moment.now(),
		name: req.body.name ? req.body.name : 'Anoniem'
	}
	pool.query( 'INSERT INTO reactions SET ?' , commentMeta )
	res.send( 'ok' )
} )

module.exports = router