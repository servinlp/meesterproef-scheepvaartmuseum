const express = require( 'express' ),
	router = 	express.Router()

router.get( '/', ( req, res ) => {

	res.render( 'adminLogin' )

} )

module.exports = router