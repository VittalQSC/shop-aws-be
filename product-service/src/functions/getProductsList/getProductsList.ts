"use strict";

import { productsListStorage } from "~/storage";
import envelop from "~/utils/envelop";

export async function handler() {
  console.log("GET", "getProductsList.handler");
  try {
    const productsList = await productsListStorage.findMany();
    return envelop(JSON.stringify(productsList));
  } catch (error) {
    return envelop(`something went wrong: ${error}`, 500);
  }
}
