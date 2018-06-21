const pool = require( './mysql' )

async function getThumbnailContent( stories ) {

	return new Promise( async ( resolve, reject ) => {

		try {

			const allComponentsQueries = []

			let allComponentsIDS = []

			stories.forEach( el => {

				if ( el.components.length ) {

					const arr = el.components.split( ',' )
					allComponentsIDS = allComponentsIDS.concat( arr )

				}

			} )

			allComponentsIDS.forEach( el => {

				allComponentsQueries.push(
					pool.query( 'SELECT * FROM content WHERE ID = ?', el )
				)

			} )

			const allContent = await Promise.all( allComponentsQueries ),
				storiesWithContent = stories.map( el => {

					const obj = { ...el },
						match = allContent.filter( l => el.components.includes( l[ 0 ] && l[ 0 ].ID ) )

					if ( match )
						obj.content = match
					
					return obj

				} )

			storiesWithContent.forEach( el => {

				const text = el.content && el.content.filter( l => l[ 0 ].type === 'text' )[ 0 ],
					image = el.content && el.content.filter( l => l[ 0 ].type.includes( 'image' ) )[ 0 ]

				if ( text ) {

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