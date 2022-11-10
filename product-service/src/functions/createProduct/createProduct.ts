import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 } from "uuid";

import { productsListStorage } from "~/storage";
import { productSchema } from "~/shared/schemas/product-schema";
import envelop from "~/utils/envelop";

export async function handler(event: APIGatewayProxyEvent) {
  console.log("POST", "createProduct.handler", `body: ${event.body}`);
  try {
    const { value: body, error } = productSchema.validate(
      JSON.parse(`${event.body}`)
    );
    if (error) {
      return envelop(`passed body is wrong: ${JSON.stringify(error)}`, 400);
    }
    const product = { id: v4(), ...body };
    await productsListStorage.create(product);
    return envelop(`product was created:
    ${event.body}`);
  } catch (error) {
    return envelop(`something went wrong: ${error}`, 500);
  }
}
