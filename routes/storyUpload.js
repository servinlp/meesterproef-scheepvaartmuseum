const express = require( 'express' ),
	router = 	express.Router(),
	upload = 	require( '../lib/aws' ),
	pool = 		require( '../lib/mysql' ),
	moment = 	require( 'moment' )

router.get( '/', ( req, res ) => {

	res.render( 'storyUpload' )

} )

//Post the upload input file
router.post( '/upload', upload.array( 'upload', 5 ), ( req, res ) => {
	uploadToDb(req.body, req.files)
	res.send( 'success' )
} )

async function uploadToDb(data, dataFiles) {
	// Here we create an object that contains all the information which we are going to insert into the story table
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
	
	// fileLocation inserts all the files and filetypes into the files table in the database
	const fileLocation = dataFiles.map( (file) => {
		// fileMeta contains all the links and types of the current upload
		const fileMeta = {
			link: file.location,
			type: file.mimetype
		}
		return pool.query( 'INSERT INTO files SET ?', fileMeta )
	})

	// fileLocation is an array of queries
	const fileQueries = await Promise.all( [
		pool.query('INSERT INTO stories SET ?', storyMeta),
		...fileLocation
	] )

	// Gets the first item from the array and removes it
	const story = fileQueries.shift()
	// Here we concat all the ids of the files that were inserted into the database
	const fileIds = fileQueries.reduce( (acc, val) => {
		return acc.concat(val.insertId)
	}, [] )
	// Makes a string of all the ids ['id1', 'id2']
	const fileIdsString = fileIds.join(',')

	// Adds the file ids to the story
	const updateStory = await pool.query( 'UPDATE stories set ? where ID = ?', [ {
		files: fileIdsString
	}, story.insertId ] )
	
	// Splits tags by comma or space
	const storyTags = storyMeta.tags.split(/[ ,]+/);
	// Makes an array of all the queries needed for adding tags
	const storyTagQueries = storyTags.map( tag => {
		return pool.query( 'SELECT * FROM tags WHERE name = ?', tag )
	})
	// Returns an array of the results of storyTagQueries
	const storyTagResults = await Promise.all(storyTagQueries)
	
	const tagIds = []

	/* This loop checks all the results if they exist in the database or not. 
		if they exist we push the id of the tag directly to the tagIds array
		if they don't we'll insert them into the database table
	*/
	for ( let i = 0; i < storyTagResults.length; i ++ ) {
		const result = storyTagResults[ i ]
		if(result.length > 0) {
			// If the tag exists in the table already
			tagIds.push(result[0].ID)
		}
		else {
			// If the tag DOESN'T exist in the table already
			const insertedStoryTag = await pool.query('INSERT INTO tags SET ?', {
				name: storyTags[i]
			} )
			// Add tags to the array
			tagIds.push(insertedStoryTag.insertId)
		}
	}
	// Makes a pretty string of the tags
	const tagIdsString = tagIds.join(',');
	// Adds the tags to the stories in the database
	const updateStoryTags = await pool.query( 'UPDATE stories set ? where ID = ?', [ {
		tags: tagIdsString
	}, story.insertId ] )
}

module.exports = router