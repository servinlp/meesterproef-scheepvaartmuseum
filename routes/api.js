const express = require( 'express' ),
	router = express.Router(),
	pool = require( '../lib/mysql' )

router.get( '/tags', async ( req, res ) => {

	if ( !req.query.search ) {

		res.json( {
			error: true,
			message: 'Not the right format. Check the documentation.'
		} )

	}

	const tag = await pool.query( 'SELECT * FROM tags WHERE name LIKE ?', `%${ req.query.search }%` )
		.map( el => el.name )

	res.json( {
		succes: true,
		data: tag
	} )

} )

router.get( '/locations', async ( req, res ) => {

	if ( !req.query.search ) {

		res.json( {
			error: true,
			message: 'Not the right format. Check the documentation.'
		} )

	}

	const location = await pool.query( 'SELECT * FROM location WHERE name LIKE ?', `%${ req.query.search }%` )
		.map( el => el.name )

	res.json( {
		succes: true,
		data: location
	} )

} )

// router.get( '/search', async ( req, res ) => {


// } )


module.exports = router