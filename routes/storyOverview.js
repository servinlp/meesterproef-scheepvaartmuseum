const express = require( 'express' ),
	router = 	express.Router(),
	pool = 		require( '../lib/mysql' ),

	LIMITPERPAGE = 2

router.get( '/', async ( req, res ) => {

	try {

		let pageIndex = 1

		if ( req.query.index )
			pageIndex = parseInt( req.query.index )

		const [ numberOfStories, AllStories ] = await Promise.all( [
				pool.query( 'SELECT ID FROM stories' ),
				pool.query( 'SELECT ID, title, components FROM stories LIMIT ?, ?', [ ( pageIndex - 1 ) * LIMITPERPAGE, LIMITPERPAGE ] )
			] ),
			allComponentsQueries = []

		let allComponentsIDS = []

		AllStories.forEach( el => {

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
			storiesWithContent = AllStories.map( el => {

				const obj = { ...el },
					match = allContent.filter( l => el.components.includes( l[ 0 ] && l[ 0 ].ID ) )

				if ( match )
					obj.content = match
				
				return obj

			} )

		storiesWithContent.forEach( el => {

			const text = el.content && el.content.filter( l => l[ 0 ].type === 'text' )[ 0 ],
				image = el.content && el.content.filter( l => l[ 0 ].type.includes( 'image' ) )[ 0 ]

			if ( text )
				el.text = text[ 0 ].text

			if ( image )
				el.image = image[ 0 ].link

		} )

		res.render( 'storyOverview', {
			pageIndex,
			numOfPages: Math.ceil( numberOfStories.length / LIMITPERPAGE ),
			content: storiesWithContent
		} )

	} catch ( error ) {

		console.error( error )
		res.render( 'storyOverview', {
			content: []
		} )

	}

} )

module.exports = router