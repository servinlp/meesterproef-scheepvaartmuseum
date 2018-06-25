const express = require( 'express' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' ),
	bcrypt = require( 'bcryptjs' )

router.get( '/', ( req, res ) => {
	console.log(req.session)
	res.render( 'adminLogin' )

} )

router.get( '/overview', ( req, res ) => {
	if ( !req.session.role || req.session.role !== 1 ) {
		res.redirect('/')
		return
	}

	console.log(req.session)

	if (req.session.role === 1) {
		pool.query(' SELECT * FROM stories WHERE reports != 0')
			.then(x => console.log(x))

		res.render('adminPanel')
	}
})

router.post( '/login', ( req, res ) => {
	console.log( req.body )
	const {
		email,
		password
	} = req.body

	
	pool.query( 'SELECT * FROM users WHERE email = ?', [ email ] )
		.then( record => {
			if ( !record[0] ) {
				res.redirect( '/admin-login' )
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
			res.redirect( '/admin-login/overview' )
		}).catch(err => console.log(err))
} )

module.exports = router