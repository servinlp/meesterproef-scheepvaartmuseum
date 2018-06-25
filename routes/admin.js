const express = require( 'express' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' ),
	bcrypt = require( 'bcryptjs' )

router.get( '/', async ( req, res ) => {

	if ( !req.session.role || req.session.role !== 1 ) {

		res.render( 'adminLogin' )

	} else if ( req.session.role && req.session.role === 1 ) {

		try {
			const reportedStories = await getReportedStories()

			res.render( 'adminPanel', {
				reportedStories
			} )

		} catch ( err ) {

			console.error( err )

		}
		
	}

} )

router.post( '/login', ( req, res ) => {

	const {
		email,
		password
	} = req.body

	
	pool.query( 'SELECT * FROM users WHERE email = ?', email )
		.then( record => {
			if ( !record[0] ) {
				res.redirect( '/admin' )
				return
			}
			bcrypt.compare( password, record[0].password, ( err, result ) => {
				if ( err ) {
					throw err
				}

				if ( result ) {
					req.session.role = 1
					req.session.save()
				}
			} )
		} ).then(() => {
			res.redirect( '/admin' )
		}).catch(err => console.log(err))

} )

router.post( '/logout', ( req, res ) => {

	delete req.session.role
	req.session.save()

	res.redirect( '/admin' )

} )

router.post( '/remove-story/:storyID', ( req, res ) => {

	console.log( req.params.storyID )

	pool.query( 'DELETE FROM stories WHERE ID = ?', req.params.storyID )
		.then( result => {

			console.log( 'result', result )

			res.redirect( '/admin' )

		} )
		.catch( err => {

			console.error( err )
			res.redirect( '/admin?couldNotRemoveStory=true' )

		} )

} )

function getReportedStories() {

	return new Promise( async ( resolve, reject ) => {

		try {

			const reportedStories = await pool.query( 'SELECT * FROM stories WHERE reports NOT LIKE ?', '0,0' ),
				stories = reportedStories.map( el => {
					return {
						...el,
						reports: el.reports.split( ',' )
					}
				} )

			resolve( stories )

		} catch ( err ) {

			reject( err )

		}

	} )

}

module.exports = router