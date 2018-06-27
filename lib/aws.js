const aws = 	require( 'aws-sdk' ),
	multer = 	require( 'multer' ),
	multerS3Transform = 	require( 'multer-s3-transform' ),
	ENV = 		require( 'dotenv' ).config().parsed,
	uuidv4 = require('uuid/v4'),
	sharp = require('sharp')


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

/**
 * Seperate the name from the extention
 * @param {String} name - The name of the file
 * @returns {Object} - Name and extention
 */
function separateImageExtension( name ) {
	const seperated = [ name.substring( 0, name.lastIndexOf( '.' ) ), name.substring( name.lastIndexOf( '.' ) + 1 ) ]
	return { name: seperated[ 0 ], extension: seperated[ 1 ] }
}

const maxSize = 1 * 1000 * 5
// Set up the S3 upload with multer.
const upload = multer( {
	storage: multerS3Transform( {
		s3: s3,
		bucket: 'scheepvaart-museum',
		acl: 'public-read',
		shouldTransform: function (req, file, cb) {
			console.log( 'shouldtransform', /^image/i.test(file.mimetype) )
			cb(null, /^image/i.test(file.mimetype))
		},
		transforms: [{
			id: 'original',
			transform: function (req, file, cb) {
				console.log( file )
				if(/^image/i.test(file.mimetype)){
					cb(null, sharp(file).resize(600).jpg())
				}
				console.log( file )
			},
			key: function ( request, file, cb ) {
				console.log( 'file', file )
				console.log(file.originalname);
				cb( null, `${uuidv4()}.${separateImageExtension(file.originalname).extension}` )
				console.log( 'key', file, `${uuidv4()}.${separateImageExtension(file.originalname).extension}` )
			}
		}]
	})
} )

module.exports = upload