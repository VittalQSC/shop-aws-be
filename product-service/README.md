endpoints:
  POST - https://z7d95oanc0.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://z7d95oanc0.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://z7d95oanc0.execute-api.eu-west-1.amazonaws.com/dev/products/{id}
  GET - https://z7d95oanc0.execute-api.eu-west-1.amazonaws.com/dev/swagger
  GET - https://z7d95oanc0.execute-api.eu-west-1.amazonaws.com/dev/swagger.json
functions:
  getProductsList: product-service-dev-getProductsList
  getProductById: product-service-dev-getProductById
  swaggerUI: product-service-dev-swagger-ui
  swaggerJSON: product-service-dev-swagger-json