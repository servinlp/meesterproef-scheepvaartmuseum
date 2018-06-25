const bcrypt = require('bcryptjs')

function hashPassword ( password ) {
	bcrypt.genSalt(10, ( err, salt ) => {
		bcrypt.hash(password, salt, ( err, hash ) => {
			if (err) throw err
			return hash
		})
	})
}

module.exports = hashPassword