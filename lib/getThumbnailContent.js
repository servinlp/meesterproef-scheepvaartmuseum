const pool = require( './mysql' )

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

			const allContent = await Promise.all( allComponentsQueries ),
				storiesWithContent = stories.map( el => {

					// Destructuring the object
					const obj = { ...el },
						match = allContent.filter( l => {

							// check if el.components includes the ID
							// l[ 0 ] && (To check if it exists)
							// If l[ 0 ] exists then return l[ 0 ].ID
							return el.components.includes( l[ 0 ] && l[ 0 ].ID )

						} )

					// If there is a match, add it to the object
					if ( match )
						obj.content = match
					
					return obj

				} )

			storiesWithContent.forEach( el => {

				// If el.content exists (some stories don't have content...)
				// Check for the type (l[ 0 ].type === 'text')
				const text = el.content && el.content.filter( l => l[ 0 ].type === 'text' )[ 0 ],
					image = el.content && el.content.filter( l => l[ 0 ].type.includes( 'image' ) )[ 0 ]

				if ( text ) {

					// Only return the first 50 characters
					el.text = text[ 0 ].text.substr( 0, 50 ) + '...'

				}

				if ( image )
					el.image = image[ 0 ].link

			} )

			resolve( storiesWithContent )

		} catch ( error ) {

			reject( error )

		}

	} )

}

module.exports = getThumbnailContent