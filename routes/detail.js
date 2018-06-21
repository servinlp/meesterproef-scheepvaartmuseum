const express = require( 'express' ),
	moment = require( 'moment' ),
	router = express.Router(),
	pool = require( '../lib/mysql' )

moment.locale( 'nl' )

router.get( '/', ( req, res ) => {
	res.redirect( '/story-overview' )
} )

router.get( '/:storyID', async ( req, res ) => {

	try {
		const reactions = await pool.query( `SELECT * FROM reactions WHERE storyID = ${ req.params.storyID } ORDER BY timestamp ASC` )
				.then( x => x )
				.then( formatted => formatted.map( x => {
					return {
						...x,
						datetime: moment( x.timestamp ).format( 'DD-MM-YYYY HH:mm' ),
						time: moment( x.timestamp ).format( 'DD MMMM, YYYY HH:mm' )
					}
				} ) ),
			parents = reactions.filter( el => !el.responseTo ),
			childResponses = reactions.filter( el => el.responseTo )

		childResponses.forEach( el => {

			const match = parents.filter( parentEl => parentEl.ID === el.responseTo )[ 0 ]
			if ( !match.childResponses ) {
				match.childResponses = []
			}

			match.childResponses.push( el )

		} )

		res.render( 'detail', {
			storyID: req.params.storyID,
			reactions: parents
		} )


		if ( !reactions.length ) {
			throw new Error( 'No reactions found' )
		}

	} catch ( error ) {
		console.log( error )
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