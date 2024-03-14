const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  swaggerDefinition: {
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    basePath: '/',
  },
  apis: ['./routes/*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = specs
