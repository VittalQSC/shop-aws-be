"use strict";

import { SQSEvent } from "aws-lambda/trigger/sqs";
import { v4 } from "uuid";

import { productsListStorage } from "~/storage";
import { productSchema } from "~/shared/schemas/product-schema";

import publishProducts from "./publishProducts";

export async function handler(event: SQSEvent) {
  try {
    const products = event.Records.map(({ body }) =>
      JSON.parse(`${body}`)
    ).filter((product) => {
      const { error } = productSchema.validate(product);
      if (error) {
        console.log(`passed product ${product} is invalid: `, error);
      }
      return !error;
    });

    console.log(products);
    if (products.length === 0) {
      console.log("there is no valid products");
      return;
    }

    for (const product of products) {
      await productsListStorage.create({ id: v4(), ...product });
    }

    console.log("products created", JSON.stringify(products));

    try {
      const result = await publishProducts(products);
      console.log("topic published", result);
    } catch (error) {
      console.log("topic published with ERROR: ", error);
    }
  } catch (error) {
    console.log(`something went wrong: ${error}`);
  }
}
