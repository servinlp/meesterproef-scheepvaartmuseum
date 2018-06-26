const express = require( 'express' ),
	router = express.Router(),
	pool = require( '../lib/mysql' ),
	getThumbnailContent = require( '../lib/getThumbnailContent' ),

	limitPerPage = 6

router.get( '/', async ( req, res ) => {

	try {

		const { sortTerm, searchTerm, tag } = req.query
		let pageIndex = 1

		if ( req.query.index ) {

			pageIndex = parseInt( req.query.index )
		
		}

		let query, tagID

		if ( tag ) {

			tagID = ( await pool.query( 'SELECT ID FROM tags WHERE name = ?', tag ) )[ 0 ].ID

			res.locals.tag = tag

		}

		// Both
		if ( sortTerm && searchTerm ) {

			res.locals.searchTerm = searchTerm
			res.locals.sortTerm = sortTerm
			
			let sortBy
			switch (sortTerm) {
				case 'oudste':
					sortBy = `ASC`
					break
				case 'nieuwste':
					sortBy = `DESC`
					break
			
				default:
					break
			}

			if ( tagID ) {

				query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? AND tags LIKE ? ORDER BY title ' + sortBy + ' LIMIT ?, ?', [ `%${ searchTerm }%`, `%${ tagID }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

			} else {

				query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? ORDER BY title ' + sortBy + ' LIMIT ?, ?', [ `%${ searchTerm }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

			}

		}
		// Only search
		else if ( searchTerm ) {

			res.locals.searchTerm = searchTerm

			if ( tagID ) {

				query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? AND tags LIKE ? ORDER BY ID DESC LIMIT ?, ?', [ `%${ searchTerm }%`, `%${ tagID }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

			} else {

				query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? ORDER BY ID DESC LIMIT ?, ?', [ `%${ searchTerm }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

			}
		
		} 
		// Only sort
		else if ( sortTerm ) {

			res.locals.sortTerm = sortTerm
			let sortBy
			switch (sortTerm) {
				case 'oudste':
					sortBy = `ASC`
					break
				case 'nieuwste':
					sortBy = `DESC`
					break
			
				default:
					break
			}

			if ( tagID ) {

				query = pool.query( 'SELECT ID, title, components FROM stories WHERE tags LIKE ? ORDER BY ID ' + sortBy + ' LIMIT ?, ?', [ `%${ tagID }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

			} else {

				query = pool.query( 'SELECT ID, title, components FROM stories ORDER BY ID ' + sortBy + ' LIMIT ?, ?', [ ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

			}

		} else {

			if ( tagID ) {

				query = pool.query( 'SELECT ID, title, components FROM stories WHERE tags LIKE ? ORDER BY ID DESC LIMIT ?, ?', [ `%${ tagID }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

			} else {
				
				query = pool.query( 'SELECT ID, title, components FROM stories ORDER BY ID DESC LIMIT ?, ?', [ ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

			}

		}

		const [ numberOfStories, AllStories ] = await Promise.all( [
				pool.query( 'SELECT ID FROM stories' ),
				query
			] ),
			storiesWithContent = await getThumbnailContent( AllStories )

		res.render( 'storyOverview', {
			pageIndex,
			numOfPages: Math.ceil( numberOfStories.length / limitPerPage ),
			content: storiesWithContent,
			path: '/story-overview'
		} )

	} catch ( error ) {

		console.error( error )
		res.render( 'storyOverview', {
			content: [],
			path: '/story-overview'
		} )

	}

} )

router.post('/search', async (req, res) => {

	const { sort, search, tag } = req.body

	let URL = '/story-overview'

	if ( sort ) {

		if ( !URL.includes( '?' ) ) {

			URL += '?'
			
		} else {
			
			URL += '&'

		}

		URL += `sortTerm=${ sort }`

	}

	if ( search ) {

		if ( !URL.includes( '?' ) ) {

			URL += '?'
			
		} else {
			
			URL += '&'

		}

		URL += `searchTerm=${ search }`

	}

	if ( tag ) {

		if ( !URL.includes( '?' ) ) {

			URL += '?'
			
		} else {
			
			URL += '&'

		}

		URL += `tag=${ tag }`

	}

	res.redirect( URL )

} )

module.exports = router