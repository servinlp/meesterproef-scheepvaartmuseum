const express = require( 'express' ),
	moment = require( 'moment' ),
	router = express.Router(),
	pool = require( '../lib/mysql' )

moment.locale( 'nl' )

router.get( '/', ( req, res ) => {
	res.redirect( '/story-overview' )
} )

router.get( '/:storyID', async ( req, res ) => {
	const reactions = await pool.query( `SELECT * FROM reactions WHERE storyID = ${ req.params.storyID }` )
		.then( x => x )
		.then( formatted => formatted.map( x => {
			return {
				...x,
				datetime: moment( x.timestamp ).format( 'DD-MM-YYYY HH:mm' ),
				time: moment( x.timestamp ).format( 'DD MMMM, YYYY HH:mm' )
			}
		} ) )
		.catch( e => console.log( e ) )

	res.render( 'detail', {
		storyID: req.params.storyID,
		reactions
	} )
} )

router.post( '/:storyID/comment', ( req, res ) => {
	const commentMeta = {
		storyID: req.params.storyID,
		text: req.body.reaction,
		timestamp: moment().toISOString(),
		name: req.body.name ? req.body.name : 'Anoniem'
	}
	pool.query( 'INSERT INTO reactions SET ?', commentMeta )
	res.send( 'ok' )
} )

module.exports = router