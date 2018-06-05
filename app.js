const express = require( 'express' ),
	session = require( 'express-session' ),
	ENV = require( 'dotenv' ).config().parsed,
	bodyParser = require( 'body-parser' ),
	moment = require( 'moment' ),
	helmet = require( 'helmet' ),
	compression = require( 'compression' ),
	indexRoute = require( './routes/index' ),
	app = express(),
	PORT = ENV.NODE_ENV === 'production' ? ENV.PORT : ENV.DEV_PORT

app.use( compression() )
app.use( helmet() )

app.set( 'trust proxy', 1 )
app.use( session( {
	secret: ENV.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		secure: ENV.SECURE === '1'
	}
} ) )

app.use( express.static( 'public' ) )

app.set( 'views', './views' )
app.set( 'view engine', 'ejs' )

app.use( bodyParser.urlencoded( {
	extended: false
} ) )
app.use( bodyParser.json() )

app.use( '/', indexRoute )

app.get( '/detail', ( req, res ) => {

	res.render( 'detail' )

})

app.get( '/styleguide', ( req, res ) => {

	res.render( 'styleguide' )

})

app.get( '/components', ( req, res ) => {

	res.render( 'components' )

} )

app.get( '*', ( req, res ) => {

	res.render( '404' )

} )

app.listen( PORT, () => {

	console.log( `Hello from http://localhost:${ PORT }` )

} )