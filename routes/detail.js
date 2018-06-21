const express = require( 'express' ),
	moment = require( 'moment' ),
	router = express.Router(),
	pool = require( '../lib/mysql' ),
	getStoryReactions = require( '../lib/getStoryReactions' ),
	getStoryContent = require( '../lib/getStoryContent' )

moment.locale( 'nl' )

router.get( '/', ( req, res ) => {
	res.redirect( '/story-overview' )
} )

router.get( '/:storyID', async ( req, res ) => {

	try {

		const content = await getStoryContent( req.params.storyID ),
			reactions = await getStoryReactions( req.params.storyID )

		res.render( 'detail', {
			storyID: req.params.storyID,
			story: content,
			reactions
		} )

	} catch ( error ) {

		console.error( error )

	}

} )

router.post( '/:storyID/comment', ( req, res ) => {
	const commentMeta = {
		storyID: req.params.storyID,
		text: req.body.reaction,
		timestamp: moment().toISOString(),
		name: req.body.name ? req.body.name : 'Anoniem'
	}
	pool.query( 'INSERT INTO reactions SET ?', commentMeta )
		.then( () => {

			// Only redirect when query is done
			res.redirect( `/detail/${req.params.storyID}/#reactions-anchor` )

		} )
		.catch( err => console.error( err ) )
} )

router.post ( '/:storyID/:responseto', ( req, res ) => {

	const reactionToComment = {
		storyID: req.params.storyID,
		responseto: req.params.responseto,
		text: req.body.reaction,
		fromID: null,
		timestamp: moment().toISOString(),
		name: req.body.name ? req.body.name : 'Anoniem'
	}

	pool.query( 'INSERT INTO reactions SET ?', reactionToComment )
		.then( () => {

			// Only redirect when query is done
			res.redirect( `/detail/${req.params.storyID}/#reactions-anchor` )

		} )
		.catch( err =>  console.error( err ) )

} )

module.exports = router