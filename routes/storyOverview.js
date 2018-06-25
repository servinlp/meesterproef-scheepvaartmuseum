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

		if ( req.query.searchTerm ) {
			res.locals.searchTerm = req.query.searchTerm
			query = pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? LIMIT ?, ?', [ `%${ req.query.searchTerm }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )
		} else {
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

		let pageIndex = 1

		// if ( req.query.index ) pageIndex = parseInt( req.query.index )

		const [ numberOfStories, AllStories ] = await Promise.all( [
				pool.query( 'SELECT ID FROM stories' ),
				pool.query( 'SELECT ID, title, components FROM stories WHERE title LIKE ? LIMIT ?, ?', [ `%${ req.body.search }%`, ( pageIndex - 1 ) * limitPerPage, limitPerPage ] )
			] )

		req.query = req.body.search
		console.log( req.query, req.body.search )
		
		const storiesWithContent = await getThumbnailContent( AllStories )
		res.render( 'storyOverview', {
			searchTerm: req.body.search,
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