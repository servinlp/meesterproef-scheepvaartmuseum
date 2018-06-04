const express = require( 'express' ),
	upload = 	require( '../lib/aws' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' )

router.get( '/', ( req, res ) => {
		  
	res.render( 'index' )

} )

//Post the upload input file
router.post( '/upload', ( request, response ) => {
	console.log( 'trying to upload' )
	upload( request, response, ( error ) => {
		if ( error ) {
			console.log( error )
			return response.send( 'error' )
		}
		console.log( 'File uploaded successfully.' )
		response.send( 'success' )
	} )
} )

module.exports = router