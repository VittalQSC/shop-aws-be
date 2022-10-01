endpoints:
  GET - https://bja77na87a.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://bja77na87a.execute-api.eu-west-1.amazonaws.com/dev/products/{id}
  GET - https://bja77na87a.execute-api.eu-west-1.amazonaws.com/dev/swagger
  GET - https://bja77na87a.execute-api.eu-west-1.amazonaws.com/dev/swagger.json
functions:
  getProductsList: product-service-dev-getProductsList
  getProductById: product-service-dev-getProductById
  swaggerUI: product-service-dev-swagger-ui
  swaggerJSON: product-service-dev-swagger-json