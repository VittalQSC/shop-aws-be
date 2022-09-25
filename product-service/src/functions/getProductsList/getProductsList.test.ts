"use strict";

import { productsListStorage } from "~/storage";
import { mockedProductsList } from "~/mocks/productListData";

import * as getProductsList from "./getProductsList";

describe("#getProductsList", () => {
  beforeAll(() => {
    jest.spyOn(productsListStorage, "findMany");
  });

  it("should return 500 response when something went wrong", async () => {
    jest
      .mocked(productsListStorage.findMany)
      .mockImplementation(() => Promise.reject());

    const result = await getProductsList.handler();

    expect(result.statusCode).toBe(500);
  });

  it("should return 200 response when succeeds", async () => {
    jest
      .mocked(productsListStorage.findMany)
      .mockImplementation(() => Promise.resolve(mockedProductsList));

    const result = await getProductsList.handler();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockedProductsList);
  });
});
