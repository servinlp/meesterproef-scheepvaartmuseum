const pool = require( './mysql' ),
	moment = require( 'moment' )

moment.locale( 'nl' )

function getStoryReactions( ID ) {

	return new Promise( async ( resolve, reject ) => {

		try {

			const reactions = await pool.query( `SELECT * FROM reactions WHERE storyID = ${ ID } ORDER BY timestamp ASC` ).then( x => x )
					.then( formatted => formatted.map( x => {
						return {
							...x,
							datetime: moment( x.timestamp ).format( 'DD-MM-YYYY HH:mm' ),
							time: moment( x.timestamp ).format( 'DD MMMM, YYYY HH:mm' )
						}
					} ) ),
				parents = reactions.filter( el => !el.responseTo ),
				childResponses = reactions.filter( el => el.responseTo )

			childResponses.forEach( el => {

				const match = parents.filter( parentEl => parentEl.ID === el.responseTo )[ 0 ]
				if ( !match.childResponses ) {
					match.childResponses = []
				}

				match.childResponses.push( el )

			} )

			resolve( parents )

		} catch ( error ) {

			reject( error )

		}

	} )

}

module.exports = getStoryReactions