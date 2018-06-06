const express = require( 'express' ),
	router = 	express.Router()

router.get( '/', ( req, res ) => {

	res.render( 'components' )

} )

module.exports = router