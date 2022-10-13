"use strict";

import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { productsListStorage } from "~/storage";
import envelop from "~/utils/envelop";

export async function handler(event: APIGatewayProxyEvent) {
  try {
    if (!event.pathParameters?.id) {
      return envelop("product id was not provided", 400);
    }

    const product = await productsListStorage.findById(event.pathParameters.id);

    if (!product) {
      return envelop("product with provided id is not found", 404);
    }

    return envelop(JSON.stringify(product));
  } catch (error) {
    return envelop(`something went wrong: ${error}`, 500);
  }
}
