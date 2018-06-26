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

		if ( req.session.reports && req.session.reports[ req.params.storyID ] ) {

			res.locals.report = req.session.reports[ req.params.storyID ]

		}

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

router.post ( '/:storyID/comment/:responseto', ( req, res ) => {

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

router.post( '/:storyID/report', async ( req, res ) => {

	try {

		const { incorrect, ongepast, js } = req.body,
			storyID = req.params.storyID,

			story = await pool.query( 'SELECT * FROM stories WHERE ID = ?', storyID ),
			reports = story[ 0 ].reports,
			reportsSplit = reports.split( ',' )

		if ( !req.session.reports ) {
			req.session.reports = {}
		}

		if ( !req.session.reports[ storyID ] ) {

			req.session.reports[ storyID ] = [ true, true ]

		}

		if ( incorrect && incorrect === 'on' ) {

			reportsSplit[ 0 ] = parseInt( reportsSplit[ 0 ] ) + 1

			req.session.reports[ storyID ][ 0 ] = true

		} else if ( incorrect && incorrect === 'off' ) {

			reportsSplit[ 0 ] = parseInt( reportsSplit[ 0 ] ) - 1

			req.session.reports[ storyID ][ 0 ] = false

		}

		if ( ongepast && ongepast === 'on' ) {

			reportsSplit[ 1 ] = parseInt( reportsSplit[ 1 ] ) + 1

			req.session.reports[ storyID ][ 1 ] = true

		} else if ( ongepast && ongepast === 'off' ) {

			reportsSplit[ 1 ] = parseInt( reportsSplit[ 1 ] ) - 1

			req.session.reports[ storyID ][ 1 ] = false

		}

		const newReports = reportsSplit.join( ',' )

		await pool.query( 'UPDATE stories SET ? WHERE ID = ?', [
			{
				reports: newReports
			},
			storyID
		] )

		if ( !js ) {

			res.redirect( `/detail/${ storyID }` )

		} else {

			res.json( {
				succes: true
			} )

		}

	} catch ( error ) {

		console.error( error )

	}

} )

module.exports = router