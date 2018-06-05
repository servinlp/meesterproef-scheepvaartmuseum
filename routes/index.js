const express = require( 'express' ),
	upload = 	require( '../lib/aws' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' ),
	moment = require( 'moment' )

router.get( '/', ( req, res ) => {
		  
	res.render( 'index' )

} )

//Post the upload input file
router.post( '/upload', upload.array( 'upload', 1 ), ( req, res ) => {
	console.log( 'trying to upload' )
	console.log( req.body);
	console.log( 'File uploaded successfully.' )
	console.log( req.files )
	uploadToDb(req.body, req.files)
	res.send( 'success' )
} )

async function uploadToDb(data, dataImg) {
	const obj = {
		title: data.title,
		storyText: data.storyText,
		email: data.email, 
		phone: data.phone, 
		tags: data.tags,  
		location: data.location, 
		timestamp: moment.now(),
		storyTime: data.time
	},
	fileLocation = {
		link: dataImg[0].location,
		type: dataImg[0].mimetype
	},
	[ story, file ] = await Promise.all( [
		pool.query('INSERT INTO stories SET ?', obj),
		// Upload image shiz
		pool.query('INSERT INTO files SET ?', fileLocation)
	] ),
	updateStory = await pool.query( 'UPDATE stories set ? where ID = ?', [ {
		files: file.insertId
	}, story.insertId ] )

	console.log( story, file, updateStory )
}

module.exports = router