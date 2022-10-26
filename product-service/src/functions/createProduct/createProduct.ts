import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 } from "uuid";
import Joi from "joi";

import { productsListStorage } from "~/storage";
import envelop from "~/utils/envelop";

const bodySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  count: Joi.number().required(),
});

export async function handler(event: APIGatewayProxyEvent) {
  console.log("POST", "createProduct.handler", `body: ${event.body}`);
  try {
    const { value: body, error } = bodySchema.validate(
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
