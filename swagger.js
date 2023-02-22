const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_autogen.json';
const endpointsFiles = ['./server/index.tsx']

swaggerAutogen(outputFile, endpointsFiles)