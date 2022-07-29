module.exports = {
  "development": {
    "username": process.env.DEV_DB_USERNAME,
    "password": process.env.DEV_DB_PASSWORD,
    "database": process.env.DEV_DB_DATABASE,
    "host": process.env.DEV_DB_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.TEST_DB_USERNAME,
    "password": process.env.TEST_DB_PASSWORD,
    "database": process.env.TEST_DB_DATABASE,
    "host": process.env.TEST_DB_HOST,
    "dialect": "postgres",
    "logging": false
  },
  "staging": {
    "username": process.env.STAGING_DB_USERNAME,
    "password": process.env.STAGING_DB_PASSWORD,
    "database": process.env.STAGING_DB_DATABASE,
    "host": process.env.STAGING_DB_HOST,
    "dialect": "postgres",
    "dialectOptions" : {
      "ssl" : {
        "require" : true,
        "rejectUnauthorized" : false
      }
    }
  },
  "production": {
    "username": process.env.PROD_DB_USERNAME,
    "password": process.env.PROD_DB_PASSWORD,
    "database": process.env.PROD_DB_DATABASE,
    "host": process.env.PROD_HOST,
    "dialect": "postgres",
    "dialectOptions" : {
      "ssl" : {
        "require" : true,
        "rejectUnauthorized" : false
      }
    }
  }
}
