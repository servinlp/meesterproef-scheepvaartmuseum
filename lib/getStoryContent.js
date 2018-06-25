const pool = require( './mysql' ),
	getStoryHeaderInfo = require( './getStoryHeaderInfo' )

function getStoryContent( ID ) {

	return new Promise( async ( resolve, reject ) => {

		try {

			const story = ( await pool.query( 'SELECT * FROM stories WHERE ID = ?', ID ) )[ 0 ],
				contentIDs = story.components.split( ',' ),
				contentQueries = []

			contentIDs.forEach( el => {

				contentQueries.push( pool.query( 'SELECT * FROM content WHERE ID = ?', el ) )

			} )

			const allContent = ( await Promise.all( contentQueries ) ).map( el => el[ 0 ] )
			
			story.content = allContent
			
			getStoryHeaderInfo( story )

			resolve( story )

		} catch ( err ) {
			
			reject( err )
		
		}

	} )

}

module.exports = getStoryContent