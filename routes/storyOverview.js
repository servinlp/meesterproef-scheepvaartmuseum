const express = require( 'express' ),
	router = express.Router(),
	pool = require( '../lib/mysql' ),
	getThumbnailContent = require( '../lib/getThumbnailContent' ),

	limitPerPage = 6

router.get( '/', async ( req, res ) => {

	try {

		let pageIndex = 1

		if ( req.query.index )
			pageIndex = parseInt( req.query.index )

		let query
		// Only search
		if ( req.query.searchTerm !== undefined && req.query.sortTerm === undefined ) {
			res.locals.searchTerm = req.query.searchTerm
			query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? LIMIT ?, ?', [ `%${ req.query.searchTerm }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )
		
		} 
		// Only sort
		else if ( req.query.sortTerm !== undefined && req.query.searchTerm === undefined ) {
			res.locals.sortTerm = req.query.sortTerm
			let sortBy
			switch (req.query.sortTerm) {
				case 'oudste':
					sortBy = `DESC`
					break
				case 'nieuwste':
					sortBy = `ASC`
					break
			
				default:
					break
			}
			query = pool.query( 'SELECT ID, title, components FROM stories ORDER BY title ' + sortBy + ' LIMIT ?, ?', [ ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )
		} 
		// Both
		else if (req.query.sortTerm !== undefined && req.query.searchTerm !== undefined) {
			res.locals.searchTerm = req.query.searchTerm
			res.locals.sortTerm = req.query.sortTerm
			
			let sortBy
			switch (req.query.sortTerm) {
				case 'oudste':
					sortBy = `DESC`
					break
				case 'nieuwste':
					sortBy = `ASC`
					break
			
				default:
					break
			}

			query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? ORDER BY title ' + sortBy + ' LIMIT ?, ?', [ `%${ req.query.searchTerm }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )
		}
		else {
			query = pool.query( 'SELECT ID, title, components FROM stories LIMIT ?, ?', [ ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )
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

	try {
		const sort = req.body.sort
		const search = req.body.search

		let pageIndex = 1

		// if ( req.query.index ) pageIndex = parseInt( req.query.index )
		let query
		// if just search
		if (search !== undefined && sort === undefined) {
			query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? LIMIT ?, ?', [ `%${ search }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )
		}
		// If just sort
		else if( sort !== undefined && search === undefined ) {
			let sortBy
			switch (sort) {
				case 'oudste':
					sortBy = `DESC`
					break
				case 'nieuwste':
					sortBy = `ASC`
					break
			
				default:
					break
			}

			query = pool.query( 'SELECT ID, title, components FROM stories ORDER BY title ' + sortBy + ' LIMIT ?, ?', [ ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )
		}
		// If both
		else if (search !== undefined && sort !== undefined) {
			
			let sortBy
			switch (sort) {
				case 'oudste':
					sortBy = `DESC`
					break
				case 'nieuwste':
					sortBy = `ASC`
					break
			
				default:
					break
			}
			
			query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? ORDER BY title ' + sortBy + ' LIMIT ?, ?', [ `%${ search }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )

		}

		const [ numberOfStories, AllStories ] = await Promise.all( [
				pool.query( 'SELECT ID FROM stories' ),
				query
			] )

		req.query = search
		
		const storiesWithContent = await getThumbnailContent( AllStories )
		res.render( 'storyOverview', {
			searchTerm: search,
			sortTerm: sort,
			pageIndex,
			numOfPages: Math.ceil( numberOfStories.length / limitPerPage ),
			content: storiesWithContent,
			path: '/story-overview/search'
		} )

	} catch ( error ) {

		console.error( error )
		res.render( 'storyOverview', {
			content: [],
			path: '/story-overview'
		} )

	}

})

module.exports = router