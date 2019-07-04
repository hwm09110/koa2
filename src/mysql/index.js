const Client = require("mysql-pro");
const client = new Client({     
    mysql: {
		user: 'bkdx',
		password: '123456',
		database: 'hongtu',
		host: '192.168.8.60',
		port: '3306'
    }
})

// module.exports = client
exports.client = client
