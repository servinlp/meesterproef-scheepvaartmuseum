const express = require( 'express' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' ),
	bcrypt = require( 'bcryptjs' )

router.get( '/', ( req, res ) => {

	if ( !req.session.role || req.session.role !== 1 ) {

		res.render( 'adminLogin' )

	} else if ( req.session.role && req.session.role === 1 ) {

		res.render( 'adminPanel' )
		
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

module.exports = router