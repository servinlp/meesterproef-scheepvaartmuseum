const pool = require( './mysql' ),
	getStoryHeaderInfo = require( './getStoryHeaderInfo' )

async function getThumbnailContent( stories ) {

	return new Promise( async ( resolve, reject ) => {

		try {

			const allComponentsQueries = []

			let allComponentsIDs = []

			stories.forEach( el => {

				// If there are components
				if ( el.components.length ) {

					const arr = el.components.split( ',' )
					// Concat 2 arrays into one for an array with all content IDs
					allComponentsIDs = allComponentsIDs.concat( arr )

				}

			} )

			allComponentsIDs.forEach( el => {

				allComponentsQueries.push(
					pool.query( 'SELECT * FROM content WHERE ID = ?', el )
				)

			} )

			const allContent = ( await Promise.all( allComponentsQueries ) ).map( el => el[ 0 ] ),
				storiesWithContent = stories.map( el => {

					// Destructuring the object
					const obj = { ...el },
						match = allContent.filter( l => {

							// check if el.components includes the ID
							// l && (To check if it exists)
							// If l exists then return l.ID
							return el.components.includes( l && l.ID )

						} )

					// If there is a match, add it to the object
					if ( match )
						obj.content = match
					
					return obj

				} )

			storiesWithContent.forEach( el => getStoryHeaderInfo( el ) )

			resolve( storiesWithContent )

		} catch ( error ) {

			reject( error )

		}

	} )

}

module.exports = getThumbnailContent