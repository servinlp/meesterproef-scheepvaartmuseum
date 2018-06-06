const mysql = 	require( 'promise-mysql' ),
	ENV =		require( 'dotenv' ).config().parsed,
	multer =	require('multer'),
	pool = 		mysql.createPool( {
		host: ENV.MYSQL_HOST,
		user: ENV.MYSQL_USER,
		password: ENV.MYSQL_PASSWORD,
		database: ENV.MYSQL_DATABASE,
		port: ENV.MYSQL_PORT,
	} )

	/* Per story:
	*  	id
		title
		storyText (opt.)
		files (opt.)
		email (opt.)
		phone (opt.)
		tags(array)
		userID(future)
		reports
		location
		storyTime
	*/
module.exports = pool