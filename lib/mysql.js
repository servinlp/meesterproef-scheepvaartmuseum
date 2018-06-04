const mysql = 	require( 'promise-mysql' ),
	ENV =		require( 'dotenv' ).config().parsed,
	pool = 		mysql.createPool( {
		connectionLimit : 1000,
		connectTimeout  : 30000,
		aquireTimeout   : 30000,
		timeout         : 30000,
		debug: true,
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
	*/
	function uploadToData() {
		pool.query('INSERT INTO * from users')
		.then( res => {
			console.log(res);
		})
		.catch(function(err) {
			console.log(err);
		})
	
	}

module.exports = pool