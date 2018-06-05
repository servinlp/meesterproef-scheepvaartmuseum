const aws = 	require( 'aws-sdk' ),
	multer = 	require( 'multer' ),
	multerS3 = 	require( 'multer-s3' ),
	ENV = 		require( 'dotenv' ).config().parsed


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
			console.log( 'file', file )
			// uploadToDB(request)
			cb( null, file.originalname )
		}
	} )
} )

module.exports = upload