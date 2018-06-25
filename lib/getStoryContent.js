const pool = require( './mysql' ),
	getStoryHeaderInfo = require( './getStoryHeaderInfo' )

function getStoryContent( ID ) {

	return new Promise( async ( resolve, reject ) => {

		try {

			const story = ( await pool.query( 'SELECT * FROM stories WHERE ID = ?', ID ) )[ 0 ],
				tagIDs = story.tags.split( ',' ),
				tagQueries = [],

				contentIDs = story.components.split( ',' ),
				contentQueries = []

			tagIDs.forEach( el => {

				tagQueries.push( pool.query( 'SELECT * FROM tags WHERE ID = ?', el ) )

			} )

			contentIDs.forEach( el => {

				contentQueries.push( pool.query( 'SELECT * FROM content WHERE ID = ?', el ) )

			} )

			const allTags = ( await Promise.all( tagQueries ) ).map( el => el[ 0 ] ),
				allContent = ( await Promise.all( contentQueries ) ).map( el => el[ 0 ] )
			
			story.allTags = allTags
			story.content = allContent
			
			getStoryHeaderInfo( story )

			resolve( story )

		} catch ( err ) {
			
			reject( err )
		
		}

	} )

}

module.exports = getStoryContent