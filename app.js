const express = require( 'express' ),
	session = require( 'express-session' ),
	ENV = require( 'dotenv' ).config().parsed,
	bodyParser = require( 'body-parser' ),
	moment = require( 'moment' ),
	helmet = require( 'helmet' ),
	compression = require( 'compression' ),

	indexRoute = require( './routes/index' ),
	detailRoute = require( './routes/detail' ),
	adminLoginRoute = require( './routes/adminLogin' ),
	componentsRoute = require( './routes/components' ),
	storyOverviewRoute = require( './routes/storyOverview' ),
	storyUploadRoute = require( './routes/storyUpload' ),
	styleguideRoute = require( './routes/styleguide' ),
	fourOFourRoute = require( './routes/404' ),

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
app.use( '/detail', detailRoute )
app.use( '/styleguide', styleguideRoute )
app.use( '/components', componentsRoute )
app.use( '/admin-login', adminLoginRoute )
app.use( '/story-upload', storyUploadRoute )
app.use( '/story-overview', storyOverviewRoute )

app.use( '*', fourOFourRoute )

app.listen( PORT, () => {

	console.log( `Hello from http://localhost:${ PORT }` )

} )