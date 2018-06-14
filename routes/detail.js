const express = require( 'express' ),
	router = 	express.Router()

router.get( '/', ( req, res ) => {

	res.render( 'detail' )

} )

router.post( '/comment', ( req, res ) => {
	res.render('detail')
} )

module.exports = router