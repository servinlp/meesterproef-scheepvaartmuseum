const express = require( 'express' ),
	router = 	express.Router(),
	upload = 	require( '../lib/aws' ),
	pool = 		require( '../lib/mysql' ),
	moment = 	require( 'moment' )

router.get( '/', ( req, res ) => {

	res.render( 'storyUpload' )

} )

//Post the upload input file
router.post( '/upload', upload.any(), ( req, res ) => {

	uploadToDb( req.body, req.files, res )

} )

async function uploadToDb( data, dataFiles, res ) {

	try {
		// Here we create an object that contains all the information which we are going to insert into the story table
		const contentObj = {},
			keys =  Object.keys( data )

		keys.filter( el => includesOnOfAll( el, [ 'storyText', 'subtitle', 'videolink' ] ) )
			.forEach( el => {
				
				contentObj[ el ] = data[ el ]
			
			} )

		dataFiles.forEach( el => {

			contentObj[ el.fieldname ] = el

		} )

		const contentKeys = Object.keys( contentObj ),
			contentInOrder = contentKeys.sort( sortByIndex ).filter( el => filterOutEmptyOnes( el, contentObj ) ),
			contentQueries = getContentQueries( contentInOrder, contentObj )
		

		const allContent = await Promise.all( contentQueries ),
			contentIDS = allContent.map( el => el.insertId ).join( ',' ),

			locationID = await getLocationID( data.location ),
			tagIDS = await getTagIDS( data.tags ),

			storyMeta = {
				title: data.title,
				email: data.email,
				phone: data.phone,
				tags: tagIDS,
				location: locationID,
				timestamp: moment.now(),
				storyTime: data.time,
				components: contentIDS
			}

		// fileLocation is an array of queries
		await pool.query( 'INSERT INTO stories SET ?', storyMeta )

		res.send( 'success' )

	} catch ( err ) {

		console.error( err )

	}
	
}

function includesOnOfAll( el, arr ) {

	for ( let i = 0; i < arr.length; i++ ) {

		if ( el.includes( arr[ i ] ) ) return true

	}

	return false

}

function sortByIndex( a, b ) {

	const indexA = parseInt( a.substr( a.lastIndexOf( '-' ) + 1, a.length ) ),
		indexB = parseInt( b.substr( b.lastIndexOf( '-' ) + 1, b.length ) )

	return indexA - indexB

}

function filterOutEmptyOnes( el, data ) {

	if ( data[ el ].length ) 
		return el

}

function getType( el, data ) {

	const type = el.substr( 0, el.indexOf( '-' ) )
	let contentType

	switch( type ) {
		case 'storyText':
			contentType = 'text'
			break
		case 'upload':
			contentType = data[ el ].mimetype
			break
		case 'subtitle':
			contentType = 'title/h2'
			break
		case 'videolink':
			// Use youtu here instead of youtube for short links
			if ( data[ el ].includes( 'youtu' ) ) {
				contentType = 'videolink/youtube'
			} else if ( data[ el ].includes( 'vimeo' ) ) {
				contentType = 'videolink/vimeo'
			}
			break
		default:
			contentType = null
	}

	return contentType

}

function getContentQueries( order, data ) {

	const arr = []

	order.forEach( el => {

		const type = getType( el, data ),
			contentInsertObj = {
				type
			}

		if ( el.includes( 'upload' ) ) {

			contentInsertObj.link = data[ el ].location

		} else if ( type.includes( 'videolink' ) ) {

			if ( type.includes( 'youtube' ) ) {

				if ( data[ el ].includes( 'youtube' ) ) {

					contentInsertObj.text = data[ el ].substr( data[ el ].lastIndexOf( '=' ) + 1, data[ el ].length )

				} else if ( data[ el ].includes( 'youtu.be' ) ) {

					contentInsertObj.text = data[ el ].substr( data[ el ].lastIndexOf( '/' ) + 1, data[ el ].length )

				} else {

					return
					
				}

			} else if ( type.includes( 'vimeo' ) ) {

				contentInsertObj.text = data[ el ].substr( data[ el ].lastIndexOf( '/' ) + 1, data[ el ].length )

			} else {

				return

			}

		} else {

			contentInsertObj.text = data[ el ]

		}

		arr.push(
			pool.query( 'INSERT INTO content SET ?', contentInsertObj )
		)

	} )

	return arr

}

async function getLocationID( location ) {

	try{

		const exists = await pool.query( 'SELECT * FROM location WHERE name = ?', location )

		let ID 

		if ( exists.length > 0 ) {

			ID = exists[ 0 ].ID

			await pool.query( 'UPDATE location SET ? WHERE name = ?', [ {
				count: exists[ 0 ].count + 1
			}, location ] )

		} else {

			const insert = await pool.query( 'INSERT INTO location SET ?', {
				name: location
			} )

			ID = insert.insertId

		}

		return ID

	} catch ( err ) {

		console.error( err )

	}

}

async function getTagIDS( tagsString ) {

	try{

		// Splits tags by comma or space
		const tagsArr = tagsString.split( /[ ,]+/ )

		// Makes an array of all the queries needed for adding tags
		const storyTagQueries = tagsArr.map( tag => {
			return pool.query( 'SELECT * FROM tags WHERE name = ?', tag )
		} )

		// Returns an array of the results of storyTagQueries
		const storyTagResults = await Promise.all( storyTagQueries ),
			updateExistingTagRows = [],
			updateIDS = []

		/* This loop checks all the results if they exist in the database or not. 
			if they exist we push the id of the tag directly to the tagIds array
			if they don't we'll insert them into the database table
		*/
		for ( let i = 0; i < storyTagResults.length; i ++ ) {
			const result = storyTagResults[ i ]
			if ( result.length > 0 ) {
				updateExistingTagRows.push(
					pool.query( 'UPDATE tags SET ? WHERE ID = ?', [ {
						count: result[ 0 ].count + 1
					},  result[ 0 ].ID ] )
				)

				updateIDS.push( result[ 0 ].ID )
			}
			else {
				// If the tag DOESN'T exist in the table already
				updateExistingTagRows.push(
					pool.query( 'INSERT INTO tags SET ?', {
						name: tagsArr[i]
					} )
				)
			}
		}

		const AllUpdatesOrInserts = await Promise.all( updateExistingTagRows ),
			// Extra array to keep IDs in where its an UPDATE (they don't return an insertId)
			IDS = []

		AllUpdatesOrInserts.forEach( el => {

			if ( el.insertId ) {

				IDS.push( el.insertId )

			} else if ( el.changedRows ) {

				IDS.push( updateIDS[ 0 ] )

				updateIDS.shift()

			}

		} )

		// Makes a pretty string of the tags
		return IDS.join( ',' )

	} catch ( err ) {

		console.error( err )

	}

}

module.exports = router