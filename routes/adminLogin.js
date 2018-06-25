const express = require( 'express' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' ),
	bcrypt = require( 'bcryptjs' )

router.get( '/', ( req, res ) => {
	console.log(req.session)
	res.render( 'adminLogin' )

} )

router.get( '/overview', ( req, res ) => {
	res.send('ok')
})

router.post( '/login', ( req, res ) => {
	console.log( req.body )
	const {
		email,
		password
	} = req.body

	
	pool.query( 'SELECT * FROM users WHERE email = ?', [ email ] )
		.then( record => {
			bcrypt.compare( password, record[0].password, ( err, result ) => {
				if ( err ) throw err

				if ( result ) {
					req.session.role = 1
					req.session.save()
				}
			} )
		} ).then(() => {
			res.redirect( '/admin-login/overview' )
		})
} )

module.exports = router