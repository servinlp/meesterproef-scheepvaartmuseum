const express = require( 'express' ),
	router = 	express.Router(),
	pool = 		require( '../lib/mysql' )

router.get( '/', ( req, res ) => {

	res.render( 'detail' )

} )

router.post( '/comment', ( req, res ) => {
	const commentMeta = {
		text: req.body.reaction
	}
	pool.query('INSERT INTO reactions SET ?', commentMeta)
	res.send('ok')
} )

module.exports = router