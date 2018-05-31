const express = 	require( 'express' ),
	ENV = 			require( 'dotenv' ).config().parsed,
	bodyParser = 	require( 'body-parser' ),
	moment = 		require( 'moment' ),
	helmet = 		require( 'helmet' ),
	compression =	require( 'compression' ),

	indexRoute = 	require( './routes/index' ),

	app = 			express(),
	PORT = 			ENV.NODE_ENV === 'production' ? ENV.PORT : ENV.DEV_PORT,
	aws = require( 'aws-sdk' ),
	multer = require( 'multer' ),
	multerS3 = require( 'multer-s3' )


app.use( compression() )
app.use( helmet() )

app.use( express.static( 'public' ) )

app.set( 'views', './views' )
app.set( 'view engine', 'ejs' )

app.use( bodyParser.urlencoded( { extended: false } ) )
app.use( bodyParser.json() )


// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint( 'ams3.digitaloceanspaces.com' )
const s3 = new aws.S3( {
	endpoint: spacesEndpoint
} )

// Set up the config for aws.
aws.config.update({
	region: 'ams3',
	accessKeyId: ENV.NODE_ENV.AWS_ACCESS_KEY_ID,
	secretAccessKey: ENV.NODE_ENV.AWS_SECRET_ACCESS_KEY,
	endpoint: spacesEndpoint,
	credentials: new aws.SharedIniFileCredentials,
})

// Set up the S3 upload with multer.
const upload = multer( {
	storage: multerS3( {
		s3: s3,
		bucket: 'scheepvaart-museum',
		acl: 'public-read',
		key: function ( request, file, cb ) {
			console.log( file )
			cb( null, file.originalname )
		}
	} )
} ).array( 'upload', 1 )

//Post the upload input file
app.post( '/upload', ( request, response, next ) => {
	console.log( 'trying to upload' )
	upload( request, response, ( error ) => {
		if ( error ) {
			console.log( error )
			return response.send( 'error' )
		}
		console.log( 'File uploaded successfully.' )
		response.send( 'success' )
	} )
} )

app.use( '/', indexRoute )

app.get( '*', ( req, res ) => {

	res.render( '404' )

} )

app.listen( PORT, err => {

	console.log( `Hello from http://localhost:${ PORT }` )

} )