const express = 	require( 'express' ),
	ENV = 			require( 'dotenv' ).config().parsed,
	bodyParser = 	require( 'body-parser' ),
	moment = 		require( 'moment' ),
	helmet = 		require( 'helmet' ),
	compression =	require( 'compression' ),

	indexRout = 	require( './routes/index' ),

	app = 			express(),
	PORT = 			ENV.NODE_ENV === 'production' ? ENV.PORT : ENV.DEV_PORT

app.use( compression() )
app.use( helmet() )

app.use( express.static( 'public' ) )

app.set( 'views', './views' )
app.set( 'view engine', 'ejs' )

app.use( bodyParser.urlencoded( { extended: false } ) )
app.use( bodyParser.json() )

app.use( '/', indexRout )

app.get( '*', ( req, res ) => {

	res.render( '404' )

} )

app.listen( PORT, err => {

	console.log( `Hello from http://localhost:${ PORT }` )

} )