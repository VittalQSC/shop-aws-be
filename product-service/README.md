endpoints:
  POST - https://l004zk6fh0.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://l004zk6fh0.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://l004zk6fh0.execute-api.eu-west-1.amazonaws.com/dev/products/{id}
  GET - https://l004zk6fh0.execute-api.eu-west-1.amazonaws.com/dev/swagger
  GET - https://l004zk6fh0.execute-api.eu-west-1.amazonaws.com/dev/swagger.json
functions:
  createProduct: product-service-dev-createProduct
  getProductsList: product-service-dev-getProductsList
  getProductById: product-service-dev-getProductById
  swaggerUI: product-service-dev-swagger-ui
  swaggerJSON: product-service-dev-swagger-json