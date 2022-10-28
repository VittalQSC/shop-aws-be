import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda/trigger/api-gateway-proxy";

export type ImportProductsQueryParamsType =
  APIGatewayProxyEventQueryStringParameters & { name: string };
