const express = require( 'express' ),
	upload = 	require( '../lib/aws' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' ),
	moment = require( 'moment' )

router.get( '/', ( req, res ) => {
		  
	res.render( 'index' )

} )

//Post the upload input file
router.post( '/upload', upload.array( 'upload', 5 ), ( req, res ) => {
	console.log( 'trying to upload' )
	console.log( 'File uploaded successfully.' )
	uploadToDb(req.body, req.files)
	res.send( 'success' )
} )

async function uploadToDb(data, dataFiles) {
	const storyMeta = {
		title: data.title,
		storyText: data.storyText,
		email: data.email, 
		phone: data.phone, 
		tags: data.tags,  
		location: data.location, 
		timestamp: moment.now(),
		storyTime: data.time
	}
	const fileLocation = dataFiles.map( (file) => {
		const fileMeta = {
			link: file.location,
			type: file.mimetype
		}
		return pool.query( 'INSERT INTO files SET ?', fileMeta )
	})
	// fileLocation is an array of queries
	const fileQueries = await Promise.all( [
		pool.query('INSERT INTO stories SET ?', storyMeta),
		// Upload image shiz
		...fileLocation
	] )
	const story = fileQueries.shift()

	const fileIds = fileQueries.reduce( (acc, val) => {
		return acc.concat(val.insertId)
	}, [] )
	const fileIdsString = fileIds.join(',')

	console.log(fileIds);
	const updateStory = await pool.query( 'UPDATE stories set ? where ID = ?', [ {
		files: fileIdsString
	}, story.insertId ] )

	console.log( 'loggin story and file', story, fileIdsString )
}

module.exports = router