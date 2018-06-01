const mysql = 	require( 'promise-mysql' ),
	ENV =		require( 'dotenv' ).config().parsed,
	pool = 		mysql.createPool( {
		host: ENV.NODE_ENV.MYSQL_HOST,
		user: ENV.NODE_ENV.MYSQL_USER,
		password: ENV.NODE_ENV.MYSQL_PASSWORD,
		database: ENV.NODE_ENV.MYSQL_DATABASE,
		port: ENV.NODE_ENV.MYSQL_PORT
	} )

module.exports = pool